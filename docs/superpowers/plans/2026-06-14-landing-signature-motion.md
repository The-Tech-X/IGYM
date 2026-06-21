# Landing Page Signature Motion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five cohesive, premium scroll-driven motion effects to the iGym public landing page — without new dependencies, with full reduced-motion support.

**Architecture:** Each effect is an isolated client component (or hook) using framer-motion (`useScroll`/`useTransform`/`useInView`/`useReducedMotion`/`useMotionValue`) riding the existing Lenis smooth scroll. Animations use only `transform`/`opacity`. Components are wired into `app/page.tsx`, `SiteLayout.tsx`, and a few existing sections. No data fetching, no backend changes.

**Tech Stack:** Next.js 16 (App Router), React 19, framer-motion 12, Lenis (`@studio-freight/react-lenis`), Tailwind CSS v4, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-14-landing-signature-motion-design.md`

**Brand guardrails:** quiet luxury — restrained, smooth, cinematic easing `cubic-bezier(0.22, 1, 0.36, 1)`. No flicker, no bounce, no gimmick. Gold accent `#C4A35A` (public site token `--color-gold`).

---

## Shared convention (applies to every task)

- Every animated component calls `useReducedMotion()` from framer-motion. When it returns `true`, the component renders its **final resting visual state** with no scroll-scrub, no entrance animation, and (for full-height scroll sections) collapses any extra scroll distance to a single viewport so there is no dead scroll.
- Animate `transform` (`scale`, `translate`, `clip-path`) and `opacity` only. Never animate `width`/`height`/`top`/`left` on scroll.
- All new components are `'use client'`.
- Implementation order is risk-ascending: grain → count-up → reveal → statement → scroll-film. Do them in this order.

---

## Task 1: FilmGrain overlay (global ambient texture)

**Files:**
- Create: `components/ui/FilmGrain.tsx`
- Modify: `components/layout/SiteLayout.tsx`

- [ ] **Step 1: Build `FilmGrain`**

  Client component, no props. Renders a single `fixed inset-0 pointer-events-none` div covering the viewport. Its background is an inline SVG data-URI using `feTurbulence` (fractal noise, baseFrequency ~0.8, a few octaves) tiled across the layer. Opacity ~3.5% (`opacity-[0.035]`). It is purely static — no animation (a still grain reads as "film" and avoids flicker). Give it a z-index that sits ABOVE page content but BELOW the custom cursor.

- [ ] **Step 2: Determine the correct z-index**

  Read `components/layout/CustomCursor.tsx` and note its z-index (the cursor must remain on top). Read `Navbar.tsx`/`WhatsAppFAB.tsx` z-indexes too. Choose a FilmGrain z-index that is above the page sections but below the cursor and ideally below the navbar and floating action button (grain over fixed UI chrome is fine since opacity is tiny, but keep it below the cursor). Document the chosen value in a comment.

- [ ] **Step 3: Wire into SiteLayout (public only)**

  In `components/layout/SiteLayout.tsx`, render `<FilmGrain />` inside the public branch (the `ReactLenis` tree that already includes Navbar/Footer/cursor) — NOT in the early-return `<>{children}</>` branch used for `/admin`. This guarantees grain covers all public pages and never the admin panel.

- [ ] **Step 4: Verify**

  Run `npm run dev`. Confirm: a subtle texture is visible across the homepage and other public pages; it does NOT appear on `/admin/*`; it never blocks clicks (pointer-events none); the custom cursor still renders above it. Run `npx tsc --noEmit` — zero errors.

- [ ] **Step 5: Commit** (only when the user asks; otherwise stage and note "ready to commit")

---

## Task 2: useCountUp hook + StatsBanner upgrade (incl. decimal rating)

**Context:** `StatsBanner.tsx` already counts up the integer stats (2400+, 14) via an inline `CountUp` component using `requestAnimationFrame`. Gaps vs spec: (a) the 4.9 Google Rating is static and should count up with one decimal; (b) the spec wants a reusable, unit-tested hook. This task extracts a `useCountUp` hook supporting decimals + reduced motion, replaces the inline `CountUp`, and makes all three numeric stats use it. "Est. 2019" stays static.

