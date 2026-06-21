# iGym Supabase Backend & Admin Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Sanity CMS with a full Supabase backend and build a custom `/admin` panel with role-based access for trainer profiles, journal articles (TipTap + full SEO), and café menu management.

**Architecture:** Next.js App Router server components fetch all public content from Supabase Postgres. A protected `/admin/*` section (guarded by `middleware.ts`) provides CRUD via server actions. Two roles: `admin` (full access) and `editor` (content only, cannot manage users or change own credentials).

**Tech Stack:** Next.js 16 (App Router), Supabase (Postgres + Auth + Storage), `@supabase/ssr` (httpOnly cookie sessions), TipTap (rich text editor + server-side HTML), Vitest (utility unit tests), Tailwind CSS v4, Lucide React (admin icons)

---

## File Map

### New files created across all phases

```
supabase/
  schema.sql                          — full SQL for tables, RLS, triggers, indexes

lib/
  supabase/
    types.ts                          — TypeScript interfaces for all DB tables
    client.ts                         — browser Supabase client (client components)
    server.ts                         — server Supabase client (server components/actions)
  utils/
    slugify.ts
    readTime.ts
    calories.ts
    __tests__/
      slugify.test.ts
      readTime.test.ts
      calories.test.ts

middleware.ts                         — /admin/* session guard

app/
  admin/
    layout.tsx                        — admin shell: sidebar + main, handles unauthed state
    login/
      page.tsx                        — login form (public, no sidebar)
    dashboard/
      page.tsx                        — stat cards + quick links
    actions/
      auth.ts                         — login / logout server actions
      trainers.ts                     — trainer CRUD server actions
      transformations.ts              — transformation CRUD server actions
      cafe.ts                         — café menu CRUD server actions
      journal.ts                      — journal article CRUD server actions
      users.ts                        — admin user management server actions
    trainers/
      page.tsx                        — trainer list
      new/page.tsx                    — create trainer
      [id]/edit/page.tsx              — edit trainer + transformations
    cafe/
      page.tsx                        — café item list
      new/page.tsx                    — create café item
      [id]/edit/page.tsx              — edit café item
    journal/
      page.tsx                        — article list
      new/page.tsx                    — create article
      [id]/edit/page.tsx              — edit article
    settings/
      page.tsx                        — user management (admin only)
      profile/
        page.tsx                      — change email/password/display name (admin only)
  sitemap.ts                          — auto-generated XML sitemap
  robots.ts                           — robots.txt

components/
  admin/
    Sidebar.tsx                       — persistent left sidebar
    ImageUpload.tsx                   — drag-and-drop image upload to Supabase Storage
    TagInput.tsx                      — chip-style tag input (specialties, certifications)
    AvailabilityEditor.tsx            — repeating day+hours rows
    TrainerForm.tsx                   — shared trainer form fields
    TransformationSection.tsx         — inline transformation management
    CafeItemForm.tsx                  — shared café item form fields
    TipTapEditor.tsx                  — rich text editor wrapper
    ArticleForm.tsx                   — article editor + SEO tab

vitest.config.ts                      — Vitest config for unit tests
```

### Files modified across all phases

```
components/layout/SiteLayout.tsx      — add /admin bypass (Phase 1)
app/layout.tsx                        — remove font vars from body (no change needed, already correct)
app/journal/[slug]/page.tsx           — wire to Supabase + TipTap HTML render + full SEO (Phase 3)
app/journal/page.tsx                  — wire to Supabase (Phase 3)
app/trainers/page.tsx                 — wire to Supabase (Phase 4)
app/trainers/[slug]/page.tsx          — wire to Supabase + SEO (Phase 4)
app/cafe/page.tsx                     — wire to Supabase (Phase 4)
app/page.tsx                          — wire homepage preview sections to Supabase (Phase 4)
globals.css                           — add .article-body prose styles (Phase 3)
package.json                          — add/remove dependencies
```

### Files deleted (Phase 4)

```
lib/trainers-data.ts
lib/journal-data.ts
lib/sanity/ (entire folder)
sanity/ (entire folder)
sanity.config.ts
app/studio/ (entire folder)
```

---

## Phase 1 — Foundation

**End state:** Supabase project configured, DB schema live, admin can log in at `/admin/login` and reach the dashboard with a sidebar.

---

### Task 1: Install dependencies + environment setup

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Create: `vitest.config.ts`

- [ ] **Step 1: Create a Supabase project**

  Go to https://supabase.com → New project → note the **Project URL** and **anon public key** from Project Settings → API.

- [ ] **Step 2: Install Supabase packages**

  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```

  Expected output: added 2 packages

- [ ] **Step 3: Install TipTap packages**

  ```bash
  npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/html
  ```

  Expected output: added 5 packages

- [ ] **Step 4: Install Vitest for unit tests**

  ```bash
  npm install -D vitest @vitejs/plugin-react jsdom
  ```

  Expected output: added 3 dev packages

- [ ] **Step 5: Add test scripts to package.json**

  Open `package.json`. In the `"scripts"` object, add:

  ```json
  "test": "vitest run",
  "test:watch": "vitest"
  ```

- [ ] **Step 6: Create vitest.config.ts**

  Create `vitest.config.ts` at the project root:

  ```typescript
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  import path from 'path'

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
  })
  ```

- [ ] **Step 7: Create .env.local**

  Create `.env.local` at the project root:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
  NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
  ```

  Replace values with your actual Supabase project credentials. `SUPABASE_SERVICE_ROLE_KEY` is under Project Settings → API → Service Role (secret).

- [ ] **Step 8: Verify .env.local is in .gitignore**

  Run:
  ```bash
  cat .gitignore | grep env
  ```
  Expected: `.env.local` appears. If not, add it.

- [ ] **Step 9: Commit**

  ```bash
  git add package.json package-lock.json vitest.config.ts
  git commit -m "feat: add Supabase, TipTap, and Vitest dependencies"
  ```

---

### Task 2: Fix SiteLayout — bypass /admin routes

**Files:**
- Modify: `components/layout/SiteLayout.tsx`

`SiteLayout` currently wraps all routes including `/admin/*`. It already bypasses `/studio`. Add the same bypass for `/admin`.

- [ ] **Step 1: Edit SiteLayout.tsx**

  Open `components/layout/SiteLayout.tsx`. Find line 20:
  ```tsx
  const isStudio = pathname.startsWith('/studio');
  ```

  Replace with:
  ```tsx
  const isStudio = pathname.startsWith('/studio');
  const isAdmin = pathname.startsWith('/admin');

  if (isStudio || isAdmin) {
    return <>{children}</>;
  }
  ```

  Also remove the existing `if (isStudio)` block further down (since we now handle it above). The full updated file:

  ```tsx
  'use client';

  import React from 'react';
  import { usePathname } from 'next/navigation';
  import { ReactLenis } from '@studio-freight/react-lenis';
  import Navbar from './Navbar';
  import Footer from './Footer';
  import CustomCursor from './CustomCursor';
  import WhatsAppFAB from './WhatsAppFAB';
  import PageLoader from './PageLoader';

  interface SiteLayoutProps {
    children: React.ReactNode;
  }

  export default function SiteLayout({ children }: SiteLayoutProps) {
    const pathname = usePathname();
    const isStudio = pathname.startsWith('/studio');
    const isAdmin = pathname.startsWith('/admin');

    if (isStudio || isAdmin) {
      return <>{children}</>;
    }

    return (
      <ReactLenis root options={{ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
        <PageLoader />
        <CustomCursor />
        <Navbar />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
        <Footer />
        <WhatsAppFAB />
      </ReactLenis>
    );
  }
  ```

- [ ] **Step 2: Verify the public site still renders**

  ```bash
  npm run dev
  ```

  Open http://localhost:3000 — navbar and footer should still appear. Open http://localhost:3000/admin/login — should show a blank white page (no navbar/footer). Confirm both.

- [ ] **Step 3: Commit**

  ```bash
  git add components/layout/SiteLayout.tsx
  git commit -m "feat: bypass SiteLayout for /admin routes"
  ```

---

