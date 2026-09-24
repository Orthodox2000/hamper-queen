/**
 * promo.ts
 * -----------------------------------------------------------------------------
 * Promo code / discount coupon operations backed by the `promoCodes`
 * collection. Rows are single-use; the same code string may appear on many
 * rows (one per event). Redemption follows a claim -> store -> burn sequence
 * so a failed order never consumes a coupon.
 */

import { ObjectId } from 'mongodb';
import { getPromoCodesCollection } from './mongo';
import { PromoDiscountKind } from '../types/order';

export interface PromoRow {
  _id?: unknown;
  code: string;
  discount: { kind: PromoDiscountKind; value: number };
  eventName?: string;
  minSubtotal?: number;
  expiresAt?: string | null;
  active: boolean;
  redeemedAt?: string | null;
  claimedFor?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export class PromoRedeemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PromoRedeemError';
  }
}

/** Normalise a user-typed code: trim + uppercase, cap 16 chars. */
export function normalizeCode(code: string): string {
  return String(code ?? '').trim().toUpperCase().slice(0, 16);
}

export function applyPromoDiscount(row: Pick<PromoRow, 'discount'>, subtotal: number): number {
  const { kind, value } = row.discount;
  const raw = kind === 'percent' ? Math.round((subtotal * value) / 100) : value;
  return Math.max(0, Math.min(raw, subtotal));
}

async function findRedeemableRow(code: string, subtotal: number) {
  const collection = await getPromoCodesCollection();
  const clean = normalizeCode(code);
  if (!clean || !Number.isFinite(subtotal) || subtotal <= 0) return null;

  const candidates = collection.find({ code: clean, active: true, redeemedAt: null });
  const now = Date.now();
  for await (const doc of candidates) {
    const row = doc as unknown as PromoRow;
    if (row.expiresAt && new Date(row.expiresAt).getTime() < now) continue;
    if (typeof row.minSubtotal === 'number' && row.minSubtotal > 0 && subtotal < row.minSubtotal) continue;
    return row;
  }
  return null;
}

/**
 * Validate a code for a given subtotal WITHOUT consuming it. Returns a
 * human-safe summary. Throws PromoRedeemError when ineligible.
 */
export async function validatePromoCode(code: string, subtotal: number): Promise<{
  valid: true;
  code: string;
  kind: PromoDiscountKind;
  value: number;
  discount: number;
  eventName?: string;
}> {
  const row = await findRedeemableRow(code, subtotal);
  if (!row) throw new PromoRedeemError('invalid');
  const discount = applyPromoDiscount(row, subtotal);
  return {
    valid: true,
    code: normalizeCode(code),
    kind: row.discount.kind,
    value: row.discount.value,
    discount,
    eventName: row.eventName,
  };
}

/**
 * Claim a redeemable row atomically for an order. Returns the claim or null
 * when the code is ineligible/already claimed. The caller must burn or
 * rollback after the outcome of order creation.
 */
export async function claimPromoCode(
  code: string,
  subtotal: number,
  trackingId: string
): Promise<{ couponId: string; kind: PromoDiscountKind; value: number; discount: number; eventName?: string } | null> {
  const row = await findRedeemableRow(code, subtotal);
  if (!row) return null;

  const collection = await getPromoCodesCollection();
  const id = row._id as ObjectId;
  const claimed = await collection.findOneAndUpdate(
    { _id: id, redeemedAt: null },
    {
      $set: {
        redeemedAt: new Date().toISOString(),
        claimedFor: String(trackingId),
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: 'after' }
  );
  if (!claimed) return null;

  const updated = claimed as unknown as PromoRow;
  return {
    couponId: String(id),
    kind: updated.discount.kind,
    value: updated.discount.value,
    discount: applyPromoDiscount(updated, subtotal),
    eventName: updated.eventName,
  };
}

/** Undo a claim (order creation failed). Reopens the coupon for reuse. */
export async function rollbackPromoClaim(couponId: string): Promise<void> {
  if (!ObjectId.isValid(couponId)) return;
  const collection = await getPromoCodesCollection();
  await collection
    .updateOne(
      { _id: new ObjectId(couponId) },
      { $set: { redeemedAt: null, updatedAt: new Date().toISOString() }, $unset: { claimedFor: '' } }
    )
    .catch(() => {});
}

/** Permanently consume a coupon after the order is stored. */
export async function burnPromoCoupon(couponId: string): Promise<void> {
  if (!ObjectId.isValid(couponId)) return;
  const collection = await getPromoCodesCollection();
  await collection.deleteOne({ _id: new ObjectId(couponId) }).catch(() => {});
}