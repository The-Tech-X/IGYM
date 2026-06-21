import React from 'react';
import type { Metadata } from 'next';
import MembershipPageContent from '@/components/membership/MembershipPageContent';

export const metadata: Metadata = {
  title: 'Membership Plans | IGYM Luxury Fitness',
  description: 'Select your IGYM plan. Offering Starter, Pro, and Elite tiers with unlimited gym floor access, group classes, personalized training, and recovery suites.',
  openGraph: {
    title: 'Membership Plans | IGYM Luxury Fitness',
    description: 'Select your IGYM plan. Offering Starter, Pro, and Elite tiers with unlimited gym floor access, group classes, personalized training, and recovery suites.',
  },
};

export default function MembershipPage() {
  return <MembershipPageContent />;
}
