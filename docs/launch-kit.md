# Launch kit — everything ready to fire, in firing order

The product is the hook: **a free tool that scores your GitHub profile out of 100 and
fixes it in one click.** Every launch text below leads with the score, because scores
get clicked, shared and argued with. The builder is the second act.

## 1. The one asset to make first

A 20-second screen recording: type a famous username → score appears with the fixes →
one click publishes. Post it natively everywhere; do not link out in the first comment.

Usernames with interesting scores for demos (verified 2026-11-21):
`Dongdarealest` 74 · `torvalds` 56. The fact that Linus scores 56 is the headline:
*"The creator of Linux scores 56/100 on his own platform's profile rubric. What's yours?"*

## 2. dev.to launch essay (the Glassfolio playbook: fear + honesty)

**Title:** Your GitHub profile widgets will break. Mine did. So I built a studio that scores, builds and publishes your profile in one click.

**Tags:** github, opensource, webdev, beginners

**Draft body:**

> Last month a stats card on my profile showed "Something went wrong" for a week.
> The service was fine; the public instance was rate-limited. My profile — the page
> recruiters actually open — was advertising an error message.
>
> So I asked a different question: what would a profile tool look like if it treated
> your profile as a product, not a form?
>
> **GitHub Profile Studio** (free, MIT, no sign-up):
>
> 1. **It scores you first.** Type only your username. Before any decoration, it audits
>    your account out of 100 — profile README, bio, repo descriptions, recent activity —
>    and lists the exact fixes. (For the record: torvalds scores 56. I score 74.
>    The rubric is in the repo; argue with it there.)
> 2. **It fills everything in.** Name, bio, languages detected from your repos, your
>    most-starred projects. There is almost nothing to type. A "write it for me" button
>    drafts your lines in three tones from your real data.
> 3. **You compose, not configure.** 30+ blocks from different styles — headers, cards,
>    a contribution snake, Pac-Man, a 3D city of your year, a live blog feed — mixed
>    and reordered freely, or start from 12 presets and a 10-template gallery.
> 4. **It publishes itself.** One click with a token that never leaves your browser tab:
>    the Studio creates your profile repo and commits the README and the workflows.
> 5. **Its own cards are hosted by the Studio** (`github-profile-studio-api.vercel.app`),
>    including a live score badge, so the core of your profile does not depend on a
>    stranger's uptime — and they switch with the viewer's light/dark mode.
> 6. **It writes your agent files too.** Every profile can ship `AGENTS.md` and
>    `llms.txt`, so AI tools describe you from facts you chose.
>
> Try it: https://dongdarealest.github.io/github-profile-studio/
> Repo: https://github.com/Dongdarealest/github-profile-studio
>
> Tell me your score in the comments. Lowest score gets a personal profile review.

## 3. Product Hunt

- **Name:** GitHub Profile Studio
- **Tagline:** Your GitHub profile, scored out of 100 — then built and published in one click
- **Description:** Type only your username. The Studio audits your GitHub profile
  (score /100 with concrete fixes), auto-fills your real data, lets you mix 30+ blocks
  or start from presets and a template gallery, then publishes straight to GitHub.
  Its own hosted cards and a live score badge keep your profile self-updating.
  Free, open source, no sign-up.
- **First comment (maker):** I built this after a broken widget sat on my own profile
  for a week. The score came first: decoration is easy, knowing what is actually
  leaking visitors is the hard part. torvalds scores 56 on the rubric — check yours
  and tell me where the rubric is wrong.

## 4. Short posts

**X / Threads:**
> I scored GitHub profiles out of 100.
> torvalds: 56. Mine: 74.
> Then I built the tool that fixes the gaps and publishes the profile in one click.
> Free, no sign-up. What's your score? [link]

**Reddit r/github / r/webdev (Show-off Saturday rules permitting):**
Title: *I built a free tool that scores your GitHub profile /100 and then rebuilds it in one click*
Body: the dev.to draft, shortened by half, leading with the torvalds score and the
broken-widget story. End with: "The rubric is open in the repo — tell me what it
gets wrong."

**Hacker News (Show HN):**
Title: *Show HN: GitHub Profile Studio – score, build and publish your profile in one click*

## 5. Directory and list submissions (do these the same week)

- PR to `abhisheknaiidu/awesome-github-profile-readme` — add the Studio under
  "Tools" style sections if present, else the templates/resources area; one line,
  alphabetical order, follow their CONTRIBUTING exactly.
- PR to `emmabostian/developer-portfolios`? No — that is portfolios, not profiles. Skip.
- Submit to: `github-profile-readme` topic hubs, `uneed.best`, `peerlist.io` launch,
  `betalist` (long lead, optional), Indie Hackers product page.
- dev.to is the SEO engine afterwards: one guide per query variant ("how to add a
  snake to your GitHub profile", "GitHub profile score", "best GitHub profile README
  templates 2026") each ending at the Studio.

## 6. In-product loops already live (do not remove)

- The score badge links back to the Studio, and the Studio's own cards carry its
  domain in their URLs on every profile that uses them. (No visible credit line —
  users are decorating *their* profile, not advertising ours. The loop must be
  invisible or valuable: a badge they are proud of, a card that never breaks.)
- Showcase issue template: "Show us yours" — featured profiles go into the README,
  which gives users a reason to open the issue and others a reason to copy them.

## 7. Launch week checklist

- [ ] Record the 20-second demo video (famous username → score → publish)
- [ ] dev.to essay published, pinned on the repo's social preview
- [ ] Product Hunt scheduled (Tue–Thu, 00:01 PT)
- [ ] X post + Reddit post within the same 24h
- [ ] awesome-list PR opened
- [ ] Reply to every comment within the hour on launch day
- [ ] Add the first 5 showcase profiles to the README
