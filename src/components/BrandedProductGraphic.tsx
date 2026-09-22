import React from 'react';
import { BrandedItem } from '../data/brandedItemsData';
import { Sparkles, Heart } from 'lucide-react';

interface BrandedProductGraphicProps {
  item: BrandedItem;
  size?: 'sm' | 'md' | 'lg' | 'slot';
  className?: string;
  isLit?: boolean;
}

export const BrandedProductGraphic: React.FC<BrandedProductGraphicProps> = ({
  item,
  size = 'md',
  className = '',
  isLit = false,
}) => {
  const dimensions = {
    sm: 'w-14 h-14',
    slot: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
  }[size];

  // 1. Polaroid Photo Keepsake Frame
  if (item.isPhoto && item.photoUrl) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <div className="w-[92%] h-[95%] bg-white p-1.5 shadow-md border border-stone-300 rounded-xs transform -rotate-1 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between">
          {/* Wooden Peg clip at top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-200 border border-amber-800/40 rounded-xs shadow-xs z-10" />
          
          <div className="relative w-full aspect-square overflow-hidden bg-stone-100 rounded-xs">
            <img
              src={item.photoUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isLit && (
              <div className="absolute inset-0 bg-yellow-200/20 mix-blend-overlay pointer-events-none animate-pulse" />
            )}
          </div>
          <div className="text-center pt-0.5 px-0.5">
            <p className="text-[7.5px] sm:text-[9px] font-seasons font-semibold text-stone-800 truncate leading-none">
              {item.photoCaption || 'Memories ❤️'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. CADBURY SILK CHOCOLATE — PURE TEXT ONLY (No wrong images!)
  const isSilk = item.id.startsWith('item-silk') || item.name.toLowerCase().includes('silk');
  if (isSilk) {
    const silkVariantLabel =
      item.id === 'item-silk-classic' ? 'Classic' :
      item.id === 'item-silk-roast-almond' ? 'Roast Almond' :
      item.id === 'item-silk-bubbly' ? 'Bubbly' :
      item.id === 'item-silk-hazelnut' ? 'Hazelnut' :
      item.simpleName.replace(/silk|chocolate|bar/gi, '').trim() || 'Silk';

    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-amber-300/50 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #28073D 0%, #461159 48%, #1B032B 100%)',
          }}
        >
          {/* Diagonal foil sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Top Brand Label */}
          <div className="relative z-10 flex items-center justify-between px-0.5 leading-none">
            <span className="font-serif italic text-amber-200 text-[8px] sm:text-[10px] tracking-wide">
              Cadbury
            </span>
            <span className="text-[6px] sm:text-[7.5px] font-bold text-amber-300/90 tracking-widest uppercase">
              DAIRY MILK
            </span>
          </div>

          {/* Centerpiece: Grand Pure Bold Gold SILK Text */}
          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-cinzel font-black text-amber-300 text-xs sm:text-base md:text-lg tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
              SILK
            </span>
            <div className="mt-0.5 inline-block px-1.5 py-0.2 rounded-xs bg-amber-400/20 border border-amber-300/40 text-[6.5px] sm:text-[8px] font-extrabold uppercase tracking-wider text-amber-100 shadow-2xs">
              {silkVariantLabel}
            </div>
          </div>

          {/* Bottom Quality Mark */}
          <div className="relative z-10 flex items-center justify-between text-[6px] sm:text-[7px] text-amber-200/80 font-medium px-0.5 leading-none">
            <span>Velvety Smooth</span>
            <span className="font-bold text-amber-300">100% Veg</span>
          </div>

          {/* Lit Glow */}
          {isLit && (
            <div className="absolute inset-0 pointer-events-none bg-yellow-300/25 mix-blend-screen animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  // 3. CADBURY DAIRY MILK CLASSIC — PURE TEXT
  if (item.id === 'item-cadbury-dairy-milk') {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-blue-400/40 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #180554 0%, #290885 50%, #12033D 100%)',
          }}
        >
          <div className="relative z-10 flex items-center justify-between px-0.5 leading-none">
            <span className="font-serif italic text-white text-[8px] sm:text-[10px]">Cadbury</span>
            <span className="text-[6px] sm:text-[7.5px] font-bold text-amber-300 uppercase tracking-widest">ORIGINAL</span>
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-cinzel font-black text-amber-300 text-xs sm:text-sm tracking-wider drop-shadow-xs leading-tight">
              DAIRY MILK
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] text-white/90 font-semibold block mt-0.5">
              Classic Bar
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-white/75 font-medium leading-none">
            Pure Milk Chocolate
          </div>
        </div>
      </div>
    );
  }

  // 4. NESTLE KITKAT — PURE TEXT
  if (item.id.includes('kitkat')) {
    const isDessert = item.id.includes('dessert');
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-red-300/60 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #B71C1C 0%, #D32F2F 50%, #8E1111 100%)',
          }}
        >
          <div className="relative z-10 flex items-center justify-between px-0.5 leading-none">
            <span className="font-serif italic text-white/90 text-[7.5px] sm:text-[9px]">Nestlé</span>
            <span className="text-[5.5px] sm:text-[7px] font-bold text-white/80 uppercase">HAVE A BREAK</span>
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-sans font-black italic text-white text-sm sm:text-base md:text-lg tracking-tighter drop-shadow-xs leading-none">
              KitKat
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-amber-200 uppercase tracking-wider block mt-0.5">
              {isDessert ? 'Dessert Delight' : '4-Finger Crisp'}
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-white/85 font-medium leading-none">
            Crispy Wafer Chocolate
          </div>
        </div>
      </div>
    );
  }

  // 5. NESTLE MILKYBAR — PURE TEXT
  if (item.id === 'item-nestle-milkybar') {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-blue-200 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #FFFFFF 0%, #F5F7FA 50%, #FFFBEB 100%)',
          }}
        >
          <div className="relative z-10 flex items-center justify-between px-0.5 leading-none">
            <span className="font-serif italic text-blue-900 text-[7.5px] sm:text-[9px]">Nestlé</span>
            <span className="text-[5.5px] sm:text-[7px] font-bold text-amber-700 uppercase">WHITE CHOCO</span>
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-sans font-black text-blue-800 text-xs sm:text-sm md:text-base tracking-tight leading-none">
              Milkybar
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] text-amber-800 font-bold block mt-0.5">
              Creamy Milk Goodness
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-stone-600 font-medium leading-none">
            With Pure Cow Milk
          </div>
        </div>
      </div>
    );
  }

  // 6. FERRERO ROCHER — PURE TEXT
  if (item.id.includes('ferrero')) {
    const isBox = item.id.includes('box');
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-amber-300 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #573B08 0%, #8C6821 40%, #D4AF37 70%, #4A3004 100%)',
          }}
        >
          <div className="relative z-10 text-[5.5px] sm:text-[7px] font-serif uppercase tracking-widest text-amber-100 leading-none">
            ITALIAN PRALINES
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-cinzel font-black text-amber-100 text-[10px] sm:text-xs md:text-sm tracking-wider drop-shadow-sm leading-tight">
              FERRERO ROCHER
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] text-amber-200/90 font-semibold block mt-0.5">
              {isBox ? 'Diamond Box (16 Pcs)' : '3 Hazelnut Spheres'}
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-amber-100/80 font-medium leading-none">
            Crispy Whole Hazelnut
          </div>
        </div>
      </div>
    );
  }

  // 7. SNICKERS BAR — PURE TEXT
  if (item.id === 'item-snickers-bar') {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-amber-900/40 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #1C0F08 0%, #351A0D 50%, #150A05 100%)',
          }}
        >
          <div className="relative z-10 text-[5.5px] sm:text-[7px] font-bold text-amber-400 uppercase tracking-widest leading-none">
            ENERGY BAR
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-sans font-black text-blue-500 text-xs sm:text-sm md:text-base tracking-wider leading-none">
              SNICKERS
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] text-amber-200 font-bold block mt-0.5">
              Peanuts & Caramel
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-stone-300 font-medium leading-none">
            Nougat • Caramel • Peanuts
          </div>
        </div>
      </div>
    );
  }

  // 8. ALMOND CHOCOLATE ROCKS — PURE TEXT
  if (item.id === 'item-almond-chocolate-rocks') {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
        <div
          className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-stone-600 relative group-hover:shadow-md transition-all"
          style={{
            background: 'linear-gradient(140deg, #181513 0%, #2D231E 50%, #120F0E 100%)',
          }}
        >
          <div className="relative z-10 text-[5.5px] sm:text-[7px] font-bold text-amber-400 uppercase tracking-widest leading-none">
            ARTISAN ROAST
          </div>

          <div className="relative z-10 my-auto py-0.5">
            <span className="block font-cinzel font-bold text-amber-200 text-[10px] sm:text-xs tracking-wide leading-tight">
              ALMOND ROCKS
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] text-stone-300 font-medium block mt-0.5">
              Dark Chocolate Coated
            </span>
          </div>

          <div className="relative z-10 text-[6px] sm:text-[7px] text-amber-300/80 font-medium leading-none">
            California Almonds
          </div>
        </div>
      </div>
    );
  }

  // 9. GENERAL / DECOR / ACCENTS CARD (Clean Branded Presentation)
  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className} group`}>
      <div
        className="w-full h-full rounded-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-between text-center select-none shadow-xs border border-stone-200 relative group-hover:shadow-md transition-all"
        style={{ backgroundColor: item.colorScheme.bg }}
      >
        <div className="relative z-10 flex items-center justify-between px-0.5 leading-none">
          <span
            className="text-[6px] sm:text-[7px] font-bold px-1 py-0.2 rounded-2xs text-white"
            style={{ backgroundColor: item.colorScheme.accent }}
          >
            {item.brand}
          </span>
          {item.tag && (
            <span className="text-[5.5px] sm:text-[6.5px] font-semibold text-white/90 truncate max-w-[50%]">
              {item.tag}
            </span>
          )}
        </div>

        <div className="relative z-10 my-auto py-0.5">
          <span className="block font-cinzel font-bold text-white text-[10px] sm:text-xs line-clamp-1 leading-tight">
            {item.simpleName}
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] text-white/80 line-clamp-1 mt-0.5 leading-none">
            {item.weightOrQty || item.description}
          </span>
        </div>

        <div className="relative z-10 text-[6px] sm:text-[7px] text-white/70 truncate leading-none">
          {item.brand} Luxury
        </div>

        {/* Lit Glow if lights active */}
        {isLit && (
          <div className="absolute inset-0 pointer-events-none bg-yellow-300/25 mix-blend-screen animate-pulse">
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-100 rounded-full shadow-md shadow-yellow-300 animate-ping" />
          </div>
        )}

        {item.category === 'roses_decor' && (
          <div className="absolute bottom-1 right-1 p-0.5 bg-rose-600/90 rounded-full text-white shadow-2xs">
            <Heart className="w-2.5 h-2.5 fill-white" />
          </div>
        )}
        {item.category === 'lights' && (
          <div className="absolute bottom-1 right-1 p-0.5 bg-amber-500/90 rounded-full text-white shadow-2xs">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        )}
      </div>
    </div>
  );
};
