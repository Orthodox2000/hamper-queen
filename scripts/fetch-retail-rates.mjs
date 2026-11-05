// Bakes retail rates into src/data/retailRates.ts + src/data/retailDataset.json.
// Merges:
//   1. scripts/.retail-raw.json  — hand-curated records (notes, bouquet SKUs) from scrape_blinkit.py
//   2. scripts/.retail-picks.json — curated key->pid picks resolved against scripts/.retail-harvest.json
//                                  (bulk harvest from Blinkit product pages)
//   3. scripts/.retail-catalog-picks.json — category picks resolved against scripts/.retail-catalog-*.json
//                                  (search-based harvests: drinkware, lights, electronics, ...)
// Download-safety: a pick whose image fails to download is SKIPPED (with a warning) so the
// catalog never ships a remote CDN url — the zero-remote-URL invariant is enforced.
//
// retailDataset.json preserves the ORIGINAL source metadata for every item — the remote
// image URL, Blinkit product pid, source page, brand/name/unit/prices and capture date —
// so any local image can be re-downloaded or re-referenced later without re-scraping.
//
// Usage: node scripts/fetch-retail-rates.mjs
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RAW_FILE = path.join(__dirname, '.retail-raw.json');
const PICKS_FILE = path.join(__dirname, '.retail-picks.json');
const HARVEST_FILE = path.join(__dirname, '.retail-harvest.json');
const CATALOG_PICKS_FILE = path.join(__dirname, '.retail-catalog-picks.json');
const CATALOG_POOL_GLOB = '.retail-catalog-';
const IMG_DIR = path.join(ROOT, 'public', 'retail');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'retailRates.ts');
const DATASET_FILE = path.join(ROOT, 'src', 'data', 'retailDataset.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, referer: 'https://www.blinkit.com/' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) throw new Error(`Tiny body (${buf.length} bytes)`);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    return true;
  } catch (err) {
    console.warn(`  image download failed for ${url}: ${err.message}`);
    return false;
  }
}

// Merge duplicate pool records by pid, keeping the richest one (has image + brand + name).
function mergePool(records) {
  const byPid = new Map();
  for (const r of records) {
    if (!r || r.pid == null) continue;
    const key = String(r.pid);
    const existing = byPid.get(key);
    const score = (x) => (x.image_url ? 4 : 0) + (x.brand ? 2 : 0) + (x.name ? 1 : 0);
    if (!existing || score(r) > score(existing)) byPid.set(key, r);
  }
  return byPid;
}

async function loadCatalogPools() {
  const files = (await readdir(__dirname)).filter((f) => f.startsWith(CATALOG_POOL_GLOB) && f.endsWith('.json'));
  const records = [];
  for (const f of files) {
    try {
      const arr = JSON.parse(await readFile(path.join(__dirname, f), 'utf8'));
      if (Array.isArray(arr)) records.push(...arr.map((r) => ({ ...r, sourcePool: f.replace(CATALOG_POOL_GLOB, '').replace('.json', '') })));
    } catch (err) {
      console.warn(`  !! could not read ${f}: ${err.message}`);
    }
  }
  return mergePool(records);
}

const CHOCO_BRANDS = new Set([
  'Cadbury Dairy Milk Silk','Cadbury Dairy Milk','Cadbury 5 Star','Cadbury Perk','Cadbury Fuse',
  'Cadbury Gems','Cadbury Nutties','Cadbury Celebrations','Cadbury Bournville','Cadbury Temptations',
  'Nestle KitKat','KitKat Delights','Nestle Milkybar','Nestle Munch','Mars','Snickers','Kinder','Kinder Joy',
  'Galaxy','Milka','Hershey\'s','Hershey\'s Kisses','Hershey\'s Exotic Dark','Lindt Lindor','Ferrero Rocher',
  'Ferrero Raffaello','Amul',
]);
const BISCUIT_BRANDS = new Set([
  'Oreo','Hide & Seek','Sunfeast Bourbon','Sunfeast Dark Fantasy','Parle-G','Parle','Parle Monaco',
  'Britannia','Cadbury Chocobakes',
]);
const SNACK_BRANDS = new Set([
  'Lay\'s','Pringles','Kurkure','Bingo Mad Angles','Bingo Tedhe Medhe','Doritos','Uncle Chipps','Too Yumm',
  'Haldiram\'s','Crax','Cheetos',
]);

