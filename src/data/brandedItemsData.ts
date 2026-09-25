export interface BrandedItem {
  id: string;
  name: string;
  brand: string;
  category:
    | 'chocolates'
    | 'premium_bars'
    | 'sweets'
    | 'keepsakes'
    | 'roses_decor'
    | 'lights'
    | 'photos'
    | 'party_fun'
    | 'gift_wrap'
    | 'snacks'
    | 'biscuits';
  simpleName: string; // Indian audience friendly English name
  description: string; // Pure simple Indian English description
  descriptionHinglish?: string;
  weightOrQty: string;
  unitPriceApprox: number;
  tag?: string;
  image?: string; // Local product photograph (e.g. /retail/<key>.jpg) rendered when present
  isPhoto?: boolean;
  photoUrl?: string;
  photoCaption?: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
}

export interface PackagingSizeOption {
  id: string;
  type: 'box' | 'bouquet';
  name: string;
  nameHinglish?: string;
  slotCount: number; // exact number of items that fit
  subtitle: string;
  dimensions: string;
  approxPriceRange: string;
  recommendedFor: string;
  popularBadge?: string;
  imageUrl: string;
  bgHex: string;
  borderHex: string;
  illustrationType:
    | 'small_box'
    | 'medium_box'
    | 'large_box'
    | 'xl_trunk'
    | 'mini_bouquet'
    | 'classic_bouquet'
    | 'heart_bouquet'
    | 'photo_bouquet'
    | 'velvet_hatbox'
    | 'acrylic_chest';
}

// Return the bespoke ItemGraphic id for specialty chest packagings whose
// external photo was not accurate; null keeps the real photograph instead.
export function packagingArtSvgId(pkg: PackagingSizeOption): string | null {
  if (pkg.illustrationType === 'velvet_hatbox') return 'packaging-velvet-hatbox';
  if (pkg.illustrationType === 'acrylic_chest') return 'packaging-acrylic-chest';
  if (pkg.illustrationType === 'xl_trunk') return 'packaging-heritage-trunk';
  return null;
}

export interface PreMadeSuggestion {
  id: string;
  title: string;
  titleHinglish?: string;
  subtitle: string;
  packagingId: string;
  itemIds: string[];
  tag: string;
  approxTotal: string;
}

// Sample user photos for memory prints & photo bouquets
export const SAMPLE_POLAROID_PRESETS = [
  {
    id: 'photo-preset-1',
    title: 'Romantic Couple Moment',
    url: '/polaroids/polaroid-preset-1.jpg',
    caption: 'Forever & Always ❤️',
  },
  {
    id: 'photo-preset-2',
    title: 'Birthday Celebration Smile',
    url: '/polaroids/polaroid-preset-2.jpg',
    caption: 'Cheers to another magical year! 🎂',
  },
  {
    id: 'photo-preset-3',
    title: 'Best Friends Golden Hour',
    url: '/polaroids/polaroid-preset-3.jpg',
    caption: 'Friends who become family ✨',
  },
  {
    id: 'photo-preset-4',
    title: 'Sweet Family Milestone',
    url: '/polaroids/polaroid-preset-4.jpg',
    caption: 'Pure family happiness 💖',
  },
  {
    id: 'photo-preset-5',
    title: 'Anniversary Memory',
    url: '/polaroids/polaroid-preset-5.jpg',
    caption: 'Every love story is beautiful 💍',
  },
  {
    id: 'photo-preset-6',
    title: 'Candid Sunshine Laugh',
    url: '/polaroids/polaroid-preset-6.jpg',
    caption: 'Keep shining bright 🌟',
  },
];

