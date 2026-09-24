/**
 * admin/promo/page.tsx
 * -----------------------------------------------------------------------------
 * Server component gate for promo code management.
 */

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getSessionUser } from '../../../lib/auth';
import { AdminLogin } from '../admin-login';
import PromoManager from '../promo-manager';

export const metadata = {
  title: 'Hamper Queen Admin · Promo Codes',
  robots: 'noindex, nofollow',
};

export default async function AdminPromoPage() {
  const cookieStore = await cookies();
  const authed = await getSessionUser(cookieStore.get(ADMIN_COOKIE)?.value);

  return authed ? <PromoManager /> : <AdminLogin />;
}