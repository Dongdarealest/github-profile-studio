<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,50:1A1A1A,100:A98B4F&height=220&section=header&text=GitHub%20Profile%20Studio&fontSize=50&fontColor=F2EFE9&animation=fadeIn&fontAlignY=36&desc=A%20beautiful%20GitHub%20profile%20in%2060%20seconds%20—%20change%20the%20username,%20done&descAlignY=58&descSize=15" width="100%" alt="GitHub Profile Studio" />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=21&pause=1100&color=A98B4F&center=true&vCenter=true&width=880&lines=Type+your+username.+Pick+a+colour.+Copy.+Done.;Every+stat+updates+itself%2C+forever;One+accent+colour+everywhere+%3D+a+designed+profile" alt="typing" />

[![Stars](https://img.shields.io/github/stars/Dongdarealest/github-profile-studio?style=flat-square&color=A98B4F&labelColor=0D1117)](https://github.com/Dongdarealest/github-profile-studio/stargazers)
[![License](https://img.shields.io/badge/license-MIT-A98B4F?style=flat-square&labelColor=0D1117)](LICENSE)
[![Generator](https://img.shields.io/badge/try_the-web_generator-A98B4F?style=flat-square&labelColor=0D1117)](https://dongdarealest.github.io/github-profile-studio/)

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

## Use it in 60 seconds

**Option A — the web Studio (no files, no clone):**
open **[dongdarealest.github.io/github-profile-studio](https://dongdarealest.github.io/github-profile-studio/)**
and type **only your username**. The Studio reads your real GitHub — name, bio, languages,
most-starred repositories — and fills everything in. Then pick one of 12 style presets,
or mix your own layout from 22 independent blocks: take the header from one style, the
projects from another, the closer from a third. Reorder them, remove them, add more.
Copy the README. That is the whole workflow.

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
| Your own dynamic SVG API — banner, typing, live stats card, wave. No third party | [`api/`](api/) |
| Snake, Pac-Man + full metrics workflows for your profile repo | [`templates/workflows/`](templates/workflows/) |
| Agent-readable profile: `AGENTS.md` + `llms.txt` templates — the 2026 pattern no other kit ships | [`templates/agent/`](templates/agent/) |
| A worked example, generated for the author | [`examples/dongdarealest.md`](examples/dongdarealest.md) |

## See it working

This README is itself built from the kit's blocks, and so is the author's profile.
The example file shows the generator's raw output for a real account:

<div align="center">
<img height="170" src="https://github-readme-stats.vercel.app/api?username=Dongdarealest&show_icons=true&include_all_commits=true&title_color=A98B4F&icon_color=A98B4F&text_color=E6EDF3&bg_color=0D1117&border_color=30363D" alt="Dongdarealest stats" />
<img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Dongdarealest&layout=compact&langs_count=8&title_color=A98B4F&text_color=E6EDF3&bg_color=0D1117&border_color=30363D" alt="Dongdarealest languages" />
</div>

<div align="center">
<img src="https://streak-stats.demolab.com?user=Dongdarealest&background=0D1117&border=30363D&ring=A98B4F&fire=A98B4F&currStreakNum=E6EDF3&sideNums=E6EDF3&currStreakLabel=A98B4F&sideLabels=E6EDF3&dates=E6EDF3" alt="Dongdarealest streak" />
</div>

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
