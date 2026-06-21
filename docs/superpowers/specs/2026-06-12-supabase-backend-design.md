# iGym — Supabase Backend & Admin Panel Design

**Date:** 2026-06-12  
**Status:** Approved  
**Replaces:** Sanity CMS (not yet connected to components — safe to remove)  
**Scope:** Full Supabase backend, custom admin panel, public frontend wiring, SEO

---

## 1. Overview

Replace the unused Sanity CMS with a full Supabase backend. Build a custom `/admin` panel inside the existing Next.js app with email/password login, role-based access, and CRUD for all content types. Wire all public pages to fetch from Supabase instead of static mock files.

**Stack additions:**
- `@supabase/supabase-js` — Supabase JS client
- `@supabase/ssr` — server-side session handling (httpOnly cookies)
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/html` — rich text editor + server-side HTML render

**Stack removals:**
- `sanity`, `next-sanity`, `@sanity/vision`, `@portabletext/react` — entire Sanity dependency tree
- `lib/sanity/` folder — client, queries, types
- `lib/trainers-data.ts`, `lib/journal-data.ts` — static mock data
- `sanity/` folder — schemas, config
- `sanity.config.ts`
- `app/studio/` route

---

## 2. Database Schema

All tables live in the Supabase Postgres instance. UUIDs are auto-generated via `gen_random_uuid()`.

### 2.1 `admin_users`

Extends Supabase's built-in `auth.users` table. Created automatically when an admin account is created via the Supabase Auth API.

```sql
create table admin_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null check (role in ('admin', 'editor')),
  display_name text not null,
  created_at   timestamptz default now()
);
```

### 2.2 `trainers`

```sql
create table trainers (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  role              text not null,
  specialty_eyebrow text not null,
  image_url         text,
  specialties       text[] not null default '{}',
  certifications    text[] not null default '{}',
  bio               text[] not null default '{}',
  availability      jsonb not null default '[]',
  instagram         text,
  display_order     integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
```

`availability` JSONB shape:
```json
[{ "day": "Mon, Wed, Fri", "hours": "6:00 AM – 11:00 AM" }]
```

### 2.3 `transformations`

Child of `trainers`. Cascade-deleted when trainer is deleted.

```sql
create table transformations (
  id               uuid primary key default gen_random_uuid(),
  trainer_id       uuid not null references trainers(id) on delete cascade,
  client_name      text not null,
  duration         text not null,
  goal             text not null,
  goal_type        text not null check (goal_type in (
                     'weight_loss', 'muscle_gain',
                     'athletic_performance', 'post_rehab'
                   )),
  before_image_url text,
  after_image_url  text,
  testimonial      text check (char_length(testimonial) <= 250),
  display_order    integer not null default 0,
  created_at       timestamptz default now()
);
```

### 2.4 `journal_posts`

```sql
create table journal_posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  category          text not null check (category in (
                      'Training', 'Nutrition', 'Mindset', 'Recovery'
                    )),
  excerpt           text check (char_length(excerpt) <= 160),
  cover_image_url   text,
  author_name       text not null,
  author_avatar_url text,
  body              jsonb not null default '{}',
  read_time_minutes integer not null default 1,
  is_published      boolean not null default false,
  published_at      timestamptz,
  meta_title        text check (char_length(meta_title) <= 60),
  meta_description  text check (char_length(meta_description) <= 160),
  og_image_url      text,
  canonical_url     text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
```

`body` stores TipTap document JSON. Rendered to HTML server-side via `@tiptap/html` for public pages.

### 2.5 `cafe_menu_items`

```sql
create table cafe_menu_items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in (
                  'Pre-Workout', 'Post-Workout', 'Meals', 'Juices', 'Shakes'
                )),
  description   text,
  price         numeric(10,2) not null,
  image_url     text,
  protein_g     numeric(6,1),
  carbs_g       numeric(6,1),
  fat_g         numeric(6,1),
  calories      numeric(6,1),
  is_available  boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

Calories default suggestion: `(protein_g * 4) + (carbs_g * 4) + (fat_g * 9)` — calculated client-side in the form, editable override allowed.

---

## 3. Supabase Storage Buckets

| Bucket | Contents | Public |
|--------|----------|--------|
| `trainer-images` | Trainer portrait photos | Yes |
| `transformation-images` | Before/after photos | Yes |
| `article-images` | Journal cover images + inline article images | Yes |
| `cafe-images` | Café menu item photos | Yes |
| `avatars` | Author avatar photos | Yes |

All buckets are public (read) — images are served directly via Supabase CDN URLs. Uploads are authenticated (only logged-in admins can write).

File type restriction: `image/jpeg`, `image/png`, `image/webp`. Max size: 5MB per upload.