**Files:**
- Create: `lib/hooks/useCountUp.ts`
- Create: `lib/hooks/__tests__/useCountUp.test.ts`
- Modify: `components/sections/StatsBanner.tsx`

- [ ] **Step 1: Write the failing test for the pure value-formatting logic**

  The hook itself is React/timing-driven, so extract the pure piece that is worth testing: a small `formatCount(value: number, decimals: number)` helper (co-located in `useCountUp.ts`) that rounds/formats a number to a fixed number of decimals and applies thousands separators for integers. Write `lib/hooks/__tests__/useCountUp.test.ts` asserting, e.g.: `formatCount(2400, 0)` → `"2,400"`; `formatCount(4.9, 1)` → `"4.9"`; `formatCount(13.4, 0)` → `"13"`; `formatCount(4.86, 1)` → `"4.9"`. (Describe each case explicitly in the test.)

- [ ] **Step 2: Run the test — expect FAIL** (`npm test`) with "cannot find module '../useCountUp'".

- [ ] **Step 3: Implement `useCountUp` + `formatCount`**

  `useCountUp` signature: `useCountUp({ target, decimals = 0, durationMs = 1500, start: boolean }): number` (returns the current animated value). Behaviour: when `start` flips true, animate a framer-motion `useMotionValue` from 0 → target with an ease-out, reading the latest value into React state via `useMotionValueEvent` (or `animate()` with an `onUpdate`). Respect `useReducedMotion()` — if reduced, immediately return the target (no animation). Also export `formatCount`. Prefer framer-motion's `animate()` on a motion value over manual RAF to avoid cleanup bugs; return a cleanup that stops the animation on unmount.

- [ ] **Step 4: Run the test — expect PASS** (all `formatCount` cases green).

- [ ] **Step 5: Refactor StatsBanner to use the hook**

  Remove the inline `CountUp` component. Change the `stats` data so the rating becomes a count-up entry: `{ isCount: true, target: 4.9, decimals: 1, suffix: '★', label: 'Google Rating' }`; Members `target: 2400, decimals: 0, suffix: '+'`; Coaches `target: 14, decimals: 0, suffix: ''`; keep `Est. 2019` as a static (non-count) entry. Render each count stat via a small local component that calls `useCountUp({ target, decimals, start: isInView })` and renders `formatCount(value, decimals)` plus the styled suffix (the suffix keeps its existing gold styling). Trigger on the section's existing `useInView` (once). Preserve the exact visual format the page shows today (gold suffix sizing, label styling).

- [ ] **Step 6: Verify**

  `npm test` (hook tests pass + the existing 24 still pass). `npm run dev`: scrolling the StatsBanner into view animates Members, Coaches, AND the 4.9 rating from 0 → target; "Est. 2019" stays static; with `prefers-reduced-motion` enabled, all final numbers appear instantly. `npx tsc --noEmit` clean.

- [ ] **Step 7: Commit** (when asked)

---

## Task 3: RevealImage (gold-wipe) + selective application

**Files:**
- Create: `components/ui/RevealImage.tsx`
- Modify: `components/sections/AboutSection.tsx`
- Modify: `components/sections/TrainersPreview.tsx`
- Modify: `components/sections/CafePreview.tsx`
- Modify: `components/sections/TransformationsPreview.tsx`

- [ ] **Step 1: Build `RevealImage`**

  A reusable wrapper that does NOT replace the image — it wraps an existing relative/aspect image container and overlays an animated gold panel. Props: `children` (the existing image markup, e.g. a `next/image fill` inside its relative parent), optional `className`, optional `delay`. Behaviour: an absolutely-positioned gold panel (`bg-gold`) sits over the children; on entering view (`useInView`, `{ once: true, margin: '-10%' }`) the panel wipes away — animate a `clip-path` inset (or a `scaleX`/`translateX` with `transform-origin`) from fully covering → fully gone over ~0.7s using the brand easing `[0.22, 1, 0.36, 1]`. The image beneath is static; only the gold panel moves. Respect `useReducedMotion()` — when reduced, render the panel already gone (image visible immediately). The wrapper must preserve the parent's sizing: it adds `relative overflow-hidden` only if needed and an absolutely-positioned panel, so `fill` images and aspect ratios are unaffected.

