import {
  RateCardLine,
  bouquetSellingPrice,
  bouquetPricingNote,
} from '../utils/retailPricing';

export interface HamperQueenProduct {
  id: string;
  itemCode?: string;
  name: string;
  nameHinglish: string;
  category:
    | 'bouquets'
    | 'birthday_hampers'
    | 'specialty_boxes'
    | 'gourmet_trays'
    | 'customised_hampers'
    | 'addons_retail'
    | 'mugs_cups'
    | 'accessories'
    | 'clothing';
  categoryLabel: string;
  subtitle: string;
  subtitleHinglish: string;
  description: string;
  itemsIncluded: string[];
  customizableSubstitutions?: string[];
  approxPrice: string;
  pricingNote: string;
  /** Real retail rate card (Blinkit-captured rates) — optional; drives honest pricing & images. */
  rateCard?: RateCardLine[];
  badge?: string;
  themeColor: {
    bg: string;
    accent: string;
    border: string;
    pillBg: string;
    pillText: string;
  };
  graphicId: string;
  brochureSource: string;
}

export const HAMPER_QUEEN_OFFICIAL_CONTACT = {
  phone: '8080580105',
  phoneDisplay: '+91 8080580105',
  email: 'hamperqueen20@gmail.com',
  instagram: 'hamper_queen',
  instagramUrl: 'https://instagram.com/hamper_queen',
  tagline: 'We wrapped these gifts with love and care',
  minOrder: 140,
  freeDeliveryThreshold: 499,
  deliveryFeeUnderThreshold: 49,
  pricingPolicy:
    'Orders start from INR 140 (+delivery) • Real retail item rates applied • Signature hampers from INR 499 • Free delivery on orders above INR 499!',
};

// Automatic stable item code resolver
export const getHamperQueenItemCode = (prod: HamperQueenProduct): string => {
  if (prod.itemCode) return prod.itemCode;
  if (prod.id.includes('pocket-delight')) return 'HQ-MINI-01';
  if (prod.id.includes('sweet-duo')) return 'HQ-MINI-02';
  if (prod.id.includes('celebration-trio')) return 'HQ-MINI-03';
  if (prod.id.includes('kitkat')) return 'HQ-BKT-01';
  if (prod.id.includes('dark-fantasy')) return 'HQ-BKT-02';
  if (prod.id.includes('women-accessory')) return 'HQ-BKT-03';
  if (prod.id.includes('men-accessory')) return 'HQ-BKT-04';
  if (prod.id.includes('custom-photo')) return 'HQ-BKT-05';
  if (prod.id.includes('kinder-joy')) return 'HQ-BKT-06';

  if (prod.id.includes('hamper-1-')) return 'HQ-HMP-01';
  if (prod.id.includes('hamper-2-')) return 'HQ-HMP-02';
  if (prod.id.includes('hamper-3-')) return 'HQ-HMP-03';
  if (prod.id.includes('hamper-4-')) return 'HQ-HMP-04';
  if (prod.id.includes('hamper-5-')) return 'HQ-HMP-05';
  if (prod.id.includes('hamper-6-')) return 'HQ-HMP-06';
  if (prod.id.includes('hamper-7-')) return 'HQ-HMP-07';
  if (prod.id.includes('hamper-8-')) return 'HQ-HMP-08';
  if (prod.id.includes('hamper-9-')) return 'HQ-HMP-09';
  if (prod.id.includes('hamper-10-')) return 'HQ-HMP-10';
  if (prod.id.includes('hamper-11-')) return 'HQ-HMP-11';
  if (prod.id.includes('hamper-12-')) return 'HQ-HMP-12';

  if (prod.id.includes('dress-hamper')) return 'HQ-BOX-01';
  if (prod.id.includes('shirt-box')) return 'HQ-BOX-02';
  if (prod.id.includes('heart-box')) return 'HQ-BOX-03';
  if (prod.id.includes('watch-box')) return 'HQ-BOX-04';
  if (prod.id.includes('snack-tray')) return 'HQ-TRY-01';

  if (prod.id.includes('addon-snack-attack')) return 'HQ-ADD-01';
  if (prod.id.includes('addon-movie-night')) return 'HQ-ADD-02';
  if (prod.id.includes('addon-mini-candy')) return 'HQ-ADD-03';
  if (prod.id.includes('addon-oreo-midnight')) return 'HQ-ADD-04';
  if (prod.id.includes('addon-choco-trio')) return 'HQ-ADD-05';
  if (prod.id.includes('addon-binge-basket')) return 'HQ-ADD-06';

  if (prod.id.includes('mug-photo-keepsake')) return 'HQ-MUG-01';
  if (prod.id.includes('mug-ceramic-cocoa')) return 'HQ-MUG-02';
  if (prod.id.includes('accessory-jewellery')) return 'HQ-ACC-01';
  if (prod.id.includes('accessory-hair')) return 'HQ-ACC-02';
  if (prod.id.includes('clothing-tee')) return 'HQ-CLT-01';
  if (prod.id.includes('clothing-hoodie')) return 'HQ-CLT-02';

  return `#HQ-${prod.id.slice(0, 7).toUpperCase()}`;
};

// Recommended substitutions and customization options
export const getHamperQueenSubstitutions = (prod: HamperQueenProduct): string[] => {
  if (prod.customizableSubstitutions && prod.customizableSubstitutions.length > 0) {
    return prod.customizableSubstitutions;
  }
  if (prod.category === 'bouquets') {
    return [
      'Swap chocolate brand (Cadbury Dairy Milk / KitKat / Ferrero Rocher)',
      'Choice of ribbon & paper wrap color (Gold, Blush Pink, Midnight Navy, Teal)',
      'Add custom printed Polaroid photos with wooden clips (+INR 149)',
      'Add LED fairy lights string inside bouquet (+INR 99)',
    ];
  }
  if (prod.category === 'birthday_hampers') {
    return [
      '100% Eggless or Sugar-Free artisanal chocolate options available',
      'Swap perfume fragrance notes (Floral, Citrus, Oud, Vanilla)',
      'Personalized name engraving on leather wallet, mug, or wooden tag',
      'Choice of wax seal design (Royal Crown, Rose, Monogram Initial)',
      'Choice of rigid box color (Blush Rose, Ivory Gold, Classic Black, Forest Green)',
    ];
  }
  if (prod.category === 'addons_retail') {
    return [
      'Mix & match chip/chocolate SKUs from the live retail rate list — swap any pack',
      'Choice of wrap: kraft paper, cellophane, or rigid gift box',
      'Add cold beverage (Thums Up/7Up/Sprite) pairing',
      'Extra Pringles/party-size pack upsell available',
    ];
  }
  if (prod.category === 'mugs_cups') {
    return [
      'Custom printed photo / quote / name on mug or cup',
      'Choice of ceramic color & size (12oz/16oz)',
      'Personalized name engraving on wooden tag',
      'Pair with Silk or Ferrero add-on chocolates',
      'Gift box with satin ribbon & calligraphy note',
    ];
  }
  if (prod.category === 'accessories') {
    return [
      'Curated jewellery style swap (gold/silver/rhodium tone)',
      'Choice of hair accessory colour (blush, ivory, gold)',
      'Add matching scrunchie set or mini perfume',
      'Velvet keepsake box with calligraphy card',
    ];
  }
  if (prod.category === 'clothing') {
    return [
      'Custom printed design, quote or monogram name print',
      'Available sizes: S / M / L / XL / XXL',
      'Fabric option: 100% cotton / cotton-blend / fleece',
      'Wrapped with tissue in premium rigid gift box',
    ];
  }
  return [
    'Customized dimensional size for client-provided garments or timepieces',
    'Custom embroidered family monogram or corporate logo tags',
    'Curated dry fruits & gourmet confectionery substitutions',
  ];
};

// Real retail rate cards for bouquet pricing — item costs from Blinkit (Sep 2026).
const KITKAT_BOUQUET_RATES: RateCardLine[] = [
  { key: 'kitkat_4f', qty: 6, label: 'KitKat 4-Finger bars' },
  { key: 'kitkat_2f', qty: 4, label: 'KitKat 2-Finger bars' },
];

const DARK_FANTASY_BOUQUET_RATES: RateCardLine[] = [
  { key: 'dark_fantasy_150g', qty: 2, label: 'Dark Fantasy big packs (150g)' },
  { key: 'dark_fantasy_230g', qty: 2, label: 'Dark Fantasy choco-fills (230g)' },
];

const MEN_BOUQUET_RATES: RateCardLine[] = [
  { key: 'nivea_men_spray', qty: 1, label: 'Nivea Men Deodorant Spray' },
  { key: 'ferrero_4pc', qty: 1, label: 'Ferrero Rocher gift pack' },
  { key: 'kitkat_2f', qty: 2, label: 'KitKat 2-Finger bars' },
];

const KINDER_BOUQUET_RATES: RateCardLine[] = [
  { key: 'kinder_joy_20g', qty: 6, label: 'Kinder Joy surprise eggs' },
];

// Add-ons retail rate cards — live Blinkit rates for snack & choco add-on hampers.
const SNACK_ATTACK_RATES: RateCardLine[] = [
  { key: 'lays_classic_51g', qty: 3, label: "Lay's Classic Salted" },
  { key: 'kurkure_masala_75g', qty: 2, label: 'Kurkure Masala Munch' },
  { key: 'bingo_madangles_60g', qty: 2, label: 'Bingo Mad Angles' },
  { key: 'kurkure_puffcorn_58g', qty: 1, label: 'Kurkure Puffcorn' },
];

