#!/usr/bin/env python3
"""
Regenerates every favicon / app icon from the brand logo.

    python3 scripts/generate-icons.py        (needs: pip install pillow numpy)

Source : public/hamper.png  (2000x2000 seal: gold crown + "HAMPER QUEEN" in a ring)
Output : src/app/favicon.ico            16/32/48 crown on ink
         src/app/icon.png               512 crown on ink, rounded
         src/app/apple-icon.png         180 crown on ink, opaque (iOS rounds it)
         public/icons/icon-192|512.png  full seal on cream, purpose "any"
         public/icons/maskable-192|512.png  crown on ink, full-bleed (safe zone)
         public/icons/favicon-16|32.png, mstile-150.png

Small sizes use the crown only: the full seal's text is illegible below ~64px.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
INK = (20, 18, 16, 255)        # --color-ink / theme_color #141210
CREAM = (255, 253, 249, 255)   # background_color #FFFDF9

logo = Image.open(ROOT / "public/hamper.png").convert("RGBA")

def crown_crop(img: Image.Image) -> Image.Image:
    a = np.array(img)
    gold = (a[..., 0] > 150) & (a[..., 1] > 100) & (a[..., 2] < 90) & (a[..., 3] > 40)
    h, w = gold.shape
    yy, xx = np.mgrid[:h, :w]
    inner = gold & (np.hypot(xx - w / 2, yy - h / 2) < 0.45 * w)  # drop the ring
    ys, xs = np.where(inner.any(1))[0], np.where(inner.any(0))[0]
    pad = int(0.005 * w)
    c = img.crop((xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad))
    # The seal has a white fill: key it out so the crown sits on any background.
    # Blue channel separates gold (~30) from white (255); anti-aliasing stays smooth.
    b = np.array(c)[..., 2].astype(float)
    alpha = np.clip((250 - b) / (250 - 40), 0, 1)
    out = np.zeros((*b.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = 198, 143, 30          # brand gold
    out[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")

crown = crown_crop(logo)

def tile(size, bg, mark, fill, radius=0.0, ss=4):
    """Square tile with `mark` centred, `fill` = mark width as share of the tile."""
    S = size * ss
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    base = Image.new("RGBA", (S, S), bg)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), int(S * radius), fill=255)
    canvas.paste(base, (0, 0), mask if radius else None)
    mw = int(S * fill)
    mh = int(mark.height * mw / mark.width)
    m = mark.resize((mw, mh), Image.LANCZOS)
    canvas.alpha_composite(m, ((S - mw) // 2, (S - mh) // 2 + int(S * 0.01)))
    return canvas.resize((size, size), Image.LANCZOS)

def save(img, rel):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    img.save(p, optimize=True)
    print("wrote", rel, img.size)

# --- favicon.ico (crown, tighter fill so it survives 16px) -------------------
ico_imgs = [tile(s, INK, crown, 0.78, radius=0.2) for s in (16, 32, 48)]
ico_imgs[2].save(ROOT / "src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)],
                 append_images=ico_imgs[:2])
print("wrote src/app/favicon.ico (16/32/48)")

save(tile(512, INK, crown, 0.66, radius=0.22), "src/app/icon.png")
save(tile(180, INK, crown, 0.66), "src/app/apple-icon.png")          # opaque, iOS masks it

# --- PWA icons ----------------------------------------------------------------
for s in (192, 512):
    seal = logo.resize((int(s * 0.94),) * 2, Image.LANCZOS)
    t = Image.new("RGBA", (s, s), CREAM)
    t.alpha_composite(seal, ((s - seal.width) // 2, (s - seal.height) // 2))
    save(t, f"public/icons/icon-{s}.png")
    save(tile(s, INK, crown, 0.5), f"public/icons/maskable-{s}.png")  # inside the 80% safe zone

save(tile(16, INK, crown, 0.78, radius=0.2), "public/icons/favicon-16.png")
save(tile(32, INK, crown, 0.78, radius=0.2), "public/icons/favicon-32.png")
save(tile(150, INK, crown, 0.66), "public/icons/mstile-150.png")
