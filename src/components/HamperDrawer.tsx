import React, { useMemo } from 'react';
import { X, Trash2, ArrowRight, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CustomHamper } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';

interface HamperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customHamper: CustomHamper;
  onRemoveItem: (itemId: string) => void;
  onIncreaseItem: (itemId: string) => void;
  onDecreaseItem: (itemId: string) => void;
  onClearCart: () => void;
  onOpenAtelier: () => void;
  onOpenBooking?: () => void;
}

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 49;

interface CartLine {
  id: string;
  name: string;
  subtitle: string;
  tier: string;
  imageSvgId: string;
  unitValue: number;
  qty: number;
}

export const HamperDrawer: React.FC<HamperDrawerProps> = ({
  isOpen,
  onClose,
  customHamper,
  onRemoveItem,
  onIncreaseItem,
  onDecreaseItem,
  onClearCart,
  onOpenAtelier,
  onOpenBooking,
}) => {
  const lines: CartLine[] = useMemo(() => {
    const map = new Map<string, CartLine>();
    customHamper.items.forEach((item) => {
      const existing = map.get(item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          subtitle: item.subtitle,
          tier: item.estimatedTier,
          imageSvgId: item.imageSvgId,
          unitValue: item.approximateUnitValue ?? 0,
          qty: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [customHamper.items]);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitValue * line.qty, 0),
    [lines]
  );
  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + delivery;
  const totalQty = customHamper.items.length;

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
                  Your Hamper Cart
                </h3>
                <p className="text-xs text-[#787163]">
                  {totalQty === 0 ? 'Cart is empty' : `${totalQty} item${totalQty === 1 ? '' : 's'} · ${customHamper.vessel.name}`}
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
            {lines.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F3EFE6] text-[#C5A059] mx-auto flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#141414]">
                  Your Cart is Currently Empty
                </h4>
                <p className="font-cormorant text-xs text-[#6B6557] max-w-xs mx-auto">
                  Add artisanal Ecuadorian stems, 24K gold truffles, or crystal flutes from our collection.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAtelier();
                  }}
                  className="mt-2 px-5 py-3 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold uppercase tracking-wider border border-[#C5A059] cursor-pointer"
                >
                  Browse & Add Items
                </button>
              </div>
            ) : (
              <>
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className="bg-white p-3 rounded-2xl border border-[#E5DAC2] shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-14 h-14 bg-[#FAF9F5] rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                        <ItemGraphic id={line.imageSvgId} size="sm" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-cinzel text-xs font-bold text-[#141414] truncate">
                          {line.name}
                        </h5>
                        <p className="font-cormorant text-xs text-[#6B6557] truncate">
                          {line.subtitle}
                        </p>
                        <span className="text-[10px] text-[#8C6821] font-semibold">
                          ✦ {line.tier} Tier
                        </span>
                        {line.unitValue > 0 && (
                          <span className="text-[10px] text-[#554F42] font-sans ml-1.5">
                            ₹{line.unitValue.toLocaleString('en-IN')} each
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onRemoveItem(line.id);
                          royaleLogger.action('HamperDrawer', `Removed line: ${line.name}`);
                        }}
                        className="p-1.5 text-[#800E17] hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer flex-shrink-0"
                        title="Remove line from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDecreaseItem(line.id)}
                          className="w-7 h-7 rounded-full bg-[#F3EFE6] hover:bg-[#EADFC7] text-[#554F42] flex items-center justify-center transition-colors cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-[#141414] w-5 text-center">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => onIncreaseItem(line.id)}
                          className="w-7 h-7 rounded-full bg-[#141414] hover:bg-[#252525] text-[#DFBA54] flex items-center justify-center transition-colors cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-cinzel font-bold text-[#141414]">
                        {line.unitValue > 0
                          ? `₹${(line.unitValue * line.qty).toLocaleString('en-IN')}`
                          : 'Value on request'}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    onClearCart();
                    royaleLogger.action('HamperDrawer', 'Cart cleared');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FBEBEB] hover:bg-[#F7DDDD] text-[#800E17] text-xs font-semibold uppercase tracking-wider border border-[#E9C7C7] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {lines.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EADFC7] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#554F42]">
                <span>Items Subtotal</span>
                <strong className="text-[#141414]">₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-[#554F42]">
                <span>Delivery Fee</span>
                <strong className={delivery === 0 ? 'text-[#1E7B3C]' : 'text-[#141414]'}>
                  {delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}
                </strong>
              </div>
              {delivery > 0 && (
                <p className="text-[10px] text-[#8C6821] font-sans">
                  Free delivery on orders above ₹{FREE_DELIVERY_THRESHOLD} — add more or it will be added at checkout.
                </p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[#EADFC7] text-sm">
                <span className="font-sans font-semibold text-[#554F42]">Grand Total</span>
                <strong className="font-cinzel text-lg text-[#141414]">₹{grandTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="rounded-xl bg-[#FAF9F5] border border-[#E5DAC2] px-3 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#554F42]">
                  <span>Presentation Vessel:</span>
                  <strong className="text-[#141414]">{customHamper.vessel.name}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#554F42]">
                  <span>Ribbon & Seal:</span>
                  <span className="font-semibold text-[#800E17]">
                    {customHamper.ribbon.name.split(' ')[0]} • {customHamper.waxSeal.stampDesign.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
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