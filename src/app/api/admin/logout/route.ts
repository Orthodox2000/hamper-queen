import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, clearAdminSession, destroySession } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token) await destroySession(token).catch(() => {});
  return clearAdminSession(NextResponse.json({ ok: true }));
}