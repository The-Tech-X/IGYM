# IGYM Homepage: Premium Visual & Motion Analysis

This document provides a detailed breakdown of the visual hierarchy, layout design, typography, color palettes, and custom motion effects of the **IGYM Landing Page** (Jubilee Hills, Hyderabad).

All analysis has been verified by running the live Next.js application, triggering local interactive events, and inspecting the actual stylesheet configurations (`app/globals.css`).

---

## 🎨 Global Design System & Tokens
The application follows a curated, luxury brand system characterized by **Quiet Confidence**:
*   **Color Palette:**
    *   `--color-charcoal` (`#141414`): Primary dark tone used for dark sections, text headers, and hero backgrounds.
    *   `--color-charcoal-mid` (`#2A2A2A`): Secondary dark tone for card components.
    *   `--color-beige-light` (`#FAF7F2`): Page background and light-section contrast base.
    *   `--color-beige-mid` (`#F0EBE0`): Mid-contrast background for focus bands.
    *   `--color-gold` (`#C4A35A`): Single focal brand accent.
    *   `--color-gold-light` (`#D4B870`): Brightened gold state.
    *   `--color-gray-muted` (`#8C8C8C`): Low-contrast labels and helper text.
*   **Typography:**
    *   **Headings / Display:** *Cormorant Garamond* (`font-display`, serif) - light weights, italic highlights.
    *   **UI / Copy:** *DM Sans* (`font-body`, sans-serif) - geometric, tracking-heavy.
*   **Transitions:**
    *   `--transition-premium`: `0.7s cubic-bezier(0.22, 1, 0.36, 1)` (Cinematic ease-out).

---

## 🧭 Header & Navigation
*   **Layout:** Seamless top overlay, absolute positioning over the Hero Carousel. Max-width of `1440px` with horizontal padding (`px-6 md:px-12 lg:px-24`).
*   **Visual Assets:** Left-aligned `iGYM` text logo in modern uppercase type. Five centered navbar links: *Trainers, Membership, Café, Transformations, Journal*.
*   **Interactions:** Navbar items fade-highlight on hover. The far-right "Enquire" CTA is housed inside a sharp, border-styled container that fills solid on hover.
*   **Animations:** The custom page loader fades out over 1.8 seconds, sweeping a gold line across the page before revealing this header.

---

## 1. Hero Carousel (`HeroCarousel.tsx`)
*   **Content:** Rotator showing high-resolution space portraits of the luxury training environment, trainers, and cafe, paired with left-aligned typographic panels.
*   **Colors & Styles:** Page-wide dark layout (`bg-charcoal`). Linear gradient overlay (`rgba(8,6,4,0.12)` to `rgba(8,6,4,0.72)`) darkens the bottom-left corner for text readability.
*   **Typography:**
    *   Eyebrow: `text-gold` with tracking `0.32em`, paired with a horizontal line prefix (`w-6 h-px bg-gold`).
    *   Headline: `clamp(72px, 9vw, 120px)` size, Cormorant Garamond, uppercase.
    *   Subline: `text-white/50`, uppercase tracking `0.28em`, `font-light`.
*   **Animations:**
    *   **Background Zoom:** Images transition with a scale of `1.08` to `1.0` and opacity fade-in over 1.1s using cinematic easing.
    *   **Word Stagger:** Headline splits into words, revealing upward word-by-word with a `0.08s` stagger sequence.
    *   **Progress Indicators:** A bottom-aligned linear progress bar expands from 0% to 100% width over a 6-second slide cycle.
*   **Screenshots:**
    *   ![Slide 1: Customer Lounge](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/hero_slide_1_1781761931313.png)
    *   ![Slide 2: Coached at the Highest Level](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/hero_slide_2_1781761951386.png)

---

## 2. Scroll Expand Film (`ScrollExpandFilm.tsx`)
*   **Content:** Full screen video panel looping interior workout sequences.
*   **Layout:** Nested inside a 300vh scrolling track. The video container is absolute positioned on a sticky layout.
*   **Visual Assets:** Looped high-quality video `/IGYM Vedio 03.MP4` with overlay text "Inside iGym" and "Where the work is done."
*   **Animations:**
    *   **Scroll-Driven Scale:** The video begins scaled down to `0.62` size with a rounded frame (`border-radius: 16px`). As the page scrolls from 0% to 80% scroll progress, the container smoothly scales up to full bleed (`1.0`) and the border-radius decreases to `0px`.
    *   **Overlay Reveal:** The title text fades in from `opacity: 0` to `1.0` and slides up during the 55% to 90% scroll phase.
*   **Screenshots:**
    *   ![Initial Scale - 600px Scroll Depth](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/expand_film_600px_1781761967155.png)
    *   ![Full Bleed Expansion - 1000px Scroll Depth](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/expand_film_1000px_1781761974883.png)

