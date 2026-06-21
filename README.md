# IGYM — Private Luxury Fitness Website

Premium fitness facility website for IGYM, Jubilee Hills, Hyderabad.  
**Instagram:** [@igymindia](https://www.instagram.com/igymindia/)

---

## Stack

- **Next.js 16.2.9** (App Router) + **React 19**
- **Tailwind CSS v4** — CSS-first config in `app/globals.css`, no `tailwind.config.js`
- **Framer Motion 12** — Cinematic Precision easing `cubic-bezier(0.22, 1, 0.36, 1)`
- **Sanity v5** — CMS (schemas ready, not yet connected to pages)
- **Lenis** — Smooth scroll
- **TypeScript 5**

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Sanity Studio

Available at [http://localhost:3000/studio](http://localhost:3000/studio) when running locally.

---

## Project Structure

```
app/                    — Next.js App Router pages
components/
  layout/               — Navbar, Footer, PageLoader, SiteLayout, CustomCursor, WhatsAppFAB
  sections/             — 11 homepage sections
  ui/                   — EyebrowLabel, GoldDivider, ParallaxImage, AnimatedText
  cafe/ membership/ trainers/ journal/ transformations/  — Page content components
lib/
  trainers-data.ts      — Static trainer data (placeholder — connect Sanity when ready)
  journal-data.ts       — Static article data (placeholder — connect Sanity when ready)
  sanity/               — Sanity client, GROQ queries, TypeScript types
sanity/schemas/         — CMS document schemas
public/                 — hero-1.png, hero-2.png, hero-3.png, about.png
docs/superpowers/       — Design specs and implementation plans
```

---

## Design System

Brand palette and motion tokens live in `app/globals.css` (`@theme` block):

| Token | Value | Use |
|-------|-------|-----|
| `--color-gold` | `#C4A35A` | Single focal accent per section |
| `--color-charcoal` | `#141414` | Dark sections, hero |
| `--color-beige-light` | `#FAF7F2` | Page background |
| `--font-display` | Cormorant Garamond | Headlines, quotes |
| `--font-body` | DM Sans | UI, labels, body |
| `--ease-cinematic` | `cubic-bezier(0.22, 1, 0.36, 1)` | All transitions |

---

## Current State

The UI is fully designed and built. Content is currently placeholder:
- Trainer names and images are examples — replace with real IGYM staff
- All images are Unsplash placeholders — replace with real photography
- Sanity CMS schemas are ready — connect queries in page components when content is populated
- See `improvements.md` for the full pending items list
