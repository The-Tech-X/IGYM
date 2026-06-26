# IGYM — Real Content Checklist

Legend: ✅ Done · ⏳ Still needed · 🔁 Redesigned (no longer requires this data)

---

## 1. Business Basics

| Field | Status | Value in Code |
|---|---|---|
| Gym name | ✅ | IGYM |
| Established year | ✅ | 2023 |
| Address | ✅ | Diamond Hills, Gachibowli, Hyderabad - 500032, Telangana, India |
| Google Maps link | ✅ | https://maps.app.goo.gl/bvgh9xYwbD5rBxtt8 |
| Contact email | ✅ | igymindia@gmail.com |
| Phone number | ✅ | +91 94546 94546 |
| WhatsApp number | ✅ | 919454694546 (set in all 5 files + env fallback) |
| Instagram | ✅ | https://www.instagram.com/igymindia/ |
| YouTube | ✅ | https://www.youtube.com/@igymindia |
| Corporate/B2B email | ✅ | Removed — FAQ now points to WhatsApp/email |

---

## 2. Business Hours

| Day | Status | Value in Code |
|---|---|---|
| Monday – Saturday | ✅ | 5:00 AM – 10:00 PM |
| Sunday | ✅ | 6:00 AM – 12:00 Noon |

> Note: Sunday deep-cleaning note is not shown in footer (kept minimal). Add it if you want it visible.

---

## 3. Stats Banner

| Stat | Status | Value in Code |
|---|---|---|
| Total members | ✅ | 345+ |
| Expert coaches | ✅ | 10 |
| Google rating | ✅ | 4.6★ |
| Year established | ✅ | 2023 |

---

## 4. Trainers ⏳

All 3 trainer profiles are still fake (Arjun Mehta, Priya Nair, Rahul Sinha). Add real trainers via **Supabase** (trainers table) or tell me the details and I'll update the mock data.

For each real trainer, you need:
- Full name
- Role / specialization
- Short bio (2–3 sentences)
- Certifications (list each)
- Availability / weekly schedule
- Profile photo *(upload to Supabase `trainer-images` bucket)*

---

## 5. Membership Plans ⏳

Prices and plan names are currently placeholder. Confirm or correct:

| Plan | Monthly | Quarterly | Annual |
|---|---|---|---|
| Essential | ₹2,500 | ₹6,500 | ₹22,000 |
| Signature | ₹4,000 | ₹10,500 | ₹36,000 |
| Private | ₹7,500 | ₹19,500 | ₹68,000 |

Also confirm the **feature lists** for each plan shown on the membership page are accurate.

---

## 6. Membership FAQ ⏳

6 FAQ answers exist in the code but are placeholder policies. Replace with IGYM's real policies:

1. **Can I pause my membership?** — Current: up to 14/30/60 days by tier. Is this correct?
2. **Is there an initiation fee?** — Current: ₹2,500 for Essential & Signature; waived for Private. Correct?
3. **Can I move between tiers?** — Current: upgrade mid-cycle, downgrade at end of billing. Correct?
4. **What is the guest visit policy?** — Current: 1/mo for Signature, 4/mo for Private. Correct?
5. **Do you offer corporate arrangements?** — Now points to WhatsApp/email. Tweak wording if needed.
6. **How do I schedule PT sessions?** — Mentions IGYM app. Correct?

---

## 7. Testimonials ⏳

3 fake testimonials still in the code (Rohan Kapoor, Dr. Priyamvada Sen, Siddharth Goel).

For each real testimonial provide:
- Member name (or initials)
- Member since (year)
- Quote (1–3 sentences)

File: `components/sections/TestimonialsSection.tsx`

---

## 8. Transformations Page ✅ / ⏳

The before/after client photo gallery has been **removed**. The page now shows IGYM's 4-step process:
1. Deep Assessment
2. Personalised Blueprint
3. Weekly Coaching
4. Measurable Outcomes

The **Coaching Packages** section (Foundation / Signature Programme / Private Coaching) still has placeholder prices:

| Package | Sessions | Price |
|---|---|---|
| Foundation | 8 sessions | ₹18,000 |
| Signature Programme | 24 sessions | ₹48,000 |
| Private Coaching | Ongoing retainer | ₹75,000 |

