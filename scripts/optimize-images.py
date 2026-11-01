"""Build the light (WebP) versions of every photo + the gallery manifest.

Originals live in ../originals (not in git):
  originals/<category>/<photo>.jpg   -> gallery photos (shown in Collection)
  originals/_site/<path>             -> hero / about / cover photos
  originals/order.json               -> optional display order per category

Output:
  netanel_lewiin_final/public/img/...        light WebP versions (served by Vercel)
  netanel_lewiin_final/src/data/gallery.json list of photos per category

Usage:  python3 scripts/optimize-images.py
Only new/changed photos are re-encoded, so it's safe to rerun after adding photos.
"""

import json
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "originals")
SITE = os.path.join(ROOT, "netanel_lewiin_final")
OUT = os.path.join(SITE, "public", "img")
MANIFEST = os.path.join(SITE, "src", "data", "gallery.json")

GALLERY_WIDTH = 900  # masonry columns are ~450px wide, x2 for retina
SITE_WIDTH = 1920  # hero / full-width photos
QUALITY = 78
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def webp_name(name):
    return os.path.splitext(name)[0] + ".webp"


def convert(src, dst, max_width):
    """Encode src as WebP at dst; returns the (width, height) of the result."""
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        with Image.open(dst) as im:
            return im.size
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        if im.width > max_width:
            im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        return im.size


def main():
    if not os.path.isdir(SRC):
        sys.exit(f"originals folder not found: {SRC}")
    order_file = os.path.join(SRC, "order.json")
    order = json.load(open(order_file)) if os.path.exists(order_file) else {}

    manifest = {}
    for category in sorted(os.listdir(SRC)):
        folder = os.path.join(SRC, category)
        if not os.path.isdir(folder):
            continue
        is_site = category == "_site"
        files = []
        for dirpath, _, names in os.walk(folder):
            for n in names:
                if os.path.splitext(n)[1].lower() in EXTS:
                    files.append(os.path.relpath(os.path.join(dirpath, n), folder))
        known = order.get(category, [])
        files.sort(key=lambda f: (known.index(f) if f in known else len(known), f))

        entries = []
        for rel in files:
            out_rel = rel if is_site else os.path.join(category, rel)
            w, h = convert(
                os.path.join(folder, rel),
                os.path.join(OUT, webp_name(out_rel)),
                SITE_WIDTH if is_site else GALLERY_WIDTH,
            )
            entries.append({"file": rel, "w": w, "h": h})
        if not is_site:
            manifest[category] = entries
        print(f"{category}: {len(entries)} photos")

    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print("manifest ->", os.path.relpath(MANIFEST, ROOT))


if __name__ == "__main__":
    main()