---

## 4. Auth & Role-Based Access

### 4.1 Authentication

- Supabase Auth with email + password
- Sessions managed via `@supabase/ssr` — stored in httpOnly cookies, not localStorage
- `middleware.ts` at the Next.js root intercepts all `/admin/*` requests, validates the session server-side, and redirects unauthenticated users to `/admin/login`
- "Forgot password" flow handled by Supabase (sends reset email automatically)

### 4.2 Role Permissions

| Capability | admin | editor |
|---|---|---|
| Write / edit journal articles | ✓ | ✓ |
| Publish / unpublish articles | ✓ | ✓ |
| Delete articles | ✓ | ✓ |
| Edit trainer profiles | ✓ | ✓ |
| Add / delete transformations | ✓ | ✓ |
| Edit café menu items | ✓ | ✓ |
| Delete any content | ✓ | ✓ |
| Upload images | ✓ | ✓ |
| Manage admin users (invite, change roles) | ✓ | ✗ |
| Change own email / password / display name | ✓ | ✗ |

### 4.3 Enforcement — Two Layers

**Layer 1 — Supabase RLS (Row Level Security):**
- All tables have RLS enabled
- Read policies: public can read `trainers` (is_active=true), published `journal_posts`, available `cafe_menu_items`, all `transformations`
- Write policies: only authenticated users with a matching `admin_users` row can insert/update/delete
- User management policy: only `role = 'admin'` can insert/update `admin_users`

**Layer 2 — Next.js middleware + server actions:**
- Role fetched from `admin_users` on every protected request
- UI hides restricted actions based on role
- Server actions re-verify role before mutating — UI guards alone are not sufficient

### 4.4 Admin User Management (Settings page — admin only)

- List all users in `admin_users`
- Invite new user: creates Supabase auth account via admin API, inserts row into `admin_users` with chosen role, sends invite email
- Change role: updates `admin_users.role`
- Remove user: deletes from `auth.users` (cascades to `admin_users`)

---

## 5. Admin Panel

### 5.1 URL Structure

```
/admin                         → redirect to /admin/dashboard
/admin/login                   → login page (public)
/admin/dashboard               → overview stats + quick links
/admin/journal                 → article list (draft/published badges, search)
/admin/journal/new             → new article (TipTap + SEO tab)
/admin/journal/[id]/edit       → edit article
/admin/trainers                → trainer list (drag to reorder display_order)
/admin/trainers/new            → add trainer
/admin/trainers/[id]/edit      → edit trainer + manage transformations inline
/admin/cafe                    → menu item list (drag to reorder)
/admin/cafe/new                → add menu item
/admin/cafe/[id]/edit          → edit menu item
/admin/settings                → admin-only: user management
/admin/settings/profile        → admin-only: change email / password / display name
```

### 5.2 Layout

- Persistent left sidebar: iGym logo, nav links, logged-in user's display name + role badge, logout button
- Editors: "Settings" link hidden entirely from sidebar
- Breadcrumb header on each page
- All list pages have a search/filter bar

### 5.3 Dashboard

- Stat cards: Published Articles, Draft Articles, Active Trainers, Café Items
- Quick-action buttons: "New Article", "Edit Trainers", "Manage Menu"
- No analytics — operational overview only

### 5.4 Journal Article Editor

**Content tab:**
- Title (text input)
- Slug (auto-generated from title via kebab-case, manually editable)
- Category (dropdown)
- Excerpt (textarea, 160-char counter)
- Cover image (drag-and-drop → Supabase Storage upload, preview shown)
- Author name (text input)
- Author avatar (image upload)
- Body (TipTap editor — H2/H3, bold, italic, blockquote, bullet list, numbered list, inline image upload, horizontal rule)

**SEO tab:**
- Meta title (text, 60-char counter, defaults to article title)
- Meta description (textarea, 160-char counter, defaults to excerpt)
- OG image (upload, defaults to cover image if empty)
- Canonical URL (text, defaults to `https://igym.in/journal/[slug]`)

**Behaviour:**
- Auto-save draft every 30 seconds
- Read time auto-calculated on save: `ceil(word_count / 200)` minutes
- "Save Draft" button → `is_published = false`
- "Publish" button → `is_published = true`, stamps `published_at` if first publish
- "Unpublish" button visible when article is published

### 5.5 Trainer Editor

Fields: Name, Slug, Role, Specialty Eyebrow, Portrait (upload), Specialties (tag input), Certifications (tag input), Bio paragraph 1, Bio paragraph 2, Availability rows (Day + Hours, add/remove), Instagram handle, Display Order, Active toggle.

