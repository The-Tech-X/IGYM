'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Leaf, Award, Compass } from 'lucide-react';
import EyebrowLabel from '../ui/EyebrowLabel';
import ParallaxImage from '../ui/ParallaxImage';
import RevealImage from '../ui/RevealImage';

export default function CafePreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  const features = [
    {
      icon: <Award size={20} className="text-gold" />,
      title: 'Macro-tracked meals',
      desc: 'Chef-prepared meals customized to your specific macro profiles.',
    },
    {
      icon: <Leaf size={20} className="text-gold" />,
      title: 'Cold-pressed juices',
      desc: 'Organic raw pressings for immediate micronutrient cellular repair.',
    },
    {
      icon: <Compass size={20} className="text-gold" />,
      title: 'Protein shakes',
      desc: 'Clean, high-bioavailability shakes for rapid muscle synthesis.',
    },
  ];

  return (
    <section 
      ref={containerRef}
      className="py-28 lg:py-40 bg-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column (50% / 6 cols) - Large Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] relative"
          >
            <RevealImage className="w-full h-full">
              <ParallaxImage
                src="/Images/IGYM%20Cafe%20for%20Members%20only.png"
                alt="IGYM Espresso Bar"
                containerClassName="w-full h-full"
              />
            </RevealImage>
            <div className="absolute bottom-0 left-0 bg-charcoal px-3 py-2 z-10">
              <span className="text-[9px] font-body uppercase tracking-[0.22em] text-gold">IGYM Café</span>
            </div>
          </motion.div>

          {/* Right Column (50% / 6 cols) - Café features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col justify-center space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
                <EyebrowLabel>THE CAFÉ</EyebrowLabel>
              </div>
              <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
                Nourishment is part of<br /><em className="italic text-gold">the programme.</em>
              </h2>
              <p className="text-[16px] font-body font-light text-charcoal-mid leading-relaxed mt-6">
                Recovery begins at the cellular level. Our dedicated café serves performance-focused, nutritionist-designed items to complement your workout blueprint.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feat, index) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-3.5 bg-beige-light border border-gold/15 flex-shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-display font-light text-charcoal leading-tight mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-[14px] font-body font-light text-gray-muted leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/cafe"
                className="group inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium cursor-pointer"
              >
                <span className="relative">
                  Explore the Menu
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
                </span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">→</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
