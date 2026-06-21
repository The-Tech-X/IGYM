# iGym — Landing Page Signature Motion Design

**Date:** 2026-06-14
**Status:** Approved
**Scope:** Five scroll-driven motion effects on the public landing page (and global grain), built with framer-motion + Lenis only (no new dependencies).

---

## 1. Overview

Add a cohesive "signature set" of premium motion to the iGym landing page. The brand is quiet luxury ("Rolls Royce, not Gold's Gym") — every effect must feel intentional and restrained, never flickery or gimmicky. The goal is one or two moments of genuine theatre surrounded by subtle ambient polish.

Five effects:
1. **Scroll-expand "intro film"** — a new section below the existing hero carousel
2. **Reading-spotlight statement** — one new dedicated full-viewport statement section
3. **Film grain overlay** — global ambient texture
4. **Gold-wipe image reveals** — selective, on key images only
5. **Stat count-ups** — on the existing StatsBanner

**Constraints:**
- Only `framer-motion` (v12, installed) + Lenis (installed) — no new dependencies
- All animation uses GPU-friendly `transform` / `opacity` only
- Every effect respects `prefers-reduced-motion` (framer-motion's `useReducedMotion`) and degrades to a clean static state
- No change to existing content, copy, or layout beyond the additions described

---

## 2. Shared Foundation

- All scroll-driven effects use framer-motion `useScroll({ target, offset })` + `useTransform`, which read scroll position from the existing Lenis-driven smooth scroll. No manual scroll listeners.
- A `prefers-reduced-motion` guard (`useReducedMotion()`) is checked in every animated component. When reduced motion is preferred, the component renders its final/resting visual state with no scroll-scrub or entrance animation.
- Components are client components (`'use client'`) since they use hooks. They receive content as props or render static markup; none fetch data.

---

## 3. Effect 1 — Scroll-Expand Intro Film

**File:** `components/sections/ScrollExpandFilm.tsx` (new)
**Placement:** `app/page.tsx`, immediately after `<HeroCarousel />` and before `<StatsBanner />`.

**Behaviour:**
- A tall outer container (e.g. `h-[200vh]`) establishes the scroll distance. Inside, a `sticky top-0 h-screen` stage holds the video panel centered.
- A muted, autoplaying, looping `<video>` (with `playsInline`, poster fallback) sits in a centered panel that starts at roughly 60% width with a letterbox aspect ratio and rounded corners.
- As the section scrolls through, `useScroll` progress (0→1) drives `useTransform`:
  - panel width/scale: framed → full-bleed (full viewport)
  - border-radius: rounded → 0
  - overlay text opacity/translate: hidden → visible as the panel approaches full-bleed
- Overlay copy (over a subtle bottom gradient for legibility):
  - eyebrow: `INSIDE IGYM` (gold, with the gold prefix line per the type system)
  - line: **"Where the work is done."** (Cormorant, light, large)
- Placeholder media: a muted stock loop video committed to `public/intro-film.mp4` with a poster `public/intro-film-poster.jpg` (or reuse an existing hero image as poster). The user swaps `intro-film.mp4` for real footage later — no code change needed.
- **Reduced motion:** render the video full-bleed and static (no scale scrub), overlay text simply visible. The outer container collapses to a single `h-screen` (no extra scroll distance) so there's no dead scroll.

**Notes:**
- Video must be muted to autoplay in browsers. Include `preload="metadata"`.
- `next/image` is not used for the video poster inside the video element; a plain poster attribute or layered `<img>` is fine.

---

## 4. Effect 2 — Reading-Spotlight Statement

**File:** `components/sections/StatementSection.tsx` (new)
**Placement:** `app/page.tsx`, between `<TransformationsPreview />` and `<CafePreview />`.

**Behaviour:**
- Full-viewport (`min-h-screen`), near-black background (`bg-charcoal`), centered statement in large Cormorant.
- The statement is split into words. Each word is wrapped and its color/opacity is driven by `useScroll` progress so that words transition from `text-white/15` to `text-white` sequentially as the section scrolls through the viewport center (a "reading spotlight" sweeping across the line).
- Implementation: a single `useScroll` on the section; each word maps to a sub-range of scroll progress via `useTransform`, interpolating opacity (e.g. 0.15 → 1). The final clause renders in italic gold per the brand type rule.
- Statement copy: **"We don't sell memberships. We accept a standard of commitment — and we meet it with ours."** (final clause "and we meet it with ours." in `italic text-gold`).
- **Reduced motion:** entire statement rendered at full contrast immediately; no per-word scrub; section height reduces to content height (no extra scroll distance).

---

## 5. Effect 3 — Film Grain Overlay

**File:** `components/ui/FilmGrain.tsx` (new)
**Wired in:** `components/layout/SiteLayout.tsx` (rendered once inside the non-admin layout branch, so it covers all public pages and not the admin panel).

**Behaviour:**
- A `fixed inset-0 z-[60] pointer-events-none` layer with an inline SVG `feTurbulence` noise as a background, at ~3.5% opacity.
- Sits above page content but below the custom cursor (cursor uses a higher z-index; verify and adjust). Never intercepts pointer events.
- Static (no animation) by default — a still grain is more "film" and avoids the flicker the brand wants to avoid. (No `prefers-reduced-motion` concern since it doesn't animate.)
- Mobile: keep it (it's cheap), but opacity can be slightly lower if needed.

**Note:** confirm it does not appear over the admin panel — it's added only in the public branch of `SiteLayout`, which already bypasses `/admin`.

---

## 6. Effect 4 — Gold-Wipe Image Reveals

**File:** `components/ui/RevealImage.tsx` (new)
**Applied in (selective):**
- `components/sections/AboutSection.tsx` — the about portrait
- `components/sections/TrainersPreview.tsx` — trainer portraits
- `components/sections/CafePreview.tsx` — the café image
- `components/sections/TransformationsPreview.tsx` — the before/after frames (wrap container)
- NOT applied to: journal thumbnails, every small image, or the hero (hero has its own motion). Keeping it selective preserves its impact.

**Behaviour:**
- A reusable wrapper around an image (accepts the image as children or via props for src/alt/sizes; design to wrap existing `next/image` usage with minimal disruption).
- On entering the viewport (`useInView`, once), a solid gold panel covers the image then **wipes away** (translate or `clip-path` inset animation) revealing the image beneath, using the brand cinematic easing `cubic-bezier(0.22, 1, 0.36, 1)` over ~0.7s.
- **Reduced motion:** image appears immediately, no wipe.

**Note:** the wrapper must not break existing aspect-ratio/`fill` layouts. It wraps the existing relative/aspect container rather than replacing it. Where wrapping `next/image fill` images, the gold panel is an absolutely-positioned sibling that animates out.

---

## 7. Effect 5 — Stat Count-Ups

**Files:**
- `lib/hooks/useCountUp.ts` (new) — a hook that animates a number from 0 to a target when triggered
- `components/sections/StatsBanner.tsx` (modified) — use the hook, trigger on `useInView`

**Behaviour:**
- Each numeric stat (Members 2400+, Coaches 14, Rating 4.9) counts up from 0 to its target over ~1.5s with an ease-out curve when the banner scrolls into view (once).
- Preserve existing suffix/format: "2400+" keeps the "+", "4.9" keeps one decimal, "14" is an integer. The hook returns the animated numeric value; the component formats it (decimals, suffixes) to match the current display exactly.
- "Est. 2019" is a year, not a metric — it stays static (no count-up).
- **Reduced motion:** show final numbers immediately.

**Note:** the hook uses `requestAnimationFrame` or framer-motion's `animate()`/`useMotionValue` + `useTransform`. Prefer framer-motion's `animate` on a `useMotionValue` to stay within the existing toolset and avoid manual RAF cleanup bugs.

---

## 8. File Summary

**New files:**
```
components/sections/ScrollExpandFilm.tsx
components/sections/StatementSection.tsx
components/ui/FilmGrain.tsx
components/ui/RevealImage.tsx
lib/hooks/useCountUp.ts
public/intro-film.mp4          (placeholder video — committed)
public/intro-film-poster.jpg   (placeholder poster — or reuse hero image)
```

**Modified files:**
```
app/page.tsx                              — insert ScrollExpandFilm + StatementSection
components/layout/SiteLayout.tsx          — render FilmGrain (public branch only)
components/sections/StatsBanner.tsx       — count-up numbers
components/sections/AboutSection.tsx      — wrap portrait in RevealImage
components/sections/TrainersPreview.tsx   — wrap portraits in RevealImage
components/sections/CafePreview.tsx       — wrap image in RevealImage
components/sections/TransformationsPreview.tsx — wrap frames in RevealImage
```

---

## 9. Testing & Verification

- Unit test `useCountUp` (and any pure helper like word-range mapping if extracted) with Vitest.
- Manual/build verification: `npm run build` passes; each effect visibly works at normal motion and degrades correctly with `prefers-reduced-motion` enabled (OS setting or devtools emulation).
- Performance: effects must not cause layout thrash — verify only `transform`/`opacity` animate; no `width`/`height`/`top` animations on scroll (use `scale`/`translate`).

---

## 10. Out of Scope

- Real video footage (placeholder now; user swaps later)
- WebGL / three.js / any 3D library (explicitly deferred — possible future "tier 2")
- Horizontal-scroll galleries, magnetic buttons, cursor-label changes (deferred ambient ideas, not in this set)
- Any change to admin panel, data, or non-landing pages
