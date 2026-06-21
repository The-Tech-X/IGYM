# IGYM — Psychological UI/UX Redesign Spec
**Date:** 2026-06-10  
**Status:** Approved by user  
**Scope:** Full homepage + all shared layout components. Inner pages inherit the design system but are not re-architected in this pass.

---

## 1. Design Decisions (Locked)

| Decision | Choice | Psychological Intent |
|---|---|---|
| Personality | Editorial Luxury | Aspiration & refinement — feels like a luxury magazine |
| Motion | Cinematic Precision | 0.6–0.8s, `cubic-bezier(0.22, 1, 0.36, 1)` — fast, confident, authoritative |
| Hero | Cinematic Full-Bleed | First 3 seconds: immersive, dark photo, massive display type |

---

## 2. Design System Changes

### 2.1 Global CSS (`app/globals.css`)

**Replace the premium transition variable:**
```css
--transition-premium: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
```
Old easing was `cubic-bezier(0.16, 1, 0.3, 1)` (slow luxury). New easing `(0.22, 1, 0.36, 1)` is cinematic — faster initial acceleration, confident arrival.

**Add new utility variables:**
```css
--ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1);
--duration-fast: 0.6s;
--duration-mid: 0.75s;
--transition-bg: background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
```

No color palette changes. Existing palette is correct for Editorial Luxury. The problem was not the palette — it was how proportionally each color was used. Gold was overused as an accent everywhere; it should be reserved for single-point focal moments per section.

### 2.2 Typography Rules (enforced site-wide)

**Headline pattern — mix roman + italic gold:**  
Every major section `h2` uses an italic `<em>` on the final clause to create editorial movement:
- "Choose your *discipline*"
- "Guided by *the best*"
- "Simple plans. *Serious results.*"
- "Your transformation starts *today.*"

This is a proven luxury editorial technique. The italic word creates visual rhythm and psychological punctuation — the eye lands there last, reinforcing the emotional hook.

**Eyebrow label pattern — always paired with a gold line:**
```tsx
<div className="flex items-center gap-3">
  <span className="inline-block w-6 h-px bg-gold" />
  <EyebrowLabel>SECTION NAME</EyebrowLabel>
</div>
```
The gold line before the label creates a visual entry point. Never use an eyebrow without the line.

**Never uppercase body copy.** Only eyebrows, buttons, and nav links are uppercase. Headlines, sublines, and quotes use natural case.

---

## 3. Component Redesigns

### 3.1 Navbar (`components/layout/Navbar.tsx`)

**Problem:** 8 nav items, "Home" is redundant (logo = home), "About" is a hash scroll not a page.  
**Fix:** Reduce to 5 content links + CTA button.

**New nav links order:** Trainers · Membership · Café · Transformations · Journal  
(Remove: Home, About, Classes — Classes anchor remains accessible via homepage scroll)

**Transparent state (dark hero pages):** white text, no background, no border.  
**Scrolled state:** `bg-white/95 backdrop-blur-md`, charcoal text, `border-b border-beige-dark`, `shadow-[0_1px_0_rgba(0,0,0,0.04)]`.

**Logo treatment:** Keep `IGYM`, `text-[22px] font-display tracking-[0.38em]`. On dark pages: white. On scrolled/light pages: charcoal.

**Join Now button:**
- Dark hero, unscrolled: `border border-white/35 text-white hover:bg-white hover:text-charcoal`
- Light/scrolled: `bg-charcoal text-white hover:bg-gold hover:text-charcoal border-charcoal hover:border-gold`

### 3.2 PageLoader (`components/layout/PageLoader.tsx`)

**Problem:** Plain IGYM text fade — generic.  
**Fix:** Gold line sweeps left→right beneath the logo text, then both fade out together.

Animation sequence:
1. `IGYM` text fades in (0→1, 0.6s)  
2. Gold line scales from 0→100% width underneath (0.5s, delay 0.3s, `transform-origin: left`)  
3. After 800ms hold → entire overlay fades out (0.8s)

```tsx
// Gold line element below the logo text
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="w-full h-px bg-gold origin-left mt-3"
/>
```

### 3.3 HeroCarousel (`components/sections/HeroCarousel.tsx`)

**Problems fixed:**
- Remove duplicate slide (slides 1 and 2 have identical copy — replace hero-3.png with `hero-1.jpeg` slide)
- Reduce to 3 slides (hero-1.png, hero-2.png, hero-3.png)
- Headline is too small for cinematic impact
- Subline above headline is reversed visual hierarchy — move subline below headline
- Slide counter was correct but progress bar needs to be at very bottom edge

