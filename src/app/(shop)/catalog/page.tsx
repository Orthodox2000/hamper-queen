'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HamperQueenShowcase } from '../../../components/HamperQueenShowcase';
import { CatalogSection } from '../../../components/CatalogSection';
import { useShopStore } from '../../../store/shop-store';
import { VESSEL_OPTIONS } from '../../../data/itemsData';
import { HamperQueenProduct } from '../../../data/hamperQueenCatalog';
import { royaleLogger } from '../../../utils/logger';

export default function CatalogPage() {
  const router = useRouter();
  const { language, setCustomHamper, addItemToHamper, openBooking, addProductToCart } = useShopStore();

  const goScribe = () => {
    royaleLogger.action('Navigation', 'User navigated to tab: scribe');
    router.push('/scribe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizeProduct = (product: HamperQueenProduct) => {
    const matchingVessel =
      product.category === 'bouquets'
        ? VESSEL_OPTIONS[1] // Parisian Velvet Hatbox
        : product.category === 'specialty_boxes'
        ? VESSEL_OPTIONS[0] // Sovereign Trunk
        : VESSEL_OPTIONS[2]; // Royal Wicker Basket

    setCustomHamper((prev) => ({ ...prev, vessel: matchingVessel }));
    royaleLogger.action('Catalog', `Hamper Queen product selected for Customised Atelier: ${product.name}`);
    router.push('/customised');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <HamperQueenShowcase
        language={language}
        onCustomizeProduct={handleCustomizeProduct}
        onOpenBooking={openBooking}
        onOpenScribe={goScribe}
        onAddToCart={(p) => { addProductToCart(p.id, true); royaleLogger.action('Catalog', `Added to cart: ${p.name} (${p.id})`); }}
      />

      <CatalogSection onAddItemToHamper={addItemToHamper} />
    </>
  );
}