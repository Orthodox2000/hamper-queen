import { NextRequest, NextResponse } from 'next/server';
import { PromoRedeemError, validatePromoCode } from '../../../../lib/promo';

/** Preview-only promo check — never burns or claims a coupon. */
export async function POST(request: NextRequest) {
  let body: { code?: string; subtotal?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const subtotal = typeof body?.subtotal === 'number' && Number.isFinite(body.subtotal) ? body.subtotal : 0;
  try {
    const result = await validatePromoCode(String(body?.code ?? ''), subtotal);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PromoRedeemError) {
      return NextResponse.json({ error: 'That coupon is invalid, expired, or already used.', promoError: true }, { status: 400 });
    }
    return NextResponse.json({ error: 'Could not check the coupon right now.' }, { status: 503 });
  }
}