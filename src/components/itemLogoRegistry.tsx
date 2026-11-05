/**
 * itemLogoRegistry.tsx
 * -----------------------------------------------------------------------------
 * Deterministic SVG "product logos" for the items listed inside a hamper.
 *
 * Rather than random or generic icons, common branded / recurring products are
 * mapped to a tiny branded SVG illustration. Product cards reuse this registry
 * so a "Cadbury Silk" list item always renders the same purple wrapper.
 *
 * Exports:
 *   - ItemLogoTile : drop-in tile (light tinted background + small logo + name)
 *   - matchItemLogo : resolve { node, bg, border } for any item name
 *   - fallbackEmoji : deterministic emoji fallback when no SVG matches
 */

import React from 'react';

/* ------------------------------------------------------------------------- */
/* Light tinted tile palettes keyed by product family                         */
/* ------------------------------------------------------------------------- */
interface LogoStyle {
  bg: string;
  border: string;
}

const STYLE_TINT: Record<string, LogoStyle> = {
  cadbury: { bg: '#F5EDFB', border: '#E3CFEF' },
  kitkat: { bg: '#FDEFEF', border: '#F5CFCF' },
  ferrero: { bg: '#FBF3E2', border: '#EFDDB8' },
  milkybar: { bg: '#FDF8F0', border: '#EFDFC2' },
  dark: { bg: '#F5EFE8', border: '#E3D2BF' },
  gold: { bg: '#FBF6E6', border: '#EAD9A6' },
  rose: { bg: '#FDEEF2', border: '#F4C9D7' },
  lights: { bg: '#FDF5E3', border: '#EFD99B' },
  candle: { bg: '#FDF3E7', border: '#F0D8B8' },
  seal: { bg: '#FDEEEE', border: '#F1C7C7' },
  photo: { bg: '#F0F4FB', border: '#C8D7EE' },
  perfume: { bg: '#F4F0FC', border: '#DDD3F2' },
  jewelry: { bg: '#FBF6E6', border: '#EAD9A6' },
  bag: { bg: '#FDF0EA', border: '#F0D0BF' },
  dryfruit: { bg: '#FBF3E2', border: '#EFDDB8' },
  spa: { bg: '#EAF6F1', border: '#BCDFD0' },
  box: { bg: '#F4F0E8', border: '#E0D5BD' },
  default: { bg: '#F5F2EA', border: '#E0D6C3' },
};

/** Map an item name to its light tint palette (stable keyword rules). */
function tintForKey(name: string): LogoStyle {
  const text = name.toLowerCase();
  const rules: [RegExp, string][] = [
    [/silk|cadbury|dairy/, 'cadbury'],
    [/kit\s?kat/, 'kitkat'],
    [/ferrero|rocher/, 'ferrero'],
    [/milkybar/, 'milkybar'],
    [/dark\s?fantasy|choco\s?fill|cookie/, 'dark'],
    [/truffle|gilded/, 'gold'],
    [/rose|flower|carnation|bloom/, 'rose'],
    [/fairy|l\.?e\.?d|light/, 'lights'],
    [/candle/, 'candle'],
    [/seal/, 'seal'],
    [/photo|polaroid|print/, 'photo'],
    [/perfume/, 'perfume'],
    [/earring|hairpin|jewel/, 'jewelry'],
    [/handbag|wallet|scrunch|bag/, 'bag'],
    [/dry fruit|almond|walnut|pistachio|cashew/, 'dryfruit'],
    [/honey|saffron|kesar/, 'gold'],
    [/lotion|mask|bath|sock|cream|butter|spa/, 'spa'],
    [/box|trunk|chest|tray|vessel/, 'box'],
  ];
  for (const [re, key] of rules) {
    if (re.test(text)) return STYLE_TINT[key];
  }
  return STYLE_TINT.default;
}

/* ------------------------------------------------------------------------- */
/* Small SVG illustrations (viewBox 0 0 48 48). Solid fills only — every      */
/* SVG is fully self-contained (no shared gradient ids) to stay SSR safe.     */
/* ------------------------------------------------------------------------- */
type LogoRenderer = () => React.ReactNode;

const SilkWrapper: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="6" y="14" width="36" height="22" rx="4" fill="#4B1560" />
    <rect x="6" y="30" width="36" height="5" rx="2" fill="#9B61C9" />
    <rect x="10" y="16" width="28" height="12" rx="3" fill="#5B2D8E" />
    <text x="24" y="25" fill="#F3E5AB" fontSize="8" textAnchor="middle" fontFamily="serif" fontWeight="bold">SILK</text>
  </svg>
);

