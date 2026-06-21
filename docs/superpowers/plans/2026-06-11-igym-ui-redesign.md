# IGYM Psychological UI/UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all homepage sections and shared layout components to feel premium, editorial, and psychologically compelling — Editorial Luxury personality with Cinematic Precision motion.

**Architecture:** Pure component edits across 15 files. No new files created. No data or routing changes. Each task is independent and safe to commit individually. The design system token update (Task 1) should land first as it affects every subsequent task's hover transitions.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (CSS-first in `app/globals.css`), Framer Motion 12, TypeScript 5.

---

## Prerequisites

- [ ] Start the dev server: `npm run dev` — keep it running throughout. Verify at `http://localhost:3000`.
- [ ] Confirm `public/hero-1.jpeg`, `public/hero-1.png`, `public/hero-2.png`, `public/hero-3.png` all exist. If `hero-1.jpeg` is missing, only `hero-1.png` matters.

---

## Task 1: Design System — Update Motion Easing Tokens

**Files:**
- Modify: `app/globals.css`

The old easing `cubic-bezier(0.16, 1, 0.3, 1)` is slow luxury (1.2–2s feel). The new easing `cubic-bezier(0.22, 1, 0.36, 1)` is cinematic precision — faster initial acceleration, confident deceleration. This one change propagates into every CSS `transition` on the site.

- [ ] **Open `app/globals.css`. Replace the `@theme` block entirely:**

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-beige-light: #FAF7F2;
  --color-beige-mid: #F0EBE0;
  --color-beige-dark: #E0D9CC;
  --color-charcoal: #141414;
  --color-charcoal-mid: #2A2A2A;
  --color-gray-muted: #8C8C8C;
  --color-gold: #C4A35A;
  --color-gold-light: #D4B870;

  /* Typography */
  --font-display: var(--font-cormorant), serif;
  --font-body: var(--font-dm-sans), sans-serif;

  /* Transitions — Cinematic Precision */
  --transition-premium: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  --ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 0.6s;
  --duration-mid: 0.75s;
  --transition-bg: background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