### Task 3: SQL schema

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create supabase/schema.sql**

  Create the folder `supabase/` at the project root. Create `supabase/schema.sql`:

  ```sql
  -- ─────────────────────────────────────────────────────────────
  -- updated_at auto-trigger (reused by all tables)
  -- ─────────────────────────────────────────────────────────────
  create or replace function update_updated_at()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language plpgsql;

  -- ─────────────────────────────────────────────────────────────
  -- admin_users
  -- ─────────────────────────────────────────────────────────────
  create table admin_users (
    id           uuid primary key references auth.users(id) on delete cascade,
    role         text not null check (role in ('admin', 'editor')),
    display_name text not null,
    created_at   timestamptz default now()
  );

  alter table admin_users enable row level security;

  create policy "Users can read own profile"
    on admin_users for select
    using (id = auth.uid());

  -- ─────────────────────────────────────────────────────────────
  -- trainers
  -- ─────────────────────────────────────────────────────────────
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

  create index trainers_slug_idx on trainers(slug);
  create index trainers_active_order_idx on trainers(is_active, display_order);

  create trigger trainers_updated_at
    before update on trainers
    for each row execute function update_updated_at();

  alter table trainers enable row level security;

  create policy "Public can read active trainers"
    on trainers for select
    using (is_active = true);

  create policy "Authenticated users can write trainers"
    on trainers for all
    using (auth.uid() in (select id from admin_users))
    with check (auth.uid() in (select id from admin_users));

  -- ─────────────────────────────────────────────────────────────
  -- transformations
  -- ─────────────────────────────────────────────────────────────
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

  create index transformations_trainer_idx on transformations(trainer_id, display_order);

  alter table transformations enable row level security;

  create policy "Public can read transformations"
    on transformations for select
    using (true);

  create policy "Authenticated users can write transformations"
    on transformations for all
    using (auth.uid() in (select id from admin_users))
    with check (auth.uid() in (select id from admin_users));

  -- ─────────────────────────────────────────────────────────────
  -- journal_posts
  -- ─────────────────────────────────────────────────────────────
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

  create index journal_posts_slug_idx on journal_posts(slug);
  create index journal_posts_published_idx on journal_posts(is_published, published_at desc);

  create trigger journal_posts_updated_at
    before update on journal_posts
    for each row execute function update_updated_at();

  alter table journal_posts enable row level security;

  create policy "Public can read published posts"
    on journal_posts for select
    using (is_published = true);

  create policy "Authenticated users can write posts"
    on journal_posts for all
    using (auth.uid() in (select id from admin_users))
    with check (auth.uid() in (select id from admin_users));

  -- ─────────────────────────────────────────────────────────────
  -- cafe_menu_items
  -- ─────────────────────────────────────────────────────────────
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

  create index cafe_items_category_order_idx on cafe_menu_items(category, display_order);

  create trigger cafe_menu_items_updated_at
    before update on cafe_menu_items
    for each row execute function update_updated_at();

  alter table cafe_menu_items enable row level security;

  create policy "Public can read available menu items"
    on cafe_menu_items for select
    using (is_available = true);

  create policy "Authenticated users can write menu items"
    on cafe_menu_items for all
    using (auth.uid() in (select id from admin_users))
    with check (auth.uid() in (select id from admin_users));
  ```

- [ ] **Step 2: Run schema in Supabase**

  In the Supabase dashboard → SQL Editor → New query. Paste the entire contents of `supabase/schema.sql` and click **Run**. All statements should succeed with no errors.

- [ ] **Step 3: Create Storage buckets**

  In Supabase dashboard → Storage → New bucket. Create each bucket with **Public bucket** checked:
  - `trainer-images`
  - `transformation-images`
  - `article-images`
  - `cafe-images`
  - `avatars`

- [ ] **Step 4: Create the first admin user**

  In Supabase dashboard → Authentication → Users → **Add user** → Enter your email and password → Create. Note the UUID of the new user.

  Then in SQL Editor, run (replace `<uuid>` and `<your-name>`):

  ```sql
  insert into admin_users (id, role, display_name)
  values ('<uuid-from-auth-users>', 'admin', '<your-name>');
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add supabase/schema.sql
  git commit -m "feat: add Supabase schema with RLS policies and storage buckets"
  ```

---

### Task 4: Supabase client files

**Files:**
- Create: `lib/supabase/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create lib/supabase/types.ts**

  ```typescript
  export type Role = 'admin' | 'editor'

  export interface AdminUser {
    id: string
    role: Role
    display_name: string
    created_at: string
  }

  export interface Trainer {
    id: string
    name: string
    slug: string
    role: string
    specialty_eyebrow: string
    image_url: string | null
    specialties: string[]
    certifications: string[]
    bio: string[]
    availability: Array<{ day: string; hours: string }>
    instagram: string | null
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
  }

  export interface Transformation {
    id: string
    trainer_id: string
    client_name: string
    duration: string
    goal: string
    goal_type: 'weight_loss' | 'muscle_gain' | 'athletic_performance' | 'post_rehab'
    before_image_url: string | null
    after_image_url: string | null
    testimonial: string | null
    display_order: number
    created_at: string
  }

  export interface JournalPost {
    id: string
    title: string
    slug: string
    category: 'Training' | 'Nutrition' | 'Mindset' | 'Recovery'
    excerpt: string | null
    cover_image_url: string | null
    author_name: string
    author_avatar_url: string | null
    body: Record<string, unknown>
    read_time_minutes: number
    is_published: boolean
    published_at: string | null
    meta_title: string | null
    meta_description: string | null
    og_image_url: string | null
    canonical_url: string | null
    created_at: string
    updated_at: string
  }

  export interface CafeMenuItem {
    id: string
    name: string
    category: 'Pre-Workout' | 'Post-Workout' | 'Meals' | 'Juices' | 'Shakes'
    description: string | null
    price: number
    image_url: string | null
    protein_g: number | null
    carbs_g: number | null
    fat_g: number | null
    calories: number | null
    is_available: boolean
    display_order: number
    created_at: string
    updated_at: string
  }
  ```

- [ ] **Step 2: Create lib/supabase/client.ts**

  ```typescript
  import { createBrowserClient } from '@supabase/ssr'

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```

- [ ] **Step 3: Create lib/supabase/server.ts**

  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'

  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server components cannot set cookies — safe to ignore
            }
          },
        },
      }
    )
  }
  ```

- [ ] **Step 4: Create lib/supabase/admin.ts** (service-role client for user management)

  ```typescript
  import { createClient } from '@supabase/supabase-js'

  export function createAdminClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  ```

- [ ] **Step 5: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors on the new files.

- [ ] **Step 6: Commit**

  ```bash
  git add lib/supabase/
  git commit -m "feat: add Supabase client, server, and admin client files"
  ```

---

### Task 5: Utility functions with TDD

**Files:**
- Create: `lib/utils/slugify.ts`
- Create: `lib/utils/readTime.ts`
- Create: `lib/utils/calories.ts`
- Create: `lib/utils/__tests__/slugify.test.ts`
- Create: `lib/utils/__tests__/readTime.test.ts`
- Create: `lib/utils/__tests__/calories.test.ts`

- [ ] **Step 1: Write slugify tests (failing)**

  Create `lib/utils/__tests__/slugify.test.ts`:

  ```typescript
  import { describe, it, expect } from 'vitest'
  import { slugify } from '../slugify'

  describe('slugify', () => {
    it('lowercases and hyphenates words', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })
    it('removes special characters', () => {
      expect(slugify('The Science! Of Hypertrophy@')).toBe('the-science-of-hypertrophy')
    })
    it('trims leading and trailing spaces', () => {
      expect(slugify('  spaces  ')).toBe('spaces')
    })
    it('collapses multiple hyphens', () => {
      expect(slugify('hello---world')).toBe('hello-world')
    })
    it('handles numbers', () => {
      expect(slugify('Top 10 Exercises')).toBe('top-10-exercises')
    })
  })
  ```

- [ ] **Step 2: Run — expect FAIL**

  ```bash
  npm test
  ```

  Expected: `Cannot find module '../slugify'`

- [ ] **Step 3: Implement lib/utils/slugify.ts**

  ```typescript
  export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  ```

- [ ] **Step 4: Run — expect PASS**

  ```bash
  npm test
  ```

  Expected: 5 passing tests for slugify.

- [ ] **Step 5: Write readTime tests (failing)**

  Create `lib/utils/__tests__/readTime.test.ts`:

  ```typescript
  import { describe, it, expect } from 'vitest'
  import { calculateReadTime } from '../readTime'

  function makeBody(wordCount: number) {
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: Array(wordCount).fill('word').join(' ') }],
      }],
    }
  }

  describe('calculateReadTime', () => {
    it('returns 1 for content under 200 words', () => {
      expect(calculateReadTime(makeBody(50))).toBe(1)
    })
    it('returns 1 for exactly 200 words', () => {
      expect(calculateReadTime(makeBody(200))).toBe(1)
    })
    it('returns 2 for 201 words', () => {
      expect(calculateReadTime(makeBody(201))).toBe(2)
    })
    it('returns 1 minimum for empty body', () => {
      expect(calculateReadTime({ type: 'doc', content: [] })).toBe(1)
    })
    it('extracts text from nested nodes', () => {
      const body = {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: Array(100).fill('word').join(' ') }] },
          { type: 'paragraph', content: [{ type: 'text', text: Array(101).fill('word').join(' ') }] },
        ],
      }
      expect(calculateReadTime(body)).toBe(2)
    })
  })
  ```