---

## 3. Stats Banner (`StatsBanner.tsx`)
*   **Content:** 4 statistical figures demonstrating gym performance:
    *   *Members:* 2400+
    *   *Expert Coaches:* 14
    *   *Google Rating:* 4.9★
    *   *Est.:* 2019
*   **Colors & Styles:** Dark band background (`bg-charcoal`), white numbers, gold labels. Thin gold borders (`border-gold/10`) separate columns on larger displays.
*   **Typography:** Numbers are styled with `font-display` (Cormorant, `font-light`, `text-[52px] md:text-[58px]`). Suffix elements (+, ★) are rendered in a slightly smaller, dedicated gold accent format.
*   **Animations:**
    *   **Count-Up:** Triggered immediately when scrolled into view. Numbers count up from 0 to target value in a smooth animation.
    *   **Fade-Up:** Columns stagger-slide up (`y: 28` to `0`) and fade in.
*   **Screenshots:**
    *   ![Stats Banner - Fully Loaded Stats](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/stats_banner_1781761991188.png)

---

## 4. About Section (`AboutSection.tsx`)
*   **Content:** Two-column split layout representing the founding standard of iGYM.
*   **Colors & Styles:** Light layout (`bg-white`). Left side: Aspect `4/3` image of space `/IGYM 01.jpg` with a charcoal corner badge. Right side: Editorial text.
*   **Typography:**
    *   Heading: `Not just a gym. A standard.` with italic gold accent tag (`A standard.`).
    *   Quote Block: Custom quote inside a container with a gold left border (`border-l-2 border-gold pl-6 py-1`). Font size is `22px` in italic Cormorant Garamond.
*   **Animations:** Left image slides in from the left (`x: -50` to `0`), while the right column slides in from the right (`x: 50` to `0`) with a `0.15s` entrance offset.
*   **Screenshots:**
    *   ![About Section Layout](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/about_section_1781762006088.png)

---

## 5. Classes Preview (`ClassesPreview.tsx`)
*   **Content:** 4-column cards grid displaying disciplines: *Strength*, *Yoga & Mobility*, *CrossFit*, and *Functional*.
*   **Colors & Styles:** Light beige background (`bg-beige-light`). Cards are styled with high-contrast, dark-masked background images and white captions.
*   **Animations:**
    *   **Hover Zoom:** Hovering over a card triggers a slight scale increase (`scale-[1.04]`), image brightening, and slides the card upwards (`y: -4`).
    *   **Gold Bottom Border:** A gold indicator line slides from left to right at the bottom edge on hover (`scale-x-0` to `scale-x-100` transition-transform).
*   **Screenshots:**
    *   ![Classes Grid - Strength Hover State](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/classes_strength_hover_v2_1781762114128.png)

---

## 6. Trainers Preview (`TrainersPreview.tsx`)
*   **Content:** Carousel of key training specialists fetched dynamically from Supabase.
*   **Colors & Styles:** White section background. Cards show grayscale portraits with their role/specialty captions underneath.
*   **Animations:**
    *   **Color Transition:** Card images transition from full grayscale to standard color on hover (`grayscale group-hover:grayscale-0`).
    *   **Scale Zoom:** Card image scales up slightly (`group-hover:scale-[1.03]`).
    *   **Gold Underline:** A gold line under their name expands on hover (`group-hover:w-10`).
*   **Screenshots:**
    *   ![Coaches Section - Arjun Mehta Hover Active](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/trainers_arjun_hover_1781762138988.png)

---

## 7. Membership Preview (`MembershipPreview.tsx`)
*   **Content:** 3-column pricing tier list: *Essential*, *Signature*, and *Private*.
*   **Colors & Styles:** Dark section (`bg-charcoal`). Standard columns are deep charcoal. The centered "Signature" column is highlighted with `bg-charcoal-mid` (slightly lighter) and a top-right gold badge labelled `Popular`. The grid divisions are formed by 1px gaps over a translucent white track.
*   **Interactions:** The highlighted Signature tier features a filled gold button (`bg-gold text-charcoal`), while others feature minimalist border outlines.
*   **Screenshots:**
    *   ![Membership Plans Grid](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/membership_preview_1781762160983.png)

---

## 8. Transformations Preview (`TransformationsPreview.tsx`)
*   **Content:** 3 side-by-side client transformation cards, showing before and after physical outcomes.
*   **Colors & Styles:** Light beige base (`bg-beige-light`). The compare sliders use custom gold boundaries with a centered dragging button.
*   **Interactions:** The user can hover and slide the divider handle horizontally to adjust the visibility of the before/after images.
*   **Screenshots:**
    *   ![Before/After Grid - Post-Dragging State](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/transformations_post_drag_1781762226623.png)