const DairyMilkWrapper: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="5" y="12" width="38" height="26" rx="3" fill="#4B1560" />
    <rect x="5" y="12" width="38" height="7" rx="3" fill="#7A2E94" />
    <text x="24" y="35" fill="#E9C8F5" fontSize="5.5" textAnchor="middle" fontFamily="serif" fontWeight="bold">DAIRY MILK</text>
  </svg>
);

const KitKatWrapper: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="8" y="9" width="32" height="5" rx="2" fill="#D10A21" />
    <rect x="8" y="17" width="32" height="5" rx="2" fill="#E0182F" />
    <rect x="8" y="25" width="32" height="5" rx="2" fill="#D10A21" />
    <rect x="8" y="33" width="22" height="5" rx="2" fill="#E0182F" />
    <rect x="33" y="33" width="7" height="5" rx="2" fill="#A80A1C" />
    <text x="24" y="24" fill="#FFFFFF" fontSize="5.5" textAnchor="middle" fontWeight="bold">KITKAT</text>
  </svg>
);

const FerreroSphere: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <circle cx="24" cy="27" r="15" fill="#C89B3C" />
    <circle cx="24" cy="27" r="11" fill="#D4AF37" />
    <path d="M 16 40 Q 24 46 32 40" fill="none" stroke="#8C6821" strokeWidth="1.5" />
    <rect x="21" y="8" width="6" height="6" rx="2" fill="#A05A13" />
    <circle cx="20" cy="22" r="2" fill="#A8843A" />
  </svg>
);

const MilkyBar: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="7" y="12" width="34" height="24" rx="4" fill="#FBF3E0" stroke="#E0C994" />
    <rect x="7" y="25" width="34" height="6" fill="#F1DFB4" />
    <rect x="27" y="8" width="6" height="18" rx="2" fill="#F7E7C4" stroke="#D9BC82" />
    <text x="24" y="21" fill="#8C6821" fontSize="5.5" textAnchor="middle" fontWeight="bold">MILKYBAR</text>
  </svg>
);

const DarkFantasyCookie: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <circle cx="24" cy="25" r="17" fill="#4A2A16" />
    <circle cx="24" cy="25" r="9" fill="#2A1507" />
    <circle cx="24" cy="25" r="4" fill="#0E0602" />
    <path d="M 20 10 Q 22 13 25 13 Q 28 13 30 10" fill="none" stroke="#3A1C0D" strokeWidth="2" />
    <path d="M 34 16 Q 35 19 38 19" fill="none" stroke="#3A1C0D" strokeWidth="2" />
  </svg>
);

const GoldTruffle: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <circle cx="24" cy="27" r="15" fill="#C89B3C" />
    <circle cx="24" cy="27" r="11" fill="#D4AF37" />
    <circle cx="18" cy="21" r="3" fill="#A8843A" />
    <circle cx="29" cy="18" r="2" fill="#8C6821" />
    <circle cx="25" cy="14" r="2" fill="#A8843A" />
  </svg>
);

const RoseBloom: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 13 19 C 17 11 31 11 35 19 C 32 30 16 30 13 19 Z" fill="#C0162A" />
    <path d="M 17 16 C 20 20 28 20 31 16 C 27 13 21 13 17 16 Z" fill="#D92B3E" />
    <path d="M 24 30 L 24 42" stroke="#2F6B3A" strokeWidth="2" />
    <path d="M 24 40 Q 16 37 13 30" stroke="#2F6B3A" strokeWidth="1.5" fill="none" />
    <path d="M 24 40 Q 32 37 35 30" stroke="#2F6B3A" strokeWidth="1.5" fill="none" />
  </svg>
);

const FairyLights: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 6 22 Q 24 8 42 22" fill="none" stroke="#4A340A" strokeWidth="1.5" />
    {[
      [10, 18], [16, 14], [22, 11], [28, 11], [34, 14], [38, 18],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#FFF3C4" stroke="#D4AF37" />
    ))}
    <circle cx="37" cy="33" r="2.6" fill="#FFF3C4" stroke="#D4AF37" />
    <circle cx="11" cy="30" r="2.6" fill="#FFF3C4" stroke="#D4AF37" />
  </svg>
);

const PillarCandle: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="16" y="18" width="16" height="21" rx="3" fill="#F6E3C9" stroke="#DDBA8A" />
    <ellipse cx="24" cy="18" rx="8" ry="2.5" fill="#FFF3DC" stroke="#DDBA8A" />
    <path d="M 24 12 Q 27 8 24 4 Q 21 8 24 12 Z" fill="#F59E0B" />
    <path d="M 24 10 Q 25 8 24 6" stroke="#FB923C" strokeWidth="1.5" fill="none" />
  </svg>
);

