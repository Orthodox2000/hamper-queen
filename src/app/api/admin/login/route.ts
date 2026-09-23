import { NextRequest, NextResponse } from 'next/server';
import { adminPassword, withAdminSession } from '../../../../lib/admin';

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof password !== 'string' || password !== adminPassword()) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  return withAdminSession(response);
}