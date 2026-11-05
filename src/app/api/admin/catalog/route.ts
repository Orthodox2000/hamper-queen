import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';
import { getCatalogOverridesCollection } from '../../../../lib/mongo';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct } from '../../../../data/hamperQueenCatalog';

function toDto(d: Record<string, unknown>) {
  return {
    _id: String(d._id),
    productId: d.productId as string,
    fields: (d.fields ?? {}) as Record<string, unknown>,
    updatedAt: d.updatedAt as string,
    baseProduct: HAMPER_QUEEN_PRODUCTS.some((p: HamperQueenProduct) => p.id === d.productId),
  };
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    const collection = await getCatalogOverridesCollection();
    const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json({
      products: HAMPER_QUEEN_PRODUCTS.map((p) => p.id),
      overrides: docs.map((d) => toDto(d as Record<string, unknown>)),
    });
  } catch {
    return NextResponse.json({ error: 'Could not load catalog overrides.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  let body: { productId?: string; fields?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.productId || typeof body.productId !== 'string' || !body.productId.trim()) {
    return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
  }
  const productId =
    HAMPER_QUEEN_PRODUCTS.some((p) => p.id === body.productId)
      ? body.productId.trim()
      : `custom-${body.productId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

  const fields = (body.fields ?? {}) as Record<string, unknown>;
  const allowed = new Set([
    'name', 'nameHinglish', 'approxPrice', 'pricingNote',
    'subtitle', 'subtitleHinglish', 'itemsIncluded', 'categoryLabel',
  ]);
  const cleanFields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (fields[key] !== undefined) cleanFields[key] = fields[key];
  }
  if (Array.isArray(cleanFields.itemsIncluded)) {
    cleanFields.itemsIncluded = cleanFields.itemsIncluded.map((i) => String(i)).filter(Boolean);
  } else {
    delete cleanFields.itemsIncluded;
  }

  try {
    const collection = await getCatalogOverridesCollection();
    const now = new Date().toISOString();
    await collection.updateOne(
      { productId },
      { $set: { productId, fields: cleanFields, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    const doc = await collection.findOne({ productId });
    return NextResponse.json(toDto(doc as Record<string, unknown>), { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Could not save override.' }, { status: 503 });
  }
}