'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

type PlanItem = {
  name: string;
  price: string;
  isFeatured?: boolean;
  features: string[];
  ctaLabel: string;
  href: string;
};

const plans: PlanItem[] = [
  {
    name: 'Essential',
    price: '₹2,500',
    features: [
      'Full gym floor access',
      'Locker room & private showers',
      'Group sessions (2 per week)',
      'IGYM member app',
    ],
    ctaLabel: 'Enquire',
    href: '/membership',
  },
  {
    name: 'Signature',
    price: '₹4,000',
    isFeatured: true,
    features: [
      'Unlimited gym floor access',
      'Unlimited group sessions',
      '2 personal training sessions monthly',
      'App with nutrition tracking',
      '10% café discount',
      '1 guest visit per month',
    ],
    ctaLabel: 'Select Signature',
    href: '/membership',
  },
  {
    name: 'Private',
    price: '₹7,500',
    features: [
      'Everything in Signature',
      '8 personal training sessions monthly',
      'Dedicated coach assigned',
      'Monthly body composition review',
      '20% café discount',
      'Priority session booking',
    ],
    ctaLabel: 'Reserve',
    href: '/membership',
  },
];

export default function MembershipPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={containerRef}
      className="py-28 lg:py-40 bg-beige-light overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel className="mb-0">PRIVATE MEMBERSHIP</EyebrowLabel>
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Three tiers. <em className="italic text-gold">One standard.</em>
          </h2>
        </div>

        {/* Seamless grid — gap creates the dividing lines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-beige-dark/50 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col justify-between p-5 md:p-8 transition-all duration-500 ${
                plan.isFeatured ? 'bg-white border-t-2 border-gold' : 'bg-white'
              }`}
            >
              {/* Badge — top-right corner */}
              {plan.isFeatured && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-gold text-charcoal text-[8px] font-body uppercase tracking-[0.18em] font-semibold">
                  Popular
                </div>
              )}

              <div>
                <h3 className="text-[28px] md:text-[32px] font-display font-light mb-4 text-charcoal">
                  {plan.name}
                </h3>

                <div className="flex items-baseline mb-8">
                  <span className={`text-[36px] md:text-[52px] font-display font-light ${
                    plan.isFeatured ? 'text-gold' : 'text-charcoal'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-[14px] font-body text-gray-muted ml-2 font-light">/mo</span>
                </div>

                <hr className="border-t border-beige-dark mb-8" />

                <ul className="space-y-4 mb-12">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start text-[14px] font-body font-light text-charcoal-mid">
                      <span className="text-gold mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className={`block w-full text-center py-4 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer ${
                  plan.isFeatured
                    ? 'bg-gold text-charcoal hover:bg-charcoal hover:text-white'
                    : 'border border-charcoal/20 text-charcoal/60 hover:bg-charcoal hover:text-white hover:border-charcoal'
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/membership"
            className="group inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium cursor-pointer"
          >
            <span className="relative">
              See Full Pricing
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms]">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
