import { useEffect, useState } from 'react';
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

/**
 * Pure formatter for animated count values.
 * - decimals === 0: round to integer with thousands separators.
 * - decimals > 0:  fixed decimal precision (no thousands separator).
 */
export function formatCount(value: number, decimals: number): string {
  if (decimals === 0) {
    return Math.round(value).toLocaleString('en-US');
  }
  return value.toFixed(decimals);
}

interface UseCountUpOptions {
  target: number;
  durationMs?: number;
  start: boolean;
}

/**
 * Animates a number from 0 to `target` once `start` becomes true.
 * Respects prefers-reduced-motion by jumping straight to `target`.
 */
export function useCountUp({
  target,
  durationMs = 1500,
  start,
}: UseCountUpOptions): number {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [value, setValue] = useState(0);

  useMotionValueEvent(motionValue, 'change', (v) => setValue(v));

  useEffect(() => {
    if (!start) return;

    if (prefersReducedMotion) {
      motionValue.set(target);
      setValue(target);
      return;
    }

    const controls = animate(motionValue, target, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [start, target, durationMs, prefersReducedMotion, motionValue]);

  return value;
}
