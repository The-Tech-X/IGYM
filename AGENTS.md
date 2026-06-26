# IGYM — Premium Private Fitness Website (Hyderabad)

## Critical: Framework Version Warning
This project runs **Next.js 16.2.9 with React 19** and **Tailwind CSS v4** — breaking changes from older versions exist. Read `node_modules/next/dist/docs/` before writing any Next.js code. Tailwind v4 uses CSS-first config in `app/globals.css` — there is NO `tailwind.config.js`.

**Next.js 16 specifics that bite:**
- Middleware is renamed to **`proxy.ts`** (root), and the exported function must be named `proxy`, not `middleware`. The old `middleware.ts` convention is deprecated and errors.
- Route `params` are **async** — `({ params }: { params: Promise<{ id: string }> })` and `const { id } = await params`.
- `npm install` requires `--legacy-peer-deps` (a transitive React 17/18 peer dep conflicts with React 19).

---

## What This Project Is

IGYM is a private luxury fitness facility in Jubilee Hills, Hyderabad, India. It targets HNI individuals, corporate executives, entrepreneurs, and elite professionals. The brand positioning is quiet confidence and exclusivity — like a private members' club, not a chain gym.

**Instagram:** `@igymindia`  
**Domain:** igym.in  
**Tone:** Never sells. Never shouts. Confident, understated, authoritative.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first, see `app/globals.css`) |
| Animation | Framer Motion 12 |
| **Backend / DB** | **Supabase (Postgres + Auth + Storage)** — see `lib/supabase/` |
| **Admin auth** | **Supabase Auth (email + password), `@supabase/ssr` cookie sessions** |
| **Rich text (admin)** | **TipTap (`@tiptap/react`) — journal editor, Phase 3** |
| Scroll | Lenis (via `@studio-freight/react-lenis`) |
| Icons | Lucide React (also used throughout the admin panel) |
| Compare Slider | `react-compare-slider` |
| Testing | Vitest (`npm test`) — unit tests for `lib/utils/` |
| Images | `next/image` remote patterns (`next.config.ts`): `images.unsplash.com`, `**.supabase.co` (Storage), `cdn.sanity.io` (legacy, unused). Public pages fall back to Unsplash placeholders when an image_url is null. Admin panel uses plain `<img>`. |

---

## Design System (`app/globals.css`)

```
Colors:
  --color-beige-light: #FAF7F2   (page background, light sections)
  --color-beige-mid:  #F0EBE0
  --color-beige-dark: #E0D9CC
  --color-charcoal:   #141414   (primary dark, hero backgrounds)
  --color-charcoal-mid: #2A2A2A
  --color-gray-muted: #8C8C8C
  --color-gold:       #C4A35A   (single focal accent per section)
  --color-gold-light: #D4B870

Fonts:
  --font-display: Cormorant Garamond (headings, large type, quotes — always italic for key phrases)
  --font-body:    DM Sans (UI copy, labels, buttons)

Motion (Cinematic Precision):
  --transition-premium: color, background-color, border-color, opacity, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)
  --ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1)
  --duration-fast: 0.6s
  --duration-mid: 0.75s
```

**Typography rules:**
- Every major section `h2` uses `<em className="italic text-gold">` on the final clause
- Every eyebrow label pairs with `<span className="inline-block w-6 h-px bg-gold flex-shrink-0" />` prefix line
- Centered eyebrows (Testimonials, CTABand) get flanking lines on both sides
- Never uppercase body copy — only eyebrows, buttons, nav links

---

## Project Structure

