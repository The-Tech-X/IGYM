'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import EyebrowLabel from '../ui/EyebrowLabel';
import RevealImage from '../ui/RevealImage';

export type TransformationItem = {
  clientName: string;
  duration: string;
  goal: string;
  beforeImg: string;
  afterImg: string;
  trainer: string;
};

export default function TransformationsPreview({ transformations }: { transformations: TransformationItem[] }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const customHandle = (
    <div className="h-full w-[1.5px] bg-gold relative cursor-ew-resize">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gold bg-charcoal flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
      </div>
    </div>
  );

  return (
    <section 
      ref={containerRef}
      className="py-28 lg:py-40 bg-beige-light overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel>THE WORK SPEAKS</EyebrowLabel>
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Their commitment. <em className="italic text-gold">Our craft.</em>
          </h2>
        </div>

        {/* 3 Compare Sliders Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {transformations.map((item, index) => (
            <motion.div
              key={item.clientName}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col space-y-4"
            >
              {/* Compare Slider */}
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-mid">
                <RevealImage delay={index * 0.06} className="w-full h-full">
                {mounted ? (
                  <ReactCompareSlider
                    handle={customHandle}
                    itemOne={
                      <div className="relative w-full h-full">
                        <ReactCompareSliderImage 
                          src={item.beforeImg} 
                          alt="Before" 
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute bottom-4 left-4 z-10 text-[10px] font-body uppercase tracking-[0.2em] text-white bg-black/40 px-2 py-1">
                          Before
                        </span>
                      </div>
                    }
                    itemTwo={
                      <div className="relative w-full h-full">
                        <ReactCompareSliderImage 
                          src={item.afterImg} 
                          alt="After" 
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute bottom-4 right-4 z-10 text-[10px] font-body uppercase tracking-[0.2em] text-gold bg-black/40 px-2 py-1">
                          After
                        </span>
                      </div>
                    }
                    className="w-full h-full"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img 
                      src={item.afterImg} 
                      alt="After" 
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute bottom-4 right-4 z-10 text-[10px] font-body uppercase tracking-[0.2em] text-gold bg-black/40 px-2 py-1">
                      After
                    </span>
                  </div>
                )}
                </RevealImage>
              </div>

              {/* Labels below slider */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-[18px] font-display font-light text-charcoal leading-tight">
                    {item.clientName} · <span className="text-gray-muted text-[14px] font-body">{item.duration}</span>
                  </h3>
                  <p className="text-[12px] font-body text-gray-muted mt-1">
                    with {item.trainer}
                  </p>
                </div>
                <span className="border border-gold/25 bg-gold/[0.07] text-gold text-[9px] font-body uppercase tracking-wider font-medium px-2.5 py-1">
                  {item.goal}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row & CTA */}
        <div className="mt-16 pt-12 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[16px] font-body font-light text-charcoal-mid flex items-center space-x-3">
            <span className="font-semibold text-gold">Average 12 weeks</span>
            <span className="text-gold/30">•</span>
            <span>94% client retention rate</span>
          </div>
          <Link
            href="/transformations"
            className="group inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium cursor-pointer"
          >
            <span className="relative">
              See All Transformations
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