**New slide content structure (bottom-left anchored):**
```
[gold line] EYEBROW KICKER TEXT
GIANT HEADLINE
(24px gap)
subline text — small, muted, uppercase tracking
(28px gap)
[ CTA BUTTON ]
```

**Headline sizing:** `clamp(72px, 9vw, 120px)` — much larger than current `clamp(54px, 8vw, 110px)`.  
**Overlay gradient:** `linear-gradient(160deg, rgba(8,6,4,0.12) 0%, rgba(8,6,4,0.28) 35%, rgba(8,6,4,0.72) 100%)` — darkens bottom-left where text lives, keeps image visible top-right.

**Scroll indicator:** Add a vertical animated line at bottom-center:
```tsx
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pb-5">
  <motion.div
    animate={{ scaleY: [0, 1, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    className="w-px h-9 bg-gradient-to-b from-white/50 to-transparent origin-top"
  />
  <span className="text-[7px] tracking-[0.25em] text-white/30 uppercase">Scroll</span>
</div>
```

**Navigation controls:** Move prev/next arrows to bottom-left. They're currently correct but too large — reduce to `p-2.5` (was `p-3`).

**Progress bar:** Keep at very bottom edge `h-[1.5px]` (was `h-[2px]`). Gold fill. More subtle.

**Slide counter:** `text-[10px] tracking-[0.22em] text-white/35` — more muted.

### 3.4 StatsBanner (`components/sections/StatsBanner.tsx`)

**Problem:** Numbers feel small and the ★ rating is missing (4.9 Google rating is strong social proof).  
**Fix:** Replace "6 Studios" stat with "4.9★" Google rating. Increase numeral size.

**New stats:**
```
2400+   |   14   |   4.9★   |   2019
Members | Expert Coaches | Google Rating | Est.
```

**Numeral size:** `text-[52px] md:text-[58px]` (was `text-[42px] md:text-[48px]`).  
**Gold suffix for + and ★:** Wrap suffix in `<span className="text-gold text-[32px]">` — creates visual anchor.  
**Vertical padding:** `py-[60px]` (was `py-16`) — more breathing room.

### 3.5 AboutSection (`components/sections/AboutSection.tsx`)

**Changes:**
1. Headline: `"Not just a gym. *A standard.*"` — wrap `A standard.` in `<em>` with `text-gold italic` class
2. Eyebrow: Add gold line prefix `<span className="inline-block w-6 h-px bg-gold" />`
3. Fix "Our Story" link — it currently navigates to `/membership` which is wrong. Change `href` to `/#about` or remove the link until an About page exists. For now, remove the link entirely and replace with a static tagline.
4. Image corner tag: Add a small charcoal tag in bottom-right corner of the image reading `"IGYM · Jubilee Hills"` — adds editorial identity.
5. Blockquote: Reduce font size slightly — `text-[20px] md:text-[22px]` (was 22/24) — the quote was competing with the headline.

### 3.6 ClassesPreview (`components/sections/ClassesPreview.tsx`)

**Problems:** Badge pills (`50 Min`, `All Levels`) look cluttered and non-premium. Cards not clickable.  
**Fix:**
1. **Remove badge pills entirely.** Replace with a single clean `duration · level` line in small muted text below the class name. Less is more.
2. **Add gold bottom reveal line:** `absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-left`
3. **Overlay gradient tightening:** `from-charcoal via-charcoal/15 to-transparent` — reduce the mid-point opacity so more image shows in the upper half.
4. **Section heading:** `"Choose your *discipline*"` — italic gold `discipline`
5. **Eyebrow:** Add gold line prefix.

### 3.7 TrainersPreview (`components/sections/TrainersPreview.tsx`)

**Changes:**
1. **Expanding gold underline on hover:** Replace the "View Profile →" link with a subtle `w-0 → w-10 h-px bg-gold` expanding line below the trainer name. The link text remains but secondary.
2. **Specialty tags:** Remove the beige pill tags from the preview section. They clutter — the tags are for the full profile page. Replace with just the role line.
3. **Section heading:** `"Guided by *the best*"` — italic gold `the best`
4. **Eyebrow:** Add gold line prefix.
5. **Portrait aspect ratio:** Keep `aspect-square`. The 4:5 ratio is better but requires restructuring the scroll snap — leave for inner page improvement.

### 3.8 MembershipPreview (`components/sections/MembershipPreview.tsx`)

