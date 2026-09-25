# Blinkit retail-rate scraper using Playwright (browser-driven, avoids WAF 403).
# For each manifest item it opens the server-rendered product page, pulls the
# product record out of window.grofers.PRELOADED_STATE, downloads the hero
# image into public/retail/, and writes scripts/.retail-raw.json for the TS baker.
#
# Usage: python scripts/scrape_blinkit.py
import json
import re
import pathlib
import sys
import io

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public" / "retail"
RAW_OUT = pathlib.Path(__file__).resolve().parent / ".retail-raw.json"

MANIFEST = [
    {"key": "kitkat_4f", "prid": 212722, "slug": "nestle-kitkat-grand-break-4-fingers-wafer-chocolate-bar-38.5-g", "note": "Used in KitKat bouquet tiers"},
    {"key": "kitkat_2f", "prid": 17391, "slug": "nestle-kitkat-2-fingers-wafer-bar", "note": "Used in KitKat bouquet tiers"},
    {"key": "dark_fantasy_230g", "prid": 313249, "slug": "sunfeast-dark-fantasy-choco-fills-chocolate-biscuit-pack", "note": "Dark Fantasy bouquet biscuit packs"},
    {"key": "dark_fantasy_150g", "prid": 24700, "slug": "sunfeast-dark-fantasy-big-choco-fills-cookies", "note": "Dark Fantasy bouquet biscuit packs (alt)"},
    {"key": "kinder_joy_20g", "prid": 19825, "slug": "kinder-joy-blue-20g", "note": "Kinder Joy bouquet surprise eggs"},
    {"key": "silk_144g", "prid": 11022, "slug": "cadbury-dairy-milk-silk-milk-chocolate-bar", "note": "Cadbury Silk bar for hampers"},
    {"key": "dairy_milk_26g", "prid": 669065, "slug": "cadbury-dairy-milk-chocolate-bar-cricket-pack", "note": "Cadbury Dairy Milk treat"},
    {"key": "munch_45g", "prid": 496297, "slug": "nestle-munch-max-chocolate-coated-crunchy-wafer-bar", "note": "Nestle Munch bar in celebration hampers"},
    {"key": "munch_max_38g", "prid": 732832, "slug": "nestle-munch-max-crunchies-chocolate-bar", "note": "Nestle Munch Max (alt)"},
    {"key": "ferrero_4pc", "prid": 19679, "slug": "ferrero-rocher-chocolate-gift-pack-4-pieces", "note": "Ferrero Rocher gift pair"},
    {"key": "nivea_men_spray", "prid": 25181, "slug": "nivea-men-fresh-active-original-mens-deodorant", "note": "Nivea Men deodorant spray - men grooming bouquet"},
    {"key": "nivea_men_rollon", "prid": 131475, "slug": "nivea-men-fresh-active-mens-roll-on", "note": "Nivea Men roll-on (alt) - men grooming bouquet"},
]

EXTRACT_JS = r"""
() => {
  const s = window.grofers && window.grofers.PRELOADED_STATE;
  if (!s) return { ok: false, reason: 'no_preloaded_state' };
  const wanted = Number(window.__HQ_PRID__);
  const records = [];
  const variantCandidates = [];
  let locality = null, chainId = s.data?.chainId ?? null;
  const walk = (o, seen) => {
    if (!o || typeof o !== 'object') return;
    if (seen.has(o)) return;
    seen.add(o);
    if (o.coords && typeof o.coords === 'object' && o.coords.locality && !locality) {
      locality = { name: o.coords.locality, lat: o.coords.lat, lon: o.coords.lon };
    }
    const pid = o.product_id ?? o.id;
    if (typeof o.price === 'number' && pid !== undefined) {
      if (Number(pid) === wanted) records.push(o);
      if (typeof o.group_id === 'number' && o.unit) variantCandidates.push(o);
    }
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (Array.isArray(v)) { for (const it of v) walk(it, seen); }
      else if (v && typeof v === 'object') walk(v, seen);
    }
  };
  walk(s, new Set());
  const pick = records.find(r => r.product_name && r.image_url) || records[0];
  if (!pick) return { ok: false, reason: 'record_not_found', sawRecords: records.length };
  const gid = pick.group_id;
  const variants = variantCandidates.filter(v => v.group_id === gid && typeof v.unit === 'string')
    .map(v => ({ unit: v.unit, price: v.price, mrp: v.mrp ?? v.price }))
    .filter((v, i, arr) => arr.findIndex(x => x.unit === v.unit && x.price === v.price) === i);
  let rating = null;
  for (const r of records) { if (typeof r.rating === 'number') { rating = r.rating; break; } }
  return {
    ok: true,
    prid: wanted,
    name: pick.product_name ?? pick.display_name ?? pick.name,
    brand: pick.brand ?? null,
    unit: pick.unit ?? null,
    price: pick.price,
    mrp: pick.mrp ?? pick.price,
    image_url: pick.image_url ?? null,
    inventory: pick.inventory ?? null,
    rating, variants, locality, chainId,
  };
}
"""


