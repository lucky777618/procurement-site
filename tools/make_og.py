from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(r"C:\Users\Paco\DoubaoWork\chats\2026-11-10\new-chat\independent-site")
FONTS = ROOT / "assets" / "fonts"

W, H = 1200, 630
INK = (15, 26, 28)
GOLD = (217, 158, 38)
PAPER = (243, 244, 240)
SLATE = (140, 155, 152)

img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)

brand_font = ImageFont.truetype(str(FONTS / "archivo-700.woff2"), 96)
head_font = ImageFont.truetype(str(FONTS / "archivo-600.woff2"), 52)
mono_font = ImageFont.truetype(str(FONTS / "plexmono-400.woff2"), 26)

# gold rule
d.rectangle([80, 96, 80 + 96, 96 + 6], fill=GOLD)

d.text((80, 150), "Lucky7Link", font=brand_font, fill=PAPER)

lines = ["Sourcing, inspection and", "consolidation from Dongguan."]
y = 300
for line in lines:
    d.text((80, y), line, font=head_font, fill=(214, 222, 218))
    y += 70

d.text((80, H - 120), "lucky7link.com", font=mono_font, fill=GOLD)
d.text((80, H - 78), "one desk · one shipment · one invoice", font=mono_font, fill=SLATE)

# right side: simple container-stack mark
x0, y0 = 880, 360
for i in range(3):
    d.rectangle([x0, y0 - i * 68, x0 + 220, y0 - i * 68 + 56], outline=SLATE, width=3)

out = ROOT / "assets" / "img"
out.mkdir(parents=True, exist_ok=True)
img.save(out / "og-cover.png", optimize=True)
print("ok", (out / "og-cover.png").stat().st_size)