:root {
  --background: #FAF7F2;
  --foreground: #141414;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Hide scrollbar utility */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom Cursor default hides for pointer devices */
@media (pointer: fine) {
  .custom-cursor-active,
  .custom-cursor-active * {
    cursor: none !important;
  }
}

/* Smooth Scrolling */
html.lenis, html.lenis body {
  height: auto;
}

.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis-stopped {
  overflow: hidden;
}

.lenis-scrolling iframe {
  pointer-events: none;
}
```

- [ ] **Verify:** Save. Dev server should hot-reload with no errors. No visual change expected yet — this only changes the CSS custom property value.

- [ ] **Commit:**
```bash
git add app/globals.css
git commit -m "design: update motion easing to cinematic precision (0.22,1,0.36,1)"
```

---

## Task 2: PageLoader — Gold Sweep Animation

**Files:**
- Modify: `components/layout/PageLoader.tsx`

Replace the plain text fade with a sequenced animation: IGYM text fades in, then a gold line sweeps left→right underneath it, then everything fades out together.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 w-full h-full bg-beige-light flex items-center justify-center z-[99999]"
        >
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[48px] md:text-[64px] font-display font-light uppercase tracking-[0.4em] text-charcoal select-none"
            >
              IGYM
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-px bg-gold origin-left mt-3"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Verify:** Hard-refresh `http://localhost:3000`. You should see: IGYM text fades up → gold line sweeps right → overlay fades out. Total duration ~1.8s.

- [ ] **Commit:**
```bash
git add components/layout/PageLoader.tsx
git commit -m "design: gold sweep line animation on page loader"
```

---

## Task 3: Navbar — Trim to 5 Links, Refine Styles

**Files:**
- Modify: `components/layout/Navbar.tsx`

Remove Home, About, Classes from nav. Tighten scrolled state shadow. Refine Join Now button states.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Trainers', href: '/trainers' },
  { name: 'Membership', href: '/membership' },
  { name: 'Café', href: '/cafe' },
  { name: 'Transformations', href: '/transformations' },
  { name: 'Journal', href: '/journal' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  const isDarkHeroPage =
    pathname === '/' ||
    pathname === '/trainers' ||
    pathname === '/transformations' ||
    (pathname.startsWith('/journal/') && pathname !== '/journal');

  const headerClass = isDarkHeroPage && !isScrolled
    ? 'bg-transparent text-white py-6'
    : 'bg-white/95 backdrop-blur-md text-charcoal border-b border-beige-dark py-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]';

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[99] transition-all duration-500 ${headerClass}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">

          {/* Brand */}
          <Link
            href="/"
            className="text-[22px] font-display font-light uppercase tracking-[0.38em] cursor-pointer"
          >
            IGYM
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-body uppercase tracking-[0.18em] transition-colors duration-[600ms] hover:text-gold cursor-pointer ${
                  isActive(link.href) ? 'text-gold border-b border-gold font-medium' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Join CTA + Hamburger */}
          <div className="flex items-center space-x-6">
            <Link
              href="/membership"
              className={`hidden sm:inline-block px-6 py-3 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-[600ms] rounded-none cursor-pointer ${
                isDarkHeroPage && !isScrolled
                  ? 'border border-white/35 text-white hover:bg-white hover:text-charcoal hover:border-white'
                  : 'bg-charcoal text-white hover:bg-gold hover:text-charcoal border border-charcoal hover:border-gold'
              }`}
            >
              Join Now
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-current hover:text-gold transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 w-full h-full bg-beige-light z-[100] flex flex-col justify-between p-6 md:p-12"
          >
            <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
              <span className="text-[22px] font-display font-light uppercase tracking-[0.38em] text-charcoal">
                IGYM
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-charcoal hover:text-gold transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow">
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="flex flex-col items-center space-y-6 text-center"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[28px] md:text-[36px] font-display font-light uppercase tracking-[0.1em] text-charcoal hover:text-gold transition-colors cursor-pointer block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-4"
                >
                  <Link
                    href="/membership"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-block px-10 py-4 bg-charcoal text-white text-[12px] font-body uppercase tracking-[0.2em] font-medium transition-colors hover:bg-gold hover:text-charcoal duration-[600ms] rounded-none cursor-pointer"
                  >
                    Join Now
                  </Link>
                </motion.div>
              </motion.nav>
            </div>

            <div className="text-center text-[11px] font-body uppercase tracking-[0.18em] text-gray-muted w-full max-w-[1440px] mx-auto">
              © 2026 IGYM. ALL RIGHTS RESERVED.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Verify:** On homepage, navbar should show 5 links (Trainers, Membership, Café, Transformations, Journal). Scroll down — should transition to white with subtle shadow. Mobile hamburger opens full-screen overlay.

- [ ] **Commit:**
```bash
git add components/layout/Navbar.tsx
git commit -m "design: trim navbar to 5 links, cinematic easing, refined join button"
```

---

## Task 4: Footer — Year, Instagram URL, Typography

**Files:**
- Modify: `components/layout/Footer.tsx`

Three targeted fixes: copyright year, Instagram link, column label tracking.

- [ ] **In `components/layout/Footer.tsx`, make these 4 changes:**

**Change 1** — Instagram href (line ~27):
```tsx
// Before:
href="https://instagram.com"
// After:
href="https://www.instagram.com/igymindia/"
```

**Change 2** — Footer column titles. Find all instances of the column title class and update tracking:
```tsx
// Before (appears 4 times):
className="text-[11px] font-body uppercase tracking-[0.18em] text-gold font-medium"
// After:
className="text-[9px] font-body uppercase tracking-[0.32em] text-gold font-medium"
```

**Change 3** — Tagline `leading-relaxed` → `leading-[1.7]`:
```tsx
// Before:
className="text-[13px] font-body font-light text-gray-muted leading-relaxed max-w-[240px]"
// After:
className="text-[13px] font-body font-light text-gray-muted leading-[1.7] max-w-[240px]"
```

**Change 4** — Copyright year (line ~148):
```tsx
// Before:
© 2025 IGYM. All rights reserved.
// After:
© 2026 IGYM. All rights reserved.
```

- [ ] **Verify:** Scroll to footer. Column titles should have more breathing room between letters. Instagram icon should link to `@igymindia`. Year shows 2026.

- [ ] **Commit:**
```bash
git add components/layout/Footer.tsx
git commit -m "design: fix footer year/instagram, refine column title tracking"
```

---

## Task 5: HeroCarousel — Cinematic Overhaul

**Files:**
- Modify: `components/sections/HeroCarousel.tsx`

This is the most impactful change. Remove duplicate slide, enlarge headline with `clamp(72px,9vw,120px)`, fix text hierarchy (eyebrow → headline → subline → CTA), update gradient overlay, add scroll indicator, refine controls.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HeroSlide = {
  type: 'video' | 'image';
  src: string;
  eyebrow: string;
  headline: string;
  subline: string;
  cta: { label: string; href: string };
};

const slides: HeroSlide[] = [
  {
    type: 'image',
    src: '/hero-1.png',
    eyebrow: 'Strength & Refinement',
    headline: 'BUILD YOUR EMPIRE',
    subline: 'Premium training. Uncompromising results.',
    cta: { label: 'Explore Membership', href: '/membership' },
  },
  {
    type: 'image',
    src: '/hero-2.png',
    eyebrow: 'World-Class Coaching',
    headline: 'FORGE YOUR STRENGTH',
    subline: 'World-class coaches. Elite-grade equipment.',
    cta: { label: 'Meet the Trainers', href: '/trainers' },
  },
  {
    type: 'image',
    src: '/hero-3.png',
    eyebrow: 'Performance Nutrition',
    headline: 'FUEL THE MACHINE',
    subline: 'Nutrition. Recovery. Performance.',
    cta: { label: 'Visit Our Café', href: '/cafe' },
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];

  const bgVariants = {
    initial: { scale: 1.08, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as any } },
    exit: { opacity: 0, transition: { duration: 0.7 } },
  };

  const wordContainerVariants = {
    animate: { transition: { staggerChildren: 0.08 } },
  };

  const wordVariants = {
    initial: { y: 56, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
    },
    exit: {
      y: -24,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-charcoal">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full h-full"
          >
            <Image
              src={currentSlide.src}
              alt={currentSlide.headline}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Cinematic gradient — darkens bottom-left, keeps image visible top-right */}
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(8,6,4,0.12)_0%,rgba(8,6,4,0.28)_35%,rgba(8,6,4,0.72)_100%)] z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content — bottom-left anchor */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-24">
        <div className="max-w-4xl text-white">

          {/* Eyebrow with gold line */}
          <motion.div
            key={`eyebrow-${currentIndex}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <span className="text-[10px] font-body uppercase tracking-[0.32em] text-gold">
              {currentSlide.eyebrow}
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <motion.h1
            key={`title-${currentIndex}`}
            variants={wordContainerVariants}
            initial="initial"
            animate="animate"
            className="font-display font-light leading-[0.95] tracking-[-0.025em] uppercase mb-6"
            style={{ fontSize: 'clamp(72px, 9vw, 120px)' }}
          >
            {currentSlide.headline.split(' ').map((word, index) => (
              <span key={index} className="inline-block overflow-hidden mr-[0.22em] pb-1">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subline — below headline */}
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] md:text-[13px] font-body font-light uppercase tracking-[0.28em] mb-8 text-white/50"
          >
            {currentSlide.subline}
          </motion.p>

          {/* CTA */}
          <motion.div
            key={`cta-${currentIndex}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={currentSlide.cta.href}
              className="inline-block px-8 py-4 border border-white/35 text-white text-[10px] font-body uppercase tracking-[0.2em] font-medium transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-charcoal hover:border-white rounded-none cursor-pointer"
            >
              {currentSlide.cta.label}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Prev/Next controls — bottom-left */}
      <div className="absolute bottom-10 left-6 md:left-12 lg:left-24 z-30 flex items-center space-x-3">
        <button
          onClick={handlePrev}
          className="p-2.5 border border-white/20 text-white hover:bg-white hover:text-charcoal hover:border-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={handleNext}
          className="p-2.5 border border-white/20 text-white hover:bg-white hover:text-charcoal hover:border-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Slide counter — bottom-right */}
      <div className="absolute bottom-10 right-6 md:right-12 lg:right-24 z-30 text-[10px] font-body uppercase tracking-[0.22em] text-white/35">
        0{currentIndex + 1} <span className="opacity-40">/</span> 0{slides.length}
      </div>

      {/* Scroll indicator — bottom-center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pb-5">
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-9 bg-gradient-to-b from-white/50 to-transparent origin-top"
        />
        <span className="text-[7px] tracking-[0.25em] text-white/30 uppercase">Scroll</span>
      </div>

      {/* Progress bar — very bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white/[0.08] z-30">
        <motion.div
          key={currentIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
          className="h-full bg-gold"
        />
      </div>
    </section>
  );
}
```

- [ ] **Verify:** Hero shows 3 slides (not 4). Headline is noticeably larger. Text order is: gold eyebrow line → headline → subline → button. Scroll indicator pulses at bottom-center. Progress bar is thinner.

- [ ] **Commit:**
```bash
git add components/sections/HeroCarousel.tsx
git commit -m "design: cinematic hero — larger headline, fixed hierarchy, scroll indicator"
```

---

## Task 6: StatsBanner — Replace Studio Count with 4.9★ Rating

**Files:**
- Modify: `components/sections/StatsBanner.tsx`

Replace "6 Studios" with the 4.9 Google rating (strong social proof). Increase numeral size. Gold suffix rendering.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, suffix = '', duration = 1200 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix && <span className="text-gold text-[32px] md:text-[36px]">{suffix}</span>}
    </span>
  );
}

type Stat =
  | { isCount: true; target: number; suffix: string; label: string }
  | { isCount: false; val: string; valSuffix?: string; label: string };

const stats: Stat[] = [
  { isCount: true,  target: 2400, suffix: '+', label: 'Members' },
  { isCount: true,  target: 14,   suffix: '',  label: 'Expert Coaches' },
  { isCount: false, val: '4.9', valSuffix: '★', label: 'Google Rating' },
  { isCount: false, val: '2019',  label: 'Est.' },
];

export default function StatsBanner() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="bg-charcoal text-white border-y border-gold/10 py-[60px]"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center justify-center relative lg:border-r lg:border-gold/[0.12] last:border-r-0 h-full py-4 lg:py-0"
            >
              <div className="text-[52px] md:text-[58px] font-display font-light text-white mb-2 leading-none">
                {stat.isCount ? (
                  <CountUp target={stat.target} suffix={stat.suffix} />
                ) : (
                  <>
                    {stat.val}
                    {stat.valSuffix && (
                      <span className="text-gold text-[32px] md:text-[36px]">{stat.valSuffix}</span>
                    )}
                  </>
                )}
              </div>
              <span className="text-[9px] font-body uppercase tracking-[0.28em] text-gold font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Verify:** Stats band shows: 2400+, 14, 4.9★, 2019. The + and ★ render in gold. Numbers are visibly larger than before.

- [ ] **Commit:**
```bash
git add components/sections/StatsBanner.tsx
git commit -m "design: replace studios stat with 4.9 rating, larger gold-suffix numerals"
```

---

## Task 7: AboutSection — Italic Gold Headline, Eyebrow Line, Image Tag

**Files:**
- Modify: `components/sections/AboutSection.tsx`

Four targeted changes: italic gold `em` on headline, eyebrow gold line, image corner tag, fix broken "Our Story" link.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';
import ParallaxImage from '../ui/ParallaxImage';

export default function AboutSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-28 lg:py-40 bg-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Image — with editorial corner tag */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 w-full aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5] relative"
          >
            <ParallaxImage
              src="/about.png"
              alt="IGYM Premium Space"
              containerClassName="w-full h-full"
            />
            <div className="absolute bottom-0 right-0 bg-charcoal px-3 py-2 z-10">
              <span className="text-[9px] font-body uppercase tracking-[0.22em] text-gold">
                IGYM · Jubilee Hills
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
                <EyebrowLabel>WHO WE ARE</EyebrowLabel>
              </div>
              <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
                Not just a gym.<br />
                <em className="italic text-gold">A standard.</em>
              </h2>
            </div>

            <div className="space-y-6 text-[16px] font-body font-light text-charcoal-mid leading-relaxed">
              <p>
                Founded on the belief that physical refinement requires an elite environment, IGYM merges cutting-edge sports science with luxury hospitality. Our spaces are curated to offer an unmatched training experience.
              </p>
              <p>
                From hand-selected equipment to custom biomechanical assessments, every touchpoint at IGYM is designed for high-performance individuals who refuse to compromise on their health and physical standards.
              </p>
            </div>

            <blockquote className="border-l-2 border-gold pl-6 py-1 italic font-display text-[20px] md:text-[22px] text-charcoal font-light leading-relaxed">
              "True transformation is not merely physical. It is the architectural alignment of discipline, environment, and performance."
            </blockquote>

            <p className="text-[12px] font-body font-light text-gray-muted tracking-[0.08em]">
              Est. 2019 · Jubilee Hills, Hyderabad
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Verify:** "A standard." renders in italic gold. Eyebrow has a gold line prefix. Image has a charcoal corner tag bottom-right. "Our Story" link is gone — replaced with "Est. 2019 · Jubilee Hills, Hyderabad".

- [ ] **Commit:**
```bash
git add components/sections/AboutSection.tsx
git commit -m "design: italic gold headline, eyebrow line, image tag, fix broken link"
```

---

## Task 8: ClassesPreview — Remove Badge Pills, Gold Reveal Line

**Files:**
- Modify: `components/sections/ClassesPreview.tsx`

Remove the duration/level badge pills (non-premium). Add the duration·level as a single muted text line. Add gold bottom-edge reveal line on hover.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type ClassItem = {
  name: string;
  image: string;
  duration: string;
  level: string;
};

const classesData: ClassItem[] = [
  {
    name: 'Strength',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    duration: '50 Min',
    level: 'All Levels',
  },
  {
    name: 'Yoga & Mobility',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    duration: '60 Min',
    level: 'All Levels',
  },
  {
    name: 'CrossFit',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    duration: '45 Min',
    level: 'Intermediate',
  },
  {
    name: 'Functional',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800',
    duration: '50 Min',
    level: 'Advanced',
  },
];

export default function ClassesPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      id="classes"
      className="py-28 lg:py-40 bg-beige-light"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-16 md:mb-20 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel>TRAIN DIFFERENT</EyebrowLabel>
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Choose your <em className="italic text-gold">discipline</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {classesData.map((cls, index) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative group aspect-[3/4] overflow-hidden bg-charcoal cursor-pointer"
            >
              <div className="relative w-full h-full">
                <Image
                  src={cls.image}
                  alt={cls.name}
                  fill
                  className="object-cover transition-all duration-[700ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:brightness-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Tighter gradient — more image visible in upper half */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/15 to-transparent opacity-80 z-10" />
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
                <span className="text-[9px] font-body uppercase tracking-[0.2em] text-white/40 mb-2 block">
                  {cls.duration} · {cls.level}
                </span>
                <h3 className="text-[26px] md:text-[28px] font-display font-light text-white leading-tight">
                  {cls.name}
                </h3>
              </div>

              {/* Gold bottom reveal line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] origin-left z-30" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Verify:** Class cards have no badge pills. Duration·level shows as a single muted line below the class name. Hovering a card reveals a gold line sweeping left-to-right at the bottom edge.

- [ ] **Commit:**
```bash
git add components/sections/ClassesPreview.tsx
git commit -m "design: remove badge pills, add gold reveal line, italic headline"
```

---

## Task 9: TrainersPreview — Expanding Gold Underline, Remove Tag Cloud

**Files:**
- Modify: `components/sections/TrainersPreview.tsx`

Remove specialty tag pills (they belong on the profile page, not the teaser). Add a CSS-only expanding gold underline on hover below the trainer name.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type TrainerItem = {
  name: string;
  slug: string;
  role: string;
  image: string;
};

const trainersData: TrainerItem[] = [
  {
    name: 'Sarah Jenkins',
    slug: 'sarah-jenkins',
    role: 'Head of Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Marcus Chen',
    slug: 'marcus-chen',
    role: 'Athletic Performance Specialist',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    role: 'Master Yoga & Mobility Instructor',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'David Vance',
    slug: 'david-vance',
    role: 'CrossFit & Metabolic Coach',
    image: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&q=80&w=800',
  },
];

export default function TrainersPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="py-28 lg:py-40 bg-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
              <EyebrowLabel>THE COACHES</EyebrowLabel>
            </div>
            <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
              Guided by <em className="italic text-gold">the best</em>
            </h2>
          </div>
          <Link
            href="/trainers"
            className="hidden md:inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium group cursor-pointer"
          >
            <span className="relative">
              Meet All Coaches
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms]">→</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-8 pb-8 lg:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {trainersData.map((trainer, index) => (
            <motion.div
              key={trainer.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[280px] sm:min-w-[340px] lg:min-w-0 flex-shrink-0 snap-start flex flex-col group cursor-pointer"
            >
              {/* Portrait */}
              <Link href={`/trainers/${trainer.slug}`} className="relative w-full aspect-square overflow-hidden mb-5 block">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover grayscale transition-all duration-[700ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                />
              </Link>

              {/* Info */}
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-[22px] font-display font-light text-charcoal leading-tight">
                  <Link href={`/trainers/${trainer.slug}`} className="hover:text-gold transition-colors duration-[600ms]">
                    {trainer.name}
                  </Link>
                </h3>

                <span className="text-[10px] font-body uppercase tracking-[0.15em] text-gray-muted font-normal">
                  {trainer.role}
                </span>

                {/* Expanding gold underline */}
                <div className="w-0 h-px bg-gold transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:w-10 mt-1" />

                <div className="pt-1.5">
                  <Link
                    href={`/trainers/${trainer.slug}`}
                    className="text-[10px] font-body uppercase tracking-[0.15em] text-gold/60 hover:text-gold transition-colors duration-[600ms]"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/trainers"
            className="inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium border-b border-gold pb-1 cursor-pointer"
          >
            Meet All Coaches →
          </Link>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Verify:** No specialty tag pills. Hovering a trainer card reveals a 40px gold underline expanding from left. Image transitions from grayscale to color with slight zoom.

- [ ] **Commit:**
```bash
git add components/sections/TrainersPreview.tsx
git commit -m "design: remove tag pills, expanding gold underline, italic headline"
```

---

## Task 10: MembershipPreview — Seamless Grid, Badge Corner, Gold Featured Price

**Files:**
- Modify: `components/sections/MembershipPreview.tsx`

Three visual changes: seamless gap-based dividers instead of borders, featured badge moves to corner, featured plan price turns gold.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type PlanItem = {
  name: string;
  price: string;
  isFeatured?: boolean;
  features: string[];
  ctaLabel: string;
  href: string;
};

const plans: PlanItem[] = [
  {
    name: 'Starter',
    price: '₹2,500',
    features: [
      'Gym floor access (5am–11pm)',
      'Locker room & showers',
      'Access to group classes (2/week)',
      'IGYM mobile app access',
    ],
    ctaLabel: 'Select Starter',
    href: '/membership',
  },
  {
    name: 'Pro',
    price: '₹4,000',
    isFeatured: true,
    features: [
      'Unlimited gym floor access',
      'Unlimited group classes',
      '2 PT sessions / month',
      'IGYM app + nutrition tracker',
      '10% café discount',
      '1 guest pass / month',
    ],
    ctaLabel: 'Explore Pro',
    href: '/membership',
  },
  {
    name: 'Elite',
    price: '₹7,500',
    features: [
      'Everything in Pro plan',
      '8 PT sessions / month',
      'Dedicated coach assigned',
      'Monthly body composition analysis',
      '20% café discount',
      'Priority class booking',
    ],
    ctaLabel: 'Select Elite',
    href: '/membership',
  },
];

export default function MembershipPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="py-28 lg:py-40 bg-charcoal text-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel className="mb-0">BECOME A MEMBER</EyebrowLabel>
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-white leading-tight">
            Simple plans. <em className="italic text-gold">Serious results.</em>
          </h2>
        </div>

        {/* Seamless grid — gap creates the dividing lines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.06] items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col justify-between p-8 text-white transition-all duration-500 ${
                plan.isFeatured ? 'bg-charcoal-mid' : 'bg-charcoal'
              }`}
            >
              {/* Badge — top-right corner */}
              {plan.isFeatured && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-gold text-charcoal text-[8px] font-body uppercase tracking-[0.18em] font-semibold">
                  Popular
                </div>
              )}

              <div>
                <h3 className="text-[28px] md:text-[32px] font-display font-light mb-4 text-white">
                  {plan.name}
                </h3>

                <div className="flex items-baseline mb-8">
                  <span className={`text-[48px] md:text-[52px] font-display font-light ${
                    plan.isFeatured ? 'text-gold' : 'text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-[14px] font-body text-gray-muted ml-2 font-light">/mo</span>
                </div>

                <hr className="border-t border-white/[0.08] mb-8" />

                <ul className="space-y-4 mb-12">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start text-[14px] font-body font-light text-gray-200">
                      <span className="text-gold mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className={`block w-full text-center py-4 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer ${
                  plan.isFeatured
                    ? 'bg-gold text-charcoal hover:bg-white hover:text-charcoal'
                    : 'border border-white/[0.15] text-white/60 hover:bg-white hover:text-charcoal hover:border-white'
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/membership"
            className="group inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-white font-medium cursor-pointer"
          >
            <span className="relative">
              See Full Pricing
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms]">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Verify:** Plans have seamless 1px dividers between them (no box borders). Pro plan: "Popular" badge sits in the top-right corner. Pro price is gold, others are white. Pro CTA is gold background.

- [ ] **Commit:**
```bash
git add components/sections/MembershipPreview.tsx
git commit -m "design: seamless plan grid, corner badge, gold featured price"
```

---

## Task 11: TransformationsPreview — Eyebrow Line, Italic Headline, Goal Badge

**Files:**
- Modify: `components/sections/TransformationsPreview.tsx`

Three targeted changes: eyebrow gold line, italic gold headline, refined goal badge styling.

- [ ] **In `TransformationsPreview.tsx`, make these changes:**

**Change 1** — Eyebrow (find the `<EyebrowLabel>` and wrap it):
```tsx
// Before:
<EyebrowLabel className="mb-4">RESULTS SPEAK</EyebrowLabel>

// After:
<div className="flex items-center gap-3 mb-4">
  <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
  <EyebrowLabel>RESULTS SPEAK</EyebrowLabel>
</div>
```

**Change 2** — Headline `h2`:
```tsx
// Before:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Real people. Real change.
</h2>

// After:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Real people. <em className="italic text-gold">Real change.</em>
</h2>
```

**Change 3** — Goal badge (find the `<span>` with `bg-gold/10`):
```tsx
// Before:
className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 text-[11px] font-body uppercase tracking-wider font-medium"

// After:
className="border border-gold/25 bg-gold/[0.07] text-gold text-[9px] font-body uppercase tracking-wider font-medium px-2.5 py-1"
```

**Change 4** — Motion easing on `motion.div` items (inside the `.map()`):
```tsx
// Before:
transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}

// After:
transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
```

- [ ] **Verify:** Eyebrow has gold line prefix. "Real change." is italic gold. Goal badges are slightly smaller with lighter gold border. Section entrance animations arrive a bit faster.

- [ ] **Commit:**
```bash
git add components/sections/TransformationsPreview.tsx
git commit -m "design: eyebrow line, italic gold headline, refined goal badge"
```

---

## Task 12: CafePreview — Image Corner Tag, Italic Headline, Eyebrow Line

**Files:**
- Modify: `components/sections/CafePreview.tsx`

- [ ] **In `CafePreview.tsx`, make these changes:**

**Change 1** — Wrap the `ParallaxImage` motion div to add the corner tag. Find the `motion.div` wrapping `ParallaxImage` and add the tag inside it:
```tsx
// The motion.div currently ends with:
//   <ParallaxImage ... />
// </motion.div>
// Add the tag AFTER ParallaxImage, before closing the motion.div:

<ParallaxImage
  src="/hero-3.png"
  alt="IGYM Luxury Café"
  containerClassName="w-full h-full"
/>
<div className="absolute bottom-0 left-0 bg-charcoal px-3 py-2 z-10">
  <span className="text-[9px] font-body uppercase tracking-[0.22em] text-gold">IGYM Café</span>
</div>
```

**Change 2** — Eyebrow:
```tsx
// Before:
<EyebrowLabel className="mb-4">IGYM CAFÉ</EyebrowLabel>

// After:
<div className="flex items-center gap-3 mb-4">
  <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
  <EyebrowLabel>IGYM CAFÉ</EyebrowLabel>
</div>
```

**Change 3** — Headline `h2`:
```tsx
// Before:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Fuel is part of<br />the training.
</h2>

// After:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Fuel is part of<br /><em className="italic text-gold">the training.</em>
</h2>
```

**Change 4** — Feature icon padding, find `className="p-3 bg-beige-light`:
```tsx
// Before:
className="p-3 bg-beige-light border border-gold/15 flex-shrink-0"

// After:
className="p-3.5 bg-beige-light border border-gold/15 flex-shrink-0"
```

**Change 5** — Motion easing on both `motion.div` elements:
```tsx
// Before (both instances):
ease: [0.16, 1, 0.3, 1]
// After:
ease: [0.22, 1, 0.36, 1]
```

- [ ] **Verify:** Café image has a small "IGYM Café" charcoal tag bottom-left. "the training." renders italic gold. Feature icons have slightly more padding.

- [ ] **Commit:**
```bash
git add components/sections/CafePreview.tsx
git commit -m "design: café image corner tag, italic headline, icon padding"
```

---

## Task 13: JournalPreview — Italic Headline, Remove Lift Hover, Tighten Read Link

**Files:**
- Modify: `components/sections/JournalPreview.tsx`

- [ ] **In `JournalPreview.tsx`, make these changes:**

**Change 1** — Eyebrow:
```tsx
// Before:
<EyebrowLabel className="mb-4">THE JOURNAL</EyebrowLabel>

// After:
<div className="flex items-center gap-3 mb-4">
  <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
  <EyebrowLabel>THE JOURNAL</EyebrowLabel>
</div>
```

**Change 2** — Headline:
```tsx
// Before:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Knowledge is part of training.
</h2>

// After:
<h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
  Knowledge is <em className="italic text-gold">part of training.</em>
</h2>
```

**Change 3** — Remove `whileHover` from `motion.article` (find the article element):
```tsx
// Before:
<motion.article
  key={article.slug}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
  whileHover={{ y: -4 }}
  className="..."
>

// After:
<motion.article
  key={article.slug}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
  className="..."
>
```

**Change 4** — Read link text (find both instances):
```tsx
// Before:
Read Post <span ...>→</span>

// After:
Read <span ...>→</span>
```

- [ ] **Verify:** Journal cards no longer lift on hover (gold border reveal remains). "part of training." is italic gold. Read links show "Read →".

- [ ] **Commit:**
```bash
git add components/sections/JournalPreview.tsx
git commit -m "design: italic headline, remove card lift hover, tighten read link"
```

---

## Task 14: TestimonialsSection — Larger Quote, Gold Bar, Pill Dots, Remove Arrows

**Files:**
- Modify: `components/sections/TestimonialsSection.tsx`

The biggest change here: remove the prev/next arrow buttons entirely. Dots handle navigation. Also upgrade quote size, add gold bar divider, switch to pill-shaped active dot.

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type TestimonialItem = {
  quote: string;
  name: string;
  duration: string;
};

const testimonials: TestimonialItem[] = [
  {
    quote: "IGYM is in a class of its own. The atmosphere, the quality of coaches, and the sheer focus on results make it the absolute standard for premium training.",
    name: "Rohan Kapoor",
    duration: "Member since 2021",
  },
  {
    quote: "The personal training here is scientifically precise. My body composition analysis combined with tailored macro meals from the Café has transformed my recovery.",
    name: "Dr. Priyamvada Sen",
    duration: "Member since 2023",
  },
  {
    quote: "After training at various luxury gyms globally, I can confidently say IGYM matches or exceeds elite standards anywhere. The CrossFit programming is world-class.",
    name: "Siddharth Goel",
    duration: "Member since 2022",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section
      ref={containerRef}
      className="py-28 lg:py-40 bg-charcoal text-white overflow-hidden relative"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center">

        {/* Eyebrow — flanking lines */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className="inline-block w-6 h-px bg-gold" />
          <EyebrowLabel>TESTIMONIALS</EyebrowLabel>
          <span className="inline-block w-6 h-px bg-gold" />
        </div>

        {/* Decorative quote mark */}
        <div className="text-[160px] md:text-[200px] font-display font-light text-gold/[0.10] h-[60px] leading-none select-none flex items-center justify-center mb-6">
          "
        </div>

        {/* Quote slider */}
        <div className="w-full max-w-4xl min-h-[200px] flex flex-col items-center justify-center text-center relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center space-y-0"
            >
              <p className="text-[24px] sm:text-[28px] md:text-[30px] font-display italic font-light text-white leading-relaxed max-w-3xl mb-8">
                "{current.quote}"
              </p>

              {/* Gold bar divider */}
              <div className="w-7 h-px bg-gold mb-5" />

              <h3 className="text-[11px] font-body uppercase tracking-[0.28em] text-gold font-medium">
                {current.name}
              </h3>
              <p className="text-[11px] font-body text-white/30 mt-1.5 font-light tracking-[0.08em]">
                {current.duration}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pill dots — no arrows */}
        <div className="mt-12 flex items-center space-x-2.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] cursor-pointer rounded-sm ${
                index === currentIndex
                  ? 'w-5 h-1.5 bg-gold'
                  : 'w-1.5 h-1.5 rounded-full bg-white/[0.15]'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Verify:** No arrow buttons visible. Dots are pill-shaped when active. Quote text is larger. Gold bar divider sits between the quote and the author name. Auto-advance still works every 5s.

- [ ] **Commit:**
```bash
git add components/sections/TestimonialsSection.tsx
git commit -m "design: remove arrows, pill dots, larger quote, gold bar divider"
```

---

## Task 15: CTABand — Italic Gold Headline, Larger Type, Flanking Eyebrow

**Files:**
- Modify: `components/sections/CTABand.tsx`

- [ ] **Replace the entire file content:**

```tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

export default function CTABand() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 bg-beige-mid text-charcoal text-center overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto flex flex-col items-center space-y-6"
        >
          {/* Eyebrow — flanking lines */}
          <div className="flex items-center justify-center gap-4">
            <span className="inline-block w-6 h-px bg-gold" />
            <EyebrowLabel>Begin Today</EyebrowLabel>
            <span className="inline-block w-6 h-px bg-gold" />
          </div>

          <h2 className="text-[48px] md:text-[72px] font-display font-light leading-tight">
            Your transformation starts{' '}
            <em className="italic text-gold">today.</em>
          </h2>

          <p className="text-[16px] font-body font-light text-gray-muted max-w-lg leading-relaxed">
            Join hundreds of members who chose uncompromised training environments and elite coaching standards at IGYM.
          </p>

          <div className="pt-4">
            <Link
              href="/membership"
              className="inline-block px-12 py-5 bg-charcoal text-white text-[12px] font-body uppercase tracking-[0.2em] font-medium transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-gold hover:text-charcoal rounded-none border-none cursor-pointer"
            >
              Start Your Journey
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Verify:** Headline `today.` renders italic and gold. Headline is noticeably larger than before. Button is wider with more vertical padding. Eyebrow has flanking gold lines.

- [ ] **Commit:**
```bash
git add components/sections/CTABand.tsx
git commit -m "design: italic gold today, larger headline, wider button, flanking eyebrow"
```

---

## Final Verification

- [ ] **Scroll through the entire homepage** from top to bottom. Check every section:
  - Hero: 3 slides, large headline, bottom-left anchor, scroll indicator pulses
  - Stats: 4.9★ in third position, larger numerals, gold suffixes
  - About: "A standard." in italic gold, image has corner tag
  - Classes: no badge pills, gold line on hover
  - Trainers: no tag cloud, gold underline expands on hover
  - Membership: seamless dividers, Pro price is gold, badge is corner
  - Transformations: italic "Real change."
  - Café: "the training." in italic gold, image corner tag
  - Journal: no card lift, italic headline, "Read →"
  - Testimonials: larger quote, no arrows, pill dots, gold divider bar
  - CTA: "today." in italic gold, big headline
  - Footer: "© 2026", Instagram links to @igymindia

- [ ] **Check mobile** at 375px width: hero text readable, trainers scroll horizontally, navbar mobile overlay opens with 5 links.

- [ ] **Check page loader** on hard refresh: IGYM text fades in → gold line sweeps right → fades out.

- [ ] **Final commit if any cleanup needed:**
```bash
git add -A
git commit -m "design: igym psychological ui/ux redesign complete"
```
