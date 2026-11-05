import { LuxuryItem, VesselOption, RibbonOption, WaxSealOption } from '../types';
import { LUXURY_ITEMS, VESSEL_OPTIONS, RIBBON_OPTIONS, WAX_SEAL_OPTIONS } from './itemsData';

export interface RoyalInspiration {
  id: string;
  themeKey: 'wedding' | 'midnight' | 'golden' | 'jashn';
  titleEn: string;
  titleHinglish: string;
  subtitleEn: string;
  subtitleHinglish: string;
  occasionCategory: 'weddings' | 'festive' | 'corporate' | 'romance';
  occasionBadgeEn: string;
  occasionBadgeHinglish: string;
  storyEn: string;
  storyHinglish: string;
  royalVessel: VesselOption;
  curatedItems: LuxuryItem[];
  ribbon: RibbonOption;
  waxSeal: WaxSealOption;
  bgGradient: string;
  glowColor: string;
  accentColor: string;
  quoteEn: string;
  quoteHinglish: string;
}

export const ROYAL_INSPIRATIONS: RoyalInspiration[] = [
  {
    id: 'insp-shahi-shaadi',
    themeKey: 'wedding',
    titleEn: 'The Imperial Trousseau Chest',
    titleHinglish: 'The Grand Shahi Shaadi & Trousseau Trunk',
    subtitleEn: 'Heirloom Ivory Trunk with Gilded Brass Latches & 24K Epicurean Delights',
    subtitleHinglish: 'Shahi Dulhan Aur Baraat Ke Liye Custom Ivory Velvet Trunk',
    occasionCategory: 'weddings',
    occasionBadgeEn: 'Royal Wedding & Sagan',
    occasionBadgeHinglish: 'Shahi Shaadi & Sagan Uphaar',
    storyEn:
      'Created for grand destination weddings and regal trousseau gifting. An ivory velvet-lined chest holding 24K gold-dusted truffles, pure Kashmiri saffron, damask rose attar, and custom engraved brass plates.',
    storyHinglish:
      'Grand Indian weddings aur royal destinations ke liye sabse pasandeeda trousseau. Kashmiri Kesar, 24K gold truffles aur Isparta rose mist ke saath ek shahi yaadgaar tohfa.',
    royalVessel: VESSEL_OPTIONS[0], // Imperial Ivory Trunk
    curatedItems: [
      LUXURY_ITEMS[6], // 24K Gold Leaf Truffles
      LUXURY_ITEMS[7], // Kashmiri Mongra Saffron
      LUXURY_ITEMS[9], // Royal Amber Candle
      LUXURY_ITEMS[3], // 50-Stem Rose Cascade (represented)
    ],
    ribbon: RIBBON_OPTIONS[0], // Antique Sovereign Gold
    waxSeal: WAX_SEAL_OPTIONS[0], // Imperial Crown
    bgGradient: 'from-[#14120E] via-[#2A1F11] to-[#0D0B09]',
    glowColor: '#D4AF37',
    accentColor: '#DFBA54',
    quoteEn: '“Two souls united in sovereign splendor, sealed with timeless royal elegance.”',
    quoteHinglish: '“Do dilon ka shahi milan, sone ki chamak aur dil se uphaar.”',
  },
  {
    id: 'insp-midnight-monarch',
    themeKey: 'midnight',
    titleEn: 'The Midnight Monarch Gala Curation',
    titleHinglish: 'The Midnight Monarch Luxe (Raat Ki Shaan)',
    subtitleEn: 'Matte Ebony Parisian Hatbox with Velvet Crimson Silk Interior',
    subtitleHinglish: 'Parisian Matte Black Hatbox With Royal Velvet Crimson & Amber Oud',
    occasionCategory: 'romance',
    occasionBadgeEn: 'Black-Tie & Milestone Galas',
    occasionBadgeHinglish: 'Romantic Anniversaries & VIP Galas',
    storyEn:
      'A study in nocturnal luxury and dramatic seduction. Featuring grand cru dark chocolate pralines, aged Cambodian agarwood (oud), and gold-rimmed crystal flutes.',
    storyHinglish:
      'Khaas romantic dates, black-tie galas aur shahi anniversaries ke liye ek aakarshak presentation. Deep velvet, gold leaf and exotic amber oud.',
    royalVessel: VESSEL_OPTIONS[2], // Parisian Hatbox
    curatedItems: [
      LUXURY_ITEMS[2], // Midnight Monarch
      LUXURY_ITEMS[6], // 24K Gold Truffles
      LUXURY_ITEMS[9], // Amber Oud Candle
      LUXURY_ITEMS[8], // Stuffed Medjool Dates
    ],
    ribbon: RIBBON_OPTIONS[2], // Midnight Obsidian
    waxSeal: WAX_SEAL_OPTIONS[2], // Fleur-de-lis
    bgGradient: 'from-[#0A0A0A] via-[#1A1118] to-[#050505]',
    glowColor: '#800E17',
    accentColor: '#E5C07B',
    quoteEn: '“Elegance is the only beauty that never fades under the sovereign stars.”',
    quoteHinglish: '“Raat ki shaan aur taaron si chamak, aapke rishte ki tarah anmol.”',
  },
  {
    id: 'insp-imperial-willow',
    themeKey: 'golden',
    titleEn: 'The Golden Heritage Countryside Willow',
    titleHinglish: 'Imperial Golden Willow (Khaas Parampara)',
    subtitleEn: 'Hand-Woven Light Willow with Scalloped Raw Mulberry Silk Lining',
    subtitleHinglish: 'Handcrafted Golden Willow Basket, Raw Mulberry Silk & Celebrations',
    occasionCategory: 'corporate',
    occasionBadgeEn: 'VVIP Honors & Diplomats',
    occasionBadgeHinglish: 'VVIP Mehmaan & Corporate Honors',
    storyEn:
      'Inspired by grand British and Rajput royal picnics and diplomatic congratulations. Loaded with cold-pressed Himalayan honeys, stuffed Medjool dates, and crystal champagne flutes.',
    storyHinglish:
      'High-profile corporate leaders, board of directors aur shahi mehmano ke liye dignified presentation. Pure silk lining aur premium epicurean delicacies.',
    royalVessel: VESSEL_OPTIONS[1], // Golden Willow
    curatedItems: [
      LUXURY_ITEMS[1], // Imperial Wicker
      LUXURY_ITEMS[8], // Stuffed Medjool Dates
      LUXURY_ITEMS[7], // Kashmiri Saffron
      LUXURY_ITEMS[10], // Damask Rose Mist
    ],
    ribbon: RIBBON_OPTIONS[3], // Royal Navy
    waxSeal: WAX_SEAL_OPTIONS[1], // Atelier Crest
    bgGradient: 'from-[#12161A] via-[#1A2530] to-[#0A0D10]',
    glowColor: '#3A7CA5',
    accentColor: '#D4AF37',
    quoteEn: '“Excellence honored in quiet nobility and timeless heritage craftsmanship.”',
    quoteHinglish: '“Parampara aur aadhunik shaan ka bejod milan.”',
  },
  {
    id: 'insp-jashn-e-royale',
    themeKey: 'jashn',
    titleEn: 'Jashn-E-Royale Festive Splendor',
    titleHinglish: 'Jashn-E-Royale (Diwali, Eid & Utsav)',
    subtitleEn: 'Crimson Velvet Keepsake Casket with Pure Saffron, Gold Sweets & Attar',
    subtitleHinglish: 'Tyoharon Ki Khushi, 24K Sone Ki Mithas Aur Shahi Khushbu Ke Sath',
    occasionCategory: 'festive',
    occasionBadgeEn: 'Diwali, Eid & Grand Feasts',
    occasionBadgeHinglish: 'Diwali, Eid & Festive Royalty',
    storyEn:
      'A celebration of abundance, light, and royal generosity. Packed with saffron infused delicacies, 24K gold foil truffles, roasted pistachio dates, and botanical room mists.',
    storyHinglish:
      'Tyoharon ki mehmaan-nawazi ko banayein yaadgaar. Har shahi parivar aur khaas mehmaano ke liye sabse roshan aur aakarshak hamper.',
    royalVessel: VESSEL_OPTIONS[3], // Raw Silk Wrap
    curatedItems: [
      LUXURY_ITEMS[6], // 24K Truffles
      LUXURY_ITEMS[7], // Kashmir Saffron
      LUXURY_ITEMS[8], // Medjool Dates
      LUXURY_ITEMS[10], // Rose Mist
    ],
    ribbon: RIBBON_OPTIONS[1], // Imperial Crimson Velvet
    waxSeal: WAX_SEAL_OPTIONS[0], // Crown
    bgGradient: 'from-[#1A0A0E] via-[#2A1016] to-[#0E0608]',
    glowColor: '#D4AF37',
    accentColor: '#FFD700',
    quoteEn: '“May the golden light of royal festivities bless your home and hearth.”',
    quoteHinglish: '“Khushiyon ka shahi utsav, apno ke sang meetha bandhan.”',
  },
];
