# The 60-second guide

## 1. Make the special repository

GitHub shows a profile README from a public repository **named exactly like your
username**. Create it: `github.com/new`, name = your username, tick *Add a README file*.

## 2. Generate your README

Pick one of three doors — they all produce the same kind of file:

- **Web (easiest):** open the [generator](https://dongdarealest.github.io/github-profile-studio/),
  type your username, pick a theme or a colour, tick the sections you want, copy.
- **Template:** open any file in `templates/`, copy it, find-replace `YOUR_USERNAME`.
- **Command line:** `python3 tools/generate.py --username YOUR_USERNAME --theme ocean`

## 3. Paste and commit

Replace the README in your special repository with the generated file and commit.
Your profile updates immediately.

## 4. Finish the frame

The README is only the top of the page. Three free wins around it:

- **Bio:** one line, what you build. Not a job title list.
- **Pins:** pin up to 6 repositories. Give each a one-sentence description and topics in its *About* box.
- **Avatar:** one clear image, readable at 32 pixels.

## Troubleshooting

- **Stats card says "not found":** the username in the URL must match exactly, and the profile repository trick only works for a *public* repo with the *exact* username as its name.
- **A scheduled workflow stopped:** GitHub pauses scheduled workflows after 60 days without repository activity. Open the *Actions* tab and re-enable it.
- **Private contributions missing:** stats services see public data. In your contribution settings you can opt to show private contributions as anonymous counts.
- **Colours look inconsistent:** you missed a block. Search your README for the old hex and replace all — one accent everywhere is the whole trick.
- **Dark/light mismatch:** wrap an image in `<picture>` with `prefers-color-scheme` sources when a block ships two variants (the snake workflow does this out of the box).

## A note on reliability

Hosted widget services are free and occasionally sleep, rate-limit or pause — the
popular stats backend has had public-instance outages. Three defences, in order:

1. **Verify before you embed.** Open every new block's URL once; a 200 today is the entry ticket.
2. **Self-host the stats card.** Fork `anuraghazra/github-readme-stats`, deploy it on your own
   Vercel with a `PAT_1` token, and swap the host in your URLs — same parameters, your quota.
3. **Prefer Actions for the crown jewels.** Blocks rendered by an Action in your own repo
   (snake, Pac-Man, metrics, this kit's `api/` folder) have no third party at view time at all.
