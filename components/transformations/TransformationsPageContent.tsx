'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import EyebrowLabel from '../ui/EyebrowLabel';

export type GoalType = 'Weight Loss' | 'Muscle Gain' | 'Athletic Performance' | 'Post-Rehab';

export type TransformationDetail = {
  clientName: string;
  duration: string;
  goal: string;
  goalType: GoalType;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
  trainerName: string;
  trainerSlug: string;
};

const processSteps = [
  {
    num: '1',
    title: 'Assessment',
    desc: 'Deep-dive biomechanical movement analysis, detailed 3D body composition scan, and target goal profiling.',
  },
  {
    num: '2',
    title: 'Programme',
    desc: 'Creation of a personalized 12-week blueprint mapping training volume, recovery protocols, and macro-nutrition.',
  },
  {
    num: '3',
    title: 'Results',
    desc: 'Weekly check-ins, continuous biomarker tracking, and fine adjustments to keep your transformation accelerating.',
  },
];

const packages = [
  {
    name: 'Foundation',
    sessions: '8 Sessions',
    price: '₹18,000',
    desc: 'Establishes movement baselines, corrects form, and introduces the methodical approach that underpins all IGYM programming.',
    features: [
      '8 personal training sessions',
      'Initial movement & posture assessment',
      'Baseline macro targets',
      'Gym floor access during sessions',
    ],
  },
  {
    name: 'Signature Programme',
    sessions: '24 Sessions',
    price: '₹48,000',
    isFeatured: true,
    desc: 'Our comprehensive programme. Designed for complete structural adaptation, body composition change, and measurable performance gains.',
    features: [
      '24 personal training sessions',
      'Advanced movement & body composition scans',
      'Custom macro-precise nutrition plan',
      'Weekly performance adjustment reviews',
      '2 guest visits per month',
    ],
  },
  {
    name: 'Private Coaching',
    sessions: 'Ongoing Retainer',
    price: '₹75,000',
    desc: 'For those who require a permanent coaching relationship. Unlimited sessions, full access, and dedicated support across every variable.',
    features: [
      'Unlimited scheduled sessions',
      'Dedicated coach assigned',
      'Full custom nutrition catering access',
      'Priority booking & recovery suite',
      'Monthly health marker reviews',
    ],
  },
];

