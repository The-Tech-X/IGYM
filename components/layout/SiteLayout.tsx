'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import ChatWidget from './ChatWidget';
import PageLoader from './PageLoader';
import FilmGrain from '../ui/FilmGrain';
import { NavbarContext } from './NavbarContext';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith('/studio');
  const isAdmin = pathname.startsWith('/admin');
  const [hideNavbar, setHideNavbar] = useState(false);

  if (isStudio || isAdmin) {
    return <>{children}</>;
  }

  return (
    <NavbarContext.Provider value={{ hideNavbar, setHideNavbar }}>
      <ReactLenis root options={{ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
        <PageLoader />
        <CustomCursor />
        <FilmGrain />
        <Navbar />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
        <Footer />
        <ChatWidget />
      </ReactLenis>
    </NavbarContext.Provider>
  );
}
