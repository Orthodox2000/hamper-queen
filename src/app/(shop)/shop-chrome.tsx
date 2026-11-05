'use client';

/**
 * shop-chrome.tsx
 * -----------------------------------------------------------------------------
 * Client chrome shared by every shop route: sticky header, slide-over cart
 * drawer, booking modal and royal footer. Reads/writes the shared shop store.
 */

import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HamperDrawer } from '../../components/HamperDrawer';
import { BookingOrderModal } from '../../components/BookingOrderModal';
import { useShopStore } from '../../store/shop-store';

export function ShopChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    language,
    setLanguage,
    customHamper,
    removeItemFromHamper,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
    isHamperDrawerOpen,
    openHamperDrawer,
    closeHamperDrawer,
    isBookingModalOpen,
    selectedBookingProduct,
    isBulkBooking,
    openBooking,
    closeBooking,
    productCartLines,
    removeProductLine,
    increaseProductLine,
    decreaseProductLine,
    applyCatalogOverride,
  } = useShopStore();

  return (
    <div className="min-h-dvh bg-white text-ink flex flex-col font-sans selection:bg-gold-400/30 selection:text-ink">
      <Header
        activeHamper={customHamper}
        onOpenHamperDrawer={openHamperDrawer}
        onOpenBooking={() => openBooking()}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1">{children}</main>

      <HamperDrawer
        isOpen={isHamperDrawerOpen}
        onClose={closeHamperDrawer}
        customHamper={customHamper}
        onRemoveItem={removeItemFromHamper}
        onIncreaseItem={increaseItemQuantity}
        onDecreaseItem={decreaseItemQuantity}
        onClearCart={clearCart}
        onOpenAtelier={() => {
          closeHamperDrawer();
          router.push('/atelier');
        }}
        onOpenBooking={() => {
          closeHamperDrawer();
          openBooking(undefined, false);
        }}
        productCartLines={productCartLines}
        onRemoveProductLine={removeProductLine}
        onIncreaseProductLine={increaseProductLine}
        onDecreaseProductLine={decreaseProductLine}
        applyCatalogOverride={applyCatalogOverride}
      />

      <BookingOrderModal
        isOpen={isBookingModalOpen}
        onClose={closeBooking}
        preSelectedProduct={selectedBookingProduct}
        customHamper={customHamper}
        initialBulkMode={isBulkBooking}
        productCartLines={productCartLines}
        onOrderPlaced={clearCart}
        applyCatalogOverride={applyCatalogOverride}
      />

      <Footer language={language} />
    </div>
  );
}