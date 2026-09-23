'use client';

import React from 'react';
import { BulkOrdersSection } from '../../../components/BulkOrdersSection';
import { useShopStore } from '../../../store/shop-store';

export default function BulkPage() {
  const { openBooking } = useShopStore();

  return <BulkOrdersSection onOpenBulkBooking={() => openBooking(undefined, true)} />;
}