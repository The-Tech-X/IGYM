'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

interface ParallaxImageProps extends Omit<ImageProps, 'className' | 'fill' | 'style'> {
  containerClassName?: string;
  imageClassName?: string;
}

export default function ParallaxImage({
  src,
  alt,
  containerClassName = '',
  imageClassName = '',
  ...props
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // map progress to offset from -60px to 60px as requested
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover ${imageClassName}`}
          {...props}
        />
      </motion.div>
    </div>
  );
}