const MOVIE_NIGHT_RATES: RateCardLine[] = [
  { key: 'pringles_original_107g', qty: 1, label: 'Pringles Original' },
  { key: 'pringles_sour_onion_107g', qty: 1, label: 'Pringles Sour Cream & Onion' },
  { key: 'pringles_peri_102g', qty: 1, label: 'Pringles Peri Peri' },
  { key: 'lays_classic_51g', qty: 1, label: "Lay's Classic Salted" },
  { key: 'doritos_sweetchilli_75g', qty: 1, label: 'Doritos Sweet Chilli' },
];

const MINI_CANDY_RATES: RateCardLine[] = [
  { key: 'chupa_sour_bites_66g', qty: 2, label: 'Chupa Chups Sour Bites' },
  { key: 'chupa_sour_belt_58g', qty: 1, label: 'Chupa Chups Sour Belt' },
  { key: 'gems_duo_25g', qty: 2, label: 'Cadbury Gems Duo' },
  { key: 'milkybar_butterscotch_45g', qty: 1, label: 'Milkybar Butterscotch' },
];

const OREO_MIDNIGHT_RATES: RateCardLine[] = [
  { key: 'oreo_vanilla_125g', qty: 1, label: 'Oreo Vanilla' },
  { key: 'oreo_choco_125g', qty: 1, label: 'Oreo Chocolate' },
  { key: 'hide_seek_100g', qty: 1, label: 'Hide & Seek Choco Chip' },
  { key: 'bourbon_99g', qty: 1, label: 'Sunfeast Bourbon' },
];

const CHOCO_TRIO_RATES: RateCardLine[] = [
  { key: 'silk_60g', qty: 1, label: 'Cadbury Silk 60g' },
  { key: 'dairy_milk_46g', qty: 1, label: 'Cadbury Dairy Milk 46g' },
  { key: 'milkybar_butterscotch_45g', qty: 1, label: 'Milkybar Butterscotch' },
  { key: 'galaxy_smooth_30g', qty: 1, label: 'Galaxy Smooth' },
];

const BINGE_BUNDLE_RATES: RateCardLine[] = [
  { key: 'pringles_original_107g', qty: 1, label: 'Pringles Original' },
  { key: 'pringles_sour_onion_107g', qty: 1, label: 'Pringles Sour Cream & Onion' },
  { key: 'lays_classic_51g', qty: 1, label: "Lay's Classic Salted" },
  { key: 'doritos_sweetchilli_75g', qty: 1, label: 'Doritos Sweet Chilli' },
  { key: 'kurkure_masala_75g', qty: 1, label: 'Kurkure Masala Munch' },
  { key: 'bingo_madangles_60g', qty: 1, label: 'Bingo Mad Angles' },
];

