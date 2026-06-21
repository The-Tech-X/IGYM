'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp, formatCount } from '@/lib/hooks/useCountUp';

type Stat =
  | { isCount: true; target: number; decimals: number; suffix: string; label: string }
  | { isCount: false; val: string; label: string };

const stats: Stat[] = [
  { isCount: true,  target: 2400, decimals: 0, suffix: '+', label: 'Members' },
  { isCount: true,  target: 14,   decimals: 0, suffix: '',  label: 'Expert Coaches' },
  { isCount: true,  target: 4.9,  decimals: 1, suffix: '★', label: 'Google Rating' },
  { isCount: false, val: '2019',  label: 'Est.' },
];

function StatNumber({
  target,
  decimals,
  suffix,
  start,
}: {
  target: number;
  decimals: number;
  suffix: string;
  start: boolean;
}) {
  const value = useCountUp({ target, start });

  return (
    <span>
      {formatCount(value, decimals)}
      {suffix && <span className="text-gold text-[32px] md:text-[36px]">{suffix}</span>}
    </span>
  );
}

export default function StatsBanner() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="bg-beige-mid border-y border-beige-dark py-[60px]"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center justify-center relative lg:border-r lg:border-beige-dark last:border-r-0 h-full py-4 lg:py-0"
            >
              <div className="text-[52px] md:text-[58px] font-display font-light text-charcoal mb-2 leading-none">
                {stat.isCount ? (
                  <StatNumber
                    target={stat.target}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    start={isInView}
                  />
                ) : (
                  stat.val
                )}
              </div>
              <span className="text-[9px] font-body uppercase tracking-[0.28em] text-gold font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
