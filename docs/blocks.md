# Block library

Every block is one copy-paste snippet. The rule that makes them look like one design:
**use the same accent hex in every block.** Replace `YOUR_USERNAME` and `A98B4F`
(the example accent, old gold) with yours.

## 1. Animated header banner — capsule-render

```md
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,50:1A1A1A,100:A98B4F&height=210&section=header&text=Your%20Name&fontSize=52&fontColor=F2EFE9&animation=fadeIn" width="100%" />
```

| Parameter | What it does |
| --- | --- |
| `type` | `waving`, `venom`, `shark`, `cylinder`, `rect`, `soft`, `slice`, `transparent` |
| `color` | One hex, or a gradient: `angle:start,mid,end` as `0:0D1117,50:1A1A1A,100:A98B4F` |
| `text`, `fontSize`, `fontColor` | Your name, its size, its colour |
| `section` | `header` or `footer` (footer flips the wave) |

## 2. Typing animation — readme-typing-svg

```md
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1100&color=A98B4F&center=true&width=880&lines=First+line;Second+line;Third+line" />
```

The text is the parameter: `lines` separated by `;`, spaces as `+`. `color` is any hex.

## 3. Stats card — github-readme-stats

```md
<img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&title_color=A98B4F&icon_color=A98B4F&text_color=E6EDF3&bg_color=0D1117&border_color=30363D" />
```

Every colour is a parameter: `title_color`, `icon_color`, `text_color`, `bg_color`
(solid hex or gradient `angle,start,end`), `border_color`. Or pick a built-in
`theme=` (`tokyonight`, `dracula`, `radical`, `ocean_dark`, ...) and override single colours on top.

## 4. Top languages

```md
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&langs_count=8&title_color=A98B4F&text_color=E6EDF3&bg_color=0D1117" />
```

`layout=compact` or `donut`, `langs_count` 1–10, `hide=html,css` to drop languages.

## 5. Streak — streak-stats

```md
<img src="https://streak-stats.demolab.com?user=YOUR_USERNAME&background=0D1117&ring=A98B4F&fire=A98B4F&currStreakLabel=A98B4F" />
```

Note: this service takes `user=`, not `username=`. Colour parameters: `background`,
`border`, `stroke`, `ring`, `fire`, `currStreakNum`, `sideNums`, `currStreakLabel`,
`sideLabels`, `dates`.

## 6. Activity graph

```md
<img src="https://github-readme-activity-graph.vercel.app/graph?username=YOUR_USERNAME&bg_color=0D1117&color=A98B4F&line=A98B4F&point=FFFFFF&area=true&hide_border=true" width="100%" />
```

## 7. Skill icons — skillicons

```md
<img src="https://skillicons.dev/icons?i=python,javascript,react,docker,git&theme=dark&perline=8" />
```

One URL, comma-separated skill ids, `theme=dark` or `light`. Full id list: skillicons.dev.

## 8. Badges — shields.io

```md
![Python](https://img.shields.io/badge/Python-A98B4F?style=for-the-badge&logo=python&logoColor=white)
```

The colour is in the path itself: `badge/LABEL-HEX`. Styles: `flat`, `flat-square`,
`for-the-badge`, `plastic`, `social`. Any logo from simple-icons via `logo=`.

## 9. Profile views counter

```md
<img src="https://komarev.com/ghpvc/?username=YOUR_USERNAME&color=A98B4F&style=flat-square&label=Profile+views" />
```

## 10. Trophies

```md
<img src="https://github-profile-trophy.vercel.app/?username=YOUR_USERNAME&theme=tokyonight&no-frame=true" />
```

## 11. Summary cards

```md
<img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=YOUR_USERNAME&theme=tokyo_night" />
```

Also `repos-per-language`, `most-commit-language`, `stats`, `productive-time`.

## 12. Pin cards for your best repos

```md
<a href="https://github.com/YOUR_USERNAME/REPO">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=YOUR_USERNAME&repo=REPO&title_color=A98B4F&text_color=E6EDF3&bg_color=0D1117&border_color=30363D" />
</a>
```

## 13. Snake eating your contribution graph

Needs a GitHub Action in your profile repo — see `templates/workflows/snake.yml`.
It regenerates daily and serves a light and a dark variant through `<picture>`.

## 14. Full metrics dashboard — lowlighter/metrics

The heavy option: one Action (see `templates/workflows/metrics.yml`) renders a
complete dashboard image — calendar, languages, achievements, habits — and
commits it back. No external service at view time.

## 15. This project's own SVG API

Self-hosted, no third party at all. Deploy the `api/` folder on Vercel, then:

```md
<img src="https://YOUR-DEPLOYMENT.vercel.app/api/banner?text=Your+Name&sub=github.com/YOUR_USERNAME&color=A98B4F&bg=0D1117" />
<img src="https://YOUR-DEPLOYMENT.vercel.app/api/typing?lines=Developer;Builder;Learner&color=A98B4F" />
<img src="https://YOUR-DEPLOYMENT.vercel.app/api/card?username=YOUR_USERNAME&color=A98B4F&bg=0D1117" />
<img src="https://YOUR-DEPLOYMENT.vercel.app/api/wave?color=A98B4F&bg=0D1117" />
```

