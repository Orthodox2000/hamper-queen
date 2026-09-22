import React from 'react';
import { Sparkles, Crown, CheckCircle2, Heart, Gift, Package, Flower2, Gem, Coffee } from 'lucide-react';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct } from '../data/hamperQueenCatalog';
import { BoxTheme, BOX_THEMES } from '../data/boxThemes';

interface HamperQueenGraphicProps {
  graphicId: string;
  product?: HamperQueenProduct;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HamperQueenGraphic: React.FC<HamperQueenGraphicProps> = ({
  graphicId,
  product: propProduct,
  className = '',
  size = 'md',
}) => {
  // Find product details
  const product: HamperQueenProduct =
    propProduct ||
    HAMPER_QUEEN_PRODUCTS.find((p: HamperQueenProduct) => p.graphicId === graphicId) ||
    HAMPER_QUEEN_PRODUCTS[0];

  const isWomenAccessory = product.id.includes('women-accessory') || graphicId.includes('women-accessory');
  const isKitkat = product.id.includes('kitkat') || graphicId.includes('kitkat');
  const isDarkFantasy = product.id.includes('dark-fantasy') || graphicId.includes('dark-fantasy');
  const isKinderJoy = product.id.includes('kinder-joy') || graphicId.includes('kinder-joy');
  const isPhotoHamper = product.id.includes('photo') || graphicId.includes('photo');
  const isCoffee = product.id.includes('coffee') || graphicId.includes('coffee');
  const isDryfruits = product.id.includes('saffron') || product.id.includes('dryfruit') || graphicId.includes('saffron');
  const isMen = product.id.includes('men') || graphicId.includes('men');
  const isBaby = product.id.includes('baby') || graphicId.includes('baby');
  const isChocolate = product.id.includes('chocolate') || product.id.includes('silk') || graphicId.includes('chocolate');
  const isMini = product.id.includes('pocket-delight') || product.id.includes('sweet-duo') || product.id.includes('celebration-trio');

  // Container sizing
  const containerHeight = {
    sm: 'h-32 sm:h-36',
    md: 'h-52 sm:h-60',
    lg: 'h-64 sm:h-72',
  }[size];

  // Derive Box Theme Styles (shared with the 3D gift box)
  const style: BoxTheme = isWomenAccessory
    ? BOX_THEMES.women
    : isKitkat
    ? BOX_THEMES.chocolate
    : isDarkFantasy
    ? BOX_THEMES.obsidian
    : isMen
    ? BOX_THEMES.men
    : isCoffee
    ? BOX_THEMES.coffee
    : isBaby
    ? BOX_THEMES.baby
    : isMini
    ? BOX_THEMES.mini
    : BOX_THEMES.royal;

  return (
    <div
      className={`relative w-full ${containerHeight} rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-md flex flex-col justify-between p-3 text-white select-none ${className}`}
      style={{
        background: 'linear-gradient(145deg, #1C1814 0%, #100E0C 50%, #080706 100%)',
      }}
    >
      {/* 1. Outer Box Rim / Lid Top Bar */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pb-1 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#800E17] border border-[#DFBA54] flex items-center justify-center text-[8px] font-cinzel font-black text-[#F3E5AB] shadow-xs">
            HQ
          </div>
          <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-amber-200 tracking-wider">
            {product.itemCode}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[8px] sm:text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-white/90">
            {style.boxLabel}
          </span>
        </div>
      </div>

      {/* 2. THE VISIBLE LUXURY GIFT BOX CONTAINER & ASSEMBLED ITEMS */}
      <div
        className={`relative z-10 my-auto w-full rounded-xl border-2 ${style.boxBorder} ${style.boxBg} p-2 shadow-inner overflow-hidden flex flex-col justify-between`}
      >
        {/* Box Interior Velvet Bedding Texture */}
        <div className={`absolute inset-0 ${style.bedBg} opacity-85 pointer-events-none`} />
        <div className="absolute inset-0 bg-[radial-gradient(#DFBA54_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none" />

        {/* Satin Cross Ribbon Simulation on Box Rim */}
        <div
          className="absolute top-0 right-3 w-4 h-full opacity-35 pointer-events-none"
          style={{ backgroundColor: style.ribbonHex }}
        />

        {/* Box Content Heading */}
        <div className="relative z-10 flex items-center justify-between mb-1.5">
          <h4 className="font-cinzel font-bold text-xs sm:text-sm text-white drop-shadow-sm truncate">
            {product.name}
          </h4>
          <span className="text-[9px] font-bold text-emerald-300 shrink-0 ml-1">
            {product.approxPrice}
          </span>
        </div>

        {/* Word-Based Assembled Items Packaged Inside the Box */}
        <div className="relative z-10 grid grid-cols-2 gap-1.5 w-full">
          {isWomenAccessory ? (
            <>
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Gem className="w-3 h-3 text-emerald-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-emerald-200 uppercase tracking-tight truncate">
                    Earrings &amp; Studs Card
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Fine Statement Jewelry</span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Flower2 className="w-3 h-3 text-rose-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-rose-200 uppercase tracking-tight truncate">
                    Blush Pastel Roses
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Preserved Petal Spray</span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Pearl Hairpins &amp; Clips
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Rhinestone Accents</span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Gift className="w-3 h-3 text-teal-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-teal-200 uppercase tracking-tight truncate">
                    Mint Satin Bow
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Hand-Tied Rosette</span>
                </div>
              </div>
            </>
          ) : isKitkat ? (
            <>
              <div className="bg-red-950/90 border border-red-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">🍫</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-red-200 uppercase tracking-tight truncate">
                    KitKat Crisp Bars
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">4-Finger Tiered Stack</span>
                </div>
              </div>

              <div className="bg-red-950/90 border border-red-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Flower2 className="w-3 h-3 text-rose-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-rose-200 uppercase tracking-tight truncate">
                    Velvet Rose Buds
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Floral Embellishment</span>
                </div>
              </div>

              <div className="bg-red-950/90 border border-red-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">🎀</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-pink-200 uppercase tracking-tight truncate">
                    Fuchsia Satin Rosette
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Artisanal Azure Wrap</span>
                </div>
              </div>

              <div className="bg-red-950/90 border border-red-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">💌</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Calligraphy Tag
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Personalized Blessing</span>
                </div>
              </div>
            </>
          ) : isDarkFantasy ? (
            <>
              <div className="bg-amber-950/80 border border-amber-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">🍪</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Dark Fantasy Choco Fills
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Molten Lava Cookies</span>
                </div>
              </div>

              <div className="bg-amber-950/80 border border-amber-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Gold Gilded Accents
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Charcoal Tissue Wrap</span>
                </div>
              </div>

              <div className="bg-amber-950/80 border border-amber-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">✨</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Belgian Cocoa Truffles
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Golden Foil Sprigs</span>
                </div>
              </div>

              <div className="bg-amber-950/80 border border-amber-500/40 rounded-md p-1 flex items-center gap-1.5 shadow-xs">
                <span className="text-[10px]">👑</span>
                <div className="truncate">
                  <span className="block text-[8px] font-bold text-amber-200 uppercase tracking-tight truncate">
                    Atelier Wax Seal
                  </span>
                  <span className="block text-[7px] text-white/70 truncate">Imperial Crest</span>
                </div>
              </div>
            </>
          ) : (
            // Default Rich Hamper Items Display
            <>
              {product.itemsIncluded.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/60 border border-amber-400/30 rounded-md p-1 flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                  <span className="text-[8px] font-medium text-amber-100 truncate">
                    {item}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 3. Footer: Free Delivery & Order Guarantee */}
      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-1 text-emerald-300 font-semibold">
          <Sparkles className="w-2.5 h-2.5 text-emerald-300 shrink-0" />
          <span>FREE Delivery Above ₹499</span>
        </div>
        <span className="text-amber-200/90 font-serif italic">
          Custom Gift Packaging
        </span>
      </div>
    </div>
  );
};