- [ ] **Step 2: Apply to the About portrait**

  In `AboutSection.tsx`, wrap the main portrait image's relative container with `<RevealImage>`. Confirm the existing `ParallaxImage`/`next/image` layout still works (the wipe panel is a sibling overlay; parallax still applies to the image).

- [ ] **Step 3: Apply to Trainer preview portraits**

  In `TrainersPreview.tsx`, wrap each trainer portrait's relative `Link`/image container with `<RevealImage delay={index * 0.06}>` (small stagger so the row reveals in sequence, matching the existing entrance stagger). Keep the existing grayscale→color hover behaviour intact.

- [ ] **Step 4: Apply to the Café image**

  In `CafePreview.tsx`, wrap the `ParallaxImage` container with `<RevealImage>`.

- [ ] **Step 5: Apply to the Transformation frames**

  In `TransformationsPreview.tsx`, wrap each compare-slider container (the `aspect-[4/5]` frame) with `<RevealImage delay={index * 0.06}>`. Ensure the wipe sits above the slider visually during reveal but does not capture pointer events (the gold panel should be `pointer-events-none`, and it animates out before interaction matters). Verify the ReactCompareSlider still drags after reveal.

- [ ] **Step 6: Verify**

  `npm run dev`: About, trainer, café, and transformation images each reveal with a gold wipe on scroll-in; journal thumbnails and other images are unchanged (effect stays selective). With reduced motion, images show instantly. Compare sliders remain draggable. `npx tsc --noEmit` clean.

- [ ] **Step 7: Commit** (when asked)

---

## Task 4: StatementSection (reading-spotlight)

