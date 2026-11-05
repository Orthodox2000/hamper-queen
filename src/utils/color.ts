/**
 * color.ts — tiny helpers for accessible text on dynamic backgrounds.
 */

const parseHex = (hex: string): [number, number, number] | null => {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance of a #hex colour (0 = black, 1 = white). */
export const luminance = (hex: string): number => {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
};

/** Dark ink or white — whichever has the higher contrast on `background`. */
export const readableOn = (background: string): string => {
  const L = luminance(background);
  const whiteContrast = 1.05 / (L + 0.05);
  const inkContrast = (L + 0.05) / 0.06;
  return whiteContrast >= inkContrast ? '#ffffff' : '#1c1814';
};