- [ ] **Step 6: Run — expect FAIL**

  ```bash
  npm test
  ```

  Expected: `Cannot find module '../readTime'`

- [ ] **Step 7: Implement lib/utils/readTime.ts**

  ```typescript
  interface TipTapNode {
    type: string
    text?: string
    content?: TipTapNode[]
  }

  function extractText(node: TipTapNode): string {
    if (node.type === 'text') return node.text ?? ''
    if (node.content) return node.content.map(extractText).join(' ')
    return ''
  }

  export function calculateReadTime(body: Record<string, unknown>): number {
    const text = extractText(body as TipTapNode)
    const wordCount = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }
  ```

- [ ] **Step 8: Run — expect PASS**

  ```bash
  npm test
  ```

  Expected: all readTime tests pass.

- [ ] **Step 9: Write calories tests (failing)**

  Create `lib/utils/__tests__/calories.test.ts`:

  ```typescript
  import { describe, it, expect } from 'vitest'
  import { suggestCalories } from '../calories'

  describe('suggestCalories', () => {
    it('calculates protein*4 + carbs*4 + fat*9', () => {
      expect(suggestCalories(25, 30, 10)).toBe(310)
    })
    it('returns 0 for all zeros', () => {
      expect(suggestCalories(0, 0, 0)).toBe(0)
    })
    it('rounds to nearest integer', () => {
      expect(suggestCalories(1, 1, 1)).toBe(17)
    })
    it('handles decimals', () => {
      expect(suggestCalories(0, 0, 1.5)).toBe(14)
    })
  })
  ```

- [ ] **Step 10: Run — expect FAIL**

  ```bash
  npm test
  ```

  Expected: `Cannot find module '../calories'`

- [ ] **Step 11: Implement lib/utils/calories.ts**

  ```typescript
  export function suggestCalories(proteinG: number, carbsG: number, fatG: number): number {
    return Math.round(proteinG * 4 + carbsG * 4 + fatG * 9)
  }
  ```

- [ ] **Step 12: Run all tests — expect all PASS**

  ```bash
  npm test
  ```

  Expected: 14 passing tests across 3 files. 0 failures.

- [ ] **Step 13: Commit**

  ```bash
  git add lib/utils/
  git commit -m "feat: add slugify, readTime, and calories utils with tests"
  ```

---

### Task 6: middleware.ts

**Files:**
- Create: `middleware.ts` (project root)