export default function TransformationsPageContent({ transformations }: { transformations: TransformationDetail[] }) {
  const [activeFilter, setActiveFilter] = useState<GoalType | 'All'>('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = activeFilter === 'All'
    ? transformations
    : transformations.filter((item) => item.goalType === activeFilter);

  const customHandle = (
    <div className="h-full w-[1.5px] bg-gold relative cursor-ew-resize">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gold bg-charcoal flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
      </div>
    </div>
  );

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20IGYM,%20I'd%20like%20to%20book%20a%20free%20introductory%20personal%20training%20session.`;

  return (
    <div className="bg-white text-charcoal pt-20">
      
      {/* Hero Header */}
      <section className="bg-charcoal text-white py-24 md:py-32 text-center relative overflow-hidden border-b border-gold/15">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 space-y-6">
          <EyebrowLabel>PERSONAL TRAINING</EyebrowLabel>
          <h1 className="text-[54px] md:text-[80px] font-display font-light text-white leading-none max-w-4xl mx-auto uppercase">
            Where progress is by design.
          </h1>
          <p className="text-[14px] md:text-[18px] font-body uppercase tracking-[0.2em] text-gold font-light max-w-md mx-auto">
            Evidence-led. Precision-designed. Lasting.
          </p>
        </div>
      </section>

      {/* How It Works Process */}
      <section className="bg-beige-light/50 py-24 border-b border-beige-dark/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <EyebrowLabel className="mb-4">THE PROCESS</EyebrowLabel>
            <h2 className="text-[32px] md:text-[40px] font-display font-light text-charcoal">
              How the programme works
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto pt-8">
            {/* Horizontal line for desktop connecting steps */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-gold/30 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {processSteps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center space-y-4">
                  {/* Step bubble */}
                  <div className="w-12 h-12 rounded-full border border-gold bg-white text-gold flex items-center justify-center font-display text-[18px] font-light shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="text-[22px] font-display font-light text-charcoal">
                    {step.title}
                  </h3>
                  <p className="text-[14px] font-body font-light text-gray-muted max-w-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Gallery */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Gallery Headers */}
        <div className="text-center mb-16">
          <EyebrowLabel className="mb-4">THE WORK SPEAKS</EyebrowLabel>
          <h2 className="text-[32px] md:text-[48px] font-display font-light text-charcoal">
            Their commitment. <em className="italic text-gold">Our craft.</em>
          </h2>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 max-w-4xl mx-auto">
          {['All', 'Weight Loss', 'Muscle Gain', 'Athletic Performance', 'Post-Rehab'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-5 py-2.5 text-[11px] font-body uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'border-beige-dark text-charcoal-mid hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry / Grid reflow */}
        <div className="max-w-6xl mx-auto min-h-[500px]">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredData.map((item) => (
                <motion.div
                  layout
                  key={item.clientName}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col bg-beige-light/20 border border-beige-dark/50 p-6 space-y-4 h-full justify-between"
                >
                  <div>
                    {/* Compare Slider */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-mid border border-beige-dark mb-4">
                      {mounted ? (
                        <ReactCompareSlider
                          handle={customHandle}
                          itemOne={
                            <div className="relative w-full h-full">
                              <ReactCompareSliderImage 
                                src={item.beforeImage} 
                                alt="Before" 
                                className="object-cover w-full h-full"
                              />
                              <span className="absolute bottom-3 left-3 z-10 text-[9px] font-body uppercase tracking-[0.2em] text-white bg-black/40 px-2 py-0.5">
                                Before
                              </span>
                            </div>
                          }
                          itemTwo={
                            <div className="relative w-full h-full">
                              <ReactCompareSliderImage 
                                src={item.afterImage} 
                                alt="After" 
                                className="object-cover w-full h-full"
                              />
                              <span className="absolute bottom-3 right-3 z-10 text-[9px] font-body uppercase tracking-[0.2em] text-gold bg-black/40 px-2 py-0.5">
                                After
                              </span>
                            </div>
                          }
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img 
                            src={item.afterImage} 
                            alt="After" 
                            className="object-cover w-full h-full"
                          />
                          <span className="absolute bottom-3 right-3 z-10 text-[9px] font-body uppercase tracking-[0.2em] text-gold bg-black/40 px-2 py-0.5">
                            After
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[18px] font-display font-light text-charcoal">
                          {item.clientName} · <span className="text-gray-muted text-[13px] font-body">{item.duration}</span>
                        </h3>
                        <Link 
                          href={`/trainers/${item.trainerSlug}`}
                          className="text-[12px] font-body text-gray-muted hover:text-gold transition-colors mt-0.5 block"
                        >
                          with {item.trainerName} →
                        </Link>
                      </div>
                      <span className="px-2.5 py-1 bg-gold/10 text-gold border border-gold/10 text-[9px] font-body uppercase tracking-wider font-semibold">
                        {item.goal}
                      </span>
                    </div>

                    <blockquote className="text-[14px] font-display italic font-light text-charcoal-mid leading-relaxed mt-4 border-l border-gold/40 pl-4">
                      &ldquo;{item.testimonial}&rdquo;
                    </blockquote>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </section>

      {/* PT Packages */}
      <section className="bg-white py-24 border-t border-beige-dark/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          
          <div className="text-center mb-20">
            <EyebrowLabel className="mb-4">PRIVATE COACHING</EyebrowLabel>
            <h2 className="text-[32px] md:text-[48px] font-display font-light text-charcoal">
              Coaching <em className="italic text-gold">Programmes</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex flex-col justify-between p-8 bg-white border transition-all duration-500 ${
                  pkg.isFeatured
                    ? 'border-gold shadow-lg lg:scale-[1.03] z-10'
                    : 'border-beige-dark'
                }`}
              >
                {pkg.isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-charcoal text-[9px] font-body uppercase tracking-[0.2em] font-medium">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-[28px] md:text-[32px] font-display font-light text-charcoal mb-1">
                    {pkg.name}
                  </h3>
                  <span className="text-[12px] font-body uppercase tracking-wider text-gold font-medium block mb-4">
                    {pkg.sessions}
                  </span>

                  <div className="flex items-baseline mb-6">
                    <span className="text-[44px] md:text-[48px] font-display font-light text-charcoal">
                      {pkg.price}
                    </span>
                  </div>

                  <p className="text-[13px] font-body font-light text-gray-muted mb-6 leading-relaxed">
                    {pkg.desc}
                  </p>

                  <hr className="border-t border-beige-dark mb-6" />

                  <ul className="space-y-4 mb-12">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start text-[13px] font-body font-light text-charcoal-mid">
                        <span className="text-gold mr-3 mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-4 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-300 rounded-none cursor-pointer border ${
                      pkg.isFeatured
                        ? 'bg-charcoal text-white hover:bg-gold hover:text-charcoal border-charcoal hover:border-gold'
                        : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                    }`}
                  >
                    Arrange a Consultation
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Social Proof Stats Ticker (Framer Motion Loop) */}
      <section className="bg-charcoal text-white py-8 border-y border-gold/15 overflow-hidden">
        <div className="w-full flex">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
            className="flex whitespace-nowrap gap-16 text-[12px] font-body uppercase tracking-[0.2em] text-gold font-medium"
          >
            {/* Repeated content to make it seamless */}
            <span>94% member retention</span>
            <span className="text-white/20">•</span>
            <span>Average 14-week programme</span>
            <span className="text-white/20">•</span>
            <span>500+ programmes completed</span>
            <span className="text-white/20">•</span>
            <span>★ 4.9 on Google</span>
            <span className="text-white/20">•</span>
            <span>94% member retention</span>
            <span className="text-white/20">•</span>
            <span>Average 14-week programme</span>
            <span className="text-white/20">•</span>
            <span>500+ programmes completed</span>
            <span className="text-white/20">•</span>
            <span>★ 4.9 on Google</span>
            <span className="text-white/20">•</span>
            <span>94% member retention</span>
            <span className="text-white/20">•</span>
            <span>Average 14-week programme</span>
            <span className="text-white/20">•</span>
            <span>500+ programmes completed</span>
            <span className="text-white/20">•</span>
            <span>★ 4.9 on Google</span>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
