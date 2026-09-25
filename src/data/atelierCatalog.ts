import { BRANDED_ITEMS_CATALOG, BrandedItem } from './brandedItemsData';
import { RETAIL_RATES, RETAIL_RATES_BY_KEY, RetailRateItem } from './retailRates';

// ---------------------------------------------------------------------------
// ATELIER CATALOG = hand-authored decor/keepsake items + every retail Blinkit
// product (149) mapped to BrandedItem entries, each carrying a real LOCAL photo.
// Hand-authored chocolates that have an exact retail counterpart are upgraded
// to the real product image + retail price instead of the old text-art tile.
// ---------------------------------------------------------------------------

// Hand-authored chocolate ids -> retail dataset key whose local photo is the same product.
const RETAIL_KEY_BY_BRANDED_ID: Record<string, string> = {
  'item-silk-classic': 'silk_60g',
  'item-silk-roast-almond': 'silk_roast_almond_52g',
  'item-cadbury-dairy-milk': 'dairy_milk_46g',
  'item-nestle-kitkat-4finger': 'kitkat_4f',
  'item-nestle-kitkat-dessert-delight': 'kitkat_delights_50g',
  'item-nestle-milkybar': 'milkybar_butterscotch_45g',
  'item-ferrero-rocher-3pack': 'ferrero_4pc',
  'item-ferrero-rocher-box': 'ferrero_moments_16pc',
  'item-snickers-bar': 'snickers_40g',
};

// Stable color palettes assigned by brand hash so the grid stays colorful yet tasteful.
const PALETTES = [
  { bg: '#3B1358', text: '#FFFFFF', border: '#D4AF37', accent: '#DFBA54' },
  { bg: '#7F1D1D', text: '#FFFFFF', border: '#D4AF37', accent: '#FCA5A5' },
  { bg: '#1C4532', text: '#FFFFFF', border: '#D4AF37', accent: '#6EE7B7' },
  { bg: '#1E3A8A', text: '#FFFFFF', border: '#D4AF37', accent: '#93C5FD' },
  { bg: '#4A154B', text: '#FFFFFF', border: '#E879F9', accent: '#F472B6' },
  { bg: '#78350F', text: '#FEF3C7', border: '#D4AF37', accent: '#FBBF24' },
  { bg: '#171717', text: '#F3E5AB', border: '#D4AF37', accent: '#D4AF37' },
  { bg: '#064E3B', text: '#ECFDF5', border: '#10B981', accent: '#34D399' },
  { bg: '#0E7490', text: '#ECFEFF', border: '#22D3EE', accent: '#67E8F9' },
  { bg: '#86198F', text: '#FDF4FF', border: '#F472B6', accent: '#E879F9' },
];

function hashPalette(brand: string) {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

function categoryFor(r: RetailRateItem): BrandedItem['category'] {
  const brand = r.brand ?? '';
  const name = r.name ?? '';
  const n = r.note ?? '';
  if (n.includes('grooming') || brand.includes('Nivea')) return 'keepsakes';
  if (n.includes('snack') || n.includes('chips')) return 'snacks';
  if (n.includes('biscuit')) return 'biscuits';
  if (brand.includes('Chupa')) return 'sweets';
  if (/snack|chips|crisps|nachos|namkeen|bhujia|puffs|fries/i.test(name)) return 'snacks';
  if (/biscuit|cookie|rusk|cake/i.test(name)) return 'biscuits';
  if (/lollipop|candy|sour/i.test(name)) return 'sweets';
  return 'chocolates';
}

function shortName(r: RetailRateItem): string {
  const full = `${r.brand} ${r.name} ${r.unit}`.trim();
  return full.length <= 60 ? full : `${full.slice(0, 57)}…`;
}

function retailToBranded(r: RetailRateItem): BrandedItem {
  const palette = hashPalette(r.brand ?? '');
  return {
    id: `retail-${r.key}`,
    name: `${r.brand} ${r.name} (${r.unit})`,
    brand: r.brand ?? '',
    category: categoryFor(r),
    simpleName: shortName(r),
    description: r.name,
    weightOrQty: r.unit,
    unitPriceApprox: r.price,
    tag: r.mrp > r.price ? `MRP INR ${r.mrp}` : undefined,
    image: r.image,
    colorScheme: palette,
  };
}

const usedRetailKeys = new Set(Object.values(RETAIL_KEY_BY_BRANDED_ID));

// 1. Hand-authored items with real retail photos where an exact match exists.
const baseWithImages: BrandedItem[] = BRANDED_ITEMS_CATALOG.map((item) => {
  const rk = RETAIL_KEY_BY_BRANDED_ID[item.id];
  const retail = rk ? RETAIL_RATES_BY_KEY[rk] : undefined;
  if (retail) {
    return {
      ...item,
      weightOrQty: retail.unit,
      unitPriceApprox: retail.price,
      image: retail.image,
    };
  }
  return item;
});

// 2. Every remaining retail product as its own pickable, droppable item.
const retailItems: BrandedItem[] = RETAIL_RATES.filter((r) => !usedRetailKeys.has(r.key)).map(retailToBranded);

export const ATELIER_CATALOG: BrandedItem[] = [...baseWithImages, ...retailItems];

export const ATELIER_CATALOG_BY_ID: Record<string, BrandedItem> = Object.fromEntries(
  ATELIER_CATALOG.map((i) => [i.id, i])
);

export function atelierItem(id: string): BrandedItem | undefined {
  return ATELIER_CATALOG_BY_ID[id];
}