/**
 * boxThemes.ts
 * -----------------------------------------------------------------------------
 * Design tokens for the interactive 3D gift box: per-theme colors (bed, faces,
 * ribbons), size presets (sm/md/lg), the chip-variant list, and the
 * BOX_VARIANT_SIZES map that gives each chip a visibly different box size.
 */

export interface BoxTheme {
  id: string;
  label: string;
  boxBg: string;
  boxBorder: string;
  bedBg: string;
  ribbonHex: string;
  accentText: string;
  badgeBg: string;
  boxLabel: string;
  lidTop: string;
  frontFace: string;
  backFace: string;
  leftFace: string;
  rightFace: string;
  bottomFace: string;
  faceBorder: string;
}

export const BOX_THEMES = {
  women: {
    id: 'women',
    label: 'Mint',
    boxBg: 'bg-gradient-to-b from-[#16382E] via-[#0E2820] to-[#081B15]',
    boxBorder: 'border-[#48BB78]/60',
    bedBg: 'bg-[#0A1F18]',
    ribbonHex: '#E2E8F0',
    accentText: 'text-emerald-200',
    badgeBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/50',
    boxLabel: 'Mint & Rose Keepsake Box',
    lidTop: 'from-[#1A4A38] via-[#12382A] to-[#0A241B]',
    frontFace: 'from-[#1D5B40] via-[#13442F] to-[#0A281D]',
    backFace: '#0C2B20',
    leftFace: '#123C2C',
    rightFace: '#164533',
    bottomFace: '#081D14',
    faceBorder: 'border-[#48BB78]/50',
  } as BoxTheme,
  chocolate: {
    id: 'chocolate',
    label: 'Crimson',
    boxBg: 'bg-gradient-to-b from-[#5C0A10] via-[#3B060B] to-[#220407]',
    boxBorder: 'border-[#F87171]/60',
    bedBg: 'bg-[#2A0508]',
    ribbonHex: '#F43F5E',
    accentText: 'text-rose-200',
    badgeBg: 'bg-rose-950/90 text-rose-200 border-rose-600/50',
    boxLabel: 'Crisp Red Celebration Hamper',
    lidTop: 'from-[#800E17] via-[#5C0A10] to-[#3B060B]',
    frontFace: 'from-[#800E17] via-[#610B12] to-[#3B060B]',
    backFace: '#3B060B',
    leftFace: '#4A080E',
    rightFace: '#5C0A10',
    bottomFace: '#220407',
    faceBorder: 'border-[#F87171]/50',
  } as BoxTheme,
  obsidian: {
    id: 'obsidian',
    label: 'Obsidian',
    boxBg: 'bg-gradient-to-b from-[#1C140D] via-[#120C08] to-[#0A0704]',
    boxBorder: 'border-[#DFBA54]/70',
    bedBg: 'bg-[#150E09]',
    ribbonHex: '#DFBA54',
    accentText: 'text-amber-200',
    badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-600/50',
    boxLabel: 'Obsidian & Gold Gourmet Box',
    lidTop: 'from-[#241B12] via-[#191008] to-[#0D0904]',
    frontFace: 'from-[#2A2015] via-[#1B130A] to-[#0C0805]',
    backFace: '#1B130A',
    leftFace: '#221810',
    rightFace: '#291E13',
    bottomFace: '#080604',
    faceBorder: 'border-[#DFBA54]/50',
  } as BoxTheme,
  men: {
    id: 'men',
    label: 'Executive',
    boxBg: 'bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#030712]',
    boxBorder: 'border-[#38BDF8]/60',
    bedBg: 'bg-[#0B1120]',
    ribbonHex: '#0284C7',
    accentText: 'text-sky-200',
    badgeBg: 'bg-sky-950/90 text-sky-200 border-sky-600/50',
    boxLabel: 'Executive Navy Gift Box',
    lidTop: 'from-[#1E293B] via-[#141C2C] to-[#0A0F1C]',
    frontFace: 'from-[#24354D] via-[#16233A] to-[#0B1220]',
    backFace: '#0E1526',
    leftFace: '#121B2E',
    rightFace: '#161F34',
    bottomFace: '#07101D',
    faceBorder: 'border-[#38BDF8]/50',
  } as BoxTheme,
  coffee: {
    id: 'coffee',
    label: 'Espresso',
    boxBg: 'bg-gradient-to-b from-[#2B170D] via-[#1F1009] to-[#120A05]',
    boxBorder: 'border-[#D97706]/60',
    bedBg: 'bg-[#190D07]',
    ribbonHex: '#B45309',
    accentText: 'text-amber-200',
    badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-600/50',
    boxLabel: 'Artisan Espresso Wooden Tray',
    lidTop: 'from-[#38200F] via-[#281608] to-[#160C04]',
    frontFace: 'from-[#41270F] via-[#2E1A0A] to-[#180D05]',
    backFace: '#281709',
    leftFace: '#301E0B',
    rightFace: '#3A2411',
    bottomFace: '#120A04',
    faceBorder: 'border-[#D97706]/50',
  } as BoxTheme,
  baby: {
    id: 'baby',
    label: 'Blush',
    boxBg: 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617]',
    boxBorder: 'border-[#F472B6]/60',
    bedBg: 'bg-[#182132]',
    ribbonHex: '#F472B6',
    accentText: 'text-pink-200',
    badgeBg: 'bg-pink-950/90 text-pink-200 border-pink-500/50',
    boxLabel: 'Pastel Baby Celebration Crate',
    lidTop: 'from-[#32264A] via-[#221838] to-[#140D26]',
    frontFace: 'from-[#3A2C57] via-[#271B42] to-[#150E2C]',
    backFace: '#1A1232',
    leftFace: '#201539',
    rightFace: '#251A41',
    bottomFace: '#0E0A20',
    faceBorder: 'border-[#F472B6]/50',
  } as BoxTheme,
  royal: {
    id: 'royal',
    label: 'Royal',
    boxBg: 'bg-gradient-to-b from-[#280538] via-[#1B0326] to-[#0E0114]',
    boxBorder: 'border-[#DFBA54]/70',
    bedBg: 'bg-[#180222]',
    ribbonHex: '#DFBA54',
    accentText: 'text-amber-200',
    badgeBg: 'bg-[#350849] text-amber-200 border-amber-500/50',
    boxLabel: 'Royal Velvet Hamper',
    lidTop: 'from-[#2E0A45] via-[#1F0630] to-[#140419]',
    frontFace: 'from-[#350849] via-[#280538] to-[#1A0326]',
    backFace: '#240539',
    leftFace: '#2E084D',
    rightFace: '#350A5A',
    bottomFace: '#120418',
    faceBorder: 'border-[#DFBA54]/60',
  } as BoxTheme,
  mini: {
    id: 'mini',
    label: 'Mini',
    boxBg: 'bg-gradient-to-b from-[#280538] via-[#1B0326] to-[#0E0114]',
    boxBorder: 'border-[#DFBA54]/70',
    bedBg: 'bg-[#180222]',
    ribbonHex: '#DFBA54',
    accentText: 'text-amber-200',
    badgeBg: 'bg-[#350849] text-amber-200 border-amber-500/50',
    boxLabel: 'Mini Pocket Delight Box',
    lidTop: 'from-[#2E0A45] via-[#1F0630] to-[#140419]',
    frontFace: 'from-[#350849] via-[#280538] to-[#1A0326]',
    backFace: '#1E0430',
    leftFace: '#240640',
    rightFace: '#2A0748',
    bottomFace: '#120418',
    faceBorder: 'border-[#DFBA54]/60',
  } as BoxTheme,
} satisfies Record<string, BoxTheme>;

