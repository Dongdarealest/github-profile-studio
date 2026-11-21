<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,50:1A1A1A,100:A98B4F&height=220&section=header&text=GitHub%20Profile%20Studio&fontSize=50&fontColor=F2EFE9&animation=fadeIn&fontAlignY=36&desc=A%20beautiful%20GitHub%20profile%20in%2060%20seconds%20—%20change%20the%20username,%20done&descAlignY=58&descSize=15" width="100%" alt="GitHub Profile Studio" />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=21&pause=1100&color=A98B4F&center=true&vCenter=true&width=880&lines=Type+your+username.+Pick+a+colour.+Copy.+Done.;Every+stat+updates+itself%2C+forever;One+accent+colour+everywhere+%3D+a+designed+profile" alt="typing" />

[![Stars](https://img.shields.io/github/stars/Dongdarealest/github-profile-studio?style=flat-square&color=A98B4F&labelColor=0D1117)](https://github.com/Dongdarealest/github-profile-studio/stargazers)
[![License](https://img.shields.io/badge/license-MIT-A98B4F?style=flat-square&labelColor=0D1117)](LICENSE)
[![Generator](https://img.shields.io/badge/try_the-web_generator-A98B4F?style=flat-square&labelColor=0D1117)](https://dongdarealest.github.io/github-profile-studio/)

</div>


<div align="center">

**First, get scored.** The Studio audits any GitHub profile out of 100 — README, bio, repo descriptions, recent activity — and lists the exact fixes. This is the maker's own live score:

<a href="https://dongdarealest.github.io/github-profile-studio/"><img src="https://github-profile-studio-api.vercel.app/api/score?username=Dongdarealest" alt="Profile score" /></a>
<img src="https://github-profile-studio-api.vercel.app/api/card?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" alt="Live stats card, served by the Studio's own API" />

<sub>(For the record: torvalds scores 56. The rubric is open — argue with it in the issues.)</sub>

</div>

## Designs, rendered live

Everything below is a real render from a real account — change the username in any URL and it becomes yours. On the [web Studio](https://dongdarealest.github.io/github-profile-studio/) all twelve designs re-render with *your* data the moment you type your username.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=transparent&height=120&text=Gallery%20Luxury&fontSize=44&fontColor=A98B4F" alt="Gallery Luxury" />
<img src="https://github-profile-studio-api.vercel.app/api/stats?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" height="200" alt="The Studio's own stats card" />
<img src="https://github-profile-studio-api.vercel.app/api/streak?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" height="200" alt="The Studio's own streak card" />
</div>

**Your GitHub profile is your portfolio, your résumé and your first impression — all in one page.**
This kit makes that page beautiful in about 60 seconds, even if you have never written a line of Markdown.

## The problem this solves

Most profile README guides hand you forty widgets from forty services, each with its
own default colours, and leave you to assemble something that looks assembled.
This kit is built around three simple ideas:

1. **The username is the only required input.** Every stat, graph and card below is
   generated at view time from a username in a URL. Change the username, the whole
   profile becomes yours.
2. **One accent colour, everywhere.** Type one hex code and every block — banner,
   stats, streak, graph, badges — is re-skinned with it. That single consistency is
   the difference between *designed* and *decorated*.
3. **Text is a parameter too.** The typing lines, the banner name, the tagline all
   live in the URL. Edit the words, the image follows.

## The signature: Your Sky

Every kit can paste charts. The Studio paints one thing nobody else has:
**your last 90 days of work as a night sky** — every push a star, your best
repositories drawn as named constellations. No two skies are alike, and yours
is rendered by the Studio's own API:

<div align="center">
<img src="https://github-profile-studio-api.vercel.app/api/sky?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" width="100%" alt="Your Sky — the author's last 90 days as a night sky" />
</div>

Yours is one word away: change `Dongdarealest` in that URL to your username.

## Why this one, when profile generators already exist?

Most generators hand you one fixed frame and a form. This Studio is built differently:

- **Username only.** It reads your real GitHub (name, bio, languages, best repos) and fills
  everything in. There is almost nothing to type.
- **A profile score, with the fixes.** Before you decorate anything, the Studio audits your
  account out of 100 and tells you exactly what is leaking visitors: missing bio, repos
  without descriptions, a cold activity graph — each with the concrete fix.
- **Mix and match, not one frame.** 22 independent blocks from different styles; take the
  header from one, the projects from another, reorder freely. Plus 12 style presets and the
  full 10 template gallery, all on the web.
- **One-click publish.** Paste a fine-grained token you create (used only in your browser
  tab, sent only to api.github.com, never stored) and the Studio creates your profile
  repository and commits the README, the animation workflows and the agent files for you.
- **Honest preview.** Desktop at GitHub's real 896px width, or mobile at 390px.
- **Agent-ready.** Ships `AGENTS.md` and `llms.txt` profile templates, so AI tools describe
  you from facts you wrote.
- **Yours to run.** MIT licensed, a static page, an offline CLI, and an SVG API in `api/`
  that is also hosted for everyone at `github-profile-studio-api.vercel.app` — the Studio's
  own banner, typing, card and wave blocks never depend on a stranger's uptime.

## Use it in 60 seconds

**Option A — the web Studio (no files, no clone):**
open **[dongdarealest.github.io/github-profile-studio](https://dongdarealest.github.io/github-profile-studio/)**.

1. Type **only your username**, press *Build my profile* — your data is fetched and your
   profile is scored, with the fixes listed.
2. Pick a style preset, a complete template from the gallery, or mix your own blocks.
3. Copy the README — or use the one-click Publish button and skip the manual steps entirely.

**Option B — a template:** copy any file from [`templates/`](templates/),
find-replace `YOUR_USERNAME`, paste it into your profile repository.

**Option C — the command line:**

```bash
python3 tools/generate.py --username YOUR_USERNAME --theme ocean
python3 tools/generate.py --username YOUR_USERNAME --color FF5500 --name "Your Name"
```

Then: create a public repository named **exactly like your username**, paste the
README in, commit. Full walkthrough: [`docs/guide.md`](docs/guide.md).

## What you get

| Piece | Where |
| --- | --- |
| Web Studio: username-only auto-fill from the GitHub API, 12 style presets, 22 mix-and-match blocks, 10 themes, custom hex colour, live preview | [`docs/index.html`](docs/index.html) · [live](https://dongdarealest.github.io/github-profile-studio/) |
| 10 ready templates: Minimal, Dark Luxury, Neon Cyber, Pastel Soft, Terminal, Gallery, Hire Me, Maintainer, Student, Creative | [`templates/`](templates/) |
| Block library: 30 copy-paste blocks with every colour parameter explained | [`docs/blocks.md`](docs/blocks.md) |
| Pro tips: the 10 rules behind profiles that get followed | [`docs/pro-tips.md`](docs/pro-tips.md) |
| 10 curated themes + bring-your-own-colour rules | [`docs/themes.md`](docs/themes.md) |
| Offline CLI generator (Python, zero dependencies) | [`tools/generate.py`](tools/generate.py) |
| Your own dynamic SVG API — banner, typing, stats, languages, streak, pins, activity graph, score badge, wave. No third party | [`api/`](api/) |
| Snake, Pac-Man + full metrics workflows for your profile repo | [`templates/workflows/`](templates/workflows/) |
| Agent-readable profile: `AGENTS.md` + `llms.txt` templates — the 2026 pattern no other kit ships | [`templates/agent/`](templates/agent/) |
| A worked example, generated for the author | [`examples/dongdarealest.md`](examples/dongdarealest.md) |

## See it working

This README is itself built from the kit's blocks, and so is the author's profile.
The cards below are the Studio's own — stats, languages, streak, pins and activity,
drawn by its API from a real account:

<div align="center">
<img height="218" src="https://github-profile-studio-api.vercel.app/api/stats?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" alt="Dongdarealest stats — drawn by the Studio's own API" />
<img height="218" src="https://github-profile-studio-api.vercel.app/api/langs?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" alt="Dongdarealest languages — drawn by the Studio's own API" />
</div>

<div align="center">
<img src="https://github-profile-studio-api.vercel.app/api/streak?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" alt="Dongdarealest streak — drawn by the Studio's own API" />
<img src="https://github-profile-studio-api.vercel.app/api/pin?username=Dongdarealest&repo=TubeEQ&color=A98B4F&bg=0D1117&text=E6EDF3" alt="A Studio pin card" />
</div>

<div align="center">
<img src="https://github-profile-studio-api.vercel.app/api/graph?username=Dongdarealest&color=A98B4F&bg=0D1117&text=E6EDF3" width="100%" alt="Dongdarealest push activity — drawn by the Studio's own API" />
</div>

Every card above is drawn by **the Studio's own API** — one design system, one host, no third-party widgets.

Every image above becomes yours by changing one word in its URL: `Dongdarealest` → your username.

## Themes at a glance

**Midnight Gold** `A98B4F` · **Tokyo Night** `70A5FD` · **Dracula** `BD93F9` ·
**Ocean** `38BDF8` · **Emerald** `34D399` · **Sunset** `FB7185` ·
**Rose Gold** `DCA7A0` · **Nord** `88C0D0` · **Pastel** `EC4899` · **Paper** `111827` — or any hex you bring.
Palettes and contrast notes: [`docs/themes.md`](docs/themes.md).

## Credits and honesty

The kit stands on excellent free services: capsule-render, readme-typing-svg,
github-readme-stats, streak-stats, github-readme-activity-graph, skillicons,
shields.io, komarev, github-profile-trophy and github-profile-summary-cards,
plus the Platane/snk and lowlighter/metrics Actions. The `api/` folder exists for
anyone who would rather self-host the core images than depend on third parties.

## Show us yours

Built a profile with the Studio? Open a
[showcase issue](https://github.com/Dongdarealest/github-profile-studio/issues/new/choose)
with your profile link. The best ones get featured in a gallery here — which is also
the fastest way for new developers to discover what is possible.

## Contributing

New themes, new templates and new blocks are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md).
The bar is simple: a contribution must work by changing only a username, a colour, or a line of text.

If this kit made your profile prettier, a star helps the next developer find it. That is the whole pitch.

## License

MIT. Take it, re-skin it, ship your profile.
