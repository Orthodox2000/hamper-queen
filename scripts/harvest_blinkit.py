# Blinkit bulk harvest: visits anchor product pages and extracts EVERY priced
# product record embedded in each page's window.grofers.PRELOADED_STATE
# (the target product + all "similar products" records, real prices + images).
# Writes scripts/.retail-harvest.json: a deduped pool of in-stock priced items.
#
# Usage: python scripts/harvest_blinkit.py [minutes-of-anchors]
import json
import re
import sys
import pathlib
import datetime

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = pathlib.Path(__file__).resolve().parent.parent
HARVEST_OUT = pathlib.Path(__file__).resolve().parent / ".retail-harvest.json"

ANCHORS = [
    ("nestle-kitkat-grand-break-4-fingers-wafer-chocolate-bar-38.5-g", 212722, "kitkat_4f"),
    ("cadbury-dairy-milk-silk-milk-chocolate-bar", 11022, "silk_144g"),
    ("cadbury-dairy-milk-chocolate-bar-cricket-pack", 669065, "dairy_milk_26g"),
    ("ferrero-rocher-chocolate-gift-pack-4-pieces", 19679, "ferrero_4pc"),
    ("nestle-munch-max-chocolate-coated-crunchy-wafer-bar", 496297, "munch_45g"),
    ("kinder-joy-blue-20g", 19825, "kinder_joy_20g"),
    ("sunfeast-dark-fantasy-choco-fills-chocolate-biscuit-pack", 313249, "dark_fantasy_230g"),
    ("lays-classic-salted-potato-chips", 57435, "lays_classic"),
    ("pringles-jalapeno-potato-chips", 39076, "pringles_jalapeno"),
    ("parle-g-dark-biscuit", 694778, "parle_g_dark"),
    ("nestle-milkybar-made-with-milk", 400891, "milkybar"),
    ("snickers-best-of-minis-chocolate-pack", 513015, "snickers_minis"),
    ("cadbury-celebrations-assorted-chocolate-gift-pack", 369094, "celebrations"),
    ("cadbury-5-star-3d-filled-bar", 381861, "5star_3d"),
    ("cadbury-perk-plus-coated-wafer-chocolate-bar", 593695, "perk_plus"),
    ("cadbury-dairy-milk-silk-bubbly-small-chocolate-bar", 86669, "silk_bubbly_small"),
    ("cadbury-dairy-milk-silk-fruit-nut-small-milk-chocolate-bar", 110016, "silk_fn_small"),
    ("cadbury-dairy-milk-silk-oreo-large-chocolate-bar", 353818, "silk_oreo_large"),
    ("cadbury-dairy-milk-silk-fruit-nut-chocolate-bar", 11025, "silk_fn"),
    ("cadbury-dairy-milk-milkinis-milk-chocolate-bar-pack-of-2", 707088, "milkinis_p2"),
    ("milka-oreo-chocolate-bar", 164002, "milka_oreo"),
    ("nestle-milkybar-creamy-milky-treat-pack-of-2", 483013, "milkybar_p2"),
    ("galaxy-smooth-milk-chocolate", 480029, "galaxy"),
    ("cadbury-perk-mini-treats-coated-wafer-chocolate-pack", 225506, "perk_mini"),
    ("pringles-hot-spicy-potato-chips", 485928, "pringles_hot"),
    ("lays-american-style-cream-onion-flavour-potato-chips", 432778, "lays_cream_onion"),
    ("oreo-dipped-chocolate-sandwich-cream-biscuits-buy-2-get-1-free", 403242, "oreo_dipped"),
    ("parle-monaco-classic-regular-biscuit-pack-of-5", 376250, "monaco_p5"),
    ("parle-g-glucose-biscuit-pack-of-5", 423602, "parle_g_p5"),
    ("cadbury-perk-chocolate", 381862, "perk"),
    ("kurkure-chatpata-cheese-crisps-pack-of-3", 490862, "kurkure_p3"),
]

EXTRACT_ALL = r"""
() => {
  const s = window.grofers && window.grofers.PRELOADED_STATE;
  if (!s) return { ok: false, reason: 'no_preloaded_state' };
  const found = new Map();
  let locality = null;
  let chainId = s.data?.chainId ?? null;
  const walk = (o, seen) => {
    if (!o || typeof o !== 'object') return;
    if (seen.has(o)) return;
    seen.add(o);
    if (o.coords && typeof o.coords === 'object' && o.coords.locality && !locality) {
      locality = { name: o.coords.locality, lat: o.coords.lat, lon: o.coords.lon };
    }
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
  return { ok: true, chainId, locality, count: list.length, records: list };
}
"""


def main():
    capture = datetime.date.today().isoformat()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            locale="en-IN",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()
        page.on("dialog", lambda d: d.dismiss())

        pool = {}
        locality = None
        chain_id = None
        visited = 0
        for slug, prid, key in ANCHORS:
            url = f"https://www.blinkit.com/prn/{slug}/prid/{prid}"
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(2400)
                data = page.evaluate(EXTRACT_ALL)
                if not data.get("ok"):
                    print(f"[{key}] skipped ({data.get('reason')})")
                    continue
                visited += 1
                chain_id = data.get("chainId") or chain_id
                locality = data.get("locality") or locality
                for r in data.get("records", []):
                    pool[r["pid"]] = r
                print(f"[{key}] +{data.get('count')} (pool {len(pool)})")
            except Exception as e:
                print(f"[{key}] FAILED: {str(e)[:120]}")

        browser.close()

    recs = [dict(r, capturedAt=capture) for r in pool.values()]
    HARVEST_OUT.write_text(json.dumps(recs, indent=2, ensure_ascii=False), encoding="utf-8")
    in_stock = [r for r in recs if r["inStock"]]
    priced = [r for r in recs if r["price"] > 0]
    print(f"\nVisited {visited}/{len(ANCHORS)} anchors")
    print(f"Pool: {len(recs)} unique records | {len(in_stock)} in-stock | {len(priced)} priced")
    if locality:
        print(f"Locality: {locality.get('name')}  chain: {chain_id}")
    print(f"Wrote -> {HARVEST_OUT}")


if __name__ == "__main__":
    sys.exit(main())