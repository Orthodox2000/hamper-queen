/**
 * catalog.ts
 * -----------------------------------------------------------------------------
 * Merges the code-defined catalog (HAMPER_QUEEN_PRODUCTS) with admin overrides
 * stored in MongoDB. Admin edits win; override-only rows become extra products.
 * The storefront always degrades to the static catalog when MongoDB is down.
 */

import {
  HAMPER_QUEEN_PRODUCTS,
  HamperQueenProduct,
} from '../data/hamperQueenCatalog';
import { getCatalogOverridesCollection } from './mongo';
import { CatalogOverride } from '../types/order';

const DEFAULT_THEME = {
  bg: '#FFFDF9',
  accent: '#B8860B',
  border: '#D4AF37',
  pillBg: '#FAF5E8',
  pillText: '#8C6821',
};

/** Ensure a "custom-" product id gains the canonical id + a stable itemCode. */
function synthesizeProduct(override: CatalogOverride): HamperQueenProduct {
  const fields = override.fields;
  const baseId = override.productId;
  const id = baseId.startsWith('custom-') ? baseId : `custom-${baseId}`;
  const pretty = (fields.name ?? id.replace(/^custom-/, '')).replace(/-/g, ' ');
  return {
    id,
    itemCode: `HQ-CUS-${Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % 900 + 100}`,
    name: fields.name ?? pretty,
    nameHinglish: fields.nameHinglish ?? fields.name ?? pretty,
    category: 'customised_hampers',
    categoryLabel: fields.categoryLabel ?? 'Admin Curated',
    subtitle: fields.subtitle ?? 'Hand-crafted custom hamper curated exclusively for you.',
    subtitleHinglish: fields.subtitleHinglish ?? fields.subtitle ?? 'Aapke liye specially curated custom hamper.',
    description: fields.subtitle ?? 'Custom hamper curated by the Hamper Queen studio.',
    itemsIncluded: fields.itemsIncluded?.length ? fields.itemsIncluded : ['Handpicked premium treats'],
    approxPrice: fields.approxPrice ?? 'INR 299',
    pricingNote: fields.pricingNote ?? 'Final invoice shared on WhatsApp after customization.',
    themeColor: DEFAULT_THEME,
    graphicId: 'default',
    brochureSource: 'custom-hamper',
  };
}

export function mergeCatalog(
  products: HamperQueenProduct[] = HAMPER_QUEEN_PRODUCTS,
  overrides: CatalogOverride[] = []
): HamperQueenProduct[] {
  if (!Array.isArray(overrides) || overrides.length === 0) return products;

  const merged = products.map((product) => {
    const match = overrides.find((o) => o.productId === product.id || o.productId === `custom-${product.id}`);
    if (!match) return product;
    return { ...product, ...match.fields } as HamperQueenProduct;
  });

  const knownIds = new Set(products.map((p) => p.id));
  overrides
    .filter((o) => !knownIds.has(o.productId))
    .forEach((override) => merged.push(synthesizeProduct(override)));

  return merged;
}

export async function readOverrides(): Promise<CatalogOverride[]> {
  try {
    const collection = await getCatalogOverridesCollection();
    const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    return docs.map((d) => ({
      _id: String(d._id),
      productId: d.productId as string,
      fields: (d.fields ?? {}) as CatalogOverride['fields'],
      updatedAt: d.updatedAt as string,
    }));
  } catch {
    return [];
  }
}

/** Full merged catalog — used by the API, admin, and order-creation server-side. */
export async function getMergedCatalog(): Promise<HamperQueenProduct[]> {
  const overrides = await readOverrides();
  return mergeCatalog(HAMPER_QUEEN_PRODUCTS, overrides);
}

/** Resolve a single product by id from the merged catalog. */
export async function resolveProduct(id: string): Promise<HamperQueenProduct | undefined> {
  const catalog = await getMergedCatalog();
  return catalog.find((p) => p.id === id);
}