'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

export type ArticleItem = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
};

export default function JournalPreview({ articles }: { articles: ArticleItem[] }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section 
      ref={containerRef}
      className="py-28 lg:py-40 bg-beige-light overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
            <EyebrowLabel>THE JOURNAL</EyebrowLabel>
          </div>
          <h2 className="text-[40px] md:text-[56px] font-display font-light text-charcoal leading-tight">
            Knowledge is <em className="italic text-gold">part of training.</em>
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-white border border-beige-dark/50 relative group cursor-pointer h-full justify-between"
            >
              <div>
                {/* 16:9 Image Container */}
                <Link href={`/journal/${article.slug}`} className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden block">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-charcoal text-white text-[9px] font-body uppercase tracking-widest">
                    {article.category}
                  </span>
                </Link>

                {/* Article Info */}
                <div className="p-6 md:p-8 flex flex-col space-y-4">
                  <span className="text-[11px] font-body uppercase tracking-[0.1em] text-gray-muted">
                    {article.author} · {article.date}
                  </span>
                  
                  <h3 className="text-[20px] md:text-[22px] font-display font-light text-charcoal leading-snug group-hover:text-gold transition-colors">
                    <Link href={`/journal/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-[14px] font-body font-light text-charcoal-mid line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Read button */}
              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                <Link
                  href={`/journal/${article.slug}`}
                  className="inline-flex items-center text-[11px] font-body uppercase tracking-[0.18em] text-charcoal font-medium group/link"
                >
                  Read <span className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* Bottom Gold border on Hover */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </motion.article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <Link
            href="/journal"
            className="group inline-flex items-center text-[13px] font-body uppercase tracking-[0.18em] text-charcoal font-medium cursor-pointer"
          >
            <span className="relative">
              Visit the Journal
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
            </span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
