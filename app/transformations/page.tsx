import React from 'react';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import TransformationsPageContent, {
  type GoalType,
  type TransformationDetail,
} from '@/components/transformations/TransformationsPageContent';

const BEFORE_FALLBACK = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800';
const AFTER_FALLBACK = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800';

export const metadata: Metadata = {
  title: 'Personal Training & Transformations | IGYM',
  description: 'Uncompromised body composition results. Discover our 12-week blueprint process, compare package pricing, and view client transformation results.',
  openGraph: {
    title: 'Personal Training & Transformations | IGYM',
    description: 'Uncompromised body composition results. Discover our 12-week blueprint process, compare package pricing, and view client transformation results.',
  },
};

export const revalidate = 3600;

export default async function TransformationsPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('transformations')
    .select('client_name, duration, goal, goal_type, before_image_url, after_image_url, testimonial, trainers(name, slug)')
    .order('display_order', { ascending: true });

  const GOAL_LABELS: Record<string, string> = {
    weight_loss: 'Weight Loss', muscle_gain: 'Muscle Gain',
    athletic_performance: 'Athletic Performance', post_rehab: 'Post-Rehab',
  };

  const transformations: TransformationDetail[] = (data ?? []).map((tr) => {
    const trainer = (Array.isArray(tr.trainers) ? tr.trainers[0] : tr.trainers) as { name?: string; slug?: string } | null;
    return {
      clientName: tr.client_name, duration: tr.duration, goal: tr.goal,
      goalType: (GOAL_LABELS[tr.goal_type] ?? 'Weight Loss') as GoalType,
      beforeImage: tr.before_image_url ?? BEFORE_FALLBACK,
      afterImage: tr.after_image_url ?? AFTER_FALLBACK,
      testimonial: tr.testimonial ?? '',
      trainerName: trainer?.name ?? '', trainerSlug: trainer?.slug ?? '',
    };
  });

  return <TransformationsPageContent transformations={transformations} />;
}
