/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoyalCoverHero } from './components/RoyalCoverHero';
import { RoyalInspirationGallery } from './components/RoyalInspirationGallery';
import { HamperQueenShowcase } from './components/HamperQueenShowcase';
import { CatalogSection } from './components/CatalogSection';
import { HamperBuilder } from './components/HamperBuilder';
import { CustomHamperAtelier } from './components/CustomHamperAtelier';
import { CustomMessagingPlatform } from './components/CustomMessagingPlatform';
import { PricingSection } from './components/PricingSection';
import { BrochuresSection } from './components/BrochuresSection';
import { HamperDrawer } from './components/HamperDrawer';
import { BookingOrderModal } from './components/BookingOrderModal';
import { BulkOrdersSection } from './components/BulkOrdersSection';
import { Footer } from './components/Footer';
import { CustomHamper, LuxuryItem, CalligraphyCard, LanguageMode } from './types';
import { VESSEL_OPTIONS, RIBBON_OPTIONS, WAX_SEAL_OPTIONS, LUXURY_ITEMS } from './data/itemsData';
import { RoyalInspiration } from './data/inspirationData';
import { HamperQueenProduct } from './data/hamperQueenCatalog';
import { royaleLogger } from './utils/logger';
import { triggerMouseClickConfetti } from './utils/confetti';

