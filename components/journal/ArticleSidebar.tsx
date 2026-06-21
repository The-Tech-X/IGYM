'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type RelatedPost = {
  title: string;
  slug: string;
  category: string;
};

interface ArticleSidebarProps {
  relatedPosts: RelatedPost[];
}

export default function ArticleSidebar({ relatedPosts }: ArticleSidebarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const articleEl = document.getElementById('article-content');
      if (!articleEl) return;
      
      const rect = articleEl.getBoundingClientRect();
      const articleHeight = rect.height;
      // Calculate how much of the article is read
      const scrolled = window.innerHeight - rect.top;
      let percent = (scrolled / articleHeight) * 100;
      
      if (rect.top > window.innerHeight) percent = 0;
      if (rect.bottom < 0) percent = 100;
      
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="hidden lg:block w-full sticky top-32 space-y-10">
      {/* Progress Bar Container */}
      <div className="space-y-3">
        <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block">
          READING PROGRESS
        </span>
        <div className="w-full bg-beige-mid h-[3px]">
          <div 
            className="bg-gold h-full transition-all duration-75 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-body text-gray-muted block">
          {Math.round(progress)}% completed
        </span>
      </div>

      <hr className="border-t border-beige-dark/50" />

      {/* Related Posts */}
      <div className="space-y-6">
        <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block">
          RELATED ARTICLES
        </span>
        <div className="flex flex-col space-y-4">
          {relatedPosts.map((post) => (
            <div key={post.slug} className="group">
              <span className="text-[10px] font-body uppercase tracking-wider text-gray-muted">
                {post.category}
              </span>
              <Link 
                href={`/journal/${post.slug}`}
                className="text-[15px] font-display font-light text-charcoal group-hover:text-gold transition-colors line-clamp-2 mt-1 leading-snug cursor-pointer block"
              >
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
