'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type TestimonialItem = {
  quote: string;
  name: string;
  duration: string;
};

const testimonials: TestimonialItem[] = [
  {
    quote: "IGYM operates at a standard I have not encountered elsewhere. The environment, the coaching philosophy, and the attention to detail are without compromise.",
    name: "Rohan Kapoor",
    duration: "Member since 2021",
  },
  {
    quote: "The precision of the programming here is exceptional. Every variable — training load, nutrition, recovery — is managed as part of a coherent whole.",
    name: "Dr. Priyamvada Sen",
    duration: "Member since 2023",
  },
  {
    quote: "I have trained at private fitness facilities across several cities. IGYM sets a standard that few match. The coaching is intelligent. The facility, impeccable.",
    name: "Siddharth Goel",
    duration: "Member since 2022",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-28 lg:py-40 bg-beige-light overflow-hidden relative"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center">

        {/* Eyebrow — flanking lines */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className="inline-block w-6 h-px bg-gold" />
          <EyebrowLabel>TESTIMONIALS</EyebrowLabel>
          <span className="inline-block w-6 h-px bg-gold" />
        </div>

        {/* Decorative quote mark */}
        <div className="text-[72px] md:text-[160px] font-display font-light text-gold/[0.10] h-[40px] md:h-[60px] leading-none select-none flex items-center justify-center mb-6">
          {'"'}
        </div>

        {/* Quote slider */}
        <div className="w-full max-w-4xl min-h-[160px] md:min-h-[200px] flex flex-col items-center justify-center text-center relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center space-y-0"
            >
              <p className="text-[24px] sm:text-[28px] md:text-[30px] font-display italic font-light text-charcoal leading-relaxed max-w-3xl mb-8">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Gold bar divider */}
              <div className="w-7 h-px bg-gold mb-5" />

              <h3 className="text-[11px] font-body uppercase tracking-[0.28em] text-gold font-medium">
                {current.name}
              </h3>
              <p className="text-[11px] font-body text-gray-muted mt-1.5 font-light tracking-[0.08em]">
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
                  : 'w-1.5 h-1.5 rounded-full bg-charcoal/20'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
