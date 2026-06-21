'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface RevealImageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealImage({
  children,
  className,
  delay = 0,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      {children}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gold z-20 pointer-events-none"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={isInView ? { clipPath: 'inset(0 0 0 100%)' } : { clipPath: 'inset(0 0 0 0)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        />
      )}
    </div>
  );
}
