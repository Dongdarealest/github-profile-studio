#!/usr/bin/env python3
"""
GitHub Profile Studio — offline README generator.

No web, no account, no dependencies. One command in, one README.md out.

    python3 tools/generate.py --username YOUR_USERNAME
    python3 tools/generate.py --username octocat --name "The Octocat" \
        --theme ocean --color 38BDF8 \
        --lines "I build things; I break things; I fix them better" \
        --skills python,javascript,docker,git --out README.md

Everything dynamic (stats, streak, languages, activity) is rendered by free
public services at view time, from the username alone. The accent colour is
applied consistently to every block, which is the single detail that makes a
profile look designed instead of assembled.
"""
import argparse
import json
import os
import sys
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))


def load_theme(name, color_override=None):
    with open(os.path.join(HERE, "themes.json"), encoding="utf-8") as f:
        themes = json.load(f)
    if name not in themes:
        sys.exit(f"Unknown theme '{name}'. Choose one of: {', '.join(themes)}")
    t = dict(themes[name])
    if color_override:
        t["accent"] = color_override.lstrip("#").upper()
    return t


def build(username, name, theme, lines, skills, socials):
    t = theme
    bg, ac, tx = t["bg"], t["accent"], t["text"]
    q = urllib.parse.quote
    typing_lines = ";".join(q(l.replace(" ", "+")) for l in lines) if lines else ""
    out = []
    out.append(f"""<!-- Generated with GitHub Profile Studio — https://github.com/Dongdarealest/github-profile-studio -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color={t['capsuleGradient']}&height=210&section=header&text={q(name)}&fontSize=52&fontColor={tx}&animation=fadeIn&fontAlignY=36&desc=github.com/{username}&descAlignY=56&descSize=16" width="100%" alt="header" />
""")
    if typing_lines:
        out.append(f"""<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1100&color={ac}&center=true&vCenter=true&width=880&lines={typing_lines}" alt="typing" />
""")
    out.append(f"""
<img src="https://komarev.com/ghpvc/?username={username}&color={ac}&style=flat-square&label=Profile+views" alt="views" />

</div>

## About

- Building in public at [github.com/{username}](https://github.com/{username})
- Replace this line with what you are working on right now
- Replace this line with what you are learning

## Tech stack

<div align="center">
<img src="https://skillicons.dev/icons?i={','.join(skills)}&theme={t['skilliconsTheme']}&perline=8" alt="skills" />
</div>

## GitHub stats

<div align="center">
<img height="170" src="https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&include_all_commits=true&title_color={ac}&icon_color={ac}&text_color={tx}&bg_color={bg}&border_color={t['border']}&hide_border=false" alt="stats" />
<img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&langs_count=8&title_color={ac}&text_color={tx}&bg_color={bg}&border_color={t['border']}" alt="top languages" />
</div>

<div align="center">
<img src="https://streak-stats.demolab.com?user={username}&background={bg}&border={t['border']}&ring={ac}&fire={ac}&currStreakNum={tx}&sideNums={tx}&currStreakLabel={ac}&sideLabels={tx}&dates={tx}" alt="streak" />
</div>

<div align="center">
<img src="https://github-readme-activity-graph.vercel.app/graph?username={username}&bg_color={bg}&color={ac}&line={ac}&point={tx}&area=true&hide_border=true" width="100%" alt="activity graph" />
</div>
""")
    if socials:
        badges = []
        for s in socials:
            label, url = s.split(":", 1) if ":" in s else (s, "#")
            badges.append(
                f'<a href="{url}"><img src="https://img.shields.io/badge/{q(label)}-{ac}?style=for-the-badge&logoColor=white" alt="{label}" /></a>')
        out.append("\n## Connect\n\n<div align=\"center\">\n" + "\n".join(badges) + "\n</div>\n")
    out.append(f"""
<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color={t['capsuleGradient']}&height=110&section=footer" width="100%" alt="footer" />
</div>
""")
    return "".join(out)


def main():
    p = argparse.ArgumentParser(description="Generate a GitHub profile README")
    p.add_argument("--username", required=True)
    p.add_argument("--name", default=None, help="Display name (default: username)")
    p.add_argument("--theme", default="midnight-gold")
    p.add_argument("--color", default=None, help="Accent hex, with or without #, overrides the theme accent")
    p.add_argument("--lines", default="Developer;Open source builder;Always learning",
                   help="Typing lines, separated by ';'")
    p.add_argument("--skills", default="python,javascript,html,css,git,github,docker,linux")
    p.add_argument("--social", action="append", default=[], help="Label:https://url (repeatable)")
    p.add_argument("--out", default="README.generated.md")
    a = p.parse_args()
    theme = load_theme(a.theme, a.color)
    md = build(a.username, a.name or a.username, theme,
               [s.strip() for s in a.lines.split(";") if s.strip()],
               [s.strip() for s in a.skills.split(",") if s.strip()], a.social)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"Wrote {a.out} for @{a.username} (theme: {a.theme}, accent: #{theme['accent']})")


if __name__ == "__main__":
    main()
