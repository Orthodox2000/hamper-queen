/** Client-safe price helpers. */

export function parsePriceString(price: string): number {
  const match = price.replace(/[₹Rs.,]/g, (c) => (c === ',' ? '' : c)).match(/[\d.]+/);
  if (!match) return 0;
  return Number(match[0]) || 0;
}

export function formatINR(value: number): string {
  return value > 0 ? `INR ${value.toLocaleString('en-IN')}` : 'Value on request';
}