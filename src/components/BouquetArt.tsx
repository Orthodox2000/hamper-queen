/**
 * BouquetArt.tsx
 * -----------------------------------------------------------------------------
 * A hand-drawn SVG chocolate bouquet.
 *
 * Why SVG instead of stacked CSS-3D divs?
 *  - It is a pure function of its props: no window / document / Math.random /
 *    Date, so the HTML the server sends is byte-identical to what the client
 *    hydrates (no hydration warnings, no layout pop on first paint).
 *  - It has no 'use client' directive and uses only `useId`, so it can also be
 *    rendered from Server Components (catalogue cards, emails, OG images).
 *  - It scales crisply at any size, and every layer is a real vector shape, so
 *    the bouquet can be much richer than the old CSS cone.
 *
 * Motion is pure CSS (see `.bq-*` rules in globals.css): the whole bouquet
 * sways, blooms lift and fan on hover / when `isOpen`, ribbon tails flutter and
 * sparkles twinkle. All of it respects prefers-reduced-motion.
 */

import React, { useId } from 'react';
import type { BouquetPalette } from '../data/boxThemes';

interface BouquetArtProps {
  palette: BouquetPalette;
  /** Fans the blooms upward (used when the customer "enchants" the bouquet). */
  isOpen?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/** Pull the hex colours out of a CSS gradient string, e.g. 'linear-gradient(..., #3B060B 0%, ...)'. */
const hexes = (css: string, fallback: string[]): string[] => {
  const found = css.match(/#[0-9A-Fa-f]{6}/g);
  return found && found.length >= 2 ? found : fallback;
};

/** Mix two #hex colours (t = 0 -> a, 1 -> b). */
const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255;
    const vb = (pb >> shift) & 255;
    return Math.round(va + (vb - va) * t)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

interface BloomSpec {
  x: number;
  y: number;
  r: number;
  color: number; // index into palette.blooms
  dx: number; // lift offset when fanned (px in viewBox units)
  dy: number;
  delay: number;
}

// Deterministic layout (viewBox 200 x 270). Back row first so front blooms overlap.
const BLOOMS: BloomSpec[] = [
  { x: 70, y: 70, r: 18, color: 2, dx: -9, dy: -12, delay: 0 },
  { x: 130, y: 68, r: 19, color: 4, dx: 9, dy: -13, delay: 60 },
  { x: 100, y: 58, r: 20, color: 5, dx: 0, dy: -16, delay: 30 },
  { x: 58, y: 104, r: 22, color: 1, dx: -12, dy: -8, delay: 90 },
  { x: 142, y: 104, r: 22, color: 3, dx: 12, dy: -8, delay: 120 },
  { x: 100, y: 96, r: 27, color: 0, dx: 0, dy: -11, delay: 150 },
];

// Paper "petals" fanned behind the blooms: [angle deg, length, paper index]
const PETALS: Array<[number, number, number]> = [
  [-74, 100, 0],
  [74, 100, 0],
  [-48, 112, 1],
  [48, 112, 1],
  [-22, 120, 2],
  [22, 120, 2],
  [0, 122, 3],
];

const BREATH: Array<[number, number, number]> = [
  [34, 62, 2.2], [48, 40, 1.8], [78, 30, 2], [124, 28, 2.2], [150, 44, 1.8], [166, 66, 2.2],
  [28, 96, 1.8], [172, 98, 2], [88, 24, 1.6], [114, 22, 1.8], [44, 84, 1.6], [158, 84, 1.8],
];

const SPARKLES: Array<[number, number, number, number]> = [
  [22, 40, 7, 0], [176, 30, 9, 0.9], [100, 12, 6, 1.7], [186, 110, 6, 0.4], [14, 120, 6, 1.3],
];

/** Chocolate-rose: layered petals drawn as offset, shaded circles. */
const Rose: React.FC<{ x: number; y: number; r: number; base: string; id: string }> = ({ x, y, r, base, id }) => {
  const light = mix(base, '#ffffff', 0.38);
  const dark = mix(base, '#000000', 0.34);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={dark} strokeOpacity="0.45" strokeWidth="1" />
      {/* petal rings */}
      <path d={`M ${x - r * 0.78} ${y + r * 0.1} Q ${x - r * 0.2} ${y - r * 0.95} ${x + r * 0.74} ${y - r * 0.2}`} fill="none" stroke={light} strokeOpacity="0.7" strokeWidth={r * 0.1} strokeLinecap="round" />
      <path d={`M ${x + r * 0.72} ${y + r * 0.3} Q ${x + r * 0.1} ${y + r * 0.95} ${x - r * 0.62} ${y + r * 0.42}`} fill="none" stroke={dark} strokeOpacity="0.4" strokeWidth={r * 0.1} strokeLinecap="round" />
      <circle cx={x + r * 0.04} cy={y - r * 0.02} r={r * 0.58} fill="none" stroke={light} strokeOpacity="0.55" strokeWidth={r * 0.09} />
      <path d={`M ${x - r * 0.38} ${y - r * 0.05} Q ${x} ${y - r * 0.55} ${x + r * 0.4} ${y - r * 0.05} Q ${x + r * 0.05} ${y + r * 0.42} ${x - r * 0.3} ${y + r * 0.1}`} fill="none" stroke={dark} strokeOpacity="0.55" strokeWidth={r * 0.08} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.2} fill={dark} fillOpacity="0.55" />
      {/* specular highlight */}
      <ellipse cx={x - r * 0.38} cy={y - r * 0.5} rx={r * 0.28} ry={r * 0.14} fill="#fff" fillOpacity="0.55" transform={`rotate(-30 ${x - r * 0.38} ${y - r * 0.5})`} />
    </g>
  );
};