**Transformations sub-section** (on same page, below trainer fields):
- List of transformation cards with client name + goal shown
- "Add Transformation" button opens inline form
- Each card has Edit and Delete buttons
- Fields: Client Name, Duration, Goal, Goal Type (dropdown), Before Image, After Image, Testimonial (250-char limit), Display Order

### 5.6 Café Menu Editor

Fields: Name, Category (dropdown), Description, Price (₹, number), Image (upload), Protein (g), Carbs (g), Fat (g), Calories (auto-suggested from macros, editable), Available toggle, Display Order.

---

## 6. Public Frontend Changes

### 6.1 Files Removed

```
lib/trainers-data.ts
lib/journal-data.ts
lib/sanity/client.ts
lib/sanity/queries.ts
lib/sanity/types.ts
sanity/ (entire folder)
sanity.config.ts
app/studio/ (entire folder)
```

### 6.2 New Files Added

```
lib/supabase/client.ts          — browser Supabase client (for client components)
lib/supabase/server.ts          — server Supabase client (for server components / actions)
lib/supabase/types.ts           — generated TypeScript types from DB schema
middleware.ts                   — session validation, /admin/* protection
```

### 6.3 Public Page Data Flow

| Page | Data source | Rendering |
|---|---|---|
| `/trainers` | `trainers` table (is_active=true, ordered by display_order) | Server component, ISR 1hr |
| `/trainers/[slug]` | `trainers` + `transformations` | Static (generateStaticParams) |
| `/journal` | `journal_posts` (is_published=true, ordered by published_at desc) | Server component, ISR 1hr |
| `/journal/[slug]` | `journal_posts` single row | Static (generateStaticParams) |
| `/cafe` | `cafe_menu_items` (is_available=true, ordered by display_order) | Server component, ISR 1hr |
| Homepage previews | Same queries, limited to 3 rows each | Server component, ISR 1hr |

On-demand revalidation: each admin save/publish calls `revalidatePath()` for the affected public route so the static cache updates immediately without waiting for ISR interval.

---

## 7. SEO Implementation

### 7.1 Journal Article Pages (`/journal/[slug]`)

`generateMetadata()` export in `app/journal/[slug]/page.tsx`:
```ts
{
  title: meta_title || title,
  description: meta_description || excerpt,
  alternates: { canonical: canonical_url || 'https://igym.in/journal/[slug]' },
  openGraph: {
    title, description, images: [og_image_url || cover_image_url],
    type: 'article', publishedTime: published_at, authors: [author_name]
  }
}
```

Schema.org `Article` JSON-LD injected via `<script type="application/ld+json">` in the page:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "dateModified": "...",
  "image": "...",
  "publisher": { "@type": "Organization", "name": "iGym", "logo": "..." }
}
```

### 7.2 Trainer Pages (`/trainers/[slug]`)

`generateMetadata()` with trainer name, role as description, portrait as OG image.

Schema.org `Person` JSON-LD with name, job title, and employer.

### 7.3 Sitemap

`app/sitemap.ts` auto-generates XML sitemap including:
- Static pages: `/`, `/trainers`, `/journal`, `/cafe`, `/membership`, `/transformations`
- Dynamic: all published article slugs + all active trainer slugs
- Rebuilt on every deployment and on-demand revalidation

### 7.4 Robots

`app/robots.ts` disallows `/admin/*` entirely. All public routes allowed.

---

## 8. Phased Build Plan

| Phase | Scope | End state |
|---|---|---|
| **Phase 1 — Foundation** | Supabase project + schema SQL, Storage buckets, Auth setup, `lib/supabase/`, `middleware.ts`, `/admin/login`, admin layout + sidebar, dashboard page | Admin can log in and see dashboard |
| **Phase 2 — Trainer & Café** | Trainer list/create/edit, transformation inline management, image upload component, café menu list/create/edit | Trainers and café fully manageable |
| **Phase 3 — Journal** | TipTap editor integration, article list/create/edit, SEO tab, publish/unpublish flow, public `/journal` and `/journal/[slug]` wired to Supabase | Blog live from DB with full SEO |
| **Phase 4 — Full wiring & cleanup** | Public `/trainers`, `/trainers/[slug]`, `/cafe`, homepage preview sections wired to Supabase; remove Sanity + static files; sitemap + robots; on-demand revalidation; schema.org JSON-LD | Entire site running from Supabase, Sanity fully removed |

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server-only, never exposed to client

# Existing
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

`SUPABASE_SERVICE_ROLE_KEY` is used only in server actions for admin operations (user management, invite). Never referenced in client components.

---

## 10. Out of Scope

- Member-facing accounts or login (public site remains fully public)
- Booking / payment / scheduling systems
- Analytics dashboard in admin panel
- Email marketing or CRM integration
- Multi-language / i18n
