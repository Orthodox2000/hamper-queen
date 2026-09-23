/**
 * HamperQueenGraphic.tsx
 * -----------------------------------------------------------------------------
 * Visual product card graphic: a themed luxury gift box showing EVERY item that
 * ships inside it.
 *
 *  - The outer card is a light cream surface (high readability).
 *  - The inner "box" keeps the product-theme gradient so each hamper reads as
 *    a distinct, branded colored box.
 *  - Every `itemsIncluded` entry is rendered as a light tinted `ItemLogoTile`
 *    with a deterministic branded SVG logo and a wrapped (non-truncated) name.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct } from '../data/hamperQueenCatalog';
import { BoxTheme, BOX_THEMES } from '../data/boxThemes';
import { ItemLogoTile } from './itemLogoRegistry';

interface HamperQueenGraphicProps {
  graphicId: string;
  product?: HamperQueenProduct;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Resolve the product's box theme from its graphic/product id flags. */
function resolveTheme(product: HamperQueenProduct, graphicId: string): BoxTheme {
  const id = `${product.id}|${graphicId}`;
  if (id.includes('women-accessory')) return BOX_THEMES.women;
  if (id.includes('kitkat')) return BOX_THEMES.chocolate;
  if (id.includes('dark-fantasy')) return BOX_THEMES.obsidian;
  if (id.includes('coffee')) return BOX_THEMES.coffee;
  if (id.includes('men')) return BOX_THEMES.men;
  if (id.includes('baby')) return BOX_THEMES.baby;
  if (id.includes('saffron') || id.includes('dryfruit')) return BOX_THEMES.coffee;
  if (id.includes('pocket-delight') || id.includes('sweet-duo') || id.includes('celebration-trio')) {
    return BOX_THEMES.mini;
  }
  return BOX_THEMES.royal;
}

export const HamperQueenGraphic: React.FC<HamperQueenGraphicProps> = ({
  graphicId,
  product: propProduct,
  className = '',
  size = 'md',
}) => {
  const product: HamperQueenProduct =
    propProduct ||
    HAMPER_QUEEN_PRODUCTS.find((p: HamperQueenProduct) => p.graphicId === graphicId) ||
    HAMPER_QUEEN_PRODUCTS[0];

  const style = resolveTheme(product, graphicId);

  const containerMinHeight = {
    sm: 'min-h-32 sm:min-h-36',
    md: 'min-h-52 sm:min-h-60',
    lg: 'min-h-64 sm:min-h-72',
  }[size];

  const items = product.itemsIncluded;

  return (
    <div
      className={`relative w-full ${containerMinHeight} rounded-2xl overflow-hidden border border-[#E5DAC0] shadow-md flex flex-col justify-between p-3 select-none ${className}`}
      style={{
        background: 'linear-gradient(145deg, #FFFDF9 0%, #FBF6EA 55%, #F6EFDF 100%)',
      }}
    >
      {/* 1. Outer Rim / Item-code Bar */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#EADFC8]">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#800E17] border border-[#DFBA54] flex items-center justify-center text-[8px] font-cinzel font-black text-[#F3E5AB] shadow-xs">
            HQ
          </div>
          <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-[#8C6821] tracking-wider">
            {product.itemCode}
          </span>
        </div>

        <span className="text-[8px] sm:text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-white border border-[#E5DAC0] text-[#8C6821]">
          {style.boxLabel}
        </span>
      </div>

      {/* 2. The Visible Luxury Gift Box With All Items */}
      <div
        className={`relative z-10 my-auto w-full rounded-xl border-2 ${style.boxBorder} ${style.boxBg} p-2 shadow-inner flex flex-col justify-between`}
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
        <div className="relative z-10 flex items-center justify-between gap-2 mb-1.5">
          <h4 className="font-cinzel font-bold text-xs sm:text-sm text-white drop-shadow-sm leading-tight">
            {product.name}
          </h4>
          <span className="text-[9px] font-bold text-emerald-300 shrink-0">
            {product.approxPrice}
          </span>
        </div>

        {/* All Items As Light Branded Logo Tiles (names wrap, nothing truncated) */}
        <div className="relative z-10 grid grid-cols-2 gap-1.5">
          {items.map((item, idx) => (
            <ItemLogoTile key={`${item}-${idx}`} name={item} />
          ))}
        </div>
      </div>

      {/* 3. Footer: Free Delivery & Order Guarantee */}
      <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-[#EADFC8] text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
          <Sparkles className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
          <span>Free Delivery Above INR 499</span>
        </div>
        <span className="text-[#8C6821] font-serif italic">Custom Gift Packaging</span>
      </div>
    </div>
  );
};