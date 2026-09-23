/**
 * admin/orders/[id]/page.tsx
 * -----------------------------------------------------------------------------
 * Server component gate for the per-order management screen.
 */

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isAdminToken } from '../../../../lib/admin';
import { AdminLogin } from '../../admin-login';
import { OrderEditor } from '../../order-editor';

export const metadata = {
  title: 'Hamper Queen Admin · Order',
  robots: 'noindex, nofollow',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderPage({ params }: Props) {
  const cookieStore = await cookies();
  const authed = isAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const { id } = await params;
  if (!id || id.length > 40) {
    return <AdminLogin />;
  }

  return authed ? <OrderEditor orderId={id} /> : <AdminLogin />;
}