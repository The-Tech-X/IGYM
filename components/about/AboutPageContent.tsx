'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

// ─── Founder image placeholder — replace with real photo ─────────────────────
const FOUNDER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
const GYM_PLACEHOLDER =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1400';
// ─────────────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  'TechnoGym Partner',
  'Est. 2023',
  'Diamond Hills · Gachibowli',
  '7-Star Standard',
  'The ProTein Co.',
  'Expert Coaching',
  'Hyderabad\'s Finest',
];

const pillars = [
  {
    num: '01',
    title: 'Equipment',
    body: 'Every machine, every weight, every surface — by TechnoGym. The global benchmark in professional athletics, trusted by Olympic training centres and world champions.',
  },
  {
    num: '02',
    title: 'Environment',
    body: 'A space that demands performance. Designed with deliberate attention to acoustics, lighting, airflow, and spatial flow. The gym floor is a precision instrument.',
  },
  {
    num: '03',
    title: 'Expertise',
    body: 'Coaches who understand the science. Nutritionists who build the plan. Staff who hold themselves to the same standard they expect from every member.',
  },
  {
    num: '04',
    title: 'Nutrition',
    body: 'The ProTein Co. — our in-house cafe — ensures that what follows the workout is as precise as the workout itself. Expert-guided, macro-considered, and built for performance.',
  },
];

