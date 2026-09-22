import React from 'react';
import { X, Trash2, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { CustomHamper } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';

interface HamperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customHamper: CustomHamper;
  onRemoveItem: (index: number) => void;
  onOpenAtelier: () => void;
  onOpenBooking?: () => void;
}

export const HamperDrawer: React.FC<HamperDrawerProps> = ({
  isOpen,
  onClose,
  customHamper,
  onRemoveItem,
  onOpenAtelier,
  onOpenBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#C5A059]/70 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#EADFC7] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#141414] text-[#DFBA54] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#141414]">
                  Custom Hamper Tray
                </h3>
                <p className="text-xs text-[#787163]">
                  {customHamper.vessel.name} ({customHamper.items.length}/{customHamper.vessel.capacity} items)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F2ECE0] text-[#554F42] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {customHamper.items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F3EFE6] text-[#C5A059] mx-auto flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#141414]">
                  Your Tray is Currently Empty
                </h4>
                <p className="font-cormorant text-xs text-[#6B6557] max-w-xs mx-auto">
                  Select artisanal Ecuadorian stems, 24K gold truffles, or crystal flutes from our collection.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAtelier();
                  }}
                  className="mt-2 px-5 py-3 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold uppercase tracking-wider border border-[#C5A059] cursor-pointer"
                >
                  Open Atelier Builder
                </button>
              </div>
            ) : (
              customHamper.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-2xl border border-[#E5DAC2] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="w-14 h-14 bg-[#FAF9F5] rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                    <ItemGraphic id={item.imageSvgId} size="sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-cinzel text-xs font-bold text-[#141414] truncate">
                      {item.name}
                    </h5>
                    <p className="font-cormorant text-xs text-[#6B6557] truncate">
                      {item.subtitle}
                    </p>
                    <span className="text-[10px] text-[#8C6821] font-semibold">
                      ✦ {item.estimatedTier} Tier
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-1.5 text-[#800E17] hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {customHamper.items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EADFC7] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#554F42]">
                <span>Presentation Vessel:</span>
                <strong className="text-[#141414]">{customHamper.vessel.name}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-[#554F42]">
                <span>Ribbon & Seal:</span>
                <span className="font-semibold text-[#800E17]">
                  {customHamper.ribbon.name.split(' ')[0]} • {customHamper.waxSeal.stampDesign.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {onOpenBooking && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="w-full py-4 rounded-full bg-[#141414] hover:bg-[#252525] text-[#DFBA54] text-xs font-cinzel font-bold uppercase tracking-wider border border-[#D4AF37] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Book & Pinpoint Delivery</span>
                    <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenAtelier();
                  }}
                  className="w-full py-3 rounded-full bg-white hover:bg-[#FAF9F5] text-[#554F42] text-xs font-semibold uppercase tracking-wider border border-[#E5DAC2] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Customize in Atelier Studio</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
