// Verifies the retail dataset integrity:
//  - >= 100 records
//  - every record has a local image with an existing file
//  - no remote/cdn URLs in runtime data (retailRates.ts)
//  - manifest retains original-source metadata
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

let failed = false;
const fail = (msg) => {
  failed = true;
  console.error(`  FAIL: ${msg}`);
};
const ok = (msg) => console.log(`  ok: ${msg}`);

// 1. Runtime data must have zero remote URLs.
const ts = await readFile(path.join(ROOT, 'src', 'data', 'retailRates.ts'), 'utf8');
const remoteInApp = ts.match(/https?:\/\/(?:images\.unsplash\.com|cdn\.grofers\.com|www\.blinkit\.com)\S*/g) || [];
if (remoteInApp.length > 0) fail(`${remoteInApp.length} remote URL(s) still in retailRates.ts (${remoteInApp[0]})`);
else ok('retailRates.ts has zero remote URLs');

// 2. Load runtime records: the generator emits JSON.stringify output (keys quoted),
//    so the array body is valid JSON after the prefix/suffix are removed.
const m = /export const RETAIL_RATES: RetailRateItem\[\] = (\[[\s\S]*?\]);\n/.exec(ts);
if (!m) {
  fail('could not locate RETAIL_RATES array');
  process.exit(1);
}
let data;
try {
  data = JSON.parse(m[1]);
} catch (e) {
  fail(`RETAIL_RATES array is not parseable JSON: ${e.message}`);
  process.exit(1);
}

if (data.length < 100) fail(`only ${data.length} records (need >= 100)`);
else ok(`${data.length} records`);

const missing = [];
const badRemote = [];
for (const r of data) {
  if (!r.image) {
    missing.push(`${r.key}:no-image`);
    continue;
  }
  if (!r.image.startsWith('/')) badRemote.push(`${r.key}:${r.image}`);
  else {
    try {
      await access(path.join(PUBLIC, r.image.replace(/^\//, '')));
    } catch {
      missing.push(`${r.key}:${r.image}`);
    }
  }
}
if (missing.length)
  fail(`only ${data.length - missing.length}/${data.length} have existing local images; missing: ${missing.slice(0, 5).join(', ')}`);
else ok(`${data.length} local images exist on disk`);
if (badRemote.length) fail(`non-local image paths: ${badRemote.slice(0, 3).join(', ')}`);
else ok('all image paths are local /retail/*');

// 3. Dataset manifest retains metadata.
const ds = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'retailDataset.json'), 'utf8'));
if (!ds.items || ds.items.length < 100) fail(`manifest has ${ds.items?.length ?? 0} items`);
else ok(`manifest has ${ds.items.length} items`);
const withMeta = ds.items.filter((i) => i.imageUrlOriginal || i.sourceUrl).length;
if (withMeta < ds.items.length) fail(`${ds.items.length - withMeta} items missing original metadata`);
else ok('all manifest items carry imageUrlOriginal/sourceUrl');
const keys = ds.items.map((i) => i.key);
if (new Set(keys).size !== keys.length) fail('duplicate keys in manifest');
else ok('no duplicate keys in manifest');

// 4. Spot-check image sizes (normalized 512x512 by process-retail-images.py).
let smallFiles = 0;
for (const i of ds.items) {
  if (!i.localImage) continue;
  try {
    const buf = await readFile(path.join(PUBLIC, i.localImage.replace(/^\//, '')));
    if (buf.length < 1024) smallFiles++;
  } catch {}
}
if (smallFiles) fail(`${smallFiles} suspiciously small local images`);
else ok('all retail images are reasonable size');

console.log(failed ? '\nVERIFY FAILED' : '\nVERIFY PASSED');
process.exit(failed ? 1 : 0);