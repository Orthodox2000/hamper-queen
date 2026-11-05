// Downloads all packaging + polaroid Unsplash images into public/packaging and
// public/polaroids so the atelier has ZERO remote image dependencies.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKAGING_DIR = path.join(ROOT, 'public', 'packaging');
const POLAROIDS_DIR = path.join(ROOT, 'public', 'polaroids');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

// [output fileName, unsplash photo id]
const PACKAGING = [
  ['packaging-small-box.jpg', 'photo-1549465220-1a8b9238cd48'],
  ['packaging-medium-box.jpg', 'photo-1513201099705-a9746e1e201f'],
  ['packaging-large-box.jpg', 'photo-1512909006721-3d6018887383'],
  ['packaging-velvet-hatbox.jpg', 'photo-1584308666744-24d5c474f2ae'],
  ['packaging-acrylic-chest.jpg', 'photo-1563245372-f21724e3856d'],
  ['packaging-xl-trunk.jpg', 'photo-1544816155-12df9643f363'],
  ['packaging-mini-bouquet.jpg', 'photo-1526047932273-341f2a7631f9'],
  ['packaging-photo-bouquet.jpg', 'photo-1518895949257-7621c3c786d7'],
  ['packaging-classic-bouquet.jpg', 'photo-1561181286-d3fee7d55364'],
  ['packaging-heart-bouquet.jpg', 'photo-1518199266791-5375a83190b7'],
];

const POLAROIDS = [
  ['polaroid-preset-1.jpg', 'photo-1516589178581-6cd7833ae3b2'],
  ['polaroid-preset-2.jpg', 'photo-1530103862676-de8c9debad1d'],
  ['polaroid-preset-3.jpg', 'photo-1529156069898-49953e39b3ac'],
  ['polaroid-preset-4.jpg', 'photo-1511895426328-dc8714191300'],
  ['polaroid-preset-5.jpg', 'photo-1522673607200-164d1b6ce486'],
  ['polaroid-preset-6.jpg', 'photo-1492562080023-ab3db95bfbce'],
];

const EXTRA = [
  ['hero-roses-bouquet.jpg', 'photo-1582794543139-8ac9cb0f7b11'],
  ['bulk-podium.jpg', 'photo-1583391733956-3750e0ff4e8b'],
  ['bulk-celebration.jpg', 'photo-1513151233558-d860c5398176'],
];
const EXTRA_DIR = path.join(ROOT, 'public', 'hero');

async function download(photoId, dest) {
  if (exists(dest)) return console.log(`skip ${path.basename(dest)}`);
  const url = `https://images.unsplash.com/${photoId}?q=80&w=1200&auto=format&fit=crop`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, referer: 'https://unsplash.com/' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error(`Tiny body (${buf.length} bytes)`);
    await writeFile(dest, buf);
    console.log(`ok ${path.basename(dest)} (${buf.length} bytes)`);
  } catch (err) {
    console.warn(`FAIL ${photoId}: ${err.message}`);
  }
}

function exists(p) {
  try {
    accessSync(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(PACKAGING_DIR, { recursive: true });
await mkdir(POLAROIDS_DIR, { recursive: true });
await mkdir(EXTRA_DIR, { recursive: true });

for (const [file, photoId] of PACKAGING) {
  await download(photoId, path.join(PACKAGING_DIR, file));
}
for (const [file, photoId] of POLAROIDS) {
  await download(photoId, path.join(POLAROIDS_DIR, file));
}
for (const [file, photoId] of EXTRA) {
  await download(photoId, path.join(EXTRA_DIR, file));
}

// Emit the mapping manifest for the data file rewrite step. EXTRA images are kept
// in public/hero but referenced under /hero/*.
const manifest = {
  packaging: Object.fromEntries(PACKAGING.map(([f, p]) => [p, `/packaging/${f}`])),
  polaroids: Object.fromEntries(POLAROIDS.map(([f, p]) => [p, `/polaroids/${f}`])),
  extra: Object.fromEntries(EXTRA.map(([f, p]) => [p, `/hero/${f}`])),
};
await writeFile(path.join(ROOT, 'scripts', '.unsplash-map.json'), JSON.stringify(manifest, null, 2));
console.log('wrote .unsplash-map.json');