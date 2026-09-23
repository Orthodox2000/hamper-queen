"use client";

import React from "react";
import { RoyalCoverHero } from "../../components/RoyalCoverHero";
import { HamperQueenShowcase } from "../../components/HamperQueenShowcase";
import { BulkOrdersSection } from "../../components/BulkOrdersSection";
import { RoyalInspirationGallery } from "../../components/RoyalInspirationGallery";
import { useShopStore } from "../../store/shop-store";
import { useRouter } from "next/navigation";
import { VESSEL_OPTIONS } from "../../data/itemsData";
import { HamperQueenProduct } from "../../data/hamperQueenCatalog";
import { RoyalInspiration } from "../../data/inspirationData";
import { royaleLogger } from "../../utils/logger";

export function RootHome() {
  const router = useRouter();
  const { language, setCustomHamper, openBooking, addProductToCart } = useShopStore();

  const goToTab = (tab: string) => {
    royaleLogger.action("Navigation", `User navigated to tab: ${tab}`);
    router.push(`/${tab === "home" ? "" : tab}`);
  };

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleStartBuilderWithInspiration = (insp: RoyalInspiration) => {
    setCustomHamper((prev) => ({
      ...prev,
      vessel: insp.royalVessel,
      items: [...insp.curatedItems],
      ribbon: insp.ribbon,
      waxSeal: insp.waxSeal,
    }));
    goToTab("customised");
    royaleLogger.action("Home", `Curated inspiration loaded into Customised Atelier: ${insp.titleEn}`);
    goTop();
  };

  const handleCustomizeHamperQueenProduct = (product: HamperQueenProduct) => {
    const matchingVessel =
      product.category === "bouquets"
        ? VESSEL_OPTIONS[1] // Parisian Velvet Hatbox
        : product.category === "specialty_boxes"
        ? VESSEL_OPTIONS[0] // Sovereign Trunk
        : VESSEL_OPTIONS[2]; // Royal Wicker Basket

    setCustomHamper((prev) => ({
      ...prev,
      vessel: matchingVessel,
    }));
    goToTab("customised");
    royaleLogger.action("Home", `Hamper Queen product selected for Customised Atelier: ${product.name}`);
    goTop();
  };

  return (
    <>
      <RoyalCoverHero
        language={language}
        onOpenBooking={() => openBooking()}
        onOpenCustomised={() => {
          goToTab("customised");
          goTop();
        }}
        onStartBuilderWithInspiration={handleStartBuilderWithInspiration}
        onExploreCatalog={() => {
          const el = document.getElementById("hamper-queen-catalog-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            goToTab("catalog");
            goTop();
          }
        }}
        onExploreInspirations={() => {
          const el = document.getElementById("royal-inspirations-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenScribe={() => {
          goToTab("scribe");
          goTop();
        }}
      />

      <HamperQueenShowcase
        language={language}
        spotlightOnly
        onCustomizeProduct={handleCustomizeHamperQueenProduct}
        onOpenBooking={openBooking}
        onOpenScribe={() => {
          goToTab("scribe");
          goTop();
        }}
        onAddToCart={(p) => { addProductToCart(p.id, true); royaleLogger.action('Home', `Added to cart: ${p.name} (${p.id})`); }}
      />

      <BulkOrdersSection onOpenBulkBooking={() => openBooking(undefined, true)} />

      <RoyalInspirationGallery
        language={language}
        onCustomizeInspiration={handleStartBuilderWithInspiration}
        onOpenScribe={() => {
          goToTab("scribe");
          goTop();
        }}
      />
    </>
  );
}

export default RootHome;