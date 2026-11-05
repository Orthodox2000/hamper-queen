export type ItemCategory = 
  | 'royal_hampers'
  | 'artisanal_bouquets'
  | 'gourmet_sweets'
  | 'royal_fragrances'
  | 'keepsake_vessels'
  | 'embellishments';

export type LanguageMode = 'en' | 'hinglish' | 'bilingual';

export type PricingTier = 'Prestige' | 'Imperial' | 'Sovereign' | 'Grandeur';

export interface LuxuryItem {
  id: string;
  name: string;
  category: ItemCategory;
  subtitle: string;
  description: string;
  details: string[];
  royalHighlights: string[];
  occasions: string[];
  palette: {
    primary: string;
    accent: string;
    label: string;
  };
  imageSvgId: string;
  userCustomImage?: string;
  estimatedTier: PricingTier;
  approximateUnitValue?: number; // Kept in modular configuration
  isFeatured?: boolean;
  customizable?: boolean;
  dimensions?: string;
  origin?: string;
}

export interface VesselOption {
  id: string;
  name: string;
  type: 'trunk' | 'basket' | 'hatbox' | 'silk_wrap' | 'casket';
  capacity: number; // Max recommended items
  subtitle: string;
  description: string;
  colorName: string;
  imageSvgId: string;
  tier: PricingTier;
  dimensions: string;
}

export interface RibbonOption {
  id: string;
  name: string;
  colorHex: string;
  borderHex: string;
  material: string;
}

export interface WaxSealOption {
  id: string;
  name: string;
  colorHex: string;
  stampDesign: 'crown' | 'crest' | 'fleur' | 'botanical' | 'monogram';
  label: string;
}

export interface CalligraphyCard {
  stationery: 'deckle_edge' | 'midnight_gold' | 'imperial_crimson' | 'pearl_white';
  recipient: string;
  sender: string;
  occasion: string;
  fontFamily: 'font-script' | 'font-brush' | 'font-cormorant';
  waxSealId: string;
  message: string;
}

export interface CustomHamper {
  id: string;
  vessel: VesselOption;
  items: LuxuryItem[];
  ribbon: RibbonOption;
  waxSeal: WaxSealOption;
  card?: CalligraphyCard;
  botanicalSprig: boolean;
  customEngraving?: string;
  createdAt: number;
}

export interface BrochureItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  pages: number;
  description: string;
  highlights: string[];
  downloadName: string;
  coverGraphic: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'action';
  category: string;
  message: string;
  details?: Record<string, unknown> | string;
}
