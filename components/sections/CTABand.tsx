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
            <EyebrowLabel>The Next Step</EyebrowLabel>
            <span className="inline-block w-6 h-px bg-gold" />
          </div>

          <h2 className="text-[48px] md:text-[72px] font-display font-light leading-tight">
            The standard you set.<br />
            <em className="italic text-gold">Begins here.</em>
          </h2>

          <p className="text-[16px] font-body font-light text-gray-muted max-w-lg leading-relaxed">
            Private membership. Considered coaching. A facility that reflects the standards you hold everything else to.
          </p>

          <div className="pt-4">
            <Link
              href="/membership"
              className="inline-block px-12 py-5 bg-charcoal text-white text-[12px] font-body uppercase tracking-[0.2em] font-medium transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-gold hover:text-charcoal rounded-none border-none cursor-pointer"
            >
              Request an Introduction
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
