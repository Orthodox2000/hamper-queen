/**
 * admin/catalog/page.tsx
 * -----------------------------------------------------------------------------
 * Server component gate for catalog override management.
 */

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getSessionUser } from '../../../lib/auth';
import { AdminLogin } from '../admin-login';
import { CatalogManager } from '../catalog-manager';

export const metadata = {
  title: 'Hamper Queen Admin · Catalog',
  robots: 'noindex, nofollow',
};

export default async function AdminCatalogPage() {
  const cookieStore = await cookies();
  const authed = await getSessionUser(cookieStore.get(ADMIN_COOKIE)?.value);

  return authed ? <CatalogManager /> : <AdminLogin />;
}