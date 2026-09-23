/**
 * shop-store.tsx
 * -----------------------------------------------------------------------------
 * Shared client store for Hero-side shopping flow.
 *
 *  - `items: []` by default (empty cart) — hydration-safe; never read
 *    localStorage in a useState initializer.
 *  - Persists the customized hamper and language preference to localStorage
 *    once the app has mounted and re-hydrated.
 *  - Exposes drawer + booking modal open state so header/footer/drawer/modal
 *    can share one truth across route pages.
 */

'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CustomHamper, LanguageMode, LuxuryItem, CalligraphyCard } from '../types';
import { VESSEL_OPTIONS, RIBBON_OPTIONS, WAX_SEAL_OPTIONS } from '../data/itemsData';
import { HamperQueenProduct } from '../data/hamperQueenCatalog';
import { triggerMouseClickConfetti } from '../utils/confetti';
import { royaleLogger } from '../utils/logger';

/** A prebuilt catalog product added to the royal cart. */
export interface ProductCartLine {
  productId: string;
  qty: number;
}

/** Admin catalog override fields (name/price/subtitle/etc.) keyed by product id. */
export type CatalogOverrides = Record<string, Partial<HamperQueenProduct>>;

// Deterministic default curation — empty cart by default (user directive).
const DEFAULT_CUSTOM_HAMPER: CustomHamper = {
  id: 'HQ-ROYAL-DEFAULT',
  vessel: VESSEL_OPTIONS[0],
  items: [],
  ribbon: RIBBON_OPTIONS[0],
  waxSeal: WAX_SEAL_OPTIONS[0],
  botanicalSprig: true,
  createdAt: 0,
};

interface ShopStoreValue {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  customHamper: CustomHamper;
  setCustomHamper: React.Dispatch<React.SetStateAction<CustomHamper>>;
  addItemToHamper: (item: LuxuryItem) => void;
  removeItemFromHamper: (itemId: string) => void;
  increaseItemQuantity: (itemId: string) => void;
  decreaseItemQuantity: (itemId: string) => void;
  clearCart: () => void;
  attachCardToHamper: (card: CalligraphyCard) => void;
  isHamperDrawerOpen: boolean;
  openHamperDrawer: () => void;
  closeHamperDrawer: () => void;
  isBookingModalOpen: boolean;
  selectedBookingProduct: HamperQueenProduct | null;
  isBulkBooking: boolean;
  openBooking: (product?: HamperQueenProduct, isBulk?: boolean) => void;
  closeBooking: () => void;
  productCartLines: ProductCartLine[];
  addProductToCart: (productId: string, openDrawer?: boolean) => void;
  increaseProductLine: (productId: string) => void;
  decreaseProductLine: (productId: string) => void;
  removeProductLine: (productId: string) => void;
  catalogOverrides: CatalogOverrides;
  applyCatalogOverride: (product: HamperQueenProduct) => HamperQueenProduct;
}

const ShopStoreContext = createContext<ShopStoreValue | null>(null);

