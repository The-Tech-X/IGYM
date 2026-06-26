'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import EyebrowLabel from '../ui/EyebrowLabel';

export type CircleMember = {
  id: string;
  name: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  isFeatured?: boolean;
};

// ─── Replace with real IGYM circle members ─────────────────────────────────
// Each entry: name, title/handle, portrait thumbnail URL, optional videoUrl
const CIRCLE: CircleMember[] = [
  {
    id: '1',
    name: 'Add Name',
    title: 'Film Actor',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Add Name',
    title: 'Entrepreneur · Forbes 30U30',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Add Name',
    title: 'Content Creator · 2M+ Followers',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Add Name',
    title: 'National-Level Athlete',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '5',
    name: 'Add Name',
    title: 'Founder & CEO',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '6',
    name: 'Add Name',
    title: 'Influencer · @handle',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
  },
];
// ───────────────────────────────────────────────────────────────────────────

export default function TheCircleSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-10%' });
  const railRef = useRef<HTMLDivElement>(null);
  const [activeMember, setActiveMember] = useState<CircleMember | null>(null);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const dragDistance = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!railRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = railRef.current.scrollLeft;
    dragDistance.current = 0;
    railRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !railRef.current) return;
    const dx = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(dx);
    railRef.current.scrollLeft = scrollStartLeft.current - dx;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (railRef.current) railRef.current.style.cursor = 'grab';
  }, []);

  const handleCardClick = useCallback((member: CircleMember) => {
    if (dragDistance.current > 8) return;
    setActiveMember(member);
  }, []);

  useEffect(() => {
    if (!activeMember) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMember(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeMember]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = activeMember ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeMember]);

  return (
    <section className="bg-charcoal py-24 md:py-32 overflow-hidden relative">

      {/* Subtle grain texture for depth */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Section header */}
      <div ref={headerRef} className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-6 h-px bg-gold flex-shrink-0" />
              <EyebrowLabel>THE CIRCLE</EyebrowLabel>
            </div>
            <h2 className="text-[40px] md:text-[56px] font-display font-light text-white leading-tight">
              Those who train<br />
              <em className="italic text-gold">without compromise.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] font-body font-light text-gray-muted max-w-[260px] md:text-right leading-[1.8]"
          >
            A community defined by standard,<br />
            not status. In their own words.
          </motion.p>

        </div>
      </div>

      {/* Scroll rail */}
      <div className="relative">

        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-4 w-12 md:w-20 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-12 md:w-20 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

        <div
          ref={railRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 px-6 md:px-12 lg:px-24 [&::-webkit-scrollbar]:hidden"
          style={{ cursor: 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {CIRCLE.map((member, index) => (
            <CircleCard
              key={member.id}
              member={member}
              index={index}
              onClick={() => handleCardClick(member)}
            />
          ))}

          {/* Trailing spacer so last card doesn't sit flush against the fade */}
          <div className="flex-shrink-0 w-4" aria-hidden />
        </div>
      </div>

      {/* Drag hint — fades out after first interaction */}
      <motion.div
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="flex items-center justify-center gap-2 mt-6 pointer-events-none"
        aria-hidden
      >
        <svg className="w-3 h-3 text-gold/40 fill-current" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
        <span className="text-[10px] font-body uppercase tracking-[0.2em] text-white/20">Drag to explore</span>
        <svg className="w-3 h-3 text-gold/40 fill-current" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeMember && (
          <Lightbox member={activeMember} onClose={() => setActiveMember(null)} />
        )}
      </AnimatePresence>

    </section>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────

function CircleCard({
  member,
  index,
  onClick,
}: {
  member: CircleMember;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width: 'clamp(180px, 22vw, 260px)',
        aspectRatio: '9 / 16',
        outline: member.isFeatured ? '1px solid #C4A35A' : '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={member.thumbnail}
          alt={member.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Gradient — darkens on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.55 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent"
      />

      {/* Gold top bar for featured */}
      {member.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold z-10" />
      )}

      {/* Play button — only when videoUrl present */}
      {member.videoUrl && (
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.75 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="w-12 h-12 rounded-full border border-gold/60 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 fill-gold ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Name + title */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
        <motion.div
          animate={{ y: hovered ? 0 : 6, opacity: hovered ? 1 : 0.75 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[15px] md:text-[16px] font-display font-light text-white leading-snug">
            {member.name}
          </p>
          <p className="text-[9px] font-body uppercase tracking-[0.18em] text-gold/80 font-medium mt-0.5">
            {member.title}
          </p>
        </motion.div>
      </div>

      {/* "View" label — appears on hover, bottom-right */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-3 right-3 z-10 text-[8px] font-body uppercase tracking-[0.18em] text-white/50 pointer-events-none"
      >
        {member.videoUrl ? 'Play' : 'View'}
      </motion.span>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────

function Lightbox({
  member,
  onClose,
}: {
  member: CircleMember;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(8, 8, 8, 0.94)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center"
        style={{ width: 'min(340px, 90vw)' }}
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-2 text-[10px] font-body uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          Close <span className="text-lg font-light leading-none">×</span>
        </button>

        {/* Media */}
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: '9 / 16', outline: member.isFeatured ? '1px solid #C4A35A' : '1px solid rgba(255,255,255,0.1)' }}
        >
          {member.videoUrl ? (
            <video
              src={member.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={member.thumbnail}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Caption */}
        <div className="mt-5 text-center">
          <p className="text-[20px] font-display font-light text-white leading-tight">
            {member.name}
          </p>
          <p className="text-[10px] font-body uppercase tracking-[0.22em] text-gold mt-1.5">
            {member.title}
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}
