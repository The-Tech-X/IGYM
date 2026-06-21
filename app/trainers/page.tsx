import React from 'react';
import type { Metadata } from 'next';
import TrainersPageContent from '@/components/trainers/TrainersPageContent';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_TRAINERS_LIST } from '@/lib/mock-data';

const TRAINER_FALLBACK =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800';

export const metadata: Metadata = {
  title: 'Meet Our Coaches | IGYM Elite Personal Trainers',
  description: 'Our specialists are leaders in sports science, powerlifting, athletic speed, metabolic conditioning, and mobility. Explore trainer bios and schedule training.',
  openGraph: {
    title: 'Meet Our Coaches | IGYM Elite Personal Trainers',
    description: 'Our specialists are leaders in sports science, powerlifting, athletic speed, metabolic conditioning, and mobility. Explore trainer bios and schedule training.',
  },
};

export const revalidate = 3600;

export default async function TrainersPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('trainers')
    .select('slug, name, role, image_url, specialties')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const trainersFromDb = (data ?? []).map((t) => ({
    slug: t.slug,
    name: t.name,
    role: t.role,
    image: t.image_url ?? TRAINER_FALLBACK,
    specialties: t.specialties ?? [],
  }));

  const trainers = trainersFromDb.length > 0 ? trainersFromDb : MOCK_TRAINERS_LIST;

  return <TrainersPageContent trainers={trainers} />;
}
