import React, { useMemo } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
} from 'lucide-react';
import { CustomHamper } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { HamperQueenGraphic } from './HamperQueenGraphic';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct } from '../data/hamperQueenCatalog';
import { ProductCartLine } from '../store/shop-store';
import { parsePriceString, formatINR } from '../utils/pricing';
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
  productCartLines: ProductCartLine[];
  onRemoveProductLine: (productId: string) => void;
  onIncreaseProductLine: (productId: string) => void;
  onDecreaseProductLine: (productId: string) => void;
  applyCatalogOverride?: (product: HamperQueenProduct) => HamperQueenProduct;
}

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 49;

interface AtelierLine {
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
  productCartLines,
  onRemoveProductLine,
  onIncreaseProductLine,
  onDecreaseProductLine,
  applyCatalogOverride,
}) => {
  const atelierLines: AtelierLine[] = useMemo(() => {
    const map = new Map<string, AtelierLine>();
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

  const productLines = useMemo(() => {
    return productCartLines
      .map((line) => {
        const base = HAMPER_QUEEN_PRODUCTS.find((p) => p.id === line.productId);
        if (!base) return null;
        const product = applyCatalogOverride ? applyCatalogOverride(base) : base;
        return {
          productId: product.id,
          name: product.name,
          itemCode: product.itemCode,
          priceDisplay: product.approxPrice,
          priceValue: parsePriceString(product.approxPrice),
          graphicId: product.graphicId,
          product,
          qty: line.qty,
        };
      })
      .filter((l): l is NonNullable<typeof l> => Boolean(l));
  }, [productCartLines, applyCatalogOverride]);

  const subtotal = useMemo(() => {
    const products = productLines.reduce((sum, l) => sum + l.priceValue * l.qty, 0);
    const atelier = atelierLines.reduce((sum, line) => sum + line.unitValue * line.qty, 0);
    return products + atelier;
  }, [productLines, atelierLines]);

  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + delivery;
  const totalQty = atelierLines.reduce((s, l) => s + l.qty, 0) + productLines.reduce((s, l) => s + l.qty, 0);
  const hasCustomItems = atelierLines.length > 0 || customHamper.items.length > 0;
  const isEmpty = totalQty === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-100 border-l border-gold-500/70 shadow-float flex flex-col justify-between">

          {/* Drawer Header */}
          <div className="p-6 border-b border-line-strong bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ink text-gold-300 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-ink">
                  Your Hamper Cart
                </h3>
                <p className="text-xs text-stone">
                  {isEmpty ? 'Cart is empty' : `${totalQty} item${totalQty === 1 ? '' : 's'} · free delivery above INR ${FREE_DELIVERY_THRESHOLD}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-cream-200 text-cocoa transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {isEmpty ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-cream-200 text-gold-500 mx-auto flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-ink">
                  Your Cart is Currently Empty
                </h4>
                <p className="font-cormorant text-xs text-[#6B6557] max-w-xs mx-auto">
                  Add prebuilt hampers, chocolates, or builder items from our collection — then proceed straight to checkout.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAtelier();
                  }}
                  className="mt-2 px-5 py-3 rounded-full bg-ink text-gold-100 text-xs font-semibold border border-gold-500 cursor-pointer"
                >
                  Browse & Add Items
                </button>
              </div>
            ) : (
              <>
                {productLines.length > 0 && (
                  <>
                    <span className="block text-xs font-sans font-semibold text-gold-700 pt-1">
                      Prebuilt Hampers
                    </span>
                    {productLines.map((line) => (
                      <div key={line.productId} className="bg-white p-3 rounded-2xl border border-line-strong shadow-soft">
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-14 h-14 bg-cream-100 rounded-xl p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <HamperQueenGraphic graphicId={line.graphicId} product={line.product} size="sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-sans text-xs font-bold text-ink truncate">{line.name}</h5>
                            <p className="text-xs text-gold-700 font-semibold">{line.itemCode}</p>
                            <span className="text-xs text-cocoa font-sans">{line.priceDisplay} each</span>
                          </div>
                          <button
                            onClick={() => onRemoveProductLine(line.productId)}
                            className="p-1.5 text-crimson hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer flex-shrink-0"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDecreaseProductLine(line.productId)}
                              className="w-7 h-7 rounded-full bg-cream-200 hover:bg-line-strong text-cocoa flex items-center justify-center transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-bold text-ink w-5 text-center">{line.qty}</span>
                            <button
                              onClick={() => onIncreaseProductLine(line.productId)}
                              className="w-7 h-7 rounded-full bg-ink hover:bg-ink-soft text-gold-100 flex items-center justify-center transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs font-sans font-bold text-ink">{formatINR(line.priceValue * line.qty)}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {hasCustomItems && (
                  <>
                    <span className="block text-xs font-sans font-semibold text-gold-700 pt-2">
                      Atelier Custom Items
                    </span>
                    {atelierLines.map((line) => (
                      <div key={line.id} className="bg-white p-3 rounded-2xl border border-line-strong shadow-soft">
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-14 h-14 bg-cream-100 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                            <ItemGraphic id={line.imageSvgId} size="sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-sans text-xs font-bold text-ink truncate">{line.name}</h5>
                            <p className="font-cormorant text-xs text-[#6B6557] truncate">{line.subtitle}</p>
                            <span className="text-xs text-gold-700 font-semibold">✦ {line.tier} Tier</span>
                            {line.unitValue > 0 && (
                              <span className="text-xs text-cocoa font-sans ml-1.5">INR {line.unitValue.toLocaleString('en-IN')} each</span>
                            )}
                          </div>
                          <button
                            onClick={() => onRemoveItem(line.id)}
                            className="p-1.5 text-crimson hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer flex-shrink-0"
                            title="Remove line from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDecreaseItem(line.id)}
                              className="w-7 h-7 rounded-full bg-cream-200 hover:bg-line-strong text-cocoa flex items-center justify-center transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-bold text-ink w-5 text-center">{line.qty}</span>
                            <button
                              onClick={() => onIncreaseItem(line.id)}
                              className="w-7 h-7 rounded-full bg-ink hover:bg-ink-soft text-gold-100 flex items-center justify-center transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs font-sans font-bold text-ink">
                            {line.unitValue > 0 ? `INR ${(line.unitValue * line.qty).toLocaleString('en-IN')}` : 'Value on request'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <button
                  onClick={() => {
                    onClearCart();
                    royaleLogger.action('HamperDrawer', 'Cart cleared');
                  }}
                  className="w-full py-3 rounded-xl bg-[#FBEBEB] hover:bg-[#F7DDDD] text-crimson text-xs font-semibold border border-[#E9C7C7] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {!isEmpty && (
            <div className="p-6 bg-white border-t border-line-strong space-y-3">
              <div className="flex items-center justify-between text-xs text-cocoa">
                <span>Items Subtotal</span>
                <strong className="text-ink">{formatINR(subtotal)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-cocoa">
                <span>Delivery Fee</span>
                <strong className={delivery === 0 ? 'text-emerald-800' : 'text-ink'}>
                  {delivery === 0 ? 'FREE' : `INR ${delivery.toLocaleString('en-IN')}`}
                </strong>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-gold-700 font-sans">
                  Free delivery above INR {FREE_DELIVERY_THRESHOLD} — add more or it will be added at checkout.
                </p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-line-strong text-sm">
                <span className="font-sans font-semibold text-cocoa">Grand Total</span>
                <strong className="font-cinzel text-lg text-ink">{formatINR(grandTotal)}</strong>
              </div>
              {hasCustomItems && (
                <div className="rounded-xl bg-cream-100 border border-line-strong px-3 py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-cocoa">
                    <span>Presentation Vessel:</span>
                    <strong className="text-ink">{customHamper.vessel.name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-cocoa">
                    <span>Ribbon & Seal:</span>
                    <span className="font-semibold text-crimson">
                      {customHamper.ribbon.name.split(' ')[0]} • {customHamper.waxSeal.stampDesign.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                {onOpenBooking && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="w-full py-4 rounded-full bg-ink hover:bg-ink-soft text-gold-100 text-xs font-sans font-semibold shadow-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-gold-300" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenAtelier();
                  }}
                  className="w-full py-3 rounded-full bg-white hover:bg-cream-100 text-cocoa text-xs font-semibold border border-line-strong transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Customize in Hamper Studio</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};