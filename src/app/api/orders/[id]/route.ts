import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../lib/admin';
import { deleteOrder, lookupOrderById, toOrderRecord, updateOrder } from '../../../../lib/orders';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  const doc = await lookupOrderById(id);
  if (!doc) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json(toOrderRecord(doc as Record<string, unknown>));
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const patch = {
    status: body.status as never,
    payment: body.payment as never,
    customer: body.customer as never,
    delivery: body.delivery as never,
    notes: typeof body.notes === 'string' ? body.notes : undefined,
    note: typeof body.note === 'string' ? body.note : undefined,
  };

  try {
    const updated = await updateOrder(id, patch);
    return NextResponse.json(toOrderRecord(updated as Record<string, unknown>));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed.';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteOrder(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete failed.';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}