// ====================================================
// REALISTIC BRAND ITEMS & PARTY/DECOR SELECTIONS
// Written in pure simple Indian English
// ====================================================
export const BRANDED_ITEMS_CATALOG: BrandedItem[] = [
  // --- 1. Cadbury Silk Varieties ---
  {
    id: 'item-silk-classic',
    name: 'Cadbury Dairy Milk Silk (Classic)',
    brand: 'Cadbury',
    category: 'premium_bars',
    simpleName: 'Silk Classic Chocolate Bar',
    description: 'Silky smooth and creamy milk chocolate, beloved across India.',
    weightOrQty: '60g / 150g',
    unitPriceApprox: 90,
    tag: 'Bestseller',
    colorScheme: {
      bg: '#3B1358', // Royal Silk Violet
      text: '#FFFFFF',
      border: '#D4AF37',
      accent: '#DFBA54',
    },
  },
  {
    id: 'item-silk-roast-almond',
    name: 'Cadbury Silk Roast Almond',
    brand: 'Cadbury',
    category: 'premium_bars',
    simpleName: 'Silk Roast Almond Bar',
    description: 'Crispy roasted whole California almonds blended with rich Silk chocolate.',
    weightOrQty: '143g',
    unitPriceApprox: 180,
    tag: 'Special Favorite',
    colorScheme: {
      bg: '#2C0D43',
      text: '#FFFFFF',
      border: '#C5A059',
      accent: '#E6A15C',
    },
  },
  {
    id: 'item-silk-bubbly',
    name: 'Cadbury Silk Bubbly',
    brand: 'Cadbury',
    category: 'premium_bars',
    simpleName: 'Silk Bubbly Chocolate',
    description: 'Delicious chocolate bubbles filled with creamy milk chocolate goodness.',
    weightOrQty: '120g',
    unitPriceApprox: 175,
    tag: 'Fun & Creamy',
    colorScheme: {
      bg: '#4A154B',
      text: '#FFFFFF',
      border: '#E879F9',
      accent: '#F472B6',
    },
  },
  {
    id: 'item-silk-hazelnut',
    name: 'Cadbury Silk Hazelnut',
    brand: 'Cadbury',
    category: 'premium_bars',
    simpleName: 'Silk Hazelnut Chocolate',
    description: 'Crunchy whole Turkish hazelnuts inside velvety smooth dairy milk chocolate.',
    weightOrQty: '143g',
    unitPriceApprox: 185,
    tag: 'Nutty Treat',
    colorScheme: {
      bg: '#37184A',
      text: '#FFFFFF',
      border: '#D97706',
      accent: '#FBBF24',
    },
  },
  {
    id: 'item-cadbury-dairy-milk',
    name: 'Cadbury Dairy Milk (Classic Large)',
    brand: 'Cadbury',
    category: 'chocolates',
    simpleName: 'Cadbury Dairy Milk Classic',
    description: 'The iconic purple chocolate bar that every Indian home celebrates with.',
    weightOrQty: '130g',
    unitPriceApprox: 80,
    tag: 'Kuch Meetha Ho Jaaye',
    colorScheme: {
      bg: '#2A0845',
      text: '#FFFFFF',
      border: '#DFBA54',
      accent: '#C5A059',
    },
  },

  // --- 2. Nestle KitKat & Milkybar ---
  {
    id: 'item-nestle-kitkat-4finger',
    name: 'Nestle KitKat 4-Finger Crisp Wafer',
    brand: 'Nestle',
    category: 'chocolates',
    simpleName: 'KitKat 4-Finger Crispy Wafer',
    description: 'Signature crispy wafer fingers covered in smooth milk chocolate. Have a break!',
    weightOrQty: '38g × 2',
    unitPriceApprox: 50,
    tag: 'Crispy Favorite',
    colorScheme: {
      bg: '#B91C1C',
      text: '#FFFFFF',
      border: '#EF4444',
      accent: '#FEE2E2',
    },
  },
  {
    id: 'item-nestle-kitkat-dessert-delight',
    name: 'Nestle KitKat Dessert Delight (Truffle)',
    brand: 'Nestle',
    category: 'premium_bars',
    simpleName: 'KitKat Dessert Delight Truffle',
    description: 'Decadent chocolate truffle filled crispy wafer bar with premium dessert coating.',
    weightOrQty: '50g',
    unitPriceApprox: 70,
    tag: 'Dessert Delight',
    colorScheme: {
      bg: '#7F1D1D',
      text: '#FFFFFF',
      border: '#D4AF37',
      accent: '#FCA5A5',
    },
  },
  {
    id: 'item-nestle-milkybar',
    name: 'Nestle Milkybar Creamy White Chocolate',
    brand: 'Nestle',
    category: 'chocolates',
    simpleName: 'Milkybar Creamy White Chocolate',
    description: 'Wholesome creamy white chocolate bar with rich milky sweetness.',
    weightOrQty: '42g',
    unitPriceApprox: 40,
    tag: 'White Chocolate',
    colorScheme: {
      bg: '#0284C7',
      text: '#FFFFFF',
      border: '#E0F2FE',
      accent: '#BAE6FD',
    },
  },

  // --- 3. Ferrero Rocher & Golden Truffles ---
  {
    id: 'item-ferrero-rocher-3pack',
    name: 'Ferrero Rocher Golden Collection (Pack of 4)',
    brand: 'Ferrero',
    category: 'premium_bars',
    simpleName: 'Ferrero Rocher Truffles (Pack of 4)',
    description: 'Whole crunchy hazelnut in a crisp wafer shell, coated in hazelnut milk chocolate.',
    weightOrQty: '4 Golden Balls',
    unitPriceApprox: 160,
    tag: 'Luxury Golden Favorite',
    colorScheme: {
      bg: '#B48A3C',
      text: '#FFFFFF',
      border: '#D4AF37',
      accent: '#FFF8E1',
    },
  },
  {
    id: 'item-ferrero-rocher-box',
    name: 'Ferrero Rocher Deluxe Box (Pack of 8)',
    brand: 'Ferrero',
    category: 'premium_bars',
    simpleName: 'Ferrero Rocher Deluxe Gift Box (8 Pcs)',
    description: 'Clear luxury presentation box containing 8 individually wrapped golden foil truffles.',
    weightOrQty: '8 Golden Balls Box',
    unitPriceApprox: 320,
    tag: 'Festive Bestseller',
    colorScheme: {
      bg: '#8C6821',
      text: '#FFFFFF',
      border: '#F3E5AB',
      accent: '#FFD700',
    },
  },

  // --- 4. Almond Rocks & Snickers ---
  {
    id: 'item-almond-chocolate-rocks',
    name: 'Handcrafted Roasted Almond Rocks',
    brand: 'Custom',
    category: 'premium_bars',
    simpleName: 'Roasted Almond Chocolate Rocks',
    description: 'Slow-roasted California almonds generously clustered in rich dark chocolate.',
    weightOrQty: '100g Pouch',
    unitPriceApprox: 150,
    tag: 'Handmade Artisanal',
    colorScheme: {
      bg: '#212121',
      text: '#F3E5AB',
      border: '#D4AF37',
      accent: '#D4AF37',
    },
  },
  {
    id: 'item-snickers-bar',
    name: 'Snickers Peanut Chocolate Bar',
    brand: 'Mars',
    category: 'chocolates',
    simpleName: 'Snickers Peanut & Caramel Bar',
    description: 'Roasted crunchy peanuts, soft chewy nougat, and caramel dipped in milk chocolate.',
    weightOrQty: '45g',
    unitPriceApprox: 50,
    colorScheme: {
      bg: '#4E342E',
      text: '#FFFFFF',
      border: '#1976D2',
      accent: '#FFB300',
    },
  },

  // --- 5. LIGHTING OPTIONS (Wired & Twinkling) ---
  {
    id: 'item-fairy-warm-lights',
    name: 'Warm Golden Micro-LED Fairy Lights',
    brand: 'LuxeGlow',
    category: 'lights',
    simpleName: 'Warm Golden LED Fairy Lights (2M)',
    description: 'Woven micro-LED copper wire lights that softly illuminate every chocolate and flower upon opening.',
    weightOrQty: '2 Meter String (Batteries Included)',
    unitPriceApprox: 100,
    tag: 'Twinkling Magic',
    colorScheme: {
      bg: '#78350F',
      text: '#FEF3C7',
      border: '#FBBF24',
      accent: '#FDE047',
    },
  },
  {
    id: 'item-rgb-party-lights',
    name: 'Festive Rainbow RGB Flashing Lights',
    brand: 'LuxeGlow',
    category: 'lights',
    simpleName: 'Multi-Color Party RGB Lights',
    description: 'Vibrant flashing multi-colored LEDs for unforgettable birthday and anniversary celebrations.',
    weightOrQty: '3 Lighting Modes',
    unitPriceApprox: 120,
    tag: 'Party Favorite',
    colorScheme: {
      bg: '#4C1D95',
      text: '#FDF4FF',
      border: '#EC4899',
      accent: '#06B6D4',
    },
  },
  {
    id: 'item-golden-cork-lights',
    name: 'Warm Golden Cork Bottle Fairy Lights',
    brand: 'LuxeGlow',
    category: 'lights',
    simpleName: 'Warm Cork Bottle Glowing Lights',
    description: 'Vintage cork-shaped LED light string designed to drape gracefully across hamper gifts.',
    weightOrQty: '10 LEDs String',
    unitPriceApprox: 90,
    tag: 'Vintage Sparkle',
    colorScheme: {
      bg: '#854D0E',
      text: '#FEF9C3',
      border: '#EAB308',
      accent: '#FEF08A',
    },
  },
  {
    id: 'item-neon-heart-clip',
    name: 'Glowing LED Heart Light Clip',
    brand: 'LuxeGlow',
    category: 'lights',
    simpleName: 'Glowing Neon Heart Clip',
    description: 'Luminous illuminated heart-shaped clip to hold your personal message card or photo print.',
    weightOrQty: '1 Light Clip',
    unitPriceApprox: 110,
    tag: 'Romantic Glow',
    colorScheme: {
      bg: '#9F1239',
      text: '#FFE4E6',
      border: '#FB7185',
      accent: '#FDA4AF',
    },
  },

  // --- 6. PHOTO MEMORY PRINTS & POLAROIDS ---
  {
    id: 'item-polaroid-photo-print',
    name: 'Personalized Polaroid Photo Memory Print',
    brand: 'Keepsake',
    category: 'photos',
    simpleName: 'Custom Polaroid Photo Print',
    description: 'Your favorite photograph printed in glossy retro polaroid style with a wooden craft clip.',
    weightOrQty: '1 Custom Photo Print',
    unitPriceApprox: 80,
    isPhoto: true,
    photoUrl: '/polaroids/polaroid-preset-1.jpg',
    photoCaption: 'Forever Memories ❤️',
    tag: 'Personal Memory',
    colorScheme: {
      bg: '#0F172A',
      text: '#F8FAFC',
      border: '#94A3B8',
      accent: '#CBD5E1',
    },
  },
  {
    id: 'item-polaroid-photo-couple',
    name: 'Couple Romantic Moment Polaroid Print',
    brand: 'Keepsake',
    category: 'photos',
    simpleName: 'Couple Romance Photo Print',
    description: 'Romantic couple memory photo mounted on bamboo skewer for bouquets or keepsake boxes.',
    weightOrQty: '1 Photo + Wooden Peg',
    unitPriceApprox: 80,
    isPhoto: true,
    photoUrl: '/polaroids/polaroid-preset-5.jpg',
    photoCaption: 'With All My Heart 💖',
    tag: 'Romantic Keepsake',
    colorScheme: {
      bg: '#881337',
      text: '#FFF1F2',
      border: '#FB7185',
      accent: '#F43F5E',
    },
  },
  {
    id: 'item-polaroid-photo-birthday',
    name: 'Birthday Celebration Snapshot Print',
    brand: 'Keepsake',
    category: 'photos',
    simpleName: 'Birthday Celebration Snapshot',
    description: 'Cherished birthday laugh snapshot printed in high-definition retro frame with custom title.',
    weightOrQty: '1 Photo Print',
    unitPriceApprox: 80,
    isPhoto: true,
    photoUrl: '/polaroids/polaroid-preset-2.jpg',
    photoCaption: 'Happy Birthday to You! 🎂',
    tag: 'Birthday Special',
    colorScheme: {
      bg: '#1E1B4B',
      text: '#EEF2FF',
      border: '#818CF8',
      accent: '#A5B4FC',
    },
  },

  // --- 7. PARTY & FUN PROPS ---
  {
    id: 'item-party-popper',
    name: 'Celebration Golden Confetti Party Popper',
    brand: 'PartyQueen',
    category: 'party_fun',
    simpleName: 'Golden Confetti Party Popper',
    description: 'High-energy party popper filled with shimmering golden and metallic confetti stars.',
    weightOrQty: '1 Spring Popper',
    unitPriceApprox: 60,
    tag: 'Party Energy',
    colorScheme: {
      bg: '#D97706',
      text: '#FFFFFF',
      border: '#FBBF24',
      accent: '#FEF3C7',
    },
  },
  {
    id: 'item-birthday-sash',
    name: 'Glitter "Birthday Queen" Satin Sash',
    brand: 'PartyQueen',
    category: 'party_fun',
    simpleName: 'Glitter "Birthday Queen" Sash',
    description: 'Luxurious double-layered satin sash with sparkling gold calligraphy foil lettering.',
    weightOrQty: '1 Premium Sash',
    unitPriceApprox: 150,
    tag: 'Birthday Wear',
    colorScheme: {
      bg: '#BE185D',
      text: '#FDF2F8',
      border: '#F472B6',
      accent: '#FCE7F3',
    },
  },
  {
    id: 'item-celebration-crown',
    name: 'Sparkling Rhinestone Princess / Queen Tiara',
    brand: 'PartyQueen',
    category: 'party_fun',
    simpleName: 'Sparkling Queen Crown Tiara',
    description: 'Exquisite metal-crafted rhinestone princess crown designed for the special celebration star.',
    weightOrQty: '1 Crown Tiara',
    unitPriceApprox: 190,
    tag: 'Royal Star',
    colorScheme: {
      bg: '#831843',
      text: '#FFFFFF',
      border: '#D4AF37',
      accent: '#FDE68A',
    },
  },
  {
    id: 'item-musical-greeting-card',
    name: 'Interactive Musical Chime Pop-Up Card',
    brand: 'PartyQueen',
    category: 'party_fun',
    simpleName: 'Musical Melody Pop-Up Card',
    description: 'Charming 3D pop-up celebration card that plays sweet birthday chimes upon opening.',
    weightOrQty: '1 Musical Card',
    unitPriceApprox: 140,
    tag: 'Interactive Melody',
    colorScheme: {
      bg: '#0F766E',
      text: '#F0FDFA',
      border: '#2DD4BF',
      accent: '#CCFBF1',
    },
  },
  {
    id: 'item-sparkler-toppers',
    name: 'Golden Star Sparkler Box Toppers (Pack of 2)',
    brand: 'PartyQueen',
    category: 'party_fun',
    simpleName: 'Golden Star Sparkler Toppers',
    description: 'Magical golden sparkler sticks to light up the celebration cake or dessert table.',
    weightOrQty: 'Pack of 2',
    unitPriceApprox: 90,
    tag: 'Sparkler Fun',
    colorScheme: {
      bg: '#B45309',
      text: '#FFFBEB',
      border: '#F59E0B',
      accent: '#FDE68A',
    },
  },

  // --- 8. LUXURY GIFT WRAPPING & FINISHING TOUCHES ---
  {
    id: 'item-wrap-gold-cushion',
    name: 'Metallic Gold Shredded Grass Cushion Bed',
    brand: 'Keepsake',
    category: 'gift_wrap',
    simpleName: 'Metallic Gold Cushion Grass Fill',
    description: 'Crisp shimmering gold shredded paper bed providing soft padding and royal presentation.',
    weightOrQty: 'Box Base Fill',
    unitPriceApprox: 60,
    tag: 'Royal Bedding',
    colorScheme: {
      bg: '#713F12',
      text: '#FEF9C3',
      border: '#CA8A04',
      accent: '#FEF08A',
    },
  },
  {
    id: 'item-wrap-wax-seal',
    name: 'Imperial Hand-Stamped Wax Seal with Gold Flakes',
    brand: 'Keepsake',
    category: 'gift_wrap',
    simpleName: 'Royal Wax Seal with Gold Flakes',
    description: 'Traditional molten burgundy wax stamped with the Hamper Queen royal crest & 24K gold dust.',
    weightOrQty: '1 Artisan Wax Seal',
    unitPriceApprox: 70,
    tag: 'Artisan Finish',
    colorScheme: {
      bg: '#881337',
      text: '#FFF1F2',
      border: '#D4AF37',
      accent: '#FDE047',
    },
  },
  {
    id: 'item-wrap-gold-cellophane',
    name: 'Crystal Clear Wrap with Metallic Gold Edges',
    brand: 'Keepsake',
    category: 'gift_wrap',
    simpleName: 'Gold-Edged Protective Cellophane',
    description: 'High-clarity dust-proof wrapping sheet trimmed with hand-embossed gold ribbon tape.',
    weightOrQty: 'Outer Shield Wrap',
    unitPriceApprox: 50,
    tag: 'Pristine Shield',
    colorScheme: {
      bg: '#1E293B',
      text: '#F8FAFC',
      border: '#E2E8F0',
      accent: '#F1F5F9',
    },
  },

  // --- 9. KEEPSAKES & FLORALS ---
  {
    id: 'item-red-velvet-roses',
    name: 'Hand-Tied Red Velvet Roses Cluster',
    brand: 'Keepsake',
    category: 'roses_decor',
    simpleName: 'Hand-Tied Red Velvet Roses',
    description: 'Velvet soft red roses nestled with baby breath, tied with a golden satin ribbon.',
    weightOrQty: 'Cluster of 3 Fresh Roses',
    unitPriceApprox: 120,
    tag: 'Fresh Florals',
    colorScheme: {
      bg: '#881337',
      text: '#FFE4E6',
      border: '#FB7185',
      accent: '#E11D48',
    },
  },
  {
    id: 'item-cute-mini-teddy',
    name: 'Miniature Plush Teddy Bear (Cream / Brown)',
    brand: 'Keepsake',
    category: 'keepsakes',
    simpleName: 'Mini Plush Cuddle Teddy Bear',
    description: 'Super-soft miniature keepsake teddy bear holding a tiny embroidered red heart.',
    weightOrQty: '12 cm Plush Toy',
    unitPriceApprox: 130,
    tag: 'Sweet Keepsake',
    colorScheme: {
      bg: '#78350F',
      text: '#FEF3C7',
      border: '#D97706',
      accent: '#F59E0B',
    },
  },
];

