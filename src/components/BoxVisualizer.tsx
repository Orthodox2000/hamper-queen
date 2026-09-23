import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PackagingSizeOption, BrandedItem } from '../data/brandedItemsData';
import { BrandedProductGraphic } from './BrandedProductGraphic';
import {
  Plus,
  X,
  Sparkles,
  Box as BoxIcon,
  Heart,
  CheckCircle2,
  Lightbulb,
  Image as ImageIcon,
  Gift,
  Eye,
  Layers,
  Flower2,
} from 'lucide-react';
import { triggerGoldConfetti } from '../utils/confetti';

interface BoxVisualizerProps {
  packaging: PackagingSizeOption;
  slots: (BrandedItem | null)[];
  activeSlotIndex: number | null;
  onSelectSlot: (index: number) => void;
  onRemoveItemFromSlot: (index: number) => void;
  onDropItemIntoSlot?: (slotIndex: number, item: BrandedItem) => void;
  onSuggestCustomItem?: (name: string, slotIndex: number) => void;
  ribbonColorHex?: string;
  hasLights?: boolean;
  hasWaxSeal?: boolean;
  onOpenPhotoModal?: (slotIndex: number) => void;
}

export const BoxVisualizer: React.FC<BoxVisualizerProps> = ({
  packaging,
  slots,
  activeSlotIndex,
  onSelectSlot,
  onRemoveItemFromSlot,
  onDropItemIntoSlot,
  onSuggestCustomItem,
  ribbonColorHex = '#D4AF37',
  hasLights = false,
  hasWaxSeal = false,
  onOpenPhotoModal,
}) => {
  const [lightsActive, setLightsActive] = useState(true);
  const [visualMode, setVisualMode] = useState<'slots' | 'exterior'>('slots');
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState<number | null>(null);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionSlot, setSuggestionSlot] = useState<number | null>(null);
  const [quickItemText, setQuickItemText] = useState('');

  const isBouquet = packaging.type === 'bouquet';
  const isPhotoBouquet = packaging.illustrationType === 'photo_bouquet';
  const isHeartBouquet = packaging.illustrationType === 'heart_bouquet';
  const isVelvetHatbox = packaging.illustrationType === 'velvet_hatbox';
  const isAcrylicChest = packaging.illustrationType === 'acrylic_chest';
  const filledCount = slots.filter(Boolean).length;
  const totalCount = packaging.slotCount;
  const isFull = filledCount === totalCount;

  // Detect if lights are enabled
  const hasInstalledLights = hasLights || slots.some((item) => item?.category === 'lights');

  // Responsive Grid Columns that fit cleanly
  const getGridCols = () => {
    if (totalCount <= 4) return 'grid-cols-2';
    if (totalCount <= 6) return 'grid-cols-2 sm:grid-cols-3';
    if (totalCount <= 8) return 'grid-cols-2 sm:grid-cols-4';
    if (totalCount <= 9) return 'grid-cols-3 sm:grid-cols-3 md:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'; // 12 slots
  };

  // Mini "type your own item" suggestion form (styled like an empty tile slot)
  const renderSuggestionInput = (slotIndex: number) => (
    <div
      className="w-full mt-2 pt-2 border-t border-dashed border-[#D8CCA8]"
      onClick={(e) => e.stopPropagation()}
      onDragOver={(e) => e.stopPropagation()}
      onDragLeave={(e) => e.stopPropagation()}
      onDrop={(e) => e.stopPropagation()}
    >
      {suggestionSlot === slotIndex ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const name = suggestionText.trim();
            if (name && onSuggestCustomItem) {
              onSuggestCustomItem(name, slotIndex);
              setSuggestionText('');
              setSuggestionSlot(null);
            }
          }}
          className="space-y-1.5"
        >
          <input
            autoFocus
            type="text"
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            placeholder="Type your own item…"
            className="w-full text-[10px] px-2 py-1.5 rounded-md border border-[#D8CCA8] bg-white text-[#141414] placeholder:text-stone-400 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 outline-none"
          />
          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              className="flex-1 px-2 py-1.5 rounded-md bg-[#B8860B] hover:bg-[#8C6821] text-white text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer"
            >
              Send Suggestion
            </button>
            <button
              type="button"
              onClick={() => {
                setSuggestionSlot(null);
                setSuggestionText('');
              }}
              className="px-2 py-1.5 rounded-md bg-white border border-[#E5DAC2] text-[#7A7264] text-[10px] font-bold uppercase transition-colors cursor-pointer hover:bg-[#FAF8F2]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSuggestionSlot(slotIndex);
          }}
          className="w-full py-1.5 rounded-md border border-[#D8CCA8] bg-white/70 hover:bg-[#FAF7F0] hover:border-[#B8860B] text-[10px] font-semibold text-[#8C6821] transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#B8860B]" />
          Need something else? Suggest your own item…
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-2xl border border-[#D4AF37]/30 shadow-lg overflow-hidden transition-all duration-300">
      
      {/* 1. Header Bar: Hamper Thumbnail, Title & Mode Switcher */}
      <div className="bg-[#FAF9F5] border-b border-[#E8E1CE] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Real Outer Hamper Image Thumbnail with slight rounding */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl border border-[#D4AF37]/50 overflow-hidden bg-white shadow-xs">
            <img
              src={packaging.imageUrl}
              alt={packaging.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {packaging.popularBadge && (
              <span className="absolute bottom-0 inset-x-0 bg-[#B8860B] text-white text-[7.5px] font-bold text-center py-0.5 uppercase tracking-wide">
                {packaging.popularBadge.split(' ')[0]}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-seasons text-base sm:text-xl font-bold text-[#141414]">
                {packaging.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3EFE6] text-[#8C6821] border border-[#D8CCA8]">
                {packaging.slotCount} Slots
              </span>
            </div>
            <p className="text-xs text-[#6B6559] font-medium mt-0.5">
              {packaging.dimensions} • {packaging.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: View Mode & Lights Switch */}
        <div className="flex items-center gap-2">
          {/* Toggle Exterior vs Interior Slots with slight rounding */}
          <div className="inline-flex p-1 bg-[#EFEBE1] rounded-xl border border-[#D8CCA8] text-xs">
            <button
              onClick={() => {
                setVisualMode('slots');
                triggerGoldConfetti(0.5, 0.4);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                visualMode === 'slots'
                  ? 'bg-[#141414] text-[#F3E5AB] shadow-xs'
                  : 'text-[#5C5649] hover:text-[#141414]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arrange Slots ({filledCount}/{totalCount})</span>
            </button>
            <button
              onClick={() => {
                setVisualMode('exterior');
                triggerGoldConfetti(0.5, 0.4);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                visualMode === 'exterior'
                  ? 'bg-[#141414] text-[#F3E5AB] shadow-xs'
                  : 'text-[#5C5649] hover:text-[#141414]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Outer Presentation</span>
            </button>
          </div>

          {/* Fairy Lights Toggle Switch */}
          {hasInstalledLights && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setLightsActive(!lightsActive);
                if (!lightsActive) triggerGoldConfetti(0.5, 0.4);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lightsActive
                  ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#B45309] shadow-xs'
                  : 'bg-[#F2ECE0] border-[#D8CCA8] text-[#7A7365]'
              }`}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${lightsActive ? 'text-amber-500 fill-amber-400 animate-pulse' : ''}`} />
              <span>{lightsActive ? 'Lights ON' : 'Lights OFF'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 2. Visual Content Area */}
      {visualMode === 'exterior' ? (
        /* EXTERIOR SHOWCASE: Full Real Hamper Image Preview with slight rounding */
        <div className="relative p-6 sm:p-8 bg-[#181614] text-white flex flex-col sm:flex-row items-center gap-6 min-h-[340px]">
          <div className="w-full sm:w-1/2 h-64 sm:h-80 relative rounded-xl overflow-hidden border border-[#D4AF37]/60 shadow-2xl">
            <img
              src={packaging.imageUrl}
              alt={packaging.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

            {/* Satin Ribbon Band */}
            <div
              className="absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-white/20"
              style={{ backgroundColor: ribbonColorHex }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{packaging.name}</span>
            </div>

            {/* Wax Seal Stamp */}
            {hasWaxSeal && (
              <div className="absolute bottom-3.5 right-3.5 w-11 h-11 rounded-full bg-[#800E17] border-2 border-[#DFBA54] flex items-center justify-center shadow-xl">
                <span className="text-[11px] font-cinzel font-bold text-[#F3E5AB]">HQ</span>
              </div>
            )}
          </div>

          <div className="w-full sm:w-1/2 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#DFBA54] uppercase tracking-widest">
                Artisan Hamper Exterior View
              </span>
              <h4 className="font-seasons text-2xl sm:text-3xl font-bold text-white mt-1">
                {packaging.name}
              </h4>
              <p className="text-stone-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-cormorant">
                {packaging.subtitle}. Delivered in signature Hamper Queen packaging with handcrafted satin ribbons, inner bedding fill, and personalized calligraphy wax seal.
              </p>
            </div>

            <div className="bg-[#24211E] rounded-xl p-4 border border-[#3D3730] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Dimensions:</span>
                <span className="font-bold text-white">{packaging.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Slots Count:</span>
                <span className="font-bold text-[#F3E5AB]">{packaging.slotCount} Items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Price Range:</span>
                <span className="font-bold text-emerald-400">{packaging.approxPriceRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Occasion Best Fit:</span>
                <span className="font-semibold text-stone-300">{packaging.recommendedFor}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setVisualMode('slots');
                triggerGoldConfetti(0.5, 0.5);
              }}
              className="w-full py-3 rounded-xl bg-[#B8860B] hover:bg-[#8C6821] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-[#DFBA54]"
            >
              <Layers className="w-4 h-4" /> Open Hamper & Arrange Items ({filledCount}/{totalCount} Filled)
            </button>
          </div>
        </div>
      ) : isBouquet ? (
        /* ====================================================
           REALISTIC FLORAL & CHOCOLATE BOUQUET STAGE
           Artisanal cone wrapping with floral spray & satin bow
           ==================================================== */
        <div className="relative p-4 sm:p-8 bg-gradient-to-b from-[#FFF5F7] via-[#FAF6F0] to-[#F5EDE3] overflow-hidden">
          
          {/* Subtle floral watermark in background */}
          <div className="absolute top-2 right-4 text-rose-200/40 pointer-events-none">
            <Flower2 className="w-32 h-32" />
          </div>

          {/* Bouquet Outer Wrapper Header Badge */}
          <div className="relative z-10 flex items-center justify-between mb-4 pb-2 border-b border-[#EADFC7]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8C6821] uppercase tracking-wider flex items-center gap-1.5">
                <Flower2 className="w-4 h-4 text-rose-500" />
                <span>Handcrafted Bouquet Arrangement</span>
              </span>
              {isPhotoBouquet && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  Only Images & Lights
                </span>
              )}
            </div>
            <span className="text-xs text-[#7A7264] font-serif italic">
              {filledCount} of {totalCount} blooms & treats placed
            </span>
          </div>

          {/* Active Fairy Lights Twinkle on Bouquet */}
          {hasInstalledLights && lightsActive && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-300/15 via-yellow-200/10 to-amber-300/20 z-0">
              <div className="absolute top-4 left-10 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-400 animate-ping" />
              <div className="absolute top-16 right-12 w-2 h-2 bg-yellow-200 rounded-full shadow-lg shadow-yellow-300 animate-ping delay-200" />
              <div className="absolute bottom-16 left-20 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-lg shadow-yellow-400 animate-ping delay-500" />
              <div className="absolute top-28 right-24 w-2 h-2 bg-yellow-100 rounded-full shadow-lg shadow-yellow-200 animate-ping delay-700" />
            </div>
          )}

          {/* Bouquet Arrangement Cone Framing */}
          <div className="relative z-10 max-w-2xl mx-auto rounded-3xl p-4 sm:p-6 bg-white/80 backdrop-blur-xs border border-[#E8DFC9] shadow-md">
            
            {/* Bouquet Top Scalloped Header / Kraft Paper Wrap Rim */}
            <div className="w-full flex items-center justify-center gap-2 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-1" />
              <span className="text-[10px] font-cinzel font-bold tracking-widest uppercase text-[#8C6821] px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#D4AF37]/40">
                ✦ Crown Floral Crest ✦
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-1" />
            </div>

            {/* Slots Grid with Bouquet Fan Placement */}
            <div className={`grid gap-3 sm:gap-4 ${getGridCols()} relative z-10`}>
              {slots.map((item, index) => {
                const isSelected = activeSlotIndex === index;
                const slotNumber = index + 1;

                if (item) {
                  return (
                    <motion.div
                      key={`bouquet-filled-${index}-${item.id}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onSelectSlot(index);
                        triggerGoldConfetti(0.5, 0.5);
                      }}
                      className={`group relative bg-white rounded-xl border-2 p-2 sm:p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                        isSelected
                          ? 'border-[#B8860B] ring-2 ring-[#B8860B]/50 bg-[#FFFDF7]'
                          : 'border-[#E5DAC2] hover:border-[#B8860B]'
                      }`}
                    >
                      {/* Top Row */}
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-bold text-[#8C6821] bg-[#FAF7F0] px-1.5 py-0.5 rounded-md border border-[#E8DFC9]">
                          Stem #{slotNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          {item.isPhoto && onOpenPhotoModal && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPhotoModal(index);
                              }}
                              title="Edit Photo or Caption"
                              className="p-1 text-indigo-700 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                            >
                              <ImageIcon className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveItemFromSlot(index);
                            }}
                            title="Remove stem"
                            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Graphic Container */}
                      <div className="h-16 sm:h-20 w-full flex items-center justify-center my-0.5 overflow-hidden">
                        <BrandedProductGraphic
                          item={item}
                          size="slot"
                          isLit={hasInstalledLights && lightsActive}
                        />
                      </div>

                      {/* Item Information */}
                      <div className="w-full text-center mt-1 pt-1 border-t border-[#F0EAE0]">
                        <span
                          className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded text-white truncate max-w-[85%]"
                          style={{ backgroundColor: item.colorScheme.bg }}
                        >
                          {item.brand}
                        </span>
                        <h4 className="text-[11px] font-bold text-[#141414] truncate mt-0.5" title={item.name}>
                          {item.simpleName}
                        </h4>
                        <span className="text-[11px] font-extrabold text-[#8C6821]">
                          INR {item.unitPriceApprox}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                // EMPTY STEM SLOT
                return (
                  <motion.div
                    key={`bouquet-empty-${index}`}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onSelectSlot(index);
                      triggerGoldConfetti(0.5, 0.5);
                    }}
                    className={`relative rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[135px] sm:min-h-[155px] ${
                      isSelected
                        ? 'border-[#B8860B] bg-[#FFFBEB] ring-2 ring-[#B8860B]/50'
                        : 'border-[#D8CCA8] hover:border-[#B8860B] bg-white/70 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <span className="absolute top-1.5 left-2 text-[9px] font-bold text-[#8C6821]">
                      Stem #{slotNumber}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all mb-1.5 ${
                        isSelected
                          ? 'bg-[#141414] text-[#F3E5AB] border-[#B8860B]'
                          : 'bg-[#F9F6EE] text-[#8C6821] border-[#D8CCA8]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-[#141414]">
                      {isPhotoBouquet ? 'Attach Photo' : 'Place Item'}
                    </span>
                    <span className="text-[10px] text-[#7A7264] mt-0.5">
                      {isPhotoBouquet ? 'Polaroid Print' : 'Treat or Flower'}
                    </span>

                    {renderSuggestionInput(index)}
                  </motion.div>
                );
              })}
            </div>

            {/* Bouquet Stem Base & Tied Silk Ribbon Bow */}
            <div className="mt-6 pt-4 border-t border-[#E8DFC9] flex flex-col items-center justify-center text-center">
              {/* Tied 3D Ribbon Bow at the stem handle */}
              <div
                className="px-5 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-md border border-white/30"
                style={{ backgroundColor: ribbonColorHex }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Hand-Tied Bouquet Ribbon</span>
                {hasWaxSeal && (
                  <span className="w-4 h-4 rounded-full bg-[#800E17] border border-amber-300 text-[8px] flex items-center justify-center ml-1">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7A7264] font-serif italic mt-2">
                Hand-gathered with floral sticks, imported tissue wraps, and golden ribbon bow.
              </p>

              {/* "+ Much More In Every Bouquet" constant chip */}
              <div className="inline-flex items-center justify-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full bg-[#141414]/90 border border-[#DFBA54]/70 text-[10px] font-bold text-[#F3E5AB] tracking-widest uppercase shadow-md">
                <Gift className="w-3 h-3 text-[#DFBA54]" />
                <span>+ Much More In Every Bouquet</span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ====================================================
           REALISTIC GIFT BOX / HATBOX / CRATE INTERIOR
           ==================================================== */
        <div
          className={`p-4 sm:p-5 transition-all duration-300 relative ${
            isVelvetHatbox ? 'bg-[#FDF2F8]/60' : isAcrylicChest ? 'bg-[#F0FDFA]/60' : 'bg-[#FAF9F5]'
          }`}
        >
          {/* Active Fairy Lights Twinkle on Box Interior */}
          {hasInstalledLights && lightsActive && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-300/15 via-yellow-200/10 to-amber-300/20 z-0">
              <div className="absolute top-2 left-6 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-400 animate-ping" />
              <div className="absolute top-8 right-10 w-2 h-2 bg-yellow-200 rounded-full shadow-lg shadow-yellow-300 animate-ping delay-300" />
              <div className="absolute bottom-4 left-16 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-lg shadow-yellow-400 animate-ping delay-700" />
            </div>
          )}

          {/* Semi-2D Rigid Hamper Box Tray with Gold Bevel & Velvet Bedding */}
          <div className="relative rounded-2xl border-4 border-[#D4AF37]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F3ECE0] p-3 sm:p-5 shadow-[inset_0_4px_16px_rgba(0,0,0,0.1),0_8px_25px_rgba(0,0,0,0.08)]">
            
            {/* Shredded Crinkle Bedding Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#DFBA54_1px,transparent_1px)] [background-size:10px_10px] opacity-15 pointer-events-none rounded-xl" />

            {/* Drag & Drop Guidance Banner */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E8DFC9] text-xs">
              <div className="flex items-center gap-1.5 text-[#8C6821] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Semi-2D Hamper Cavity: Drag items from catalog directly onto any slot</span>
              </div>
              <span className="text-[11px] text-[#7A7264] hidden sm:inline font-sans">
                (Or click any item to place)
              </span>
            </div>

            {/* Slots Grid with semi-2D compartment styling */}
            <div className={`grid gap-3 sm:gap-4 ${getGridCols()} relative z-10`}>
              {slots.map((item, index) => {
                const isSelected = activeSlotIndex === index;
                const isDragOver = dragOverSlotIndex === index;
                const slotNumber = index + 1;

                if (item) {
                  // FILLED SLOT
                  return (
                    <motion.div
                      key={`filled-${index}-${item.id}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'copy';
                        if (dragOverSlotIndex !== index) setDragOverSlotIndex(index);
                      }}
                      onDragLeave={() => {
                        if (dragOverSlotIndex === index) setDragOverSlotIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverSlotIndex(null);
                        try {
                          const data = e.dataTransfer.getData('application/json');
                          if (data && onDropItemIntoSlot) {
                            const droppedItem = JSON.parse(data);
                            onDropItemIntoSlot(index, droppedItem);
                          }
                        } catch (err) {
                          console.error('Failed to parse dropped item', err);
                        }
                      }}
                      onClick={() => {
                        onSelectSlot(index);
                        triggerGoldConfetti(0.5, 0.5);
                      }}
                      className={`group relative bg-white rounded-xl border-2 p-2 sm:p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
                        isDragOver
                          ? 'border-[#B8860B] ring-4 ring-[#DFBA54]/80 bg-amber-50 scale-105'
                          : isSelected
                          ? 'border-[#B8860B] ring-2 ring-[#B8860B]/50 bg-[#FFFDF7]'
                          : 'border-[#E5DAC2] hover:border-[#B8860B]'
                      }`}
                    >
                      {/* Top Row: Slot #, Photo Edit, Remove */}
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-bold text-[#8C6821] bg-[#FAF7F0] px-1.5 py-0.5 rounded-md border border-[#E8DFC9]">
                          Slot #{slotNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          {item.isPhoto && onOpenPhotoModal && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPhotoModal(index);
                              }}
                              title="Edit Photo or Caption"
                              className="p-1 text-indigo-700 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                            >
                              <ImageIcon className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveItemFromSlot(index);
                            }}
                            title="Remove item"
                            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Graphic Container with proportional scaling */}
                      <div className="h-16 sm:h-20 w-full flex items-center justify-center my-0.5 overflow-hidden">
                        <BrandedProductGraphic
                          item={item}
                          size="slot"
                          isLit={hasInstalledLights && lightsActive}
                        />
                      </div>

                      {/* Item Information */}
                      <div className="w-full text-center mt-1 pt-1 border-t border-[#F0EAE0]">
                        <span
                          className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded text-white truncate max-w-[85%]"
                          style={{ backgroundColor: item.colorScheme.bg }}
                        >
                          {item.brand}
                        </span>
                        <h4 className="text-[11px] font-bold text-[#141414] truncate mt-0.5" title={item.name}>
                          {item.simpleName}
                        </h4>
                        <span className="text-[11px] font-extrabold text-[#8C6821]">
                          INR {item.unitPriceApprox}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                // EMPTY SLOT
                return (
                  <motion.div
                    key={`empty-${index}`}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'copy';
                      if (dragOverSlotIndex !== index) setDragOverSlotIndex(index);
                    }}
                    onDragLeave={() => {
                      if (dragOverSlotIndex === index) setDragOverSlotIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlotIndex(null);
                      try {
                        const data = e.dataTransfer.getData('application/json');
                        if (data && onDropItemIntoSlot) {
                          const droppedItem = JSON.parse(data);
                          onDropItemIntoSlot(index, droppedItem);
                        }
                      } catch (err) {
                        console.error('Failed to parse dropped item', err);
                      }
                    }}
                    onClick={() => {
                      onSelectSlot(index);
                      triggerGoldConfetti(0.5, 0.5);
                    }}
                    className={`relative rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[135px] sm:min-h-[155px] ${
                      isDragOver
                        ? 'border-[#B8860B] bg-amber-100/90 ring-4 ring-[#DFBA54] scale-105 shadow-md'
                        : isSelected
                        ? 'border-[#B8860B] bg-[#FFFBEB] ring-2 ring-[#B8860B]/50'
                        : 'border-[#D8CCA8] hover:border-[#B8860B] bg-white/80 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <span className="absolute top-1.5 left-2 text-[9px] font-bold text-[#8C6821]">
                      Slot #{slotNumber}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all mb-1.5 ${
                        isDragOver
                          ? 'bg-[#B8860B] text-white border-white animate-bounce'
                          : isSelected
                          ? 'bg-[#141414] text-[#F3E5AB] border-[#B8860B]'
                          : 'bg-[#FAF7F0] text-[#8C6821] border-[#D8CCA8]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-[#141414]">
                      {isDragOver ? 'Drop Item Here!' : 'Available Slot'}
                    </span>
                    <span className="text-[10px] text-[#7A7264] mt-0.5">
                      Drag &amp; drop or click
                    </span>

                    {renderSuggestionInput(index)}
                  </motion.div>
                );
              })}
            </div>

            {/* "+ Much More In Every Box" constant chip */}
            <div className="relative z-10 mt-3 pt-3 border-t border-[#E8DFC9] flex justify-center">
              <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141414]/90 border border-[#DFBA54]/70 text-[10px] font-bold text-[#F3E5AB] tracking-widest uppercase shadow-md">
                <Gift className="w-3 h-3 text-[#DFBA54]" />
                <span>+ Much More In Every Box</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Footer Bar: Capacity Counter & Next Action */}
      <div className="bg-[#FAF9F5] border-t border-[#E8E1CE] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-[#141414]">
            <CheckCircle2
              className={`w-4 h-4 ${isFull ? 'text-emerald-600' : 'text-[#B8860B]'}`}
            />
            <span>
              {filledCount} of {totalCount} slots filled
            </span>
          </div>
          {isFull && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
              Hamper Fully Packed!
            </span>
          )}
        </div>

        {/* Always-visible "Type your own item" quick add */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = quickItemText.trim();
            if (!name || isFull || !onSuggestCustomItem) return;
            const nextEmpty = slots.findIndex((s) => !s);
            if (nextEmpty !== -1) {
              onSuggestCustomItem(name, nextEmpty);
              setQuickItemText('');
            }
          }}
          className="flex-1 min-w-[220px] max-w-md flex items-center gap-1.5 mx-auto"
        >
          <input
            type="text"
            value={quickItemText}
            onChange={(e) => setQuickItemText(e.target.value)}
            disabled={isFull}
            placeholder={isFull ? 'All slots are packed…' : 'Type your own item (auto-fills first empty slot)'}
            aria-label="Type your own item"
            className="flex-1 text-[11px] px-3 py-2 rounded-lg border bg-white text-[#141414] placeholder:text-stone-400 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 outline-none disabled:bg-[#F2ECE0] disabled:text-stone-400"
          />
          <button
            type="submit"
            disabled={isFull || !quickItemText.trim()}
            className="shrink-0 px-3 py-2 rounded-lg bg-[#B8860B] hover:bg-[#8C6821] disabled:bg-[#E0D9C8] disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer"
          >
            Add
          </button>
        </form>

        <div className="flex items-center gap-2">
          {filledCount > 0 && (
            <button
              onClick={() => {
                for (let i = 0; i < totalCount; i++) {
                  if (slots[i]) onRemoveItemFromSlot(i);
                }
              }}
              className="text-[11px] text-[#800E17] hover:underline cursor-pointer font-medium"
            >
              Clear All Slots
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
