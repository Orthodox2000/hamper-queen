/**
 * admin/page.tsx
 * -----------------------------------------------------------------------------
 * Server component gate for the staff panel. Verifies the httpOnly admin
 * cookie server-side; renders the login form when absent, otherwise the
 * authenticated orders dashboard.
 */

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isAdminToken } from '../../lib/admin';
import { AdminLogin } from './admin-login';
import { OrdersDashboard } from './orders-dashboard';

export const metadata = {
  title: 'Hamper Queen Admin',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = isAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);

  return authed ? <OrdersDashboard /> : <AdminLogin />;
}