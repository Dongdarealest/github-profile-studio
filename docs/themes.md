# Themes

Ten palettes, one rule: **one accent everywhere.** A profile looks designed when the
banner, the stats, the streak ring, the badges and the graph all share a single accent
hex. It looks assembled when each widget keeps its own default colours.

| Theme | Background | Accent | Text | Border | Best for |
| --- | --- | --- | --- | --- | --- |
| Midnight Gold | `0D1117` | `A98B4F` | `E6EDF3` | `30363D` | Dark, quiet, luxurious |
| Tokyo Night | `1A1B27` | `70A5FD` | `C0CAF5` | `292E42` | Blue neon city |
| Dracula | `282A36` | `BD93F9` | `F8F8F2` | `44475A` | Purple night |
| Ocean | `0F2027` | `38BDF8` | `E0F2FE` | `203A43` | Deep sea |
| Emerald | `0B1D17` | `34D399` | `D1FAE5` | `134E3A` | Calm green |
| Sunset | `201016` | `FB7185` | `FFE4E6` | `4C1D2F` | Warm rose and amber |
| Rose Gold | `191013` | `DCA7A0` | `FBE9E7` | `3F2A2E` | Warm luxury |
| Nord | `2E3440` | `88C0D0` | `ECEFF4` | `3B4252` | Arctic, calm, professional |
| Pastel | `FFF7ED` | `EC4899` | `374151` | `FED7AA` | Light and friendly |
| Paper | `FFFFFF` | `111827` | `111827` | `E5E7EB` | Editorial black on white |

## Bring your own colour

Any hex works. In the [web generator](https://dongdarealest.github.io/github-profile-studio/)
type it into the colour field (or use the picker) and every block is rebuilt with it.
On the command line:

```bash
python3 tools/generate.py --username YOUR_USERNAME --color FF5500
```

In a copied template, find-replace the theme's accent hex with yours — it appears in
every URL on purpose, so one replace re-skins the whole profile.

## Contrast, briefly

- Accent on a dark background: keep it bright enough to read at small sizes (gold, sky, mint all pass on `0D1117`).
- Text colour should be near-white on dark themes, near-black on light ones.
- If a gradient banner ends in your accent, let the stats card stay solid. One loud element per screen.
