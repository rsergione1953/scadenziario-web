from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out_dir = Path(__file__).resolve().parent / "icons"
out_dir.mkdir(exist_ok=True)


def make_icon(size, output_name):
    img = Image.new("RGBA", (size, size), "#121218")
    d = ImageDraw.Draw(img)
    # dark rounded panel
    d.rounded_rectangle(
        (size * 0.12, size * 0.12, size * 0.88, size * 0.88),
        radius=int(size * 0.15),
        fill="#1F2937",
    )
    # top blue stripe
    d.rounded_rectangle(
        (size * 0.22, size * 0.18, size * 0.78, size * 0.24), radius=12, fill="#3B82F6"
    )
    # white calendar blocks
    for x in [size * 0.22, size * 0.38, size * 0.54, size * 0.70]:
        d.rounded_rectangle(
            (x, size * 0.36, x + size * 0.12, size * 0.52), radius=8, fill="#F8FAFC"
        )
    d.rounded_rectangle(
        (size * 0.28, size * 0.58, size * 0.72, size * 0.74), radius=14, fill="#F8FAFC"
    )
    # orange bottom accent
    d.rounded_rectangle(
        (size * 0.32, size * 0.76, size * 0.68, size * 0.82), radius=10, fill="#F59E0B"
    )
    # big G letter
    try:
        font = ImageFont.truetype("arial.ttf", int(size * 0.38))
    except Exception:
        font = ImageFont.load_default()
    text = "G"
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2
    y = (size - th) / 2 - size * 0.04
    d.text((x, y), text, font=font, fill="#F8FAFC")
    img.save(out_dir / output_name)


make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")
print("Created icons:")
for p in sorted(out_dir.glob("icon-*.png")):
    print(p.name, p.stat().st_size)
