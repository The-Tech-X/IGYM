'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import EyebrowLabel from '../ui/EyebrowLabel';

type BillingCycle = 'monthly' | 'quarterly' | 'annual';

type PlanDetail = {
  name: string;
  isFeatured?: boolean;
  prices: {
    monthly: string;
    quarterly: string;
    annual: string;
  };
  periodSuffix: {
    monthly: string;
    quarterly: string;
    annual: string;
  };
  features: {
    text: string;
    included: boolean;
  }[];
  ctaLabel: string;
};

const plansData: PlanDetail[] = [
  {
    name: 'Essential',
    prices: {
      monthly: '₹2,500',
      quarterly: '₹6,500',
      annual: '₹22,000',
    },
    periodSuffix: {
      monthly: '/mo',
      quarterly: '/qtr',
      annual: '/yr',
    },
    features: [
      { text: 'Full gym floor access', included: true },
      { text: 'Locker room & private showers', included: true },
      { text: 'Group sessions (2 per week)', included: true },
      { text: 'IGYM member app', included: true },
      { text: 'Personal training sessions', included: false },
      { text: 'Café discount', included: false },
      { text: 'Guest visits', included: false },
    ],
    ctaLabel: 'Enquire',
  },
  {
    name: 'Signature',
    isFeatured: true,
    prices: {
      monthly: '₹4,000',
      quarterly: '₹10,500',
      annual: '₹36,000',
    },
    periodSuffix: {
      monthly: '/mo',
      quarterly: '/qtr',
      annual: '/yr',
    },
    features: [
      { text: 'Unlimited gym floor access', included: true },
      { text: 'Unlimited group sessions', included: true },
      { text: '2 PT sessions monthly', included: true },
      { text: 'App with nutrition tracking', included: true },
      { text: '10% café discount', included: true },
      { text: '1 guest visit per month', included: true },
      { text: 'Dedicated coach', included: false },
      { text: 'Body composition review', included: false },
    ],
    ctaLabel: 'Select Signature',
  },
  {
    name: 'Private',
    prices: {
      monthly: '₹7,500',
      quarterly: '₹19,500',
      annual: '₹68,000',
    },
    periodSuffix: {
      monthly: '/mo',
      quarterly: '/qtr',
      annual: '/yr',
    },
    features: [
      { text: 'Everything in Signature', included: true },
      { text: '8 PT sessions monthly', included: true },
      { text: 'Dedicated coach assigned', included: true },
      { text: 'Monthly body composition review', included: true },
      { text: '20% café discount', included: true },
      { text: '4 guest visits per month', included: true },
      { text: 'Priority session booking', included: true },
      { text: 'Recovery suite access', included: true },
    ],
    ctaLabel: 'Reserve',
  },
];

const comparisonMatrix = [
  { feature: 'Gym Floor Access', starter: 'Standard hours', pro: 'Unlimited (24/7)', elite: 'Unlimited (24/7)' },
  { feature: 'Locker & Shower Access', starter: '✓', pro: '✓', elite: '✓' },
  { feature: 'Group Sessions', starter: '2 per week', pro: 'Unlimited', elite: 'Unlimited + Priority' },
  { feature: 'IGYM Member App', starter: 'Standard', pro: 'With Trackers', elite: 'With Trackers' },
  { feature: 'Personal Training (PT)', starter: '✗', pro: '2 sessions/mo', elite: '8 sessions/mo' },
  { feature: 'Dedicated Coach', starter: '✗', pro: '✗', elite: '✓' },
  { feature: 'Body Composition Review', starter: '✗', pro: '✗', elite: 'Monthly' },
  { feature: 'Café Discount', starter: '✗', pro: '10%', elite: '20%' },
  { feature: 'Guest Visits', starter: '✗', pro: '1 per month', elite: '4 per month' },
  { feature: 'Recovery Suite Access', starter: '✗', pro: '✗', elite: '✓' },
];

