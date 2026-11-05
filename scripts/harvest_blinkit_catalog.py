# Blinkit search-harvest v2 - NO clicking needed.
# Search page product cards carry the pid as their DOM `id` (proven: card id == retail
# pid). We collect card ids from the search page, then visit each pid via a generic
# anchor URL (proven: /prn/x/prid/<pid> resolves and PRELOADED_STATE includes the
# target + ~27 "similar products" with real prices, brands, units, images).
#
# Writes scripts/.retail-catalog-<batch>.json (deduped pool keyed by pid with a
# `queries` label per record for pick curation).
#
# Usage: python scripts/harvest_blinkit_catalog.py <batch> --queries "mugs" "coffee mug set" ... [--anchors N]
import argparse
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = pathlib.Path(__file__).resolve().parent

WARM_ANCHOR = "https://www.blinkit.com/prn/cadbury-dairy-milk-chocolate-bar-cricket-pack/prid/669065"

EXTRACT_ALL = r"""
() => {
  const s = window.grofers && window.grofers.PRELOADED_STATE;
  if (!s) return { ok: false, reason: 'no_preloaded_state' };
  const found = new Map();
  const walk = (o, seen) => {
    if (!o || typeof o !== 'object') return;
    if (seen.has(o)) return;
    seen.add(o);
    const pid = o.product_id ?? o.id;
    if (typeof o.price === 'number' && o.price > 0 && pid !== undefined) {
      const id = Number(pid);
      if (!found.has(id)) {
        found.set(id, {
          pid: id,
          name: o.product_name ?? o.display_name ?? o.name ?? '',
          brand: o.brand ?? o.brandName ?? null,
          unit: o.unit ?? null,
          price: o.price,
          mrp: o.mrp ?? o.price,
          image_url: o.image_url ?? null,
          inventory: o.inventory ?? null,
          rating: typeof o.rating === 'number' ? o.rating : null,
        });
      }
    }
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (Array.isArray(v)) { for (const it of v) walk(it, seen); }
      else if (v && typeof v === 'object') walk(v, seen);
    }
  };
  walk(s, new Set());
  const inStock = (r) => r.inventory !== null && r.inventory !== undefined && String(r.inventory) !== '';
  const list = Array.from(found.values()).map(r => ({ ...r, inStock: inStock(r) }));
  return { ok: true, count: list.length, records: list };
}
"""

# Search card selector: product cards are divs whose DOM id == pid, with ADD + image.
CARD_JS = r"""
() => {
  const list = Array.from(document.querySelectorAll('div[role="button"][tabindex="0"]'))
    .filter(c => /ADD/i.test(c.textContent || '') && c.querySelector('img'));
  return list.map(el => ({ id: el.id || null, text: (el.textContent || '').slice(0, 60).replace(/\s+/g, ' ').trim() }))
    .filter(x => x.id && /^\d+$/.test(x.id));
}
"""


def main():
    parser = argparse.ArgumentParser(description="Blinkit search-based catalog harvester v2")
    parser.add_argument("batch", help="output label -> .retail-catalog-<batch>.json")
    parser.add_argument("--queries", nargs="+", required=True, help="search terms")
    parser.add_argument("--anchors", type=int, default=3, help="max pids to deep-visit per query")
    args = parser.parse_args()

    today = __import__("datetime").date.today().isoformat()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            locale="en-IN",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()
        page.on("dialog", lambda d: d.dismiss())
        page.goto(WARM_ANCHOR, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(2500)
        print("warmed location")

        pool = {}
        query_labels = {}
        visited = 0
        for query in args.queries:
            url = f"https://www.blinkit.com/s/?q={query.replace(' ', '%20')}"
            pids = []
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(3000)
                page.mouse.wheel(0, 2500)
                page.wait_for_timeout(1800)
                cards = page.evaluate(CARD_JS)
                pids = [c["id"] for c in cards if c["id"]]
                print(f"[{query}] {len(cards)} product cards on search page, first: {cards[:3]}")
            except Exception as e:
                print(f"[{query}] search page FAILED: {str(e)[:120]}")

            for pid in pids[: args.anchors]:
                try:
                    page.goto(f"https://www.blinkit.com/prn/x/prid/{pid}", wait_until="domcontentloaded", timeout=45000)
                    page.wait_for_timeout(4000)
                    data = page.evaluate(EXTRACT_ALL)
                    if not data.get("ok"):
                        print(f"  [{query}] pid {pid} skipped ({data.get('reason')})")
                        continue
                    visited += 1
                    for r in data.get("records", []):
                        old = pool.get(r["pid"])
                        if old is None:
                            pool[r["pid"]] = r
                        # if we already had the target pid, prefer the deeper record
                        if r["pid"] == int(pid):
                            pool[r["pid"]] = {**old, **r} if old else r
                        qs = query_labels.setdefault(r["pid"], [])
                        if query not in qs:
                            qs.append(query)
                    print(f"  [{query}] pid {pid}: +{data.get('count')} (pool {len(pool)})")
                except Exception as e:
                    print(f"  [{query}] pid {pid} visit FAILED: {str(e)[:100]}")

        browser.close()

    recs = []
    for r in pool.values():
        rec = dict(r, capturedAt=today)
        rec["queries"] = query_labels.get(r["pid"], [])
        recs.append(rec)
    out = OUT_DIR / f".retail-catalog-{args.batch}.json"
    out.write_text(json.dumps(recs, indent=2, ensure_ascii=False), encoding="utf-8")
    labels = {q: sum(1 for r in recs if q in r.get("queries", [])) for q in args.queries}
    print(f"\nVisited {visited} anchor pages | pool {len(recs)} | in-stock {sum(1 for r in recs if r.get('inStock'))}")
    print("per-query:", labels)
    print(f"Wrote -> {out.name}")


if __name__ == "__main__":
    sys.exit(main())