def image_ext(path_url):
    leaf = path_url.split('/')[-1].split('?')[0].lower()
    return leaf.split('.')[-1] if leaf.split('.')[-1] in ('jpg', 'jpeg', 'png', 'webp') else 'jpg'


def main():
    only = sys.argv[1].split(",") if len(sys.argv) > 1 else None
    targets = [m for m in MANIFEST if only is None or m["key"] in only]
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    captured_at = __import__("datetime").date.today().isoformat()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            locale="en-IN",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()
        page.on("dialog", lambda d: d.dismiss())

        for item in targets:
            label = f"{item['key']} (prid {item['prid']})"
            url = f"https://www.blinkit.com/prn/{item['slug']}/prid/{item['prid']}"
            rec = {**item, "capturedAt": captured_at, "error": None}
            try:
                sys.stdout.write(f"Fetching {label}... ")
                sys.stdout.flush()
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(2600)
                page.evaluate("window.__HQ_PRID__ = " + str(item["prid"]))
                data = page.evaluate(EXTRACT_JS)

                if not data.get("ok"):
                    # Fallback: og:image + JSON-LD price from the raw HTML
                    html = page.content()
                    m = re.search(r'name="og:image"\s+content="([^"]+)"', html)
                    og_img = m.group(1) if m else None
                    ld_m = re.search(r'"@type"\s*:\s*"Product"', html)
                    price = None
                    if ld_m:
                        pm = re.search(r'"price"\s*:\s*(\d+)', html)
                        price = int(pm.group(1)) if pm else None
                    data = {
                        "ok": True, "prid": item["prid"], "name": item["key"],
                        "brand": None, "unit": None, "price": price, "mrp": None,
                        "image_url": og_img, "inventory": None, "rating": None,
                        "variants": [], "locality": None, "chainId": None,
                        "jsonld_fallback": True,
                    }
                    print("JSON-LD fallback ", end="")
                else:
                    print(f"price ₹{data['price']} · {data.get('unit') or ''}  ", end="")

                local_image = None
                img_url = data.get("image_url")
                if img_url:
                    full = img_url if img_url.startswith("http") else "https:" + img_url
                    ext = image_ext(full)
                    out_path = PUBLIC_DIR / f"{item['key']}.{ext}"
                    resp = context.request.get(full, timeout=30000)
                    if resp.ok:
                        out_path.write_bytes(resp.body())
                        local_image = f"/retail/{item['key']}.{ext}"
                        print("img OK ", end="")
                    else:
                        print(f"img FAIL({resp.status}) ", end="")
                rec.update({k: data.get(k) for k in
                            ("prid", "name", "brand", "unit", "price", "mrp", "image_url", "inventory", "rating", "variants", "locality", "chainId", "jsonld_fallback")})
                rec["image"] = local_image or data.get("image_url")
                rec["sourceUrl"] = url
                print("done")
            except Exception as e:
                rec["error"] = str(e)[:200]
                print(f"FAILED: {e}")
            results.append(rec)

        browser.close()

    RAW_OUT.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    ok = [r for r in results if not r.get("error") and r.get("price")]
    print(f"\nWrote {len(ok)}/{len(results)} records -> {RAW_OUT}")
    print(f"Images -> {PUBLIC_DIR}")
    for r in results:
        if r.get("error"):
            print(f"  failed: {r['key']} ({r['error']})")
        elif not r.get("price"):
            print(f"  no price: {r['key']}")


if __name__ == "__main__":
    sys.exit(main())