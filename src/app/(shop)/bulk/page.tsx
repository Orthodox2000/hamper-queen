'use client';

import { BulkOrdersSection } from '../../../components/BulkOrdersSection';
import { useShopStore } from '../../../store/shop-store';

export default function BulkPage() {
  const { openBooking } = useShopStore();

  return (
    <>
      <h1 className="sr-only">Bulk and corporate gifting with tiered discounts</h1>
      <BulkOrdersSection onOpenBulkBooking={() => openBooking(undefined, true)} />
    </>
  );
}