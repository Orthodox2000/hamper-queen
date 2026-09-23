'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CustomHamperAtelier } from '../../../components/CustomHamperAtelier';
import { useShopStore } from '../../../store/shop-store';
import { royaleLogger } from '../../../utils/logger';

export default function CustomisedPage() {
  const router = useRouter();
  const { customHamper, setCustomHamper, openHamperDrawer } = useShopStore();

  return (
    <CustomHamperAtelier
      initialItems={customHamper.items}
      onSaveToHamper={(hamper) => {
        setCustomHamper(hamper);
        openHamperDrawer();
      }}
      onOpenScribe={() => {
        royaleLogger.action('Navigation', 'User navigated to tab: scribe');
        router.push('/scribe');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}