- [ ] **Step 1: Create middleware.ts**

  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'

  export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    // Unauthenticated user trying to reach any /admin page except login
    if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Authenticated user landing on login page — send to dashboard
    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return supabaseResponse
  }

  export const config = {
    matcher: ['/admin/:path*'],
  }
  ```

- [ ] **Step 2: Verify redirect behaviour**

  With `npm run dev` running:
  - Visit http://localhost:3000/admin/dashboard — should redirect to http://localhost:3000/admin/login
  - Visit http://localhost:3000/admin/login — should show a blank white page (login form not yet built)

- [ ] **Step 3: Commit**

  ```bash
  git add middleware.ts
  git commit -m "feat: add /admin/* middleware with session-based auth guard"
  ```

---

### Task 7: Admin auth — login page + server actions

**Files:**
- Create: `app/admin/actions/auth.ts`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create app/admin/actions/auth.ts**

  ```typescript
  'use server'

  import { createClient } from '@/lib/supabase/server'
  import { redirect } from 'next/navigation'

  export async function login(_: unknown, formData: FormData) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) return { error: error.message }
    redirect('/admin/dashboard')
  }

  export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }
  ```

- [ ] **Step 2: Create app/admin/login/page.tsx**

  ```tsx
  'use client'

  import { useActionState } from 'react'
  import { login } from '../actions/auth'

  export default function LoginPage() {
    const [state, action, pending] = useActionState(login, undefined)

    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-light tracking-[0.3em] text-white uppercase"
                style={{ fontFamily: 'var(--font-cormorant)' }}>
              IGYM
            </h1>
            <p className="text-[11px] tracking-widest text-zinc-500 uppercase mt-1">
              Admin Panel
            </p>
          </div>

          <form action={action} className="space-y-4 bg-zinc-900 p-8 rounded-lg border border-zinc-800">
            {state?.error && (
              <p className="text-red-400 text-sm text-center">{state.error}</p>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] tracking-widest text-zinc-500 uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder:text-zinc-600"
                placeholder="admin@igym.in"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] tracking-widest text-zinc-500 uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#C9A84C] text-zinc-950 py-3 text-[11px] font-medium rounded tracking-[0.2em] uppercase disabled:opacity-60 hover:bg-[#b8933d] transition-colors mt-2"
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify login page renders**

  Visit http://localhost:3000/admin/login — should show the IGYM admin login form with email/password fields and no navbar/footer.

- [ ] **Step 4: Verify login works**

  Enter the email and password you created in Task 3 Step 4. Submit. You should be redirected to http://localhost:3000/admin/dashboard (which will show a 404 — that's expected, dashboard doesn't exist yet).

- [ ] **Step 5: Commit**

  ```bash
  git add app/admin/
  git commit -m "feat: add admin login page and auth server actions"
  ```

---

### Task 8: Admin shell — layout, sidebar, dashboard

**Files:**
- Create: `components/admin/Sidebar.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create components/admin/Sidebar.tsx**

  ```tsx
  'use client'

  import Link from 'next/link'
  import { usePathname } from 'next/navigation'
  import { logout } from '@/app/admin/actions/auth'
  import {
    LayoutDashboard,
    BookOpen,
    Users,
    UtensilsCrossed,
    Settings,
    LogOut,
  } from 'lucide-react'
  import type { Role } from '@/lib/supabase/types'

  interface SidebarProps {
    role: Role
    displayName: string
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/journal', label: 'Journal', icon: BookOpen },
    { href: '/admin/trainers', label: 'Trainers', icon: Users },
    { href: '/admin/cafe', label: 'Café', icon: UtensilsCrossed },
  ]

  export default function Sidebar({ role, displayName }: SidebarProps) {
    const pathname = usePathname()

    return (
      <aside className="w-60 bg-zinc-950 flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-zinc-800">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-zinc-800">
          <span
            className="text-white text-xl tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            IGYM
          </span>
          <span className="block text-[9px] text-zinc-600 tracking-widest uppercase mt-0.5">
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}

          {role === 'admin' && (
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                pathname.startsWith('/admin/settings')
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Settings size={15} />
              Settings
            </Link>
          )}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm text-zinc-200 truncate">{displayName}</p>
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                {role}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                title="Sign out"
                className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 flex-shrink-0"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    )
  }
  ```

- [ ] **Step 2: Create app/admin/layout.tsx**

  ```tsx
  import { createClient } from '@/lib/supabase/server'
  import { redirect } from 'next/navigation'
  import Sidebar from '@/components/admin/Sidebar'

  export default async function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Login page: no sidebar, just render the form
    if (!user) {
      return <>{children}</>
    }

    // Get admin profile
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, display_name')
      .eq('id', user.id)
      .single()

    // Auth user exists but no admin_users row — sign out and redirect
    if (!adminUser) {
      await supabase.auth.signOut()
      redirect('/admin/login')
    }

    return (
      <div className="flex h-screen overflow-hidden bg-zinc-50">
        <Sidebar role={adminUser.role as 'admin' | 'editor'} displayName={adminUser.display_name} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    )
  }
  ```

- [ ] **Step 3: Create app/admin/dashboard/page.tsx**

  ```tsx
  import Link from 'next/link'
  import { createClient } from '@/lib/supabase/server'
  import { BookOpen, Users, UtensilsCrossed, FileText } from 'lucide-react'

  async function getStats() {
    const supabase = await createClient()
    const [trainers, published, drafts, cafe] = await Promise.all([
      supabase.from('trainers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('journal_posts').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('journal_posts').select('id', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('cafe_menu_items').select('id', { count: 'exact', head: true }).eq('is_available', true),
    ])
    return {
      trainers: trainers.count ?? 0,
      published: published.count ?? 0,
      drafts: drafts.count ?? 0,
      cafe: cafe.count ?? 0,
    }
  }

  export default async function DashboardPage() {
    const stats = await getStats()

    const statCards = [
      { label: 'Published Articles', value: stats.published, icon: BookOpen, href: '/admin/journal' },
      { label: 'Draft Articles', value: stats.drafts, icon: FileText, href: '/admin/journal' },
      { label: 'Active Trainers', value: stats.trainers, icon: Users, href: '/admin/trainers' },
      { label: 'Menu Items', value: stats.cafe, icon: UtensilsCrossed, href: '/admin/cafe' },
    ]

    return (
      <div className="p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-zinc-800 tracking-wide"
              style={{ fontFamily: 'var(--font-cormorant)' }}>
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Overview of your content</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href}
              className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-[#C9A84C]/40 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <Icon size={16} className="text-zinc-400 group-hover:text-[#C9A84C] transition-colors" />
              </div>
              <p className="text-3xl font-light text-zinc-800">{value}</p>
              <p className="text-xs text-zinc-500 mt-1 tracking-wide">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs text-zinc-400 uppercase tracking-widest mb-3">Quick Actions</h2>
          <div className="flex gap-3 flex-wrap">
            <Link href="/admin/journal/new"
              className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors">
              New Article
            </Link>
            <Link href="/admin/trainers"
              className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm rounded tracking-wide hover:bg-zinc-50 transition-colors">
              Edit Trainers
            </Link>
            <Link href="/admin/cafe"
              className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm rounded tracking-wide hover:bg-zinc-50 transition-colors">
              Manage Menu
            </Link>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 4: Add a redirect at /admin root**

  Create `app/admin/page.tsx`:

  ```tsx
  import { redirect } from 'next/navigation'

  export default function AdminRoot() {
    redirect('/admin/dashboard')
  }
  ```

- [ ] **Step 5: Verify the full admin shell**

  With `npm run dev` running:
  - Visit http://localhost:3000/admin/login — login form renders (no navbar)
  - Log in — should redirect to http://localhost:3000/admin/dashboard
  - Dashboard should show 4 stat cards (all 0 since DB is empty) and 3 quick-action buttons
  - Sidebar should show logo, nav links (Dashboard, Journal, Trainers, Café, Settings), and your display name + role at the bottom
  - Clicking "Sign Out" should redirect back to http://localhost:3000/admin/login

- [ ] **Step 6: Commit**

  ```bash
  git add app/admin/ components/admin/Sidebar.tsx
  git commit -m "feat: add admin layout, sidebar, and dashboard page"
  ```

---

**Phase 1 complete.** The admin can log in, see the dashboard, and navigate the sidebar. Phase 2 builds the trainer and café management CRUD.

---

## Phase 2 — Trainer & Café CRUD

**End state:** Admin can create, edit, and delete trainer profiles (including their transformations inline) and café menu items, all with image upload support.

---

### Task 9: Shared admin UI components

**Files:**
- Create: `components/admin/ImageUpload.tsx`
- Create: `components/admin/TagInput.tsx`
- Create: `components/admin/AvailabilityEditor.tsx`
- Create: `components/admin/DeleteButton.tsx`

- [ ] **Step 1: Build `ImageUpload` component**

  Client component. Props: `bucket` (Supabase Storage bucket name), `currentUrl` (existing image URL or null), `onUpload(url)` callback, optional `label`. Behaviour:
  - Shows a click-or-drag-drop zone when no image is set
  - Shows image preview (fixed 128×128 thumbnail) when an image exists
  - On file select/drop: validates type (jpeg/png/webp only) and size (max 5MB), uploads to Supabase Storage using the browser client from `lib/supabase/client.ts`, calls `onUpload` with the resulting public URL
  - Shows an "Uploading…" disabled state while in flight
  - Shows a "Change image" link below the preview to replace

- [ ] **Step 2: Build `TagInput` component**

  Client component. Props: `label`, `tags: string[]`, `onChange(tags)`. Behaviour:
  - Renders existing tags as removable chips (pill with an × button)
  - Text input at the end of the chip row; pressing Enter or Tab adds the typed value as a new chip (if not already in the list)
  - Pressing Backspace on empty input removes the last chip
  - Calls `onChange` with updated array on every add/remove
  - Used for Specialties and Certifications fields

- [ ] **Step 3: Build `AvailabilityEditor` component**

  Client component. Props: `slots: Array<{ day: string; hours: string }>`, `onChange(slots)`. Behaviour:
  - Renders each slot as a row of two text inputs: Day (e.g. "Mon, Wed, Fri") and Hours (e.g. "6:00 AM – 11:00 AM")
  - Each row has a delete (trash) button
  - An "Add slot" button appends a new empty row
  - Calls `onChange` on every change

- [ ] **Step 4: Build `DeleteButton` component**

  Client component. Props: `action` (the server action to call), `confirmMessage`. Behaviour:
  - On click, shows a `confirm()` dialog with the message
  - If confirmed, calls `action()` inside `useTransition`, shows "Deleting…" while pending
  - After completion, calls `router.refresh()` to trigger a server-side re-fetch of the list

- [ ] **Step 5: Commit**

  ```
  git commit -m "feat: add shared admin UI components (ImageUpload, TagInput, AvailabilityEditor, DeleteButton)"
  ```

---

### Task 10: Trainer & Transformation server actions

**Files:**
- Create: `app/admin/actions/trainers.ts`
- Create: `app/admin/actions/transformations.ts`

- [ ] **Step 1: Create trainer server actions**

  All functions marked `'use server'`. Use `lib/supabase/server.ts` client. Implement:
  - `getTrainers()` — select all columns, ordered by `display_order` asc
  - `getTrainer(id)` — select single row by id
  - `createTrainer(formData)` — insert row; arrays (specialties, certifications, bio, availability) are passed as JSON strings in formData and parsed back to arrays/jsonb before insert; after insert call `revalidatePath('/trainers')` and `revalidatePath('/admin/trainers')`, then redirect to `/admin/trainers`
  - `updateTrainer(id, formData)` — same parsing as create, update by id, revalidate same paths plus `/trainers/[slug]`, redirect to `/admin/trainers`
  - `deleteTrainer(id)` — delete by id, revalidate paths (no redirect — caller handles navigation via `router.refresh()`)

- [ ] **Step 2: Create transformation server actions**

  All functions `'use server'`. Implement:
  - `getTransformations(trainerId)` — select all for a trainer, ordered by `display_order`
  - `createTransformation(formData)` — insert row linked to `trainer_id`; revalidate `/transformations` and `/admin/trainers`; return `{ error }` or nothing
  - `updateTransformation(id, formData)` — update by id; same revalidation
  - `deleteTransformation(id)` — delete by id; same revalidation

  None of these redirect — the TransformationSection component handles UI refresh via `router.refresh()`.

- [ ] **Step 3: Commit**

  ```
  git commit -m "feat: add trainer and transformation server actions"
  ```

---

### Task 11: Trainer list page

**Files:**
- Create: `app/admin/trainers/page.tsx`

- [ ] **Step 1: Build the trainer list page**

  Server component. Fetches all trainers (id, name, role, slug, image_url, is_active, display_order) ordered by `display_order`. Renders:
  - Page header with title "Trainers", trainer count, and a gold "New Trainer" button linking to `/admin/trainers/new`
  - Empty state message if no trainers
  - Each trainer as a horizontal card: small circular portrait thumbnail, name (medium), role (muted small text), Active/Hidden status badge, an "Edit" link to `/admin/trainers/[id]/edit`, and a `DeleteButton` that calls `deleteTrainer(trainer.id)` with a confirm message

- [ ] **Step 2: Verify**

  Visit `/admin/trainers` — shows list (empty for now) with "New Trainer" button and correct layout.

- [ ] **Step 3: Commit**

  ```
  git commit -m "feat: add admin trainers list page"
  ```

---

### Task 12: TrainerForm component

**Files:**
- Create: `components/admin/TrainerForm.tsx`

- [ ] **Step 1: Build `TrainerForm`**

  Client component. Props: `trainer?: Trainer` (undefined = create mode), `action` (server action). Uses React state for: `imageUrl`, `specialties[]`, `certifications[]`, `availability[]`, `slug`, `isActive`, `pending`, `error`.

  Fields (in order):
  1. Name (text input) — on change, auto-generates slug using `slugify()` from `lib/utils/slugify.ts` only in create mode
  2. Slug (text input, monospace) — editable; auto-populated from name
  3. Role title (text input, e.g. "Head of Strength & Conditioning")
  4. Specialty eyebrow (text input, uppercase, e.g. "STRENGTH & CONDITIONING")
  5. Portrait image — `ImageUpload` with bucket `trainer-images`
  6. Specialties — `TagInput` component, state-managed
  7. Certifications — `TagInput` component, state-managed
  8. Bio paragraph 1 (textarea)
  9. Bio paragraph 2 (textarea)
  10. Availability — `AvailabilityEditor` component, state-managed
  11. Instagram handle (text input)
  12. Display order (number input)
  13. Active toggle (checkbox, controls `isActive` state)

  On submit (`handleSubmit`): build `FormData` from the form, then `fd.set()` for all state-managed values (imageUrl, serialized arrays as JSON strings, isActive as `'true'`/`'false'`), call `action(fd)`, show error if returned.

  Buttons: gold "Create Trainer" or "Save Changes" (pending-aware), and a plain "Cancel" link back to `/admin/trainers`.

- [ ] **Step 2: Commit**

  ```
  git commit -m "feat: add TrainerForm client component"
  ```

---

### Task 13: Trainer new/edit pages + TransformationSection

**Files:**
- Create: `app/admin/trainers/new/page.tsx`
- Create: `app/admin/trainers/[id]/edit/page.tsx`
- Create: `components/admin/TransformationSection.tsx`

- [ ] **Step 1: Create the new trainer page**

  Server component. Renders a "← Back to Trainers" link, page heading "New Trainer", then `<TrainerForm action={createTrainer} />`.

- [ ] **Step 2: Create the edit trainer page**

  Server component. Reads `id` from `params`. Fetches trainer row and its transformations in parallel using the server Supabase client. Returns `notFound()` if trainer doesn't exist. Renders:
  - "← Back to Trainers" link, trainer name as heading
  - `<TrainerForm trainer={trainer} action={updateTrainer.bind(null, id)} />`
  - A horizontal divider
  - `<TransformationSection trainerId={id} transformations={transformations} />`

- [ ] **Step 3: Build `TransformationSection`**

  Client component. Props: `trainerId`, `transformations: Transformation[]`. Internal state: `adding` (bool), `editingId` (string | null), `form` (fields for one transformation). Uses `useRouter` from `next/navigation` to call `router.refresh()` after any mutation.

  Renders:
  - Section heading "Transformations" + "Add Transformation" button
  - When `adding` is true, show the inline `TransformationForm` (see below) for a new item
  - List of existing transformations as cards showing client name and goal
  - Each card has Edit and Delete buttons; Edit puts the card into edit mode (inline form replaces the card display); Delete calls `deleteTransformation` with confirm

  `TransformationForm` (local sub-component, not a separate file): Fields: Client Name, Duration (e.g. "12 weeks"), Goal (e.g. "25kg lost"), Goal Type (dropdown: Weight Loss / Muscle Gain / Athletic Performance / Post-Rehab), Before Image (`ImageUpload`, bucket `transformation-images`), After Image (`ImageUpload`, bucket `transformation-images`), Testimonial (textarea, 250-char limit + live counter), Display Order. Save and Cancel buttons.

- [ ] **Step 4: Verify end-to-end**

  - Visit `/admin/trainers/new` — form renders with all fields
  - Fill in name — slug auto-generates
  - Upload a portrait image — thumbnail appears
  - Add specialties via TagInput — chips appear
  - Submit — redirects to `/admin/trainers`, new trainer appears in list
  - Click Edit on the trainer — form pre-populated, transformations section shows at bottom
  - Add a transformation — card appears after `router.refresh()`
  - Delete the transformation — card disappears after confirm

- [ ] **Step 5: Commit**

  ```
  git commit -m "feat: add trainer new/edit pages and inline transformation management"
  ```

---

### Task 14: Café server actions

**Files:**
- Create: `app/admin/actions/cafe.ts`

- [ ] **Step 1: Create café server actions**

  All `'use server'`. Implement:
  - `getCafeItems()` — select all, ordered by category then display_order
  - `getCafeItem(id)` — single row
  - `createCafeItem(formData)` — parse numeric fields with `parseFloat`; parse `is_available` from `'true'`/`'false'` string; insert; revalidate `/cafe` and `/admin/cafe`; redirect to `/admin/cafe`
  - `updateCafeItem(id, formData)` — same parsing, update by id, same revalidation, redirect
  - `deleteCafeItem(id)` — delete by id, revalidate (no redirect)

- [ ] **Step 2: Commit**

  ```
  git commit -m "feat: add café menu server actions"
  ```

---

### Task 15: Café list page

**Files:**
- Create: `app/admin/cafe/page.tsx`

- [ ] **Step 1: Build the café list page**

  Server component. Fetches all menu items ordered by category then display_order. Renders:
  - Page header: "Café Menu", item count, gold "New Item" button linking to `/admin/cafe/new`
  - Items grouped by category (Pre-Workout, Post-Workout, Meals, Juices, Shakes) with a small category heading for each group
  - Each item as a card row: image thumbnail, name, price (₹), Available/Hidden badge, "Edit" link to `/admin/cafe/[id]/edit`, and `DeleteButton` calling `deleteCafeItem(item.id)`
  - Empty state if no items

- [ ] **Step 2: Verify**

  Visit `/admin/cafe` — renders correctly with empty state.

- [ ] **Step 3: Commit**

  ```
  git commit -m "feat: add admin café menu list page"
  ```

---

### Task 16: CafeItemForm + new/edit pages

**Files:**
- Create: `components/admin/CafeItemForm.tsx`
- Create: `app/admin/cafe/new/page.tsx`
- Create: `app/admin/cafe/[id]/edit/page.tsx`

- [ ] **Step 1: Build `CafeItemForm`**

  Client component. Props: `item?: CafeMenuItem`, `action`. State: `imageUrl`, `protein`, `carbs`, `fat`, `calories`, `isAvailable`, `pending`, `error`.

  Fields (in order):
  1. Name (text input)
  2. Category (dropdown: Pre-Workout / Post-Workout / Meals / Juices / Shakes)
  3. Description (textarea)
  4. Price in ₹ (number input, step 0.01)
  5. Display Order (number input)
  6. Image — `ImageUpload` with bucket `cafe-images`
  7. Macros row: Protein (g), Carbs (g), Fat (g) — three number inputs side by side; whenever any macro changes, auto-calculate Calories using `suggestCalories()` from `lib/utils/calories.ts` and update the Calories field
  8. Calories (number input, editable override) — small note: "Auto-calculated from macros — edit to override"
  9. Available checkbox (controls `isAvailable` state)

  On submit: set `image_url`, `is_available` in FormData from state, call action.

  Buttons: gold "Create Item"/"Save Changes", plain "Cancel" back to `/admin/cafe`.

- [ ] **Step 2: Create new café item page**

  Server component. "← Back to Café" link, "New Menu Item" heading, `<CafeItemForm action={createCafeItem} />`.

- [ ] **Step 3: Create edit café item page**

  Server component. Reads `id` from params, fetches item, returns `notFound()` if missing. Renders form pre-populated: `<CafeItemForm item={item} action={updateCafeItem.bind(null, id)} />`.

- [ ] **Step 4: Verify end-to-end**

  - Visit `/admin/cafe/new` — all fields render
  - Enter protein/carbs/fat values — calories updates automatically
  - Upload image — thumbnail appears
  - Submit — redirects to `/admin/cafe`, item shows grouped under its category
  - Click Edit — form pre-populated with all values
  - Toggle availability — badge updates on list after save

- [ ] **Step 5: Commit**

  ```
  git commit -m "feat: add café item form and new/edit pages"
  ```

---

**Phase 2 complete.** Trainers (with inline transformation management) and café menu items are fully manageable through the admin panel. Phase 3 builds the journal editor with TipTap and wires public article pages to Supabase with full SEO.

---

## Phase 3 — Journal (TipTap Editor + SEO)

**End state:** Admin can write, edit, publish, and unpublish journal articles with a rich-text editor and full SEO controls. The public `/journal` and `/journal/[slug]` pages fetch from Supabase and render correct meta tags, OG image, canonical URL, and schema.org JSON-LD.

---

### Task 17: TipTap editor component

**Files:**
- Create: `components/admin/TipTapEditor.tsx`

- [ ] **Step 1: Build the `TipTapEditor` client component**

  Props: `content: Record<string, unknown>` (initial TipTap JSON body), `onChange(json, wordCount)` callback.

  Initialise the editor with `useEditor` from `@tiptap/react` using these extensions: `StarterKit` (provides paragraph, headings H1–H6, bold, italic, blockquote, bullet list, ordered list, horizontal rule, code block), `Image` from `@tiptap/extension-image` (for inline image insertion).

  Set the editor's initial content from the `content` prop. On every editor update, call `onChange` with the current JSON (`editor.getJSON()`) and the current word count (extract plain text via `editor.getText()`, split on whitespace, count non-empty tokens).

- [ ] **Step 2: Build the toolbar**

  A row of icon buttons above the editor area. Each button toggles or runs a TipTap command. Buttons (with active-state highlight when the corresponding format is active):
  - **H2** — toggles Heading level 2
  - **H3** — toggles Heading level 3
  - **B** — toggles Bold
  - **I** — toggles Italic
  - **"** — toggles Blockquote
  - **Bullet list** icon — toggles BulletList
  - **Numbered list** icon — toggles OrderedList
  - **Divider** icon — inserts HorizontalRule
  - **Image** icon — prompts for an image URL (`window.prompt`) and inserts it via `editor.chain().setImage({ src: url }).run()`

  Buttons should be `type="button"` to prevent form submission.

- [ ] **Step 3: Add status bar below the editor**

  Shows live word count and calculated read time in small muted text: e.g. "342 words · 2 min read". Read time = `Math.max(1, Math.ceil(wordCount / 200))`.

- [ ] **Step 4: Style the editor content area**

  The `EditorContent` div should have a minimum height (e.g. 400px), a visible border, padding, and the font/size matching the public article body (DM Sans, 16px, line-height 1.85). The editor is not styled by TipTap — add a `.tiptap-editor` class scoped in `globals.css` that targets `p`, `h2`, `h3`, `blockquote`, `ul`, `ol`, `li`, `hr` inside it with the same visual styles used on the public article page (see Task 22 for the matching CSS).

- [ ] **Step 5: Commit**

  ```
  git commit -m "feat: add TipTap rich text editor component with toolbar and word count"
  ```

---

### Task 18: Journal server actions

**Files:**
- Create: `app/admin/actions/journal.ts`

- [ ] **Step 1: Implement all journal server actions**

  All `'use server'`. Use `lib/supabase/server.ts` client. Implement:

  - `getJournalPosts()` — select id, title, slug, category, is_published, published_at, updated_at for all posts ordered by `updated_at desc`. Does NOT filter by is_published (admin sees drafts too).
  - `getJournalPost(id)` — select all columns for a single post by id.
  - `createJournalPost(formData)` — body arrives as a JSON string; parse it back to object before inserting into the `body` jsonb column. Read time arrives as a number. Insert all fields. After insert: `revalidatePath('/journal')`, `revalidatePath('/admin/journal')`, redirect to `/admin/journal`.
  - `updateJournalPost(id, formData)` — same parsing, update by id. Revalidate `/journal`, `/journal/[slug]` (use the slug from formData), `/admin/journal`. Redirect to `/admin/journal`.
  - `publishPost(id)` — update `is_published = true`. If `published_at` is currently null, also set `published_at = new Date().toISOString()`. Revalidate `/journal` and the specific post's public URL. No redirect.
  - `unpublishPost(id)` — update `is_published = false`. Revalidate same paths. No redirect.
  - `deleteJournalPost(id)` — delete by id. Revalidate `/journal` and `/admin/journal`. No redirect (caller uses `router.refresh()`).

- [ ] **Step 2: Commit**

  ```
  git commit -m "feat: add journal post server actions"
  ```

---

### Task 19: Journal article list page

**Files:**
- Create: `app/admin/journal/page.tsx`

- [ ] **Step 1: Build the journal list page**

  Server component. Fetches all posts (id, title, slug, category, is_published, published_at, updated_at) ordered by updated_at desc.

  Renders:
  - Header: "Journal" title, total count, gold "New Article" button linking to `/admin/journal/new`
  - Each article as a row: title (medium weight), category badge, Published/Draft status badge (green vs zinc), published date or "Draft" text, "Edit" link to `/admin/journal/[id]/edit`, and a `DeleteButton` calling `deleteJournalPost(post.id)` with confirm message

  Empty state: message + link to create first article.

- [ ] **Step 2: Verify**

  Visit `/admin/journal` — page renders with empty state and "New Article" button.

- [ ] **Step 3: Commit**

  ```
  git commit -m "feat: add admin journal article list page"
  ```

---

### Task 20: ArticleForm component

**Files:**
- Create: `components/admin/ArticleForm.tsx`

- [ ] **Step 1: Build `ArticleForm` client component**

  Props: `post?: JournalPost` (undefined = create mode), `createAction`, `updateAction` (bound with id). State: `tab` ('content' | 'seo'), `body` (TipTap JSON), `wordCount`, `readTime`, `coverImageUrl`, `authorAvatarUrl`, `ogImageUrl`, `slug`, `pending`, `error`.

- [ ] **Step 2: Content tab fields**

  Shown when `tab === 'content'`. Fields in order:
  1. Title (text input) — on change, auto-generates slug via `slugify()` in create mode
  2. Slug (text input, monospace, editable)
  3. Category (dropdown: Training / Nutrition / Mindset / Recovery)
  4. Excerpt (textarea, 160-char hard limit, live character counter shown below)
  5. Cover Image — `ImageUpload` with bucket `article-images`
  6. Author Name (text input)
  7. Author Avatar — `ImageUpload` with bucket `avatars`
  8. Body — `TipTapEditor` component; `onChange` updates `body` state and `wordCount`; readTime auto-calculated and displayed as a small hint: "~2 min read"

- [ ] **Step 3: SEO tab fields**

  Shown when `tab === 'seo'`. All fields are optional (they fall back to title/excerpt/cover at render time). Fields:
  1. Meta Title (text input, 60-char hard limit, live counter) — placeholder: article title
  2. Meta Description (textarea, 160-char hard limit, live counter) — placeholder: excerpt
  3. OG Image — `ImageUpload` with bucket `article-images` — small hint: "Defaults to cover image if empty"
  4. Canonical URL (text input) — placeholder: `https://igym.in/journal/[slug]`

- [ ] **Step 4: Form submission and action buttons**

  On submit, serialize all state-managed fields into `FormData` (body as `JSON.stringify(body)`, readTime as string, image URLs, etc.) and call the appropriate action.

  Two separate buttons at the bottom:
  - **Save Draft** — calls action with `is_published = 'false'`; always available
  - **Publish** — calls action with `is_published = 'true'`; shows "Unpublish" instead if the post is currently published (calls `unpublishPost` which is a separate import, no full form submit needed — just a direct call)

  Both buttons disabled and show loading state while pending. Error message shown above buttons if action returns `{ error }`.

- [ ] **Step 5: Auto-save**

  Add a `useEffect` that starts a 30-second interval when the editor is open. On each tick, silently call the update action with the current form state if the post already exists (skip for new posts). Show a small "Saved" flash text for 2 seconds after each auto-save.

- [ ] **Step 6: Commit**

  ```
  git commit -m "feat: add ArticleForm with TipTap editor, SEO tab, and auto-save"
  ```

---

### Task 21: Article new/edit pages

**Files:**
- Create: `app/admin/journal/new/page.tsx`
- Create: `app/admin/journal/[id]/edit/page.tsx`

- [ ] **Step 1: New article page**

  Server component. Renders "← Back to Journal" link, "New Article" heading, then `<ArticleForm createAction={createJournalPost} />`.

- [ ] **Step 2: Edit article page**

  Server component. Reads `id` from params. Fetches post using `getJournalPost(id)`. Returns `notFound()` if missing. Renders `<ArticleForm post={post} updateAction={updateJournalPost.bind(null, id)} />`.

- [ ] **Step 3: Verify end-to-end**

  - Visit `/admin/journal/new` — both tabs render, TipTap editor is functional
  - Type a title — slug auto-generates
  - Switch to SEO tab — all fields present
  - Save as Draft — redirects to list, article shows as Draft
  - Click Edit — all fields pre-populated including TipTap body
  - Click Publish — status badge changes to Published
  - Auto-save fires after 30 seconds of editing — small "Saved" text appears briefly

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: add journal article new and edit pages"
  ```

---

### Task 22: Public journal list page — wire to Supabase

**Files:**
- Modify: `app/journal/page.tsx`
- Modify: `components/journal/JournalPageContent.tsx`

- [ ] **Step 1: Update data source in `JournalPageContent`**

  Currently `JournalPageContent` imports from `lib/journal-data.ts`. Change it to accept posts as a prop (`posts: JournalPost[]`) instead of importing them internally.

- [ ] **Step 2: Update `app/journal/page.tsx`**

  Make it an async server component. Query Supabase for all published posts (is_published = true) ordered by published_at desc. Select only the fields needed for the list: id, title, slug, category, excerpt, cover_image_url, author_name, author_avatar_url, published_at, read_time_minutes.

  Map the DB rows to the shape `JournalPageContent` expects (field names differ slightly — e.g. `cover_image_url` → `image`, `author_avatar_url` → `authorAvatar`, format `published_at` timestamp as "June 8, 2026" using `toLocaleDateString`, format `read_time_minutes` as "6 min read"). Pass mapped posts as prop to `JournalPageContent`.

  Add `export const revalidate = 3600` for ISR (1-hour cache). The admin publish action already calls `revalidatePath('/journal')` for on-demand refresh.

- [ ] **Step 3: Verify**

  Visit `/journal` — page loads (empty or with any articles added via admin). Confirm no import from `lib/journal-data.ts` remains in these files.

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: wire public journal list page to Supabase"
  ```

---

### Task 23: Public article detail page — wire to Supabase + full SEO

**Files:**
- Modify: `app/journal/[slug]/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace data source**

  Remove the import of `posts` from `lib/journal-data.ts`. In `generateStaticParams`, query Supabase for all published post slugs. In `generateMetadata`, query Supabase for the single post by slug. In the page component itself, query Supabase for the full post row by slug. Return `notFound()` if no published post matches.

- [ ] **Step 2: Render the article body**

  Remove the `PortableText` import and `portableTextComponents`. Instead, use `generateHTML` from `@tiptap/html` with `StarterKit` and `Image` extensions (same extensions used in the editor) to convert `post.body` (TipTap JSON) to an HTML string server-side.

  Render the HTML string using `dangerouslySetInnerHTML={{ __html: html }}` inside a `<div className="article-body">` wrapper.

- [ ] **Step 3: Add `.article-body` CSS to `globals.css`**

  Add a `.article-body` block in `globals.css` that styles the generated HTML elements to match the visual output of the old `portableTextComponents`. Target:
  - `p` — 16px, DM Sans light, charcoal-mid color, 1.85 line-height, 1.5rem bottom margin
  - `h2` — 36px, Cormorant Garamond light, charcoal, tight leading, 3rem top / 1rem bottom margin
  - `h3` — 28px, Cormorant Garamond light, charcoal, 2.5rem top / 1rem bottom margin
  - `blockquote` — 2px left border in gold, left padding, italic, Cormorant 22px, light, 2rem vertical margin
  - `ul`, `ol` — left padding, spaced list items
  - `img` — full width, no border-radius, 2.5rem vertical margin
  - `hr` — 1px gold border, 2.5rem vertical margin

- [ ] **Step 4: Update `generateMetadata`**

  Return full metadata using the post's SEO fields with fallbacks:
  - `title`: `meta_title` || `title` + " | IGYM Journal"
  - `description`: `meta_description` || `excerpt`
  - `alternates.canonical`: `canonical_url` || `https://igym.in/journal/${slug}`
  - `openGraph`: title, description, images array (`og_image_url` || `cover_image_url`), type `'article'`, `publishedTime: published_at`, `authors: [author_name]`

- [ ] **Step 5: Add schema.org Article JSON-LD**

  Inside the page component's return, add a `<script type="application/ld+json">` tag with a JSON-LD `Article` object containing: `@context`, `@type: 'Article'`, `headline` (title), `author` (Person with name), `datePublished` (published_at), `dateModified` (updated_at), `image` (cover_image_url), `publisher` (Organization: name "iGym", logo URL).

  Use `JSON.stringify` to safely serialize it.

- [ ] **Step 6: Update related posts section**

  The existing "More from the Journal" section at the bottom queries `relatedPosts` from the static array. Change it to query Supabase for 3 published posts excluding the current slug, ordered by published_at desc.

- [ ] **Step 7: Verify full SEO**

  - Publish an article via the admin panel
  - Visit `/journal/[slug]` — article renders with correct typography from `.article-body` CSS
  - Right-click → View Page Source — check `<title>`, `<meta name="description">`, `<meta property="og:image">`, `<link rel="canonical">`, and the `<script type="application/ld+json">` block are all present with correct values
  - Visit `/journal` — new article card appears in the list

- [ ] **Step 8: Commit**

  ```
  git commit -m "feat: wire public article page to Supabase with TipTap HTML render and full SEO"
  ```

---

**Phase 3 complete.** Journal articles can be written, edited, published, and unpublished. The public blog pages are fully live from Supabase with correct SEO metadata, OG tags, canonical URLs, and schema.org markup. Phase 4 wires the remaining public pages (trainers, café, homepage previews), adds the sitemap, and removes all Sanity/static file remnants.

---

## Phase 4 — Full Public Wiring & Cleanup

**End state:** Every public page fetches live data from Supabase. Sanity and all static mock files are fully removed. Sitemap and robots.txt are auto-generated. Admin settings let the admin manage users and update their own profile.

---

### Task 24: Public trainers pages — wire to Supabase + SEO

**Files:**
- Modify: `app/trainers/page.tsx`
- Modify: `components/trainers/TrainersPageContent.tsx`
- Modify: `app/trainers/[slug]/page.tsx`

- [ ] **Step 1: Update `TrainersPageContent` to accept props**

  Currently imports from `lib/trainers-data.ts` internally. Change it to accept `trainers: Trainer[]` as a prop. Remove the internal static import. Map the DB field names to whatever shape the component's child cards expect (e.g. `image_url` → `image`, `specialty_eyebrow` → `specialtyEyebrow`). This change is internal to the component — public API is just the prop.

- [ ] **Step 2: Update `app/trainers/page.tsx`**

  Make it an async server component. Query Supabase for all active trainers (`is_active = true`) ordered by `display_order`, selecting the fields the list page needs (name, slug, role, specialty_eyebrow, image_url, specialties). Pass the result as the `trainers` prop to `TrainersPageContent`. Add `export const revalidate = 3600`.

- [ ] **Step 3: Update `app/trainers/[slug]/page.tsx`**

  Currently uses static data. Replace with Supabase queries:
  - `generateStaticParams` — query all active trainer slugs
  - `generateMetadata` — query trainer by slug; return title (trainer name + role), description (first bio paragraph, truncated to 160 chars), OG image (image_url). Schema.org `Person` JSON-LD with name, jobTitle, worksFor (iGym)
  - Page component — query trainer + their transformations (ordered by display_order) in parallel using `Promise.all`. Return `notFound()` if trainer not found or inactive.

  The page renders the existing `TrainerTransformations` component and trainer profile markup — no visual change, just different data source. Add on-demand revalidation note: `updateTrainer` already calls `revalidatePath('/trainers/[slug]')`.

- [ ] **Step 4: Add schema.org `Person` JSON-LD to trainer detail page**

  Inside the page return, add a `<script type="application/ld+json">` with a `Person` object: `name`, `jobTitle` (role), `worksFor` (Organization: iGym), `image` (image_url). Use `JSON.stringify`.

- [ ] **Step 5: Verify**

  - Add a trainer via admin with real data
  - Visit `/trainers` — card appears
  - Visit `/trainers/[slug]` — full profile renders with transformations
  - View source — check title, description, OG image, JSON-LD are all correct

- [ ] **Step 6: Commit**

  ```
  git commit -m "feat: wire public trainers pages to Supabase with SEO and schema.org"
  ```

---

### Task 25: Public café page — wire to Supabase

**Files:**
- Modify: `app/cafe/page.tsx`
- Modify: `components/cafe/CafePageContent.tsx`

- [ ] **Step 1: Update `CafePageContent` to accept props**

  Same pattern as trainers: remove internal static import, accept `items: CafeMenuItem[]` as prop. Map DB fields to the shape the component's menu cards expect (e.g. `protein_g` → `protein`, `carbs_g` → `carbs`, `fat_g` → `fat`, `image_url` → `image`).

- [ ] **Step 2: Update `app/cafe/page.tsx`**

  Async server component. Query Supabase for available menu items (`is_available = true`) ordered by category then display_order. Pass as `items` prop to `CafePageContent`. Add `export const revalidate = 3600`.

- [ ] **Step 3: Verify**

  Add a menu item via admin. Visit `/cafe` — item appears under the correct category section.

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: wire public café page to Supabase"
  ```

---

### Task 26: Homepage preview sections — wire to Supabase

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/TrainersPreview.tsx`
- Modify: `components/sections/JournalPreview.tsx`
- Modify: `components/sections/CafePreview.tsx`
- Modify: `components/sections/TransformationsPreview.tsx`

- [ ] **Step 1: Audit each preview component**

  Read each of the four preview components. Check whether they import static data internally or accept props. If they import internally, change them to accept data as props (same pattern used for full pages above). If they already accept props, skip.

- [ ] **Step 2: Update `app/page.tsx` to fetch preview data**

  Make the homepage an async server component. Run all four preview queries in parallel using `Promise.all`:
  - Trainers preview: 3 active trainers ordered by display_order (fields: name, slug, role, image_url, specialties)
  - Journal preview: 3 latest published posts ordered by published_at desc (fields: title, slug, category, excerpt, cover_image_url, author_name, published_at)
  - Café preview: up to 6 available items ordered by display_order (fields: name, category, price, image_url, calories, protein_g, carbs_g, fat_g)
  - Transformations preview: all transformations with their trainer name (join to trainers: `transformations(*, trainers(name))`) ordered by display_order, limit 6

  Pass the results as props to each preview section component.

- [ ] **Step 3: Wire the full `/transformations` page**

  Modify `app/transformations/page.tsx` and `components/transformations/TransformationsPageContent.tsx` using the same pattern: remove static imports, accept data as props, query Supabase for all transformations joined with their trainer name (`transformations(*, trainers(name, slug))`), ordered by display_order. Add `export const revalidate = 3600`.

- [ ] **Step 4: Verify**

  Visit `/` — all preview sections render with live data. Visit `/transformations` — full page renders from Supabase. No errors if any section is empty (render empty state or hide the section if no data).

- [ ] **Step 5: Commit**

  ```
  git commit -m "feat: wire homepage preview sections and transformations page to Supabase"
  ```

---

### Task 27: Sitemap + robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

  Export a default async function that returns the Next.js `MetadataRoute.Sitemap` array. It should:
  - Include static routes with their priority and changeFrequency: `/` (1.0, weekly), `/trainers` (0.8, weekly), `/journal` (0.8, daily), `/cafe` (0.6, monthly), `/membership` (0.6, monthly), `/transformations` (0.6, monthly)
  - Query Supabase for all published journal post slugs (is_published = true, select slug, updated_at) and add each as `/journal/[slug]` with priority 0.7 and changeFrequency daily, lastModified from updated_at
  - Query Supabase for all active trainer slugs (is_active = true, select slug, updated_at) and add each as `/trainers/[slug]` with priority 0.6 and changeFrequency monthly

  Use `createClient` from `lib/supabase/server.ts`. The base URL for all entries is `https://igym.in`.

- [ ] **Step 2: Create `app/robots.ts`**

  Export a default function returning the `MetadataRoute.Robots` object:
  - `rules`: allow all (`userAgent: '*'`, `allow: '/'`), disallow `/admin/`
  - `sitemap`: `https://igym.in/sitemap.xml`

- [ ] **Step 3: Verify**

  Visit `http://localhost:3000/sitemap.xml` — valid XML with all static + dynamic routes listed. Visit `http://localhost:3000/robots.txt` — shows Disallow: /admin/ and Sitemap: line.

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: add auto-generated sitemap and robots.txt"
  ```

---

### Task 28: Remove Sanity and static mock files

**Files deleted:**
- `lib/trainers-data.ts`
- `lib/journal-data.ts`
- `lib/sanity/client.ts`
- `lib/sanity/queries.ts`
- `lib/sanity/types.ts`
- `sanity/` (entire folder and all contents)
- `sanity.config.ts`
- `app/studio/` (entire folder)

**Files modified:**
- `package.json` — remove Sanity packages
- Any remaining file that still imports from the above

- [ ] **Step 1: Search for remaining imports**

  Run a project-wide search for these import paths and confirm they are all gone:
  - `from '@/lib/trainers-data'`
  - `from '@/lib/journal-data'`
  - `from '@/lib/sanity'`
  - `from '@portabletext/react'`
  - `from 'next-sanity'`
  - `from 'sanity'`

  Fix any remaining import before proceeding.

- [ ] **Step 2: Delete static data and Sanity files**

  Delete `lib/trainers-data.ts`, `lib/journal-data.ts`, `lib/sanity/` folder, `sanity/` folder, `sanity.config.ts`, and `app/studio/` folder.

- [ ] **Step 3: Uninstall Sanity npm packages**

  ```
  npm uninstall sanity next-sanity @sanity/vision @portabletext/react
  ```

  Expected: packages removed from node_modules and package.json.

- [ ] **Step 4: Verify build**

  ```
  npm run build
  ```

  Expected: build completes with no errors. If TypeScript errors appear, fix missing imports before committing.

- [ ] **Step 5: Commit**

  ```
  git commit -m "chore: remove Sanity CMS and static mock data files"
  ```

---

### Task 29: Admin settings — user management

**Files:**
- Create: `app/admin/actions/users.ts`
- Create: `app/admin/settings/page.tsx`

- [ ] **Step 1: Create user management server actions**

  All `'use server'`. Use `createAdminClient()` from `lib/supabase/admin.ts` (service-role key — bypasses RLS). Implement:

  - `getAdminUsers()` — select all rows from `admin_users` joined with `auth.users` email. Since `auth.users` is not directly queryable via the JS client, use the admin client's `listUsers()` method from `supabase.auth.admin`, then cross-reference with `admin_users` rows to build a list of `{ id, email, display_name, role, created_at }`.
  - `inviteUser(formData)` — reads email, display_name, role from formData. Call `supabase.auth.admin.inviteUserByEmail(email)` to create the auth account and send an invite email. Then insert a row into `admin_users` with the returned user id, role, and display_name. Return `{ error }` if either step fails.
  - `changeUserRole(userId, role)` — update `admin_users.role` for the given userId.
  - `removeUser(userId)` — call `supabase.auth.admin.deleteUser(userId)` which cascades to delete the `admin_users` row via the FK.

  **Important:** Before any of these actions execute, verify the calling user's role is `'admin'` by checking their own `admin_users` row. Return `{ error: 'Unauthorised' }` if not.

- [ ] **Step 2: Build the settings page**

  Server component. Checks the current user's role — if not `'admin'`, redirect to `/admin/dashboard`. Fetches all admin users.

  Renders:
  - Page heading "Settings — User Management"
  - Table of current users: email, display name, role badge (Admin / Editor), "Change to Editor"/"Change to Admin" toggle button, "Remove" button (disabled for the currently logged-in user so they can't remove themselves)
  - "Invite User" form below the table: email input, display name input, role dropdown (Admin / Editor), "Send Invite" button. On submit calls `inviteUser`. Shows success/error message.

- [ ] **Step 3: Verify**

  Log in as admin. Visit `/admin/settings` — page loads. Invite a new editor using a second email address. Check that a Supabase auth invite email is sent (check Supabase dashboard → Authentication → Users). Verify the new user appears in the list with Editor role. Change their role — badge updates. Try visiting `/admin/settings` while logged in as an editor (if possible) — should redirect to dashboard.

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: add admin user management settings page"
  ```

---

### Task 30: Admin settings — profile page

**Files:**
- Create: `app/admin/settings/profile/page.tsx`

- [ ] **Step 1: Build the profile page**

  Server component. Checks the current user's role — if not `'admin'`, redirect to `/admin/dashboard`. Fetches the current user's `admin_users` row and their auth email from `supabase.auth.getUser()`.

  Renders three separate forms on the same page (each is an independent form with its own submit button):

  **Display Name form:**
  - Display name text input (pre-filled from `admin_users.display_name`)
  - "Save Name" button
  - Server action: update `admin_users.display_name` for the current user's id

  **Email form:**
  - Current email shown as read-only text
  - New email text input
  - "Update Email" button
  - Server action: call `supabase.auth.updateUser({ email: newEmail })` — Supabase sends a confirmation link to the new email; show a success message "Confirmation link sent to [new email]"

  **Password form:**
  - New password input
  - Confirm password input
  - "Update Password" button
  - Server action: validate that both fields match; call `supabase.auth.updateUser({ password: newPassword })`; show success message or error

  Each form is independent — submitting one does not affect the others. Error and success messages shown inline below each form.

- [ ] **Step 2: Add profile link to sidebar**

  In `components/admin/Sidebar.tsx`, under the Settings nav link (already admin-only), add a second sub-link "Profile" pointing to `/admin/settings/profile`. Show it only when the current pathname starts with `/admin/settings`.

- [ ] **Step 3: Verify**

  - Visit `/admin/settings/profile`
  - Update display name — sidebar updates after page refresh
  - Submit email change — success message appears, check Supabase auth for pending email change
  - Submit password with mismatched confirm — error shown, no update
  - Submit password correctly — success message shown, verify new password works on next login

- [ ] **Step 4: Commit**

  ```
  git commit -m "feat: add admin profile settings page (display name, email, password)"
  ```

---

**Phase 4 complete. The full system is live:**

- All public pages (trainers, journal, café, homepage) fetch from Supabase
- Sitemap and robots.txt auto-generated
- Sanity CMS and all static mock data fully removed
- Admin can manage users (invite, change role, remove) and update their own profile
- Every admin write operation triggers on-demand revalidation of the affected public routes