---

## 9. Statement Section (`StatementSection.tsx`)
*   **Content:** Large-type quote layout scrolling over a 250vh track:
    > "We don't sell memberships. We accept a standard of commitment — and we meet it with ours."
*   **Colors & Styles:** Solid dark backdrop (`bg-charcoal`).
*   **Typography:** Cormorant Garamond, display style (`text-[32px] md:text-[56px] font-light leading-[1.3]`). The final clause *and we meet it with ours.* is highlighted in italic gold.
*   **Animations:** The section locks in place as the user scrolls. Individual words fade from a dim background state (`opacity: 0.15`) to full brightness (`1.0`) one-by-one as the user scrolls.
*   **Screenshots:**
    *   ![Statement Section Scroll Reveal](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/statement_section_1781762248767.png)

---

## 10. Café Preview (`CafePreview.tsx`)
*   **Content:** 2-column split layout showcasing iGYM performance nutrition.
*   **Colors & Styles:** White section background. Left side: Parallax-scroll image `/IGYM Cafe for Clients.png`. Right side: Title copy and feature list (Macro-tracked meals, Cold-pressed juices, Protein shakes).
*   **Interactions:** Features display custom Lucide icons (Award, Leaf, Compass) enclosed inside a gold-bordered container.
*   **Screenshots:**
    *   ![Cafe Feature Preview Section](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/cafe_preview_1781762294582.png)

---

## 11. Journal Preview (`JournalPreview.tsx`)
*   **Content:** 3 blog articles showing category badges, publishing details, title headlines, excerpts, and image links.
*   **Colors & Styles:** Light beige base (`bg-beige-light`). Article blocks are styled with clean white card shapes.
*   **Animations:** Hovering over a card triggers the cover image to scale up slightly (`scale-103`), transitions the title to gold, and reveals a slide-in gold bottom border indicator.
*   **Screenshots:**
    *   ![Journal Grid - First Article Hover Active](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/journal_card_hover_1781762320979.png)

---

## 12. Testimonials Section (`TestimonialsSection.tsx`)
*   **Content:** Carousel quote rotator featuring member testimonials.
*   **Colors & Styles:** Dark backdrop (`bg-charcoal`). A large double quotation mark (`"`) rendered with a low opacity of 10% is placed in the background.
*   **Interactions:** Testimonials transition on a 5-second automatic timer. Clicking the indicators at the bottom switches quotes directly.
*   **Screenshots:**
    *   ![Testimonials Quote Rotator](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/testimonials_section_1781762339593.png)

---

## 13. CTA Band & Footer
*   **Content:**
    *   **CTA Band:** Beige-mid background band displaying "The standard you set. Begins here." and the primary dark "Request an Introduction" button.
    *   **Footer:** 4-column layout:
        *   Column 1: iGYM logo and introductory statement.
        *   Column 2: Site links (Explore).
        *   Column 3: Location details (Visit Us - Jubilee Hills).
        *   Column 4: Email, phone, and Instagram hooks.
*   **Screenshots:**
    *   ![CTA Band and Footer Sections](C:/Users/Teja Vardhan Reddy/.gemini/antigravity-ide/brain/4f1324d8-cfda-4a9f-90c0-7bafc9a220c0/footer_section_1781762368458.png)

---

## 📂 Public Directory Images: Detailed Visual Inspection & Placement Analysis

This section analyzes the newly updated media assets located in the `/public/Images` directory, describing the exact content, style, lighting, mood, and optimal placements for each asset.

### 1. Cardio Lineup (`Cardio Lineup.jpg`)
* **What is displayed**: An aligned row of high-end cross-trainers/elliptical cardio machines in front of large windows overlooking exterior green trees. The machines are modern, black, with large electronic consoles.
* **Style, Lighting, Mood**: Moody dark theme, with warm golden spotlights pointing down at each machine. Polished dark flooring creates high-end reflections of the lights, giving a private, exclusive, quiet luxury aesthetic.
* **Optimal Placement**: Classes Preview (Conditioning card), a dedicated Gallery page, or dynamic backgrounds for Trainers/Transformations.

### 2. Clients Lounge (`Clients Lounge.jpg`)
* **What is displayed**: A cozy lounge setting with two premium tan leather armchairs facing a minimalist round black metal coffee table. Behind them is a warm wood bookcase unit illuminated with soft golden uplighting and stocked with premium books and design items.
* **Style, Lighting, Mood**: Warm golden tones, rich wood finishes, cozy and intimate. It evokes a private members' club vibe.
* **Optimal Placement**: Cafe Preview on the home page (as the parallax image or sidebar content), or pages like Membership/Cafe.

