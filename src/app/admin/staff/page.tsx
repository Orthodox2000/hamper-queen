/**
 * admin/staff/page.tsx
 * -----------------------------------------------------------------------------
 * Server component gate for staff management. Only the owner account can
 * create/reset/disable team accounts (enforced server-side too).
 */

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getSessionUser } from '../../../lib/auth';
import { AdminLogin } from '../admin-login';
import StaffManager from '../staff-manager';

export const metadata = {
  title: 'Hamper Queen Admin · Staff',
  robots: 'noindex, nofollow',
};

export default async function AdminStaffPage() {
  const cookieStore = await cookies();
  const authed = await getSessionUser(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!authed) return <AdminLogin />;
  if (authed.role !== 'owner') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4">
        <div className="max-w-sm w-full p-8 rounded-3xl bg-white border border-[#EAE5D9] text-center space-y-3 shadow-sm">
          <h1 className="font-cinzel text-lg font-bold text-[#141414]">Owner only</h1>
          <p className="text-sm text-[#6B6559]">Only the owner account can manage staff. Ask the owner to sign in here.</p>
          <a href="/admin" className="inline-block mt-2 text-xs font-bold text-[#8C6821] hover:underline">← Back to dashboard</a>
        </div>
      </div>
    );
  }

  return <StaffManager selfId={authed.userId} />;
}