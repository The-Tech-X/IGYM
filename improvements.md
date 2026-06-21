# IGYM Website — Improvements List

> Last updated: 2026-06-11  
> Items marked ✅ are complete. Remaining items are pending — approve before implementing.

---

## ✅ COMPLETED — UI/UX Redesign (2026-06-11)

The full psychological UI/UX redesign has been implemented. All homepage sections and shared layout components were redesigned with Editorial Luxury personality and Cinematic Precision motion.

**Design system:** Easing updated to `cubic-bezier(0.22, 1, 0.36, 1)`, 4 new motion tokens in `globals.css`.  
**Typography pattern:** Every section `h2` uses `<em className="italic text-gold">` on the key clause.  
**Eyebrow pattern:** Every eyebrow label paired with a `w-6 h-px bg-gold` prefix line.

**Sections redesigned:**
- Hero: 3 slides, large display type `clamp(72px,9vw,120px)`, bottom-left anchor, scroll indicator, gold eyebrow line
- Stats: 4.9★ Google Rating replaces Studios, 52px numerals
- About: Italic gold headline, image corner tag, fixed broken link
- Classes: No badge pills, gold bottom-reveal on hover
- Trainers: No tag cloud, expanding gold underline
- Membership: Seamless gap grid, corner badge, gold featured price
- Transformations: Italic headline, refined goal badge
- Café: Corner tag, italic headline
- Journal: No card lift hover, italic headline, "Read →"
- Testimonials: Larger quote, gold bar divider, pill dots, no arrows
- CTA Band: Larger headline, italic gold *today.*

**Copy/positioning overhaul (2026-06-11):**  
Entire site reworded for top-tier private membership tone.

| Before | After |
|--------|-------|
| "BUILD YOUR EMPIRE" | "EXCELLENCE IS PRIVATE" |
| "Join Now" | "Enquire" |
| "Start Your Journey" | "Request an Introduction" |
| "TRAIN DIFFERENT" | "YOUR DISCIPLINES" |
| "Simple plans. Serious results." | "Three tiers. One standard." |
| Starter / Pro / Elite | Essential / Signature / Private |
| "Real people. Real change." | "Their commitment. Our craft." |
| "FUEL THE MACHINE" | "NOURISHED WITH INTENTION" |
| "Where elite bodies are built..." | "Private fitness. Considered in every detail." |

