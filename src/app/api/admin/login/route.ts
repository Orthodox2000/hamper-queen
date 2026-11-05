import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifyPassword, withAdminSession } from '../../../../lib/auth';
import { getAdminUsersCollection } from '../../../../lib/mongo';

export async function POST(request: NextRequest) {
  let username: unknown;
  let password: unknown;
  try {
    const body = await request.json();
    username = body?.username;
    password = body?.password;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const cleanUsername = username.trim().toLowerCase();

  try {
    const users = await getAdminUsersCollection();
    const user = await users.findOne({ username: cleanUsername });
    if (!user || (user as { active?: boolean }).active === false) {
      return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
    }
    const valid = verifyPassword(
      password,
      String((user as { passwordSalt?: unknown }).passwordSalt ?? ''),
      String((user as { passwordHash?: unknown }).passwordHash ?? '')
    );
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
    }

    const token = await createSession(cleanUsername);
    const response = NextResponse.json({ ok: true });
    return withAdminSession(response, token);
  } catch (err) {
    console.error('admin login failed:', err);
    return NextResponse.json({ error: 'Could not sign in right now.' }, { status: 503 });
  }
}