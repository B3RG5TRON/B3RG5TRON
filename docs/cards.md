# How the profile README is built

The README is a set of SVG cards drawn by a script, because GitHub does not run CSS or JavaScript inside a README. Nothing in `README.md`, `README.pt-BR.md` or `cards/` is edited by hand.

| To change | Edit |
| --- | --- |
| Texts, links, experience, featured posts | `src/content.ts` |
| Colours, fonts, radius, motion | `design/tokens.json` |
| Layout of one card | `src/cards/` |
| Order of the cards in the README | `layout()` in `src/render.ts` |
| Which GitHub data cards appear | `show` in `src/content.ts` |
| Screens of the whistleblowing channel | `assets/canal-denuncias/` (800 x 600 WebP) |

Pinned repositories, contributions and languages come from the GitHub API and are saved in `data/github.json`.

## Commands

```bash
npm ci
GITHUB_TOKEN=<token> npm run fetch   # reads the public profile data (a token with no scopes is enough)
npm run cards                        # redraws cards/ and both READMEs
npm run typecheck
```

`.github/workflows/update-cards.yml` runs `npm run build` every day, on every push that touches the generator, and on demand from the Actions tab. It commits only when a card changed.

## Design notes

- Every card exists in two themes (`cards/dark`, `cards/light`) and two languages (`en`, `pt`). The README picks the theme with `<picture>` and `prefers-color-scheme`.
- Fonts are Inter and Geist Mono, subset to the characters each card uses and inlined, so the cards look the same on every device.
- The glass panels are drawn over a blurred field of light inside the same SVG. `backdrop-filter` is not available to an SVG shown through `<img>`.
- Only the hero is animated, once, on load. `prefers-reduced-motion` turns the animation off.
- The contribution, activity and language cards count public activity only. Each one can be switched on or off in `show`, in `src/content.ts`, and is skipped while `data/github.json` has no data for it.
