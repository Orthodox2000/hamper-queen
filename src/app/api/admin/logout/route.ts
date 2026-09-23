import { NextResponse } from 'next/server';
import { clearAdminSession } from '../../../../lib/admin';

export async function POST() {
  return clearAdminSession(NextResponse.json({ ok: true }));
}