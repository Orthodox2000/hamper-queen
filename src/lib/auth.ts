/**
 * auth.ts
 * -----------------------------------------------------------------------------
 * DB-backed admin authentication. Staff accounts live in `adminUsers`
 * (scrypt-hashed passwords) and active sessions live in `sessions` (random
 * httpOnly cookie token, 7-day expiry). Ship runtime needs no env secrets.
 */

import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAdminUsersCollection, getSessionsCollection } from './mongo';

export const ADMIN_COOKIE = 'hq_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminRole = 'owner' | 'admin';

export interface SessionUser {
  userId: string;
  username: string;
  role: AdminRole;
}

export function hashPassword(password: string, salt: string = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(String(password), salt, 64).toString('hex') };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const candidate = crypto.scryptSync(String(password), String(salt), 64);
  const expected = Buffer.from(String(expectedHash), 'hex');
  return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
}

function randomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Create a session row for a known-good username. Returns the cookie token. */
export async function createSession(username: string): Promise<string> {
  const users = await getAdminUsersCollection();
  const user = await users.findOne({ username });
  if (!user || (user as { active?: boolean }).active === false) {
    throw new Error('Invalid credentials.');
  }
  const token = randomToken();
  const now = Date.now();
  const sessions = await getSessionsCollection();
  await sessions.insertOne({
    token,
    userId: String(user._id),
    username,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ADMIN_COOKIE_MAX_AGE * 1000).toISOString(),
  });
  return token;
}

/** Resolve a cookie token to a live session user; null when invalid/expired/gone. */
export async function getSessionUser(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  const sessions = await getSessionsCollection();
  const session = await sessions.findOne({ token });
  if (!session) return null;
  if (new Date(session.expiresAt as string).getTime() < Date.now()) {
    await sessions.deleteOne({ token }).catch(() => {});
    return null;
  }

  const userId = String(session.userId ?? '');
  if (!ObjectId.isValid(userId)) {
    await sessions.deleteOne({ token }).catch(() => {});
    return null;
  }

  const users = await getAdminUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user || (user as { active?: boolean }).active === false) {
    await sessions.deleteOne({ token }).catch(() => {});
    return null;
  }

  return {
    userId,
    username: String((user as { username?: unknown }).username ?? session.username ?? ''),
    role: ((user as { role?: unknown }).role as AdminRole) ?? 'admin',
  };
}

export async function destroySession(token: string): Promise<void> {
  if (!token) return;
  const sessions = await getSessionsCollection();
  await sessions.deleteOne({ token }).catch(() => {});
}

/** Route guard: true/current staff when the request carries a valid admin cookie. */
export async function requireAdmin(request: NextRequest): Promise<SessionUser | null> {
  return getSessionUser(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Writes the auth cookie onto a NextResponse. */
export function withAdminSession(response: Response, token: string, maxAge: number = ADMIN_COOKIE_MAX_AGE): Response {
  const cookie = [
    `${ADMIN_COOKIE}=${token}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
  response.headers.set('Set-Cookie', cookie);
  return response;
}

export function clearAdminSession(response: Response): Response {
  response.headers.set(
    'Set-Cookie',
    `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  );
  return response;
}