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
  generate?: boolean;
  prefix?: string;
}

const GEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSuffix(len = 6): string {
  let s = '';
  for (let i = 0; i < len; i++) s += GEN_ALPHABET[Math.floor(Math.random() * GEN_ALPHABET.length)];
  return s;
}

function escapeRegex(value: string): string {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
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
  const generate = body.generate === true;
  const prefix = cleanString(body.prefix, 9).toUpperCase();

  if (generate && prefix && !/^[A-Z0-9-]{1,9}$/.test(prefix)) {
    return NextResponse.json({ error: 'Code prefix: use only A-Z, 0-9 and dashes (max 9 chars).' }, { status: 400 });
  }
  if (!generate && !code) return NextResponse.json({ error: 'A promo code is required (max 16 letters/numbers).' }, { status: 400 });
  if (!generate && !/^[A-Z0-9-]{1,16}$/.test(code)) {
    return NextResponse.json({ error: 'Use only A-Z, 0-9 and dashes (max 16 chars).' }, { status: 400 });
  }
  if (!kind) return NextResponse.json({ error: 'Pick a discount type: flat or percent.' }, { status: 400 });
  if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: 'Discount value must be above 0.' }, { status: 400 });
  if (kind === 'percent' && value > 100) return NextResponse.json({ error: 'Percentage discount cannot exceed 100%.' }, { status: 400 });

  try {
    const collection = await getPromoCodesCollection();
    const now = new Date().toISOString();

    let codes: string[];
    if (generate) {
      const prefixPattern = prefix ? `^${escapeRegex(prefix)}-` : '^[A-Z0-9]{6}$';
      const existingRows = await collection
        .find({ code: { $regex: prefixPattern } }, { projection: { code: 1 } })
        .toArray();
      const used = new Set<string>(existingRows.map((r) => r.code as string));
      codes = [];
      let attempts = 0;
      while (codes.length < count && attempts < count * 80) {
        attempts++;
        const candidate = prefix ? `${prefix}-${randomSuffix()}` : randomSuffix();
        if (!used.has(candidate)) {
          used.add(candidate);
          codes.push(candidate);
        }
      }
      if (codes.length < count) {
        return NextResponse.json({ error: 'Could not generate enough unique codes — try a different prefix.' }, { status: 409 });
      }
    } else {
      codes = Array.from({ length: count }, () => code);
    }

    const docs = codes.map((c) => ({
      code: c,
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
    return NextResponse.json(
      generate ? { inserted: result.insertedCount, generated: true, codes } : { inserted: result.insertedCount, code },
      { status: 201 },
    );
  } catch (err) {
    console.error('create promos failed:', err);
    return NextResponse.json({ error: 'Could not create promo codes.' }, { status: 503 });
  }
}