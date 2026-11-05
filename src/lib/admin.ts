/**
 * admin.ts
 * -----------------------------------------------------------------------------
 * Compatibility shim. The real implementation now lives in lib/auth.ts
 * (DB-backed `adminUsers` + `sessions`). Kept exporting the cookie name and
 * cookie helpers so older imports stay valid.
 */

export {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  clearAdminSession,
  withAdminSession,
} from './auth';

/** @deprecated Use `requireAdmin` from lib/auth instead. */
export function isAdminToken(): boolean {
  throw new Error('isAdminToken is obsolete - use requireAdmin()/getSessionUser() from lib/auth.');
}

/** @deprecated Use `requireAdmin` from lib/auth instead. */
export function isAdminRequest(): boolean {
  throw new Error('isAdminRequest is obsolete - use the async requireAdmin() from lib/auth.');
}