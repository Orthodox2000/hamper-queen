import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BRANDED_ITEMS_CATALOG,
  PACKAGING_SIZE_OPTIONS,
  PRE_MADE_SUGGESTIONS,
  BrandedItem,
  PackagingSizeOption,
} from '../data/brandedItemsData';
import { BoxVisualizer } from './BoxVisualizer';
import { BrandedProductGraphic } from './BrandedProductGraphic';
import { PhotoCustomizerModal } from './PhotoCustomizerModal';
import { Packing3DAnimationModal } from './Packing3DAnimationModal';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import {
  Sparkles,
  Gift,
  Heart,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  MessageCircle,
  Lightbulb,
  Camera,
  PartyPopper,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Clock,
  User,
  GripVertical,
  Crown,
} from 'lucide-react';
import { CustomHamper, LuxuryItem } from '../types';
import {
  triggerGoldConfetti,
  triggerPartyPopperConfetti,
  triggerRomanticConfetti,
  triggerGrandCelebration,
} from '../utils/confetti';

interface CustomHamperAtelierProps {
  initialItems?: LuxuryItem[];
  onSaveToHamper?: (hamper: CustomHamper) => void;
  onOpenScribe?: () => void;
}

export const CustomHamperAtelier: React.FC<CustomHamperAtelierProps> = ({
  initialItems = [],
  onSaveToHamper,
  onOpenScribe,
}) => {
  // --- 1. STATE: Selected Packaging Size ---
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingSizeOption>(
    PACKAGING_SIZE_OPTIONS[1] // Default: Medium 6-item box
  );
  const [packagingTypeTab, setPackagingTypeTab] = useState<
    'all' | 'box' | 'bouquet' | 'photo_bouquet' | 'chests'
  >('all');

  // --- 2. STATE: Slots (Array of BrandedItems or null) ---
  const [slots, setSlots] = useState<(BrandedItem | null)[]>(() => {
    const initialSlots: (BrandedItem | null)[] = Array(PACKAGING_SIZE_OPTIONS[1].slotCount).fill(null);

    if (initialItems && initialItems.length > 0) {
      initialItems.slice(0, PACKAGING_SIZE_OPTIONS[1].slotCount).forEach((item, idx) => {
        const match = BRANDED_ITEMS_CATALOG.find((b) => b.name.toLowerCase().includes(item.name.toLowerCase())) || {
          id: `custom-${item.id}`,
          name: item.name,
          brand: 'Custom',
          category: 'chocolates',
          simpleName: item.name,
          description: item.subtitle,
          weightOrQty: '1 Piece',
          unitPriceApprox: item.approximateUnitValue || 120,
          colorScheme: {
            bg: '#212121',
            text: '#FFFFFF',
            border: '#D4AF37',
            accent: '#C5A059',
          },
        };
        initialSlots[idx] = match as BrandedItem;
      });
    } else {
      // Welcoming starter in Medium box
      initialSlots[0] = BRANDED_ITEMS_CATALOG[0]; // Silk Classic
      initialSlots[1] = BRANDED_ITEMS_CATALOG[5]; // KitKat
      initialSlots[2] = BRANDED_ITEMS_CATALOG.find((i) => i.id === 'item-fairy-warm-lights') || BRANDED_ITEMS_CATALOG[11];
    }
    return initialSlots;
  });

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(0);

  // --- 3. STATE: Workflow Stage (1: Size, 2: Slots, 3: Wrapping, 4: Order) ---
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(2);

  // --- 4. STATE: Active Category Filter in Item Catalog ---
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'cadbury' | 'nestle' | 'premium' | 'lights' | 'photos' | 'party_fun' | 'gift_wrap' | 'keepsakes'
  >('all');

  // --- 5. STATE: Photo Customizer Modal ---
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalTargetSlot, setPhotoModalTargetSlot] = useState(0);

  // --- 6. STATE: Custom Item Creation Form ---
  const [isCreatingCustomItem, setIsCreatingCustomItem] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemNote, setCustomItemNote] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('100');

  // --- 7. STATE: Luxury Wrapping, Lighting & Ribbons ---
  const [selectedRibbon, setSelectedRibbon] = useState({
    name: 'Golden Champagne',
    hex: '#D4AF37',
  });
  const [wrappingSheet, setWrappingSheet] = useState('Metallic Gold Cellophane Wrap');
  const [cushionBed, setCushionBed] = useState('Shimmering Gold Shredded Grass');
  const [hasWaxSeal, setHasWaxSeal] = useState(true);
  const [includeFairyLights, setIncludeFairyLights] = useState(true);
  const [includePartyPopper, setIncludePartyPopper] = useState(false);

  // --- 8. STATE: Personalized Message & Occasion ---
  const [selectedOccasion, setSelectedOccasion] = useState('Birthday Celebration');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [cardMessage, setCardMessage] = useState(
    'Wishing you immense joy, sweet moments, and unforgettable celebrations today and always!'
  );

  // --- 9. STATE: Delivery Details & 3D Packing Animation Modal ---
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Mumbai');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState<'same_day' | 'next_day' | 'scheduled'>('same_day');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);

  // Drag & drop item directly into a specific slot
  const handleDropItemIntoSlot = (slotIndex: number, item: BrandedItem) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex] = item;
      return copy;
    });
    setActiveSlotIndex(null);
    triggerGoldConfetti(0.5, 0.5);
  };

  // When packaging size changes, resize slots array preserving existing items
  const handleSelectPackaging = (newPackaging: PackagingSizeOption) => {
    setSelectedPackaging(newPackaging);
    setSlots((prev) => {
      const resized: (BrandedItem | null)[] = Array(newPackaging.slotCount).fill(null);
      for (let i = 0; i < Math.min(prev.length, newPackaging.slotCount); i++) {
        resized[i] = prev[i];
      }
      return resized;
    });
    setActiveSlotIndex(0);
    triggerGoldConfetti(0.5, 0.5);
  };

  // Add item into the currently active slot, or next empty slot
  const handleAddItem = (item: BrandedItem, e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = (rect.left + rect.width / 2) / window.innerWidth;
      const clickY = (rect.top + rect.height / 2) / window.innerHeight;
      if (item.category === 'party_fun') {
        triggerPartyPopperConfetti(clickX, clickY);
      } else if (item.category === 'photos' || item.category === 'roses_decor') {
        triggerRomanticConfetti(clickX, clickY);
      } else {
        triggerGoldConfetti(clickX, clickY);
      }
    } else {
      triggerGoldConfetti(0.5, 0.5);
    }

    // If it's a photo item and user clicks it, open photo modal to customize photo & caption
    if (item.isPhoto && !item.photoCaption) {
      const targetSlot = activeSlotIndex ?? slots.findIndex((s) => s === null);
      if (targetSlot !== -1) {
        setPhotoModalTargetSlot(targetSlot);
        setIsPhotoModalOpen(true);
        return;
      }
    }

    setSlots((prev) => {
      const copy = [...prev];
      if (activeSlotIndex !== null && activeSlotIndex < copy.length) {
        copy[activeSlotIndex] = item;
        const nextEmpty = copy.findIndex((s) => s === null);
        setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : null);
      } else {
        const firstEmpty = copy.findIndex((s) => s === null);
        if (firstEmpty !== -1) {
          copy[firstEmpty] = item;
          const nextEmpty = copy.findIndex((s, idx) => idx > firstEmpty && s === null);
          setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : null);
        } else {
          alert(`This ${selectedPackaging.name} is full! Please choose a larger size or replace an item.`);
        }
      }
      return copy;
    });
  };

  // Remove item from slot
  const handleRemoveItem = (index: number) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
    setActiveSlotIndex(index);
    triggerGoldConfetti(0.5, 0.4);
  };

  // Quick Load Suggestion
  const handleApplySuggestion = (sugg: (typeof PRE_MADE_SUGGESTIONS)[0]) => {
    const pkg = PACKAGING_SIZE_OPTIONS.find((p) => p.id === sugg.packagingId) || PACKAGING_SIZE_OPTIONS[1];
    setSelectedPackaging(pkg);
    const newSlots = Array(pkg.slotCount).fill(null);
    sugg.itemIds.forEach((id, idx) => {
      const found = BRANDED_ITEMS_CATALOG.find((item) => item.id === id);
      if (found && idx < newSlots.length) {
        newSlots[idx] = found;
      }
    });
    setSlots(newSlots);
    setActiveSlotIndex(null);
    setCurrentStage(2);
    triggerPartyPopperConfetti(0.5, 0.4);
  };

  // Handle Photo Saved from Modal
  const handleSavePhotoToSlot = (photoItem: BrandedItem, slotIndex: number) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex] = photoItem;
      return copy;
    });
    const nextEmpty = slots.findIndex((s, idx) => idx !== slotIndex && s === null);
    setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : null);
    triggerRomanticConfetti(0.5, 0.5);
  };

  // Create Custom Item Submit
  const handleCreateCustomItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    const newItem: BrandedItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      brand: 'Custom',
      category: 'chocolates',
      simpleName: customItemName.trim(),
      description: customItemNote.trim() || 'Custom Gift Item Request',
      weightOrQty: '1 Custom Item',
      unitPriceApprox: parseInt(customItemPrice) || 100,
      colorScheme: {
        bg: '#1E293B',
        text: '#FFFFFF',
        border: '#D4AF37',
        accent: '#94A3B8',
      },
    };

    handleAddItem(newItem);
    setCustomItemName('');
    setCustomItemNote('');
    setIsCreatingCustomItem(false);
    triggerGoldConfetti(0.5, 0.5);
  };

  // Filter Catalog Items
  const filteredCatalogItems = BRANDED_ITEMS_CATALOG.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'cadbury') return item.brand === 'Cadbury';
    if (activeCategoryFilter === 'nestle') return item.brand === 'Nestle';
    if (activeCategoryFilter === 'premium') return item.brand === 'Ferrero' || item.category === 'premium_bars';
    if (activeCategoryFilter === 'lights') return item.category === 'lights';
    if (activeCategoryFilter === 'photos') return item.category === 'photos';
    if (activeCategoryFilter === 'party_fun') return item.category === 'party_fun';
    if (activeCategoryFilter === 'gift_wrap') return item.category === 'gift_wrap';
    if (activeCategoryFilter === 'keepsakes') return item.brand === 'Keepsake' || item.category === 'roses_decor';
    return true;
  });

  // Calculate Transparent Total & Delivery Policy
  // "smallest order can be 199+delivery... prices start from 299, 399 and so on... delivery is free for items above 499"
  const filledItems = slots.filter(Boolean) as BrandedItem[];
  const baseBoxEstimate =
    selectedPackaging.id === 'box-pocket-2'
      ? 100
      : selectedPackaging.id === 'box-small-4'
      ? 150
      : selectedPackaging.type === 'bouquet'
      ? 200
      : selectedPackaging.id === 'box-medium-6'
      ? 250
      : 350;

  const itemsTotal = filledItems.reduce((acc, curr) => acc + curr.unitPriceApprox, 0);
  const addOnsTotal = (hasWaxSeal ? 50 : 0) + (includePartyPopper ? 60 : 0) + (includeFairyLights ? 50 : 0);
  const rawSubtotal = baseBoxEstimate + itemsTotal + addOnsTotal;
  const subtotal = Math.max(199, rawSubtotal);
  const isFreeDelivery = subtotal >= 499;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const estimatedGrandTotal = subtotal + deliveryFee;

  // WhatsApp Order Generator with complete delivery details
  const handleOrderOnWhatsApp = () => {
    triggerGrandCelebration();

    const itemListText = filledItems
      .map((item, idx) => {
        if (item.isPhoto) {
          return `  ${idx + 1}. [Polaroid Photo Memory] "${item.photoCaption || 'Memories'}" (~₹${item.unitPriceApprox})`;
        }
        return `  ${idx + 1}. ${item.name} (~₹${item.unitPriceApprox})`;
      })
      .join('\n');

    const speedLabel =
      deliverySpeed === 'same_day'
        ? '⚡ Same-Day Express (Mumbai Courier)'
        : deliverySpeed === 'next_day'
        ? '🚚 Next-Day Morning Dispatch'
        : `📅 Scheduled Date: ${deliveryDate || 'As scheduled'}`;

    const message = `👑 *NAMASTE HAMPER QUEEN!* 👑\n\nI would like to confirm my custom hamper order from the Hamper Queen Atelier:\n\n📦 *PACKAGING SELECTED:*\n- Packaging: ${selectedPackaging.name}\n- Capacity: ${selectedPackaging.slotCount} Slots (${filledItems.length} Filled)\n- Dimensions: ${selectedPackaging.dimensions}\n\n🍫 *ITEMS & GIFTS IN SLOTS:*\n${itemListText || '  (Please suggest bestselling treats)'}\n\n🎀 *PACKAGING & FINISHING TOUCHES:*\n- Ribbon: ${selectedRibbon.name} Satin Bow\n- Outer Wrap: ${wrappingSheet}\n- Base Bedding: ${cushionBed}\n- Royal Wax Seal: ${hasWaxSeal ? 'Yes (Imperial Crest Stamped with Gold Dust)' : 'No'}\n- Fairy Lighting: ${includeFairyLights ? 'Warm Fairy LED Lights Included' : 'Standard'}\n\n💌 *PERSONAL GREETING & OCCASION:*\n- Occasion: ${selectedOccasion}\n- To (Recipient): ${recipientName || 'Special Someone'}\n- From (Sender): ${senderName || 'Sender'}\n- Handwritten Card Message: "${cardMessage}"\n\n🚚 *DELIVERY & DISPATCH DETAILS:*\n- Recipient Name: ${recipientName || 'Not specified'}\n- Recipient Phone: ${recipientPhone || 'Not specified'}\n- Sender Contact: ${senderName || 'Sender'} (${senderPhone || 'Not specified'})\n- Address: ${deliveryAddress || 'To be shared on WhatsApp'}\n- City / Pincode: ${deliveryCity} - ${deliveryPincode || '400001'}\n- Dispatch Preference: ${speedLabel}\n${specialInstructions ? `- Special Instructions: ${specialInstructions}\n` : ''}\n💰 *ORDER VALUE & PRICING:*\n- Subtotal: ₹${subtotal}\n- Delivery Fee: ${isFreeDelivery ? 'FREE (Unlocked for orders ₹499+)' : `₹${deliveryFee} (Standard Delivery)`}\n- *GRAND TOTAL:* Approx ₹${estimatedGrandTotal}\n\nPlease confirm availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/918080580105?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-24 text-[#141414]">
      {/* 1. Header Banner */}
      <section className="border-b border-stone-200 bg-stone-50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                Hamper Queen • Custom Gift Builder
              </div>
              <h1 className="font-seasons text-2xl sm:text-4xl font-bold text-[#141414] tracking-tight">
                Customise Your Gift Box & Bouquet
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
                Choose your hamper size, fill each slot with chocolates, polaroids & party props, and order directly on WhatsApp.
              </p>
            </div>

            {/* Quick WhatsApp Assistance */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://wa.me/918080580105"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Help: +91 8080580105
            </motion.a>
          </div>

          {/* 4-Stage Progress Stepper with Smooth Transitions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
            {[
              { num: 1, label: '1. Select Hamper Box', sub: `${selectedPackaging.slotCount} Slots chosen` },
              { num: 2, label: '2. Fill Items & Photos', sub: `${filledItems.length}/${selectedPackaging.slotCount} Slots Filled` },
              { num: 3, label: '3. Wrapping & Message', sub: `${selectedRibbon.name}` },
              { num: 4, label: '4. Summary & WhatsApp', sub: `₹${estimatedGrandTotal} approx` },
            ].map((step) => {
              const isActive = currentStage === step.num;
              const isPast = currentStage > step.num;
              return (
                <motion.button
                  key={step.num}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentStage(step.num as 1 | 2 | 3 | 4);
                    triggerGoldConfetti(0.5, 0.3);
                  }}
                  className={`p-3 text-left border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#B8860B] bg-white ring-1 ring-[#B8860B] shadow-sm'
                      : isPast
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                      : 'border-stone-200 bg-white/70 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{step.label}</span>
                    {isPast && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{step.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Content Stages */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* STAGE 1: REAL HAMPER IMAGES & PACKAGING SELECTION */}
        {currentStage === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-seasons text-xl sm:text-2xl font-bold text-[#141414]">
                  Stage 1: Choose Your Outer Hamper or Bouquet
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Select your packaging based on real photos, item slot count, and occasion style:
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 border border-stone-200">
                {[
                  { id: 'all', label: 'All Hampers' },
                  { id: 'box', label: 'Gift Boxes' },
                  { id: 'bouquet', label: 'Chocolate Bouquets' },
                  { id: 'photo_bouquet', label: 'Only Image Bouquets' },
                  { id: 'chests', label: 'Velvet & Acrylic Chests' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setPackagingTypeTab(tab.id as any);
                      triggerGoldConfetti(0.5, 0.4);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      packagingTypeTab === tab.id
                        ? 'bg-[#B8860B] text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Packaging Options with Real Hamper Photographs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {PACKAGING_SIZE_OPTIONS.filter((pkg) => {
                if (packagingTypeTab === 'all') return true;
                if (packagingTypeTab === 'box') return pkg.type === 'box' && pkg.illustrationType !== 'velvet_hatbox' && pkg.illustrationType !== 'acrylic_chest';
                if (packagingTypeTab === 'bouquet') return pkg.type === 'bouquet' && pkg.illustrationType !== 'photo_bouquet';
                if (packagingTypeTab === 'photo_bouquet') return pkg.illustrationType === 'photo_bouquet';
                if (packagingTypeTab === 'chests') return pkg.illustrationType === 'velvet_hatbox' || pkg.illustrationType === 'acrylic_chest' || pkg.illustrationType === 'xl_trunk';
                return true;
              }).map((pkg) => {
                const isSelected = selectedPackaging.id === pkg.id;
                return (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPackaging(pkg)}
                    className={`relative border-2 cursor-pointer transition-all bg-white shadow-sm flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? 'border-[#B8860B] ring-2 ring-[#B8860B]/50 shadow-lg'
                        : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
                    }`}
                  >
                    {/* Real Hamper Photo */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-black/75 text-white backdrop-blur-xs">
                          {pkg.slotCount} Item Slots
                        </span>
                      </div>

                      {pkg.popularBadge && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#B8860B] text-white uppercase tracking-wider shadow-sm">
                            {pkg.popularBadge}
                          </span>
                        </div>
                      )}

                      {/* Price Banner Overlay */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                        <span className="text-xs font-bold drop-shadow-sm">{pkg.dimensions}</span>
                        <span className="text-xs font-extrabold text-[#F3E5AB] drop-shadow-sm">
                          {pkg.approxPriceRange}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-seasons text-lg font-bold text-[#141414] group-hover:text-[#B8860B] transition-colors">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                          {pkg.subtitle}
                        </p>

                        <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                          <span className="font-bold text-stone-700">Best For: </span>
                          {pkg.recommendedFor}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`w-full mt-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#B8860B] text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Selected Hamper
                          </>
                        ) : (
                          'Select This Hamper'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Proceed Action */}
            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentStage(2);
                  triggerGoldConfetti(0.5, 0.4);
                }}
                className="bg-[#B8860B] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#8C6821] flex items-center gap-2 shadow-sm cursor-pointer"
              >
                Proceed to Fill Slots ({selectedPackaging.slotCount} Slots) <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* STAGE 2: VISUAL SLOTS BUILDER & BRANDED CATALOG */}
        {currentStage === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Change Hamper Bar with Real Photo */}
            <div className="bg-stone-100 border border-stone-300 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPackaging.imageUrl}
                  alt={selectedPackaging.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover border border-[#D4AF37]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B8860B]">Selected Packaging</span>
                  <h4 className="font-seasons text-sm font-bold text-stone-900">{selectedPackaging.name}</h4>
                  <p className="text-[11px] text-stone-500">{selectedPackaging.dimensions} • {selectedPackaging.slotCount} Slots</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentStage(1);
                    triggerGoldConfetti(0.5, 0.4);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 transition-colors"
                >
                  Change Hamper Box
                </button>
              </div>
            </div>

            {/* 1-Click Pre-made Combos Suggestions */}
            <div className="bg-amber-50/70 border border-amber-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B8860B]" />
                  <h3 className="font-seasons text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider">
                    Quick Suggestions (1-Click Fill)
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500">
                  Tap any combination to automatically populate chocolates and decor:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PRE_MADE_SUGGESTIONS.map((sugg) => (
                  <motion.button
                    key={sugg.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApplySuggestion(sugg)}
                    className="bg-white border border-amber-200 hover:border-[#B8860B] p-3 text-left transition-all shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#B8860B] uppercase truncate max-w-[120px]">
                        {sugg.tag}
                      </span>
                      <span className="text-[10px] font-bold text-stone-600">{sugg.approxTotal}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#B8860B] truncate">
                      {sugg.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {sugg.subtitle}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* The Visualizer Component with Exterior Showcase Toggle */}
            <BoxVisualizer
              packaging={selectedPackaging}
              slots={slots}
              activeSlotIndex={activeSlotIndex}
              onSelectSlot={(idx) => setActiveSlotIndex(idx)}
              onRemoveItemFromSlot={handleRemoveItem}
              onDropItemIntoSlot={handleDropItemIntoSlot}
              ribbonColorHex={selectedRibbon.hex}
              hasLights={includeFairyLights}
              hasWaxSeal={hasWaxSeal}
              onOpenPhotoModal={(slotIdx) => {
                setPhotoModalTargetSlot(slotIdx);
                setIsPhotoModalOpen(true);
              }}
            />

            {/* Catalog of Realistic Brand Items, Lights, Photos & Party Props */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-seasons text-lg font-bold text-[#141414]">
                    Add Chocolates, Photos, Lights & Party Props
                  </h3>
                  <p className="text-xs text-stone-500">
                    Click any item to place in{' '}
                    {activeSlotIndex !== null
                      ? `Slot #${activeSlotIndex + 1}`
                      : 'the next available slot'}
                  </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'cadbury', label: 'Cadbury & Silk' },
                    { id: 'nestle', label: 'KitKat & Milkybar' },
                    { id: 'premium', label: 'Ferrero Rocher' },
                    { id: 'lights', label: '✨ Lights' },
                    { id: 'photos', label: '📸 Polaroid Photos' },
                    { id: 'party_fun', label: '🎉 Party & Fun' },
                    { id: 'gift_wrap', label: '🎁 Gift Wrapping' },
                    { id: 'keepsakes', label: 'Teddy & Roses' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={(e) => {
                        setActiveCategoryFilter(cat.id as any);
                        triggerGoldConfetti(0.5, 0.4);
                      }}
                      className={`px-3 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}

                  {/* Add Polaroid Photo Button */}
                  <button
                    onClick={() => {
                      const target = activeSlotIndex ?? slots.findIndex((s) => s === null);
                      setPhotoModalTargetSlot(target !== -1 ? target : 0);
                      setIsPhotoModalOpen(true);
                      triggerRomanticConfetti(0.5, 0.5);
                    }}
                    className="px-3 py-1 text-xs font-bold border border-indigo-600 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-700" /> + Add Polaroid Photo
                  </button>

                  {/* Custom Gift Request Button */}
                  <button
                    onClick={() => setIsCreatingCustomItem(!isCreatingCustomItem)}
                    className="px-3 py-1 text-xs font-bold border border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Custom Request
                  </button>
                </div>
              </div>

              {/* Custom Item Request Form Modal */}
              {isCreatingCustomItem && (
                <form
                  onSubmit={handleCreateCustomItemSubmit}
                  className="bg-amber-50 border-2 border-[#D4AF37] p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-seasons text-sm font-bold text-stone-900">
                      Add Your Custom Item Request
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomItem(false)}
                      className="text-xs text-stone-500 hover:text-black font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-stone-600">
                    Looking to include a specific chocolate bar, customized mug, perfume, or special keepsake? Enter details below:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Item Name (e.g. Cadbury 5 Star 3D, Personalized Mug, Perfume)
                      </label>
                      <input
                        type="text"
                        required
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        placeholder="Enter item name..."
                        className="w-full text-xs p-2 border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Estimated Value (₹)
                      </label>
                      <input
                        type="number"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(e.target.value)}
                        className="w-full text-xs p-2 border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Special Note or Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={customItemNote}
                      onChange={(e) => setCustomItemNote(e.target.value)}
                      placeholder="e.g. Wrap with gold ribbon and place in center..."
                      className="w-full text-xs p-2 border border-stone-300 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#B8860B] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#8C6821] cursor-pointer"
                  >
                    Add to Slot
                  </button>
                </form>
              )}

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredCatalogItems.map((item) => (
                  <motion.div
                    key={item.id}
                    draggable={true}
                    onDragStart={(e) => {
                      const dragEvent = e as unknown as DragEvent;
                      dragEvent.dataTransfer?.setData('application/json', JSON.stringify(item));
                      if (dragEvent.dataTransfer) dragEvent.dataTransfer.effectAllowed = 'copy';
                    }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => handleAddItem(item, e)}
                    className="group bg-white border border-stone-200 hover:border-[#B8860B] p-3 flex flex-col justify-between transition-all cursor-grab active:cursor-grabbing shadow-xs hover:shadow-md min-w-0"
                  >
                    <div>
                      {/* Product Graphic */}
                      <div className="h-20 sm:h-24 flex items-center justify-center mb-2 bg-stone-50 p-1 group-hover:bg-amber-50/40 transition-colors relative overflow-hidden">
                        <BrandedProductGraphic item={item} size="md" />
                      </div>

                      {/* Brand Pill & Drag Indicator */}
                      <div className="flex items-center justify-between mb-1 gap-1">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.2 text-white truncate max-w-[70px]"
                          style={{ backgroundColor: item.colorScheme.bg }}
                        >
                          {item.brand}
                        </span>
                        <span className="text-[9px] font-bold text-[#8C6821] bg-amber-50/80 px-1 border border-amber-200/80 truncate flex items-center gap-0.5">
                          <GripVertical className="w-2.5 h-2.5 text-[#B8860B]" /> Drag
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#141414] line-clamp-2 group-hover:text-[#B8860B] leading-tight">
                        {item.simpleName}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-tight">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#B8860B]">
                        ₹{item.unitPriceApprox}
                      </span>
                      <button
                        type="button"
                        className="px-2 py-0.5 bg-stone-100 group-hover:bg-[#B8860B] group-hover:text-white text-stone-700 text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-stone-200">
              <button
                onClick={() => {
                  setCurrentStage(1);
                  triggerGoldConfetti(0.5, 0.4);
                }}
                className="text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Hamper Size
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-600">
                  Total Value: <span className="text-sm font-extrabold text-[#B8860B]">₹{estimatedGrandTotal}</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentStage(3);
                    triggerGoldConfetti(0.5, 0.4);
                  }}
                  className="bg-[#B8860B] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#8C6821] flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Next: Wrapping, Lights & Card <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: PACKAGING, GIFT WRAPPING, LIGHTING & PERSONAL MESSAGE */}
        {currentStage === 3 && (
          <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div>
              <h2 className="font-seasons text-xl sm:text-2xl font-bold text-[#141414]">
                Stage 3: Luxury Wrapping, Satin Ribbon & Handwritten Card
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Hamper Queen crafts every gift with royal care. Select your satin ribbon, custom gift wrap, fairy lighting, and compose your heartfelt greeting:
              </p>
            </div>

            {/* 1. Ribbon Colors */}
            <div className="bg-stone-50 border border-stone-200 p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                1. Choose Handcrafted Satin Ribbon Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Golden Champagne', hex: '#D4AF37' },
                  { name: 'Fuchsia Rose Pink', hex: '#E11D48' },
                  { name: 'Imperial Crimson Red', hex: '#800E17' },
                  { name: 'Royal Emerald Green', hex: '#1C4532' },
                  { name: 'Midnight Onyx Black', hex: '#171717' },
                  { name: 'Lilac Lavender', hex: '#9333EA' },
                  { name: 'Pastel Baby Blue', hex: '#0284C7' },
                  { name: 'Warm Terracotta', hex: '#B45309' },
                ].map((ribbon) => (
                  <motion.button
                    key={ribbon.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRibbon(ribbon);
                      triggerGoldConfetti(0.5, 0.5);
                    }}
                    className={`p-3 border-2 text-left flex items-center gap-2.5 transition-all bg-white cursor-pointer ${
                      selectedRibbon.hex === ribbon.hex
                        ? 'border-[#B8860B] ring-1 ring-[#B8860B] shadow-xs'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-none border border-black/20 shrink-0"
                      style={{ backgroundColor: ribbon.hex }}
                    />
                    <span className="text-xs font-bold text-stone-800">{ribbon.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 2. Gift Wrapping & Bedding Options */}
            <div className="bg-stone-50 border border-stone-200 p-5 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                2. Luxury Packaging & Protective Wrapping Options
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Outer Wrap Sheet */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Outer Wrap Finish
                  </label>
                  <select
                    value={wrappingSheet}
                    onChange={(e) => setWrappingSheet(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 bg-white"
                  >
                    <option value="Metallic Gold Cellophane Wrap">Metallic Gold Cellophane Wrap (Crystal Clear Shield)</option>
                    <option value="Matte Black Frosted Luxury Sheet">Matte Black Frosted Luxury Sheet</option>
                    <option value="Pastel Pink Japanese Floral Paper">Pastel Pink Japanese Floral Bouquet Paper</option>
                    <option value="Classic Transparent Protective Film">Classic Transparent Protective Film</option>
                  </select>
                </div>

                {/* Base Bedding Cushion */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Inner Cushion Bedding Fill
                  </label>
                  <select
                    value={cushionBed}
                    onChange={(e) => setCushionBed(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 bg-white"
                  >
                    <option value="Shimmering Gold Shredded Grass">Shimmering Gold Shredded Grass Bed</option>
                    <option value="Soft White Silk Paper Bedding">Soft White Silk Paper Bedding</option>
                    <option value="Rose Petals & Golden Confetti Bed">Fresh Rose Petals & Golden Confetti Bed</option>
                    <option value="Rustic Natural Kraft Wood Wool">Rustic Natural Kraft Wood Wool</option>
                  </select>
                </div>
              </div>

              {/* Finishing Add-Ons Checkboxes */}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWaxSeal}
                    onChange={(e) => {
                      setHasWaxSeal(e.target.checked);
                      if (e.target.checked) triggerGoldConfetti(0.5, 0.5);
                    }}
                    className="w-4 h-4 accent-[#B8860B]"
                  />
                  <span>Handmade Gold Wax Seal (+₹70)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFairyLights}
                    onChange={(e) => {
                      setIncludeFairyLights(e.target.checked);
                      if (e.target.checked) triggerGoldConfetti(0.5, 0.5);
                    }}
                    className="w-4 h-4 accent-[#B8860B]"
                  />
                  <span>Warm Fairy Lights Included</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePartyPopper}
                    onChange={(e) => {
                      setIncludePartyPopper(e.target.checked);
                      if (e.target.checked) triggerPartyPopperConfetti(0.5, 0.5);
                    }}
                    className="w-4 h-4 accent-[#B8860B]"
                  />
                  <span>Golden Party Popper (+₹60)</span>
                </label>
              </div>
            </div>

            {/* 3. Occasion & Greeting Card */}
            <div className="bg-stone-50 border border-stone-200 p-5 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Gifting Occasion & Handwritten Greeting Card
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Birthday Celebration',
                  'Wedding & Anniversary',
                  'Romance & Proposal',
                  'Raksha Bandhan & Festivals',
                  'Congratulations & Success',
                  'Party & Celebration Gala',
                  'Heartfelt Thank You',
                ].map((occ) => (
                  <button
                    key={occ}
                    onClick={() => {
                      setSelectedOccasion(occ);
                      triggerGoldConfetti(0.5, 0.5);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                      selectedOccasion === occ
                        ? 'bg-[#B8860B] text-white border-[#B8860B]'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              {/* Recipient & Sender Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    To (Recipient Name / Title)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya / Rahul / Mom"
                    className="w-full text-xs p-3 border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    From (Sender Name)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Ankit / Your Best Friend"
                    className="w-full text-xs p-3 border border-stone-300 bg-white"
                  />
                </div>
              </div>

              {/* Message Note */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Handwritten Greeting Card Message
                </label>
                <textarea
                  rows={3}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-300 bg-white font-seasons leading-relaxed"
                />
              </div>

              {/* Quick Preset Messages */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-stone-500 font-medium">Quick Suggestions:</span>
                {[
                  'Happy Birthday! Wishing you lots of chocolates, laughter & smiles! 🎂',
                  'Happy Anniversary to the most special person in my life ❤️',
                  'A sweet celebration to brighten your day! Keep shining bright ✨',
                  'Cheers to endless memories, laughter, and lifelong friendship! 🥂',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCardMessage(preset);
                      triggerRomanticConfetti(0.5, 0.5);
                    }}
                    className="text-[10px] text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 border border-amber-300 cursor-pointer"
                  >
                    "{preset.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => {
                  setCurrentStage(2);
                  triggerGoldConfetti(0.5, 0.4);
                }}
                className="text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Slots
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentStage(4);
                  triggerGoldConfetti(0.5, 0.4);
                }}
                className="bg-[#B8860B] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#8C6821] flex items-center gap-2 shadow-sm cursor-pointer"
              >
                Next: Review & WhatsApp Order <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* STAGE 4: SUMMARY & DIRECT 1-CLICK WHATSAPP ORDER */}
        {currentStage === 4 && (
          <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Check className="w-3.5 h-3.5" /> Your Custom Hamper is Ready!
              </div>
              <h2 className="font-seasons text-2xl sm:text-3xl font-bold text-[#141414]">
                Hamper Summary & Order Confirmation
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Please review your selected items, luxury packaging, and personalized greeting below. Send your order via WhatsApp with one tap:
              </p>
            </div>

            {/* Bill / Summary Card */}
            <div className="bg-white border-2 border-[#D4AF37] p-5 sm:p-8 shadow-lg relative">
              <div className="border-b border-stone-200 pb-4 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPackaging.imageUrl}
                    alt={selectedPackaging.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover border border-[#D4AF37]"
                  />
                  <div>
                    <h3 className="font-seasons text-base sm:text-lg font-bold text-[#141414]">
                      Hamper Queen Atelier Receipt
                    </h3>
                    <p className="text-xs text-stone-500">
                      Custom Order • Contact: +91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300">
                  {selectedPackaging.name}
                </span>
              </div>

              {/* Chosen Items Breakdown */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Selected Items ({filledItems.length} of {selectedPackaging.slotCount} slots)
                </h4>

                {filledItems.length === 0 ? (
                  <p className="text-xs text-red-600 italic">No items have been selected yet.</p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {filledItems.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 font-bold">#{idx + 1}</span>
                          <span className="font-bold text-stone-800">{item.name}</span>
                          {item.isPhoto && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 border border-indigo-200">
                              Polaroid Photo
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-stone-700">~₹{item.unitPriceApprox}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personalization Details */}
              <div className="bg-stone-50 p-4 border border-stone-200 mb-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Ribbon Style:</span>
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: selectedRibbon.hex }} />
                    {selectedRibbon.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Outer Wrap:</span>
                  <span className="font-bold text-stone-900">{wrappingSheet}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Cushion Bed:</span>
                  <span className="font-bold text-stone-900">{cushionBed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Royal Wax Seal:</span>
                  <span className="font-bold text-stone-900">{hasWaxSeal ? 'Yes (Imperial Crest)' : 'None'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Occasion:</span>
                  <span className="font-bold text-stone-900">{selectedOccasion}</span>
                </div>
                {recipientName && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Recipient (To):</span>
                    <span className="font-bold text-stone-900">{recipientName}</span>
                  </div>
                )}
                {senderName && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Sender (From):</span>
                    <span className="font-bold text-stone-900">{senderName}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-600 block mb-0.5">Card Message:</span>
                  <p className="font-seasons italic text-stone-800">"{cardMessage}"</p>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="border-t-2 border-stone-200 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Total Approximate Price</span>
                  <span className="text-xl font-extrabold text-[#B8860B]">₹{estimatedGrandTotal}</span>
                </div>
                <span className="text-[11px] text-stone-500 max-w-xs text-right">
                  Final price is confirmed on WhatsApp based on packaging and customization availability.
                </span>
              </div>
            </div>

            {/* High Impact WhatsApp Button */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrderOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-6 h-6" />
                Place Order Directly on WhatsApp (+91 8080580105)
              </motion.button>

              <p className="text-xs text-center text-stone-500">
                Your WhatsApp message will be automatically filled with all selected chocolates, photo memories, and greeting card details.
              </p>
            </div>

            {/* Back to Edit */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setCurrentStage(2);
                  triggerGoldConfetti(0.5, 0.4);
                }}
                className="text-xs font-bold text-stone-600 hover:text-black underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Modify Chocolates / Edit Slots
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Customizer Modal */}
      <PhotoCustomizerModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        targetSlotIndex={photoModalTargetSlot}
        onSavePhoto={handleSavePhotoToSlot}
      />
    </div>
  );
};
