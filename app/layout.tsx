import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import SiteLayout from '@/components/layout/SiteLayout';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IGYM | Premium Fitness & Transformations',
  description: 'Where elite bodies are built. Luxury fitness, world-class personal training, macro-tracked nutrition, and athletic performance.',
  metadataBase: new URL('https://igym.in'),
  openGraph: {
    title: 'IGYM | Premium Fitness & Transformations',
    description: 'Where elite bodies are built. Luxury fitness, world-class personal training, macro-tracked nutrition, and athletic performance.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IGYM',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} scroll-smooth`}>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