const WaxSeal: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="16" fill="#8E0E1B" stroke="#D4AF37" strokeWidth="2" />
    <circle cx="24" cy="24" r="11" fill="#C0162A" />
    <path d="M 17 27 L 20 27 L 20 15 L 17 15 Z" fill="#F3E5AB" />
    <path d="M 24 15 L 27 27 L 24 32 L 21 27 Z" fill="#F3E5AB" />
    <path d="M 19 27 L 22 32 L 26 32 L 29 27 Z" fill="#F3E5AB" opacity="0.8" />
  </svg>
);

const PolaroidPhoto: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="10" y="8" width="28" height="32" rx="3" fill="#F7F4EC" stroke="#D9CDB4" />
    <rect x="14" y="12" width="20" height="17" rx="2" fill="#E8EDF7" />
    <path d="M 15 27 L 23 20 L 27 24 L 30 20 L 34 25 L 34 27 L 16 27 Z" fill="#B8CBE6" />
    <circle cx="19" cy="16" r="2.4" fill="#9DC3E8" />
    <rect x="17" y="33" width="3" height="3" rx="0.6" fill="#D4AF37" />
  </svg>
);

const PerfumeBottle: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="15" y="14" width="18" height="6" rx="2" fill="#B18BD9" />
    <rect x="18" y="20" width="12" height="19" rx="3" fill="#CFBDF2" stroke="#9B7FCC" />
    <rect x="22" y="26" width="4" height="8" rx="1.5" fill="#E8DDF7" />
    <rect x="18" y="20" width="12" height="4" rx="2" fill="#A588D6" />
  </svg>
);

const Earrings: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 14 12 C 10 18 10 26 14 30 L 18 22 Z" fill="#D4AF37" />
    <circle cx="20" cy="34" r="5" fill="#D4AF37" stroke="#8C6821" />
    <circle cx="20" cy="34" r="2" fill="#8C6821" />
    <path d="M 32 12 C 36 18 36 26 32 30 L 28 22 Z" fill="#D4AF37" />
    <circle cx="28" cy="34" r="5" fill="#D4AF37" stroke="#8C6821" />
    <circle cx="28" cy="34" r="2" fill="#8C6821" />
  </svg>
);

const Handbag: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 20 20 Q 24 8 28 20" fill="none" stroke="#B14A63" strokeWidth="3" />
    <path d="M 14 20 L 34 20 L 38 38 Q 38 42 34 42 L 14 42 Q 10 42 10 38 Z" fill="#C25A74" stroke="#7E2F44" />
    <circle cx="24" cy="29" r="3.4" fill="#F5D9A0" stroke="#C5A059" />
  </svg>
);

const Wallet: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="8" y="16" width="32" height="18" rx="4" fill="#7A4A2B" stroke="#4F2D16" />
    <rect x="12" y="22" width="18" height="6" rx="2" fill="#F5D9A0" />
    <circle cx="34" cy="25" r="2.6" fill="#F5D9A0" />
  </svg>
);

const DryFruitJar: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="13" y="12" width="22" height="6" rx="2" fill="#D4AF37" />
    <path d="M 13 18 L 12 36 Q 12 42 18 42 L 30 42 Q 36 42 36 36 L 35 18 Z" fill="#F7EFD9" stroke="#D9C7A0" />
    <circle cx="19" cy="28" r="3.2" fill="#A8843A" />
    <circle cx="24" cy="31" r="3.2" fill="#754E10" />
    <circle cx="29" cy="27" r="3.2" fill="#B45309" />
  </svg>
);

const HoneyJar: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 14 18 L 13 36 Q 13 42 20 42 L 28 42 Q 35 42 35 36 L 34 18 Z" fill="#F7CE5B" stroke="#D9A23C" />
    <rect x="13" y="11" width="22" height="8" rx="2" fill="#8C5A10" />
    <path d="M 36 17 L 40 12" stroke="#8C5A10" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CoffeeMug: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 10 16 L 13 40 Q 14 43 17 43 L 29 43 Q 32 43 33 40 L 36 16 Z" fill="#6B4423" stroke="#4A2C12" />
    <path d="M 36 20 Q 44 20 42 27 Q 41 33 36 31" fill="none" stroke="#8A5A2B" strokeWidth="4" />
    <path d="M 22 6 Q 22 8 23 9" stroke="#A97A4B" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const Socks: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 10 14 Q 14 8 22 8 Q 30 8 32 16 L 34 38 Q 34 42 30 42 L 26 42 Q 22 42 22 38 L 20 22 Q 12 22 10 14 Z" fill="#E8BFC6" stroke="#C78C96" />
    <path d="M 30 14 Q 38 8 40 18 L 42 38 Q 42 42 38 42 L 34 42 Q 30 42 30 38 Z" fill="#F0D3D8" stroke="#C78C96" />
    <path d="M 21 17 Q 25 15 27 19 L 28 27 Q 23 25 19 25 Z" fill="#B14A63" />
  </svg>
);

