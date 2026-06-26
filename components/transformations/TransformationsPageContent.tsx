'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

export default function TransformationsPageContent({ transformations: _transformations }: { transformations: TransformationDetail[] }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919454694546';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20IGYM,%20I'd%20like%20to%20book%20a%20free%20introductory%20personal%20training%20session.`;

  return (
    <div className="bg-white text-charcoal pt-10">
      
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

      {/* What Your Transformation Includes */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="text-center mb-16">
          <EyebrowLabel className="mb-4">WHAT TO EXPECT</EyebrowLabel>
          <h2 className="text-[32px] md:text-[48px] font-display font-light text-charcoal">
            Built around <em className="italic text-gold">you.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Deep Assessment',
              body: 'Your programme begins with a thorough biomechanical movement screen, posture analysis, and baseline body composition measurement. We do not skip steps — your starting point informs every training and nutrition decision that follows.',
            },
            {
              step: '02',
              title: 'Personalised Blueprint',
              body: 'No templates. Your coach designs a structured weekly training plan, a macro-precise nutrition strategy, and a recovery protocol specific to your goal, lifestyle, and timeline. Every variable is deliberate.',
            },
            {
              step: '03',
              title: 'Weekly Coaching',
              body: 'Progress is reviewed each week. Training loads are adjusted, nutrition targets are refined, and any sticking points are addressed before they stall momentum. Your programme evolves as you do.',
            },
            {
              step: '04',
              title: 'Measurable Outcomes',
              body: 'We track what matters — body composition, strength benchmarks, and lifestyle markers. At the end of your programme, you leave with a documented record of your progress and a framework to maintain and build on your results.',
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border border-beige-dark p-8 flex flex-col space-y-4"
            >
              <span className="text-[48px] font-display font-light text-gold/20 leading-none">{item.step}</span>
              <h3 className="text-[22px] font-display font-light text-charcoal">{item.title}</h3>
              <p className="text-[14px] font-body font-light text-gray-muted leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
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
            <span>Personalised to every member</span>
            <span className="text-white/20">•</span>
            <span>Assessment-first approach</span>
            <span className="text-white/20">•</span>
            <span>Weekly progress reviews</span>
            <span className="text-white/20">•</span>
            <span>★ 4.6 on Google</span>
            <span className="text-white/20">•</span>
            <span>Personalised to every member</span>
            <span className="text-white/20">•</span>
            <span>Assessment-first approach</span>
            <span className="text-white/20">•</span>
            <span>Weekly progress reviews</span>
            <span className="text-white/20">•</span>
            <span>★ 4.6 on Google</span>
            <span className="text-white/20">•</span>
            <span>Personalised to every member</span>
            <span className="text-white/20">•</span>
            <span>Assessment-first approach</span>
            <span className="text-white/20">•</span>
            <span>Weekly progress reviews</span>
            <span className="text-white/20">•</span>
            <span>★ 4.6 on Google</span>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