**Cleanup (2026-06-11):**
- Deleted `public/hero-1.jpeg` (duplicate)
- Deleted 5 unused Next.js template SVGs from `/public`
- Removed `styled-components` and `playwright` from production dependencies ✅ (#38)
- Moved `@sanity/vision` to devDependencies ✅ (#39)
- Added `.superpowers/` to `.gitignore`
- Updated `AGENTS.md`, `README.md`, `improvements.md` with current state
- Fixed `walkthough.md` typo (file renamed context only — content updated)

---

## 🔴 Critical — Fix Before Launch

### 1. ~~Hero Carousel Has a Duplicate Slide~~ ✅ Fixed
~~Slides 1 and 2 had identical copy. Removed duplicate slide, now 3 unique slides.~~

### 2. ~~Duplicate Hero Image Files~~ ✅ Fixed
~~`public/hero-1.jpeg` deleted.~~

### 3. ~~"Our Story" Link Goes to Membership Page~~ ✅ Fixed
~~Replaced with "Est. 2019 · Jubilee Hills, Hyderabad" static tagline.~~

### 4. Membership Plan Buttons Do Nothing
`components/membership/MembershipPageContent.tsx:285–291`  
The plan CTA `<button>` elements have no `onClick` handler. Need to link to WhatsApp enquiry or a booking flow.

### 5. Privacy & Terms Pages Are Linked But Missing
Footer links to `/privacy` and `/terms` which return 404. Create simple static pages.

### 6. Stats Ticker Animation Is Not Seamless
`components/transformations/TransformationsPageContent.tsx:407–434`  
Fixed `x: [0, -1200]` breaks on different viewport widths. Use dynamic width calculation.

---

## 🟠 Content / Brand — Needs Real Data

### 7. All Trainer Names Are Fictional
`lib/trainers-data.ts` — Replace Sarah Jenkins, Marcus Chen, Elena Rostova, David Vance with real IGYM trainers.

### 8. All Images Are Unsplash Placeholders
Replace every image sitewide with real IGYM photography (trainers, classes, transformations, café, hero, about).

### 9. ~~Footer Instagram Link~~ ✅ Fixed
~~Now correctly links to `https://www.instagram.com/igymindia/`~~

### 10. Footer Address / Email / Phone Are Placeholders
- Address: "Plot No. 45, luxury District, Jubilee Hills" — needs real address
- Email: `contact@igym.in` — verify active
- Phone: `+91 98765 43210` — needs real number
- Google Maps: needs actual IGYM location link

### 11. ~~Copyright Year~~ ✅ Fixed
~~Updated to © 2026.~~

### 12. WhatsApp Number Is a Placeholder
Set `NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX` in `.env.local`.

### 13. Café Menu Items Share Duplicate Images
`components/cafe/CafePageContent.tsx` — Multiple items reuse the same Unsplash URLs.

### 14. Transformation Photos Are Duplicated / Wrong Images
`components/transformations/TransformationsPageContent.tsx` — Maya and Vikram share identical before/after images.

### 15. ~~"6 Studios" Stat~~ ✅ Fixed
~~Replaced with "4.9★ Google Rating" which is more accurate and more powerful as social proof.~~

---

## 🟡 UX / Feature Gaps

### 16. Classes Have No Dedicated Page
No `/classes` route. Class cards are not clickable. Need a schedule/classes page.

### 17. No Contact/Enquiry Form
All enquiries via WhatsApp only. An enquiry form (name, email, goal) would improve conversion.

### 18. No Email Lead Capture
No newsletter signup or waitlist mechanism.

### 19. No Route Transition Animations
Page-to-page transitions exist only on initial load. A subtle fade between routes would elevate the feel.

### 20. Testimonials Are Few and Anonymous
Only 3 quotes with no member photos. 6+ testimonials with photos or initials + tier would be more credible.

### 21. No Video Showcase Section
A cinematic facility video (muted autoplay) would be the single most impactful addition for the premium audience.

### 22. Hero Video Support Not Implemented
`HeroSlide` type has `type: 'video' | 'image'` but video rendering branch is not coded.

### 23. Journal Has No Search
Category filters only — no keyword search.

### 24. No Trust Indicators on Hero
No Google rating, Instagram count, or member count on the hero slide.

---

## 🟡 Data / CMS Integration

### 25. Sanity CMS Not Connected to Any Page
Schemas, client, and GROQ queries exist in `lib/sanity/` but zero pages call the Sanity client. Connecting would make all content editable via the Studio.

### 26. Trainer Data Duplicated
`lib/trainers-data.ts` and `components/sections/TrainersPreview.tsx` both define trainers independently. Consolidate on Sanity connection.

### 27. Transformation Data Duplicated
`TransformationsPreview.tsx` and `TransformationsPageContent.tsx` both hardcode transformation data.

### 28. No `.env.example` File
Create `.env.example` listing: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.

---

## 🟢 Design Refinements

### 29. ~~Hero Visual Hierarchy Fixed~~ ✅ Fixed
~~Subline now correctly appears below headline.~~

### 30. ~~Navbar Trimmed~~ ✅ Fixed
~~Reduced from 8 to 5 links. "JOIN NOW" → "ENQUIRE".~~

### 31. ~~Page Loader Upgraded~~ ✅ Fixed
~~Gold sweep line animation added.~~

### 32. ClassesPreview Cards Still Not Clickable
Cards have hover effect but no link. Either add a `/classes` route or open a modal.

### 33. Comparison Slider Handle Too Small on Mobile
24px handle is below 44px minimum touch target. Increase for mobile.

### 34. Membership Inner Page Still Uses Old Plan Names
`MembershipPageContent.tsx` still shows "Starter/Pro/Elite". Update to "Essential/Signature/Private" to match the homepage preview.

---

## 🟢 Code Quality

### 35. ~~`styled-components` Unused Dependency~~ ✅ Fixed
~~Removed from package.json.~~

### 36. ~~`@sanity/vision` in Wrong Dependency Block~~ ✅ Fixed
~~Moved to devDependencies.~~

### 37. No `.env.example` File (see #28)

### 38. No Custom 404 / `not-found.tsx`
When a trainer or article slug is not found, no branded 404 page is shown.

### 39. Pre-existing ESLint Warnings
`CustomCursor.tsx` and `TransformationsPreview.tsx` have `setState-in-effect` and `<img>` warnings that predate the redesign. Fix in a dedicated cleanup pass.

---

## 🟢 SEO / Performance

### 40. No OG Images
No `openGraph.images` on root or per-page metadata.

### 41. No Structured Data (JSON-LD)
No LocalBusiness, Article, or Person schema.org markup.

### 42. No Sitemap or robots.txt

### 43. No Image Blur Placeholders
`next/image` usage lacks `placeholder="blur"` for LCP improvement.

### 44. `priority` Missing on Above-Fold Class Images
`ClassesPreview.tsx` — first 2 cards need `priority` flag on `next/image`.

---

## Summary

| Status | Count |
|--------|-------|
| ✅ Completed | 12 |
| 🔴 Critical (pre-launch) | 3 |
| 🟠 Content / Real Data | 7 |
| 🟡 UX Features | 9 |
| 🟡 CMS Integration | 4 |
| 🟢 Design / Code / SEO | 10 |
| **Remaining** | **33** |
