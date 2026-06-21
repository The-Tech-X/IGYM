import React from 'react';
import type { Metadata } from 'next';
import CafePageContent, { type MenuItem } from '@/components/cafe/CafePageContent';
import { createPublicClient } from '@/lib/supabase/public';

const CAFE_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

export const metadata: Metadata = {
  title: 'IGYM Cafe & Nutrition | Fuel Your Training',
  description: 'Performance-focused food and recovery bar. Organic cold-pressed juices, whey isolate shakes, and chef-curated, macro-precise athlete meals.',
  openGraph: {
    title: 'IGYM Cafe & Nutrition | Fuel Your Training',
    description: 'Performance-focused food and recovery bar. Organic cold-pressed juices, whey isolate shakes, and chef-curated, macro-precise athlete meals.',
  },
};

export const revalidate = 3600;

export default async function CafePage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('cafe_menu_items')
    .select('name, category, description, price, image_url, protein_g, carbs_g, fat_g, calories')
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  const items = (data ?? []).map((i) => ({
    name: i.name,
    category: i.category as MenuItem['category'],
    description: i.description ?? '',
    price: i.price,
    image: i.image_url ?? CAFE_FALLBACK,
    macros: {
      protein: i.protein_g ?? 0,
      carbs: i.carbs_g ?? 0,
      fat: i.fat_g ?? 0,
      calories: i.calories ?? 0,
    },
  }));

  return <CafePageContent items={items} />;
}
