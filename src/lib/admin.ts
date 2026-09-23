/**
 * admin.ts
 * -----------------------------------------------------------------------------
 * Minimal staff auth for the /admin panel. Password compared via sha256; an
 * httpOnly cookie marks an authenticated session. Intentionally basic — the
 * password defaults to "123" for staging and must be changed in production.
 */

import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'hq_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || '123';
}

export function adminToken(password: string = adminPassword()): string {
  return crypto.createHash('sha256').update('hamper-queen-admin:' + password).digest('hex');
}

export function isAdminToken(value: string | undefined | null): boolean {
  if (!value) return false;
  return value === adminToken();
}

/** API-route guard: true when the request carries a valid admin cookie. */
export function isAdminRequest(request: NextRequest): boolean {
  return isAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Writes the auth cookie onto a NextResponse. */
export function withAdminSession(response: Response, maxAge: number = ADMIN_COOKIE_MAX_AGE): Response {
  const cookie = [
    `${ADMIN_COOKIE}=${adminToken()}`,
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