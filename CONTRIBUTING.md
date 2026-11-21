# Contributing

Welcome. The bar for every contribution is the project's one rule:

> **It must work by changing only a username, a colour, or a line of text.**
> If a user needs an account, a token or a build step to use your block, it does not belong here yet.

## Add a theme

1. Add the palette to `tools/themes.json` and to the `THEMES` object in `docs/index.html` (same key in both).
2. Add a row to `docs/themes.md`.
3. Check contrast: accent readable on its background at small sizes, text near-white on dark and near-black on light.

## Add a template

1. One file in `templates/`, named `NN-style-name.md`.
2. Use `YOUR_USERNAME` for every username and keep exactly one accent hex throughout, so one find-replace re-skins it.
3. Start the file with an HTML comment saying what to replace.
4. It must render with zero setup beyond the paste.

## Add a block

Add it to `docs/blocks.md` with the snippet, a parameter table, and a note on any
surprise (for example, streak-stats takes `user=`, not `username=`).

## Style

- English, plain and short. No hype words.
- Colours always as hex without `#` inside URLs, with `#` in prose.
- Test your snippet with a real username before opening the PR.