```
app/
  layout.tsx              — Fonts (Cormorant, DM Sans), SiteLayout wrapper, SEO metadata
  page.tsx                — Home: 11 sections assembled in order
  globals.css             — Tailwind v4 theme config (the ONLY config file)
  cafe/page.tsx           — Imports CafePageContent
  membership/page.tsx     — Imports MembershipPageContent
  trainers/page.tsx       — Imports TrainersPageContent
  trainers/[slug]/page.tsx — Dynamic trainer profiles (static data from trainers-data.ts)
  journal/page.tsx        — Imports JournalPageContent
  journal/[slug]/page.tsx — Dynamic articles (static data from journal-data.ts)
  transformations/page.tsx — Imports TransformationsPageContent

  admin/                  — ADMIN PANEL (bypasses SiteLayout; guarded by proxy.ts)
    page.tsx              — redirects to /admin/dashboard
    login/page.tsx        — email/password login (client-side signInWithPassword)
    sign-out/route.ts     — Route Handler: clears session, redirects to login
    dashboard/page.tsx    — stat cards (counts) + quick-action links
    layout.tsx            — auth gate: getUser → admin_users lookup (service-role) → Sidebar shell
    actions/              — 'use server' server actions
      auth.ts             — login / logout
      trainers.ts         — trainer CRUD (get/create/update/delete)
      transformations.ts  — transformation CRUD (no redirect; caller refreshes)
      cafe.ts             — café menu CRUD
    trainers/             — list, new, [id]/edit (TrainerForm + inline TransformationSection)
    cafe/                 — list (grouped by category), new, [id]/edit (CafeItemForm)

components/
  admin/                  — ADMIN UI (all client components, light theme, gold #C9A84C)
    Sidebar.tsx           — persistent nav; Settings link admin-only; user + role badge
    ImageUpload.tsx       — drag/drop → Supabase Storage, type+size validation, 128px preview
    TagInput.tsx          — chip input (specialties, certifications)
    AvailabilityEditor.tsx — repeating day/hours rows
    DeleteButton.tsx      — confirm() + useTransition + router.refresh(); surfaces errors via alert
    TrainerForm.tsx       — shared create/edit form (slug auto-gen in create mode only)
    TransformationSection.tsx — inline transformation add/edit/delete on trainer edit page
    CafeItemForm.tsx      — café form; macros auto-calc calories (editable override)
  layout/
    SiteLayout.tsx        — Lenis root, PageLoader, CustomCursor, Navbar, Footer, WhatsAppFAB
                            (bypassed for /admin paths)
    Navbar.tsx            — 5 links (Trainers, Membership, Café, Transformations, Journal) + "Enquire" CTA
    Footer.tsx            — 4-col dark: Brand | Explore | Visit Us | Get in Touch
    CustomCursor.tsx      — Spring-physics cursor ring + dot (desktop only, mix-blend-difference)
    PageLoader.tsx        — IGYM text + gold sweep line → fades out after 1.8s
    WhatsAppFAB.tsx       — Fixed bottom-right WhatsApp button, appears after 3s
  sections/               — Homepage sections (11 total)
    HeroCarousel.tsx      — 3 slides, large display type, bottom-left anchor, scroll indicator
    StatsBanner.tsx       — Dark band: 2400+ Members, 14 Coaches, 4.9★ Rating, Est. 2019
    AboutSection.tsx      — Split: parallax image / "Not just a gym. A standard."
    ClassesPreview.tsx    — 4 class cards, gold bottom-reveal on hover, no badge pills
    TrainersPreview.tsx   — 4 trainer portraits (grayscale→color), expanding gold underline
    MembershipPreview.tsx — 3 plans (Essential/Signature/Private), seamless dark grid
    TransformationsPreview.tsx — 3 before/after sliders, "Their commitment. Our craft."
    CafePreview.tsx       — Split: parallax image / feature list
    JournalPreview.tsx    — 3 article cards, gold border reveal on hover
    TestimonialsSection.tsx — Quote rotator, pill dots, no arrows
    CTABand.tsx           — "The standard you set. Begins here." + "Request an Introduction"
  ui/
    AnimatedText.tsx      — Word-by-word stagger reveal
    ParallaxImage.tsx     — Scroll-driven vertical translation
    GoldDivider.tsx       — Gold horizontal line
    EyebrowLabel.tsx      — Small uppercase gold tracking label (always paired with a gold prefix line)
  cafe/CafePageContent.tsx
  membership/MembershipPageContent.tsx
  trainers/TrainersPageContent.tsx + TrainerTransformations.tsx
  journal/JournalPageContent.tsx + ArticleSidebar.tsx
  transformations/TransformationsPageContent.tsx

lib/
  supabase/
    client.ts             — browser client (createBrowserClient) — Client Components
    server.ts             — server client (createServerClient + cookies) — Server Components/Actions
    admin.ts              — service-role client (bypasses RLS) — server-only, user mgmt + layout lookup
    types.ts              — TS interfaces: AdminUser, Trainer, Transformation, JournalPost, CafeMenuItem
  utils/
    slugify.ts, readTime.ts, calories.ts  — pure helpers (Vitest-tested in __tests__/)
    tiptapToHtml.ts       — server-safe TipTap JSON → HTML renderer (XSS-escaped); used by public article page
  supabase/
    public.ts             — cookieless anon client (createClient from supabase-js) — ALL public reads,
                            sitemap, generateStaticParams. Safe at build time (no cookies()).

proxy.ts                  — Next.js 16 middleware: guards /admin/*, redirects unauthenticated → /admin/login

supabase/
  schema.sql              — full DB schema: 5 tables, RLS policies, triggers, indexes, GRANTs
  grants.sql              — table GRANTs for API roles (needed because "auto-expose new tables" is OFF)
  storage-policies.sql    — storage.objects INSERT/UPDATE/DELETE policies for admin uploads

public/
  hero-1.png, hero-2.png, hero-3.png  — Hero carousel images
  about.png                           — About section parallax image
```

