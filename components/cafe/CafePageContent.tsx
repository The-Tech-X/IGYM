'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Activity, Zap } from 'lucide-react';
import EyebrowLabel from '../ui/EyebrowLabel';

export type MenuItem = {
  name: string;
  category: 'Pre-Workout' | 'Post-Workout' | 'Meals' | 'Juices' | 'Shakes';
  description: string;
  price: number;
  image: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
};

const categoriesList = ['Pre-Workout', 'Post-Workout', 'Meals', 'Juices', 'Shakes'] as const;

export default function CafePageContent({ items }: { items: MenuItem[] }) {
  const [activeTab, setActiveTab] = useState<typeof categoriesList[number]>('Pre-Workout');

  const filteredItems = items.filter((item) => item.category === activeTab);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20IGYM,%20I'd%20like%20to%20book%20a%20free%20consultation%20with%20your%20nutritionist.`;

  return (
    <div className="bg-white text-charcoal pt-20">
      
      {/* Hero: Split screen */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh] border-b border-beige-dark/30">
        {/* Left Half: Large Editorial Image */}
        <div className="lg:col-span-6 relative h-[45vh] lg:h-auto bg-charcoal-mid">
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200"
            alt="IGYM Editorial Nutrition"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {/* Right Half: Text content */}
        <div className="lg:col-span-6 bg-beige-light flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 md:py-24 space-y-6">
          <EyebrowLabel>IGYM CAFÉ</EyebrowLabel>
          <h1 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Where performance<br />meets pleasure.
          </h1>
          <p className="text-[16px] font-body font-light text-charcoal-mid leading-relaxed max-w-lg">
            Recovery begins at the cellular level. Designed by sports nutritionists and built for high-performance athletes, our menu ensures every ingredient serves a physiological purpose.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-beige-light border border-gold/15 w-fit">
              <Zap size={22} className="text-gold" />
            </div>
            <h3 className="text-[22px] font-display font-light text-charcoal">
              Macro-Precise
            </h3>
            <p className="text-[14px] font-body font-light text-gray-muted leading-relaxed">
              Every meal, shake, and juice displays exact protein, carbohydrate, fat, and calorie breakdowns for accurate tracking.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-beige-light border border-gold/15 w-fit">
              <Flame size={22} className="text-gold" />
            </div>
            <h3 className="text-[22px] font-display font-light text-charcoal">
              Whole Ingredients
            </h3>
            <p className="text-[14px] font-body font-light text-gray-muted leading-relaxed">
              We source organic greens, grass-fed proteins, wild seafood, and cold-pressed bases with zero refined sugars or artificial fillers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-beige-light border border-gold/15 w-fit">
              <Activity size={22} className="text-gold" />
            </div>
            <h3 className="text-[22px] font-display font-light text-charcoal">
              Performance-First
            </h3>
            <p className="text-[14px] font-body font-light text-gray-muted leading-relaxed">
              Specifically formulated timing protocols—whether priming pathways before lifting or restoring glycogen reserves after training.
            </p>
          </div>

        </div>
      </section>

      {/* Menu Section */}
      <section className="bg-beige-light/40 py-24 border-t border-beige-dark/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          
          {/* Section Headers */}
          <div className="text-center mb-16">
            <EyebrowLabel className="mb-4">THE MENU</EyebrowLabel>
            <h2 className="text-[32px] md:text-[48px] font-display font-light text-charcoal">
              Nourish with precision.
            </h2>
          </div>

          {/* Menu Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 max-w-3xl mx-auto">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 text-[11px] font-body uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer border ${
                  activeTab === cat
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'border-beige-dark text-charcoal-mid hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic Menu Grid */}
          <div className="max-w-6xl mx-auto min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {filteredItems.map((item) => (
                  <div 
                    key={item.name}
                    className="flex flex-col sm:flex-row bg-white border border-beige-dark/50 group h-full overflow-hidden"
                  >
                    {/* Item Image */}
                    <div className="relative aspect-square w-full sm:w-[180px] flex-shrink-0 bg-charcoal-mid overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-[18px] font-display font-medium text-charcoal leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-[14px] font-body text-gold font-medium flex-shrink-0 ml-4">
                            ₹{item.price}
                          </span>
                        </div>
                        <p className="text-[13px] font-body font-light text-gray-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Macros row */}
                      <div className="flex items-center flex-wrap gap-2 pt-4 mt-4 border-t border-beige-light/80 text-[10px] font-body uppercase tracking-wider">
                        <span className="px-2 py-0.5 bg-beige-light text-charcoal font-medium">
                          P: {item.macros.protein}g
                        </span>
                        <span className="px-2 py-0.5 bg-beige-light text-charcoal font-medium">
                          C: {item.macros.carbs}g
                        </span>
                        <span className="px-2 py-0.5 bg-beige-light text-charcoal font-medium">
                          F: {item.macros.fat}g
                        </span>
                        <span className="px-2 py-0.5 bg-gold/10 text-gold font-semibold border border-gold/10 ml-auto">
                          {item.macros.calories} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Advisory CTA */}
      <section className="bg-charcoal text-white py-20 text-center relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 space-y-6">
          <EyebrowLabel>NUTRITION ADVISORY</EyebrowLabel>
          <h2 className="text-[32px] md:text-[48px] font-display font-light text-white leading-tight max-w-2xl mx-auto">
            Speak with our nutritionist.
          </h2>
          <p className="text-[14px] md:text-[16px] font-body font-light text-gray-muted max-w-md mx-auto leading-relaxed">
            A private consultation to align your nutrition precisely with your training programme and performance objectives.
          </p>
          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gold text-charcoal text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-colors hover:bg-white duration-300 rounded-none cursor-pointer"
            >
              Arrange a Consultation
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
