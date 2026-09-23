import { NextRequest, NextResponse } from 'next/server';
import { lookupOrderByTrackingId, sanitizeOrderPublic } from '../../../../../lib/orders';

type RouteContext = { params: Promise<{ trackingId: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { trackingId } = await params;
  try {
    const doc = await lookupOrderByTrackingId(trackingId);
    if (!doc) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json(sanitizeOrderPublic(doc as Record<string, unknown>));
  } catch {
    return NextResponse.json({ error: 'Could not look up your order right now.' }, { status: 503 });
  }
}