### 3. Customer Lounge (`Customer Lounge.jpg`)
* **What is displayed**: A wider perspective of the customer lounge/reception area. In the foreground are grey upholstered chairs and a tan leather armchair around low wood coffee tables. In the background is a sleek black beverage/bar counter with warm spotlights.
* **Style, Lighting, Mood**: Warm, premium, sophisticated hospitality lobby mood. Elegant contrast between dark charcoal and warm wood/leather.
* **Optimal Placement**: Hero Carousel (Slide 1), Cafe page, or Membership preview page.

### 4. Dumbell Strength Area (`Dumbell Strength Area.jpg`)
* **What is displayed**: A premium free-weight strength training zone. Features multiple tiers of high-quality custom dumbbells on heavy-duty racks. A flat bench is in the foreground, with mirrored walls and other strength training cables in the background. Mirrors have integrated soft backlighting.
* **Style, Lighting, Mood**: Dark, moody, athletic luxury, focused. Warm reflections from spotlights off the clean floor.
* **Optimal Placement**: Hero Carousel (Slide 2), Classes Preview (Strength card), or Trainers page.

### 5. IGYM 01 (`IGYM 01.jpg`)
* **What is displayed**: A spacious indoor workout studio showcasing athletic conditioning facilities. Features a custom green turf track with sleds, kettlebells on racks, boxing heavy bags, concrete columns with wood panels, and high ceilings with strip lighting. Large windows let in daylight.
* **Style, Lighting, Mood**: Clean, modern, high-end athletic club. Combination of warm wood accents and charcoal grey.
* **Optimal Placement**: About section (Parallax image), Trainers page, or Classes Preview.

### 6. IGYM 04 (`IGYM 04.jpg`)
* **What is displayed**: A lineup of advanced selectorized resistance machines (chest press, leg press, etc.) neatly aligned against a glass wall showing other areas. Wood paneling on structural columns.
* **Style, Lighting, Mood**: Moody dark, sleek modern, high-performance luxury. Understated elegance with warm spotlighting.
* **Optimal Placement**: Classes Preview (Strength or Conditioning), Trainers page, or a new Gallery section.

### 7. IGYM 05 (`IGYM 05.jpg`)
* **What is displayed**: Free weight lifting and power training zone. Shows commercial squat racks, barbells, weight plates on storage horns, benches, and backlit mirror walls.
* **Style, Lighting, Mood**: Moody dark, intense, focused, premium. High contrast lighting highlighting the equipment.
* **Optimal Placement**: Classes Preview (Strength card), Trainers page, or transformations page.

### 8. IGYM Cafe for Clients (`IGYM Cafe for Clients.png`)
* **What is displayed**: An intimate seating nook featuring two luxury tan leather chairs and a round black coffee table next to a bookcase filled with premium books/decor. (Similar view to Clients Lounge.jpg).
* **Style, Lighting, Mood**: Warm golden, intimate, quiet luxury, peaceful hospitality.
* **Optimal Placement**: Cafe Preview section (Parallax image), or Cafe page.

### 9. IGYM Cafe for Members only (`IGYM Cafe for Members only.png`)
* **What is displayed**: A luxury modern espresso bar. Features a beautiful white marble-top counter with three minimalist black bar stools. In the background are dark wood shelves displaying cups, tea tins, and a premium espresso machine, illuminated by warm backlighting.
* **Style, Lighting, Mood**: Warm golden, clean modern, sophisticated luxury. Strong contrast of white marble against dark textures.
* **Optimal Placement**: Cafe page (main hero/page image), or Cafe Preview on Home page.

### 10. Treamills Line Up (`Treamills Line Up.jpg`)
* **What is displayed**: A row of high-end treadmills facing a large floor-to-ceiling window overlooking lush green trees. Each treadmill features a large interactive console. Warm wood pillars divide the window bays.
* **Style, Lighting, Mood**: Clean modern, bright natural light, warm wood and cove lighting. High-end cardio training experience.
* **Optimal Placement**: Classes Preview (Conditioning card), or Membership page.

### 11. Washrooms with lockers (`Washrooms with lockers.jpg`)
* **What is displayed**: A five-star hotel quality locker room vanity area. Features backlit round mirrors, sleek black undermount sinks, premium dark faucets, rolled towels, and luxury charcoal/wood locker bays.
* **Style, Lighting, Mood**: Dark, moody, five-star wellness spa luxury. Sophisticated, clean, and warm.
* **Optimal Placement**: Membership page (showing the luxury amenities), or a new Gallery page.

### 12. hero3 (`hero3.png`)
* **What is displayed**: Architectural detail of the gym interior, focusing on the dark curved ceiling and sleek, metallic pillars or design elements, with warm spotlighting.
* **Style, Lighting, Mood**: Artistic, moody dark, premium.
* **Optimal Placement**: Hero Carousel (currently slide 3), or journal preview page.

