'use client';

import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface StatementWord {
  text: string;
  gold: boolean;
}

interface StatementSectionProps {
  text?: string;
}

const DEFAULT_TEXT =
  "We don't sell memberships. We accept a standard of commitment — and we meet it with ours.";

// The final clause renders in italic gold per the brand type rule.
const GOLD_CLAUSE = 'and we meet it with ours.';

function buildWords(text: string): StatementWord[] {
  const goldStart = text.indexOf(GOLD_CLAUSE);
  const whitePart = goldStart >= 0 ? text.slice(0, goldStart) : text;
  const goldPart = goldStart >= 0 ? text.slice(goldStart) : '';

  const whiteWords: StatementWord[] = whitePart
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, gold: false }));

  const goldWords: StatementWord[] = goldPart
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, gold: true }));

  return [...whiteWords, ...goldWords];
}

interface WordProps {
  progress: MotionValue<number>;
  range: [number, number];
  text: string;
  gold: boolean;
}

// Each word tracks the highest scroll progress ever seen — opacity only moves
// forward (dim → bright). Once revealed it never fades back, regardless of
// Lenis micro-oscillations or any backward scroll.
function Word({ progress, range, text, gold }: WordProps) {
  const maxSeen = useRef(0);
  const opacity = useMotionValue(0.15);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest > maxSeen.current) maxSeen.current = latest;
    const p = maxSeen.current;
    if (p >= range[1]) {
      opacity.set(1);
    } else if (p >= range[0]) {
      opacity.set(0.15 + ((p - range[0]) / (range[1] - range[0])) * 0.85);
    }
  });

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] ${
        gold ? 'italic text-gold' : 'text-charcoal'
      }`}
    >
      {text}
    </motion.span>
  );
}

export default function StatementSection({
  text = DEFAULT_TEXT,
}: StatementSectionProps) {
  const outerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const words = buildWords(text);

  // Reduced motion: render the full statement at full contrast on a single
  // screen, skipping the scroll machinery entirely (no dead scroll).
  if (prefersReducedMotion) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 bg-white">
        <p className="max-w-5xl text-[32px] md:text-[48px] lg:text-[56px] font-display font-light leading-[1.3] text-center">
          {words.map((word, i) => (
            <span
              key={i}
              className={`inline-block mr-[0.25em] ${
                word.gold ? 'italic text-gold' : 'text-charcoal'
              }`}
            >
              {word.text}
            </span>
          ))}
        </p>
      </section>
    );
  }

  const total = words.length;

  return (
    <section ref={outerRef} className="relative h-[250vh] bg-white">
      <div className="sticky top-0 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24">
        <p className="max-w-5xl text-[32px] md:text-[48px] lg:text-[56px] font-display font-light leading-[1.3] text-center">
          {words.map((word, i) => {
            const start = i / total;
            // Slight overlap so brightening reads smoothly word-to-word.
            const end = Math.min((i + 1.5) / total, 1);
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                text={word.text}
                gold={word.gold}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}
