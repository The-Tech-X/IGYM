'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';
import RevealImage from '../ui/RevealImage';

export type TrainerItem = {
  name: string;
  slug: string;
  role: string;
  image: string;
};

export default function TrainersPreview({ trainers }: { trainers: TrainerItem[] }) {
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
              <EyebrowLabel>OUR SPECIALISTS</EyebrowLabel>
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
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[280px] sm:min-w-[340px] lg:min-w-0 flex-shrink-0 snap-start flex flex-col group cursor-pointer"
            >
              {/* Portrait */}
              <RevealImage delay={index * 0.06} className="w-full aspect-square mb-5">
                <Link href={`/trainers/${trainer.slug}`} className="block w-full h-full relative overflow-hidden">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover grayscale transition-all duration-[700ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                  />
                </Link>
              </RevealImage>

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
