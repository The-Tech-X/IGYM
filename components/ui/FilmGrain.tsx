'use client';

/**
 * FilmGrain
 *
 * A global, purely STATIC film-grain overlay for ambient cinematic texture.
 *
 * The grain is a single tiling SVG noise texture (feTurbulence / fractalNoise)
 * baked into a data-URI background image. It never animates — a still grain
 * reads as authentic "film" and avoids the flicker the brand explicitly wants
 * to avoid. Because nothing moves, no prefers-reduced-motion handling is needed.
 *
 * z-index rationale: z-[50] sits ABOVE page content but BELOW all fixed chrome —
 *   navbar (z-[99]), WhatsApp FAB (z-[999]) and the custom cursor (z-[9999]) —
 *   so the texture overlays the page without ever fogging the UI or cursor.
 */

// Inline SVG noise, URL-encoded into a data URI.
//  - feTurbulence type="fractalNoise", baseFrequency 0.8, numOctaves 4 => fine grain
//  - '#' is encoded as %23 and double-quotes are left as-is inside single-quoted CSS
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[50] opacity-[0.035]"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: '180px 180px',
      }}
    />
  );
}