export const BouquetArt: React.FC<BouquetArtProps> = ({ palette, isOpen = false, width = 182, height = 246, className = '' }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gid = (name: string) => `${name}-${uid}`;

  const paperA = hexes(palette.papers[0], ['#3B060B', '#7A1626', '#A52A3A']);
  const paperB = hexes(palette.papers[1], ['#5C0A10', '#C2344A', '#D64550']);
  const paperC = hexes(palette.papers[2], ['#8A6328', '#D4AF37', '#F3E5AB']);
  const paperD = hexes(palette.papers[3] ?? palette.papers[2], ['#A87B3C', '#E5C990', '#F6EAD9']);
  const papers = [paperA, paperB, paperC, paperD];
  const cone = hexes(palette.cone, ['#E5C990', '#D4AC6A', '#C1934E', '#A87B3C']);
  const satin = hexes(palette.satin, ['#8a1d2f', '#C0392B', '#8a1d2f']);
  const knot = palette.sashKnot;

  const petal = (angle: number, len: number) => {
    // A leaf-shaped paper sheet pointing out from the cone mouth (100, 150).
    const w = len * 0.3;
    return `M 0 0 C ${-w} ${-len * 0.35}, ${-w * 0.7} ${-len * 0.85}, 0 ${-len} C ${w * 0.7} ${-len * 0.85}, ${w} ${-len * 0.35}, 0 0 Z`;
  };

  return (
    <div className={`bq-art ${isOpen ? 'is-open' : ''} ${className}`} style={{ width, height }}>
      <svg
        viewBox="0 0 200 270"
        width="100%"
        height="100%"
        role="img"
        aria-label={`${palette.label} chocolate bouquet`}
        className="bq-sway block overflow-visible"
      >
        <defs>
          {papers.map((p, i) => (
            <linearGradient key={i} id={gid(`paper${i}`)} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={p[0]} />
              <stop offset="0.55" stopColor={p[1] ?? p[0]} />
              <stop offset="1" stopColor={p[p.length - 1]} />
            </linearGradient>
          ))}
          <linearGradient id={gid('cone')} x1="0" y1="0" x2="0" y2="1">
            {cone.map((c, i) => (
              <stop key={i} offset={i / (cone.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id={gid('satin')} x1="0" y1="0" x2="1" y2="0">
            {satin.map((c, i) => (
              <stop key={i} offset={i / (satin.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
          <radialGradient id={gid('gold')} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#FFF4C2" />
            <stop offset="0.45" stopColor="#E8B64C" />
            <stop offset="1" stopColor="#8A6328" />
          </radialGradient>
          {palette.blooms.map((c, i) => (
            <radialGradient key={i} id={gid(`bloom${i}`)} cx="38%" cy="32%" r="80%">
              <stop offset="0" stopColor={mix(c, '#ffffff', 0.3)} />
              <stop offset="0.55" stopColor={c} />
              <stop offset="1" stopColor={mix(c, '#000000', 0.38)} />
            </radialGradient>
          ))}
          <linearGradient id={gid('leaf')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4E9B73" />
            <stop offset="1" stopColor="#245C42" />
          </linearGradient>
          <filter id={gid('soft')} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#2a1608" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="264" rx="34" ry="5" fill="#2a1608" fillOpacity="0.22" />

        {/* Paper fan behind the blooms */}
        <g transform="translate(100 152)">
          {PETALS.map(([angle, len, pi], i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <path d={petal(angle, len)} fill={`url(#${gid(`paper${pi}`)})`} filter={`url(#${gid('soft')})`} />
              <path d={`M 0 -6 L 0 ${-len * 0.9}`} stroke="#fff" strokeOpacity="0.18" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* Leaves between the blooms */}
        <g>
          <path d="M 100 130 C 70 120, 44 126, 30 146 C 56 150, 84 146, 100 130 Z" fill={`url(#${gid('leaf')})`} />
          <path d="M 100 130 C 130 120, 156 126, 170 146 C 144 150, 116 146, 100 130 Z" fill={`url(#${gid('leaf')})`} />
          <path d="M 100 130 C 90 98, 74 86, 56 88 C 66 108, 82 122, 100 130 Z" fill={`url(#${gid('leaf')})`} fillOpacity="0.9" />
          <path d="M 100 130 C 110 98, 126 86, 144 88 C 134 108, 118 122, 100 130 Z" fill={`url(#${gid('leaf')})`} fillOpacity="0.9" />
        </g>

        {/* Gypsophila */}
        {BREATH.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#FFF8EA" fillOpacity="0.92" />
        ))}

        {/* Blooms: chocolate roses + a gold foil truffle */}
        {BLOOMS.map((b, i) => (
          <g
            key={i}
            className="bq-bloom"
            style={{ ['--bx' as string]: `${b.dx}px`, ['--by' as string]: `${b.dy}px`, transitionDelay: `${b.delay}ms` } as React.CSSProperties}
          >
            <Rose x={b.x} y={b.y} r={b.r} base={palette.blooms[b.color % palette.blooms.length]} id={gid(`bloom${b.color % palette.blooms.length}`)} />
          </g>
        ))}
        <g className="bq-bloom" style={{ ['--bx' as string]: '0px', ['--by' as string]: '-18px', transitionDelay: '180ms' } as React.CSSProperties}>
          <circle cx="100" cy="30" r="12" fill={`url(#${gid('gold')})`} />
          <path d="M 91 24 Q 100 18 109 24 M 90 31 Q 100 26 110 31 M 92 38 Q 100 34 108 38" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" fill="none" />
          <ellipse cx="95" cy="25" rx="3.5" ry="2" fill="#fff" fillOpacity="0.7" />
        </g>

        {/* Front wrap: folded paper cone */}
        <g filter={`url(#${gid('soft')})`}>
          <path d="M 100 262 L 30 132 Q 100 160 170 132 Z" fill={`url(#${gid('cone')})`} />
          <path d="M 100 262 L 30 132 L 62 142 Z" fill="#fff" fillOpacity="0.14" />
          <path d="M 100 262 L 170 132 L 138 142 Z" fill="#000" fillOpacity="0.16" />
          <path d="M 100 262 L 66 146 M 100 262 L 84 152 M 100 262 L 116 152 M 100 262 L 134 146" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" fill="none" />
          <path d="M 30 132 Q 100 160 170 132" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* Satin ribbon + bow */}
        <g>
          <path d="M 56 174 Q 100 192 144 174 L 146 187 Q 100 205 54 187 Z" fill={`url(#${gid('satin')})`} />
          <path d="M 56 175 Q 100 193 144 175" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" fill="none" />
          <g className="bq-tail" style={{ transformOrigin: '100px 196px' }}>
            <path d="M 98 196 C 86 214, 82 230, 74 244 L 86 241 L 90 250 C 94 234, 98 216, 102 198 Z" fill={`url(#${gid('satin')})`} />
          </g>
          <g className="bq-tail bq-tail--r" style={{ transformOrigin: '100px 196px' }}>
            <path d="M 102 196 C 114 214, 118 230, 126 244 L 114 241 L 110 250 C 106 234, 102 216, 98 198 Z" fill={`url(#${gid('satin')})`} />
          </g>
          <g transform="translate(100 190)">
            <ellipse cx="-17" cy="-2" rx="17" ry="9" transform="rotate(-24 -17 -2)" fill={`url(#${gid('satin')})`} />
            <ellipse cx="17" cy="-2" rx="17" ry="9" transform="rotate(24 17 -2)" fill={`url(#${gid('satin')})`} />
            <ellipse cx="-17" cy="-2" rx="9" ry="4" transform="rotate(-24 -17 -2)" fill="#fff" fillOpacity="0.2" />
            <ellipse cx="17" cy="-2" rx="9" ry="4" transform="rotate(24 17 -2)" fill="#fff" fillOpacity="0.2" />
            <circle r="6.5" fill={knot} />
            <circle r="3" fill="#F3E5AB" />
          </g>
          {/* Hanging message tag */}
          <g className="bq-tag" style={{ transformOrigin: '112px 198px' }}>
            <path d="M 104 196 Q 116 204 122 214" stroke="#D4AF37" strokeWidth="1" fill="none" />
            <g transform="translate(116 212) rotate(10)">
              <rect x="-2" y="0" width="30" height="20" rx="3" fill="#FFFDF9" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="3" cy="4" r="1.3" fill="#D4AF37" />
              <text x="13" y="13.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#8C6821" style={{ fontFamily: 'var(--font-serif)' }}>
                HQ
              </text>
            </g>
          </g>
        </g>

        {/* Sparkles */}
        {SPARKLES.map(([x, y, s, d], i) => (
          <path
            key={i}
            className="bq-sparkle"
            style={{ animationDelay: `${d}s` }}
            d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
            fill="#F3E5AB"
          />
        ))}
      </svg>
    </div>
  );
};
