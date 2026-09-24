import { NextRequest, NextResponse } from 'next/server';
import { lookupOrderByTrackingId, sanitizeOrderPublic } from '../../../../../lib/orders';

type RouteContext = { params: Promise<{ trackingId: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { trackingId } = await params;
  const cleaned = trackingId.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^HQ-[A-Z2-9]{6}$/.test(cleaned)) {
    return NextResponse.json(
      { error: 'Invalid tracking ID format. Use HQ- followed by 6 letters/numbers (e.g. HQ-7K2M9Q).' },
      { status: 400 }
    );
  }
  try {
    const doc = await lookupOrderByTrackingId(cleaned);
    if (!doc) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json(sanitizeOrderPublic(doc as Record<string, unknown>));
  } catch {
    return NextResponse.json({ error: 'Could not look up your order right now.' }, { status: 503 });
  }
}