# Walkthrough — IGYM Private Fitness Website

> **Note:** The filename contains a typo ("walkthough" not "walkthrough") — kept as-is to avoid breaking any existing references.

This document tracks what has been built across all development sessions.

---

## Session 1 — Initial Build

Constructed the complete luxury fitness website for IGYM on Next.js 16 / React 19 / Tailwind CSS v4 / Framer Motion.

### 1. Global Setup & Design System
- Configured theme values in `app/globals.css` (Tailwind v4 CSS-first):
  - Brand colors: beige-light, beige-mid, beige-dark, charcoal, charcoal-mid, gray-muted, gold, gold-light
  - Typography: Cormorant Garamond (display) and DM Sans (body)
  - Custom cursor tracking, smooth-scroll overrides, no-scrollbar utilities
- Google Fonts + SEO metadata in `app/layout.tsx`
- `SiteLayout.tsx` mounts: CustomCursor, PageLoader, Lenis smooth scroll, WhatsApp FAB, Navbar, Footer

### 2. Visual Assets (`/public`)
- `hero-1.png` — luxury training floor
- `hero-2.png` — personal training action shot
- `hero-3.png` — café / nutrition bar
- `about.png` — editorial space visual

### 3. Core UI Elements
- `AnimatedText.tsx` — word-by-word stagger reveal
- `ParallaxImage.tsx` — scroll-driven image translation
- `GoldDivider.tsx` + `EyebrowLabel.tsx` — premium accent elements

### 4. Homepage (11 sections)
`HeroCarousel` → `StatsBanner` → `AboutSection` → `ClassesPreview` → `TrainersPreview` → `MembershipPreview` → `TransformationsPreview` → `CafePreview` → `JournalPreview` → `TestimonialsSection` → `CTABand`

### 5. Inner Pages
- `/membership` — Billing toggle (Monthly/Quarterly/Annual), comparison matrix, FAQ accordion
- `/cafe` — Philosophy cards, tabbed menu, macro pills, nutritionist WhatsApp CTA
- `/transformations` — 3-step timeline, before/after grid, PT package cards, stats ticker
- `/trainers` + `/trainers/[slug]` — Grayscale grid, dynamic profiles with sticky portrait
- `/journal` + `/journal/[slug]` — Category filtering, PortableText rich text, reading progress bar
- `/studio` — Sanity Studio mounted at this route

### 6. CMS (Sanity v5)
Schemas built: `author`, `post`, `trainer`, `menuItem`, `transformation`  
Client + GROQ queries ready in `lib/sanity/` — not yet connected to page components

### Build Result
```
▲ Next.js 16.2.9 (Turbopack) — Compiled successfully in 28.7s
✓ TypeScript: no errors
✓ Static pages: 17/17
```

---

## Session 2 — Psychological UI/UX Redesign (2026-06-11)

Full redesign of all 15 homepage + layout components. Spec: `docs/superpowers/specs/2026-06-10-igym-ui-redesign-design.md`. Plan: `docs/superpowers/plans/2026-06-11-igym-ui-redesign.md`.

### Design Decisions
| Decision | Choice |
|----------|--------|
| Personality | Editorial Luxury |
| Motion | Cinematic Precision — `0.7s cubic-bezier(0.22, 1, 0.36, 1)` |
| Hero | Cinematic Full-Bleed, bottom-left anchor |

### Changes by Component

| File | What Changed |
|------|-------------|
| `globals.css` | Easing updated to cinematic precision, 4 new motion tokens |
| `Navbar` | Trimmed 8→5 links, "Enquire" CTA, refined scroll state |
| `PageLoader` | IGYM text + gold sweep line sequence (1.8s) |
| `Footer` | ©2026, Instagram → @igymindia, column typography |
| `HeroCarousel` | 3 slides (removed duplicate), headline 72→120px, scroll indicator |
| `StatsBanner` | 4.9★ Google Rating replaces Studios, 52px numerals, gold suffixes |
| `AboutSection` | Italic gold headline, corner tag, fixed broken link |
| `ClassesPreview` | No badge pills, gold bottom-reveal line |
| `TrainersPreview` | No tag cloud, expanding gold underline |
| `MembershipPreview` | Seamless gap grid, corner badge, gold featured price |
| `TransformationsPreview` | Italic headline, refined goal badge |
| `CafePreview` | Image corner tag, italic headline |
| `JournalPreview` | Italic headline, no card lift hover |
| `TestimonialsSection` | Larger quote, gold bar divider, pill dots, no arrow buttons |
| `CTABand` | Larger headline, italic gold *today.*, wider button |

---

## Session 3 — Copy & Positioning Refinement (2026-06-11)

After viewing the live site via screenshots, all copy was rewritten for a top-tier private membership audience. Changed across 11 files:

| Before | After |
|--------|-------|
| "BUILD YOUR EMPIRE" | "EXCELLENCE IS PRIVATE" |
| "FORGE YOUR STRENGTH" | "COACHED AT THE HIGHEST LEVEL" |
| "FUEL THE MACHINE" | "NOURISHED WITH INTENTION" |
| "Join Now" | "Enquire" |
| "Start Your Journey" | "Request an Introduction" |
| "TRAIN DIFFERENT" | "YOUR DISCIPLINES" |
| "THE COACHES" | "OUR SPECIALISTS" |
| "BECOME A MEMBER" | "PRIVATE MEMBERSHIP" |
| "Simple plans. Serious results." | "Three tiers. One standard." |
| Starter / Pro / Elite | Essential / Signature / Private |
| "RESULTS SPEAK" | "THE WORK SPEAKS" |
| "Real people. Real change." | "Their commitment. Our craft." |
| "IGYM CAFÉ" (eyebrow) | "THE CAFÉ" |
| "Fuel is part of the training." | "Nourishment is part of the programme." |
| "Begin Today" | "The Next Step" |
| "Your transformation starts today." | "The standard you set. Begins here." |
| "Join hundreds of members..." | "Private membership. Considered coaching..." |
| "Where elite bodies are built..." | "Private fitness. Considered in every detail." |

Journal articles rewritten in editorial register (think Monocle, Wallpaper* tone).

### Cleanup
- Deleted `public/hero-1.jpeg` (duplicate asset)
- Deleted 5 unused Next.js template SVGs from `/public`
- Removed `styled-components`, `playwright` from production dependencies
- Moved `@sanity/vision` to devDependencies
- Added `.superpowers/` to `.gitignore`
- Updated `README.md`, `AGENTS.md`, `improvements.md`

---

## Session 4 — Hero Carousel Image Optimization (2026-06-11)

Optimized the hero carousel background images to resolve overlapping issues with the bottom-left text overlay.
- Generated new `hero-1.png` (luxury gym floor), `hero-2.png` (personal trainer coaching client), and `hero-3.png` (performance nutrition café items) using AI image generation.
- Positioned all visual subjects (trainers, clients, food items) on the right side of the frame.
- Created dark negative space on the left side of all images to ensure high contrast and maximum readability for the white text overlays.
- Verified visual alignment on the local server using browser subagent screenshots.