`card` reads the public GitHub API live, so the username is genuinely the only input.

## 16. Now playing on Spotify

Needs the `novatorem/spotify-github-profile` service connected to your Spotify once;
after that it is a username-style image that always shows your current track.

```md
<img src="https://spotify-github-profile.kittinanx.com/api/view?uid=YOUR_SPOTIFY_UID&cover_image=true&theme=default&bar_color=A98B4F" />
```

## 17. Coding time — WakaTime

Connect WakaTime once, then:

```md
<img src="https://github-readme-stats.vercel.app/api/wakatime?username=YOUR_WAKATIME_USERNAME&title_color=A98B4F&text_color=E6EDF3&bg_color=0D1117&border_color=30363D" />
```

## 18. Latest blog posts, auto-updated

The `blog-post-workflow` Action rewrites a marked section of your README with your
newest posts from any RSS feed. Markers in the README:

```md
<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->
```

Workflow: `gautamkrishnar/blog-post-workflow@v1`, `feed_list: "https://yourblog.dev/rss.xml"`.

## 19. Recent GitHub activity, auto-updated

Same pattern, different Action (`jamesgeorge007/github-activity-readme@master`):

```md
<!--START_SECTION:activity-->
<!--END_SECTION:activity-->
```

## 20. LeetCode card

```md
<img src="https://leetcard.jacoblin.cool/YOUR_LEETCODE_USERNAME?theme=dark&font=Fira%20Code&ext=activity" />
```

## 21. Collapsible details — hide the long tail

Native HTML, no service. Perfect for "more about me", full skill lists, or a FAQ
that should not push your projects off the first screen.

```md
<details>
<summary><b>More about me</b></summary>
The long version lives here, one click away, invisible until wanted.
</details>
```

## 22. Follower and follow badges

```md
<img src="https://img.shields.io/github/followers/YOUR_USERNAME?style=flat-square&color=A98B4F&labelColor=0D1117&label=Followers" />
<img src="https://img.shields.io/github/stars/YOUR_USERNAME?style=flat-square&color=A98B4F&labelColor=0D1117&label=Total%20stars" />
```

## 23. A quote that rotates

```md
<img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" />
```

Use sparingly: a rotating quote is charming once, noise next to five other animations.

## 24. Sponsor / support button, done tastefully

One quiet line at the very bottom, never at the top:

```md
If my work saved you time: <a href="https://github.com/sponsors/YOUR_USERNAME">sponsor</a> · <a href="https://ko-fi.com/YOUR_HANDLE">ko-fi</a>
```

## 25. Light and dark variants with <picture>

When a block ships two versions (the snake does), serve each visitor the right one:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake.svg" />
  <img alt="contribution snake" src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake.svg" />
</picture>
```

## 26. Pac-Man eats your contribution graph

The most shared profile element of recent years: your graph becomes an arcade game.
Needs one Action in your profile repo — see `templates/workflows/pacman.yml` —
then embed both colour schemes:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/pacman-contribution-graph-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/pacman-contribution-graph.svg" />
  <img alt="Pac-Man contribution graph" src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/pacman-contribution-graph.svg" />
</picture>
```

## 27. Your year as a 3D city — isometric skyline

Pure URL, no Action, no token. Verified live at the time of writing; two independent services:

```md
<img src="https://gitcity.natrajx.in/api/svg?username=YOUR_USERNAME" alt="My year as a city" />
<img src="https://isometric-contributions-spectrewolf8.onrender.com/api/graph?username=YOUR_USERNAME&theme=dark&stats=true" alt="Isometric contributions" />
```

Themes on the second: `github`, `dark`, `light`, `neon`, `minimal`, `ocean`, plus `year=` and `width/height=`.
Young hosted services — if one ever sleeps, the self-hosted fallback is the 3D contribution Action (`yoshi389111/github-profile-3d-contrib`).

## 28. Discord live presence — Lanyard

Join the Lanyard Discord server once (that is how it reads your presence), then it is a URL.
`bg=` takes any hex, so it obeys the one-accent rule:

```md
<a href="https://discord.com/users/YOUR_DISCORD_ID"><img src="https://lanyard.cnrad.dev/api/YOUR_DISCORD_ID?theme=dark&bg=0D1117&borderRadius=10px&showDisplayName=true" alt="Discord presence" /></a>
```

## 29. A joke card in your colours

```md
<img src="https://readme-jokes.vercel.app/api?theme=dark&qColor=%23A98B4F&aColor=%23E6EDF3&borderColor=%2330363D" alt="A developer joke" />
```

Note the `%23` — inside this URL a hex colour needs its `#` encoded.

## 30. An agent-readable profile — AGENTS.md + llms.txt

The newest pattern in this kit, and the one nobody else ships yet: your README speaks to
humans, while two small files in the same repository speak to the AI agents and recruiter
tools that increasingly read profiles first — structured facts, plus rules for quoting you.
Copy `templates/agent/AGENTS.md` and `templates/agent/llms.txt`, edit the facts, and add
one line to your README:

```md
## For agents
This profile is agent-readable: see [AGENTS.md](./AGENTS.md) for structured facts, or [llms.txt](./llms.txt) for the short version.
```
