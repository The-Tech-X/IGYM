'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { useNavbarVisibility } from '../layout/NavbarContext';

export default function ScrollExpandFilm() {
  const outerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { setHideNavbar } = useNavbarVisibility();
  const isInView = useInView(outerRef, { once: false });

  // Hooks are called unconditionally, before any early return, so hook order
  // stays stable regardless of the reduced-motion branch.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Hide navbar just before full-bleed (progress >= 0.7) so it's gone
  // with breathing room before the video fills the screen at 0.8.
  // Restore it when the section leaves the viewport entirely.
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setHideNavbar(latest >= 0.6);
  });

  useEffect(() => {
    if (!isInView) setHideNavbar(false);
  }, [isInView, setHideNavbar]);

  // Compositor-friendly scale: panel base size is the full stage; we scale it
  // DOWN at the start (framed) and up to 1 (full-bleed) as you scroll.
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.62, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.8], [16, 0]);
  const borderRadius = useMotionTemplate`${radius}px`;

  // Overlay brand line reveals near full-bleed.
  const overlayOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.55, 0.9], [20, 0]);

  // The video element + gradient + overlay, shared between both branches.
  const Film = (
    <>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/Videos/IGYM%20Vedio%2003.MP4" type="video/mp4" />
      </video>

      {/* Bottom gradient for legibility behind the overlay text. */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(8,6,4,0.6),transparent_50%)]" />
    </>
  );

  const overlayContent = (
    <>
      {/* Eyebrow with gold line */}
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
        <span className="text-[10px] font-body uppercase tracking-[0.32em] text-gold">
          Inside iGym
        </span>
      </div>
      <h2 className="text-[40px] md:text-[64px] lg:text-[80px] font-display font-light text-white leading-tight">
        Where the work is done.
      </h2>
    </>
  );

  // Reduced motion: static full-bleed version, no scroll container needed.
  if (prefersReducedMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-charcoal">
        {Film}
        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-12 md:pb-24">
          <div className="max-w-4xl">{overlayContent}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={outerRef} className="relative h-[300vh] bg-charcoal">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        {/* Panel: full-stage base size, scaled down at start to read as framed. */}
        <motion.div
          style={{ scale, borderRadius }}
          className="relative w-full h-full overflow-hidden"
        >
          {Film}

          {/* Overlay text — bottom-left anchor to match the hero. */}
          <motion.div
            style={{ opacity: overlayOpacity, y: overlayY }}
            className="absolute inset-0 z-10 flex flex-col justify-end max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-12 md:pb-24"
          >
            <div className="max-w-4xl">{overlayContent}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