// Deterministic default curation (The Crown Sovereign Trunk).
// Must stay stable across server & client renders to keep hydration intact.
const DEFAULT_CUSTOM_HAMPER: CustomHamper = {
  id: 'HQ-ROYAL-DEFAULT',
  vessel: VESSEL_OPTIONS[0],
  items: [LUXURY_ITEMS[6], LUXURY_ITEMS[7], LUXURY_ITEMS[9]], // 24K Truffles, Kashmiri Saffron, Amber Candle
  ribbon: RIBBON_OPTIONS[0],
  waxSeal: WAX_SEAL_OPTIONS[0],
  botanicalSprig: true,
  createdAt: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isHamperDrawerOpen, setIsHamperDrawerOpen] = useState<boolean>(false);

  // Booking Modal & Concierge Desk State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedBookingProduct, setSelectedBookingProduct] = useState<HamperQueenProduct | null>(null);
  const [isBulkBooking, setIsBulkBooking] = useState<boolean>(false);

  // Global Mouse Click Confetti Trigger on Interactive Elements
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('select') ||
        target?.closest('[role="button"]') ||
        target?.closest('.cursor-pointer')
      ) {
        triggerMouseClickConfetti(e.clientX, e.clientY);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Open Booking Handler
  const handleOpenBooking = (product?: HamperQueenProduct, isBulk: boolean = false) => {
    setSelectedBookingProduct(product || null);
    setIsBulkBooking(isBulk);
    setIsBookingModalOpen(true);
    royaleLogger.action(
      'Booking',
      `Opened booking modal for: ${product ? product.name : isBulk ? 'Bulk Order' : 'General Concierge'}`
    );
  };

  // Global Language state (Default: Pure Simple Indian English).
  // NOTE: Must be hydration-safe — never read localStorage or generate random/date
  // values inside a useState initializer, or server HTML will mismatch the client
  // and React bails out of hydration (breaking ALL interactivity/animations).
  const [language, setLanguage] = useState<LanguageMode>('en');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('hamper_queen_language');
      if (savedLang === 'en' || savedLang === 'hinglish' || savedLang === 'bilingual') {
        setLanguage(savedLang);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setLanguageLoaded(true);
    }
  }, []);

  // Save language preference (only after persisted state has been loaded)
  useEffect(() => {
    if (!languageLoaded) return;
    try {
      localStorage.setItem('hamper_queen_language', language);
    } catch {
      // Ignore storage errors
    }
  }, [language, languageLoaded]);

  // Active Custom Hamper State (hydration-safe deterministic default)
  const [customHamper, setCustomHamper] = useState<CustomHamper>(DEFAULT_CUSTOM_HAMPER);
  const [hamperLoaded, setHamperLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hamper_queen_custom_hamper');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.vessel && Array.isArray(parsed.items)) {
          setCustomHamper(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHamperLoaded(true);
    }
  }, []);

  // Save hamper state locally whenever it changes (after load completes)
  useEffect(() => {
    if (!hamperLoaded) return;
    try {
      localStorage.setItem('hamper_queen_custom_hamper', JSON.stringify(customHamper));
    } catch {
      // Ignore local storage write errors
    }
  }, [customHamper, hamperLoaded]);

  // Handlers
  const handleAddItemToHamper = (item: LuxuryItem) => {
    if (customHamper.items.length >= customHamper.vessel.capacity) {
      alert(`The ${customHamper.vessel.name} has reached its maximum capacity of ${customHamper.vessel.capacity} items.`);
      royaleLogger.warn('App', `Hamper capacity reached: ${customHamper.vessel.capacity}`);
      return;
    }
    setCustomHamper((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  };

  const handleRemoveItemFromHamper = (index: number) => {
    setCustomHamper((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleAttachCardToHamper = (card: CalligraphyCard) => {
    setCustomHamper((prev) => ({
      ...prev,
      card,
    }));
  };

  const handleStartBuilderWithInspiration = (insp: RoyalInspiration) => {
    setCustomHamper((prev) => ({
      ...prev,
      vessel: insp.royalVessel,
      items: [...insp.curatedItems],
      ribbon: insp.ribbon,
      waxSeal: insp.waxSeal,
    }));
    setActiveTab('customised');
    royaleLogger.action('App', `Curated inspiration loaded into Customised Atelier: ${insp.titleEn}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizeHamperQueenProduct = (product: HamperQueenProduct) => {
    const matchingVessel =
      product.category === 'bouquets'
        ? VESSEL_OPTIONS[1] // Parisian Velvet Hatbox
        : product.category === 'specialty_boxes'
        ? VESSEL_OPTIONS[0] // Sovereign Trunk
        : VESSEL_OPTIONS[2]; // Royal Wicker Basket

    setCustomHamper((prev) => ({
      ...prev,
      vessel: matchingVessel,
    }));
    setActiveTab('customised');
    royaleLogger.action('App', `Hamper Queen product selected for Customised Atelier: ${product.name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#111111]">
      
      {/* Sovereign Header with Hamper Queen Logo & Language Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          royaleLogger.action('Navigation', `User navigated to tab: ${tab}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeHamper={customHamper}
        onOpenHamperDrawer={() => setIsHamperDrawerOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
        language={language}
        setLanguage={(lang) => {
          setLanguage(lang);
          royaleLogger.action('Localization', `Language switched to: ${lang}`);
        }}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* Full-Screen Animated Cover & Interactive Unbox Experience */}
        {activeTab === 'home' && (
          <>
            <RoyalCoverHero
              language={language}
              onOpenBooking={() => handleOpenBooking()}
              onOpenCustomised={() => {
                setActiveTab('customised');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartBuilderWithInspiration={handleStartBuilderWithInspiration}
              onExploreCatalog={() => {
                const el = document.getElementById('hamper-queen-catalog-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onExploreInspirations={() => {
                const el = document.getElementById('royal-inspirations-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenScribe={() => {
                setActiveTab('scribe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Complete Hamper Queen Catalog: Bouquets, 12 Birthday Hampers & Specialty Boxes */}
            <HamperQueenShowcase
              language={language}
              onCustomizeProduct={handleCustomizeHamperQueenProduct}
              onOpenBooking={handleOpenBooking}
              onOpenScribe={() => {
                setActiveTab('scribe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Bulk Orders, Corporate Gifting & Party Favors */}
            <BulkOrdersSection
              onOpenBulkBooking={() => handleOpenBooking(undefined, true)}
            />

            <RoyalInspirationGallery
              language={language}
              onCustomizeInspiration={handleStartBuilderWithInspiration}
              onOpenScribe={() => {
                setActiveTab('scribe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* Dedicated Route for Bulk Orders and Party Favors */}
        {activeTab === 'bulk' && (
          <BulkOrdersSection
            onOpenBulkBooking={() => handleOpenBooking(undefined, true)}
          />
        )}

        {/* Thematic Inspirations Standalone View */}
        {activeTab === 'inspirations' && (
          <RoyalInspirationGallery
            language={language}
            onCustomizeInspiration={handleStartBuilderWithInspiration}
            onOpenScribe={() => {
              setActiveTab('scribe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Dedicated Route for Detailed 12 Birthday Hampers & Bouquets Showcase */}
        {activeTab === 'hampers' && (
          <HamperQueenShowcase
            language={language}
            onCustomizeProduct={handleCustomizeHamperQueenProduct}
            onOpenBooking={handleOpenBooking}
            onOpenScribe={() => {
              setActiveTab('scribe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Master Product Catalog Section */}
        {activeTab === 'catalog' && (
          <>
            <HamperQueenShowcase
              language={language}
              onCustomizeProduct={handleCustomizeHamperQueenProduct}
              onOpenBooking={handleOpenBooking}
              onOpenScribe={() => {
                setActiveTab('scribe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CatalogSection
              onAddItemToHamper={handleAddItemToHamper}
            />
          </>
        )}

        {/* Dedicated Route for Customised Hampers & Bouquets based on Quantity Slots */}
        {activeTab === 'customised' && (
          <CustomHamperAtelier
            initialItems={customHamper.items}
            onSaveToHamper={(hamper) => {
              setCustomHamper(hamper);
              setIsHamperDrawerOpen(true);
            }}
            onOpenScribe={() => {
              setActiveTab('scribe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 4-Step Interactive Hamper Builder Atelier */}
        {activeTab === 'atelier' && (
          <HamperBuilder
            customHamper={customHamper}
            onUpdateHamper={setCustomHamper}
            onOpenScribe={() => {
              setActiveTab('scribe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Calligraphy Scribe Studio Platform */}
        {activeTab === 'scribe' && (
          <CustomMessagingPlatform
            initialCard={customHamper.card}
            onAttachCardToHamper={handleAttachCardToHamper}
          />
        )}

        {/* Digital Lookbooks & Brochures */}
        {activeTab === 'brochures' && (
          <BrochuresSection />
        )}

        {/* Modular Pricing Tiers & Budget Estimator */}
        {activeTab === 'pricing' && (
          <PricingSection />
        )}
      </main>

      {/* Slide-over Hamper Tray Drawer */}
      <HamperDrawer
        isOpen={isHamperDrawerOpen}
        onClose={() => setIsHamperDrawerOpen(false)}
        customHamper={customHamper}
        onRemoveItem={handleRemoveItemFromHamper}
        onOpenAtelier={() => {
          setIsHamperDrawerOpen(false);
          setActiveTab('atelier');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => {
          setIsHamperDrawerOpen(false);
          handleOpenBooking(undefined, false);
        }}
      />

      {/* Official Booking & Concierge Desk Modal with Maps-Based Pin-Pointing */}
      <BookingOrderModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preSelectedProduct={selectedBookingProduct}
        customHamper={customHamper}
        initialBulkMode={isBulkBooking}
      />

      {/* Sovereign Royal Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />
    </div>
  );
}
