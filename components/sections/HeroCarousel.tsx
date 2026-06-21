'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type HeroSlide = {
  type: 'video' | 'image';
  src: string;
  headline: string;
  cta: { label: string; href: string };
};

const slides: HeroSlide[] = [
  {
    type: 'image',
    src: '/Images/Customer Lounge.jpg',
    headline: 'EXCELLENCE IS PRIVATE',
    cta: { label: 'Enquire About Membership', href: '/membership' },
  },
  {
    type: 'image',
    src: '/Images/Dumbell%20Strength%20Area.jpg',
    headline: 'COACHED AT THE HIGHEST LEVEL',
    cta: { label: 'Meet Our Coaches', href: '/trainers' },
  },
  {
    type: 'image',
    src: '/Images/Treamills%20Line%20Up.jpg',
    headline: 'BUILT FOR EVERY LEVEL',
    cta: { label: 'Explore Membership', href: '/membership' },
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentSlide = slides[currentIndex];

  const bgVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.0, ease: 'easeOut' } },
    exit:    { opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } },
  };

  const wordContainerVariants = {
    animate: { transition: { staggerChildren: 0.08 } },
  };

  const wordVariants = {
    initial: { y: 56, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: {
      y: -24,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-charcoal">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={{ animation: 'kenBurns 7s linear forwards' }}
            >
              <Image
                src={currentSlide.src}
                alt={currentSlide.headline}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,6,4,0.92)_0%,rgba(8,6,4,0.52)_38%,rgba(8,6,4,0.06)_100%)] z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content — bottom-left anchor */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-4xl text-white">

          {/* Headline — word-by-word reveal */}
          <motion.h1
            key={`title-${currentIndex}`}
            variants={wordContainerVariants}
            initial="initial"
            animate="animate"
            className="font-display leading-[0.95] tracking-[-0.025em] uppercase mb-10"
            style={{
              fontSize: 'clamp(42px, 10vw, 120px)',
              textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)',
            }}
          >
            {currentSlide.headline.split(' ').map((word, index) => (
              <span key={index} className="inline-block overflow-hidden mr-[0.22em] pb-1">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* CTA */}
          <motion.div
            key={`cta-${currentIndex}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={currentSlide.cta.href}
              className="group inline-flex items-center gap-5 cursor-pointer"
            >
              <span className="text-[11px] font-body uppercase tracking-[0.28em] text-white/90 group-hover:text-white transition-colors duration-[500ms]">
                {currentSlide.cta.label}
              </span>
              <span className="flex-shrink-0 h-px w-8 bg-gold/60 group-hover:w-14 group-hover:bg-gold transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </Link>
          </motion.div>
        </div>
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
