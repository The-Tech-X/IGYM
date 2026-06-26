'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavbarVisibility } from './NavbarContext';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Trainers', href: '/trainers' },
  { name: 'Membership', href: '/membership' },
  { name: 'Café', href: '/cafe' },
  { name: 'Transformations', href: '/transformations' },
  { name: 'Journal', href: '/journal' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { hideNavbar } = useNavbarVisibility();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  // Pages where y=0 is genuinely dark — transparent nav with white text at top.
  // /transformations excluded: its page wrapper is bg-white, charcoal section is below.
  const isDarkHeroPage =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/trainers' ||
    (pathname.startsWith('/journal/') && pathname !== '/journal');

  const onDarkAtTop = isDarkHeroPage && !isScrolled;

  return (
    <>
      {/* Top scrim — softens bright hero images behind the navbar text */}
      {onDarkAtTop && (
        <div
          className={`fixed top-0 left-0 w-full h-36 pointer-events-none z-[98] transition-all duration-[500ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            hideNavbar ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(to bottom, rgba(8,6,4,0.55) 0%, transparent 100%)' }}
        />
      )}

      <header
        className={`fixed top-0 left-0 w-full z-[99] transition-all duration-[500ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          hideNavbar
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          onDarkAtTop
            ? 'bg-transparent py-6'
            : 'bg-white/[0.97] backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_16px_rgba(0,0,0,0.05)] py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">

          {/* Brand */}
          <Link
            href="/"
            className={`text-[22px] font-display font-light uppercase tracking-[0.38em] cursor-pointer transition-colors duration-[400ms] ${
              onDarkAtTop ? 'text-white' : 'text-charcoal'
            }`}
          >
            IGYM
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-body uppercase tracking-[0.18em] transition-all duration-[400ms] hover:text-gold cursor-pointer ${
                  isActive(link.href)
                    ? 'text-gold border-b border-gold pb-[1px] font-medium'
                    : onDarkAtTop
                    ? 'text-white/80 hover:text-white'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Enquire CTA + Hamburger */}
          <div className="flex items-center space-x-6">
            <Link
              href="/membership"
              className={`hidden sm:inline-block px-6 py-2.5 text-[11px] font-body uppercase tracking-[0.18em] font-medium transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer ${
                onDarkAtTop
                  ? 'border border-white/40 text-white hover:bg-white hover:text-charcoal hover:border-white'
                  : 'bg-charcoal text-white hover:bg-gold hover:text-charcoal border border-charcoal hover:border-gold'
              }`}
            >
              Enquire
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors cursor-pointer hover:text-gold ${
                onDarkAtTop ? 'text-white' : 'text-charcoal'
              }`}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 w-full h-full bg-beige-light z-[100] flex flex-col justify-between p-6 md:p-12"
          >
            <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
              <span className="text-[22px] font-display font-light uppercase tracking-[0.38em] text-charcoal">
                IGYM
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-charcoal hover:text-gold transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow">
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="flex flex-col items-center space-y-7 text-center"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[30px] md:text-[38px] font-display font-light uppercase tracking-[0.08em] text-charcoal hover:text-gold transition-colors cursor-pointer block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-6"
                >
                  <Link
                    href="/membership"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-block px-10 py-4 bg-charcoal text-white text-[12px] font-body uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-charcoal transition-all duration-[400ms] rounded-none cursor-pointer"
                  >
                    Enquire
                  </Link>
                </motion.div>
              </motion.nav>
            </div>

            <div className="text-center text-[10px] font-body uppercase tracking-[0.2em] text-gray-muted w-full max-w-[1440px] mx-auto">
              © 2026 IGYM · All Rights Reserved
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
