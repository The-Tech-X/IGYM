'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

export type TransformationItem = {
  clientName: string;
  duration: string;
  goal: string;
  beforeImg: string;
  afterImg: string;
  trainer: string;
};

const LINES = [
  {
    text: 'Twelve weeks.',
    xFrom: -100,
    className: 'text-[clamp(52px,9vw,120px)] font-display font-light text-white leading-none',
  },
  {
    text: 'No shortcuts. No excuses.',
    xFrom: 100,
    className: 'text-[clamp(32px,5.5vw,76px)] font-display font-light italic text-gold leading-none',
  },
  {
    text: 'Just the programme, your coach, and the work.',
    xFrom: -100,
    className: 'text-[clamp(16px,2.4vw,34px)] font-display font-light text-white/40 leading-snug',
  },
];

export default function TransformationsPreview({ transformations: _transformations = [] }: { transformations?: TransformationItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="bg-charcoal py-28 lg:py-40 overflow-hidden relative">

      {/* Faint vertical rule — decorative */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.03] pointer-events-none" aria-hidden />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-16 md:mb-20 pb-8 border-b border-white/[0.07]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel>THE WORK SPEAKS</EyebrowLabel>
          </div>
          <span className="hidden md:block text-[11px] font-body uppercase tracking-[0.2em] text-white/20">
            Personal Training · Gachibowli
          </span>
        </motion.div>

        {/* Cinematic lines */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          {LINES.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ opacity: 0, x: line.xFrom }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + i * 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={line.className}
              >
                {line.text}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20 pt-8 border-t border-white/[0.07] flex items-center justify-between gap-6"
        >
          <p className="text-[12px] font-body font-light text-white/25 tracking-[0.06em] max-w-xs leading-relaxed">
            Assessment-first. Coach-led. Precision-designed for every member.
          </p>

          <Link
            href="/transformations"
            className="group inline-flex items-center gap-3 text-[11px] font-body uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-colors duration-300 flex-shrink-0 cursor-pointer"
          >
            See How It Works
            <motion.span
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block w-8 h-px bg-current origin-left"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
