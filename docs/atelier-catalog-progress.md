# Atelier Retail Catalog — Pipeline Progress Checkpoint

Purpose: track the zero-CDN Blinkit harvest → curate → bake → verify → commit loop for `src/data/retailRates.ts` + `src/data/retailDataset.json` + `public/retail/*.jpg`.

## Pipeline Loop (per batch)
1. Harvest pool: `python scripts/harvest_blinkit_catalog.py <batch> --queries "..." "..." --anchors N` → `scripts/.retail-catalog-<batch>.json`
2. Curate picks (bash/py in temp): append `{key, pid, category}` to `scripts/.retail-catalog-picks.json` (lowercase-underscore keys)
3. If any picks NOIMG/MISS → recover via search-card scraping (patch pool records: name/price/brand/image_url) then re-run curation
4. Bake: `node scripts/fetch-retail-rates.mjs` (skips picks whose image download fails — zero-CDN invariant)
5. `python scripts/process-retail-images.py` then `git checkout -- <12 pre-existing noise jpgs>` (byte-noise re-encodes of prior committed images)
6. `node scripts/verify-retail-dataset.mjs` (asserts zero remote URLs, all local files exist)
7. `npm run lint` → `npm run build` → `git checkout -- next-env.d.ts`
8. Playwright filter-tab check (temp `verify_batch*.py`) — exact emoji tab labels
9. Commit + push, including `tsconfig.tsbuildinfo` refresh

## Committed Batches
| Batch  | Commit | Picks | Catalog records |
|--------|--------|-------|-----------------|
| 1 drinkware+lights+chocolate | `b91f864` | 74   | 223 |
| 2 fragrance+grooming        | `1ac6c1f` | 102  | 325 |
| 3 electronics               | `e25be9d` | 71   | 396 |
| 4 women_accessories | `764b8c1` | 92 → 339 total | 488 |
| 5 art_stationery + books    | pending | —     | pending |
| 6 clothing + home_decor     | pending | —     | pending |

## Batch 4 Status (women accessories) — DONE, pushed `764b8c1`
- Pool harvested: `scripts/.retail-catalog-women_accessories.json` (559 records, 519 with metadata)
- Recovered 22 anchor targets via search-card scraping (bags, clutches, slings, jewellery, scarves, dupatta, wallets, sunglasses, handkerchiefs, hair accessories, watches incl. Titan Raga/Timex/Casio/Fastrack/Chumbak)
- 92 picks added → `scripts/.retail-catalog-picks.json` = 339 entries; catalog = **488 records**
- All gates green: zero-CDN verify, lint, build, Playwright (Ladies Accessories=95 imgs, Fragrance=59, Grooming=49, Electronics=74, Drinkware=51, Lights=49, Chocolates=49, 0 errors, 0 overflow)

## PAUSED — RESUME STATUS (batch 4 committed + pushed)
All pushed to main. Next session: batch 5, then batch 6, then final `git push`.

## Batch 5 Plan (art & stationery + books)
- Harvest queries: "diary", "notebook", "souvenir", "sketchbook", "paint set", "pen set", "book", "novel", "colouring"
- Category keys: `art_stationery`, `books`

## Batch 6 Plan (clothing + home decor)
- Harvest queries: "scarf", "stole", "dupatta", "kurta", "saree", "candle", "incense", "showpiece", "vase", "photo frame", "wall decor"

## Recovery Pattern (anchor targets with empty metadata)
Scrape search-page cards (`div[role=button][tabindex=0]` with `/ADD/` + `img`) for the pid; if not visible, scroll deeper or try alternate queries; patch pool, re-run curation.

## Verification Invariants
- Zero remote URLs in `retailDataset.json`
- All `public/retail/*.jpg` exist, 512×512, stddev >= 6 (no blank/low-content images)
- Playwright filter counts match tab records with 0 console errors, 0 horizontal overflow @1280/390
- After `npm run build`: restore `next-env.d.ts`; commit `tsconfig.tsbuildinfo`