function categorize(brand) {
  if (!brand) return 'retail item';
  if (CHOCO_BRANDS.has(brand)) return 'retail chocolate SKU';
  if (BISCUIT_BRANDS.has(brand)) return 'retail biscuit SKU';
  if (SNACK_BRANDS.has(brand)) return 'retail snack/chips SKU';
  return 'retail item';
}

const CATEGORY_LABEL = {
  chocolates: 'retail chocolate SKU',
  drinkware: 'retail drinkware (mugs & glasses)',
  lights: 'retail decorative lighting',
  electronics: 'retail electronics',
  fragrance: 'retail fragrance & grooming',
  women_accessories: 'retail women accessories',
  art_stationery: 'retail art & stationery',
  books: 'retail books',
  clothing: 'retail clothing',
  home_decor: 'retail home decor',
  sweets: 'retail sweets SKU',
  snacks: 'retail snack/chips SKU',
  biscuits: 'retail biscuit SKU',
};

const curated = JSON.parse(await readFile(RAW_FILE, 'utf8')).filter((r) => !r.error && r.price > 0);
const picks = JSON.parse(await readFile(PICKS_FILE, 'utf8'));
const pool = JSON.parse(await readFile(HARVEST_FILE, 'utf8'));
const catalogPicks = await readFile(CATALOG_PICKS_FILE, 'utf8')
  .then((t) => JSON.parse(t))
  .catch(() => []);
const catalogPool = await loadCatalogPools();

const byPid = new Map(pool.map((r) => [String(r.pid), r]));
const byCatalogPid = new Map();
for (const [pid, rec] of catalogPool) byCatalogPid.set(pid, rec);

const added = [];
const categoryByKey = new Map();
const pickWithDownload = async (pick, rec, category) => {
  const key = pick.key;
  const harvestRec = byPid.get(String(pick.pid));
  const merged = mergePool([rec, ...(harvestRec ? [harvestRec] : [])]).get(String(pick.pid)) ?? rec;
  if (!merged.image_url) {
    console.warn(`  !! pick has no image: ${key} (pid ${pick.pid}) — SKIPPING`);
    return;
  }
  const local = `/retail/${key}.jpg`;
  const ok = await downloadImage(merged.image_url, path.join(IMG_DIR, `${key}.jpg`));
  if (!ok) {
    console.warn(`  !! image download failed for ${key} (pid ${pick.pid}) — SKIPPING to keep zero-remote invariant`);
    return;
  }
  const cat = category ?? categorize(merged.brand);
  categoryByKey.set(key, cat);
  added.push({
    key,
    note: CATEGORY_LABEL[cat] ?? categorize(merged.brand),
    category: cat,
    brand: merged.brand ?? '',
    name: merged.name ?? '',
    unit: merged.unit ?? '',
    price: merged.price,
    mrp: merged.mrp ?? merged.price,
    rating: merged.rating ?? null,
    image: local,
    prid: merged.pid,
    imageUrlOriginal: merged.image_url ?? null,
    sourceUrl: merged.sourceUrl ?? merged.pageUrl ?? null,
    capturedAt: merged.capturedAt ?? '2026-09-25',
    variants: [{ unit: merged.unit ?? '', price: merged.price, mrp: merged.mrp ?? merged.price }],
  });
};

for (const pick of picks) {
  const rec = byPid.get(String(pick.pid));
  if (!rec) {
    console.warn(`  !! pick missing in pool: ${pick.key} (pid ${pick.pid})`);
    continue;
  }
  await pickWithDownload(pick, { ...rec });
}

