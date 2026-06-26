import React from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_TRAINERS, MOCK_ARTICLES, MOCK_TRANSFORMATIONS } from '@/lib/mock-data';
import HeroCarousel from '@/components/sections/HeroCarousel';
import ScrollExpandFilm from '@/components/sections/ScrollExpandFilm';
import StatsBanner from '@/components/sections/StatsBanner';
import AboutSection from '@/components/sections/AboutSection';
import ClassesPreview from '@/components/sections/ClassesPreview';
import TrainersPreview from '@/components/sections/TrainersPreview';
import MembershipPreview from '@/components/sections/MembershipPreview';
import TransformationsPreview from '@/components/sections/TransformationsPreview';
import StatementSection from '@/components/sections/StatementSection';
import CafePreview from '@/components/sections/CafePreview';
import JournalPreview from '@/components/sections/JournalPreview';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TheCircleSection from '@/components/sections/TheCircleSection';
import CTABand from '@/components/sections/CTABand';

const TRAINER_FALLBACK = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800';
const ARTICLE_FALLBACK = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800';
const BEFORE_FALLBACK = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800';
const AFTER_FALLBACK = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800';

export const revalidate = 3600;

export default async function Home() {
  const supabase = createPublicClient();
  const [trainersRes, articlesRes, transformationsRes] = await Promise.all([
    supabase.from('trainers').select('name, slug, role, image_url').eq('is_active', true).order('display_order', { ascending: true }).limit(3),
    supabase.from('journal_posts').select('title, slug, category, excerpt, cover_image_url, author_name, published_at').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('transformations').select('client_name, duration, goal, before_image_url, after_image_url, trainers(name)').order('display_order', { ascending: true }).limit(6),
  ]);

  const trainersFromDb = (trainersRes.data ?? []).map((t) => ({
    name: t.name, slug: t.slug, role: t.role, image: t.image_url ?? TRAINER_FALLBACK,
  }));
  const articlesFromDb = (articlesRes.data ?? []).map((a) => ({
    title: a.title, slug: a.slug, category: a.category, excerpt: a.excerpt ?? '',
    image: a.cover_image_url ?? ARTICLE_FALLBACK, author: a.author_name,
    date: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
  }));
  const transformationsFromDb = (transformationsRes.data ?? []).map((tr) => {
    const trainer = (Array.isArray(tr.trainers) ? tr.trainers[0] : tr.trainers) as { name?: string } | null;
    return {
      clientName: tr.client_name, duration: tr.duration, goal: tr.goal,
      beforeImg: tr.before_image_url ?? BEFORE_FALLBACK, afterImg: tr.after_image_url ?? AFTER_FALLBACK,
      trainer: trainer?.name ?? '',
    };
  });

  const trainers = trainersFromDb.length > 0 ? trainersFromDb : MOCK_TRAINERS;
  const articles = articlesFromDb.length > 0 ? articlesFromDb : MOCK_ARTICLES;
  const transformations = transformationsFromDb.length > 0 ? transformationsFromDb : MOCK_TRANSFORMATIONS;

  return (
    <>
      <HeroCarousel />
      <ScrollExpandFilm />
      <StatsBanner />
      <AboutSection />
      <TheCircleSection />
      <ClassesPreview />
      <TrainersPreview trainers={trainers} />
      <TransformationsPreview transformations={transformations} />
      <StatementSection />
      <MembershipPreview />
      <CafePreview />
      <JournalPreview articles={articles} />
      <TestimonialsSection />
      <CTABand />
    </>
  );
}
