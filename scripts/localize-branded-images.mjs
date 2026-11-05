// Rewrites brandedItemsData.ts Unsplash URLs -> local /packaging & /polaroids paths.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'src', 'data', 'brandedItemsData.ts');
const MAP = JSON.parse(await readFile(path.join(ROOT, 'scripts', '.unsplash-map.json'), 'utf8'));

let s = await readFile(FILE, 'utf8');
let count = 0;

const all = { ...MAP.packaging, ...MAP.polaroids, ...MAP.extra };
for (const [photoId, local] of Object.entries(all)) {
  // Replace any https://images.unsplash.com/<photoId>[...] URL with the local path.
  const re = new RegExp(`https://images\\.unsplash\\.com/${photoId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^'"]*`, 'g');
  const before = s;
  s = s.replace(re, local);
  const delta = (s.match(new RegExp(local, 'g')) || []).length - (before.match(new RegExp(local, 'g')) || []).length;
  count += delta;
}

await writeFile(FILE, s, 'utf8');
console.log(`Replaced ${count} remote URLs -> local paths in brandedItemsData.ts.`);

// ---- Also localize hero + bulk sections ----
const EXTRA_FILE_MAP = {
  [path.join(ROOT, 'src', 'components', 'RoyalCoverHero.tsx')]: 'url',
  [path.join(ROOT, 'src', 'components', 'BulkOrdersSection.tsx')]: 'image',
};
for (const [file, field] of Object.entries(EXTRA_FILE_MAP)) {
  let t = await readFile(file, 'utf8');
  let n = 0;
  for (const [photoId, local] of Object.entries(all)) {
    const re = new RegExp(`https://images\\.unsplash\\.com/${photoId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^'"]*`, 'g');
    const m = t.match(re);
    if (m) n += m.length;
    t = t.replace(re, local);
  }
  await writeFile(file, t, 'utf8');
  console.log(`Replaced ${n} remote URLs -> local paths in ${path.basename(file)}.`);
}