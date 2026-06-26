'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import EyebrowLabel from '../ui/EyebrowLabel';
import RevealImage from '../ui/RevealImage';

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
            className="lg:col-span-7 w-full aspect-[4/3] relative"
          >
            <RevealImage className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src="/Images/IGYM%2001.jpg"
                  alt="IGYM Premium Space"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  priority
                />
              </div>
            </RevealImage>
            <div className="absolute bottom-0 right-0 bg-charcoal px-3 py-2 z-10">
              <span className="text-[9px] font-body uppercase tracking-[0.22em] text-gold">
                IGYM · Gachibowli
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

            <blockquote className="border-l-2 border-gold pl-6 py-1 italic font-display text-[16px] md:text-[20px] text-charcoal font-light leading-relaxed">
              &ldquo;True transformation is not merely physical. It is the architectural alignment of discipline, environment, and performance.&rdquo;
            </blockquote>

            <p className="text-[12px] font-body font-light text-gray-muted tracking-[0.08em]">
              Est. 2023 · Gachibowli, Hyderabad
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