**Files:**
- Create: `components/sections/StatementSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Build `StatementSection`**

  Client component, no required props (statement copy lives inside, or accept an optional `text` prop with the default baked in). Layout: a tall outer container giving scroll distance, with a `sticky top-0 min-h-screen` centered stage on `bg-charcoal`. The statement renders in large Cormorant, centered, max-width constrained. Split the statement into words; wrap each word in a span. Use one `useScroll({ target: outerRef, offset: ['start center', 'end center'] })`; for each word, derive an opacity via `useTransform(scrollYProgress, [wordStart, wordEnd], [0.15, 1])` where `wordStart..wordEnd` is that word's slice of the 0→1 range (sequential, lightly overlapping). Words animate from `text-white/15` look to full white as the spotlight passes. The final clause renders in `italic text-gold` per the brand type rule (split copy so the gold clause is its own group; gold words still animate opacity 0.15→1 but in gold).

  Copy (default): **"We don't sell memberships. We accept a standard of commitment — and we meet it with ours."** with the clause "and we meet it with ours." in italic gold.

  Reduced motion: render all words at full opacity (gold clause gold, rest white), collapse the outer container to a single viewport (no extra scroll distance), no scrub.

- [ ] **Step 2: Extract and unit-test the word-range math (optional but preferred)**

  If the per-word start/end range calculation is non-trivial, extract a pure helper `wordRanges(count: number, overlap?: number): Array<[number, number]>` into the component file (or `lib/utils/`) and add a small Vitest test: for `count=2` it returns two ranges spanning ~0→1 in order, monotonic, within [0,1]. Keep it minimal. If trivial/inlined, skip.

- [ ] **Step 3: Insert into the homepage**

  In `app/page.tsx`, render `<StatementSection />` between `<TransformationsPreview />` and `<CafePreview />`.

- [ ] **Step 4: Verify**

  `npm run dev`: scrolling through the statement section sweeps each word from dim to bright in reading order; the final clause is gold; the section feels like a deliberate "breath". With reduced motion, the whole statement is fully legible immediately and there's no dead scroll. `npx tsc --noEmit` clean; `npm test` green.

- [ ] **Step 5: Commit** (when asked)

---

## Task 5: ScrollExpandFilm (intro film, placeholder video)

**Files:**
- Create: `components/sections/ScrollExpandFilm.tsx`
- Add: `public/intro-film.mp4` (placeholder loop video) and a poster image
- Modify: `app/page.tsx`
- Possibly modify: `next.config.ts` (only if a remote video poster host is needed — not expected; local assets used)

- [ ] **Step 1: Source a placeholder video + poster**

  Add a short, muted, royalty-free loop to `public/intro-film.mp4` (a generic gym/architectural clip is fine as a stand-in) and a poster frame to `public/intro-film-poster.jpg`. If sourcing a real clip is not possible in this environment, reuse an existing hero image as the poster and add a tiny placeholder mp4; clearly note in a code comment that the user swaps `public/intro-film.mp4` for real footage later (no code change needed). Document the expected video specs in a comment (muted, ~1080p, ~8–15s loop, H.264 mp4).

- [ ] **Step 2: Build `ScrollExpandFilm`**

  Client component. Structure: an outer container `h-[200vh]` (scroll distance) wrapping a `sticky top-0 h-screen` stage. The stage centers a video panel. Use `useScroll({ target: outerRef, offset: ['start start', 'end start'] })` → `scrollYProgress`. Map progress with `useTransform`:
  - `scale` or width: framed (~60% width / letterbox) → full-bleed. Prefer animating `scale` on a base-sized panel, or `width`/`height` via a wrapper that uses transform-friendly techniques; if using width is unavoidable, prefer `scale` to keep it on the compositor.
  - `borderRadius`: ~16px → 0
  - overlay text: opacity 0 → 1 and slight translate-up as progress crosses ~0.6→1
  The `<video>` is `autoPlay muted loop playsInline preload="metadata"` with the poster attribute. A subtle bottom gradient sits behind the overlay text for legibility. Overlay copy: eyebrow `INSIDE IGYM` (gold, with the gold prefix line) and line **"Where the work is done."** (Cormorant light, large).

  Reduced motion: render the video full-bleed and static (no scale scrub), overlay text simply visible, and collapse the outer container to `h-screen` (no extra scroll distance).

- [ ] **Step 3: Insert into the homepage**

  In `app/page.tsx`, render `<ScrollExpandFilm />` immediately after `<HeroCarousel />` and before `<StatsBanner />`.

- [ ] **Step 4: Verify**

  `npm run dev`: after the hero, the framed video expands smoothly to full-bleed as you scroll into the section, the brand line fades in near full-bleed, and the page continues cleanly afterward. Video autoplays muted and loops. With reduced motion: video is full-bleed/static, text visible, no dead scroll. Check mobile layout (the panel should still expand sensibly; consider a simpler scale on small screens). `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** (when asked)

---

## Final verification (after all tasks)

- [ ] `npm test` — all unit tests pass (existing 24 + new hook/helper tests)
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run build` — EXIT 0, homepage still statically generated / ISR intact
- [ ] Manual pass with `prefers-reduced-motion` ON and OFF — every effect degrades correctly, no dead scroll in reduced mode
- [ ] Confirm grain is absent on `/admin/*`, present on public pages
- [ ] Confirm no new npm dependencies were added (`package.json` unchanged except none)

---

## Notes / guardrails for the implementer

- Do NOT animate `width`/`height`/`top` on scroll — use `scale`/`translate`/`clip-path`/`opacity` so everything stays on the GPU compositor.
- Reuse the brand easing `[0.22, 1, 0.36, 1]` everywhere for consistency with the existing site motion.
- The custom cursor must stay visually on top of the film grain — verify z-index ordering.
- Keep each effect independent: a bug in one must not break the others. Wire them in one at a time and verify before moving on.
- Per user preference: do NOT run `git commit` — stage if helpful and report "ready to commit"; the user commits manually.