const EyeMask: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 6 18 Q 24 12 42 18 Q 44 30 38 34 Q 24 40 10 34 Q 4 30 6 18 Z" fill="#E6E6F0" stroke="#B9B9D4" />
    <path d="M 13 22 Q 19 20 22 26 Q 14 30 13 22 Z" fill="#3B3B6B" />
    <path d="M 35 22 Q 29 20 26 26 Q 34 30 35 22 Z" fill="#3B3B6B" />
  </svg>
);

const SpaBottle: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="15" y="18" width="18" height="20" rx="4" fill="#A9D8C3" stroke="#77B59B" />
    <rect x="19" y="14" width="10" height="6" rx="2" fill="#DCEFE4" />
    <rect x="17" y="5" width="3" height="6" rx="1.5" fill="#77B59B" />
    <rect x="28" y="5" width="3" height="6" rx="1.5" fill="#77B59B" />
  </svg>
);

const WatchLogo: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="10" y="14" width="28" height="20" rx="10" fill="#D4AF37" stroke="#8C6821" />
    <circle cx="24" cy="24" r="7" fill="#F7F4EC" stroke="#8C6821" />
    <path d="M 24 19 L 24 24 L 28 26" stroke="#141414" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 18 10.5 L 18 14 M 30 10.5 L 30 14 M 18 34 L 18 37.5 M 30 34 L 30 37.5" stroke="#8C6821" strokeWidth="2" />
  </svg>
);

const GiftBoxLogo: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="8" y="22" width="32" height="18" rx="3" fill="#E2C27D" stroke="#B8860B" />
    <path d="M 24 22 L 24 40" stroke="#B8860B" strokeWidth="2" />
    <path d="M 8 27 Q 24 21 40 27" fill="none" stroke="#B8860B" strokeWidth="2" />
    <path d="M 20 22 Q 16 12 24 14 Q 32 12 28 22" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
    <circle cx="24" cy="18" r="3" fill="#D4AF37" />
  </svg>
);

const BowRibbon: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 24 24 Q 10 10 6 22 Q 12 29 24 24 Z" fill="#C0162A" />
    <path d="M 24 24 Q 38 10 42 22 Q 36 29 24 24 Z" fill="#C0162A" />
    <path d="M 24 24 L 24 44 M 24 24 L 18 8 M 24 24 L 30 8" stroke="#E0182F" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="3.4" fill="#F3E5AB" stroke="#B8860B" />
  </svg>
);

const CalligraphyCard: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="11" y="8" width="26" height="30" rx="2" fill="#FBF6E6" stroke="#E4D3A5" />
    <path d="M 14 16 L 34 16" stroke="#E4D3A5" strokeWidth="1.5" />
    <path d="M 17 24 Q 20 21 23 24 L 25 21" stroke="#B8860B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M 27 28 Q 28 25 30 28 L 31 21" stroke="#B8860B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const ChocolateBar: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <rect x="7" y="13" width="34" height="22" rx="4" fill="#4A2A16" stroke="#2A1507" />
    <rect x="7" y="13" width="34" height="7" rx="4" fill="#6B3D20" />
    <path d="M 14 26 H 34 M 20 20 V 35 M 28 20 V 35 M 14 31 H 34" stroke="#2A1507" strokeWidth="1.5" />
  </svg>
);

const BeddingSparkle: LogoRenderer = () => (
  <svg viewBox="0 0 48 48">
    <path d="M 24 8 L 27 21 L 40 24 L 27 27 L 24 40 L 21 27 L 8 24 L 21 21 Z" fill="#D4AF37" />
    <path d="M 38 34 L 39 39 L 44 40 L 39 41 L 38 46 L 37 41 L 32 40 L 37 39 Z" fill="#DFBA54" opacity="0.8" />
  </svg>
);

