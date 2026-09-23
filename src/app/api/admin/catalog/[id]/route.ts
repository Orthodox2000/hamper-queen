import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../../lib/admin';
import { getCatalogOverridesCollection } from '../../../../../lib/mongo';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const collection = await getCatalogOverridesCollection();
    const result = await collection.deleteOne({ productId: id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Override not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete override.' }, { status: 503 });
  }
}