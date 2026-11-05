/** Real retail-rate pricing for Hamper Queen bouquets.
 *
 * Rate cards reference items in src/data/retailRates.ts — live Blinkit retail
 * rates captured on a snapshot date (see RETAIL_RATES_CAPTURED_AT). Bouquet
 * selling price = real retail cost of the included items + a craft & hand-pack
 * fee (wrap, ribbon, florals, calligraphy tag and labour).
 */

import { retailRate } from '../data/retailRates';

export interface RateCardLine {
  key: string;
  qty: number;
  /** Optional short label shown on the card instead of the retail product name. */
  label?: string;
}

/** Base hand-pack & styling fee for a bouquet. */
export const BOUQUET_CRAFT_FEE_BASE = 130;
/** Craft fee also scales a little with how much material goes in. */
export const BOUQUET_CRAFT_FEE_RATE = 0.4;

export function roundUp10(value: number): number {
  return Math.ceil(value / 10) * 10;
}

export interface ResolvedRateLine {
  key: string;
  label: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  qty: number;
  lineCost: number;
  image: string;
}

/** Resolve a rate card against the retail rates table (missing keys are skipped). */
export function resolveRateLines(rateCard: RateCardLine[] = []): ResolvedRateLine[] {
  return rateCard
    .map((line) => {
      const rate = retailRate(line.key);
      if (!rate) return null;
      return {
        key: line.key,
        label: line.label ?? rate.name,
        name: rate.name,
        brand: rate.brand,
        unit: rate.unit,
        price: rate.price,
        qty: line.qty,
        lineCost: rate.price * line.qty,
        image: rate.image,
      };
    })
    .filter((l): l is ResolvedRateLine => l !== null);
}

export function retailCost(rateCard: RateCardLine[] = []): number {
  return resolveRateLines(rateCard).reduce((sum, l) => sum + l.lineCost, 0);
}

export function bouquetCraftFee(retail: number): number {
  return roundUp10(Math.max(BOUQUET_CRAFT_FEE_BASE, Math.round(retail * BOUQUET_CRAFT_FEE_RATE)));
}

/** Honest bouquet price: real retail cost + craft & hand-pack fee. */
export function bouquetSellingPrice(rateCard: RateCardLine[] = []): number {
  const retail = retailCost(rateCard);
  return roundUp10(retail + bouquetCraftFee(retail));
}

/** Itemized pricing note that replaces the old flat "≈ INR 70/item" ladder. */
export function bouquetPricingNote(rateCard: RateCardLine[] = []): string {
  const lines = resolveRateLines(rateCard);
  if (lines.length === 0) return '';
  const retail = lines.reduce((sum, l) => sum + l.lineCost, 0);
  const craft = bouquetCraftFee(retail);
  const items = lines
    .map((l) => `${l.label} ₹${l.price}×${l.qty}`)
    .join(', ');
  return `Real retail: ${items} → ₹${retail} · +₹${craft} hand-pack & styling = INR ${roundUp10(
    retail + craft
  )}. Customize quantity — final price per composition (retail rates via q-commerce, captured Sep 2026).`;
}