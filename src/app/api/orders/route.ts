import { NextRequest, NextResponse } from 'next/server';
import { buildOrderMeta } from '../../../lib/ipinfo';
import {
  createOrder,
  CreateOrderPayload,
  listOrders,
  toOrderRecord,
  validateOrderPayload,
} from '../../../lib/orders';
import { resolveProduct } from '../../../lib/catalog';
import { requireAdmin } from '../../../lib/auth';
import { OrderLine } from '../../../types/order';

export async function POST(request: NextRequest) {
  let body: Partial<CreateOrderPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const errors = validateOrderPayload(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Validation failed.', fields: errors }, { status: 400 });
  }

  // Recompose product lines authoritatively from the (override-aware) catalog.
  const lines: OrderLine[] = [];
  for (const line of body.lines ?? []) {
    if (line.kind === 'product' && line.productId) {
      const product = await resolveProduct(line.productId);
      if (product) {
        lines.push({
          kind: 'product',
          productId: product.id,
          itemCode: product.itemCode,
          name: product.name,
          priceDisplay: product.approxPrice,
          priceValue: parseInt(product.approxPrice.replace(/[^0-9]/g, '') || '0', 10) || 0,
          qty: Math.max(1, line.qty || 1),
          itemsIncluded: product.itemsIncluded,
          notes: line.notes,
        });
        continue;
      }
    }
    lines.push({ ...line, qty: Math.max(1, line.qty || 1) });
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: 'Please add at least one item to your order.' }, { status: 400 });
  }

  try {
    const meta = await buildOrderMeta(request);
    const result = await createOrder({ ...body, lines } as CreateOrderPayload, meta);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('createOrder failed:', err);
    return NextResponse.json(
      { error: 'Could not save your order right now. Please try again or order on WhatsApp.' },
      { status: 503 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const search = request.nextUrl.searchParams;
  const status = (search.get('status') as never) || 'all';
  const q = search.get('q') ?? undefined;
  const limit = Number(search.get('limit') ?? 50);
  const skip = Number(search.get('skip') ?? 0);
  try {
    const { items, total } = await listOrders({ status, q, limit, skip });
    return NextResponse.json({ items: items.map((d) => toOrderRecord(d as Record<string, unknown>)), total });
  } catch (err) {
    console.error('listOrders failed:', err);
    return NextResponse.json({ error: 'Could not load orders.' }, { status: 503 });
  }
}