for (const pick of catalogPicks) {
  const rec = catalogPool.get(String(pick.pid));
  if (!rec) {
    console.warn(`  !! catalog pick missing in catalog pool: ${pick.key} (pid ${pick.pid})`);
    continue;
  }
  await pickWithDownload(pick, { ...rec }, pick.category ?? 'retail item');
}

const data = [...curated, ...added]
  .map((r) => ({
    key: r.key,
    note: r.note ?? '',
    category: r.category ?? categoryByKey.get(r.key) ?? null,
    brand: r.brand ?? '',
    name: r.name ?? '',
    unit: r.unit ?? '',
    price: r.price,
    mrp: r.mrp ?? r.price,
    rating: r.rating ?? null,
    image: r.image,
    prid: r.prid,
    capturedAt: r.capturedAt ?? '2026-09-25',
    variants: (r.variants ?? []).filter((v) => v.price > 0),
  }))
  .sort((a, b) => a.key.localeCompare(b.key));

await mkdir(path.dirname(OUT_FILE), { recursive: true });

const locality = curated.find((r) => r.locality)?.locality?.name ?? 'Gurugram';
const chainId = curated.find((r) => r.chainId)?.chainId ?? 1383;
const capturedAt = data[0]?.capturedAt ?? new Date().toISOString().slice(0, 10);

const ts = `// Auto-generated retail rates captured from Blinkit product pages on ${capturedAt}.
// Price location: ${locality} (chain ${chainId}) — indicative rates; Mumbai may differ a few INR.
// This file is generated — re-run: node scripts/fetch-retail-rates.mjs

export interface RetailRateItem {
  key: string;
  note: string;
  category: string | null;
  brand: string;
  name: string;
  unit: string;
  price: number;
  mrp: number;
  rating: number | null;
  image: string;
  prid: number;
  capturedAt: string;
  variants?: { unit: string; price: number; mrp: number }[];
}

export const RETAIL_RATES_CAPTURED_AT = '${capturedAt}';
export const RETAIL_RATES_LOCATION = '${locality}';

export const RETAIL_RATES: RetailRateItem[] = ${JSON.stringify(data, null, 2)};

export const RETAIL_RATES_BY_KEY: Record<string, RetailRateItem> = Object.fromEntries(
  RETAIL_RATES.map((r) => [r.key, r])
);

export function retailRate(key: string): RetailRateItem | undefined {
  return RETAIL_RATES_BY_KEY[key];
}
`;

await writeFile(OUT_FILE, ts, 'utf8');
console.log(`Wrote ${data.length} records (${curated.length} curated + ${added.length} picked) -> src/data/retailRates.ts`);

const datasetJson = {
  source: 'https://www.blinkit.com/',
  locality: `${locality} (chain ${chainId})`,
  capturedAt,
  description:
    'Original-source catalog manifest. Every retail product image is mirrored locally under /retail/<key>.jpg; imageUrlOriginal/sourceUrl preserve the origin for re-download or re-reference. Do not edit by hand — re-run: node scripts/fetch-retail-rates.mjs',
  items: data.map((r) => ({
    key: r.key,
    prid: r.prid,
    category: r.category,
    brand: r.brand,
    name: r.name,
    unit: r.unit,
    price: r.price,
    mrp: r.mrp,
    rating: r.rating,
    localImage: r.image,
    imageUrlOriginal: [...curated, ...added].find((s) => s.key === r.key)?.imageUrlOriginal ?? null,
    sourceUrl: [...curated, ...added].find((s) => s.key === r.key)?.sourceUrl ?? null,
    capturedAt: r.capturedAt,
  })),
};

await writeFile(DATASET_FILE, JSON.stringify(datasetJson, null, 2), 'utf8');
console.log(`Wrote dataset manifest -> src/data/retailDataset.json`);