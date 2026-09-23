'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RoyalInspirationGallery } from '../../../components/RoyalInspirationGallery';
import { useShopStore } from '../../../store/shop-store';
import { RoyalInspiration } from '../../../data/inspirationData';
import { royaleLogger } from '../../../utils/logger';

export default function InspirationsPage() {
  const router = useRouter();
  const { language, setCustomHamper } = useShopStore();

  const goScribe = () => {
    royaleLogger.action('Navigation', 'User navigated to tab: scribe');
    router.push('/scribe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizeInspiration = (insp: RoyalInspiration) => {
    setCustomHamper((prev) => ({
      ...prev,
      vessel: insp.royalVessel,
      items: [...insp.curatedItems],
      ribbon: insp.ribbon,
      waxSeal: insp.waxSeal,
    }));
    royaleLogger.action('Inspirations', `Curated inspiration loaded into Customised Atelier: ${insp.titleEn}`);
    router.push('/customised');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RoyalInspirationGallery
      language={language}
      onCustomizeInspiration={handleCustomizeInspiration}
      onOpenScribe={goScribe}
    />
  );
}