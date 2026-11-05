import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Gift,
  Sparkles,
  CheckCircle2,
  Send,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Package,
  Layers,
  ChevronLeft,
  ExternalLink,
  Navigation,
  Plus,
  Minus,
  Loader2,
  Trash2,
  Lock,
  Search,
  TicketPercent,
  Scissors,
  BadgeCheck,
  Smartphone,
  Landmark,
  Banknote,
} from 'lucide-react';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct, HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { CustomHamper } from '../types';
import { triggerGrandCelebration, triggerGoldConfetti } from '../utils/confetti';
import { royaleLogger } from '../utils/logger';
import { MapPicker } from './MapPicker';
import { parsePriceString } from '../utils/pricing';
import type { ProductCartLine } from '../store/shop-store';

/** Normalize an Indian mobile number to its 10 digits ("+91 98765 43210" → "9876543210"). */
function normalizeClientPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

interface BookingOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProduct?: HamperQueenProduct | null;
  customHamper?: CustomHamper | null;
  initialBulkMode?: boolean;
  productCartLines?: ProductCartLine[];
  onOrderPlaced?: () => void;
  applyCatalogOverride?: (product: HamperQueenProduct) => HamperQueenProduct;
}

interface CheckoutLine {
  key: string;
  kind: 'product' | 'custom_hamper';
  productId?: string;
  qty: number;
  name: string;
  itemCode?: string;
  priceDisplay: string;
  priceValue: number;
  itemsIncluded?: string[];
  product?: HamperQueenProduct;
}