export const BOX_THEME_VARIANTS: BoxTheme[] = [
  BOX_THEMES.royal,
  BOX_THEMES.chocolate,
  BOX_THEMES.obsidian,
  BOX_THEMES.men,
  BOX_THEMES.coffee,
  BOX_THEMES.women,
];

/**
 * Box size per theme variant so switching a chip visibly changes the box
 * dimensions (royal/chocolate => large, obsidian/men => medium, coffee/women => small).
 */
export const BOX_VARIANT_SIZES: Record<string, 'sm' | 'md' | 'lg'> = {
  royal: 'lg',
  chocolate: 'lg',
  obsidian: 'md',
  men: 'md',
  coffee: 'sm',
  women: 'sm',
};

export type BoxShape = 'cube' | 'wide' | 'tall' | 'long';

/** Aspect multipliers applied to a size preset's edge, normalized so the
 *  largest axis stays ~1.0 and every shape fits the same scene box. */
export const BOX_SHAPES: Record<BoxShape, { w: number; h: number; d: number; label: string }> = {
  cube: { w: 1.0, h: 1.0, d: 1.0, label: 'Classic Cube' },
  wide: { w: 1.0, h: 0.72, d: 1.0, label: 'Wide Casket' },
  tall: { w: 0.8, h: 1.0, d: 0.8, label: 'Tall Trunk' },
  long: { w: 1.0, h: 0.68, d: 0.6, label: 'Long Keepsake' },
};

/** Give the hero theme chips visibly different box proportions. */
export const BOX_VARIANT_SHAPES: Record<string, BoxShape> = {
  royal: 'tall',
  chocolate: 'cube',
  obsidian: 'wide',
  men: 'long',
  coffee: 'cube',
  women: 'wide',
};

export interface BoxSizePreset {
  edge: number;
  lidRimH: number;
  scene: string;
  shadow: string;
  logo: string;
}

export const BOX_SIZE_PRESETS: Record<'sm' | 'md' | 'lg', BoxSizePreset> = {
  sm: {
    edge: 116,
    lidRimH: 18,
    scene: 'w-44 h-44 sm:w-48 sm:h-48',
    shadow: 'w-28 h-24',
    logo: 'w-7 h-7',
  },
  md: {
    edge: 140,
    lidRimH: 22,
    scene: 'w-56 h-56 sm:w-64 sm:h-64',
    shadow: 'w-36 h-28',
    logo: 'w-8 h-8',
  },
  lg: {
    edge: 168,
    lidRimH: 26,
    scene: 'w-64 h-64 sm:w-72 sm:h-72',
    shadow: 'w-44 h-32',
    logo: 'w-9 h-9',
  },
};