const faqs = [
  {
    q: 'Can I pause my membership?',
    a: 'Yes. Essential memberships may be paused for up to 14 days per year. Signature memberships for up to 30 days. Private memberships for up to 60 days. Pause requests are submitted through the IGYM app with 48 hours notice.',
  },
  {
    q: 'Is there an initiation fee?',
    a: 'A one-time onboarding fee of ₹2,500 applies to Essential and Signature memberships. This covers your initial movement screening, body composition baseline, and app setup. The onboarding fee is waived for Private memberships.',
  },
  {
    q: 'Can I move between membership tiers?',
    a: 'You may upgrade at any point mid-cycle, paying only the prorated difference. Downgrades take effect at the close of your current billing period — monthly, quarterly, or annual.',
  },
  {
    q: 'What is the guest visit policy?',
    a: 'Signature members receive one guest visit per month. Private members receive four per month. Guests must register through the IGYM app at least two hours before arrival and present valid identification. Each guest may visit a maximum of twice per year.',
  },
  {
    q: 'Do you offer corporate or group arrangements?',
    a: 'We offer private wellness arrangements for select organisations with ten or more active members. Please reach out via WhatsApp or email at igymindia@gmail.com to discuss your requirements.',
  },
  {
    q: 'How do I schedule personal training sessions?',
    a: 'Signature and Private members book sessions directly through the IGYM app. Private members coordinate directly with their dedicated coach for scheduling and programme reviews.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-beige-dark py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
      >
        <span className="text-[16px] md:text-[18px] font-display font-normal text-charcoal group-hover:text-gold transition-colors duration-300">
          {q}
        </span>
        <span className="text-gold flex-shrink-0 ml-4">
          <motion.div
            animate={{ rotate: isOpen ? 185 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Plus size={18} />
          </motion.div>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pt-4 text-[14px] md:text-[15px] font-body font-light text-charcoal-mid leading-relaxed max-w-3xl">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

export default function MembershipPageContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="bg-white text-charcoal pt-32 pb-24">
      {/* Hero Header */}
      <section className="bg-beige-light py-20 text-center border-b border-beige-dark/30">
        <div className="max-w-[1440px] mx-auto px-6">
          <h1 className="text-[54px] md:text-[96px] font-display font-light uppercase tracking-tight text-charcoal leading-none mb-4">
            MEMBERSHIP
          </h1>
          <p className="text-[14px] md:text-[16px] font-body uppercase tracking-[0.2em] text-gold font-medium mb-12">
            Curated for those who hold themselves to the highest standard.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-2 bg-beige-mid/40 p-1.5 border border-beige-dark max-w-sm mx-auto">
            {(['monthly', 'quarterly', 'annual'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`relative flex-1 py-2 px-3 text-[11px] font-body uppercase tracking-wider transition-colors duration-300 rounded-none cursor-pointer ${
                  billingCycle === cycle
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal-mid hover:text-charcoal'
                }`}
              >
                {cycle === 'annual' && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gold text-charcoal text-[8px] font-semibold uppercase px-2 py-0.5 whitespace-nowrap tracking-widest">
                    Save 20%
                  </span>
                )}
                {cycle}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plansData.map((plan) => {
            const price = plan.prices[billingCycle];
            const suffix = plan.periodSuffix[billingCycle];

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between p-8 bg-white border transition-all duration-500 ${
                  plan.isFeatured
                    ? 'border-gold shadow-lg lg:scale-[1.03] z-10'
                    : 'border-beige-dark'
                }`}
              >
                {/* Popular tag */}
                {plan.isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-charcoal text-[9px] font-body uppercase tracking-[0.2em] font-medium">
                    Most Popular
                  </div>
                )}

                <div>
                  <h2 className="text-[28px] md:text-[32px] font-display font-light text-charcoal mb-4">
                    {plan.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline mb-8">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-[48px] md:text-[52px] font-display font-light text-charcoal"
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[14px] font-body text-gray-muted ml-2 font-light">{suffix}</span>
                  </div>

                  <hr className="border-t border-beige-dark mb-8" />

                  {/* Feature Lists */}
                  <ul className="space-y-4 mb-12">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start text-[14px] font-body font-light text-charcoal-mid">
                        {feat.included ? (
                          <span className="text-gold mr-3 mt-0.5">✓</span>
                        ) : (
                          <span className="text-beige-dark mr-3 mt-0.5">✗</span>
                        )}
                        <span className={feat.included ? '' : 'text-gray-muted line-through opacity-70'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <div>
                  <button
                    className={`w-full py-4 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-300 rounded-none cursor-pointer border ${
                      plan.isFeatured
                        ? 'bg-charcoal text-white hover:bg-gold hover:text-charcoal border-charcoal hover:border-gold'
                        : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                    }`}
                  >
                    {plan.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[28px] md:text-[36px] font-display font-light text-center text-charcoal mb-12">
            Membership at a Glance
          </h2>

          <div className="overflow-x-auto border border-beige-dark">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-charcoal text-white uppercase text-[11px] font-body tracking-[0.2em]">
                  <th className="py-4 px-6 sticky left-0 bg-charcoal z-10">Feature</th>
                  <th className="py-4 px-6 text-center">Essential</th>
                  <th className="py-4 px-6 text-center">Signature</th>
                  <th className="py-4 px-6 text-center">Private</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-body font-light text-charcoal-mid">
                {comparisonMatrix.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-beige-light/40' : 'bg-white'}
                  >
                    <td className="py-4 px-6 font-medium border-b border-beige-dark/30 sticky left-0 bg-inherit z-10 text-charcoal">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-center border-b border-beige-dark/30">
                      {row.starter}
                    </td>
                    <td className="py-4 px-6 text-center border-b border-beige-dark/30 font-medium text-charcoal">
                      {row.pro}
                    </td>
                    <td className="py-4 px-6 text-center border-b border-beige-dark/30 font-semibold text-gold">
                      {row.elite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <EyebrowLabel className="mb-4">FAQ</EyebrowLabel>
            <h2 className="text-[32px] md:text-[40px] font-display font-light text-charcoal">
              Common Questions
            </h2>
          </div>
          
          <div className="flex flex-col border-t border-beige-dark">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
