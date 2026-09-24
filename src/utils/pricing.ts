/** Client-safe price helpers. */

export function parsePriceString(price: string): number {
  const match = price.replace(/[₹Rs.,]/g, (c) => (c === ',' ? '' : c)).match(/[\d.]+/);
  if (!match) return 0;
  return Number(match[0]) || 0;
}

export function formatINR(value: number): string {
  return value > 0 ? `INR ${value.toLocaleString('en-IN')}` : 'Value on request';
}

/** Hamper Queen transparent pricing: ~INR 70 per curated item, capping up predictably. */
export const APPROX_PRICE_PER_ITEM = 70;

export function computeApproxPrice(count: number): number {
  if (count <= 0) return APPROX_PRICE_PER_ITEM;
  if (count <= 5) return count * APPROX_PRICE_PER_ITEM;
  if (count === 6) return 399;
  if (count === 7) return 499;
  return 499 + (count - 7) * 50;
}

export function ladderRange(count: number): string {
  return `${formatINR(computeApproxPrice(count)).replace('INR ', '')} - INR ${formatINR(
    computeApproxPrice(count + 1)
  ).replace('INR ', '')}`;
}

export function approxPriceLabel(count: number): string {
  return `INR ${computeApproxPrice(count).toLocaleString('en-IN')} (${count} curated items ≈ INR ${APPROX_PRICE_PER_ITEM} each)`;
}