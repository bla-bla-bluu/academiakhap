#!/usr/bin/env python3
"""Generate one 1200x630 Open Graph card per article, into public/og/<slug>.png.

Every page previously shared /header.png as its og:image -- the brand banner, at a
4.1:1 aspect ratio social platforms letterbox or crop badly. That made every shared
link look identical and generic. These cards carry the article's own title.

Re-run after adding an article:  python3 scripts/generate_og_images.py
Requires Pillow.  Titles are read from src/data/articles.ts so this stays in sync.
"""
import os
import re
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "og")
ARTICLES_TS = os.path.join(ROOT, "src", "data", "articles.ts")
LOGO = os.path.join(ROOT, "public", "logo_clean.png")

W, H = 1200, 630
CREAM = (250, 246, 239)
BAND = (239, 228, 207)
INK = (58, 36, 21)
BROWN = (91, 52, 25)
GOLD = (139, 106, 67)

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def parse_articles():
    """Pull (slug, title, category) triples out of the articles registry."""
    src = open(ARTICLES_TS, encoding="utf-8").read()
    blocks = re.findall(
        r'title:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*category:\s*"([^"]*)",\s*\n\s*slug:\s*"([^"]*)"',
        src,
    )
    out = []
    for title, category, slug in blocks:
        out.append((slug.rstrip("/").split("/")[-1], title.replace('\\"', '"'), category))
    return out


def wrap(draw, text, fnt, max_width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def make_card(slug, title, category):
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, 18, H], fill=BROWN)                 # left spine
    d.rectangle([0, H - 96, W, H], fill=BAND)              # footer band
    d.line([(72, H - 96), (W - 72, H - 96)], fill=(179, 139, 89), width=2)

    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        logo.thumbnail((104, 104), Image.LANCZOS)
        img.paste(logo, (72, 56), logo)

    d.text((196, 74), "ACADEMIA KHAP", font=font(SERIF_BOLD, 30), fill=INK)
    d.text((197, 116), "R E S E A R C H   A R C H I V E", font=font(SERIF, 17), fill=GOLD)

    cat = category.upper()
    cf = font(SERIF_BOLD, 18)
    cw = d.textlength(cat, font=cf)
    d.rounded_rectangle([72, 196, 72 + cw + 44, 244], radius=24, fill=BROWN)
    d.text((94, 208), cat, font=cf, fill=(255, 255, 255))

    # Shrink the title until it fits the space above the footer.
    for size in (62, 56, 50, 45, 41, 37):
        tf = font(SERIF_BOLD, size)
        lines = wrap(d, title, tf, W - 144)
        lh = int(size * 1.24)
        if len(lines) * lh <= 250:
            break
    y = 288
    for line in lines[:5]:
        d.text((72, y), line, font=tf, fill=INK)
        y += lh

    d.text((72, H - 66), "academiakhap.org", font=font(SERIF, 25), fill=BROWN)

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"{slug}.png")
    img.save(path, "PNG", optimize=True)
    return path


def main():
    articles = parse_articles()
    if not articles:
        sys.exit("no articles parsed from src/data/articles.ts -- check the regex")
    for slug, title, category in articles:
        p = make_card(slug, title, category)
        print(f"  {os.path.getsize(p) // 1024:>4} KB  {os.path.relpath(p, ROOT)}")
    print(f"{len(articles)} cards written to public/og/")


if __name__ == "__main__":
    main()