export function ShopStoreProvider({ children }: { children: React.ReactNode }) {
  // Language state (Default: Pure Simple Indian English).
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

  // Active Custom Hamper State (hydration-safe deterministic default = empty cart)
  const [customHamper, setCustomHamper] = useState<CustomHamper>(DEFAULT_CUSTOM_HAMPER);
  const [hamperLoaded, setHamperLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hamper_queen_custom_hamper');
      if (saved) {
        const parsed = JSON.parse(saved) as CustomHamper;
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

  // Drawer + Booking modal state
  const [isHamperDrawerOpen, setIsHamperDrawerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingProduct, setSelectedBookingProduct] = useState<HamperQueenProduct | null>(null);
  const [isBulkBooking, setIsBulkBooking] = useState(false);

  const openHamperDrawer = useCallback(() => setIsHamperDrawerOpen(true), []);
  const closeHamperDrawer = useCallback(() => setIsHamperDrawerOpen(false), []);

  const openBooking = useCallback((product?: HamperQueenProduct, isBulk: boolean = false) => {
    setSelectedBookingProduct(product || null);
    setIsBulkBooking(isBulk);
    setIsBookingModalOpen(true);
    royaleLogger.action('Booking', `Opened booking modal for: ${product ? product.name : isBulk ? 'Bulk Order' : 'General Concierge'}`);
  }, []);

  const closeBooking = useCallback(() => setIsBookingModalOpen(false), []);

  // Prebuilt product cart lines (persisted for the unified cart → checkout flow)
  const [productCartLines, setProductCartLines] = useState<ProductCartLine[]>([]);
  const [productCartLoaded, setProductCartLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hamper_queen_product_cart');
      if (saved) {
        const parsed = JSON.parse(saved) as ProductCartLine[];
        if (Array.isArray(parsed)) {
          setProductCartLines(
            parsed.filter((l) => typeof l?.productId === 'string' && typeof l?.qty === 'number')
          );
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setProductCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!productCartLoaded) return;
    try {
      localStorage.setItem('hamper_queen_product_cart', JSON.stringify(productCartLines));
    } catch {
      // Ignore storage errors
    }
  }, [productCartLines, productCartLoaded]);

  const addProductToCart = useCallback(
    (productId: string, openDrawer: boolean = true) => {
      setProductCartLines((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l));
        }
        return [...prev, { productId, qty: 1 }];
      });
      royaleLogger.action('Store', `Added prebuilt product to cart: ${productId}`);
      if (openDrawer) setIsHamperDrawerOpen(true);
    },
    []
  );

  const increaseProductLine = useCallback((productId: string) => {
    setProductCartLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
    );
  }, []);

  const decreaseProductLine = useCallback((productId: string) => {
    setProductCartLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeProductLine = useCallback((productId: string) => {
    setProductCartLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  // Admin catalog overrides (name/price/subtitle…), merged at runtime.
  const [catalogOverrides, setCatalogOverrides] = useState<CatalogOverrides>({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.products) return;
        const map: CatalogOverrides = {};
        for (const product of data.products as HamperQueenProduct[]) {
          const base = product as Partial<HamperQueenProduct>;
          map[product.id] = base as Partial<HamperQueenProduct>;
        }
        setCatalogOverrides(map);
      })
      .catch(() => {
        // Static catalog fallback already in place
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyCatalogOverride = useCallback(
    (product: HamperQueenProduct): HamperQueenProduct => {
      return { ...product, ...(catalogOverrides[product.id] ?? {}) };
    },
    [catalogOverrides]
  );

  const addItemToHamper = useCallback((item: LuxuryItem) => {
    setCustomHamper((prev) => ({ ...prev, items: [...prev.items, item] }));
    royaleLogger.action('Store', `Added to cart: ${item.name}`);
  }, []);

  const removeItemFromHamper = useCallback((itemId: string) => {
    setCustomHamper((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }));
    royaleLogger.action('Store', `Removed item row from cart: ${itemId}`);
  }, []);

  const increaseItemQuantity = useCallback((itemId: string) => {
    setCustomHamper((prev) => {
      const lastIdx = prev.items.map((i) => i.id).lastIndexOf(itemId);
      if (lastIdx === -1) return prev;
      const next = [...prev.items];
      next.splice(lastIdx + 1, 0, next[lastIdx]);
      return { ...prev, items: next };
    });
  }, []);

  const decreaseItemQuantity = useCallback((itemId: string) => {
    setCustomHamper((prev) => {
      const lastIdx = prev.items.map((i) => i.id).lastIndexOf(itemId);
      if (lastIdx === -1) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== lastIdx) };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCustomHamper((prev) => ({ ...prev, items: [] }));
    setProductCartLines([]);
    royaleLogger.action('Store', 'Cart cleared');
  }, []);

  const attachCardToHamper = useCallback((card: CalligraphyCard) => {
    setCustomHamper((prev) => ({ ...prev, card }));
  }, []);

  const value: ShopStoreValue = {
    language,
    setLanguage,
    customHamper,
    setCustomHamper,
    addItemToHamper,
    removeItemFromHamper,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
    attachCardToHamper,
    isHamperDrawerOpen,
    openHamperDrawer,
    closeHamperDrawer,
    isBookingModalOpen,
    selectedBookingProduct,
    isBulkBooking,
    openBooking,
    closeBooking,
    productCartLines,
    addProductToCart,
    increaseProductLine,
    decreaseProductLine,
    removeProductLine,
    catalogOverrides,
    applyCatalogOverride,
  };

  return <ShopStoreContext.Provider value={value}>{children}</ShopStoreContext.Provider>;
}

export function useShopStore(): ShopStoreValue {
  const ctx = useContext(ShopStoreContext);
  if (!ctx) {
    throw new Error('useShopStore must be used within a ShopStoreProvider');
  }
  return ctx;
}