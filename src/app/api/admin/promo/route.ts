/**
 * Admin promo management.
 * GET  -> list promoCodes (paginated, optional search + redeemed filter)
 * POST -> create `count` single-use rows for one code (batch per event)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';
import { getPromoCodesCollection } from '../../../../lib/mongo';
import { PromoRow } from '../../../../lib/promo';
import { PromoDiscountKind } from '../../../../types/order';

interface CreatePromoBody {
  code?: string;
  kind?: PromoDiscountKind;
  value?: number;
  count?: number;
  eventName?: string;
  minSubtotal?: number;
  expiresAt?: string | null;
  active?: boolean;
}

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const search = request.nextUrl.searchParams;
  const q = search.get('q') ?? '';
  const redeemed = search.get('redeemed');
  const limit = Math.min(Number(search.get('limit') ?? 100), 500);
  const skip = Math.max(0, Number(search.get('skip') ?? 0));

  try {
    const collection = await getPromoCodesCollection();
    const filter: Record<string, unknown> = {};
    if (q.trim()) filter.code = { $regex: q.trim().toUpperCase(), $options: 'i' };
    if (redeemed === 'used') filter.redeemedAt = { $ne: null };
    if (redeemed === 'active') filter.redeemedAt = null;

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);
    return NextResponse.json({ items: items as unknown as PromoRow[], total, skip, limit });
  } catch (err) {
    console.error('list promos failed:', err);
    return NextResponse.json({ error: 'Could not load promo codes.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  let body: CreatePromoBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const code = cleanString(body.code, 16).toUpperCase();
  const kind = body.kind === 'percent' ? 'percent' : body.kind === 'flat' ? 'flat' : null;
  const value = Number(body.value);
  const count = Math.max(1, Math.min(Number(body.count ?? 1), 200));
  const rawMin = body.minSubtotal as unknown;
  const minSubtotal = rawMin === null || rawMin === undefined || rawMin === '' ? null : Number(rawMin);
  const expiresAt = body.expiresAt ? String(body.expiresAt) : null;
  const active = body.active !== false;

  if (!code) return NextResponse.json({ error: 'A promo code is required (max 16 letters/numbers).' }, { status: 400 });
  if (!/^[A-Z0-9-]{1,16}$/.test(code)) {
    return NextResponse.json({ error: 'Use only A-Z, 0-9 and dashes (max 16 chars).' }, { status: 400 });
  }
  if (!kind) return NextResponse.json({ error: 'Pick a discount type: flat or percent.' }, { status: 400 });
  if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: 'Discount value must be above 0.' }, { status: 400 });
  if (kind === 'percent' && value > 100) return NextResponse.json({ error: 'Percentage discount cannot exceed 100%.' }, { status: 400 });

  try {
    const collection = await getPromoCodesCollection();
    const now = new Date().toISOString();
    const docs = Array.from({ length: count }, () => ({
      code,
      discount: { kind, value },
      eventName: cleanString(body.eventName, 80) || undefined,
      minSubtotal,
      expiresAt,
      active,
      redeemedAt: null,
      createdAt: now,
      updatedAt: now,
    }));
    const result = await collection.insertMany(docs);
    return NextResponse.json({ inserted: result.insertedCount, code }, { status: 201 });
  } catch (err) {
    console.error('create promos failed:', err);
    return NextResponse.json({ error: 'Could not create promo codes.' }, { status: 503 });
  }
}