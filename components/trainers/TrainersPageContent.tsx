'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export type TrainerCard = {
  slug: string;
  name: string;
  image: string;
  role: string;
  specialties: string[];
};

export default function TrainersPageContent({ trainers }: { trainers: TrainerCard[] }) {
  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="bg-charcoal text-white pt-24 min-h-screen">
      {/* Hero Header */}
      <section className="py-20 text-center border-b border-white/5 bg-charcoal-mid/10">
        <div className="max-w-[1440px] mx-auto px-6">
          <h1 className="text-[54px] md:text-[96px] font-display font-light uppercase tracking-tight text-white leading-none mb-4">
            OUR SPECIALISTS
          </h1>
          <p className="text-[14px] md:text-[16px] font-body uppercase tracking-[0.2em] text-gold font-medium">
            Each specialist is chosen for depth of expertise. Allocated entirely to your programme.
          </p>
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.slug}
              variants={cardVariants}
              className="flex flex-col group relative"
            >
              {/* Image with Aspect Ratio 4:5 */}
              <Link href={`/trainers/${trainer.slug}`} className="relative aspect-[4/5] overflow-hidden mb-6 block bg-charcoal-mid">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>

              {/* Text Block */}
              <div className="flex flex-col space-y-2 pb-6 relative">
                <h2 className="text-[24px] font-display font-light text-white leading-tight">
                  <Link href={`/trainers/${trainer.slug}`} className="hover:text-gold transition-colors">
                    {trainer.name}
                  </Link>
                </h2>
                
                <span className="text-[11px] font-body uppercase tracking-[0.15em] text-gold font-medium">
                  {trainer.role}
                </span>

                {/* Specialties Tag Cloud */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {trainer.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 bg-charcoal-mid border border-white/5 text-white text-[9px] font-body uppercase tracking-wider font-light"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/trainers/${trainer.slug}`}
                    className="inline-flex items-center text-[11px] font-body uppercase tracking-[0.18em] text-white hover:text-gold transition-colors"
                  >
                    View Profile <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                {/* Bottom line reveals on hover */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
