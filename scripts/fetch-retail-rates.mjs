// Bakes retail rates into src/data/retailRates.ts.
// Merges:
//   1. scripts/.retail-raw.json  — hand-curated records (notes, bouquet SKUs) from scrape_blinkit.py
//   2. scripts/.retail-picks.json — curated key->pid picks resolved against scripts/.retail-harvest.json
//                                  (bulk harvest from Blinkit product pages)
// Downloads missing product images (cdn.grofers.com is hotlinkable) into public/retail/<key>.jpg.
//
// Usage: node scripts/fetch-retail-rates.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RAW_FILE = path.join(__dirname, '.retail-raw.json');
const PICKS_FILE = path.join(__dirname, '.retail-picks.json');
const HARVEST_FILE = path.join(__dirname, '.retail-harvest.json');
const IMG_DIR = path.join(ROOT, 'public', 'retail');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'retailRates.ts');

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

const curated = JSON.parse(await readFile(RAW_FILE, 'utf8')).filter((r) => !r.error && r.price > 0);
const picks = JSON.parse(await readFile(PICKS_FILE, 'utf8'));
const pool = JSON.parse(await readFile(HARVEST_FILE, 'utf8'));
const byPid = new Map(pool.map((r) => [String(r.pid), r]));

const added = [];
for (const pick of picks) {
  const rec = byPid.get(String(pick.pid));
  if (!rec) {
    console.warn(`  !! pick missing in pool: ${pick.key} (pid ${pick.pid})`);
    continue;
  }
  if (!rec.image_url) {
    console.warn(`  !! pick has no image: ${pick.key} (pid ${pick.pid})`);
  } else {
    const local = `/retail/${pick.key}.jpg`;
    const ok = await downloadImage(rec.image_url, path.join(IMG_DIR, `${pick.key}.jpg`));
    if (!ok) {
      console.warn(`  !! falling back to remote image for ${pick.key}`);
    }
    rec.localImage = ok ? local : rec.image_url;
  }
  added.push({
    key: pick.key,
    note: categorize(rec.brand),
    brand: rec.brand ?? '',
    name: rec.name ?? '',
    unit: rec.unit ?? '',
    price: rec.price,
    mrp: rec.mrp ?? rec.price,
    rating: rec.rating ?? null,
    image: rec.localImage,
    prid: rec.pid,
    capturedAt: rec.capturedAt ?? '2026-09-25',
    variants: [{ unit: rec.unit ?? '', price: rec.price, mrp: rec.mrp ?? rec.price }],
  });
}

const data = [...curated, ...added]
  .map((r) => ({
    key: r.key,
    note: r.note ?? '',
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