/* ------------------------------------------------------------------------- */
/* Keyword -> SVG resolution table                                            */
/* ------------------------------------------------------------------------- */
const SVG_RULES: [RegExp, LogoRenderer][] = [
  [/kit\s?kat/, KitKatWrapper],
  [/ferrero|rocher/, FerreroSphere],
  [/silk/, SilkWrapper],
  [/dairy\s?milk/, DairyMilkWrapper],
  [/milkybar/, MilkyBar],
  [/dark\s?fantasy|choco\s?fill|cookie/, DarkFantasyCookie],
  [/truffle/, GoldTruffle],
  [/rose|flower|bloom|carnation/, RoseBloom],
  [/fairy|light|glow/, FairyLights],
  [/candle/, PillarCandle],
  [/wax seal|seal/, WaxSeal],
  [/polaroid|photo|memory print/, PolaroidPhoto],
  [/perfume/, PerfumeBottle],
  [/earring|hairpin|jewel|stud/, Earrings],
  [/handbag|clutch/, Handbag],
  [/wallet/, Wallet],
  [/dry fruit|almond|walnut|pistachio|cashew/, DryFruitJar],
  [/honey|saffron-infused|kesar/, HoneyJar],
  [/coffee|mug/, CoffeeMug],
  [/sock|slipper/, Socks],
  [/eye mask|mask/, EyeMask],
  [/lotion|butter|cream|serum|salts/, SpaBottle],
  [/watch|timepiece/, WatchLogo],
  [/ribbon|satin|rosette|bow|wrap|cello/, BowRibbon],
  [/card|note|message|scroll|tag|blessing/, CalligraphyCard],
  [/chocolate|treat|confect/, ChocolateBar],
  [/box|trunk|chest|tray|vessel|case/, GiftBoxLogo],
  [/velvet bedding|crin|tissue|shred/, BeddingSparkle],
];

/** Resolve a deterministic SVG logo (or null when no branded match exists). */
export function matchItemLogo(name: string): { node: React.ReactNode; bg: string; border: string } | null {
  const text = name.toLowerCase();
  for (const [re, render] of SVG_RULES) {
    if (re.test(text)) {
      const tint = tintForKey(text);
      return { node: render(), bg: tint.bg, border: tint.border };
    }
  }
  return null;
}

/** Deterministic emoji fallback for list items with no branded SVG yet. */
export function fallbackEmoji(name: string): string {
  const text = name.toLowerCase();
  const rules: [RegExp, string][] = [
    [/chocolate|silk|bar|treat|kit\s?kat/, '🍫'],
    [/flower|rose|bloom/, '🌹'],
    [/candle/, '🕯️'],
    [/lights|glow|fairy/, '✨'],
    [/photo|polaroid|print/, '🎞️'],
    [/earring|jewel/, '💎'],
    [/hairpin|clip|scrunch/, '🎀'],
    [/handbag|bag/, '👜'],
    [/wallet/, '👛'],
    [/perfume/, '🌸'],
    [/dry fruit|almond|walnut/, '🥜'],
    [/honey|saffron/, '🍯'],
    [/coffee|mug/, '☕'],
    [/sock/, '🧦'],
    [/mask/, '😴'],
    [/lotion|cream|butter|spa/, '🧴'],
    [/bath|salts/, '🧼'],
    [/watch/, '⌚'],
    [/box|trunk|chest|tray/, '🎁'],
    [/ribbon|bow|rosette|wrap|satin/, '🎀'],
    [/card|note|message|scroll|tag/, '💌'],
    [/seal/, '📜'],
    [/crown/, '👑'],
    [/teddy/, '🧸'],
    [/wedding|bridal|lehenga/, '💃'],
  ];
  for (const [re, emoji] of rules) {
    if (re.test(text)) return emoji;
  }
  return '🎁';
}

/* ------------------------------------------------------------------------- */
/* ItemLogoTile — light tinted tile used on product card graphics             */
/* ------------------------------------------------------------------------- */
interface ItemLogoTileProps {
  name: string;
  className?: string;
}

export const ItemLogoTile: React.FC<ItemLogoTileProps> = ({ name, className = '' }) => {
  const resolved = matchItemLogo(name);
  return (
    <div
      className={`item-logo-tile flex items-center gap-1.5 rounded-md p-1 border shadow-xs ${className}`}
      style={
        resolved
          ? { backgroundColor: resolved.bg, borderColor: resolved.border }
          : { backgroundColor: STYLE_TINT.default.bg, borderColor: STYLE_TINT.default.border }
      }
    >
      <span className="w-6 h-6 shrink-0 flex items-center justify-center text-xs leading-none">
        {resolved ? resolved.node : <span className="text-sm leading-none">{fallbackEmoji(name)}</span>}
      </span>
      <span className="text-[8px] font-semibold leading-tight text-[#141414] min-w-0">
        <span className="line-clamp-2">{name}</span>
      </span>
    </div>
  );
};