// ====================================================
// PACKAGING SIZES (BOXES, BOUQUETS, PHOTO BOUQUETS & CRATES)
// ====================================================
export const PACKAGING_SIZE_OPTIONS: PackagingSizeOption[] = [
  // --- GIFT BOXES ---
  {
    id: 'box-pocket-2',
    type: 'box',
    name: 'Pocket Gift Box',
    slotCount: 2,
    subtitle: 'Our smallest gift box starting at INR 149 (+delivery). Fits 2 treats or chocolates',
    dimensions: '14 × 10 × 6 cm',
    approxPriceRange: 'INR 149 – INR 249 (+delivery)',
    recommendedFor: 'Pocket Surprise, Token of Appreciation, Return Favors',
    popularBadge: 'Starts INR 149',
    imageUrl: '/packaging/packaging-small-box.jpg',
    bgHex: '#FFFDF9',
    borderHex: '#D4AF37',
    illustrationType: 'small_box',
  },
  {
    id: 'box-small-4',
    type: 'box',
    name: 'Small Gift Box',
    slotCount: 4,
    subtitle: 'Compact and sweet box designed for 4 chocolates or treats',
    dimensions: '20 × 15 × 8 cm',
    approxPriceRange: 'INR 199 – INR 349 (+delivery)',
    recommendedFor: 'Birthdays, Thank You Tokens, Rakhi & Return Favors',
    imageUrl: '/packaging/packaging-small-box.jpg',
    bgHex: '#FFFDF9',
    borderHex: '#D4AF37',
    illustrationType: 'small_box',
  },
  {
    id: 'box-medium-6',
    type: 'box',
    name: 'Medium Celebration Box',
    slotCount: 6,
    subtitle: 'Our most popular celebration gift box designed for 6 items',
    dimensions: '28 × 20 × 10 cm',
    approxPriceRange: 'INR 299 – INR 449',
    recommendedFor: 'Best Friend Birthday, Anniversary, Sweet Surprises',
    popularBadge: 'Most Popular',
    imageUrl: '/packaging/packaging-medium-box.jpg',
    bgHex: '#FAF8F5',
    borderHex: '#B8860B',
    illustrationType: 'medium_box',
  },
  {
    id: 'box-large-9',
    type: 'box',
    name: 'Grand Royal Gift Box',
    slotCount: 9,
    subtitle: 'Spacious presentation box accommodating 9 items, roses, lights & teddy',
    dimensions: '36 × 26 × 12 cm',
    approxPriceRange: 'INR 399 – INR 599',
    recommendedFor: 'Special Anniversary, Romantic Proposal, Engagement',
    popularBadge: 'Royal Choice',
    imageUrl: '/packaging/packaging-large-box.jpg',
    bgHex: '#FFFDF9',
    borderHex: '#D4AF37',
    illustrationType: 'large_box',
  },
  {
    id: 'box-velvet-hatbox-8',
    type: 'box',
    name: 'Royal Velvet Round Hat Box',
    slotCount: 8,
    subtitle: 'Ultra-luxurious circular hatbox with gold foil trim, holds 8 items + lights',
    dimensions: '25 cm Diameter × 18 cm Height',
    approxPriceRange: 'INR 499 – INR 699',
    recommendedFor: 'Milestone Birthdays, Wedding Trousseau, VVIP Gifting',
    popularBadge: 'Luxury Velvet',
    imageUrl: '/packaging/packaging-velvet-hatbox.jpg',
    bgHex: '#FDF2F8',
    borderHex: '#EC4899',
    illustrationType: 'velvet_hatbox',
  },
  {
    id: 'box-crystal-acrylic-9',
    type: 'box',
    name: 'Crystal Acrylic Keepsake Chest',
    slotCount: 9,
    subtitle: 'Clear transparent luxury acrylic box with vintage golden lock clasp and 9 slots',
    dimensions: '32 × 22 × 12 cm',
    approxPriceRange: 'INR 499 – INR 699',
    recommendedFor: 'Jewelry & Chocolate Surprises, Keepsake Memories',
    popularBadge: 'Crystal Clear',
    imageUrl: '/packaging/packaging-acrylic-chest.jpg',
    bgHex: '#F0FDFA',
    borderHex: '#0D9488',
    illustrationType: 'acrylic_chest',
  },
  {
    id: 'box-xl-12',
    type: 'box',
    name: 'Sovereign Heritage Trunk',
    slotCount: 12,
    subtitle: 'Heirloom rigid keepsake trunk designed for 12 full-sized luxury gifts',
    dimensions: '44 × 32 × 16 cm',
    approxPriceRange: 'INR 599 – INR 899',
    recommendedFor: 'Weddings, Trousseau, 50th Birthdays & Corporate Honors',
    popularBadge: 'Prestige Trunk',
    imageUrl: '/packaging/packaging-xl-trunk.jpg',
    bgHex: '#FAF6EC',
    borderHex: '#8C6821',
    illustrationType: 'xl_trunk',
  },

  // --- BOUQUETS (CHOCOLATE, ROSES & ONLY IMAGE BOUQUETS) ---
  {
    id: 'bouquet-mini-5',
    type: 'bouquet',
    name: 'Mini Chocolate Bouquet',
    slotCount: 5,
    subtitle: 'Hand-crafted bouquet arrangement holding 5 chocolates & red roses',
    dimensions: '35 cm Height',
    approxPriceRange: 'INR 299 – INR 449',
    recommendedFor: 'College Birthday, Congratulations, Sweet Gestures',
    imageUrl: '/packaging/packaging-mini-bouquet.jpg',
    bgHex: '#FFF5F7',
    borderHex: '#FB7185',
    illustrationType: 'mini_bouquet',
  },
  {
    id: 'bouquet-photo-only-6',
    type: 'bouquet',
    name: 'Pure Photo Memory Bouquet (Only Images)',
    slotCount: 6,
    subtitle: 'Unique bouquet made entirely of 6 custom Polaroid photos, baby breath & fairy lights',
    dimensions: '42 cm Height',
    approxPriceRange: 'INR 399 – INR 549',
    recommendedFor: 'Long-Distance Love, Best Friends, Family Memories',
    popularBadge: 'Only Image Bouquet',
    imageUrl: '/packaging/packaging-photo-bouquet.jpg',
    bgHex: '#EEF2FF',
    borderHex: '#6366F1',
    illustrationType: 'photo_bouquet',
  },
  {
    id: 'bouquet-classic-8',
    type: 'bouquet',
    name: 'Classic Chocolate & Rose Bouquet',
    slotCount: 8,
    subtitle: 'Cascading floral bouquet holding 8 assorted chocolates & premium roses',
    dimensions: '48 cm Height',
    approxPriceRange: 'INR 449 – INR 649',
    recommendedFor: 'Birthday Surprise, Valentine Celebrations, Special Milestones',
    popularBadge: 'Bouquet Bestseller',
    imageUrl: '/packaging/packaging-classic-bouquet.jpg',
    bgHex: '#FFF0F3',
    borderHex: '#E11D48',
    illustrationType: 'classic_bouquet',
  },
  {
    id: 'bouquet-heart-12',
    type: 'bouquet',
    name: 'Mega Royal Heart Bouquet',
    slotCount: 12,
    subtitle: 'Grand heart-shaped chocolate & photo arrangement with 12 items & fairy lights',
    dimensions: '60 cm Height',
    approxPriceRange: 'INR 599 – INR 799',
    recommendedFor: 'Anniversary Surprise, Love Proposal, Big Celebration',
    popularBadge: 'Grand Showstopper',
    imageUrl: '/packaging/packaging-heart-bouquet.jpg',
    bgHex: '#FFF0F3',
    borderHex: '#BE123C',
    illustrationType: 'heart_bouquet',
  },
];

