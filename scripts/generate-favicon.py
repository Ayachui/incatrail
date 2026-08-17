"""Rebuild app/favicon.ico from app/icon.png.

Run from the repository root: python scripts/generate-favicon.py
Requires Pillow. The mark is zoomed in and sharpened for the small frames,
because the tab icon is what browsers pick from the .ico.
"""

from PIL import Image, ImageChops, ImageEnhance, ImageFilter

SRC = "app/icon.png"
OUT = "app/favicon.ico"
SIZES = [16, 32, 48, 64]
MARK_FILL = 0.90  # how much of the frame the mark should span

src = Image.open(SRC).convert("RGBA")
bg_colour = src.getpixel((0, 0))

# Alpha for the mark: it is light line-art over a near-black radial background,
# so distance from the darkest corner colour is a good soft matte.
diff = ImageChops.difference(
    src.convert("RGB"), Image.new("RGB", src.size, bg_colour[:3])
).convert("L")
lo, hi = 18, 120
matte = diff.point(lambda v: 0 if v <= lo else min(255, int((v - lo) * 255 / (hi - lo))))

mark_box = diff.point(lambda v: 255 if v > 40 else 0).getbbox()
cx = (mark_box[0] + mark_box[2]) / 2
cy = (mark_box[1] + mark_box[3]) / 2
side = max(mark_box[2] - mark_box[0], mark_box[3] - mark_box[1])
square = (
    round(cx - side / 2),
    round(cy - side / 2),
    round(cx + side / 2),
    round(cy + side / 2),
)

mark = src.copy()
mark.putalpha(matte)
mark = mark.crop(square)

# Soft glow backdrop keeps the deep obsidian/amethyst look without the ghost of
# the mark bleeding through at small sizes.
backdrop = src.filter(ImageFilter.GaussianBlur(70))

frames = []
for size in SIZES:
    frame = backdrop.resize((size, size), Image.LANCZOS).convert("RGBA")
    inner = max(1, round(size * MARK_FILL))
    layer = mark.resize((inner, inner), Image.LANCZOS)
    offset = ((size - inner) // 2, (size - inner) // 2)
    frame.alpha_composite(layer, offset)

    if size <= 32:
        frame = frame.filter(ImageFilter.UnsharpMask(radius=1, percent=110, threshold=0))
        frame = ImageEnhance.Contrast(frame).enhance(1.12)
        frame = ImageEnhance.Brightness(frame).enhance(1.08)

    frames.append(frame)

frames[-1].save(
    OUT,
    format="ICO",
    sizes=[(s, s) for s in SIZES],
    append_images=frames[:-1],
)
print(f"wrote {OUT}: {', '.join(f'{s}x{s}' for s in SIZES)}")
