import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifyPassword, withAdminSession } from '../../../../lib/auth';
import { getAdminUsersCollection } from '../../../../lib/mongo';

/**
 * Brute-force guard: max 8 failed attempts per IP + username in 15 minutes.
 * In-memory (per server instance) - a cheap first line of defence, not a substitute for a strong password.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const failures = new Map<string, { count: number; first: number }>();

function attemptKey(request: NextRequest, username: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return `${ip}|${username}`;
}

function isLocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
  if (failures.size > 5000) failures.clear(); // never grow without bound
}

// Verified against when the username is unknown, so "no such user" costs the same time as "wrong password".
const DUMMY_SALT = '00000000000000000000000000000000';
const DUMMY_HASH = '0'.repeat(128);

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
  const key = attemptKey(request, cleanUsername);
  if (isLocked(key)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes and try again.' }, { status: 429 });
  }

  try {
    const users = await getAdminUsersCollection();
    const user = await users.findOne({ username: cleanUsername });
    const inactive = !user || (user as { active?: boolean }).active === false;
    const valid = verifyPassword(
      password,
      inactive ? DUMMY_SALT : String((user as { passwordSalt?: unknown }).passwordSalt ?? ''),
      inactive ? DUMMY_HASH : String((user as { passwordHash?: unknown }).passwordHash ?? '')
    );
    if (inactive || !valid) {
      recordFailure(key);
      return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
    }

    failures.delete(key);
    const token = await createSession(cleanUsername);
    const response = NextResponse.json({ ok: true });
    return withAdminSession(response, token);
  } catch (err) {
    console.error('admin login failed:', err);
    return NextResponse.json({ error: 'Could not sign in right now.' }, { status: 503 });
  }
}
