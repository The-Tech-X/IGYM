'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

export type JournalCard = {
  slug: string;
  title: string;
  category: 'Training' | 'Nutrition' | 'Mindset' | 'Recovery';
  excerpt: string;
  image: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  readTime: string;
};

type Category = 'All' | 'Training' | 'Nutrition' | 'Mindset' | 'Recovery';

const categories: Category[] = ['All', 'Training', 'Nutrition', 'Mindset', 'Recovery'];

export default function JournalPageContent({ posts }: { posts: JournalCard[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  // Filter posts based on category
  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  // Separate the featured post (only on "All" or if posts exist)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.slice(1);

  // Category specific colors for tags
  const getTagColor = (cat: string) => {
    switch (cat) {
      case 'Training': return 'bg-charcoal text-white';
      case 'Nutrition': return 'bg-gold text-charcoal font-medium';
      case 'Mindset': return 'bg-beige-dark text-charcoal';
      case 'Recovery': return 'bg-[#2A2A2A] text-gold-light';
      default: return 'bg-beige-light text-charcoal';
    }
  };

  return (
    <div className="bg-white text-charcoal pt-32 pb-24">
      {/* Hero Header */}
      <section className="bg-beige-light py-20 text-center border-b border-beige-dark/30">
        <div className="max-w-[1440px] mx-auto px-6">
          <h1 className="text-[54px] md:text-[96px] font-display font-light uppercase tracking-tight text-charcoal leading-none mb-4">
            THE JOURNAL
          </h1>
          <p className="text-[14px] md:text-[16px] font-body uppercase tracking-[0.2em] text-gold font-medium mb-12">
            Training science. Nutrition. Mindset. Recovery.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 text-[11px] font-body uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'border-beige-dark text-charcoal-mid hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* If no posts in category */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[18px] font-display text-gray-muted">No articles found in this category.</p>
              </div>
            )}

            {/* Featured Post (only displayed if a post exists) */}
            {featuredPost && activeCategory === 'All' && (
              <div className="mb-20">
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-beige-light/30 border border-beige-dark/50 group relative"
                >
                  {/* Left half: Large Image */}
                  <Link href={`/journal/${featuredPost.slug}`} className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto w-full lg:h-[450px] overflow-hidden block bg-charcoal">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-101"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <span className="absolute top-6 left-6 z-10 px-3 py-1.5 bg-gold text-charcoal text-[9px] font-body uppercase tracking-[0.2em] font-medium">
                      FEATURED
                    </span>
                  </Link>

                  {/* Right half: Content */}
                  <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center space-y-6">
                    <div className="flex items-center space-x-3 text-[11px] font-body uppercase tracking-wider text-gray-muted">
                      <span className={`px-2 py-0.5 ${getTagColor(featuredPost.category)}`}>
                        {featuredPost.category}
                      </span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>

                    <h2 className="text-[28px] sm:text-[36px] font-display font-light text-charcoal leading-tight group-hover:text-gold transition-colors">
                      <Link href={`/journal/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-[15px] font-body font-light text-charcoal-mid leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center space-x-4 pt-4 border-t border-beige-dark/60">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-beige-mid">
                        <Image
                          src={featuredPost.authorAvatar}
                          alt={featuredPost.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-body font-semibold text-charcoal">{featuredPost.authorName}</p>
                        <p className="text-[11px] font-body text-gray-muted">{featuredPost.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover border bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </motion.div>
              </div>
            )}

            {/* Sub-posts Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory === 'All' ? remainingPosts : filteredPosts).map((post) => (
                <motion.article
                  key={post.slug}
                  whileHover={{ y: -4 }}
                  className="flex flex-col bg-white border border-beige-dark/50 relative group cursor-pointer h-full justify-between"
                >
                  <div>
                    {/* Image */}
                    <Link href={`/journal/${post.slug}`} className="relative w-full aspect-[16/10] overflow-hidden block bg-charcoal">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className={`absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-body uppercase tracking-widest ${getTagColor(post.category)}`}>
                        {post.category}
                      </span>
                    </Link>

                    {/* Meta info */}
                    <div className="p-6 flex flex-col space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-body uppercase tracking-[0.1em] text-gray-muted">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-[20px] md:text-[22px] font-display font-light text-charcoal leading-snug group-hover:text-gold transition-colors">
                        <Link href={`/journal/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-[14px] font-body font-light text-charcoal-mid line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Author / Read More row */}
                  <div className="px-6 pb-6 pt-4 border-t border-beige-light/80 flex items-center justify-between bg-beige-light/10">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden bg-beige-mid">
                        <Image
                          src={post.authorAvatar}
                          alt={post.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[12px] font-body text-charcoal font-medium">{post.authorName}</span>
                    </div>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="text-[11px] font-body uppercase tracking-wider text-gold font-medium group/link"
                    >
                      Read →
                    </Link>
                  </div>

                  {/* Bottom Gold border on Hover */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </motion.article>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
