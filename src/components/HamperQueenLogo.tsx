import React from 'react';

interface HamperQueenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  bilingualSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  layout?: 'row' | 'col';
  onClick?: () => void;
}

export const HamperQueenLogo: React.FC<HamperQueenLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  bilingualSubtitle = false,
  className = '',
  theme = 'light',
  layout = 'row',
  onClick,
}) => {
  // Dimension helpers
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    hero: 'w-16 h-16 sm:w-20 sm:h-20',
  }[size];

  const titleSize = {
    sm: 'text-base tracking-[0.18em]',
    md: 'text-lg sm:text-xl tracking-[0.2em]',
    lg: 'text-xl sm:text-2xl lg:text-3xl tracking-[0.2em]',
    hero: 'text-3xl sm:text-4xl md:text-5xl tracking-[0.25em]',
  }[size];

  const subtitleSize = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[10px] sm:text-xs tracking-[0.25em]',
    lg: 'text-xs sm:text-sm tracking-[0.3em]',
    hero: 'text-xs sm:text-base tracking-[0.35em]',
  }[size];

  const isCol = layout === 'col';

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${isCol ? 'flex-col items-center text-center gap-2' : 'items-center gap-3 text-left'} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Brand Logo Image (public/hamper.png) */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <img
          src="/hamper.png"
          alt="Hamper Queen logo"
          className={`w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)] ${onClick ? 'pointer-events-none' : ''}`}
        />
      </div>

      {/* Brand Title Typography */}
      <div className={`flex flex-col ${isCol ? 'items-center text-center' : 'text-left'} min-w-0`}>
        <div className={`flex items-center ${isCol ? 'justify-center' : ''} gap-1.5 whitespace-nowrap`}>
          <span
            className={`font-seasons font-bold tracking-widest uppercase leading-none ${
              theme === 'light'
                ? 'text-[#141414]'
                : 'text-[#FAF9F5]'
            } ${titleSize}`}
          >
            HAMPER <span className="text-[#B8860B]">QUEEN</span>
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 whitespace-nowrap">
            <span className="w-2 sm:w-3 h-[1px] bg-[#D4AF37]/60" />
            <span
              className={`font-seasons uppercase font-semibold leading-none ${
                theme === 'light' ? 'text-[#8C6821]' : 'text-[#DFBA54]'
              } ${subtitleSize}`}
            >
              Custom Gifts & Bouquets
            </span>
            <span className="w-2 sm:w-3 h-[1px] bg-[#D4AF37]/60" />
          </div>
        )}
      </div>
    </div>
  );
};
