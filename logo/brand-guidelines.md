# Shuru Korun — Brand Guidelines (v0.1)

## 1. The mark
A sprouting seed: a pear seed with a coral shine, an ink stem, a mint left leaf, and a blue right leaf. Each colour owns a job from the Hum palette (pear = start/action, mint = growth, blue = guide/links, coral = one loud moment, ink = structure).

- **Master (black)**: `logo/concept-a.svg` — one-colour, for any single-colour use.
- **Colour master**: `logo/concept-a-color.svg` — pear/mint/blue/coral/ink.
- **Clear space**: at least the seed's radius (≈ 1/6 of the mark width) on all sides.
- **Minimum size**: 16 px (use `logo/favicon.svg` simplified cut below 24 px).

## 2. Colour palette
| Role | Hex | Use |
|---|---|---|
| Ink | `#1a1a1f` | Seed base, stem, wordmark, body text |
| Pear | `#f7d21a` | Seed, primary action, highlighter |
| Mint | `#5ba32b` | Growth leaf, "verified" status |
| Blue | `#2563eb` | Guide leaf, links, focus ring |
| Coral | `#ff6165` | Shine accent, one loud moment |
| Cream | `#f7f5ec` | Paper ground |

## 3. Typography
- **Display/wordmark**: Chillax 600 (Fontshare). Tracking -0.03em.
- **Body**: Chillax 500.
- Max two families. No per-letter animation.

## 4. Lockups
- `logo/lockup-horizontal.svg` — symbol left, wordmark right (for headers, wide spaces).
- `logo/lockup-stacked.svg` — symbol above wordmark (for square contexts).
- `logo/wordmark` is text-based (Chillax `<text>`) — **must be converted to paths** before final delivery.

## 5. Variants (in `logo/variants/`)
- `shuru-korun-black.svg` — one-colour black.
- `shuru-korun-white.svg` — one-colour white (for dark grounds).
- `shuru-korun-mono-f7d21a.svg` — mono in pear.
- `shuru-korun-square.svg` — centred on 256×256 with padding.
- `shuru-korun-favicon.svg` — tight square for browser tabs.
- `shuru-korun-app-icon.svg` — mark on a rounded tile.

## 6. Small-size cut
`logo/favicon.svg` — simplified 64×64 drawing (fewer details, larger strokes) for 16–32 px. Use for favicons and app icons.

## 7. Do / don't
- Do keep the mark in one colour when reproduction is limited.
- Do keep the coral shine — it's the ownable detail.
- Don't redraw the leaves as perfect ellipses in a different style; the asymmetry is intentional.
- Don't place the mark on a busy background without a paper-2 well.
- Don't stretch or recolour individual parts.

## 8. Open items
- Wordmark `<text>` must be outlined to paths.
- PNG/icon set (`favicon.ico`, 16/32/48/180/192/512) needs a renderer (cairosvg/inkscape/chrome) — not generated here.
- Presentation board mockups not yet built (run `presentation_board.py` with an industry spec).
- Trademark clearance not performed — recommend a professional search.
- Font licence (Chillax via Fontshare) must be confirmed for logo use; outlines should be constructed.
