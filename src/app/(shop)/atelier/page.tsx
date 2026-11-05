'use client';

import { useRouter } from 'next/navigation';
import { HamperBuilder } from '../../../components/HamperBuilder';
import { useShopStore } from '../../../store/shop-store';
import { royaleLogger } from '../../../utils/logger';

export default function AtelierPage() {
  const router = useRouter();
  const { customHamper, setCustomHamper } = useShopStore();

  return (
    <HamperBuilder
      customHamper={customHamper}
      onUpdateHamper={setCustomHamper}
      onOpenScribe={() => {
        royaleLogger.action('Navigation', 'User navigated to tab: scribe');
        router.push('/scribe');
        /* Next resets scroll on navigation */
      }}
    />
  );
}