// ====================================================
// READY COMBINATION SUGGESTIONS (1-CLICK FILL)
// ====================================================
export const PRE_MADE_SUGGESTIONS: PreMadeSuggestion[] = [
  {
    id: 'sugg-photo-memory-bouquet',
    title: 'Pure Photo Memory Bouquet (Only Images & Lights)',
    subtitle: '6 Custom Polaroid Memories + Warm Fairy Lights + Golden Satin Bow',
    packagingId: 'bouquet-photo-only-6',
    itemIds: [
      'item-polaroid-photo-couple',
      'item-polaroid-photo-birthday',
      'item-polaroid-photo-print',
      'item-fairy-warm-lights',
      'item-wrap-wax-seal',
      'item-red-velvet-roses',
    ],
    tag: 'Photo Keepsake Special',
    approxTotal: 'INR 349 approx',
  },
  {
    id: 'sugg-birthday-party-blast',
    title: 'Ultimate Birthday Party Blast Box',
    subtitle: 'Silk Bubbly + KitKat + Party Popper + Birthday Sash + Crown Tiara + Warm Lights',
    packagingId: 'box-medium-6',
    itemIds: [
      'item-silk-bubbly',
      'item-nestle-kitkat-4finger',
      'item-party-popper',
      'item-birthday-sash',
      'item-celebration-crown',
      'item-fairy-warm-lights',
    ],
    tag: 'Party Star Favorite',
    approxTotal: 'INR 399 approx',
  },
  {
    id: 'sugg-silk-kitkat-lover',
    title: 'Cadbury Silk & KitKat Lover Combo',
    subtitle: 'Cadbury Silk Roast Almond + KitKat 4-Finger + Dairy Milk + Cuddle Teddy Bear',
    packagingId: 'box-small-4',
    itemIds: ['item-silk-roast-almond', 'item-nestle-kitkat-4finger', 'item-cadbury-dairy-milk', 'item-cute-mini-teddy'],
    tag: 'Most Loved',
    approxTotal: 'INR 249 approx',
  },
  {
    id: 'sugg-romantic-roses-chocolate',
    title: 'Romantic Roses & Chocolates Bouquet',
    subtitle: 'Silk Classic + Ferrero Rocher + KitKat + Fresh Red Roses + Fairy Lights',
    packagingId: 'bouquet-mini-5',
    itemIds: [
      'item-silk-classic',
      'item-ferrero-rocher-3pack',
      'item-nestle-kitkat-4finger',
      'item-red-velvet-roses',
      'item-fairy-warm-lights',
    ],
    tag: 'Romance & Anniversary',
    approxTotal: 'INR 349 approx',
  },
  {
    id: 'sugg-acrylic-golden-luxe',
    title: 'Crystal Acrylic Golden Luxury Chest',
    subtitle: 'Ferrero Box + Silk Hazelnut + Roasted Almonds + Golden Cork Lights + Wax Seal + Polaroid',
    packagingId: 'box-crystal-acrylic-9',
    itemIds: [
      'item-ferrero-rocher-box',
      'item-silk-hazelnut',
      'item-almond-chocolate-rocks',
      'item-golden-cork-lights',
      'item-polaroid-photo-couple',
      'item-wrap-wax-seal',
      'item-wrap-gold-cushion',
      'item-red-velvet-roses',
      'item-musical-greeting-card',
    ],
    tag: 'Crystal Luxury',
    approxTotal: 'INR 699 approx',
  },
];