**Changes:**
1. **Plan grid:** Use `gap: 1px; background: rgba(255,255,255,0.06)` as the grid background — creates seamless dividing lines between cards without visible borders. The cards themselves use `bg-charcoal` / `bg-charcoal-mid` for featured.
2. **Featured badge repositioning:** Move from `-top-3.5` centered to `top-0 right-0` corner — less cliché than centred top badge.
3. **Price typography:** Featured plan price uses `text-gold` — regular plans use `text-white`. This makes the featured plan feel premium not just "highlighted."
4. **Section heading:** `"Simple plans. *Serious results.*"` — italic gold `Serious results.`
5. **Eyebrow:** Add gold line prefix.
6. Plan CTA buttons: Featured → `bg-gold text-charcoal`. Others → `border border-white/15 text-white/60 hover:bg-white hover:text-charcoal`.

### 3.9 TransformationsPreview (`components/sections/TransformationsPreview.tsx`)

**Changes:**
1. **Card wrapper:** Remove the `bg-beige-light/20 border border-beige-dark/50 p-6` wrapper from the homepage preview. Just show the slider + info below — cleaner.
2. **Section heading:** `"Real people. *Real change.*"` — italic gold `Real change.`
3. **Eyebrow:** Add gold line prefix.
4. **Info row:** Keep name + trainer + goal badge — but tighten. Goal badge: `border border-gold/25 bg-gold/7 text-gold`.

### 3.10 CafePreview (`components/sections/CafePreview.tsx`)

**Changes:**
1. **Image corner tag:** Add `"IGYM Café"` charcoal tag on the image (bottom-left) — editorial identity marker.
2. **Section heading:** `"Fuel is part of *the training.*"` — italic gold `the training.`
3. **Eyebrow:** Add gold line prefix.
4. **Feature icons:** The current Lucide icon inside a beige box is correct — keep but increase icon padding: `p-3.5` (was `p-3`).

### 3.11 JournalPreview (`components/sections/JournalPreview.tsx`)

**Changes:**
1. **Section heading:** `"Knowledge is *part of training.*"` — italic gold `part of training.`
2. **Eyebrow:** Add gold line prefix.
3. **Card hover:** Gold bottom border reveal already exists — keep. Remove the `whileHover={{ y: -4 }}` Framer Motion lift — it conflicts with the premium stillness of Editorial Luxury. The gold border reveal is sufficient.
4. **Category tag:** Change from `bg-charcoal text-white` to `bg-charcoal text-white` — correct, keep. But move to top-left of image (already there).
5. **Read link:** Change `"Read Post"` to `"Read →"` — tighter, more editorial.

### 3.12 TestimonialsSection (`components/sections/TestimonialsSection.tsx`)

**Changes:**
1. **Quote mark:** Increase decorative quote mark to `text-[160px] md:text-[200px]` and opacity to `text-gold/[0.10]` — more dramatic but still understated.
2. **Quote text size:** `text-[24px] sm:text-[28px] md:text-[30px]` (was 22/26/28) — slightly larger.
3. **Gold bar divider:** Add a `w-7 h-px bg-gold mx-auto my-5` divider between the quote and the attribution — creates rhythm.
4. **Dots indicator:** Active dot: `w-5 h-1.5 rounded-sm bg-gold` (pill shape, not circle). Inactive: `w-1.5 h-1.5 rounded-full bg-white/15`.
5. **Remove arrow buttons** — they were making the section feel like a basic carousel. The dots alone handle navigation. Auto-advance continues. Users can click dots.
6. **Eyebrow:** `TESTIMONIALS` with flanking gold lines — `[line] TESTIMONIALS [line]`.

### 3.13 CTABand (`components/sections/CTABand.tsx`)

**Changes:**
1. **Headline:** `"Your transformation starts *today.*"` — italic gold `today.`
2. **Eyebrow:** Centred with flanking gold lines.
3. **Headline size:** `text-[48px] md:text-[72px]` (was 40/64) — more commanding.
4. **Button:** `bg-charcoal text-white hover:bg-gold hover:text-charcoal` with `px-12 py-5` — wider and taller for premium feel.

### 3.14 Footer (`components/layout/Footer.tsx`)

**Changes:**
1. **Copyright year:** Fix `© 2025` → `© 2026`.
2. **Instagram link:** Change `https://instagram.com` → `https://www.instagram.com/igymindia/`.
3. **Column title size:** `text-[9px] tracking-[0.32em]` (more breathing room in the label).
4. **Tagline line-height:** `leading-[1.7]` — text feels less compressed.
5. **WhatsApp button in Get in Touch column:** Add green border WhatsApp CTA above the email/phone details — already exists, just needs consistent styling with the rest.

