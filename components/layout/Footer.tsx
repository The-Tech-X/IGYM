import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-charcoal text-white pt-20 pb-12 border-t border-gold/20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
          
          {/* Column 1 - Brand */}
          <div className="flex flex-col space-y-6">
            <span className="text-[28px] font-display font-light uppercase tracking-[0.3em]">
              IGYM
            </span>
            <p className="text-[13px] font-body font-light text-gray-muted leading-[1.7] max-w-[240px]">
              Private fitness. Considered in every detail.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/igymindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors cursor-pointer"
                aria-label="YouTube"
              >
                <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Navigate */}
          <div className="flex flex-col space-y-6">
            <span className="text-[9px] font-body uppercase tracking-[0.32em] text-gold font-medium">
              Explore
            </span>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Journal', href: '/journal' },
                { name: 'Trainers', href: '/trainers' },
                { name: 'Membership', href: '/membership' },
                { name: 'Café', href: '/cafe' },
                { name: 'Transformations', href: '/transformations' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-body font-light text-gray-muted hover:text-gold transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Visit */}
          <div className="flex flex-col space-y-6">
            <span className="text-[9px] font-body uppercase tracking-[0.32em] text-gold font-medium">
              Visit Us
            </span>
            <div className="space-y-4">
              <p className="text-[13px] font-body font-light text-gray-muted leading-relaxed">
                Plot No. 45, luxury District,<br />
                Jubilee Hills, Hyderabad, TS, 500033
              </p>
              <div>
                <p className="text-[11px] font-body uppercase tracking-[0.1em] text-white">Hours</p>
                <p className="text-[13px] font-body font-light text-gray-muted mt-1">
                  Mon–Sat: 5:00 AM – 11:00 PM<br />
                  Sun: 6:00 AM – 9:00 PM
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[13px] font-body text-gold hover:text-gold-light hover:underline transition-colors mt-2 cursor-pointer"
              >
                Get Directions →
              </a>
            </div>
          </div>

          {/* Column 4 - Connect */}
          <div className="flex flex-col space-y-6">
            <span className="text-[9px] font-body uppercase tracking-[0.32em] text-gold font-medium">
              Get in Touch
            </span>
            <div className="space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-[13px] font-body font-medium uppercase tracking-[0.1em] rounded-none cursor-pointer"
              >
                Chat with us
              </a>
              <div className="space-y-1">
                <p className="text-[13px] font-body font-light text-gray-muted">
                  Email: <a href="mailto:contact@igym.in" className="hover:text-gold transition-colors">contact@igym.in</a>
                </p>
                <p className="text-[13px] font-body font-light text-gray-muted">
                  Phone: <a href="tel:+919876543210" className="hover:text-gold transition-colors">+91 98765 43210</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-body font-light text-gray-muted">
            © 2026 IGYM. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[12px] font-body font-light text-gray-muted">
            <Link href="/privacy" className="hover:text-gold transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors cursor-pointer">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
