# python3 scripts/favicon.py → favicon.svg (light/dark aware), favicon.ico, PNG icons, site.webmanifest
# Needs: pip install cairosvg pillow   (only to regenerate; the generated files are committed)
import io, json
import cairosvg
from PIL import Image

INK, LAV, PINK, TEXT, BG = '#46366a', '#cdbcff', '#ffd0e0', '#2a2040', '#fdf6ee'

def glyph(ink, fill, dot, txt, shadow=True, pad=0, bg=None, size=64):
    """lo-fi pastel tile: hard offset shadow, ink border, geometric 'P' and a pink spark."""
    sc = 1 + pad
    body = f'''<rect x="8" y="8" width="52" height="52" rx="15" fill="{ink}"/>''' if shadow else ''
    return body + f'''<rect x="4" y="4" width="52" height="52" rx="15" fill="{fill}" stroke="{ink}" stroke-width="4"/>
<path d="M23.500 43V19.500H33a8.500 8.500 0 0 1 0 17H23.500" fill="none" stroke="{txt}" stroke-width="6.500" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="45.500" cy="16.500" r="4.200" fill="{dot}" stroke="{ink}" stroke-width="2.500"/>'''

def svg(inner, vb='0 0 64 64', extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="64" height="64">{extra}{inner}</svg>'

light = glyph(INK, LAV, PINK, TEXT)
# adaptive favicon: browsers that honour prefers-color-scheme inside SVG icons get the dark palette
adaptive = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<title>PsyScripts</title>
<style>.s{{fill:{INK}}}.t{{fill:{LAV};stroke:{INK}}}.p{{stroke:{TEXT}}}.d{{fill:{PINK};stroke:{INK}}}
@media (prefers-color-scheme:dark){{.s{{fill:#c9b9fa}}.t{{fill:#c4b0ff;stroke:#1b1729}}.p{{stroke:#1f1540}}.d{{fill:#ffb3cf;stroke:#1b1729}}}}</style>
<rect class="s" x="8" y="8" width="52" height="52" rx="15"/>
<rect class="t" x="4" y="4" width="52" height="52" rx="15" stroke-width="4"/>
<path class="p" d="M23.500 43V19.500H33a8.500 8.500 0 0 1 0 17H23.500" fill="none" stroke-width="6.500" stroke-linecap="round" stroke-linejoin="round"/>
<circle class="d" cx="45.500" cy="16.500" r="4.200" stroke-width="2.500"/>
</svg>
'''
open('favicon.svg', 'w', encoding='utf-8').write(adaptive)

def png(svg_text, size):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg_text.encode(), output_width=size, output_height=size))).convert('RGBA')

tile = svg(light)
for n in (16, 32, 48):
    png(tile, n).save(f'favicon-{n}x{n}.png', optimize=True)
png(tile, 48).save('favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
# 'any' icons keep transparency; the tile only fills ~87% of the canvas because of the hard shadow, so crop the canvas to it
def fit(n, bg=None, scale=1.0):
    big = png(tile, 1024)
    box = big.getbbox()
    big = big.crop(box)
    s = int(n * scale)
    big = big.resize((s, s), Image.LANCZOS)
    out = Image.new('RGBA', (n, n), bg or (0, 0, 0, 0))
    out.paste(big, ((n - s) // 2, (n - s) // 2), big)
    return out
fit(192).save('icon-192.png', optimize=True)
fit(512).save('icon-512.png', optimize=True)
fit(180, bg=(253, 246, 238, 255), scale=0.82).convert('RGB').save('apple-touch-icon.png', optimize=True)
# maskable: full-bleed background, artwork inside the central 80% safe zone
fit(512, bg=(205, 188, 255, 255), scale=0.62).convert('RGB').save('icon-maskable-512.png', optimize=True)

json.dump({
    'name': 'PsyScripts', 'short_name': 'PsyScripts', 'description': 'Lightweight dependency-free scripts for web developers',
    'start_url': '/', 'scope': '/', 'display': 'standalone', 'background_color': BG, 'theme_color': BG, 'lang': 'ru',
    'icons': [
        {'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
        {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
        {'src': '/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
        {'src': '/favicon.svg', 'sizes': 'any', 'type': 'image/svg+xml', 'purpose': 'any'}
    ]}, open('site.webmanifest', 'w', encoding='utf-8'), indent=2)
print('favicon set written')