export const BookingOrderModal: React.FC<BookingOrderModalProps> = ({
  isOpen,
  onClose,
  preSelectedProduct,
  customHamper,
  initialBulkMode = false,
  productCartLines = [],
  onOrderPlaced,
  applyCatalogOverride,
}) => {
  // Staged Checkout Flow:
  // Step 1: Gift Selection, Personalization & Client Contact (No location asked initially)
  // Step 2: Buying & Final Details: Pin on Map + Relevant Info to Confirm Pinned Location + Delivery Anywhere
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Order type: Single gift vs. Bulk / Corporate / Party Gifting
  const [orderType, setOrderType] = useState<'individual' | 'bulk'>(
    initialBulkMode ? 'bulk' : 'individual'
  );
  const [bulkQuantity, setBulkQuantity] = useState<number>(15);

  // Unified cart lines (prebuilt products + custom atelier hamper)
  const [checkoutLines, setCheckoutLines] = useState<CheckoutLine[]>([]);
  const [lineError, setLineError] = useState('');

  // Selected item code for the "add another product" dropdown
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preSelectedProduct ? preSelectedProduct.id : customHamper ? 'custom-atelier' : HAMPER_QUEEN_PRODUCTS[0].id
  );

  // Client Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [altPhone, setAltPhone] = useState('');

  // Delivery Address (Step 2)
  const [streetAddress, setStreetAddress] = useState('');
  const [flatBuilding, setFlatBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('');

  // Payment method & formalities
  const [paymentOption, setPaymentOption] = useState<'upi' | 'bank_transfer' | 'advance_cod'>('upi');
  const [formalitiesAccepted, setFormalitiesAccepted] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  // Interactive Map Pin coordinates (Default: Mumbai coordinates)
  const [geoLat, setGeoLat] = useState<number>(19.0760);
  const [geoLng, setGeoLng] = useState<number>(72.8777);
  const [geoLabel, setGeoLabel] = useState<string | undefined>(undefined);
  const [addressFlash, setAddressFlash] = useState(false);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [step1Error, setStep1Error] = useState('');
  const [step2Error, setStep2Error] = useState('');

  // Build the unified checkout lines whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    const lines: CheckoutLine[] = [];
    const seen = new Set<string>();

    if (preSelectedProduct) {
      const product = applyCatalogOverride ? applyCatalogOverride(preSelectedProduct) : preSelectedProduct;
      lines.push({
        key: `preselect-${product.id}`,
        kind: 'product',
        productId: product.id,
        qty: 1,
        name: product.name,
        itemCode: product.itemCode,
        priceDisplay: product.approxPrice,
        priceValue: parsePriceString(product.approxPrice),
        itemsIncluded: product.itemsIncluded,
        product,
      });
      seen.add(product.id);
    }

    for (const line of productCartLines) {
      if (seen.has(line.productId)) continue;
      const base = HAMPER_QUEEN_PRODUCTS.find((p) => p.id === line.productId);
      if (!base) continue;
      const product = applyCatalogOverride ? applyCatalogOverride(base) : base;
      lines.push({
        key: `product-${product.id}`,
        kind: 'product',
        productId: product.id,
        qty: Math.max(1, line.qty),
        name: product.name,
        itemCode: product.itemCode,
        priceDisplay: product.approxPrice,
        priceValue: parsePriceString(product.approxPrice),
        itemsIncluded: product.itemsIncluded,
        product,
      });
      seen.add(product.id);
    }

    const hamperItems = customHamper?.items ?? [];
    if (!seen.has('custom-atelier') && hamperItems.length > 0) {
      const value = hamperItems.reduce((sum, item) => sum + (item.approximateUnitValue ?? 0), 0);
      lines.push({
        key: 'custom-atelier',
        kind: 'custom_hamper',
        qty: 1,
        name: `Custom Atelier Hamper (${hamperItems.length} items)`,
        priceDisplay: value > 0 ? `INR ${value.toLocaleString('en-IN')}` : 'On request',
        priceValue: value,
        itemsIncluded: hamperItems.map((i) => i.name),
      });
    }

    setCheckoutLines(lines);
    setSelectedProductId(
      preSelectedProduct ? preSelectedProduct.id : lines[0]?.productId ?? HAMPER_QUEEN_PRODUCTS[0].id
    );
  }, [isOpen, preSelectedProduct, productCartLines, customHamper, applyCatalogOverride]);

  const handleAddLine = () => {
    const product = HAMPER_QUEEN_PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product) return;
    const effective = applyCatalogOverride ? applyCatalogOverride(product) : product;
    setCheckoutLines((prev) => {
      const existing = prev.find((l) => l.kind === 'product' && l.productId === effective.id);
      if (existing) {
        return prev.map((l) => (l.key === existing.key ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          key: `product-${effective.id}`,
          kind: 'product',
          productId: effective.id,
          qty: 1,
          name: effective.name,
          itemCode: effective.itemCode,
          priceDisplay: effective.approxPrice,
          priceValue: parsePriceString(effective.approxPrice),
          itemsIncluded: effective.itemsIncluded,
          product: effective,
        },
      ];
    });
  };

  const updateLineQty = (key: string, delta: number) => {
    setCheckoutLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: Math.max(0, l.qty + delta) } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeLine = (key: string) => {
    setCheckoutLines((prev) => prev.filter((l) => l.key !== key));
  };

  // Promo / coupon state (validated via /api/promo/validate; burned at order creation)
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<null | {
    code: string;
    kind: 'flat' | 'percent';
    value: number;
    discount: number;
    eventName?: string;
  }>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'checking' | 'invalid' | 'error'>('idle');
  const [promoError, setPromoError] = useState('');
  const [promoJustApplied, setPromoJustApplied] = useState(false);

  const orderSubtotal = checkoutLines.reduce((sum, l) => sum + l.priceValue * l.qty, 0);
  const orderDeliveryFee = orderSubtotal === 0 ? 0 : orderSubtotal >= 499 ? 0 : 49;
  const orderDiscount = promo?.discount ?? 0;
  const orderOriginalGrandTotal = orderSubtotal + orderDeliveryFee;
  const orderGrandTotal = Math.max(0, orderOriginalGrandTotal - orderDiscount);
  const primaryProduct = checkoutLines.find((l) => l.kind === 'product')?.product;
  const [occasion, setOccasion] = useState('Birthday Celebration');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Evening (4:00 PM - 8:00 PM)');

  // Calligraphy & Keepsake
  const [recipientName, setRecipientName] = useState('');
  const [cardMessage, setCardMessage] = useState(
    'Wishing you a day filled with endless laughter, sweet indulgence, and royal celebrations!'
  );
  const [waxSealDesign, setWaxSealDesign] = useState<'Crown' | 'Rose' | 'Monogram'>('Crown');

  // Add-ons
  const [addonFairyLights, setAddonFairyLights] = useState(true);
  const [addonPartyPopper, setAddonPartyPopper] = useState(false);
  const [addonPolaroids, setAddonPolaroids] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  // Reset step to 1 when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setCheckoutStep(1);
      setIsSubmitted(false);
      setStep1Error('');
      setStep2Error('');
      setOrderError('');
      setConsentGiven(false);
      setPromo(null);
      setPromoInput('');
      setPromoStatus('idle');
      setPromoError('');
      setPromoJustApplied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialBulkMode) {
      setOrderType('bulk');
    }
  }, [initialBulkMode]);

  // Lock page scroll behind the modal and allow Escape to close it
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate bulk discount tier
  const getBulkDiscountInfo = (qty: number) => {
    if (qty >= 100) return { discount: '30% Royal Enterprise Discount', badge: 'Tier 5 - 30% OFF' };
    if (qty >= 50) return { discount: '20% Grand Gala Discount', badge: 'Tier 4 - 20% OFF' };
    if (qty >= 25) return { discount: '15% Celebration Event Discount', badge: 'Tier 3 - 15% OFF' };
    if (qty >= 11) return { discount: '10% Bulk Gifting Discount', badge: 'Tier 2 - 10% OFF' };
    if (qty >= 5) return { discount: '5% Starter Bulk Discount', badge: 'Tier 1 - 5% OFF' };
    return { discount: 'Standard Volume Pricing', badge: 'Bulk Tier' };
  };

  const bulkTier = getBulkDiscountInfo(bulkQuantity);

  // Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = () => {
    if (!fullName.trim()) {
      setStep1Error('Please enter your Full Name to proceed.');
      return;
    }
    if (checkoutLines.length === 0) {
      setStep1Error('Please add at least one item to your order before proceeding.');
      return;
    }
    const phoneDigits = normalizeClientPhone(mobilePhone);
    if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits)) {
      setStep1Error('Please enter a valid 10-digit WhatsApp mobile number (e.g. +91 98765 43210).');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStep1Error('Please enter a valid email address, or leave it blank.');
      return;
    }
    setStep1Error('');
    setCheckoutStep(2);

    // Smooth scroll to top of modal form
    const formEl = document.getElementById('booking-modal-scrollable');
    if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply a coupon via the preview-only validate endpoint (never burns it)
  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError('');
    if (!code) {
      setPromoStatus('invalid');
      setPromoError('Enter a coupon code first.');
      return;
    }
    setPromoStatus('checking');
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: orderSubtotal }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.valid) {
        setPromoStatus('invalid');
        setPromoError(data?.error || 'That coupon is invalid, expired, or already used.');
        return;
      }
      setPromo({
        code: data.code,
        kind: data.kind,
        value: data.value,
        discount: data.discount,
        eventName: data.eventName,
      });
      setPromoInput('');
      setPromoStatus('idle');
      setPromoJustApplied(true);
      triggerGoldConfetti(0.5, 0.62);
      setTimeout(() => setPromoJustApplied(false), 1600);
    } catch {
      setPromoStatus('error');
      setPromoError('Could not check the coupon right now.');
    }
  };

  const handleRemovePromo = () => {
    setPromo(null);
    setPromoInput('');
    setPromoStatus('idle');
    setPromoError('');
  };

  // Step 2 Submission & Validation → save the order to MongoDB via the API
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutLines.length === 0) {
      setStep2Error('Please add at least one item to your order.');
      return;
    }
    if (!flatBuilding.trim() || !streetAddress.trim() || !pincode.trim()) {
      setStep2Error('Please enter your Flat/Building, Street/Area, and Pincode to confirm your pinned delivery location.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setStep2Error('Enter a valid 6-digit pincode for your delivery location.');
      return;
    }
    if (!consentGiven) {
      setStep2Error('Please accept the data-consent checkbox to continue. We only use your details to process and deliver this order.');
      return;
    }

    setStep2Error('');
    setOrderError('');
    setIsSubmitting(true);

    const addons: string[] = [];
    if (addonFairyLights) addons.push('Warm LED Fairy Lights');
    if (addonPartyPopper) addons.push('Celebration Gold Party Popper');
    if (addonPolaroids) addons.push('Custom Polaroid Memory Prints');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          bulkQuantity: orderType === 'bulk' ? bulkQuantity : undefined,
          lines: checkoutLines.map((l) => ({
            kind: l.kind,
            productId: l.productId,
            qty: l.qty,
            name: l.name,
            itemCode: l.itemCode,
            priceDisplay: l.priceDisplay,
            priceValue: l.priceValue,
            itemsIncluded: l.itemsIncluded ?? [],
            notes: l.kind === 'custom_hamper' ? (l.itemsIncluded ?? []).slice(0, 10).join(', ') : undefined,
          })),
          customer: {
            fullName,
            email,
            mobilePhone,
            altPhone,
            recipientName,
          },
          delivery: {
            flatBuilding,
            streetAddress,
            landmark,
            city,
            pincode,
            geo: { lat: geoLat, lng: geoLng, label: geoLabel },
          },
          preferences: {
            occasion,
            deliveryDate,
            timeSlot,
            waxSealDesign,
            cardMessage,
            addons,
            customNotes,
          },
          payment: { method: paymentOption },
          consent: true,
          promoCode: promo?.code,
          browserLanguage: typeof navigator !== 'undefined' ? navigator.language : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.trackingId) {
        if (data.promoError) {
          setPromo(null);
          setPromoInput('');
          setPromoStatus('invalid');
          setStep2Error('That coupon was just redeemed or is no longer available. Remove it and try again, or continue without it.');
        }
        throw new Error(data.error || 'Could not save your order right now.');
      }

      setBookingRef(data.trackingId as string);
      setIsSubmitted(true);
      onOrderPlaced?.();
      triggerGrandCelebration();
      royaleLogger.action('Booking', `Order created: ${data.trackingId} by ${fullName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again or order on WhatsApp.';
      setOrderError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate automated WhatsApp text
  const generateWhatsAppMessage = (refId: string) => {
    const linesList = checkoutLines
      .map((l) => `• ${l.name} (${l.qty} × ${l.priceDisplay})`)
      .join('\n');

    const itemsSummary = checkoutLines
      .slice(0, 3)
      .map((l) => {
        const inside = (l.itemsIncluded ?? []).slice(0, 4).map((i) => `   • ${i}`).join('\n');
        return `• ${l.name}${inside ? `\n${inside}` : ''}`;
      })
      .join('\n');

    const mapLink = `https://maps.google.com/?q=${geoLat},${geoLng}`;
    const trackLink = `${window.location.origin}/track/${refId}`;

    const addOnsList: string[] = [];
    if (addonFairyLights) addOnsList.push('Warm LED Fairy Lights');
    if (addonPartyPopper) addOnsList.push('Celebration Gold Party Popper');
    if (addonPolaroids) addOnsList.push('Custom Polaroid Memory Prints');

    return encodeURIComponent(
      `👑 *HAMPER QUEEN OFFICIAL ORDER CONFIRMATION*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔖 *Tracking ID:* ${refId}\n` +
      `🛒 *Order Contents:*\n${linesList}\n` +
      `🛍️ *Order Type:* ${orderType === 'bulk' ? `BULK ORDER (${bulkQuantity} Hampers - ${bulkTier.discount})` : 'Individual Gift Hamper'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client Name:* ${fullName || 'Valued Guest'}\n` +
      `📞 *Mobile:* ${mobilePhone || 'Not provided'}\n` +
      `✉️ *Email:* ${email || 'Not provided'}\n` +
      (altPhone ? `📱 *Alt Phone:* ${altPhone}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *CONFIRMED PINNED DELIVERY LOCATION*\n` +
      `🏠 *Flat/Building:* ${flatBuilding || 'N/A'}\n` +
      `🛣️ *Street/Area:* ${streetAddress || 'N/A'}\n` +
      `🏙️ *Landmark & City:* ${landmark ? landmark + ', ' : ''}${city} - ${pincode || 'N/A'}\n` +
      `🗺️ *Exact GPS Pin Link:* ${mapLink}\n` +
      `🚚 *Delivery Reach:* Nationwide Doorstep Dispatch\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎉 *Occasion:* ${occasion}\n` +
      `📅 *Delivery Date:* ${deliveryDate}\n` +
      `⏰ *Time Slot:* ${timeSlot}\n` +
      (recipientName ? `💝 *Recipient:* ${recipientName}\n` : '') +
      `💌 *Personalized Note:* "${cardMessage}"\n` +
      `🏷️ *Wax Seal:* ${waxSealDesign} Seal Stamp\n` +
      (addOnsList.length > 0 ? `✨ *Add-ons:* ${addOnsList.join(', ')}\n` : '') +
      (customNotes ? `📝 *Special Requests/Substitutions:* ${customNotes}\n` : '') +
      `💳 *Payment Preference:* ${paymentOption.toUpperCase()}\n` +
      (promo && promo.discount > 0 ? `🎟️ *Coupon Applied:* ${promo.code} (−INR ${promo.discount.toLocaleString('en-IN')})\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *WHAT IS PRESENT (INCLUDED ITEMS):*\n` +
      `${itemsSummary || linesList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💳 *Payment:* Payment details will be shared on WhatsApp shortly to confirm this order.\n` +
      `🔍 *Track your order:* ${trackLink}\n\n` +
      `Please confirm availability, final customized invoice, and dispatch schedule.`
    );
  };

  const handleLaunchWhatsApp = () => {
    const text = generateWhatsAppMessage(bookingRef);
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank');
  };

  const handleCopySummary = () => {
    const text = decodeURIComponent(generateWhatsAppMessage(bookingRef));
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 animate-fade-in"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Hamper Queen concierge booking"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] ring-1 ring-line shadow-float overflow-hidden my-4 animate-fade-up">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-gold-50 via-white to-blush-50 px-5 sm:px-8 py-5 flex items-center justify-between gap-4 border-b border-line">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-soft ring-1 ring-gold-200 flex items-center justify-center text-gold-700 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-seasons text-lg sm:text-xl font-bold text-ink leading-tight truncate">
                Concierge booking
              </h3>
              <p className="text-xs text-stone truncate">
                Homegrown by Ms. Supriya Khandekar · handcrafted delivery to any corner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking"
            className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-full text-cocoa hover:text-ink hover:bg-white hover:shadow-soft transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress */}
        {!isSubmitted && (
          <div className="px-5 sm:px-8 pt-4 pb-3 bg-white border-b border-line">
            <ol className="flex items-center gap-3 text-xs sm:text-sm">
              <li className={`flex items-center gap-2 font-semibold ${checkoutStep === 1 ? 'text-ink' : 'text-emerald-700'}`}>
                <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs transition-colors duration-300 ${checkoutStep === 1 ? 'bg-ink text-gold-100 shadow-soft' : 'bg-emerald-600 text-white'}`}>
                  {checkoutStep === 1 ? '1' : <Check className="w-3.5 h-3.5" />}
                </span>
                <span>Gift details</span>
              </li>
              <span className="relative flex-1 h-1 rounded-full bg-cream-200 overflow-hidden" aria-hidden="true">
                <span className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 transition-[width] duration-500 ease-[var(--ease-soft)] ${checkoutStep === 1 ? 'w-1/2' : 'w-full'}`} />
              </span>
              <li className={`flex items-center gap-2 font-semibold ${checkoutStep === 2 ? 'text-ink' : 'text-stone'}`}>
                <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs transition-colors duration-300 ${checkoutStep === 2 ? 'bg-ink text-gold-100 shadow-soft' : 'bg-cream-200 text-stone'}`}>2</span>
                <span>Delivery &amp; payment</span>
              </li>
            </ol>
          </div>
        )}

        {/* Modal Body */}
        {!isSubmitted ? (
          <div id="booking-modal-scrollable" className="p-5 sm:p-8 max-h-[72dvh] overflow-y-auto bg-cream-50">
            
            {/* =========================================================================
                STEP 1: GIFT SELECTION & PERSONALIZATION (DO NOT ASK LOCATION HERE)
                ========================================================================= */}
            {checkoutStep === 1 && (
              <div key="step-1" className="space-y-8 animate-fade-up">
                
                {/* Error Banner if Step 1 validation failed */}
                {step1Error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{step1Error}</span>
                  </div>
                )}

                {/* 1. ORDER TYPE SELECTOR: INDIVIDUAL VS. BULK & PARTY GIFTS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                      <Package className="w-4 h-4 text-gold-700" />
                      <span>1. Select Order Type & Scale</span>
                    </label>
                    <span className="text-xs text-gold-700 font-semibold">
                      {orderType === 'bulk' ? '✨ Bulk Corporate & Party Gifting Tier' : '✨ Single Custom Gift'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Individual Option */}
                    <div
                      onClick={() => setOrderType('individual')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        orderType === 'individual'
                          ? 'bg-white border-gold-200 shadow-soft'
                          : 'bg-cream-100 border-transparent hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-sm font-bold text-ink">
                          Individual Gift Hamper
                        </span>
                        <span className="text-xs font-semibold text-gold-700">Qty: 1</span>
                      </div>
                      <p className="font-cormorant text-xs text-stone mt-1">
                        For personal birthdays, anniversaries, romantic gestures, and one-of-a-kind celebrations.
                      </p>
                    </div>

                    {/* Bulk Orders & Party Gifts Option */}
                    <div
                      onClick={() => setOrderType('bulk')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                        orderType === 'bulk'
                          ? 'bg-white border-gold-200 shadow-soft ring-2 ring-gold-400/30'
                          : 'bg-cream-100 border-transparent hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-sm font-bold text-ink flex items-center gap-1.5">
                          <span>Bulk & Party Gifts</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-bold">
                            Special Rates
                          </span>
                        </span>
                      </div>
                      <p className="font-cormorant text-xs text-stone mt-1">
                        Weddings, baby shower return gifts, corporate employee recognition, and grand celebrations.
                      </p>
                    </div>
                  </div>

                  {/* Bulk Quantity Slider and Discount Tier */}
                  {orderType === 'bulk' && (
                    <div className="p-4 rounded-2xl bg-white border border-gold-200 shadow-soft space-y-3 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-ink">Bulk Quantity Needed:</span>
                        <span className="font-cinzel font-bold text-base text-gold-700">
                          {bulkQuantity} Hampers
                        </span>
                      </div>

                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={bulkQuantity}
                        onChange={(e) => setBulkQuantity(parseInt(e.target.value))}
                        className="w-full accent-gold-600 cursor-pointer"
                      />

                      <div className="flex items-center justify-between text-xs text-stone">
                        <span>5 units</span>
                        <span className="font-semibold text-emerald-700">{bulkTier.discount}</span>
                        <span>200+ units</span>
                      </div>

                      <div className="p-3 rounded-xl bg-cream-100 border border-line text-xs text-cocoa flex items-center justify-between">
                        <span>Applicable Benefit:</span>
                        <span className="font-bold text-ink">{bulkTier.badge} + Complimentary Custom Branding Tags</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CART ITEMS & WHAT IS INCLUDED */}
                <div className="space-y-3">
                  <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gold-700" />
                    <span>2. Your Cart Items & Quantities</span>
                  </label>

                  {lineError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      {lineError}
                    </div>
                  )}

                  {checkoutLines.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-cream-100 border border-dashed border-gold-500 text-center text-xs text-stone">
                      Your cart is empty. Add a hamper or custom items below to continue.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {checkoutLines.map((line) => (
                        <div key={line.key} className="bg-white p-4 rounded-2xl border border-gold-400/50 shadow-soft">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-gold-700 shrink-0" />
                                <h5 className="font-sans text-xs font-bold text-ink truncate">{line.name}</h5>
                              </div>
                              <p className="text-xs text-gold-700 font-semibold mt-0.5">
                                {line.itemCode ?? (line.kind === 'custom_hamper' ? '#HQ-ATELIER-CUSTOM' : line.productId)}
                                {' • '}{line.priceDisplay} each
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(line.key)}
                              className="p-1.5 text-crimson hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateLineQty(line.key, -1)}
                                className="w-7 h-7 rounded-full bg-cream-200 hover:bg-line-strong text-cocoa flex items-center justify-center transition-colors cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-bold text-ink w-5 text-center">{line.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateLineQty(line.key, 1)}
                                className="w-7 h-7 rounded-full bg-ink hover:bg-ink-soft text-gold-100 flex items-center justify-center transition-colors cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs font-sans font-bold text-ink">
                              {line.priceValue > 0 ? `INR ${(line.priceValue * line.qty).toLocaleString('en-IN')}` : 'Value on request'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add another product */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-white border border-gold-400/70 text-xs font-semibold text-ink focus:outline-hidden focus:border-gold-300 shadow-soft cursor-pointer"
                    >
                      <optgroup label="12 Customizable Birthday Hampers">
                        {HAMPER_QUEEN_PRODUCTS.filter((p) => p.category === 'birthday_hampers').map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.itemCode || '#HQ-HMP'} - {prod.name} ({prod.approxPrice})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Signature Bouquets">
                        {HAMPER_QUEEN_PRODUCTS.filter((p) => p.category === 'bouquets').map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.itemCode || '#HQ-BKT'} - {prod.name} ({prod.approxPrice})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Specialty Gift Boxes & Trays">
                        {HAMPER_QUEEN_PRODUCTS.filter(
                          (p) => p.category === 'specialty_boxes' || p.category === 'gourmet_trays'
                        ).map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.itemCode || '#HQ-BOX'} - {prod.name} ({prod.approxPrice})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Snack & Choco, Mugs, Accessories & Clothing">
                        {HAMPER_QUEEN_PRODUCTS.filter(
                          (p) =>
                            p.category === 'addons_retail' ||
                            p.category === 'mugs_cups' ||
                            p.category === 'accessories' ||
                            p.category === 'clothing'
                        ).map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.itemCode || '#HQ-ADD'} - {prod.name} ({prod.approxPrice})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="btn btn-primary shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone">
                    Items in your cart are saved to your real Hamper Queen order. Adjust quantities before proceeding — after checkout the cart clears automatically.
                  </p>

                  {/* Coupon apply */}
                  <div className="p-4 rounded-2xl bg-cream-50 border border-dashed border-gold-400/60 shadow-soft">
                    <div className="flex items-center gap-2 mb-2">
                      <TicketPercent className="w-4 h-4 text-gold-700" />
                      <span className="text-xs font-sans font-semibold text-ink">
                        Have a Coupon?
                      </span>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {promo ? (
                        <motion.div
                          key={promo.code}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.6, x: 24 }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <AnimatePresence>
                            {promoJustApplied && (
                              <motion.div
                                initial={{ opacity: 1, scale: 0.35 }}
                                animate={{ opacity: 0, scale: 2.4 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.3, ease: 'easeOut' }}
                                className="pointer-events-none absolute inset-0 z-10 rounded-xl border-4 border-dashed border-gold-300 bg-white/70 flex items-center justify-center"
                              >
                                <span className="font-sans text-sm font-bold text-gold-700 -rotate-6">
                                  CUT &middot; APPLIED
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, scale: 1.7, y: -8, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-ink to-ink-soft border border-gold-400/70 shadow-soft"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Scissors className="w-4 h-4 text-gold-300 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-mono text-sm font-bold text-gold-100 truncate">
                                  {promo.code}
                                </p>
                                <p className="text-xs text-white/70 truncate">
                                  {promo.eventName ? `${promo.eventName} · ` : ''}
                                  {promo.kind === 'percent' ? `${promo.value}% off` : `INR ${promo.value} off`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-emerald-300">
                                −INR {promo.discount.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={handleRemovePromo}
                                aria-label="Remove coupon"
                                className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div key="promo-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                          <input
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase().slice(0, 16))}
                            placeholder="FIRSTHAMPER"
                            maxLength={16}
                            className="flex-1 rounded-xl bg-white border border-line px-3 py-3 text-xs font-semibold text-ink placeholder-mist focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-200"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            disabled={promoStatus === 'checking'}
                            className="px-4 py-3 rounded-full bg-ink hover:bg-ink-soft disabled:opacity-50 disabled:cursor-not-allowed text-gold-100 text-xs font-sans font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {promoStatus === 'checking' ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Check
                              </>
                            ) : (
                              <>Apply</>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {promoStatus === 'checking' && (
                      <p className="text-xs text-gold-700 mt-2 flex items-center gap-1 font-semibold">
                        Verifying coupon against live inventory…
                      </p>
                    )}
                    {promoError && (
                      <p className="text-xs text-[#B3261E] mt-2 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                      </p>
                    )}
                  </div>

                  {/* Order totals preview */}
                  {checkoutLines.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-line shadow-soft space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-cocoa">
                        <span>Items Subtotal</span>
                        <strong className="text-ink">{orderSubtotal > 0 ? `INR ${orderSubtotal.toLocaleString('en-IN')}` : 'On request'}</strong>
                      </div>
                      <div className="flex items-center justify-between text-cocoa">
                        <span>Delivery Fee</span>
                        <strong className={orderDeliveryFee === 0 ? 'text-emerald-800' : 'text-ink'}>
                          {orderDeliveryFee === 0 ? 'FREE' : `INR ${orderDeliveryFee}`}
                        </strong>
                      </div>
                      <AnimatePresence mode="popLayout">
                        {orderDiscount > 0 && (
                          <motion.div
                            key="discount-row"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="flex items-center justify-between text-emerald-800"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <BadgeCheck className="w-3.5 h-3.5" /> Coupon {promo?.code}
                            </span>
                            <strong>−INR {orderDiscount.toLocaleString('en-IN')}</strong>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center justify-between pt-1.5 border-t border-line text-sm">
                        <span className="font-semibold">Grand Total (approx)</span>
                        <div className="text-right">
                          {orderDiscount > 0 && (
                            <span className="block text-xs text-mist line-through">
                              {orderOriginalGrandTotal > 0 ? `INR ${orderOriginalGrandTotal.toLocaleString('en-IN')}` : ''}
                            </span>
                          )}
                          <AnimatePresence mode="popLayout">
                            <motion.strong
                              key={orderGrandTotal}
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                              className="block font-cinzel text-gold-700"
                            >
                              {orderGrandTotal > 0 ? `INR ${orderGrandTotal.toLocaleString('en-IN')}` : 'On request'}
                            </motion.strong>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* What is Present (Included items preview) */}
                  {primaryProduct && (
                    <div className="p-4 rounded-2xl bg-white border border-line shadow-soft space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-ink">
                          What is Present in {primaryProduct.name}:
                        </span>
                        <span className="font-bold text-gold-700">{primaryProduct.approxPrice}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {(primaryProduct.itemsIncluded ?? []).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-cocoa">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. OCCASION & DELIVERY TIMING */}
                <div className="space-y-4">
                  <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-700" />
                    <span>3. Occasion & Desired Delivery Schedule</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Celebration Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      >
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Wedding Trousseau & Bridal">Wedding Trousseau & Bridal</option>
                        <option value="Romantic Anniversary">Romantic Anniversary</option>
                        <option value="Baby Shower / Welcome Baby">Baby Shower / Welcome Baby</option>
                        <option value="Corporate / Employee Milestone">Corporate / Employee Milestone</option>
                        <option value="Farewell / Appreciation">Farewell / Appreciation</option>
                        <option value="Festival (Diwali / Eid / New Year)">Festival (Diwali / Eid / New Year)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Desired Delivery Date
                      </label>
                      <input
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                        <option value="Midnight Surprise (11:30 PM - 12:15 AM)">Midnight Surprise (11:30 PM - 12:15 AM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. RECIPIENT & PERSONALIZATION DETAILS */}
                <div className="space-y-4">
                  <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-700" />
                    <span>4. Keepsake Personalization & Add-ons</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Recipient's Name (To write on Hamper Tag)
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. For Dearest Riya"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Royal Wax Seal Stamp Design
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Crown', 'Rose', 'Monogram'] as const).map((seal) => (
                          <button
                            type="button"
                            key={seal}
                            onClick={() => setWaxSealDesign(seal)}
                            className={`py-2 px-2 rounded-xl text-xs font-sans font-semibold border transition-all cursor-pointer ${
                              waxSealDesign === seal
                                ? 'bg-ink text-gold-100 border-gold-200'
                                : 'bg-white text-cocoa border-line'
                            }`}
                          >
                            {seal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">
                      Handwritten Calligraphy Card Message
                    </label>
                    <textarea
                      rows={2}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      placeholder="Enter message to be handwritten in gold ink on deckle-edge card..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                    />
                  </div>

                  {/* Add-ons Checklist */}
                  <div className="p-4 rounded-2xl bg-white border border-line space-y-3">
                    <span className="text-xs font-sans font-semibold text-ink block">
                      Celebration Add-ons:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="flex items-center gap-2 text-xs text-cocoa cursor-pointer p-2 rounded-lg hover:bg-cream-100">
                        <input
                          type="checkbox"
                          checked={addonFairyLights}
                          onChange={(e) => setAddonFairyLights(e.target.checked)}
                          className="accent-gold-600"
                        />
                        <span>Warm Fairy Lights (+INR 99)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-cocoa cursor-pointer p-2 rounded-lg hover:bg-cream-100">
                        <input
                          type="checkbox"
                          checked={addonPartyPopper}
                          onChange={(e) => setAddonPartyPopper(e.target.checked)}
                          className="accent-gold-600"
                        />
                        <span>Gold Party Popper (+INR 99)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-cocoa cursor-pointer p-2 rounded-lg hover:bg-cream-100">
                        <input
                          type="checkbox"
                          checked={addonPolaroids}
                          onChange={(e) => setAddonPolaroids(e.target.checked)}
                          className="accent-gold-600"
                        />
                        <span>Custom Polaroid Prints (+INR 149)</span>
                      </label>
                    </div>
                  </div>

                  {/* Special Instructions / Substitutions */}
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">
                      Customization & Substitutions Instructions
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. 100% Eggless chocolates only, swap ribbon color for emerald green"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                    />
                  </div>
                </div>

                {/* 5. CLIENT CONTACT INFORMATION */}
                <div className="space-y-3">
                  <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-700" />
                    <span>5. Your Contact Information</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. ananya@example.com"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Mobile Contact (WhatsApp enabled) *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
                        <input
                          type="tel"
                          required
                          value={mobilePhone}
                          onChange={(e) => setMobilePhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Alternate Contact (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
                        <input
                          type="tel"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                          placeholder="Secondary contact number"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1 Bottom Action Bar */}
                <div className="pt-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-stone">
                    <span>Questions? Reach Ms. Supriya directly: </span>
                    <strong className="text-ink">+91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</strong>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-ghost w-full sm:w-auto"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="btn btn-primary w-full sm:w-auto"
                    >
                      <span>Continue to delivery &amp; payment</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================================================
                STEP 2: FINAL BUYING DETAILS & PINPOINT DELIVERY TO ANY CORNER
                ========================================================================= */}
            {checkoutStep === 2 && (
              <form key="step-2" onSubmit={handleFinalSubmit} className="space-y-8 animate-fade-up">
                
                {/* Error Banner if Step 2 validation failed */}
                {step2Error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{step2Error}</span>
                  </div>
                )}

                {/* Server / network error banner */}
                {orderError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Order Recap Banner */}
                <div className="p-4 rounded-2xl bg-white border border-gold-200 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-gold-700" />
                    <div>
                      <span className="text-xs text-gold-700 font-semibold block">Booking For:</span>
                      <strong className="text-ink font-cinzel">
                        {checkoutLines.length > 0
                          ? checkoutLines.map((l) => `${l.name} × ${l.qty}`).join(' + ')
                          : 'Custom Hamper'}
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-cocoa">
                    <div>
                      <span className="text-xs text-gold-700 font-semibold block">Delivery:</span>
                      <span>{deliveryDate} ({timeSlot.split(' ')[0]})</span>
                    </div>
                    <div>
                      <span className="text-xs text-gold-700 font-semibold block">Client:</span>
                      <span>{fullName}</span>
                    </div>
                  </div>
                </div>

                {/* HIGH-IMPACT DELIVERY TO ANY CORNER GUARANTEE BANNER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-50 to-blush-50 ring-1 ring-gold-200 shadow-soft flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-soft ring-1 ring-gold-200 flex items-center justify-center text-gold-700 shrink-0 mt-0.5 sm:mt-0">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-ink flex items-center gap-2">
                      <span>Delivering to Every Corner & Doorstep</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-semibold">
                        Nationwide Reach
                      </span>
                    </h4>
                    <p className="text-xs sm:text-xs text-cocoa font-sans leading-relaxed">
                      From local Mumbai gullies, residential societies, and coastal suburbs to high-rise corporate towers across India — we deliver to any corner. Pin your spot below and confirm relevant address details!
                    </p>
                  </div>
                </div>

                {/* PART 1: MAPS-BASED PIN-POINTING (NOW ONLY ASKED AT FINAL STAGE) */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold-700" />
                        <span>1. Pinpoint Exact Delivery Spot on Live Map</span>
                      </label>
                      <p className="text-xs text-stone mt-0.5">
                        Move the map so the pin sits on your door, search your address, or tap the locate button.
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#16A34A]/10 text-emerald-800 font-semibold self-start sm:self-auto">
                      Live Interactive Map
                    </span>
                  </div>

                  <MapPicker
                    lat={geoLat}
                    lng={geoLng}
                    label={geoLabel}
                    onLocationChange={(lat, lng, label) => {
                      setGeoLat(lat);
                      setGeoLng(lng);
                      setGeoLabel(label);
                    }}
                    onAddressResolved={(a) => {
                      if (a.street) setStreetAddress(a.street);
                      if (a.city) setCity(a.city);
                      if (a.pincode) setPincode(a.pincode);
                      setFlatBuilding((cur) => cur || a.flatBuilding);
                      setLandmark((cur) => cur || a.landmark);
                      setAddressFlash(true);
                      window.setTimeout(() => setAddressFlash(false), 2200);
                      window.setTimeout(() => document.getElementById('booking-address-fields')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
                    }}
                  />
                </div>

                {/* PART 2: RELEVANT INFO TO CONFIRM PINNED LOCATION IS 100% ACCURATE */}
                <div id="booking-address-fields" className={`space-y-3 rounded-3xl p-4 -m-4 transition-all duration-700 ${addressFlash ? 'bg-gold-50 ring-2 ring-gold-300' : 'ring-0 ring-transparent'}`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-semibold text-ink flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold-700" />
                      <span>2. Relevant Info to Confirm Pinned Location</span>
                    </label>
                    <span className="text-xs text-gold-700 font-semibold">
                      Doorstep Courier Verification
                    </span>
                  </div>
                  <p className="text-xs text-stone">
                    Please provide your building, flat, and landmark so our dispatch rider can pinpoint your exact doorstep without hesitation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Flat / House No., Floor & Building / Society Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={flatBuilding}
                        onChange={(e) => setFlatBuilding(e.target.value)}
                        placeholder="e.g. Flat 602, B-Wing, Royal Palms Heights"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Postal Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 400050"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Street, Colony / Area & Prominent Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. Linking Road, Opposite National College / Metro Pillar 42"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai / Navi Mumbai / Pune / Delhi"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-cocoa mb-1">
                        Special Landmark or Gate Entry Details (To double-confirm pin)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Enter from Gate 2, inform security it is a birthday surprise for Riya"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-line text-xs focus:outline-hidden focus:border-gold-300"
                      />
                    </div>
                  </div>
                </div>

                {/* PART 3: PAYMENT FORMALITIES & POLICIES */}
                <div className="p-4 rounded-2xl bg-gold-50 border border-line-strong space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-semibold text-gold-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-gold-700" />
                      <span>3. Payment Formalities & Hamper Queen Guarantee</span>
                    </span>
                    <span className="text-xs text-gold-700 font-semibold">Custom Craft Policy</span>
                  </div>

                  <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { id: 'upi', title: 'UPI', sub: 'GPay · PhonePe · Paytm', Icon: Smartphone },
                      { id: 'bank_transfer', title: 'Bank transfer', sub: 'IMPS / NEFT', Icon: Landmark },
                      { id: 'advance_cod', title: '50% advance', sub: 'Balance on delivery', Icon: Banknote },
                    ] as const).map(({ id, title, sub, Icon }) => {
                      const selected = paymentOption === id;
                      return (
                        <button
                          type="button"
                          key={id}
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPaymentOption(id)}
                          className={`relative text-left p-4 rounded-2xl transition-all duration-250 ${
                            selected
                              ? 'bg-gold-50 shadow-lift ring-2 ring-gold-600'
                              : 'bg-white shadow-soft ring-1 ring-line-strong hover:ring-gold-300 hover:-translate-y-0.5'
                          }`}
                        >
                          <span className={`w-9 h-9 rounded-xl inline-flex items-center justify-center mb-3 transition-colors ${selected ? 'bg-gold-700 text-white' : 'bg-cream-100 text-gold-700'}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="block text-sm font-semibold text-ink">{title}</span>
                          <span className="block text-xs text-stone mt-0.5">{sub}</span>
                          <span className={`absolute top-3 right-3 w-5 h-5 rounded-full inline-flex items-center justify-center transition-all duration-250 ${selected ? 'bg-gold-700 text-white scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                            <Check className="w-3 h-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <label className="flex items-start gap-2 text-xs text-cocoa cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={formalitiesAccepted}
                      onChange={(e) => setFormalitiesAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 shrink-0 accent-gold-600"
                    />
                    <span>
                      I understand Hamper Queen makes custom hampers with fresh stock. Rates vary as per exact customization and chocolate counts (approx INR 140 to INR 899). Formal invoice will be verified directly on WhatsApp with Ms. Supriya.
                    </span>
                  </label>

                  {/* Privacy & Data Consent (required) */}
                  <label className="flex items-start gap-2 text-xs text-cocoa cursor-pointer pt-1 border-t border-line-strong">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 w-4 h-4 shrink-0 accent-gold-600"
                    />
                    <span className="leading-relaxed">
                      I consent to Hamper Queen storing my order details, delivery address, GPS pin, and device/connection info (server-detected region) solely to process, fulfil, and deliver this order and to contact me on WhatsApp/phone. I will receive a payment receipt and tracking ID for this order.
                    </span>
                  </label>

                  {/* No live payment gateway notice */}
                  <div className="p-3 rounded-xl bg-white border border-gold-400/60 text-xs text-cocoa flex items-start gap-2">
                    <Lock className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                    <span>
                      Secure ordering — your custom invoice and payment details will be shared by Hamper Queen on WhatsApp shortly after you confirm. No payment is collected on this website yet.
                    </span>
                  </div>
                </div>

                {/* Step 2 Bottom Action Bar */}
                <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutStep(1);
                      const formEl = document.getElementById('booking-modal-scrollable');
                      if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-xs text-gold-700 hover:underline cursor-pointer order-2 sm:order-1 font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Gift Details</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-ghost w-full sm:w-auto"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full sm:w-auto"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>{isSubmitting ? 'Saving Your Order...' : 'Confirm Order & Get Tracking ID →'}</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        ) : (
          /* =========================================================================
             CONFIRMED BOOKING STATE WITH PRINTABLE RECEIPT & WHATSAPP TRIGGER
             ========================================================================= */
          <div className="p-6 sm:p-10 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 ring-2 ring-emerald-500 text-emerald-600 mx-auto flex items-center justify-center animate-pop-in">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-sans font-semibold text-gold-700">
                Order Successfully Placed
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-ink">
                Your Tracking ID is Ready!
              </h3>
              <p className="text-xs text-stone max-w-md mx-auto">
                Your order <strong className="text-ink">{bookingRef}</strong> is saved. Share this code with your recipient to track delivery. Payment details + formal invoice will be shared on WhatsApp shortly.
              </p>
            </div>

            {/* Official Order Summary Card */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white border border-gold-400/50 shadow-soft text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-sans font-bold text-sm text-ink">
                  Tracking ID: {bookingRef}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-gold-50 text-gold-700 font-bold text-xs border border-gold-400/40">
                  Awaiting Payment
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-cocoa">
                <div>
                  <span className="block text-xs text-gold-700 font-semibold">Client:</span>
                  <strong className="text-ink">{fullName}</strong> ({mobilePhone})
                </div>
                <div>
                  <span className="block text-xs text-gold-700 font-semibold">Delivery Date:</span>
                  <strong className="text-ink">{deliveryDate}</strong> ({timeSlot})
                </div>
                <div>
                  <span className="block text-xs text-gold-700 font-semibold">Order Contents:</span>
                  <strong className="text-ink">
                    {checkoutLines.length > 0 ? checkoutLines.map((l) => `${l.name} × ${l.qty}`).join(', ') : 'Custom Hamper'}
                  </strong>
                </div>
                <div>
                  <span className="block text-xs text-gold-700 font-semibold">Map Pin Location:</span>
                  <a
                    href={`https://maps.google.com/?q=${geoLat},${geoLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-700 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Lat: {geoLat}, Lng: {geoLng}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-line text-xs text-stone">
                <span>Confirmed Delivery Address: </span>
                <strong className="text-ink">
                  {flatBuilding}, {streetAddress}{landmark ? `, Near ${landmark}` : ''}, {city} - {pincode}
                </strong>
              </div>

              {promo && promo.discount > 0 && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  <span className="font-bold">Coupon {promo.code} applied: </span>
                  You saved INR {promo.discount.toLocaleString('en-IN')} on this order. Your final total was adjusted accordingly.
                </div>
              )}

              <div className="pt-2 border-t border-line rounded-xl bg-gold-50 p-3 text-xs text-cocoa">
                <span className="font-bold text-gold-700">Payment Pending: </span>
                We'll share the payment receipt and final invoice on WhatsApp. Your order is confirmed the moment payment clears.
              </div>
            </div>

            {/* Actions: Track + WhatsApp + Copy + Print */}
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/track/${bookingRef}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-full bg-ink hover:bg-ink-soft text-gold-100 font-sans font-semibold text-xs shadow-lift hover:shadow-lift transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Track This Order Live</span>
              </a>

              <button
                onClick={handleLaunchWhatsApp}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white font-sans font-semibold text-xs shadow-lift hover:shadow-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Confirm on WhatsApp</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full sm:w-auto p-4 rounded-full bg-white border border-gold-200 text-cocoa hover:text-ink shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                title="Copy Summary"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-gold-700" />}
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto p-4 rounded-full bg-white border border-line text-cocoa hover:text-ink shadow-soft cursor-pointer"
                title="Print Order Slip"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setCheckoutStep(1);
                onClose();
              }}
              className="text-xs text-gold-700 hover:underline cursor-pointer block mx-auto pt-2"
            >
              Close & Return to Catalog
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
