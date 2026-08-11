# Portfolio

A single-page portfolio built as an editorial object rather than a template fill-in.
Hand-written CSS, a deliberate motion language, and one file that holds all the content.

**Stack** — Vite 8 · React 19 · TypeScript · [Motion](https://motion.dev) · [Lenis](https://lenis.darkroom.engineering)
**Runtime dependencies** — two. No UI kit, no CSS framework, no icon package.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # typecheck + production build → dist/
npm run preview      # serve the built output
npm run check        # typecheck + lint
```

Node 20.19+ or 22.12+ is required (Vite 8). This project was built and verified on Node 24.

---

## Make it yours

Everything a visitor reads lives in **[`src/content/site.config.ts`](src/content/site.config.ts)**.
Nothing else needs editing to publish your own version.

1. **Identity** — `name`, `monogram`, `role`, `headline`, `location`, `timezone`, `email`.
2. **Projects** — replace the four sample entries. They are marked `SAMPLE DATA` in the file;
   they exist to exercise every layout state (long title, missing link, in-progress, archived).
3. **Timeline, disciplines, links** — same idea.
4. **Colours and type** — [`src/styles/tokens.css`](src/styles/tokens.css). Change `--accent` and
   the whole site follows.
5. **Fonts** — the `<link>` in [`index.html`](index.html). The three roles are display, UI, mono.

Full walkthrough: **[docs/content.md](docs/content.md)**.

> The sample projects describe work that does not exist. Replace them before you publish —
> a portfolio is a claim about what you have done.

---

## What's in here

| Section | What it does |
| --- | --- |
| Hero | Name as the object on the page. Interactive dot field on canvas. |
| Index | Prose plus four principles, on a slight counter-scroll. |
| Work | A list, not a card grid. Rows expand in place; hover floats a generative plate. |
| Capabilities | Four disciplines, tools demoted to small type. Scroll-driven marquee. |
| Trajectory | CV without CV formatting. The spine fills as you read. |
| Contact | The email set as large as the headline. Click to copy. |
| Footer | Colophon, shortcuts, and the name as the closing rule. |

**Keyboard** — `G` toggles the column grid, `T` toggles the theme, `Esc` closes things.

---

## Design position

Five decisions the whole thing hangs on. The reasoning is in
[docs/design-system.md](docs/design-system.md) and [docs/motion.md](docs/motion.md).

- **Text rises out of masks. It never fades in from nowhere.** A mask implies the text was
  always there and the page uncovered it, which is true; a fade implies it materialised.
- **Nothing casts a shadow.** Depth comes from hairlines, ground tones, and one accent.
- **No stock photography, ever.** Project artwork is generated from a seed
  ([`src/components/Plate.tsx`](src/components/Plate.tsx)) — deterministic, so the same project
  always draws the same plate.
- **One accent colour, used sparingly.** It marks index numbers, the live status, the
  full stop, and the current position. When everything is highlighted, nothing is.
- **Motion is explanation.** Every animation says where something came from or where it went.
  Decorative motion was cut.

---

## Accessibility

Not a checklist item — it changes the code in specific places.

- `prefers-reduced-motion` is handled in 14 files, including Lenis (never constructed),
  the preloader (skipped entirely), the canvas (drawn once, statically), and the marquee.
- Split text keeps one clean string for screen readers; the animated spans are `aria-hidden`.
- Every interactive element is a real `<button>` or `<a>` with a visible focus ring.
- The custom cursor is additive — the native cursor is never hidden.
- Expandable work rows use `aria-expanded` / `aria-controls`, and the whole site works
  without a pointer.

Details and the manual test pass: [docs/accessibility.md](docs/accessibility.md).

---

## Project layout

```
src/
├─ content/site.config.ts   ← all copy, all data
├─ styles/
│  ├─ tokens.css            ← colours, type scale, spacing, easing
│  └─ base.css              ← reset, typographic primitives, layout primitives
├─ lib/
│  ├─ hooks.ts              ← media queries, magnetic, scramble, clock, theme, keys
│  ├─ scroll.ts             ← Lenis lifecycle + scrollToId + lockScroll
│  └─ rng.ts                ← seeded PRNG for the generative plates
├─ components/              ← Nav, Cursor, Preloader, Reveal, Marquee, Plate, Chrome
├─ sections/                ← one file + one stylesheet per section
├─ App.tsx
└─ main.tsx
```

Each component owns its stylesheet and imports it directly. There is no global stylesheet
beyond tokens and base — if a rule is not in `tokens.css` or `base.css`, it belongs to exactly
one component.

More: [docs/architecture.md](docs/architecture.md).

---

## Performance

Current production build:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| CSS | 28.8 kB | 6.9 kB |
| App JS | 74.8 kB | 24.3 kB |
| Motion | 130.1 kB | 42.5 kB |
| React | 181.7 kB | 57.2 kB |
| **Total JS** | **387.5 kB** | **124.5 kB** |

Motion and React are split into their own chunks so they download in parallel. Motion is the
single largest line item and the main open optimisation — see
[docs/performance.md](docs/performance.md) and the `LazyMotion` item on the
[roadmap](ROADMAP.md).

---

## Documentation

| Document | Contents |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | How the code is organised and why |
| [docs/design-system.md](docs/design-system.md) | Tokens, type scale, grid, colour |
| [docs/motion.md](docs/motion.md) | The motion language, with timings |
| [docs/content.md](docs/content.md) | Editing every piece of copy |
| [docs/accessibility.md](docs/accessibility.md) | Commitments and how they are tested |
| [docs/performance.md](docs/performance.md) | Budgets, measurements, techniques |
| [docs/deployment.md](docs/deployment.md) | Shipping it |
| [docs/contributing.md](docs/contributing.md) | Conventions if someone else touches it |
| [ROADMAP.md](ROADMAP.md) | What is planned and what was deliberately declined |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## Licence

Code is MIT ([LICENSE](LICENSE)). The written content, the project descriptions, and the
personal identity in `site.config.ts` are not — replace them with your own.
