'use client';

import React, { useState, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

type Transformation = {
  client: string;
  duration: string;
  goal: string;
  beforeImg: string;
  afterImg: string;
};

interface TrainerTransformationsProps {
  transformations: Transformation[];
}

export default function TrainerTransformations({ transformations }: TrainerTransformationsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!transformations || transformations.length === 0) return null;

  const customHandle = (
    <div className="h-full w-[1.5px] bg-gold relative cursor-ew-resize">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-gold bg-charcoal flex items-center justify-center">
        <div className="w-1 h-1 bg-gold rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block mb-6">
        RECENT CLIENT TRANSFORMATIONS
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {transformations.map((item, idx) => (
          <div key={idx} className="flex flex-col space-y-3">
            {/* Compare Slider */}
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-mid border border-beige-dark">
              {mounted ? (
                <ReactCompareSlider
                  handle={customHandle}
                  itemOne={
                    <div className="relative w-full h-full">
                      <ReactCompareSliderImage 
                        src={item.beforeImg} 
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
                        src={item.afterImg} 
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
                    src={item.afterImg} 
                    alt="After" 
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-3 right-3 z-10 text-[9px] font-body uppercase tracking-[0.2em] text-gold bg-black/40 px-2 py-0.5">
                    After
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-charcoal">
              <span className="text-[14px] font-body font-medium">{item.client} ({item.duration})</span>
              <span className="text-[11px] font-body uppercase tracking-wider text-gold font-semibold">{item.goal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
