import { NextResponse } from 'next/server';
import { getMergedCatalog } from '../../../lib/catalog';

export async function GET() {
  try {
    const products = await getMergedCatalog();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Could not load catalog.' }, { status: 503 });
  }
}