Confirm these or provide real pricing.

---

## 9. Journal / Blog Articles ⏳

3 fake articles exist in mock data (used as fallback when Supabase returns nothing). Add real articles via **Supabase** (journal_posts table) or via the admin panel at `/admin`.

For each article:
- Title
- Author (must be an existing trainer)
- Cover image *(upload to Supabase `article-images` bucket)*
- Body content (written in the admin editor)

---

## 10. Images Still Needed ⏳

All public-facing images are currently Unsplash stock photos (loaded as fallback when Supabase image URLs are null). Upload real photos to Supabase buckets to replace them.

| What | Supabase Bucket | Notes |
|---|---|---|
| Trainer profile photos | `trainer-images` | One per trainer |
| Article cover images | `article-images` | One per article |
| Cafe hero image | `cafe-images` | Main cafe/menu page image |
| About section image | *(in `/public/Images/`)* | Currently `IGYM 01.jpg` — already a real photo, just not in git |
| Hero carousel images | *(in `/public/Images/`)* | `hero3.png`, `hero1.png`, `hero2.png` are live |
| Intro film | `public/Videos/` | Already recorded; host on Supabase Storage or Cloudflare R2 and set URL |

---

## 11. Cafe Menu ⏳

The cafe page exists and loads items from Supabase (`cafe_menu` table). Add real items via the admin panel at `/admin`.

For each menu item:
- Name
- Category (Pre-Workout / Post-Workout / Meals / Juices / Shakes)
- Description
- Price (₹)
- Photo *(upload to Supabase `cafe-images` bucket)*
- Macros: protein (g), carbs (g), fat (g), calories

---

## 12. Privacy Policy & Terms pages ⏳

Footer links to `/privacy` and `/terms` — these pages don't exist yet. Either:
- Create them with real legal content
- Or remove the links from the footer until ready

---

## 13. The Circle — Notable Members ⏳

Section is live on the homepage (between Testimonials and CTA). Currently showing 6 placeholder cards with Unsplash photos.

For each real person, provide:
- Full name (or how they want to be credited)
- Title / handle (e.g. "Film Actor · Telugu", "Founder & CEO", "National Athlete", "@handle · 2M+ Followers")
- Portrait photo — ideally vertical/portrait orientation (9:16 ratio works best)
- Short video (optional, 15–60 sec) — if they recorded a testimonial reel/story

How to update: edit the `CIRCLE` array in `components/sections/TheCircleSection.tsx`.  
Set `isFeatured: true` on one person to give them a gold border and top bar highlight.

---

## Summary — What's Left Before Launch

| Area | Status |
|---|---|
| Business info (address, contact, hours, social) | ✅ Done |
| Stats banner | ✅ Done |
| Transformations page | ✅ Redesigned — no fake data |
| The Circle section | ✅ Built — add real people to `TheCircleSection.tsx` |
| About page | ✅ Built — replace founder photo when ready |
| Cafe logo (TheProTeinCO.png) | ✅ Showing — needs to be hosted (not in git) |
| Homepage section order | ✅ Resequenced for conversion flow |
| Build | ✅ Passing — 28 pages, zero errors (2026-06-26) |
| Trainers | ⏳ Add real trainers via Supabase/admin |
| The Circle — real people | ⏳ Replace 6 placeholders in `TheCircleSection.tsx` |
| Founder photo | ⏳ Replace `FOUNDER_PLACEHOLDER` in `AboutPageContent.tsx` |
| Membership prices & FAQ | ⏳ Confirm/correct current values |
| Testimonials | ⏳ Replace 3 fake ones |
| Journal articles | ⏳ Add real articles via admin panel |
| Images (trainers, articles, cafe) | ⏳ Upload to Supabase buckets |
| Cafe menu | ⏳ Add real items via admin panel |
| PT coaching package prices | ⏳ Confirm on transformations page |
| TheProTeinCO.png hosting | ⏳ Remove from .gitignore OR host on Supabase Storage |
| Privacy & Terms pages | ⏳ Create or remove footer links |
