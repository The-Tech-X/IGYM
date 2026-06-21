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
    image: '/Images/IGYM%2005.jpg',
    duration: '50 Min',
    level: 'All Levels',
  },
  {
    name: 'Conditioning',
    image: '/Images/Cardio%20Lineup.jpg',
    duration: '45 Min',
    level: 'All Levels',
  },
  {
    name: 'Functional Training',
    image: '/Images/IGYM%2001.jpg',
    duration: '50 Min',
    level: 'All Levels',
  },
  {
    name: 'Resistance',
    image: '/Images/IGYM%2004.jpg',
    duration: '55 Min',
    level: 'All Levels',
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
            <EyebrowLabel>YOUR DISCIPLINES</EyebrowLabel>
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Choose your <em className="italic text-gold">discipline</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                <h3 className="text-[20px] md:text-[26px] font-display font-light text-white leading-tight">
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
