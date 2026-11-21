# GitHub Profile Studio — Brand Identity

The identity of GitHub Profile Studio, in one page. Everything visual that
carries the Studio's name — the site, the README, launch posts, gallery
images — follows this guide. When in doubt: quieter, darker, one accent.

**The line:** *A profile that lives.*

---

## The mark

A gold crescent moon cradling a single four-point star, inside a thin gold
ring. It is drawn as exact vector geometry — no raster, no emoji, no effects.

### Construction

- Canvas: a 240 × 240 square; the ring is centred at (120, 120), radius 105.
- The crescent is one disc minus a second, offset disc: outer centre
  (110, 124) radius 60; cut centre (143, 101) radius 52. The crescent path is
  computed from the two circles' intersection points, so the horns are exact.
- The star is a four-point sparkle centred at (150, 94) in the crescent's
  opening: tip radius 16, waist radius 3.2, drawn with quadratic curves.
- Ring stroke: 6 units in the standard mark. The favicon variant
  (`favicon.svg`) uses a 13-unit ring, a slightly larger moon and a bolder
  star so the silhouette survives at 16 px.
- Clear space: at least the width of the ring's stroke × 4 on all sides.
  Minimum size: 16 px (favicon variant only); 24 px for the standard mark.

### Files

| Asset | Use |
|---|---|
| `logo-mark.svg` | The mark alone, Antique Gold on transparent. Default everywhere. |
| `logo-mark-mono.svg` | The mark in Bone, for single-colour or reversed contexts. |
| `wordmark.svg` | Mark + name, Bone text. For dark backgrounds (README header, site). |
| `wordmark-dark.svg` | Mark + name, Ink text. For light backgrounds only. |
| `wordmark-stacked.svg` | Mark above the name, centred. Square-ish slots, covers, avatars. |
| `favicon.svg` / `favicon-180.png` | Browser and touch icons. |
| `social-preview.png` | GitHub social preview (1280 × 640), set in repo Settings. |
| `product-hunt/` | Launch gallery (1270 × 760): sky hero, Profile Score, five looks. |

## Palette

| Name | Hex | Role |
|---|---|---|
| Ink | `#0D1117` | The background. All surfaces start here. |
| Bone | `#E6EDF3` | Primary text on Ink. |
| Antique Gold | `#A98B4F` | The only accent. The mark, key numbers, hairlines, one word per headline at most. |
| Sky Violet | `#6D5DF6` | **Inside sky artwork only.** Never in UI, text, logos or charts. |

Rules:

- One accent. If gold appears more than twice in a composition, remove one.
- No gradients in branding or UI chrome. Gradients live inside the sky
  artwork, nowhere else.
- Never place the gold mark on a mid-tone background; Ink or Bone only.
- User-chosen accent colours (Tokyo Night, Dracula, Emerald…) belong to
  users' profiles, never to the Studio's own branding. The Studio is gold.

## Type

- **Display / wordmark:** Georgia, serif. Headlines, the product name, the
  one-liner. Sentence case, no bold for the wordmark itself.
- **Body:** system sans (`-apple-system`, Segoe UI, Helvetica). Explanations,
  captions, UI labels.
- Numbers that matter (a score, a count) are set large in Georgia, in gold
  or Bone — never in a UI grey.

## Voice

Quiet, confident, specific. One idea per line. The product does the showing;
the words do the naming.

**Do**

- "A profile that lives."
- "Your last 90 days, painted as a night sky."
- "The creator of Linux scores 56. What's yours?"

**Don't**

- No exclamation marks, no "🚀", no "supercharge / unleash / game-changer".
- No feature lists in headlines — name the feeling, link to the details.
- No visible credit lines or watermarks in anything a user generates.

## Where each asset is used

- **README header:** `wordmark.svg` (centred) + the line, above the badges.
- **Repo social preview:** `social-preview.png` (Settings → Social preview).
- **Website:** mark in the top bar, `favicon.svg` as the site icon.
- **Launches:** `product-hunt/` gallery in order — sky, score, looks.
- **Everywhere else:** when a square logo is requested, send
  `wordmark-stacked.svg`; when an icon is requested, send `logo-mark.svg`.

---

*The identity is deliberately small: one mark, three colours, two typefaces,
one line. Consistency is the brand.*