### 3.15 CustomCursor (`components/layout/CustomCursor.tsx`)

**No changes required.** The current implementation is correct: outer ring + inner dot, `mix-blend-difference`, spring physics, desktop only. The white mix-blend cursor works well on both dark hero and light beige sections.

---

## 4. New Shared UI Pattern — `ItalicGold` inline component

Several headings need the italic gold accent pattern. Rather than repeating inline `<em className="italic text-gold not-italic">` everywhere, expose a clean usage via Tailwind:

```tsx
// Usage in JSX:
<h2 className="text-[48px] font-display font-light text-charcoal leading-tight">
  Simple plans. <em className="italic text-gold">Serious results.</em>
</h2>
```

No new component needed — just consistent `<em className="italic text-gold">` usage. The `em` tag is semantically correct for emphasis.

**Important:** Cormorant Garamond's italic variant is loaded (weight 300, 400, 600). Italic renders beautifully at display sizes. Do not add `not-italic` override.

---

## 5. Motion Specification

All entrance animations use this easing profile:
```
ease: [0.22, 1, 0.36, 1]   // cinematic — fast initial, decelerates to rest
duration: 0.7s              // base
```

**Stagger pattern for grid items:** `delay: index * 0.08s` (was `index * 0.1s` — slightly tighter).

**Hover transitions:** All CSS hover transitions use `duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]` — match Framer Motion easing in CSS.

**Do not add new Framer Motion animations beyond what exists.** The current motion inventory is sufficient — the redesign improves the *quality* of existing animations (easing, duration, size) not the *quantity*.

---

## 6. What Is NOT Changing in This Pass

- Inner page layouts (Membership page, Café page, Trainers page, Transformations page, Journal pages) — these inherit the design system tokens automatically but are not re-architected.
- Data / CMS connection — placeholder content remains.
- New pages (`/about`, `/classes`, `/privacy`, `/terms`) — out of scope.
- Mobile layout restructuring — the existing responsive approach is maintained. Typography sizing with `clamp()` and `md:` breakpoints handles mobile.
- Sanity integration — out of scope.

---

## 7. File Change Index

| File | Nature of Change |
|---|---|
| `app/globals.css` | Update `--transition-premium` easing + add `--ease-cinematic` variable |
| `components/layout/Navbar.tsx` | Remove 3 nav items, fix active state, refine button styling |
| `components/layout/PageLoader.tsx` | Add gold sweeping line animation |
| `components/layout/Footer.tsx` | Fix year, fix Instagram URL, column style tweaks |
| `components/sections/HeroCarousel.tsx` | Remove duplicate slide, enlarge headline, fix hierarchy, add scroll indicator, gold eyebrow line |
| `components/sections/StatsBanner.tsx` | Replace "6 Studios" with "4.9★" rating, larger numerals, gold suffix |
| `components/sections/AboutSection.tsx` | Italic gold headline, eyebrow line, fix broken "Our Story" link, image corner tag |
| `components/sections/ClassesPreview.tsx` | Remove badge pills, add gold reveal line, italic headline, eyebrow line |
| `components/sections/TrainersPreview.tsx` | Expanding gold underline, remove specialty tags, italic headline, eyebrow line |
| `components/sections/MembershipPreview.tsx` | Seamless grid, badge repositioned, gold price for featured, italic headline |
| `components/sections/TransformationsPreview.tsx` | Remove card wrapper, italic headline, eyebrow line |
| `components/sections/CafePreview.tsx` | Image corner tag, italic headline, eyebrow line |
| `components/sections/JournalPreview.tsx` | Italic headline, eyebrow line, remove lift hover, tighten read link |
| `components/sections/TestimonialsSection.tsx` | Larger quote, gold bar divider, pill dots, remove arrow buttons, flanking eyebrow |
| `components/sections/CTABand.tsx` | Italic gold `today.`, larger headline, wider button |
| `components/ui/EyebrowLabel.tsx` | No code change — usage pattern updated via consuming components |

**Total files: 16**

---

## 8. Success Criteria

When complete, the site should feel:
- **First 3 seconds (Hero):** Immersive, premium, aspirational — a customer should feel they are looking at something exclusive
- **Scrolling through:** Each section transition feels considered — never loud, never cheap
- **Typography:** Italic gold moments create subconscious desire — the eye is drawn to the accent word at each section
- **Motion:** Animations arrive with authority — not slow, not bouncy — cinematic
- **Stillness:** Hover effects are subtle reveals, not dramatic transformations — the brand is confident, not attention-seeking