---

## Key Behaviours & Patterns

- **Scroll:** Lenis wraps the entire app (except `/admin` and `/studio`). Never use `window.scrollTo` directly.
- **Entrance animations:** `useInView({ once: true, margin: '-10%' })`, stagger `delay: index * 0.08`, ease `[0.22, 1, 0.36, 1]`, duration `0.7s`.
- **Hover transitions:** CSS `duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`.
- **Data state:** All public pages fetch live from Supabase via `createPublicClient` (cookieless). Admin panel reads/writes via the cookie-session/service-role clients. Sanity and static mock data are fully removed. Public pages fall back to Unsplash placeholder images when a row's image_url is null.
- **WhatsApp:** All CTAs use `wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}`. Fallback: `'919454694546'`.
- **Custom cursor:** Desktop only (`hidden md:block`), `mix-blend-difference`.

### Admin / Supabase patterns (all phases complete)

- **Roles:** `admin` (full + user management + own-credential edits) and `editor` (all content CRUD, but NOT user management or own-credential changes). Stored in `admin_users` table keyed to `auth.users.id`.
- **Auth flow:** Login is **client-side** (`signInWithPassword` via the browser client) then `window.location.href = '/admin/dashboard'` (hard nav). Server-action login + `redirect()` does NOT reliably flush session cookies — do not use it. Sign-out is a **Route Handler** (`/admin/sign-out`) because Server Components cannot set cookies.
- **Route guard:** `proxy.ts` validates the session on `/admin/*`. The admin `layout.tsx` does the `admin_users` lookup with the **service-role client** (`lib/supabase/admin.ts`) to avoid RLS/session-hydration races.
- **Three Supabase clients, three jobs:** `public.ts` (cookieless anon) for ALL public reads + sitemap + generateStaticParams (the ONLY client safe at build time — `server.ts`'s `cookies()` crashes static generation); `server.ts` (cookie session) for admin reads + auth mutations (`auth.updateUser` needs the session); `admin.ts` (service-role) for privileged ops (user management, layout role lookup) — server-only, never imported into a client component.
- **TipTap rendering:** editor body stored as JSON in `journal_posts.body`. Rendered to HTML server-side by `lib/utils/tiptapToHtml.ts` (NOT `@tiptap/html` — that's browser-only and throws in server components). Article auto-save uses the non-redirecting `autosaveJournalPost` action.
- **User management lockout safety:** `changeUserRole` blocks self-role-change, which guarantees ≥1 admin always exists. `removeUser` blocks self-removal.
- **RLS + GRANTs:** Every table has RLS. Because the Supabase project has "Automatically expose new tables" OFF, new tables need explicit GRANTs to `anon`/`authenticated`/`service_role` — see `supabase/grants.sql`. Symptom if missing: `permission denied for table` on every query, even service-role.
- **Storage uploads:** Public buckets grant public READ only. Admin uploads require `storage.objects` policies — run `supabase/storage-policies.sql`. 5 buckets: `trainer-images`, `transformation-images`, `article-images`, `cafe-images`, `avatars`. Uploads: type (jpeg/png/webp) + 5MB cap.
- **Server actions:** in `app/admin/actions/`. Create/update redirect on success (`redirect()` must stay OUTSIDE try/catch). Delete actions return `{ error }` and the client refreshes. Always `await createClient()` (server client is async).
- **Admin theme:** dark sidebar (`zinc-950`), light content (`zinc-50`), gold accent `#C9A84C`, Cormorant for headings. Distinct from the public site's gold `#C4A35A`.
- **Env vars needed:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only), `NEXT_PUBLIC_WHATSAPP_NUMBER`. The Sanity env vars are obsolete.
- **Specs/plans:** design at `docs/superpowers/specs/2026-06-12-supabase-backend-design.md`; task-by-task plan at `docs/superpowers/plans/2026-06-12-supabase-backend.md`.

---

## Content Still Needing Real Data (Before Launch)

**Already filled (do not overwrite):**
- Address: Diamond Hills, Gachibowli, Hyderabad - 500032, Telangana, India
- Email: `igymindia@gmail.com` · Phone: `+91 94546 94546`
- WhatsApp fallback: `919454694546` (set in all 5 component files; also set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`)
- Google Maps: `https://maps.app.goo.gl/bvgh9xYwbD5rBxtt8`
- Hours: Mon–Sat 5:00 AM–10:00 PM · Sun 6:00 AM–12:00 Noon
- Stats: 345+ members, 10 coaches, 4.6★ Google, Est. 2023
- Instagram: `https://www.instagram.com/igymindia/` · YouTube: `https://www.youtube.com/@igymindia`
- Transformations page: before/after gallery removed; now shows 4-step process (no client photos needed)
- About page: `/about` — full page built (founder story, TechnoGym, The ProTein Co., 4 pillars, CTA)
- The Circle section: built on homepage — horizontal scroll rail, drag-to-scroll, lightbox modal
- Homepage section order resequenced for optimal conversion flow
- Cafe page: TheProTeinCO.png logo shown in hero; cafe name updated to "The ProTein CO."
- Navbar: "About" added before Trainers; `/about` registered as dark hero page
- TransformationsPreview (homepage): replaced before/after sliders with cinematic text reveal
- Build: ✅ passing as of 2026-06-26, 28 pages, zero TypeScript errors

**Still needed before launch:**
- Trainer profiles — currently 3 fake names (Arjun Mehta, Priya Nair, Rahul Sinha); add real trainers via Supabase
- The Circle section — 6 placeholder cards; replace with real people in `TheCircleSection.tsx`
- About page founder photo — placeholder Unsplash image; replace `FOUNDER_PLACEHOLDER` in `AboutPageContent.tsx`
- All images are Unsplash placeholders — upload real IGYM photos to Supabase storage buckets
- Membership plan prices & FAQ answers — placeholder values; confirm or correct in `MembershipPageContent.tsx`
- PT coaching package prices on transformations page — confirm in `TransformationsPageContent.tsx`
- Testimonials — 3 fake entries in `TestimonialsSection.tsx`; replace with real member quotes
- Journal articles — add real posts via `/admin` panel
- Cafe menu items — add real items via `/admin` panel
- TheProTeinCO.png — in gitignored `public/Images/`; either remove from `.gitignore` or host on Supabase Storage
- `/privacy` and `/terms` pages linked in footer but not yet created
