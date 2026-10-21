#!/usr/bin/env python3
"""Writes demo copies of the 3D icons into site/public/3d: same size, tiled "ziyara.vip demo" watermark clipped to the icon shape.
Originals live in assets-private/3d (gitignored, never published). The logo is copied as is: it is a brand mark, not part of the icon set."""
import shutil, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops

root = Path(__file__).resolve().parent.parent
src, out = root / 'assets-private/3d', root / 'site/public/3d'
USED = ['guide', 'hotel', 'kaaba', 'map', 'mosque', 'plane', 'tour360']
out.mkdir(parents=True, exist_ok=True)
shutil.copy(src / 'logo.png', out / 'logo.png')
font = ImageFont.load_default(size=11)
for n in USED:
    im = Image.open(src / f'{n}.png').convert('RGBA')
    w, h = im.size
    layer = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for y in range(0, h * 2, 26):
        for x in range(-40 + (y // 26 % 2) * 50, w * 2, 100):
            d.text((x, y), 'ziyara.vip demo', font=font, fill=(255, 255, 255, 190), stroke_width=1, stroke_fill=(0, 0, 0, 150))
    layer = layer.rotate(28, resample=Image.BICUBIC).crop((w // 2, h // 2, w // 2 + w, h // 2 + h))
    layer.putalpha(ImageChops.multiply(layer.getchannel('A'), im.getchannel('A')))
    im.alpha_composite(layer)
    im.save(out / f'{n}.png', optimize=True)
print('demo icons written:', len(USED))
