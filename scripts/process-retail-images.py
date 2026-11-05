"""Normalise product photos in public/retail/ to uniform square canvases.

For each *.jpg: trims near-white/empty borders, then fits the product into a
512x512 white canvas with even padding. Cards render thumbs at 36x36 with
object-cover, so a padded, centred square guarantees no accidental cropping.

Usage: python scripts/process-retail-images.py
"""
from __future__ import annotations

import pathlib
from concurrent.futures import ThreadPoolExecutor, as_completed

from PIL import Image, ImageChops

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "public" / "retail"
SIZE = 512
PAD = 24  # px inside the canvas
TRIM_TOL = 12  # gray-distance from white treated as "background"


def _trim_bbox(img: Image.Image, tol: int) -> tuple:
    """Bounding box of content that differs from pure white by > tol."""
    white = Image.new("RGB", img.size, (255, 255, 255))
    diff = ImageChops.difference(img.convert("RGB"), white)
    return diff.point(lambda p: 255 if p > tol else 0).getbbox()


def process_one(path: pathlib.Path) -> bool:
    try:
        img = Image.open(path)
        img.load()
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
            bg.alpha_composite(img)
            img = bg.convert("RGB")
        else:
            img = img.convert("RGB")

        bbox = _trim_bbox(img, TRIM_TOL)
        if bbox and bbox != (0, 0, img.width, img.height) and (bbox[2] - bbox[0]) > 8 and (bbox[3] - bbox[1]) > 8:
            img = img.crop(bbox)

        max_side = SIZE - 2 * PAD
        scale = min(max_side / img.width, max_side / img.height)
        nw, nh = max(1, round(img.width * scale)), max(1, round(img.height * scale))
        if scale < 1 or (nw < img.width and nh < img.height):
            img = img.resize((nw, nh), Image.LANCZOS)

        canvas = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))
        canvas.paste(img, ((SIZE - nw) // 2, (SIZE - nh) // 2))
        canvas.save(path, "JPEG", quality=88, optimize=True)
        return True
    except Exception as exc:  # noqa: BLE001
        print(f"  !! {path.name}: {exc}")
        return False


def main() -> None:
    files = sorted(IMG_DIR.glob("*.jpg"))
    print(f"Processing {len(files)} images in {IMG_DIR}...")
    ok = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(process_one, f): f for f in files}
        for fut in as_completed(futures):
            if fut.result():
                ok += 1
    print(f"Done: {ok}/{len(files)} images normalised to {SIZE}x{SIZE} white canvases.")


if __name__ == "__main__":
    main()