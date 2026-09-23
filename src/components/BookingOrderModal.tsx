import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Compass,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
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
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct, HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { CustomHamper } from '../types';
import { triggerGrandCelebration, triggerGoldConfetti } from '../utils/confetti';
import { royaleLogger } from '../utils/logger';

interface BookingOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProduct?: HamperQueenProduct | null;
  customHamper?: CustomHamper | null;
  initialBulkMode?: boolean;
}

export const BookingOrderModal: React.FC<BookingOrderModalProps> = ({
  isOpen,
  onClose,
  preSelectedProduct,
  customHamper,
  initialBulkMode = false,
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

  // Selected item code
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preSelectedProduct ? preSelectedProduct.id : customHamper ? 'custom-atelier' : HAMPER_QUEEN_PRODUCTS[0].id
  );

  // Client Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [altPhone, setAltPhone] = useState('');

  // Geolocation & Delivery Address (Step 2)
  const [streetAddress, setStreetAddress] = useState('');
  const [flatBuilding, setFlatBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('');
  
  // Interactive Map Pin coordinates (Default: Mumbai coordinates)
  const [geoLat, setGeoLat] = useState<number>(19.0760);
  const [geoLng, setGeoLng] = useState<number>(72.8777);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Click pin or "Detect Location" to pin-point');

  // Occasion & Timing
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

  // Payment method & formalities
  const [paymentOption, setPaymentOption] = useState<'upi' | 'bank_transfer' | 'advance_cod'>('upi');
  const [formalitiesAccepted, setFormalitiesAccepted] = useState(true);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [step1Error, setStep1Error] = useState('');
  const [step2Error, setStep2Error] = useState('');

  // Reset step to 1 when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setCheckoutStep(1);
      setIsSubmitted(false);
      setStep1Error('');
      setStep2Error('');
    }
  }, [isOpen]);

  // Sync state when preSelectedProduct changes
  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProductId(preSelectedProduct.id);
    }
  }, [preSelectedProduct]);

  useEffect(() => {
    if (initialBulkMode) {
      setOrderType('bulk');
    }
  }, [initialBulkMode]);

  if (!isOpen) return null;

  // Find active product
  const activeProduct = HAMPER_QUEEN_PRODUCTS.find((p) => p.id === selectedProductId);

  // Calculate bulk discount tier
  const getBulkDiscountInfo = (qty: number) => {
    if (qty >= 100) return { discount: '20% Royal Enterprise Discount', badge: 'Tier 4 - 20% OFF' };
    if (qty >= 50) return { discount: '15% Gala Party Discount', badge: 'Tier 3 - 15% OFF' };
    if (qty >= 25) return { discount: '10% Celebration Event Discount', badge: 'Tier 2 - 10% OFF' };
    if (qty >= 10) return { discount: '5% Bulk Gifting Discount', badge: 'Tier 1 - 5% OFF' };
    return { discount: 'Standard Volume Pricing', badge: 'Bulk Tier' };
  };

  const bulkTier = getBulkDiscountInfo(bulkQuantity);

  // HTML5 Geolocation detect
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by this browser. Please click on the pin map.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Pinpointing your exact GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setGeoLat(lat);
        setGeoLng(lng);
        setIsLocating(false);
        setLocationStatus(`📍 GPS Pin Locked: ${lat}, ${lng} (Accuracy: ~${Math.round(pos.coords.accuracy)}m)`);
        triggerGoldConfetti(0.5, 0.4);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('Location access denied or unavailable. Please click directly on the pin map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Click on interactive map canvas to reposition pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Map Mumbai bounding box range
    const newLat = parseFloat((19.30 - y * 0.40).toFixed(4));
    const newLng = parseFloat((72.75 + x * 0.35).toFixed(4));

    setGeoLat(newLat);
    setGeoLng(newLng);
    setLocationStatus(`📍 Pin Positioned: ${newLat}, ${newLng}`);
    triggerGoldConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
  };

  // Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = () => {
    if (!fullName.trim() || !mobilePhone.trim()) {
      setStep1Error('Please enter your Full Name and WhatsApp Mobile Number to proceed.');
      return;
    }
    setStep1Error('');
    setCheckoutStep(2);
    triggerGoldConfetti(0.5, 0.4);

    // Smooth scroll to top of modal form
    const formEl = document.getElementById('booking-modal-scrollable');
    if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Submission & Validation
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!flatBuilding.trim() || !streetAddress.trim() || !pincode.trim()) {
      setStep2Error('Please enter your Flat/Building, Street/Area, and Pincode to confirm your pinned delivery location.');
      return;
    }

    setStep2Error('');
    const ref = `HQ-BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsSubmitted(true);
    triggerGrandCelebration();
    royaleLogger.action('Booking', `Submitted booking: ${ref} by ${fullName}`);
  };

  // Generate automated WhatsApp text
  const generateWhatsAppMessage = (refId: string) => {
    const productName =
      selectedProductId === 'custom-atelier'
        ? `Custom Hamper (${customHamper?.items.length || 0} items)`
        : activeProduct?.name || 'Hamper Queen Gift';

    const itemCode =
      selectedProductId === 'custom-atelier'
        ? '#HQ-ATELIER-CUSTOM'
        : activeProduct?.itemCode || `#HQ-PROD-${selectedProductId.slice(0, 6).toUpperCase()}`;

    const itemsSummary =
      selectedProductId === 'custom-atelier'
        ? customHamper?.items.map((i) => `• ${i.name}`).join('\n') || 'Custom handpicked items'
        : activeProduct?.itemsIncluded.slice(0, 5).map((i) => `• ${i}`).join('\n') || '';

    const mapLink = `https://maps.google.com/?q=${geoLat},${geoLng}`;

    const addOnsList: string[] = [];
    if (addonFairyLights) addOnsList.push('Warm LED Fairy Lights');
    if (addonPartyPopper) addOnsList.push('Celebration Gold Party Popper');
    if (addonPolaroids) addOnsList.push('Custom Polaroid Memory Prints');

    return encodeURIComponent(
      `👑 *HAMPER QUEEN OFFICIAL BOOKING & ORDER INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔖 *Booking Ref:* ${refId}\n` +
      `📦 *Item Code:* ${itemCode}\n` +
      `🎁 *Product:* ${productName}\n` +
      `🛍️ *Order Type:* ${orderType === 'bulk' ? `BULK ORDER (${bulkQuantity} Hampers - ${bulkTier.discount})` : 'Individual Gift Hamper (Qty: 1)'}\n` +
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
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *WHAT IS PRESENT (INCLUDED ITEMS):*\n` +
      `${itemsSummary}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#FAF9F5] rounded-3xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden my-4">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#141414] via-[#1E1B18] to-[#141414] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#D4AF37]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#DFBA54] shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F3E5AB]">
                  Hamper Queen Concierge Booking
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#DFBA54]/20 border border-[#DFBA54]/40 text-[#DFBA54] text-[10px] font-cinzel font-bold">
                  Official Hamper Queen
                </span>
              </div>
              <p className="text-xs text-white/70">
                Homegrown by Ms. Supriya Khandekar • Fast Handcrafted Delivery to Any Corner
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        {!isSubmitted && (
          <div className="bg-[#1C1A17] border-b border-[#D4AF37]/30 px-5 sm:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Step 1 Indicator */}
              <div className={`flex items-center gap-2 text-xs font-cinzel font-bold transition-all ${
                checkoutStep === 1 ? 'text-[#F3E5AB]' : 'text-emerald-400'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  checkoutStep === 1
                    ? 'bg-[#B8860B] text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {checkoutStep === 1 ? '1' : <Check className="w-3.5 h-3.5" />}
                </div>
                <span>1. Gift Details & Personalization</span>
              </div>

              <ChevronRight className="w-4 h-4 text-white/30 hidden sm:inline" />

              {/* Step 2 Indicator */}
              <div className={`flex items-center gap-2 text-xs font-cinzel font-bold transition-all ${
                checkoutStep === 2 ? 'text-[#F3E5AB]' : 'text-white/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  checkoutStep === 2
                    ? 'bg-[#B8860B] text-white'
                    : 'bg-white/10 text-white/40 border border-white/20'
                }`}>
                  2
                </div>
                <span>2. Final Buying & Pinpoint Delivery</span>
              </div>
            </div>

            <span className="text-[11px] text-[#DFBA54] font-medium hidden md:inline">
              {checkoutStep === 1 ? 'Step 1 of 2: Select & Personalize' : 'Step 2 of 2: Pin Delivery & Confirm'}
            </span>
          </div>
        )}

        {/* Modal Body */}
        {!isSubmitted ? (
          <div id="booking-modal-scrollable" className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto">
            
            {/* =========================================================================
                STEP 1: GIFT SELECTION & PERSONALIZATION (DO NOT ASK LOCATION HERE)
                ========================================================================= */}
            {checkoutStep === 1 && (
              <div className="space-y-7">
                
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
                    <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#B8860B]" />
                      <span>1. Select Order Type & Scale</span>
                    </label>
                    <span className="text-[11px] text-[#8C6821] font-semibold">
                      {orderType === 'bulk' ? '✨ Bulk Corporate & Party Gifting Tier' : '✨ Single Custom Gift'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Individual Option */}
                    <div
                      onClick={() => setOrderType('individual')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        orderType === 'individual'
                          ? 'bg-white border-[#D4AF37] shadow-sm'
                          : 'bg-[#F5F2EA] border-transparent hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel text-sm font-bold text-[#141414]">
                          Individual Gift Hamper
                        </span>
                        <span className="text-xs font-semibold text-[#8C6821]">Qty: 1</span>
                      </div>
                      <p className="font-cormorant text-xs text-[#6B6559] mt-1">
                        For personal birthdays, anniversaries, romantic gestures, and one-of-a-kind celebrations.
                      </p>
                    </div>

                    {/* Bulk Orders & Party Gifts Option */}
                    <div
                      onClick={() => setOrderType('bulk')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        orderType === 'bulk'
                          ? 'bg-white border-[#D4AF37] shadow-sm ring-2 ring-[#D4AF37]/30'
                          : 'bg-[#F5F2EA] border-transparent hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel text-sm font-bold text-[#141414] flex items-center gap-1.5">
                          <span>Bulk & Party Gifts</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[9px] font-bold">
                            Special Rates
                          </span>
                        </span>
                      </div>
                      <p className="font-cormorant text-xs text-[#6B6559] mt-1">
                        Weddings, baby shower return gifts, corporate employee recognition, and grand celebrations.
                      </p>
                    </div>
                  </div>

                  {/* Bulk Quantity Slider and Discount Tier */}
                  {orderType === 'bulk' && (
                    <div className="p-4 rounded-2xl bg-white border border-[#D4AF37] shadow-xs space-y-3 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#141414]">Bulk Quantity Needed:</span>
                        <span className="font-cinzel font-bold text-base text-[#B8860B]">
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
                        className="w-full accent-[#B8860B] cursor-pointer"
                      />

                      <div className="flex items-center justify-between text-[11px] text-[#6B6559]">
                        <span>5 units</span>
                        <span className="font-semibold text-[#16A34A]">{bulkTier.discount}</span>
                        <span>200+ units</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5D9] text-[11px] text-[#524B40] flex items-center justify-between">
                        <span>Applicable Benefit:</span>
                        <span className="font-bold text-[#141414]">{bulkTier.badge} + Complimentary Custom Branding Tags</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. PRODUCT SELECTION & WHAT IS INCLUDED */}
                <div className="space-y-3">
                  <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#B8860B]" />
                    <span>2. Select Offering / Item Code</span>
                  </label>

                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#D4AF37]/70 text-xs font-semibold text-[#141414] focus:outline-hidden focus:border-[#B8860B] shadow-2xs cursor-pointer"
                  >
                    {customHamper && (
                      <option value="custom-atelier">
                        🎨 Current Custom Hamper ({customHamper.items.length} items custom built)
                      </option>
                    )}
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
                  </select>

                  {/* What is Present (Included items preview) */}
                  {activeProduct && (
                    <div className="p-4 rounded-2xl bg-white border border-[#EAE5D9] shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-[#141414]">
                          What is Present in {activeProduct.name}:
                        </span>
                        <span className="font-bold text-[#B8860B]">{activeProduct.approxPrice}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {activeProduct.itemsIncluded.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#524B40]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. OCCASION & DELIVERY TIMING */}
                <div className="space-y-4">
                  <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B8860B]" />
                    <span>3. Occasion & Desired Delivery Schedule</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Celebration Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
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
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Desired Delivery Date
                      </label>
                      <input
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
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
                  <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B8860B]" />
                    <span>4. Keepsake Personalization & Add-ons</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Recipient's Name (To write on Hamper Tag)
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. For Dearest Riya"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Royal Wax Seal Stamp Design
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Crown', 'Rose', 'Monogram'] as const).map((seal) => (
                          <button
                            type="button"
                            key={seal}
                            onClick={() => setWaxSealDesign(seal)}
                            className={`py-2 px-2 rounded-xl text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                              waxSealDesign === seal
                                ? 'bg-[#141414] text-[#DFBA54] border-[#D4AF37]'
                                : 'bg-white text-[#524B40] border-[#E5E0D6]'
                            }`}
                          >
                            {seal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                      Handwritten Calligraphy Card Message
                    </label>
                    <textarea
                      rows={2}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      placeholder="Enter message to be handwritten in gold ink on deckle-edge card..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                    />
                  </div>

                  {/* Add-ons Checklist */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EAE5D9] space-y-2.5">
                    <span className="text-[11px] font-cinzel font-bold text-[#141414] uppercase tracking-wider block">
                      Celebration Add-ons:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="flex items-center gap-2 text-xs text-[#524B40] cursor-pointer p-2 rounded-lg hover:bg-[#FAF9F5]">
                        <input
                          type="checkbox"
                          checked={addonFairyLights}
                          onChange={(e) => setAddonFairyLights(e.target.checked)}
                          className="accent-[#B8860B]"
                        />
                        <span>Warm Fairy Lights (+INR 99)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#524B40] cursor-pointer p-2 rounded-lg hover:bg-[#FAF9F5]">
                        <input
                          type="checkbox"
                          checked={addonPartyPopper}
                          onChange={(e) => setAddonPartyPopper(e.target.checked)}
                          className="accent-[#B8860B]"
                        />
                        <span>Gold Party Popper (+INR 99)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#524B40] cursor-pointer p-2 rounded-lg hover:bg-[#FAF9F5]">
                        <input
                          type="checkbox"
                          checked={addonPolaroids}
                          onChange={(e) => setAddonPolaroids(e.target.checked)}
                          className="accent-[#B8860B]"
                        />
                        <span>Custom Polaroid Prints (+INR 149)</span>
                      </label>
                    </div>
                  </div>

                  {/* Special Instructions / Substitutions */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                      Customization & Substitutions Instructions
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. 100% Eggless chocolates only, swap ribbon color for emerald green"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                {/* 5. CLIENT CONTACT INFORMATION */}
                <div className="space-y-3">
                  <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B8860B]" />
                    <span>5. Your Contact Information</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. ananya@example.com"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Mobile Contact (WhatsApp enabled) *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
                        <input
                          type="tel"
                          required
                          value={mobilePhone}
                          onChange={(e) => setMobilePhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Alternate Contact (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
                        <input
                          type="tel"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                          placeholder="Secondary contact number"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1 Bottom Action Bar */}
                <div className="pt-5 border-t border-[#EAE5D9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#6B6559]">
                    <span>Questions? Reach Ms. Supriya directly: </span>
                    <strong className="text-[#141414]">+91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</strong>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-[#E5E0D6] text-xs font-semibold text-[#524B40] hover:bg-[#FAF9F5] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#141414] hover:bg-[#252525] text-[#DFBA54] font-cinzel font-bold text-xs uppercase tracking-wider border border-[#D4AF37] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Final Details & Pinpoint Delivery →</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================================================
                STEP 2: FINAL BUYING DETAILS & PINPOINT DELIVERY TO ANY CORNER
                ========================================================================= */}
            {checkoutStep === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-7">
                
                {/* Error Banner if Step 2 validation failed */}
                {step2Error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{step2Error}</span>
                  </div>
                )}

                {/* Order Recap Banner */}
                <div className="p-4 rounded-2xl bg-white border border-[#D4AF37] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-[#B8860B]" />
                    <div>
                      <span className="text-[10px] text-[#8C6821] font-bold uppercase tracking-wider block">Booking For:</span>
                      <strong className="text-[#141414] font-cinzel">{activeProduct?.name || 'Custom Hamper'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[#524B40]">
                    <div>
                      <span className="text-[10px] text-[#8C6821] font-bold uppercase block">Delivery:</span>
                      <span>{deliveryDate} ({timeSlot.split(' ')[0]})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C6821] font-bold uppercase block">Client:</span>
                      <span>{fullName}</span>
                    </div>
                  </div>
                </div>

                {/* HIGH-IMPACT DELIVERY TO ANY CORNER GUARANTEE BANNER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141414] via-[#2A241C] to-[#141414] text-white border border-[#D4AF37] shadow-md flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54] shrink-0 mt-0.5 sm:mt-0">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#F3E5AB] flex items-center gap-2">
                      <span>Delivering to Every Corner & Doorstep</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[9px] font-sans font-bold">
                        Nationwide Reach
                      </span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-white/80 font-sans leading-relaxed">
                      From local Mumbai gullies, residential societies, and coastal suburbs to high-rise corporate towers across India — we deliver to any corner. Pin your spot below and confirm relevant address details!
                    </p>
                  </div>
                </div>

                {/* PART 1: MAPS-BASED PIN-POINTING (NOW ONLY ASKED AT FINAL STAGE) */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#B8860B]" />
                        <span>1. Pinpoint Exact Delivery Spot on Map</span>
                      </label>
                      <p className="text-[11px] text-[#6B6559] mt-0.5">
                        Tap anywhere on the map to place the gold delivery pin, or click auto-detect.
                      </p>
                    </div>

                    {/* Detect GPS Button */}
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] text-[#DFBA54] text-xs font-cinzel font-bold border border-[#D4AF37] hover:bg-[#282828] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Detecting GPS...' : '📍 Auto-Detect My Location'}</span>
                    </button>
                  </div>

                  {/* Interactive Visual Map Canvas with Draggable/Clickable Crosshair Pin */}
                  <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/70 shadow-sm bg-[#EFEADF] relative">
                    <div
                      onClick={handleMapClick}
                      className="w-full h-56 relative cursor-crosshair bg-cover bg-center select-none"
                      style={{
                        backgroundImage: `radial-gradient(circle, #D4AF37 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, #FAF7F0 1px)`,
                        backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                      }}
                    >
                      {/* Decorative Map Arteries */}
                      <div className="absolute inset-0 opacity-25 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0,80 Q250,140 500,90 T1000,160" fill="none" stroke="#B8860B" strokeWidth="4" />
                          <path d="M120,0 Q180,150 220,300" fill="none" stroke="#B8860B" strokeWidth="3" />
                          <path d="M420,0 Q390,120 480,300" fill="none" stroke="#B8860B" strokeWidth="2.5" />
                        </svg>
                      </div>

                      {/* Pin Drop Element */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none animate-bounce">
                        <div className="w-10 h-10 rounded-full bg-[#141414] border-2 border-[#DFBA54] text-[#DFBA54] flex items-center justify-center shadow-xl">
                          <MapPin className="w-6 h-6 fill-[#DFBA54] text-[#141414]" />
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-[#141414]/95 text-white text-[10px] font-bold font-cinzel tracking-wider mt-1 border border-[#DFBA54]/50 shadow-md whitespace-nowrap">
                          Delivery Pin ({geoLat}, {geoLng})
                        </span>
                      </div>

                      {/* Click Instruction Banner */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-between text-[11px] text-[#524B40] shadow-xs">
                        <span className="truncate max-w-[220px] sm:max-w-none">{locationStatus}</span>
                        <a
                          href={`https://maps.google.com/?q=${geoLat},${geoLng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8C6821] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Verify in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PART 2: RELEVANT INFO TO CONFIRM PINNED LOCATION IS 100% ACCURATE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                      <span>2. Relevant Info to Confirm Pinned Location</span>
                    </label>
                    <span className="text-[11px] text-[#8C6821] font-semibold">
                      Doorstep Courier Verification
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6559]">
                    Please provide your building, flat, and landmark so our dispatch rider can pinpoint your exact doorstep without hesitation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Flat / House No., Floor & Building / Society Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={flatBuilding}
                        onChange={(e) => setFlatBuilding(e.target.value)}
                        placeholder="e.g. Flat 602, B-Wing, Royal Palms Heights"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Postal Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 400050"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Street, Colony / Area & Prominent Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. Linking Road, Opposite National College / Metro Pillar 42"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai / Navi Mumbai / Pune / Delhi"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-[#524B40] mb-1">
                        Special Landmark or Gate Entry Details (To double-confirm pin)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Enter from Gate 2, inform security it is a birthday surprise for Riya"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                      />
                    </div>
                  </div>
                </div>

                {/* PART 3: PAYMENT FORMALITIES & POLICIES */}
                <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#EAE0C8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8C6821] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                      <span>3. Payment Formalities & Hamper Queen Guarantee</span>
                    </span>
                    <span className="text-[11px] text-[#8C6821] font-semibold">Custom Craft Policy</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label
                      onClick={() => setPaymentOption('upi')}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentOption === 'upi'
                          ? 'bg-white border-[#B8860B] font-bold text-[#141414] shadow-xs'
                          : 'bg-[#FFFDF9] border-[#EAE5D9] text-[#524B40]'
                      }`}
                    >
                      <span>UPI (GPay / PhonePe / Paytm)</span>
                    </label>
                    <label
                      onClick={() => setPaymentOption('bank_transfer')}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentOption === 'bank_transfer'
                          ? 'bg-white border-[#B8860B] font-bold text-[#141414] shadow-xs'
                          : 'bg-[#FFFDF9] border-[#EAE5D9] text-[#524B40]'
                      }`}
                    >
                      <span>Direct Bank Transfer (IMPS/NEFT)</span>
                    </label>
                    <label
                      onClick={() => setPaymentOption('advance_cod')}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentOption === 'advance_cod'
                          ? 'bg-white border-[#B8860B] font-bold text-[#141414] shadow-xs'
                          : 'bg-[#FFFDF9] border-[#EAE5D9] text-[#524B40]'
                      }`}
                    >
                      <span>50% Advance + Balance on Delivery</span>
                    </label>
                  </div>

                  <label className="flex items-start gap-2 text-[11px] text-[#524B40] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={formalitiesAccepted}
                      onChange={(e) => setFormalitiesAccepted(e.target.checked)}
                      className="mt-0.5 accent-[#B8860B]"
                    />
                    <span>
                      I understand Hamper Queen makes custom hampers with fresh stock. Rates vary as per exact customization and chocolate counts (approx INR 149 to INR 899). Formal invoice will be verified directly on WhatsApp with Ms. Supriya.
                    </span>
                  </label>
                </div>

                {/* Step 2 Bottom Action Bar */}
                <div className="pt-4 border-t border-[#EAE5D9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutStep(1);
                      const formEl = document.getElementById('booking-modal-scrollable');
                      if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#8C6821] hover:underline cursor-pointer order-2 sm:order-1 font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Gift Details</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-[#E5E0D6] text-xs font-semibold text-[#524B40] hover:bg-[#FAF9F5] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#141414] hover:bg-[#252525] text-[#DFBA54] font-cinzel font-bold text-xs uppercase tracking-wider border border-[#D4AF37] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Confirm Booking & Launch WhatsApp Order →</span>
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
            
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] text-[#10B981] mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#8C6821]">
                Booking Form Successfully Processed
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#141414]">
                Your Royal Booking is Ready!
              </h3>
              <p className="text-xs text-[#6B6559] max-w-md mx-auto">
                Reference Code <strong className="text-[#141414]">{bookingRef}</strong> has been created. Connect directly to Hamper Queen on WhatsApp to lock in your order with Ms. Supriya Khandekar.
              </p>
            </div>

            {/* Official Booking Summary Card */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white border-2 border-[#D4AF37]/50 shadow-sm text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5D9]">
                <span className="font-cinzel font-bold text-sm text-[#141414]">
                  Booking Reference: {bookingRef}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5E8] text-[#8C6821] font-bold text-[10px] border border-[#D4AF37]/40">
                  {orderType === 'bulk' ? `Bulk (${bulkQuantity} Units)` : 'Individual Gift'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[#524B40]">
                <div>
                  <span className="block text-[10px] text-[#8C6821] font-semibold uppercase">Client:</span>
                  <strong className="text-[#141414]">{fullName}</strong> ({mobilePhone})
                </div>
                <div>
                  <span className="block text-[10px] text-[#8C6821] font-semibold uppercase">Delivery Date:</span>
                  <strong className="text-[#141414]">{deliveryDate}</strong> ({timeSlot})
                </div>
                <div>
                  <span className="block text-[10px] text-[#8C6821] font-semibold uppercase">Selected Item:</span>
                  <strong className="text-[#141414]">{activeProduct?.name || 'Custom Hamper'}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8C6821] font-semibold uppercase">Map Pin Location:</span>
                  <a
                    href={`https://maps.google.com/?q=${geoLat},${geoLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#B8860B] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Lat: {geoLat}, Lng: {geoLng}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE5D9] text-[11px] text-[#6B6559]">
                <span>Confirmed Delivery Address: </span>
                <strong className="text-[#141414]">
                  {flatBuilding}, {streetAddress}{landmark ? `, Near ${landmark}` : ''}, {city} - {pincode}
                </strong>
              </div>
            </div>

            {/* Actions: Direct WhatsApp Send + Copy + Print */}
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLaunchWhatsApp}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-sans font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Send via WhatsApp (+91 8080580105)</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full sm:w-auto py-4 px-5 rounded-full bg-white border border-[#D4AF37] text-xs font-cinzel font-bold text-[#141414] hover:bg-[#FAF9F5] shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#8C6821]" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto p-3.5 rounded-full bg-white border border-[#E5E0D6] text-[#524B40] hover:text-[#141414] shadow-xs cursor-pointer"
                title="Print Booking Slip"
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
              className="text-xs text-[#8C6821] hover:underline cursor-pointer block mx-auto pt-2"
            >
              Close & Return to Catalog
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
