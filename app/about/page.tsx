import React from 'react';
import type { Metadata } from 'next';
import AboutPageContent from '@/components/about/AboutPageContent';

export const metadata: Metadata = {
  title: 'Our Story | IGYM — 7-Star Luxury Fitness, Gachibowli',
  description: 'Founded in 2023 by Vamshi Reddy. IGYM is Hyderabad\'s premier luxury fitness facility — TechnoGym equipped, expert-coached, and home to The ProTein Co.',
  openGraph: {
    title: 'Our Story | IGYM',
    description: 'Founded in 2023 by Vamshi Reddy. IGYM is Hyderabad\'s premier luxury fitness facility — TechnoGym equipped, expert-coached, and home to The ProTein Co.',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
