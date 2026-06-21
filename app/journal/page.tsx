import React from 'react';
import type { Metadata } from 'next';
import JournalPageContent, { JournalCard } from '@/components/journal/JournalPageContent';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_JOURNAL_CARDS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'The Journal | Training Science & Nutrition | IGYM',
  description: 'Read the latest research in exercise physiology, hypertrophy science, athletic nutrition, bioavailabity, mindset coaching, and somatic active recovery.',
  openGraph: {
    title: 'The Journal | Training Science & Nutrition | IGYM',
    description: 'Read the latest research in exercise physiology, hypertrophy science, athletic nutrition, bioavailabity, mindset coaching, and somatic active recovery.',
  },
};

export const revalidate = 3600;

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200';
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200';

export default async function JournalPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('journal_posts')
    .select(
      'slug, title, category, excerpt, cover_image_url, author_name, author_avatar_url, published_at, read_time_minutes'
    )
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const postsFromDb: JournalCard[] = (data ?? []).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category as JournalCard['category'],
    excerpt: p.excerpt ?? '',
    image: p.cover_image_url ?? FALLBACK_IMAGE,
    authorName: p.author_name,
    authorAvatar: p.author_avatar_url ?? FALLBACK_AVATAR,
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
    readTime: `${p.read_time_minutes ?? 1} min read`,
  }));

  const posts = postsFromDb.length > 0 ? postsFromDb : MOCK_JOURNAL_CARDS;

  return <JournalPageContent posts={posts} />;
}