export default function AboutPageContent() {
  return (
    <div className="bg-white text-charcoal">

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── 2. TICKER ────────────────────────────────────────────────────── */}
      <TickerBanner />

      {/* ─── 3. ORIGIN ────────────────────────────────────────────────────── */}
      <OriginSection />

      {/* ─── 4. THE FOUR PILLARS ──────────────────────────────────────────── */}
      <PillarsSection />

      {/* ─── 5. TECHNOGYM ─────────────────────────────────────────────────── */}
      <TechnoGymSection />

      {/* ─── 6. THE PROTEIN CO. ───────────────────────────────────────────── */}
      <ProteinCoSection />

      {/* ─── 7. CLOSING CTA ───────────────────────────────────────────────── */}
      <ClosingCTA />

    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-end overflow-hidden bg-charcoal">

      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={GYM_PLACEHOLDER}
          alt="IGYM facility"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
      </motion.div>

      {/* Large decorative "7★" */}
      <div
        aria-hidden
        className="absolute top-1/2 right-8 md:right-16 lg:right-24 -translate-y-1/2 select-none pointer-events-none"
        style={{ fontSize: 'clamp(160px, 22vw, 340px)', lineHeight: 1, fontFamily: 'var(--font-display, serif)', fontWeight: 300, color: 'rgba(196,163,90,0.07)', letterSpacing: '-0.02em' }}
      >
        7★
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-20 md:pb-28 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-6 h-px bg-gold" />
            <EyebrowLabel>Our Story</EyebrowLabel>
          </div>

          <h1 className="text-[52px] md:text-[80px] lg:text-[100px] font-display font-light text-white leading-[0.95] tracking-tight max-w-4xl">
            The environment<br />
            <em className="italic text-gold">is the edge.</em>
          </h1>

          <p className="mt-8 text-[15px] md:text-[17px] font-body font-light text-white/60 max-w-xl leading-relaxed">
            At IGYM, we designed everything — space, equipment, expertise, nutrition —
            so that every time you walk in, your only job is to be better than yesterday.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold/50" />
          <span className="text-[9px] font-body uppercase tracking-[0.22em] text-white/30">Scroll</span>
        </motion.div>
      </motion.div>

    </section>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function TickerBanner() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-gold overflow-hidden py-3.5">
      <motion.div
        animate={{ x: [0, '-50%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span className="text-[10px] font-body uppercase tracking-[0.28em] text-charcoal font-semibold px-6">
              {item}
            </span>
            <span className="text-charcoal/30 text-[10px]">·</span>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

// ─── ORIGIN ───────────────────────────────────────────────────────────────────

function OriginSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="py-28 lg:py-40 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 items-start">

          {/* Left — year monument + founder photo */}
          <div className="lg:col-span-5 relative">

            {/* Giant year — decorative background text */}
            <div
              aria-hidden
              className="absolute -top-8 -left-4 md:-left-8 select-none pointer-events-none font-display font-light text-beige-dark/60 leading-none"
              style={{ fontSize: 'clamp(120px, 18vw, 220px)', letterSpacing: '-0.04em' }}
            >
              2023
            </div>

            {/* Founder image */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-24 lg:mt-28 ml-8 md:ml-16"
            >
              <div className="relative w-full aspect-[3/4] max-w-[340px] overflow-hidden">
                <Image
                  src={FOUNDER_PLACEHOLDER}
                  alt="Vamshi Reddy — Founder, IGYM"
                  fill
                  sizes="(max-width: 1024px) 340px, 22vw"
                  className="object-cover"
                />
                {/* Gold border accent */}
                <div className="absolute inset-0 ring-1 ring-inset ring-gold/20" />
              </div>

              {/* Name plate */}
              <div className="absolute -bottom-5 -right-5 bg-charcoal px-5 py-3">
                <p className="text-[13px] font-display font-light text-white leading-snug">Vamshi Reddy</p>
                <p className="text-[9px] font-body uppercase tracking-[0.22em] text-gold mt-0.5">Founder, IGYM</p>
              </div>

              {/* Replace placeholder note */}
              <p className="mt-8 text-[10px] font-body text-gray-muted tracking-[0.08em] italic">
                * Founder photo — replace with real image
              </p>
            </motion.div>
          </div>

          {/* Right — story */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center pt-8 lg:pt-40"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-6 h-px bg-gold" />
              <EyebrowLabel>The Beginning</EyebrowLabel>
            </div>

            <h2 className="text-[36px] md:text-[48px] font-display font-light text-charcoal leading-tight mb-8">
              A benchmark,<br />
              <em className="italic text-gold">not just a gym.</em>
            </h2>

            <div className="space-y-5 text-[15px] font-body font-light text-charcoal-mid leading-[1.85]">
              <p>
                In 2023, Vamshi Reddy set out to build something Hyderabad had never seen — a
                fitness facility where absolutely nothing was ordinary. Not the floor space, not the
                coaching, not the equipment, not the food.
              </p>
              <p>
                The vision was precise: a 7-star standard applied to every dimension of the member
                experience. Where other facilities compete on price or footprint, IGYM competes on
                depth — the depth of expertise, the depth of the environment, the depth of care for
                every detail a member encounters.
              </p>
              <p>
                That founding intention has not changed. Every decision made at IGYM — from which
                equipment fills the floor to what goes on the cafe menu — is held against the same
                question: is this the best it can possibly be?
              </p>
            </div>

            {/* Est. callout */}
            <div className="mt-10 pt-8 border-t border-beige-dark flex items-center gap-8">
              <div>
                <p className="text-[40px] font-display font-light text-charcoal leading-none">2023</p>
                <p className="text-[9px] font-body uppercase tracking-[0.22em] text-gold mt-1">Year Founded</p>
              </div>
              <div className="w-px h-12 bg-beige-dark" />
              <div>
                <p className="text-[40px] font-display font-light text-charcoal leading-none">7<span className="text-gold text-[28px]">★</span></p>
                <p className="text-[9px] font-body uppercase tracking-[0.22em] text-gold mt-1">Standard</p>
              </div>
              <div className="w-px h-12 bg-beige-dark" />
              <div>
                <p className="text-[14px] font-display font-light text-charcoal leading-snug">Gachibowli<br />Hyderabad</p>
                <p className="text-[9px] font-body uppercase tracking-[0.22em] text-gold mt-1">Location</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── PILLARS ──────────────────────────────────────────────────────────────────

function PillarsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="bg-beige-light py-24 md:py-32 border-y border-beige-dark/40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-gold" />
            <EyebrowLabel>The Four Pillars</EyebrowLabel>
            <span className="inline-block w-6 h-px bg-gold" />
          </div>
          <h2 className="text-[32px] md:text-[44px] font-display font-light text-charcoal">
            What the 7-star standard<br />
            <em className="italic text-gold">actually means.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-beige-dark">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 md:p-10 border-r border-b border-beige-dark last:border-r-0 lg:[&:nth-child(4)]:border-r-0 [&:nth-child(3)]:lg:border-r [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0 group bg-white hover:bg-charcoal transition-colors duration-500"
            >
              <span className="text-[56px] font-display font-light text-beige-dark group-hover:text-gold/20 transition-colors duration-500 leading-none block mb-6 select-none">
                {pillar.num}
              </span>
              <h3 className="text-[20px] font-display font-light text-charcoal group-hover:text-white transition-colors duration-500 mb-3">
                {pillar.title}
              </h3>
              <p className="text-[13px] font-body font-light text-gray-muted group-hover:text-white/60 transition-colors duration-500 leading-relaxed">
                {pillar.body}
              </p>
              {/* Gold accent line at bottom on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── TECHNOGYM ────────────────────────────────────────────────────────────────

function TechnoGymSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="bg-charcoal py-28 md:py-40 relative overflow-hidden">

      {/* Background text watermark */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none font-display font-light whitespace-nowrap"
        style={{ fontSize: 'clamp(80px, 12vw, 180px)', color: 'rgba(196,163,90,0.04)', letterSpacing: '0.1em' }}
      >
        TECHNOGYM
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — statement */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-6 h-px bg-gold" />
              <EyebrowLabel>Equipment Partner</EyebrowLabel>
            </div>

            <h2 className="text-[36px] md:text-[52px] font-display font-light text-white leading-tight mb-8">
              Training tools trusted<br />
              <em className="italic text-gold">by world champions.</em>
            </h2>

            <div className="space-y-5 text-[14px] md:text-[15px] font-body font-light text-white/60 leading-[1.85]">
              <p>
                TechnoGym is the global benchmark in professional athletics equipment.
                The same machines found in elite national training centres, Olympic preparation
                facilities, and the private gyms of world-record holders.
              </p>
              <p>
                At IGYM, we made a deliberate choice to never compromise on the tools. Because the
                quality of your training is inseparable from the quality of what you train with.
                Every resistance, every cable, every surface — engineered for performance.
              </p>
            </div>

            {/* Partner badge */}
            <div className="mt-10 inline-flex items-center gap-4 border border-gold/20 px-6 py-4">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[11px] font-body uppercase tracking-[0.25em] text-gold font-medium">
                Official TechnoGym Partner Facility
              </span>
            </div>
          </motion.div>

          {/* Right — stat grid */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-px bg-white/5"
          >
            {[
              { val: '#1', label: 'Premium Equipment Brand Globally' },
              { val: '100+', label: 'Countries with TechnoGym Installations' },
              { val: '8×', label: 'Consecutive Olympics Official Supplier' },
              { val: '0', label: 'Compromises on Equipment Standard' },
            ].map((stat, i) => (
              <div key={i} className="bg-charcoal p-8 flex flex-col justify-between">
                <p className="text-[48px] md:text-[56px] font-display font-light text-white leading-none">
                  {stat.val}
                </p>
                <p className="text-[11px] font-body font-light text-white/40 leading-snug mt-4">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── THE PROTEIN CO. ─────────────────────────────────────────────────────────

function ProteinCoSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="py-28 md:py-40 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-6 h-px bg-gold" />
              <EyebrowLabel>In-House Nutrition</EyebrowLabel>
            </div>

            <h2 className="text-[36px] md:text-[52px] font-display font-light text-charcoal leading-tight mb-8">
              Nutrition is not<br />
              separate from training.<br />
              <em className="italic text-gold">It is training.</em>
            </h2>

            <div className="space-y-5 text-[14px] md:text-[15px] font-body font-light text-charcoal-mid leading-[1.85]">
              <p>
                The ProTein Co. is IGYM's own nutrition cafe — built for members who understand that
                peak performance starts before and continues after the gym floor. Every item is
                crafted with performance in mind: macro-precise, expert-guided, and designed for
                the demands of serious training.
              </p>
              <p>
                This isn't a vending machine or a protein shake counter. It's a full cafe concept
                where a nutrition expert works alongside the kitchen to ensure everything served
                actively supports your goals.
              </p>
            </div>

            <Link
              href="/cafe"
              className="inline-flex items-center gap-3 mt-10 text-[11px] font-body uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors group"
            >
              Explore The ProTein Co.
              <span className="w-8 h-px bg-charcoal group-hover:bg-gold transition-colors group-hover:w-12 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Right — large name display */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="relative bg-beige-light p-10 md:p-16 overflow-hidden">

              {/* Decorative large text */}
              <div
                aria-hidden
                className="absolute -bottom-4 -right-2 select-none pointer-events-none font-display font-light text-beige-dark/70 leading-none"
                style={{ fontSize: 'clamp(60px, 9vw, 120px)', letterSpacing: '-0.02em' }}
              >
                PRO
              </div>

              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-[9px] font-body uppercase tracking-[0.28em] text-gold font-medium mb-3">
                    Part of IGYM · Est. 2023
                  </p>
                  <h3 className="text-[38px] md:text-[52px] font-display font-light text-charcoal leading-tight">
                    The<br />ProTein Co.
                  </h3>
                </div>

                <div className="w-12 h-px bg-gold" />

                <ul className="space-y-3">
                  {[
                    'Expert nutritionist-guided menu',
                    'Macro-precise meal options',
                    'Pre & post-workout nutrition',
                    'Performance supplements',
                    'Custom diet consultation available',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] font-body font-light text-charcoal-mid">
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── CLOSING CTA ─────────────────────────────────────────────────────────────

function ClosingCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919454694546'}?text=Hi%20IGYM%2C%20I%27d%20like%20to%20know%20more%20about%20membership.`;

  return (
    <section ref={ref} className="bg-charcoal py-28 md:py-40 relative overflow-hidden">

      {/* Corner accent lines */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/20" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto px-6 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="inline-block w-10 h-px bg-gold/40" />
          <EyebrowLabel>Diamond Hills · Gachibowli · Hyderabad</EyebrowLabel>
          <span className="inline-block w-10 h-px bg-gold/40" />
        </div>

        <h2 className="text-[40px] md:text-[64px] font-display font-light text-white leading-tight mb-6">
          Come and see<br />
          <em className="italic text-gold">the standard.</em>
        </h2>

        <p className="text-[14px] font-body font-light text-white/50 leading-relaxed mb-12 max-w-md mx-auto">
          A visit to IGYM says more than any page can. Book a tour, explore the floor,
          meet the team. No obligation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-gold text-charcoal text-[11px] font-body uppercase tracking-[0.2em] font-semibold hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Book a Tour
          </a>
          <Link
            href="/membership"
            className="px-10 py-4 border border-white/20 text-white text-[11px] font-body uppercase tracking-[0.2em] font-medium hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer"
          >
            View Membership
          </Link>
        </div>

        <p className="mt-10 text-[11px] font-body font-light text-white/25 tracking-[0.08em]">
          Mon – Sat: 5:00 AM – 10:00 PM · Sun: 6:00 AM – 12:00 Noon
        </p>
      </motion.div>

    </section>
  );
}
