import React from 'react';

interface ItemGraphicProps {
  id: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customImage?: string;
  alt?: string;
}

export const ItemGraphic: React.FC<ItemGraphicProps> = ({
  id,
  className = '',
  size = 'md',
  customImage,
  alt = 'Royal item graphic',
}) => {
  // If user provided custom image (uploaded or local path)
  if (customImage) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={customImage}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>
    );
  }

  const dimensionClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72',
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${dimensionClasses} ${className}`}
      title={alt}
    >
      {renderGraphic(id)}
    </div>
  );
};

function renderGraphic(id: string) {
  // Common gold gradients and definitions
  const defs = (
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9F3D8" />
        <stop offset="30%" stopColor="#DFBA54" />
        <stop offset="70%" stopColor="#C5A059" />
        <stop offset="100%" stopColor="#8C6821" />
      </linearGradient>
      <linearGradient id="roseGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE4E1" />
        <stop offset="50%" stopColor="#D48C84" />
        <stop offset="100%" stopColor="#8C433D" />
      </linearGradient>
      <linearGradient id="royalCrimsonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B81D2A" />
        <stop offset="50%" stopColor="#800E17" />
        <stop offset="100%" stopColor="#4D040A" />
      </linearGradient>
      <linearGradient id="sapphireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#255C8F" />
        <stop offset="50%" stopColor="#113357" />
        <stop offset="100%" stopColor="#08182B" />
      </linearGradient>
      <linearGradient id="velvetBlackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2E2E2E" />
        <stop offset="60%" stopColor="#171717" />
        <stop offset="100%" stopColor="#0A0A0A" />
      </linearGradient>
      <linearGradient id="ivorySilkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F5F1E6" />
        <stop offset="100%" stopColor="#E2DAC6" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1A1505" floodOpacity="0.18" />
      </filter>
      <filter id="gentleGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  switch (id) {
    // 1. FLAGSHIP ROYAL TRUNK HAMPER
    case 'hamper-crown-sovereign':
    case 'vessel-royal-trunk':
      return (
        <svg viewBox="0 0 240 220" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          {/* Base shadow */}
          <ellipse cx="120" cy="200" rx="90" ry="14" fill="#000000" opacity="0.14" />
          {/* Trunk Body */}
          <rect x="30" y="80" width="180" height="110" rx="8" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="2.5" filter="url(#softShadow)" />
          {/* Quilted lines */}
          <line x1="30" y1="120" x2="210" y2="120" stroke="#C5A059" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
          <line x1="30" y1="155" x2="210" y2="155" stroke="#C5A059" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
          {/* Gold Edge Protectors */}
          <path d="M 30 80 L 46 80 L 46 96 L 30 96 Z" fill="url(#goldGradient)" />
          <path d="M 210 80 L 194 80 L 194 96 L 210 96 Z" fill="url(#goldGradient)" />
          <path d="M 30 190 L 46 190 L 46 174 L 30 174 Z" fill="url(#goldGradient)" />
          <path d="M 210 190 L 194 190 L 194 174 L 210 174 Z" fill="url(#goldGradient)" />
          {/* Lid in Open Perspective */}
          <path d="M 24 80 L 40 32 L 200 32 L 216 80 Z" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="2.5" />
          {/* Trunk Interior Velvet */}
          <path d="M 40 36 L 200 36 L 190 76 L 50 76 Z" fill="url(#royalCrimsonGradient)" opacity="0.9" />
          {/* Peek of Champagne Bottle */}
          <path d="M 120 40 L 132 15 L 140 15 L 146 40 Z" fill="url(#goldGradient)" />
          <rect x="131" y="10" width="10" height="7" fill="#C5A059" rx="1" />
          {/* Peek of Ribbon and Treats */}
          <circle cx="85" cy="55" r="14" fill="#582C0E" stroke="url(#goldGradient)" strokeWidth="1.5" />
          <circle cx="165" cy="55" r="16" fill="url(#goldGradient)" />
          <circle cx="108" cy="58" r="9" fill="#991B1B" />
          {/* Brass Front Latches */}
          <rect x="75" y="74" width="14" height="24" rx="2" fill="url(#goldGradient)" stroke="#8C6821" strokeWidth="0.8" />
          <rect x="151" y="74" width="14" height="24" rx="2" fill="url(#goldGradient)" stroke="#8C6821" strokeWidth="0.8" />
          {/* Center Monogram Crest Plate */}
          <rect x="104" y="112" width="32" height="26" rx="3" fill="url(#goldGradient)" stroke="#7A5612" strokeWidth="1" />
          <path d="M 120 118 L 126 128 L 114 128 Z" fill="#4A340A" />
          <circle cx="120" cy="132" r="2" fill="#4A340A" />
          {/* Royal Satin Ribbon Banner across front */}
          <path d="M 30 135 C 90 130, 150 140, 210 135" stroke="url(#goldGradient)" strokeWidth="4" fill="none" opacity="0.75" />
        </svg>
      );

    // 2. WOVEN GOLDEN WICKER BASKET
    case 'hamper-imperial-wicker':
    case 'vessel-golden-wicker':
      return (
        <svg viewBox="0 0 240 220" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="120" cy="202" rx="85" ry="12" fill="#000000" opacity="0.14" />
          {/* Basket Handle */}
          <path d="M 50 120 C 50 20, 190 20, 190 120" fill="none" stroke="url(#goldGradient)" strokeWidth="7" strokeLinecap="round" />
          <path d="M 50 120 C 50 20, 190 20, 190 120" fill="none" stroke="#754E10" strokeWidth="1.5" strokeDasharray="6,4" />
          {/* Silk Liner Scallop hanging over edge */}
          <path d="M 35 110 Q 50 125 65 112 Q 80 125 95 112 Q 110 125 125 112 Q 140 125 155 112 Q 170 125 185 112 Q 200 125 205 110 L 200 130 L 40 130 Z" fill="url(#ivorySilkGradient)" />
          {/* Basket Body */}
          <path d="M 40 108 L 60 195 C 60 200, 180 200, 180 195 L 200 108 Z" fill="#D69E2E" stroke="#875A14" strokeWidth="2" />
          {/* Cross weave patterns */}
          <path d="M 50 125 Q 120 135 190 125" stroke="#875A14" strokeWidth="2" fill="none" />
          <path d="M 55 145 Q 120 155 185 145" stroke="#875A14" strokeWidth="2" fill="none" />
          <path d="M 60 165 Q 120 175 180 165" stroke="#875A14" strokeWidth="2" fill="none" />
          <path d="M 64 185 Q 120 192 176 185" stroke="#875A14" strokeWidth="2" fill="none" />
          {/* Vertical weave ribs */}
          <path d="M 80 110 L 88 198 M 110 110 L 112 199 M 130 110 L 128 199 M 160 110 L 152 198" stroke="#68420A" strokeWidth="1.5" />
          {/* Big Satin Crimson Ribbon Bow */}
          <circle cx="120" cy="115" r="7" fill="#800E17" stroke="url(#goldGradient)" strokeWidth="1" />
          <path d="M 120 115 C 95 95, 75 105, 114 118" fill="url(#royalCrimsonGradient)" stroke="url(#goldGradient)" strokeWidth="0.8" />
          <path d="M 120 115 C 145 95, 165 105, 126 118" fill="url(#royalCrimsonGradient)" stroke="url(#goldGradient)" strokeWidth="0.8" />
          <path d="M 116 118 L 100 150 L 112 146 L 119 122 Z" fill="url(#royalCrimsonGradient)" />
          <path d="M 124 118 L 140 150 L 128 146 L 121 122 Z" fill="url(#royalCrimsonGradient)" />
        </svg>
      );

    // 3. PARISIAN MATTE HATBOX (Black & Gold)
    case 'hamper-midnight-monarch':
    case 'vessel-parisian-hatbox':
      return (
        <svg viewBox="0 0 240 220" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="120" cy="202" rx="75" ry="12" fill="#000000" opacity="0.16" />
          {/* Cylindrical Base */}
          <path d="M 48 85 L 48 175 C 48 198, 192 198, 192 175 L 192 85 Z" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" />
          {/* Top Oval opening */}
          <ellipse cx="120" cy="85" rx="72" ry="24" fill="#1C1C1C" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Interior velvet glow */}
          <ellipse cx="120" cy="85" rx="66" ry="20" fill="url(#royalCrimsonGradient)" opacity="0.7" />
          {/* Gold Foil Crown Emblem */}
          <path d="M 105 130 L 110 148 L 130 148 L 135 130 L 125 138 L 120 126 L 115 138 Z" fill="url(#goldGradient)" stroke="#8C6821" strokeWidth="0.5" />
          <text x="120" y="166" fill="#D4AF37" fontSize="8" fontFamily="serif" textAnchor="middle" letterSpacing="2">AURELIA ROYALE</text>
          {/* Golden Cord & Tassel */}
          <path d="M 46 95 C 36 120, 36 140, 52 145" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
          <polygon points="50,145 42,175 58,175" fill="url(#goldGradient)" />
          {/* Lid resting slightly to the side */}
          <ellipse cx="178" cy="182" rx="34" ry="14" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" transform="rotate(-15, 178, 182)" />
        </svg>
      );

    // 4. BOUQUET: VELVET CRIMSON ROSE CASCADE
    case 'bouquet-crimson-cascade':
      return (
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="120" cy="225" rx="55" ry="10" fill="#000000" opacity="0.12" />
          {/* Wrapping Paper Cone (Black & Gold Trim) */}
          <polygon points="120,225 60,110 180,110" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" />
          <polygon points="120,225 78,110 162,110" fill="#1C1C1C" />
          <line x1="60" y1="110" x2="120" y2="225" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Golden foliage sprigs */}
          <path d="M 50 110 Q 30 70 45 40 Q 60 70 65 100" fill="url(#goldGradient)" opacity="0.9" />
          <path d="M 190 110 Q 210 70 195 40 Q 180 70 175 100" fill="url(#goldGradient)" opacity="0.9" />
          {/* Crimson Roses Cluster */}
          {/* Bottom row roses */}
          <g transform="translate(80, 95)">
            <circle cx="0" cy="0" r="18" fill="url(#royalCrimsonGradient)" />
            <path d="M -8 -4 C -2 -14, 8 -14, 10 -4 C 10 6, -2 12, -8 4 Z" fill="#B81D2A" opacity="0.8" />
            <circle cx="0" cy="0" r="6" fill="#4D040A" />
          </g>
          <g transform="translate(120, 100)">
            <circle cx="0" cy="0" r="21" fill="url(#royalCrimsonGradient)" />
            <path d="M -10 -5 C -2 -17, 10 -17, 12 -5 C 12 8, -2 15, -10 5 Z" fill="#B81D2A" opacity="0.8" />
            <circle cx="0" cy="0" r="7" fill="#4D040A" />
          </g>
          <g transform="translate(160, 95)">
            <circle cx="0" cy="0" r="18" fill="url(#royalCrimsonGradient)" />
            <path d="M -8 -4 C -2 -14, 8 -14, 10 -4 C 10 6, -2 12, -8 4 Z" fill="#B81D2A" opacity="0.8" />
            <circle cx="0" cy="0" r="6" fill="#4D040A" />
          </g>
          {/* Center row roses */}
          <g transform="translate(100, 68)">
            <circle cx="0" cy="0" r="22" fill="url(#royalCrimsonGradient)" />
            <path d="M -10 -6 C -2 -18, 12 -18, 14 -6 C 14 9, -2 16, -10 6 Z" fill="#D92B38" opacity="0.7" />
            <circle cx="0" cy="0" r="7" fill="#4D040A" />
          </g>
          <g transform="translate(140, 68)">
            <circle cx="0" cy="0" r="22" fill="url(#royalCrimsonGradient)" />
            <path d="M -10 -6 C -2 -18, 12 -18, 14 -6 C 14 9, -2 16, -10 6 Z" fill="#D92B38" opacity="0.7" />
            <circle cx="0" cy="0" r="7" fill="#4D040A" />
          </g>
          {/* Crown top rose */}
          <g transform="translate(120, 38)">
            <circle cx="0" cy="0" r="24" fill="url(#royalCrimsonGradient)" />
            <path d="M -12 -7 C -3 -20, 13 -20, 15 -7 C 15 10, -3 18, -12 7 Z" fill="#E83B49" opacity="0.75" />
            <circle cx="0" cy="0" r="8" fill="#4D040A" />
          </g>
          {/* Golden ribbon tie */}
          <rect x="110" y="160" width="20" height="12" rx="3" fill="url(#goldGradient)" />
          <path d="M 120 166 L 98 198 L 108 198 L 120 172 Z" fill="url(#goldGradient)" />
          <path d="M 120 166 L 142 198 L 132 198 L 120 172 Z" fill="url(#goldGradient)" />
        </svg>
      );

    // 5. BOUQUET: WHITE ORCHID & GOLDEN RUSCUS
    case 'bouquet-orchid-ruscus':
      return (
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="120" cy="225" rx="50" ry="8" fill="#000000" opacity="0.12" />
          {/* Translucent Ivory Silk Wrap */}
          <polygon points="120,225 55,105 185,105" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" />
          {/* Golden ruscus stems arching out */}
          <path d="M 120 120 Q 50 70 30 30" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" />
          <circle cx="30" cy="30" r="6" fill="url(#goldGradient)" />
          <circle cx="45" cy="46" r="5" fill="url(#goldGradient)" />
          <circle cx="65" cy="68" r="5" fill="url(#goldGradient)" />
          <path d="M 120 120 Q 190 70 210 30" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" />
          <circle cx="210" cy="30" r="6" fill="url(#goldGradient)" />
          <circle cx="195" cy="46" r="5" fill="url(#goldGradient)" />
          <circle cx="175" cy="68" r="5" fill="url(#goldGradient)" />
          {/* Pristine White Orchids (Phalaenopsis) */}
          {/* Flower 1 Center */}
          <g transform="translate(120, 60)">
            <ellipse cx="0" cy="-14" rx="12" ry="16" fill="#FFFFFF" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="-16" cy="2" rx="14" ry="12" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="16" cy="2" rx="14" ry="12" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="-10" cy="14" rx="10" ry="14" fill="#F4EFE6" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="10" cy="14" rx="10" ry="14" fill="#F4EFE6" stroke="#E5DAC2" strokeWidth="0.8" />
            <circle cx="0" cy="2" r="5" fill="url(#goldGradient)" />
            <circle cx="0" cy="4" r="2" fill="#991B1B" />
          </g>
          {/* Flower 2 Left */}
          <g transform="translate(85, 90)">
            <ellipse cx="0" cy="-12" rx="10" ry="14" fill="#FFFFFF" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="-14" cy="2" rx="12" ry="10" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="14" cy="2" rx="12" ry="10" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <circle cx="0" cy="2" r="4" fill="url(#goldGradient)" />
          </g>
          {/* Flower 3 Right */}
          <g transform="translate(155, 90)">
            <ellipse cx="0" cy="-12" rx="10" ry="14" fill="#FFFFFF" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="-14" cy="2" rx="12" ry="10" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <ellipse cx="14" cy="2" rx="12" ry="10" fill="#FAFAF8" stroke="#E5DAC2" strokeWidth="0.8" />
            <circle cx="0" cy="2" r="4" fill="url(#goldGradient)" />
          </g>
          {/* Sapphire Silk Ribbon */}
          <circle cx="120" cy="165" r="6" fill="#113357" stroke="url(#goldGradient)" strokeWidth="1" />
          <path d="M 120 165 C 100 148, 85 158, 114 168" fill="url(#sapphireGradient)" />
          <path d="M 120 165 C 140 148, 155 158, 126 168" fill="url(#sapphireGradient)" />
          <path d="M 118 168 L 102 205 L 112 202 L 120 172 Z" fill="url(#sapphireGradient)" />
          <path d="M 122 168 L 138 205 L 128 202 L 120 172 Z" fill="url(#sapphireGradient)" />
        </svg>
      );

    // 6. BOUQUET: MIDNIGHT SAPPHIRE HYDRANGEA
    case 'bouquet-midnight-sapphire':
      return (
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="120" cy="225" rx="52" ry="8" fill="#000000" opacity="0.12" />
          <polygon points="120,225 60,110 180,110" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" />
          {/* Massive Lush Hydrangea Cloud */}
          <g transform="translate(120, 80)">
            {/* Background blue florets */}
            <circle cx="-35" cy="-25" r="16" fill="url(#sapphireGradient)" />
            <circle cx="35" cy="-25" r="16" fill="url(#sapphireGradient)" />
            <circle cx="-50" cy="5" r="15" fill="#113357" />
            <circle cx="50" cy="5" r="15" fill="#113357" />
            <circle cx="0" cy="-45" r="18" fill="url(#sapphireGradient)" />
            <circle cx="-20" cy="-10" r="18" fill="#1E4D7B" />
            <circle cx="20" cy="-10" r="18" fill="#1E4D7B" />
            <circle cx="0" cy="10" r="20" fill="url(#sapphireGradient)" />
            {/* Gold leaf accents among florets */}
            <circle cx="-15" cy="-35" r="4" fill="url(#goldGradient)" />
            <circle cx="25" cy="-30" r="4" fill="url(#goldGradient)" />
            <circle cx="0" cy="-12" r="5" fill="url(#goldGradient)" />
            <circle cx="-35" cy="5" r="4" fill="url(#goldGradient)" />
            <circle cx="35" cy="8" r="4" fill="url(#goldGradient)" />
          </g>
          {/* Gold bow */}
          <rect x="110" y="160" width="20" height="12" rx="3" fill="url(#goldGradient)" />
          <path d="M 120 166 L 98 200 L 110 198 L 120 172 Z" fill="url(#goldGradient)" />
          <path d="M 120 166 L 142 200 L 130 198 L 120 172 Z" fill="url(#goldGradient)" />
        </svg>
      );

    // 7. GOURMET: 24K GOLD LEAF TRUFFLES
    case 'gourmet-gold-truffles':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="180" rx="65" ry="10" fill="#000000" opacity="0.12" />
          {/* Luxury Octagonal Gold Lacquer Box */}
          <polygon points="40,90 70,50 130,50 160,90 160,150 130,175 70,175 40,150" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Interior Casket Lining */}
          <polygon points="48,92 74,58 126,58 152,92 152,144 126,167 74,167 48,144" fill="#241408" stroke="url(#goldGradient)" strokeWidth="0.8" />
          {/* 4 Truffles on paper cups */}
          {/* Truffle 1: Top Left */}
          <circle cx="80" cy="90" r="16" fill="#3D1D09" />
          <path d="M 76 80 Q 84 82 86 92 Q 78 96 74 88 Z" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          {/* Truffle 2: Top Right */}
          <circle cx="120" cy="90" r="16" fill="#261004" />
          <path d="M 115 82 Q 126 80 128 88 Q 118 94 114 88 Z" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          {/* Truffle 3: Bottom Left */}
          <circle cx="80" cy="130" r="16" fill="#42200C" />
          <path d="M 75 124 Q 86 122 84 134 Q 74 136 75 124 Z" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          {/* Truffle 4: Bottom Right */}
          <circle cx="120" cy="130" r="16" fill="#381907" />
          <path d="M 116 122 Q 128 126 124 136 Q 114 132 116 122 Z" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          {/* Gold filigree corners */}
          <circle cx="100" cy="110" r="3" fill="url(#goldGradient)" />
        </svg>
      );

    // 8. GOURMET: KASHMIR SAFFRON CHEST
    case 'gourmet-kashmir-saffron':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="178" rx="60" ry="10" fill="#000000" opacity="0.12" />
          {/* Carved Wood & Brass Inlay Box */}
          <rect x="45" y="70" width="110" height="90" rx="6" fill="#421F07" stroke="url(#goldGradient)" strokeWidth="2.5" />
          {/* Gilded Brass Corner Brackets */}
          <polygon points="45,70 65,70 45,90" fill="url(#goldGradient)" />
          <polygon points="155,70 135,70 155,90" fill="url(#goldGradient)" />
          <polygon points="45,160 65,160 45,140" fill="url(#goldGradient)" />
          <polygon points="155,160 135,160 155,140" fill="url(#goldGradient)" />
          {/* Clear Crystal Center Viewing Window */}
          <circle cx="100" cy="115" r="28" fill="#F8FAFC" opacity="0.9" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Red Saffron Filaments inside */}
          <path d="M 90 105 Q 100 120 95 130 M 105 100 Q 100 115 110 128 M 85 118 Q 102 110 112 118 M 98 108 Q 115 112 104 125" stroke="#B81D2A" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Front Golden Clasp */}
          <rect x="94" y="65" width="12" height="18" rx="2" fill="url(#goldGradient)" stroke="#784C07" strokeWidth="0.8" />
        </svg>
      );

    // 9. GOURMET: ROYAL MEDJOOL STUFFED DATES
    case 'gourmet-royal-dates':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="180" rx="68" ry="10" fill="#000000" opacity="0.12" />
          {/* Oval Gilded Server Plate */}
          <ellipse cx="100" cy="140" rx="75" ry="34" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="2.5" />
          <ellipse cx="100" cy="140" rx="66" ry="28" fill="#FAFAF8" stroke="#D8CCA8" strokeWidth="1" />
          {/* 3 Plump Glistening Dates with roasted pistachio & gold dust */}
          {/* Date 1 Left */}
          <g transform="translate(68, 134) rotate(-15)">
            <ellipse cx="0" cy="0" rx="22" ry="13" fill="#2E1305" />
            <path d="M -12 -1 Q 0 -3 12 -1 Q 0 3 -12 -1" fill="#48BB78" />
            <circle cx="-2" cy="-1" r="2" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          </g>
          {/* Date 2 Center */}
          <g transform="translate(100, 130)">
            <ellipse cx="0" cy="0" rx="24" ry="14" fill="#3D1C08" />
            <path d="M -14 -1 Q 0 -4 14 -1 Q 0 4 -14 -1" fill="#48BB78" />
            <circle cx="2" cy="-1" r="2.5" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
            <circle cx="-6" cy="1" r="1.5" fill="url(#goldGradient)" />
          </g>
          {/* Date 3 Right */}
          <g transform="translate(132, 134) rotate(15)">
            <ellipse cx="0" cy="0" rx="22" ry="13" fill="#2E1305" />
            <path d="M -12 -1 Q 0 -3 12 -1 Q 0 3 -12 -1" fill="#48BB78" />
            <circle cx="4" cy="-1" r="2" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          </g>
        </svg>
      );

    // 10. FRAGRANCE: ROYAL AMBER & VELVET OUD CANDLE
    case 'fragrance-amber-oud-candle':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="182" rx="50" ry="10" fill="#000000" opacity="0.14" />
          {/* Heavy Glass Tumbler (Matte Obsidian) */}
          <path d="M 60 70 L 65 170 C 65 180, 135 180, 135 170 L 140 70 Z" fill="url(#velvetBlackGradient)" stroke="url(#goldGradient)" strokeWidth="1.8" />
          {/* Candle Rim & Wax Pool */}
          <ellipse cx="100" cy="70" rx="40" ry="12" fill="#EAE5D8" stroke="url(#goldGradient)" strokeWidth="1.5" />
          <ellipse cx="100" cy="70" rx="36" ry="10" fill="#FBF8EE" />
          {/* Candle Wick */}
          <line x1="100" y1="70" x2="100" y2="52" stroke="#2B1810" strokeWidth="2" strokeLinecap="round" />
          {/* Glowing Golden Flame */}
          <path d="M 100 28 C 92 42, 94 52, 100 52 C 106 52, 108 42, 100 28 Z" fill="url(#goldGradient)" filter="url(#gentleGlow)" />
          <path d="M 100 35 C 96 44, 97 50, 100 50 C 103 50, 104 44, 100 35 Z" fill="#FFFBEB" />
          {/* Gold Foil Label */}
          <rect x="74" y="105" width="52" height="42" rx="2" fill="none" stroke="url(#goldGradient)" strokeWidth="1.2" />
          <text x="100" y="122" fill="#D4AF37" fontSize="7" fontFamily="serif" textAnchor="middle" letterSpacing="1">AMBER & OUD</text>
          <text x="100" y="134" fill="#C5A059" fontSize="5" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1.5">ROYALE SCENT</text>
        </svg>
      );

    // 11. FRAGRANCE: DAMASK ROSE ROOM MIST
    case 'fragrance-damask-mist':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="182" rx="42" ry="8" fill="#000000" opacity="0.12" />
          {/* Fluted Crystal Bottle */}
          <rect x="70" y="75" width="60" height="95" rx="6" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="1.8" />
          {/* Golden Sprayer & Collar */}
          <rect x="88" y="55" width="24" height="20" fill="url(#goldGradient)" rx="2" stroke="#875A14" strokeWidth="0.8" />
          <rect x="82" y="44" width="36" height="11" fill="url(#goldGradient)" rx="2" stroke="#875A14" strokeWidth="0.8" />
          {/* Nozzle */}
          <rect x="118" y="47" width="5" height="5" fill="#875A14" />
          {/* Subtle mist droplets */}
          <circle cx="132" cy="45" r="1.5" fill="url(#goldGradient)" opacity="0.7" />
          <circle cx="140" cy="42" r="1.2" fill="url(#goldGradient)" opacity="0.6" />
          <circle cx="148" cy="38" r="1" fill="url(#goldGradient)" opacity="0.5" />
          {/* Label */}
          <rect x="78" y="105" width="44" height="40" rx="1" fill="#FAF9F5" stroke="#C5A059" strokeWidth="1" />
          <text x="100" y="124" fill="#8B1E26" fontSize="6.5" fontFamily="serif" textAnchor="middle">DAMASK ROSE</text>
          <text x="100" y="135" fill="#C5A059" fontSize="5" fontFamily="sans-serif" textAnchor="middle">ROYAL ATELIER</text>
        </svg>
      );

    // 12. KEEPSAKE: FLUTED CRYSTAL GOBLETS
    case 'keepsake-crystal-flutes':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="185" rx="55" ry="8" fill="#000000" opacity="0.1" />
          {/* Glass 1 (Left) */}
          <g transform="translate(75, 110)">
            <ellipse cx="0" cy="65" rx="20" ry="5" fill="url(#goldGradient)" opacity="0.8" />
            <line x1="0" y1="65" x2="0" y2="10" stroke="url(#goldGradient)" strokeWidth="3" />
            <path d="M -16 -45 L -14 0 C -14 12, 14 12, 14 0 L 16 -45 Z" fill="url(#ivorySilkGradient)" opacity="0.85" stroke="url(#goldGradient)" strokeWidth="1.5" />
            {/* Gold Rim */}
            <ellipse cx="0" cy="-45" rx="16" ry="5" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
          </g>
          {/* Glass 2 (Right) */}
          <g transform="translate(125, 110)">
            <ellipse cx="0" cy="65" rx="20" ry="5" fill="url(#goldGradient)" opacity="0.8" />
            <line x1="0" y1="65" x2="0" y2="10" stroke="url(#goldGradient)" strokeWidth="3" />
            <path d="M -16 -45 L -14 0 C -14 12, 14 12, 14 0 L 16 -45 Z" fill="url(#ivorySilkGradient)" opacity="0.85" stroke="url(#goldGradient)" strokeWidth="1.5" />
            {/* Gold Rim */}
            <ellipse cx="0" cy="-45" rx="16" ry="5" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
          </g>
        </svg>
      );

    // 13. CALLIGRAPHY CARD & WAX SEAL
    case 'embellishment-wax-card':
    case 'wax-seal-card':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="180" rx="60" ry="10" fill="#000000" opacity="0.12" />
          {/* Deckle-Edge Handmade Cotton Parchment */}
          <rect x="40" y="45" width="120" height="120" rx="4" fill="#FAF8F2" stroke="#D8CCA8" strokeWidth="1.5" />
          {/* Subtle gold foil border */}
          <rect x="48" y="53" width="104" height="104" rx="2" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="4,2" />
          {/* Poetic Calligraphy Lines */}
          <path d="M 60 75 Q 85 70 110 75" stroke="#333333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 60 90 Q 95 86 135 90" stroke="#333333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 60 105 Q 80 102 120 105" stroke="#333333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Imperial Crimson Wax Seal Stamp */}
          <circle cx="100" cy="138" r="18" fill="url(#royalCrimsonGradient)" filter="url(#softShadow)" />
          <circle cx="100" cy="138" r="14" fill="#800E17" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Gold Crest inside seal */}
          <path d="M 94 135 L 98 143 L 102 143 L 106 135 L 103 138 L 100 132 L 97 138 Z" fill="url(#goldGradient)" />
        </svg>
      );

    // 14. EMBELLISHMENT: DOUBLE-FACED SATIN GOLD RIBBON
    case 'embellishment-satin-ribbon':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="175" rx="55" ry="8" fill="#000000" opacity="0.1" />
          {/* Large Master Ribbon Bow */}
          <g transform="translate(100, 95)">
            {/* Center knot */}
            <ellipse cx="0" cy="0" rx="14" ry="11" fill="url(#goldGradient)" stroke="#8C6821" strokeWidth="1" />
            {/* Left Loop */}
            <path d="M -10 -5 C -65 -45, -75 25, -12 8 Z" fill="url(#goldGradient)" stroke="#7A5612" strokeWidth="1.2" />
            {/* Right Loop */}
            <path d="M 10 -5 C 65 -45, 75 25, 12 8 Z" fill="url(#goldGradient)" stroke="#7A5612" strokeWidth="1.2" />
            {/* Tails */}
            <path d="M -8 10 L -45 75 L -25 70 L 0 14 Z" fill="url(#goldGradient)" stroke="#7A5612" strokeWidth="0.8" />
            <path d="M 8 10 L 45 75 L 25 70 L 0 14 Z" fill="url(#goldGradient)" stroke="#7A5612" strokeWidth="0.8" />
          </g>
        </svg>
      );

    // DEFAULT ROYAL CREST GRAPHIC
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {defs}
          <ellipse cx="100" cy="175" rx="50" ry="8" fill="#000000" opacity="0.1" />
          <circle cx="100" cy="95" r="55" fill="url(#ivorySilkGradient)" stroke="url(#goldGradient)" strokeWidth="2.5" />
          <circle cx="100" cy="95" r="46" fill="#FAF9F5" stroke="#D8CCA8" strokeWidth="1" strokeDasharray="3,3" />
          {/* Crown */}
          <path d="M 85 95 L 90 108 L 110 108 L 115 95 L 107 100 L 100 90 L 93 100 Z" fill="url(#goldGradient)" stroke="#8C6821" strokeWidth="0.8" />
          <circle cx="100" cy="118" r="3" fill="#8B1E26" />
        </svg>
      );
  }
}