export const HAMPER_QUEEN_PRODUCTS: HamperQueenProduct[] = [
  // ==========================================
  // STARTER & BUDGET DELIGHTS (real retail rates)
  // ==========================================
  {
    id: 'starter-pocket-delight',
    itemCode: 'HQ-MINI-01',
    name: 'Pocket Delight Gift Box',
    nameHinglish: 'Pocket Delight Chocolate Box',
    category: 'bouquets',
    categoryLabel: 'Starter Hamper',
    subtitle: 'Cadbury & KitKat with Satin Ribbon & Handwritten Blessing',
    subtitleHinglish: 'Cadbury aur KitKat ka mini pocket gift box golden ribbon ke sath',
    description:
      'Our smallest and sweetest gifting gesture! Features authentic branded chocolates nestled in shredded golden crinkle grass, tied with a luxury satin ribbon, and finished with a handwritten calligraphy note.',
    itemsIncluded: [
      'Cadbury Dairy Milk Chocolate Treat',
      'Nestle KitKat Crisp Wafer Bar',
      'Artisanal Pocket Gift Box with Satin Ribbon',
      'Handwritten Calligraphy Message Card',
    ],
    approxPrice: 'INR 280 (+delivery)',
    pricingNote:
      'Real retail floor: Cadbury Dairy Milk ₹25 + KitKat ₹30 (Blinkit q-commerce, Sep 2026) • Hand-packed gift box, satin ribbon & calligraphy',
    rateCard: [
      { key: 'dairy_milk_26g', qty: 2, label: 'Cadbury Dairy Milk bars' },
      { key: 'kitkat_4f', qty: 1, label: 'KitKat 4-Finger bar' },
    ],
    badge: 'Starting at INR 280',
    themeColor: {
      bg: '#FFFDF9',
      accent: '#DFBA54',
      border: '#E8DCB8',
      pillBg: '#FFFBEB',
      pillText: '#92400E',
    },
    graphicId: 'graphic-pocket-delight',
    brochureSource: 'Hamper Queen Starter Offerings',
  },
  {
    id: 'starter-sweet-duo',
    itemCode: 'HQ-MINI-02',
    name: 'Sweet Duo & Velvet Rose Box',
    nameHinglish: 'Silk & Rose Keepsake Box',
    category: 'birthday_hampers',
    categoryLabel: 'Mini Gift Box',
    subtitle: 'Cadbury Silk, Preserved Crimson Rose Bud & Gold Wax Seal',
    subtitleHinglish: 'Cadbury Silk, velvet gulab aur shahi wax seal gift box',
    description:
      'An intimate romantic or birthday token combining Cadbury Dairy Milk Silk with a preserved velvet rose bud, nestled on gold shredding in a rigid gift box.',
    itemsIncluded: [
      'Cadbury Dairy Milk Silk (Classic 60g)',
      'Preserved Crimson Velvet Rose Bloom',
      'Gold Dust Imperial Wax Seal Stamp',
      'Luxury Gift Box with Double-Faced Satin Bow',
      'Crunchy Roasted Almond Nut Mix',
    ],
    approxPrice: 'INR 350 (+delivery)',
    pricingNote:
      'Real retail floor: Cadbury Silk bar ₹189 (Blinkit q-commerce, Sep 2026) • Preserved rose, wax seal & hand-packed box + free delivery above INR 499',
    badge: 'Popular • INR 350',
    themeColor: {
      bg: '#FFF8F8',
      accent: '#BE185D',
      border: '#FBCFE8',
      pillBg: '#FDF2F8',
      pillText: '#9D174D',
    },
    graphicId: 'graphic-sweet-duo',
    brochureSource: 'Hamper Queen Starter Offerings',
  },
  {
    id: 'starter-celebration-trio',
    itemCode: 'HQ-MINI-03',
    name: 'Celebration Trio Keepsake Hamper',
    nameHinglish: 'Celebration Trio with Fairy Lights',
    category: 'birthday_hampers',
    categoryLabel: 'Celebration Box',
    subtitle: 'Cadbury Silk, KitKat & Twinkling Warm Fairy Lights',
    subtitleHinglish: 'Silk, KitKat aur warm LED fairy lights ka sundar hamper',
    description:
      'A glowing celebration box with twin favorite chocolates and battery-operated warm fairy lights that illuminate the moment the recipient unboxes it.',
    itemsIncluded: [
      'Cadbury Dairy Milk Silk Chocolate Bar',
      'Nestle KitKat 4-Finger Crisp Wafer Bar',
      'Warm Golden LED Fairy Lights (Batteries Included)',
      'Handcrafted Velvet Bedding & Gold Rosette',
      'Crunchy Nestle Munch Bar',
      'Ferrero Rocher Golden Pair',
      'Custom Celebration Topper Card',
    ],
    approxPrice: 'INR 499',
    pricingNote:
      'Real retail floor: Silk ₹189, KitKat ₹30, Munch ₹40, Ferrero ₹179 (Blinkit q-commerce, Sep 2026) • + warm fairy lights & craft',
    rateCard: [
      { key: 'silk_144g', qty: 1, label: 'Cadbury Silk bar' },
      { key: 'kitkat_4f', qty: 1, label: 'KitKat 4-Finger bar' },
      { key: 'munch_max_38g', qty: 1, label: 'Munch bar' },
      { key: 'ferrero_4pc', qty: 1, label: 'Ferrero Rocher golden pair' },
    ],
    badge: 'Trending • INR 499',
    themeColor: {
      bg: '#FAF5FF',
      accent: '#7E22CE',
      border: '#E9D5FF',
      pillBg: '#F3E8FF',
      pillText: '#6B21A8',
    },
    graphicId: 'graphic-celebration-trio',
    brochureSource: 'Hamper Queen Starter Offerings',
  },
  // ==========================================
  // 1. BOUQUETS (From Image 1: Hamper Queen Bouquets)
  // ==========================================
  {
    id: 'bouquet-chocolate-kitkat',
    name: 'Chocolate Bouquet (KitKat Edition)',
    nameHinglish: 'KitKat Chocolate Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Classic KitKat Crisp Bars Wrapped in Royal Teal Paper with Satin Ribbon',
    subtitleHinglish: 'Crispy KitKat chocolates ka shahi bouquet pink satin ribbon ke sath',
    description:
      'A beloved sweet sensation crafted with premium crispy wafer chocolate bars arranged in cascading tiers, wrapped in dual-toned parchment and finished with a hot-pink satin rosette.',
    itemsIncluded: [
      'Assorted KitKat 4-Finger and 2-Finger Chocolate Bars',
      'Artisanal Dual-Tone Azure Paper Wrap',
      'Fuchsia Pink Satin Ribbon Bow',
      'Decorative Floral Sprigs & Heart Embellishments',
      'Customized Calligraphy Message Tag',
    ],
    approxPrice: `INR ${bouquetSellingPrice(KITKAT_BOUQUET_RATES)}`,
    pricingNote: bouquetPricingNote(KITKAT_BOUQUET_RATES),
    rateCard: KITKAT_BOUQUET_RATES,
    badge: 'Customer Favorite',
    themeColor: {
      bg: '#FFF8F8',
      accent: '#E63946',
      border: '#FFD6DC',
      pillBg: '#FFE5E8',
      pillText: '#B71C1C',
    },
    graphicId: 'graphic-kitkat-bouquet',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },
  {
    id: 'bouquet-dark-fantasy',
    name: 'Dark Fantasy Gourmet Bouquet',
    nameHinglish: 'Dark Fantasy Royal Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Molten Choco-Filled Dark Fantasy Cookies in Black & Gold Foil',
    subtitleHinglish: 'Lava choco filled Dark Fantasy cookies ka shahi black & gold bouquet',
    description:
      'An indulgent midnight arrangement featuring decadent chocolate-filled cookies, mounted on stems and styled in matte black paper with shimmering golden accents.',
    itemsIncluded: [
      'ITC Dark Fantasy Choco Fills Cookies Packs',
      'Gold Gilded Accent Paper & Charcoal Wrap',
      'Metallic Gold Ribbons & Tulle Layering',
      'Handcrafted Floral Fillers',
      'Personalized Royal Note Card',
    ],
    approxPrice: `INR ${bouquetSellingPrice(DARK_FANTASY_BOUQUET_RATES)}`,
    pricingNote: bouquetPricingNote(DARK_FANTASY_BOUQUET_RATES),
    rateCard: DARK_FANTASY_BOUQUET_RATES,
    badge: 'Indulgent Treat',
    themeColor: {
      bg: '#FAF8F5',
      accent: '#B8860B',
      border: '#E8DCB8',
      pillBg: '#F5ECCF',
      pillText: '#6D4C0E',
    },
    graphicId: 'graphic-dark-fantasy',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },
  {
    id: 'bouquet-women-accessory',
    name: 'Women Accessory Floral Bouquet',
    nameHinglish: 'Women Accessory & Earring Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Dangler Earrings, Hairpins, & Pastel Blossoms in Mint Wrap',
    subtitleHinglish: 'Sundar earrings, hair clips aur pastel phoolon ka customized bouquet',
    description:
      'A stunning keepsake bouquet combining fashionable jewelry pieces (earrings, studs, hair accessories) woven between delicate faux pastel florals and wrapped in mint-green parchment.',
    itemsIncluded: [
      'Curated Statement & Daily-wear Earrings Cards',
      'Pearl & Rhinestone Hairpins / Scrunchies',
      'Preserved Pastel Carnations and Gypsophila',
      'Soft Sage-Green & White Tissue Wrap',
      'Sky-Blue Organza Bow',
    ],
    approxPrice: 'INR 350 - INR 399',
    pricingNote:
      'Curated jewelry & floral stock at wholesale rates • Real retail chocolate/décor add-ons priced from Blinkit q-commerce rates (Sep 2026), not a flat per-item ladder',
    badge: 'Trending Gift',
    themeColor: {
      bg: '#F5FAF7',
      accent: '#2A9D8F',
      border: '#CFEBE5',
      pillBg: '#E0F2EE',
      pillText: '#18645C',
    },
    graphicId: 'graphic-women-accessory',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },
  {
    id: 'bouquet-men-accessory',
    name: 'Men Grooming & Accessory Bouquet',
    nameHinglish: 'Men Grooming & Chocolates Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Nivea Men Deodorant, Grooming Essentials, & Gourmet Chocolates',
    subtitleHinglish: 'Nivea grooming essentials, chocolates aur stylish men wrap',
    description:
      'A masculine, ultra-stylish bouquet designed with everyday grooming essentials, Nivea body spray, chocolates, and smart accessories in deep navy and charcoal wrapping.',
    itemsIncluded: [
      'Nivea Men Fresh Deodorant Spray',
      'Nivea Creme / Lip Balm or Pocket Cologne',
      'Ferrero Rocher & Milk Chocolates',
      'Matte Navy Blue & Black Structured Wrap',
      'Monochrome Ribbon Accent',
    ],
    approxPrice: `INR ${bouquetSellingPrice(MEN_BOUQUET_RATES)}`,
    pricingNote: bouquetPricingNote(MEN_BOUQUET_RATES),
    rateCard: MEN_BOUQUET_RATES,
    badge: 'For Him Special',
    themeColor: {
      bg: '#F5F7FA',
      accent: '#1D3557',
      border: '#D0D8E5',
      pillBg: '#E2E8F0',
      pillText: '#0F172A',
    },
    graphicId: 'graphic-men-grooming',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },
  {
    id: 'bouquet-custom-photo',
    name: 'Custom Polaroid Photo Bouquet',
    nameHinglish: 'Custom Polaroid Photo Memories Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Cherished Personal Memories Arranged on Stems in Black Wrap',
    subtitleHinglish: 'Aapki yaadon aur photos ka khubsurat arranged bouquet',
    description:
      'Transform precious memories into an emotional floral-style keepsake! We print your selected personal photos in Polaroid style, securely mount them with fairy lights, and wrap them in dramatic jet-black cones.',
    itemsIncluded: [
      '12 to 20 Custom High-Resolution Polaroid Prints',
      'Warm LED Fairy Light String Included',
      'Charcoal Black Sculpted Fan Wrap',
      'Golden Ribbon Tie & Custom Handwritten Note',
    ],
    approxPrice: 'INR 280 - INR 399',
    pricingNote:
      'Custom craft — priced by print count & fairy lights, applied to your photo selection (no flat retail ladder)',
    badge: 'Most Sentimental',
    themeColor: {
      bg: '#FDFCF9',
      accent: '#D4AF37',
      border: '#E8DCB8',
      pillBg: '#FAF5E8',
      pillText: '#5A4610',
    },
    graphicId: 'graphic-photo-bouquet',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },
  {
    id: 'bouquet-kinder-joy',
    name: 'Kinder Joy Delight Bouquet',
    nameHinglish: 'Kinder Joy Kids & Sweetheart Bouquet',
    category: 'bouquets',
    categoryLabel: 'Signature Bouquet',
    subtitle: 'Surprise Toy Eggs & Marshmallow Florals in Rose Pink Wrap',
    subtitleHinglish: 'Kinder Joy surprise eggs aur gulabi phoolon ka pyaara bouquet',
    description:
      'Bursting with childlike wonder and sweet nostalgia! Features genuine Kinder Joy surprise eggs nestled with soft botanical blossoms and layered blush pink wrapping.',
    itemsIncluded: [
      '5 to 8 Original Kinder Joy Surprise Eggs',
      'Artificial Pastel Rosebuds & Baby Breath',
      'Blush Pink & Pearlescent Organza Wrap',
      'Cream Satin Ribbon with Golden Border',
      'Celebration Topper Card',
    ],
    approxPrice: `INR ${bouquetSellingPrice(KINDER_BOUQUET_RATES)}`,
    pricingNote: bouquetPricingNote(KINDER_BOUQUET_RATES),
    rateCard: KINDER_BOUQUET_RATES,
    badge: 'Joyful & Cute',
    themeColor: {
      bg: '#FFF8FA',
      accent: '#F472B6',
      border: '#FBCFE8',
      pillBg: '#FCE7F3',
      pillText: '#9D174D',
    },
    graphicId: 'graphic-kinder-joy',
    brochureSource: 'WhatsApp Image - Hamper Queen Bouquets',
  },

  // =========================================================
  // 2. THE 12 BIRTHDAY & OCCASION HAMPERS (From Image 3)
  // ==========================================
  {
    id: 'hamper-1-elegant-pink',
    name: 'Elegant Pink Hamper',
    nameHinglish: 'Elegant Pink Luxury Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Handbag/Wallet, Mini Perfume, Earrings, Scrunchies & Chocolates',
    subtitleHinglish: 'Pyaara pink handbag, perfume, earrings aur chocolates ka box',
    description:
      'A graceful pastel-pink ensemble packed with chic fashion and lifestyle accessories. Perfect for birthdays, farewells, and sisterly milestones.',
    itemsIncluded: [
      'Fresh / Preserved Flowers',
      'Chic Handbag / Designer Wallet',
      'Luxury Travel Perfume (Mini)',
      'Satin Scrunchies Set',
      'Delicate Fashion Earrings',
      'Artisan Chocolates',
      'Custom Birthday Card',
      'Premium Rigid Gift Box with Satin Ribbon',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Top Birthday Pick',
    themeColor: {
      bg: '#FFF5F7',
      accent: '#EC4899',
      border: '#FBCFE8',
      pillBg: '#FCE7F3',
      pillText: '#9D174D',
    },
    graphicId: 'graphic-hamper-elegant-pink',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-2-self-care',
    name: 'Self-Care Hamper',
    nameHinglish: 'Pampering Self-Care Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Body Lotion, Face Mask, Scented Candle, Bath Salts & Satin Eye Mask',
    subtitleHinglish: 'Body lotion, sheet masks, khushboo wali candle aur cozy socks',
    description:
      'Designed to provide an at-home spa retreat. From deeply nourishing body butter to aromatic bath salts and a silk eye mask for peaceful rest.',
    itemsIncluded: [
      'Hydrating Body Lotion / Whipped Body Butter',
      'Soothing Face Sheet Mask Set',
      'Aromatherapy Soy Scented Candle',
      'Mineral Himalayan Bath Salts',
      'Soft Hand & Cuticle Cream',
      'Satin Blackout Eye Mask',
      'Ultra-Soft Cozy Socks',
      'Gourmet Chocolates',
      'Personalized Birthday Note Card',
    ],
    approxPrice: 'INR 599',
    pricingNote: 'Custom Hampers | 9 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Spa & Wellness',
    themeColor: {
      bg: '#FDF8F6',
      accent: '#EA580C',
      border: '#FED7AA',
      pillBg: '#FFEDD5',
      pillText: '#9A3412',
    },
    graphicId: 'graphic-hamper-self-care',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-3-coffee-lover',
    name: 'Coffee-Lover Hamper',
    nameHinglish: 'Coffee-Lover Artisan Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Premium Coffee, Ceramic Mug, Cookies, Scented Candle & Mini Plant',
    subtitleHinglish: 'Fresh roast coffee, designer mug, biscuits aur mini succulent plant',
    description:
      'An invigorating morning ritual packed in a decorative basket. Features rich roasted coffee blends, an inspiring designer ceramic mug, and crunchy bakery biscuits.',
    itemsIncluded: [
      'Artisan Blend Gourmet Coffee (Arabica/Dark Roast)',
      'Ceramic Designer Coffee Mug ("But First, Coffee")',
      'Fresh Baked Cookies & Butter Biscuits',
      'Rich Dark Chocolates',
      'Coffee & Vanilla Bean Scented Candle',
      'Mini Potted Green Plant / Faux Succulent',
      'Custom Personalized Keychain',
      'Birthday Card & Decorative Storage Basket',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Morning Brew',
    themeColor: {
      bg: '#FAF7F2',
      accent: '#78350F',
      border: '#E5D6C5',
      pillBg: '#EFE6DC',
      pillText: '#451A03',
    },
    graphicId: 'graphic-hamper-coffee',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-4-jewellery',
    name: 'Jewellery Hamper',
    nameHinglish: 'Shahi Jewellery & Sparkle Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Earrings, Charm Bracelet, Pendant Necklace, Mini Perfume & Flowers',
    subtitleHinglish: 'Earrings, bracelet, pendant necklace aur mini perfume box',
    description:
      'Celebrate her sparkle with this opulent jewelry suite. Includes matching accessories placed on velvet cushions alongside delicate dried flowers and sweet treats.',
    itemsIncluded: [
      'Gold/Silver Tone Dangler Earrings',
      'Delicate Adjustable Charm Bracelet',
      'Crystal Pendant Necklace',
      'Designer Perfume (Mini Spray)',
      'Artisan Cocoa Chocolates',
      'Preserved Floral Sprigs',
      'Velvet-Lined Premium Gift Box',
      'Calligraphy Birthday Card',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Glamour & Sparkle',
    themeColor: {
      bg: '#FFFDF9',
      accent: '#CA8A04',
      border: '#FEF08A',
      pillBg: '#FEF9C3',
      pillText: '#713F12',
    },
    graphicId: 'graphic-hamper-jewellery',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-5-fashion',
    name: 'Fashion Hamper',
    nameHinglish: 'Modern Fashion & Chic Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Sling Bag, Wallet, Sunglasses, Hair Accessories & Mini Perfume',
    subtitleHinglish: 'Trendy sling bag, wallet, sunglasses aur perfume ka combo',
    description:
      'Trendy, practical, and photogenic! Complete with a chic crossbody sling, UV-protected sunglasses, and styling essentials packed in a luxurious keepsake box.',
    itemsIncluded: [
      'Trendy Faux-Leather Sling Crossbody Bag',
      'Matching Compact Slim Wallet',
      'UV-Protected Fashion Sunglasses',
      'Pearl Hair Clips & Bow Accessories',
      'Mini Luxury Fragrance Spray',
      'Assorted Chocolates',
      'Custom Birthday Card',
      'Signature Rigid Gift Box with Ribbon',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Fashionista Special',
    themeColor: {
      bg: '#FFF8F8',
      accent: '#DB2777',
      border: '#FCE7F3',
      pillBg: '#FDF2F8',
      pillText: '#831843',
    },
    graphicId: 'graphic-hamper-fashion',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-6-skincare',
    name: 'Luxury Skincare Hamper',
    nameHinglish: 'Glow Skincare & Beauty Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Face Cream/Serum, Sheet Masks, Cleanser/Toner, Scented Candle & Lip Balm',
    subtitleHinglish: 'Face serum, sheet masks, lip balm aur bath bombs ka beauty kit',
    description:
      'An all-in-one beauty booster featuring Korean/Ayurvedic skincare staples for glass-like radiance and deep skin nourishment.',
    itemsIncluded: [
      'Hydrating Face Cream / Glow Serum',
      'Korean Glow Sheet Mask Duo',
      'Rosewater Toner / Gentle Cleanser',
      'Soothing Scented Pillar Candle',
      'Tinted Moisture Lip Balm',
      'Effervescent Bath Bombs',
      'Artisan Milk Chocolates',
      'Birthday Wishes Card',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Radiant Glow',
    themeColor: {
      bg: '#FBFDF9',
      accent: '#16A34A',
      border: '#DCFCE7',
      pillBg: '#F0FDF4',
      pillText: '#14532D',
    },
    graphicId: 'graphic-hamper-skincare',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-7-chocolate-indulgence',
    name: 'Chocolate Indulgence Hamper',
    nameHinglish: 'Ferrero & Truffles Chocolate Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Ferrero Rocher, Chocolate Bars, Truffles, Nut Mix & Scented Candle',
    subtitleHinglish: 'Ferrero Rocher, rich chocolate bars, truffles aur roasted dry fruits',
    description:
      'Pure cocoa ecstasy for true chocoholics! Packed with golden Ferrero spheres, rich imported dark chocolate bars, and honey-roasted nut trail mixes.',
    itemsIncluded: [
      'Original Ferrero Rocher Golden Collection',
      'Assorted Dark & Milk Chocolate Gourmet Bars',
      'Handcrafted Cocoa Butter Truffles',
      'Crunchy Almond & Cashew Nut Mix',
      'Chocolate Vanilla Aromatherapy Candle',
      'Artisan Birthday Card with Wax Seal',
      'Signature Black & Gold Gift Box',
    ],
    approxPrice: 'INR 499',
    pricingNote: 'Custom Hampers | 7 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Pure Indulgence',
    themeColor: {
      bg: '#FDF9F5',
      accent: '#92400E',
      border: '#FDE68A',
      pillBg: '#FEF3C7',
      pillText: '#78350F',
    },
    graphicId: 'graphic-hamper-chocolate-indulgence',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-8-wellness',
    name: 'Wellness & Relaxation Hamper',
    nameHinglish: 'Calm Wellness & Relaxation Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Eye Mask, Herbal Chamomile Tea, Body Lotion, Bath Bombs & Cozy Socks',
    subtitleHinglish: 'Herbal tea, bath bombs, eye mask aur cozy socks for peaceful sleep',
    description:
      'Curated to slow down fast-paced days. Packed with caffeine-free herbal teas, soothing essential oil bath bombs, and warm socks for ultimate relaxation.',
    itemsIncluded: [
      'Silky Padded Eye Mask for Sleep',
      'Organic Chamomile / Lavender Herbal Tea Tin',
      'Calming Lavender Body Lotion',
      'Fizzy Essential Oil Bath Bombs',
      'Relaxation Scented Candle',
      'Super-Soft Woolen Cozy Socks',
      'Gourmet Chocolates',
      'Heartfelt Birthday Note',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Pure Serenity',
    themeColor: {
      bg: '#F5F9FA',
      accent: '#0891B2',
      border: '#CFFAFE',
      pillBg: '#E0F2FE',
      pillText: '#0E7490',
    },
    graphicId: 'graphic-hamper-wellness',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-9-tea-time',
    name: 'Tea Time Hamper',
    nameHinglish: 'Darjeeling & Herbal Tea Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Premium Herbal/Earl Grey Tea, Ceramic Mug, Cookies, Candle & Plant',
    subtitleHinglish: 'Premium tea tin, beautiful mug, cookies aur miniature plant',
    description:
      'A sophisticated gift for refined tea enthusiasts. Features delicate Darjeeling and green tea blends alongside butter cookies and a cozy keepsake mug.',
    itemsIncluded: [
      'Twinings / Artisanal Herbal & Green Tea Selection',
      'Earthy Ceramic Pastel Tea Mug',
      'Gourmet Almond Biscotti & Butter Cookies',
      'Dark Truffle Chocolates',
      'Bergamot & Green Tea Scented Candle',
      'Mini Preserved Green Flora / Plant',
      'Classic Decorative Tray Box',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Cozy Moments',
    themeColor: {
      bg: '#F6FBF6',
      accent: '#15803D',
      border: '#DCFCE7',
      pillBg: '#E7F9EE',
      pillText: '#166534',
    },
    graphicId: 'graphic-hamper-tea-time',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-10-personalised',
    name: 'Personalised Hamper',
    nameHinglish: 'Name-Engraved Personalised Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Name-Engraved Wallet/Pouch, Mini Perfume, Earrings & Flowers',
    subtitleHinglish: 'Customized naam likha hua wallet, perfume, earrings aur phool',
    description:
      'The pinnacle of thoughtful gifting! We foil-stamp or engrave her custom name or initials onto a luxury leatherette wallet or cosmetic pouch.',
    itemsIncluded: [
      'Name-Engraved Custom Leather Wallet / Vanity Pouch',
      'Mini Eau De Parfum Vaporisateur',
      'Fashion Drop Earrings',
      'Silky Scrunchies & Hair Clips Set',
      'Artisan Chocolates',
      'Preserved Pink Florals',
      'Birthday Wishes Card with Wax Seal',
      'Premium Gift Box',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Custom Name Stamped',
    themeColor: {
      bg: '#FAF5FF',
      accent: '#9333EA',
      border: '#F3E8FF',
      pillBg: '#F3E8FF',
      pillText: '#6B21A8',
    },
    graphicId: 'graphic-hamper-personalised',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-11-minimal-chic',
    name: 'Minimal & Chic Hamper',
    nameHinglish: 'Minimalist & Clean Aesthetic Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Slim Pouch, Mini Perfume, Earrings, Scented Candle & Mini Flora',
    subtitleHinglish: 'Clean sleek pouch, mini perfume, candle aur chocolates',
    description:
      'Less is more. A modern Scandinavian-inspired clean aesthetic box with muted neutral tones, subtle gold accents, and everyday practical essentials.',
    itemsIncluded: [
      'Minimalist Leatherette Coin/Card Pouch',
      'Travel Mini Fragrance Spray',
      'Geometric Minimal Studs / Earrings',
      'Soy Wax Scented Tin Candle',
      'Mini Preserved Green Flora / Plant',
      'Gourmet Dark Chocolates',
      'Birthday Card in Simple Elegant Box',
    ],
    approxPrice: 'INR 499',
    pricingNote: 'Custom Hampers | 7 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Clean Aesthetic',
    themeColor: {
      bg: '#F9FAFB',
      accent: '#475569',
      border: '#E2E8F0',
      pillBg: '#F1F5F9',
      pillText: '#334155',
    },
    graphicId: 'graphic-hamper-minimal-chic',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },
  {
    id: 'hamper-12-floral-lifestyle',
    name: 'Floral & Lifestyle Hamper',
    nameHinglish: 'Floral Blooms & Lifestyle Journal Hamper',
    category: 'birthday_hampers',
    categoryLabel: 'Customizable Hamper',
    subtitle: 'Fresh/Preserved Flowers, Mug, Scented Candle, Journal & Chocolates',
    subtitleHinglish: 'Khubsurat phool, coffee mug, journal notebook aur candle',
    description:
      'The ultimate lifestyle keepsake! Includes an inspirational notebook for daily reflections, fresh florals, a designer ceramic mug, and soothing candle aromas.',
    itemsIncluded: [
      'Fresh / Preserved Floral Bouquet Arrangement',
      'Ceramic Designer Coffee / Tea Mug',
      'Aromatherapy Soy Scented Candle',
      'Embossed Hardcover Notebook / Journal',
      'Artisan Chocolates',
      'Hydrating Self-Care Item',
      'Birthday Wishes Card',
      'Signature Luxury Gift Box',
    ],
    approxPrice: 'INR 549',
    pricingNote: 'Custom Hampers | 8 curated items · priced by composition (real retail rates on branded items)',
    badge: 'Complete Delight',
    themeColor: {
      bg: '#FFF7ED',
      accent: '#EA580C',
      border: '#FFEDD5',
      pillBg: '#FFF7ED',
      pillText: '#9A3412',
    },
    graphicId: 'graphic-hamper-floral-lifestyle',
    brochureSource: 'WhatsApp Image - 12 Birthday Gift Hampers',
  },

  // ==============================================================
  // 3. SPECIALTY BOXES & OCCASIONS (From Image 2 & 4)
  // ==============================================================
  {
    id: 'specialty-dress-hamper',
    name: 'Royal Dress & Trousseau Hamper',
    nameHinglish: 'Royal Dress & Shahi Trousseau Hamper',
    category: 'specialty_boxes',
    categoryLabel: 'Specialty Gift Box',
    subtitle: 'Tailored Velvet Lined Box for Sarees, Lehengas & Designer Outfits',
    subtitleHinglish: 'Shahi shaadi aur occasions ke kapdon ke liye customized box',
    description:
      'An oversized, museum-grade gift box designed to present designer dresses, sarees, and wedding lehengas with royal foldings and gold tassels.',
    itemsIncluded: [
      'Extra-Large Velvet or Silk Padded Trunk Box',
      'Scented Tissue Liners with Jasmine Sachets',
      'Golden Zari Embroidered Ribbon & Tassels',
      'Personalized Family Crest & Royal Calligraphy Card',
    ],
    approxPrice: 'INR 499 - INR 899',
    pricingNote: 'Custom large hampers (Approx.)',
    badge: 'Bridal & Trousseau',
    themeColor: {
      bg: '#FFF5F5',
      accent: '#991B1B',
      border: '#FECACA',
      pillBg: '#FEE2E2',
      pillText: '#7F1D1D',
    },
    graphicId: 'graphic-box-dress',
    brochureSource: 'WhatsApp Image - Hamper Queen Services',
  },
  {
    id: 'specialty-shirt-box',
    name: 'Executive Shirt & Cufflinks Gift Box',
    nameHinglish: 'Men Formal Shirt & Watch Gift Box',
    category: 'specialty_boxes',
    categoryLabel: 'Specialty Gift Box',
    subtitle: 'Sturdy Rigid Box with Collar Supports, Silk Tie & Grooming Treats',
    subtitleHinglish: 'Men ke shirts, ties aur accessories ke liye premium box',
    description:
      'Crisp, clean, and commanding! Perfectly sized for executive shirts, ties, cufflinks, and luxury colognes with magnetic front closure.',
    itemsIncluded: [
      'Rigid Structured Shirt Box with Magnetic Flap',
      'Silk Necktie / Bowtie Compartment',
      'Golden Cufflinks Cushion',
      'Pocket Perfume & Chocolate Bar Pairing',
      'Embossed Hamper Queen Wax Seal',
    ],
    approxPrice: 'INR 399 - INR 649',
    pricingNote: 'Customizable with client-supplied clothing items',
    badge: 'For Gentlemen',
    themeColor: {
      bg: '#F8FAFC',
      accent: '#0F172A',
      border: '#E2E8F0',
      pillBg: '#F1F5F9',
      pillText: '#0F172A',
    },
    graphicId: 'graphic-box-shirt',
    brochureSource: 'WhatsApp Image - Hamper Queen Services',
  },
  {
    id: 'specialty-heart-box',
    name: 'Romantic Heart Box with Candle Florals',
    nameHinglish: 'Romantic Heart Gift Box',
    category: 'specialty_boxes',
    categoryLabel: 'Specialty Gift Box',
    subtitle: 'Heart-Shaped Trunk with Scented Candles, Roses & Ferrero',
    subtitleHinglish: 'Dil ke aakaar ka gift box candles, gulaab aur chocolates ke sath',
    description:
      'The quintessential expression of love! A heart-shaped rigid keepsake box layered with fragrant red roses, heart-shaped floating candles, and decadent confections.',
    itemsIncluded: [
      'Velvet Finish Heart-Shaped Rigid Trunk',
      'Dual Heart-Shaped Scented Floating Candles',
      'Fresh/Preserved Red Velvet Rose Buds',
      'Ferrero Rocher & Cocoa Truffles Cascade',
      'Custom Love Letter Scribe Card with Wax Seal',
    ],
    approxPrice: 'INR 399 - INR 649',
    pricingNote: 'Rate as per customization & flower type',
    badge: 'Anniversary & Love',
    themeColor: {
      bg: '#FFF1F2',
      accent: '#BE123C',
      border: '#FECDD3',
      pillBg: '#FFE4E6',
      pillText: '#881337',
    },
    graphicId: 'graphic-box-heart',
    brochureSource: 'WhatsApp Image - Hamper Queen Services',
  },
  {
    id: 'specialty-watch-box',
    name: 'Watch & Jewellery Display Gift Box',
    nameHinglish: 'Watch & Premium Accessories Box',
    category: 'specialty_boxes',
    categoryLabel: 'Specialty Gift Box',
    subtitle: 'Plush Leather Watch Pillow with Metallic Trims & Gourmet Pairings',
    subtitleHinglish: 'Watch cushion, accessories aur chocolates ka luxury box',
    description:
      'Specially designed to present luxury wristwatches or bracelets on a cushioned velvet bolster, accented with truffles and royal satin ribbon.',
    itemsIncluded: [
      'Lacquered or Leatherette Watch Presentation Box',
      'Removable Plush Watch/Bracelet Cushion',
      'Assorted Golden Ferrero Rocher Truffles',
      'Gold Embossed Certificate of Best Wishes',
    ],
    approxPrice: 'INR 349 - INR 549',
    pricingNote: 'Rate as per customization',
    badge: 'Timepiece Special',
    themeColor: {
      bg: '#FAF9F6',
      accent: '#B45309',
      border: '#FDE68A',
      pillBg: '#FEF3C7',
      pillText: '#78350F',
    },
    graphicId: 'graphic-box-watch',
    brochureSource: 'WhatsApp Image - Hamper Queen Services',
  },
  {
    id: 'specialty-snack-tray',
    name: 'Celebration Munchies & Drink Gift Tray',
    nameHinglish: 'Desi Celebration Snack & Goodies Thaal',
    category: 'gourmet_trays',
    categoryLabel: 'Festive Tray',
    subtitle: 'Ethnic Pattern Tray with Cellophane Wrap, Giant Rosette, Drinks & Snacks',
    subtitleHinglish: 'Cellophane packing, bada ribbon bow, cold drinks aur tasty snacks thaali',
    description:
      'As featured on our signature Hamper Queen lookbook! A celebratory open-weave ethnic print tray packed with refreshing beverages (Sprite/Juices), crunchy snacks (Puffcorn/chips), chocolates, and wrapped in crystal cellophane with a massive sunburst yellow rosette.',
    itemsIncluded: [
      'Ethnic Traditional Geometric Patterned Tray Box',
      'Chilled Refreshing Beverages (Sprite / Sparkling Juice)',
      'Crunchy Gourmet Snacks & Puffcorn Treats',
      'Cadbury & Nestlé Chocolate Selection',
      'Crystal Cellophane Wrap with Giant Yellow Rosette Puff',
      'Personalized Family Greeting Tag',
    ],
    approxPrice: 'INR 399 - INR 599',
    pricingNote: 'Rate as per customization & item selections',
    badge: 'Real Client Favorite',
    themeColor: {
      bg: '#FEFCE8',
      accent: '#CA8A04',
      border: '#FEF08A',
      pillBg: '#FEF9C3',
      pillText: '#854D0E',
    },
    graphicId: 'graphic-snack-tray',
    brochureSource: 'WhatsApp Image - Hamper Queen Real Client Packaging',
  },
  {
    id: 'hamper-midnight-romance',
    name: 'Midnight Romance & Velvet Keepsake Hamper',
    nameHinglish: 'Midnight Romance & Velvet Surprise Hamper',
    category: 'customised_hampers',
    categoryLabel: 'Romantic Luxury',
    subtitle: 'Crimson Velvet Rigid Trunk, Warm LED Fairy Lights, Belgian Truffles & Custom Polaroid Frame',
    subtitleHinglish: 'Red velvet rigid box, fairy lights, Belgian chocolates aur personalised photos',
    description:
      'The ultimate anniversary and birthday heart-stopper! Crafted inside an artisanal deep burgundy rigid trunk with hidden micro-fairy lights that illuminate upon unboxing. Packed with handcrafted Belgian chocolate truffles, a perfumed rose mist, scented pillar candle, and 4 custom polaroid prints clipped to fairy lights.',
    itemsIncluded: [
      'Artisanal Burgundy Velvet-Lined Rigid Trunk',
      'Warm Golden LED Micro-Fairy Lights with Concealed Switch',
      'Handcrafted Belgian Cocoa Truffles & Ferrero Rocher',
      'French Vanilla & Rose Scented Pillar Candle',
      '4 Custom Polaroid Memory Prints with Miniature Wooden Clips',
      'Hand-Stamped Wax Sealed Calligraphy Love Scroll',
    ],
    approxPrice: 'INR 499 - INR 899',
    pricingNote: 'Custom polaroid printing & wax seal stamp included',
    badge: 'Midnight Bestseller',
    themeColor: {
      bg: '#FFF1F2',
      accent: '#9F1239',
      border: '#FECDD3',
      pillBg: '#FFE4E6',
      pillText: '#881337',
    },
    graphicId: 'graphic-midnight-romance',
    brochureSource: 'WhatsApp Image - Hamper Queen Custom Creations',
  },
  {
    id: 'hamper-royal-saffron-dryfruit',
    name: 'Imperial Saffron & Royal Dry Fruit Jar Trunk',
    nameHinglish: 'Shahi Kesar & Premium Dry Fruit Trunk',
    category: 'customised_hampers',
    categoryLabel: 'Royal Gourmet',
    subtitle: 'Hexagonal Gold-Rimmed Glass Jars of California Almonds, Kashmiri Walnuts & Saffron-Infused Honey',
    subtitleHinglish: 'Gold glass jars me premium dry fruits, kaju, badam, akhrot aur shahi kesar',
    description:
      'Pure royal heritage crafted for discerning families and prestigious festivals. Features 4 hexagonal gold-trimmed airtight glass jars filled with Jumbo California Almonds, Kashmiri Mamra Walnuts, Roasted Salted Pistachios, and Goan Cashews, paired with organic Saffron-infused honey in an antique brass-accented presentation chest.',
    itemsIncluded: [
      'Antique Brass-Clasped Gold Foil Presentation Chest',
      '4 Airtight Hexagonal Gold-Rimmed Glass Keepsake Jars',
      'Jumbo California Roasted Almonds (200g)',
      'Kashmiri Snow Walnuts & Jumbo Goan Cashews (200g each)',
      'Roasted & Salted Iranian Pistachios (150g)',
      'Pure Kashmiri Saffron Infused Forest Honey Jar with Wooden Dipper',
      'Royal Gold Brocade Ribbon & Traditional Shahi Seal',
    ],
    approxPrice: 'INR 599 - INR 949',
    pricingNote: 'Air-tight sealed fresh batch; zero preservatives',
    badge: 'Festive Grandeur',
    themeColor: {
      bg: '#FEFCE8',
      accent: '#B45309',
      border: '#FDE68A',
      pillBg: '#FEF3C7',
      pillText: '#78350F',
    },
    graphicId: 'graphic-saffron-dryfruit',
    brochureSource: 'WhatsApp Image - Hamper Queen Festive Showcase',
  },
  {
    id: 'hamper-baby-shower-welcome',
    name: 'Little Miracle Baby Shower Keepsake Basket',
    nameHinglish: 'New Born Baby Welcome & Keepsake Hamper',
    category: 'customised_hampers',
    categoryLabel: 'Baby & Mom Keepsake',
    subtitle: 'Hand-Woven Pastel Wicker Basket, Milestone Wooden Discs, Organic Muslin Wrap & Plush Rattle',
    subtitleHinglish: 'Cute baby basket with organic muslin, soft plush toy aur milestone cards',
    description:
      'Warmly welcome the newest family blessing with an ethereal pastel nursery basket. Filled with 100% organic breathable cotton muslin swaddle, hand-crocheted plush animal rattle, wooden "Hello World" milestone disc, gentle soothing baby bath bar, and celebratory chocolate rosettes for the new parents.',
    itemsIncluded: [
      'Hand-Woven Whitewashed Pastel Wicker Keepsake Basket',
      '100% Organic Bamboo-Muslin Breathable Baby Swaddle Wrap',
      'Hand-Crocheted Plush Bear Teething Rattle (BPA-Free)',
      'Laser-Engraved Wooden Baby Milestone Keepsake Disc',
      'Mild Shea & Calendula Natural Baby Bath Bar',
      'Gourmet Congratulations Truffles for the Proud Parents',
      'Chiffon Pastel Ribbon & Baby Feet Wax Stamp Seal',
    ],
    approxPrice: 'INR 499 - INR 799',
    pricingNote: 'Available in Pastel Blue, Blush Pink, or Gender-Neutral Mint/Cream',
    badge: 'New Born Miracle',
    themeColor: {
      bg: '#F0FDF4',
      accent: '#15803D',
      border: '#BBF7D0',
      pillBg: '#DCFCE7',
      pillText: '#14532D',
    },
    graphicId: 'graphic-baby-shower',
    brochureSource: 'WhatsApp Image - Hamper Queen Baby Collection',
  },
  {
    id: 'hamper-executive-prestige',
    name: 'Executive Elite Corporate & Appreciation Hamper',
    nameHinglish: 'Corporate Executive Luxury Appreciation Gift',
    category: 'customised_hampers',
    categoryLabel: 'Corporate Prestige',
    subtitle: 'Matte Obsidian Trunk, Double-Wall Thermal Flask, Single-Origin Pour-Over Coffee & Metal Pen',
    subtitleHinglish: 'Matte black box with steel thermal flask, gourmet coffee aur gold pen',
    description:
      'Designed for high-impact professional gifting, VIP client appreciation, and executive onboarding. Set in a sleek matte obsidian rigid trunk with custom magnetic closure, featuring a stainless-steel thermal matte bottle, single-origin Chikmagalur pour-over artisanal coffee drip bags, dark chocolate almonds, and a brass ballpoint executive pen.',
    itemsIncluded: [
      'Matte Obsidian Black Rigid Trunk with Magnetic Closure',
      'Vacuum-Insulated 500ml Matte Black Thermal Bottle',
      'Chikmagalur Single-Origin Artisanal Coffee Drip Bags (Pack of 5)',
      'Roasted Dark Chocolate Sea Salt Almonds Jar',
      'Brushed Brass Heavyweight Executive Rollerball Pen',
      'Sleek Hardbound Pocket Journal with Ribbon Bookmark',
      'Custom Corporate Logo Metallic Tag & Elegant Black Satin Ribbon',
    ],
    approxPrice: 'INR 599 - INR 949',
    pricingNote: 'Bulk discounts available for corporate orders 10+ units',
    badge: 'Corporate High Impact',
    themeColor: {
      bg: '#FAF8F5',
      accent: '#1F2937',
      border: '#E5E7EB',
      pillBg: '#F3F4F6',
      pillText: '#111827',
    },
    graphicId: 'graphic-executive-prestige',
    brochureSource: 'WhatsApp Image - Hamper Queen Corporate Lookbook',
  },

  // ==============================================================
  // 4. SNACK & CHOCO ADD-ONS (real retail rates)
  // ==============================================================
  {
    id: 'addon-snack-attack',
    name: 'Snack Attack Goodie Hamper',
    nameHinglish: 'Snack Attack Munching Ka Maza',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: "Lay's, Kurkure, Bingo & Puffcorn — Classic Desi Indulgence",
    subtitleHinglish: 'Lay\'s, Kurkure, Bingo aur Puffcorn ka desi snack box',
    description:
      'Fix-your-cravings basket straight from the party shelf! Lay’s Classic, Kurkure Masala Munch, Bingo Mad Angles and Puffcorn — stacked in a rigid kraft box with satin ribbon and real retail rates.',
    itemsIncluded: [
      "Lay's Classic Salted Potato Chips",
      'Kurkure Masala Munch Crisps',
      'Bingo Mad Angles Achaari Masti',
      'Kurkure Puffcorn Cheese Puffs',
      'Rigid Kraft Gift Box with Satin Ribbon',
      'Handwritten Celebratory Tag',
    ],
    approxPrice: `INR ${bouquetSellingPrice(SNACK_ATTACK_RATES)}`,
    pricingNote: bouquetPricingNote(SNACK_ATTACK_RATES),
    rateCard: SNACK_ATTACK_RATES,
    badge: 'Party Classic',
    themeColor: {
      bg: '#FFFBF1',
      accent: '#D97706',
      border: '#FDE68A',
      pillBg: '#FEF3C7',
      pillText: '#92400E',
    },
    graphicId: 'graphic-addon-snack-attack',
    brochureSource: 'Hamper Queen Add-on Menu',
  },
  {
    id: 'addon-movie-night-chips',
    name: 'Movie Night Chip Basket',
    nameHinglish: 'Movie Night Chips & Snacks Basket',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: 'Triple Pringles, Lay\'s & Doritos — the Ultimate Screen Time Tub',
    subtitleHinglish: 'Triple Pringles, Lay\'s aur Doritos — bingeing ke liye perfect',
    description:
      'Binge-ready trio tub of Pringles Original, Sour Cream & Peri Peri, topped with Lay’s and Doritos Sweet Chilli — packed for cosy movie nights, sports screening, or house parties.',
    itemsIncluded: [
      'Pringles Original Potato Chips',
      'Pringles Sour Cream & Onion',
      'Pringles Peri Peri Chips',
      "Lay's Classic Salted Chips",
      'Doritos Sweet Chilli Nachos',
      'Serving Cone with Confetti Topper',
    ],
    approxPrice: `INR ${bouquetSellingPrice(MOVIE_NIGHT_RATES)}`,
    pricingNote: bouquetPricingNote(MOVIE_NIGHT_RATES),
    rateCard: MOVIE_NIGHT_RATES,
    badge: 'Binge Ready',
    themeColor: {
      bg: '#F0F7FF',
      accent: '#2563EB',
      border: '#BFDBFE',
      pillBg: '#DBEAFE',
      pillText: '#1E40AF',
    },
    graphicId: 'graphic-addon-movie-night',
    brochureSource: 'Hamper Queen Add-on Menu',
  },
  {
    id: 'addon-mini-candy-box',
    name: 'Mini Candy Surprise Box',
    nameHinglish: 'Mini Candy & Choco Surprise Box',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: 'Chupa Chups Sour Mix, Gems Duo & Milkybar Butterscotch',
    subtitleHinglish: 'Chupa Chups, Gems aur Milkybar ka chhota khushnuma box',
    description:
      'A pocket-sized candy treasure for little ones and sweet tooth supporters! Sour belts & bites, Gems Duo and Milkybar Butterscotch — in a mini gift box ready for return gifts and party favours.',
    itemsIncluded: [
      'Chupa Chups Sour Bites (2 pc)',
      'Chupa Chups Sour Belt Mixed Fruit',
      'Cadbury Gems Duo Chocolates',
      'Milkybar Butterscotch Bite',
      'Mini Kraft Gift Box with Bow',
      'Colourful Celebration Tag',
    ],
    approxPrice: `INR ${bouquetSellingPrice(MINI_CANDY_RATES)}`,
    pricingNote: bouquetPricingNote(MINI_CANDY_RATES),
    rateCard: MINI_CANDY_RATES,
    badge: 'Party Favourite',
    themeColor: {
      bg: '#FDF2F8',
      accent: '#DB2777',
      border: '#FBCFE8',
      pillBg: '#FCE7F3',
      pillText: '#9D174D',
    },
    graphicId: 'graphic-addon-mini-candy',
    brochureSource: 'Hamper Queen Add-on Menu',
  },
  {
    id: 'addon-oreo-midnight',
    name: 'Oreo & Cookie Midnight Box',
    nameHinglish: 'Oreo Aur Cookie Midnight Box',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: 'Oreos, Hide & Seek & Bourbon — Late Night Cravings Solved',
    subtitleHinglish: 'Oreo, Hide & Seek aur Bourbon — midnight cravings ka jawab',
    description:
      'For the OG midnight-craving crew: classic Oreo vanilla & chocolate, Hide & Seek Choco Chip and Sunfeast Bourbon stacked in a midnight-blue rigid box with a warm fairy-light accent.',
    itemsIncluded: [
      'Oreo Vanilla Sandwich Biscuits',
      'Oreo Chocolate Sandwich Biscuits',
      'Hide & Seek Choco Chip Cookies',
      'Sunfeast Bourbon Dark Fantasy',
      'Midnight-Blue Rigid Gift Box',
      'Warm Fairy Light String',
    ],
    approxPrice: `INR ${bouquetSellingPrice(OREO_MIDNIGHT_RATES)}`,
    pricingNote: bouquetPricingNote(OREO_MIDNIGHT_RATES),
    rateCard: OREO_MIDNIGHT_RATES,
    badge: 'Midnight Treat',
    themeColor: {
      bg: '#F5F3FF',
      accent: '#4C1D95',
      border: '#C4B5FD',
      pillBg: '#EDE9FE',
      pillText: '#5B21B6',
    },
    graphicId: 'graphic-addon-oreo-midnight',
    brochureSource: 'Hamper Queen Add-on Menu',
  },
  {
    id: 'addon-choco-trio',
    name: 'Triple Choco Indulgence Box',
    nameHinglish: 'Triple Choco Indulgence Treat Box',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: 'Silk, Dairy Milk, Milkybar & Galaxy — A Chocoholic\'s Trio',
    subtitleHinglish: 'Silk, Dairy Milk, Milkybar aur Galaxy — choco lover ka trio box',
    description:
      'The perfect chocolate surprise for a pure chocoholic: Cadbury Silk, Dairy Milk, Milkybar Butterscotch and Galaxy Smooth aligned neatly in a gold-ribboned luxury box. Add to any hamper or gift solo!',
    itemsIncluded: [
      'Cadbury Silk Milk Chocolate Bar',
      'Cadbury Dairy Milk Chocolate Bar',
      'Milkybar Butterscotch Bite',
      'Galaxy Smooth Chocolate Bar',
      'Luxury Gold-Ribboned Gift Box',
      'Personalized Wish Note Card',
    ],
    approxPrice: `INR ${bouquetSellingPrice(CHOCO_TRIO_RATES)}`,
    pricingNote: bouquetPricingNote(CHOCO_TRIO_RATES),
    rateCard: CHOCO_TRIO_RATES,
    badge: 'Chocoholic Pick',
    themeColor: {
      bg: '#FFF8F5',
      accent: '#A16207',
      border: '#FDE68A',
      pillBg: '#FFFBEB',
      pillText: '#854D0E',
    },
    graphicId: 'graphic-addon-choco-trio',
    brochureSource: 'Hamper Queen Add-on Menu',
  },
  {
    id: 'addon-binge-basket',
    name: 'Family Binge Bundle Basket',
    nameHinglish: 'Family Binge Snacks Basket',
    category: 'addons_retail',
    categoryLabel: 'Snack & Choco Add-on',
    subtitle: 'Pringles, Lay\'s, Doritos, Kurkure & Bingo — the Whole Family Tub',
    subtitleHinglish: 'Pringles, Lay\'s, Doritos, Kurkure aur Bingo — family size party tub',
    description:
      'The grand family-size snack lineup! Two Pringles classics, Lay’s, Doritos Sweet Chilli, Kurkure and Bingo Mad Angles — arranged festival-style in a jumbo cellophane-wrapped basket with a golden rosette.',
    itemsIncluded: [
      'Pringles Original Potato Chips',
      'Pringles Sour Cream & Onion',
      "Lay's Classic Salted Chips",
      'Doritos Sweet Chilli Nachos',
      'Kurkure Masala Munch Crisps',
      'Bingo Mad Angles Achaari Masti',
      'Jumbo Cellophane Basket with Rosette',
    ],
    approxPrice: `INR ${bouquetSellingPrice(BINGE_BUNDLE_RATES)}`,
    pricingNote: bouquetPricingNote(BINGE_BUNDLE_RATES),
    rateCard: BINGE_BUNDLE_RATES,
    badge: 'Family Size',
    themeColor: {
      bg: '#FEFCE8',
      accent: '#CA8A04',
      border: '#FEF08A',
      pillBg: '#FEF9C3',
      pillText: '#854D0E',
    },
    graphicId: 'graphic-addon-binge-basket',
    brochureSource: 'Hamper Queen Add-on Menu',
  },

  // ==============================================================
  // 5. MUGS, CUPS & KEEPSAKES (wholesale-estimate pricing)
  // ==============================================================
  {
    id: 'mug-photo-keepsake',
    name: 'Personalised Photo Mug Box',
    nameHinglish: 'Custom Photo Mug Gift Box',
    category: 'mugs_cups',
    categoryLabel: 'Mugs & Cups',
    subtitle: 'Ceramic Mug with Your Photo Print + Hot Cocoa Sachets',
    subtitleHinglish: 'Aapki photo wala ceramic mug aur hot cocoa sachets',
    description:
      'A keepsake they will use every morning! A premium 12oz ceramic mug printed with your favourite photo, quote or inside joke — paired with hot cocoa sachets and boxed with a handwritten note. Mug retail & print handled at wholesale-estimate rates.',
    itemsIncluded: [
      'Premium 12oz Ceramic Photo Mug',
      'High-Resolution Photo / Quote Print',
      'Hot Cocoa Sachets (2 pc)',
      'Crush-Proof Gift Box with Satin Bow',
      'Handwritten Calligraphy Note',
    ],
    approxPrice: 'INR 349 - INR 449',
    pricingNote: 'Wholesale-estimate pricing (mug ₹260-₹320 + print ₹40) — confirmed on WhatsApp • Admin-editable',
    badge: 'Personalised Keepsake',
    themeColor: {
      bg: '#FFF9F5',
      accent: '#C2410C',
      border: '#FED7AA',
      pillBg: '#FFEDD5',
      pillText: '#9A3412',
    },
    graphicId: 'graphic-mug-photo-keepsake',
    brochureSource: 'Hamper Queen Mugs & Keepsakes',
  },
  {
    id: 'mug-ceramic-cocoa',
    name: 'Ceramic Cup & Hot Cocoa Combo',
    nameHinglish: 'Ceramic Cup Aur Hot Cocoa Box',
    category: 'mugs_cups',
    categoryLabel: 'Mugs & Cups',
    subtitle: 'Designer Ceramic Mug with Artisan Cocoa Mix & Biscotti',
    subtitleHinglish: 'Designer mug, artisan cocoa mix aur biscotti ka combo',
    description:
      'Warm up winter evenings with a designer glazed ceramic cup, artisan drinking-chocolate mix and almond biscotti — stacked in a rustic brown box with a wooden stirrer. Retail of mug & mix at wholesale-estimate rates.',
    itemsIncluded: [
      'Designer Glazed Ceramic Mug',
      'Artisan Drinking Chocolate Mix',
      'Almond Biscotti Cookies',
      'Wooden Coffee Stirrer',
      'Rustic Kraft Box with Twine',
    ],
    approxPrice: 'INR 299 - INR 399',
    pricingNote: 'Wholesale-estimate pricing (mug ₹220-₹280 + cocoa mix) — confirmed on WhatsApp • Admin-editable',
    badge: 'Cozy Combo',
    themeColor: {
      bg: '#FBF7F0',
      accent: '#78350F',
      border: '#E7D5C0',
      pillBg: '#F0E7DB',
      pillText: '#4A2608',
    },
    graphicId: 'graphic-mug-ceramic-cocoa',
    brochureSource: 'Hamper Queen Mugs & Keepsakes',
  },

  // ==============================================================
  // 6. ACCESSORIES (wholesale-estimate pricing)
  // ==============================================================
  {
    id: 'accessory-jewellery-keepbox',
    name: 'Everyday Jewellery Keepsake Box',
    nameHinglish: 'Daily Jewellery Keepsake Box',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subtitle: 'Curated Earrings, Studs, Hairpins & a Velvet Keepsake Box',
    subtitleHinglish: 'Curated earrings, studs, hairpins aur velvet keepsake box',
    description:
      'Everyday elegance in one box! A mix of curated fashion earrings, studs and pearl hairpins presented on a velvet pad inside a compact keepsake box. Stock is curated from wholesale accessory lines at estimate pricing.',
    itemsIncluded: [
      'Curated Fashion Earrings Pair Set',
      'Studs / Hoops Selection',
      'Pearl & Rhinestone Hairpins',
      'Velvet Pad Keep-Compartment Box',
      'Satin Ribbon & Wish Card',
    ],
    approxPrice: 'INR 349 - INR 499',
    pricingNote: 'Wholesale-estimate pricing on curated jewellery stock — confirmed on WhatsApp • Admin-editable',
    badge: 'Everyday Glam',
    themeColor: {
      bg: '#FFF5F7',
      accent: '#BE185D',
      border: '#FBCFE8',
      pillBg: '#FDF2F8',
      pillText: '#9D174D',
    },
    graphicId: 'graphic-accessory-jewellery',
    brochureSource: 'Hamper Queen Accessories Menu',
  },
  {
    id: 'accessory-hair-scarves',
    name: 'Hair & Scarves Glam Box',
    nameHinglish: 'Hair Accessories Aur Scarves Box',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subtitle: 'Silk Scarves, Scrunchie Sets, Claw Clips & Headbands',
    subtitleHinglish: 'Silk scarf, scrunchies, claw clips aur headbands ka glam box',
    description:
      'Volume and elegance for every hairstyle! A curated set of printed silk scarves, satin scrunchies, claw clips and delicate headbands in a soft-pink keepsake box.',
    itemsIncluded: [
      'Printed Silk Scarf (2 pc)',
      'Satin Scrunchie Set (6 pc)',
      'Mini Claw Clips Selection',
      'Pearl Headband',
      'Blush Keepsake Gift Box',
    ],
    approxPrice: 'INR 299 - INR 399',
    pricingNote: 'Wholesale-estimate pricing on curated accessory stock — confirmed on WhatsApp • Admin-editable',
    badge: 'Glam Essentials',
    themeColor: {
      bg: '#FDF2F8',
      accent: '#DB2777',
      border: '#F5D0FE',
      pillBg: '#FCE7F3',
      pillText: '#86198F',
    },
    graphicId: 'graphic-accessory-hair',
    brochureSource: 'Hamper Queen Accessories Menu',
  },

  // ==============================================================
  // 7. CLOTHING & APPAREL (wholesale-estimate pricing)
  // ==============================================================
  {
    id: 'clothing-tee-hamper',
    name: 'Personalised Tee Hamper',
    nameHinglish: 'Custom Print Tee Gift Hamper',
    category: 'clothing',
    categoryLabel: 'Clothing & Apparel',
    subtitle: 'Custom-Print Cotton Tee + Chocolates in a Premium Box',
    subtitleHinglish: 'Custom print wali cotton tee aur chocolates ka premium box',
    description:
      'A wearable gift they will love! A soft 100% cotton tee printed with a custom quote, photo or monogram — paired with branded chocolates and delivered in a premium rigid box. Sizes S-XXL; wholesale-estimate pricing.',
    itemsIncluded: [
      '100% Cotton Custom-Print Tee (S-XXL)',
      'HD Custom Print / Monogram',
      'Branded Chocolate Bar',
      'Premium Rigid Gift Box with Tissue',
      'Printed Fabric Label',
    ],
    approxPrice: 'INR 399 - INR 549',
    pricingNote: 'Wholesale-estimate pricing (tee ₹250-₹380 + print ₹50) — sizes confirmed on WhatsApp • Admin-editable',
    badge: 'Trendy & Personal',
    themeColor: {
      bg: '#F0F9FF',
      accent: '#0284C7',
      border: '#BAE6FD',
      pillBg: '#E0F2FE',
      pillText: '#075985',
    },
    graphicId: 'graphic-clothing-tee',
    brochureSource: 'Hamper Queen Apparel Menu',
  },
  {
    id: 'clothing-hoodie-cocoa',
    name: 'Cozy Hoodie & Hot Cocoa Box',
    nameHinglish: 'Cozy Hoodie Aur Hot Cocoa Box',
    category: 'clothing',
    categoryLabel: 'Clothing & Apparel',
    subtitle: 'Fleece Hoodie, Hot Cocoa Mix & Socks in a Winter Keepsake',
    subtitleHinglish: 'Fleece hoodie, hot cocoa mix aur cozy socks ka winter box',
    description:
      'The ultimate winter comfort drop! A unisex fleece hoodie (S-XXL) paired with hot cocoa mix, ultra-soft socks and a warm fairy-light accent — perfect for cold nights, housewarming and gifting.',
    itemsIncluded: [
      'Unisex Fleece Cozy Hoodie (S-XXL)',
      'Artisan Hot Cocoa Mix',
      'Ultra-Soft Cozy Sock Pair',
      'Warm Fairy Light String',
      'Premium Gift Box with Ribbon',
    ],
    approxPrice: 'INR 499 - INR 699',
    pricingNote: 'Wholesale-estimate pricing (hoodie ₹380-₹520 + cocoa/socks) — sizes confirmed on WhatsApp • Admin-editable',
    badge: 'Winter Comfort',
    themeColor: {
      bg: '#F5F3EE',
      accent: '#57534E',
      border: '#E7E5E4',
      pillBg: '#F5F5F4',
      pillText: '#292524',
    },
    graphicId: 'graphic-clothing-hoodie',
    brochureSource: 'Hamper Queen Apparel Menu',
  },
];
