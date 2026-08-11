# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For a site rather than a
library, the versions are read as: **major** = a redesign, **minor** = a new section or
capability, **patch** = fixes and copy.

---

## [Unreleased]

Nothing yet. See [ROADMAP.md](ROADMAP.md) for what is queued.

---

## [1.0.0] — 2026-08-10

First public build. Everything below is new, so this entry is grouped by area rather than by
the usual Added/Changed/Fixed split.

### Foundation

- Vite 8 + React 19 + TypeScript project with `strict` type checking and a `@/*` path alias
  mirrored across `vite.config.ts` and `tsconfig.app.json`.
- Two runtime dependencies: `motion` for animation orchestration, `lenis` for smooth scrolling.
  No UI kit, no CSS framework, no icon package.
- Build splits `motion` and `react` into separate chunks so they download in parallel.
- `npm run check` runs typecheck and lint together.

### Design system

- Token layer (`src/styles/tokens.css`): two themes, one accent, a fluid type scale with
  hand-tuned display sizes, a spacing scale, and three shared easing curves.
- Dark and light themes resolved before first paint by an inline script in `index.html`, so
  there is no flash of the wrong theme.
- Typographic primitives (`.display`, `.headline`, `.label`, `.prose`) and layout primitives
  (`.shell`, `.grid12`, `.section`) in `base.css`. Every other rule belongs to exactly one
  component.
- Three type roles: Fraunces (display, variable `SOFT`/`WONK` axes), Inter Tight (UI),
  JetBrains Mono (metadata).

### Sections

- **Hero** — masked line reveals on load, an interactive canvas dot field, a live clock in the
  subject's timezone, and a parallax departure.
- **Index** — prose column on a slight counter-scroll beside four numbered principles.
- **Work** — rows that expand in place with `aria-expanded`/`aria-controls`; hovering a row
  floats that project's generative plate near the cursor with a velocity-derived lean.
- **Capabilities** — four disciplines with tools demoted to small type, and a marquee whose
  speed and direction are driven by scroll velocity.
- **Trajectory** — a timeline whose spine fills as it is read.
- **Contact** — the email address set at display size, with scramble-on-hover and
  click-to-copy that falls back to `mailto:` when the clipboard is unavailable.
- **Footer** — colophon, keyboard shortcuts, and the full name as the closing rule.

### Motion

- Mask-reveal system (`RevealText`, `Reveal`, `DrawRule`) as the single vocabulary for content
  arriving on screen.
- Preloader that counts real signals — `document.fonts.ready` and `window.load` — rather than
  faking a progress bar, with a 2.2 s hard ceiling.
- Magnetic hover applied through CSS custom properties so elements keep their own transform
  stack.
- Trailing cursor ring with `data-cursor` / `data-cursor-label` states, added alongside the
  native cursor rather than replacing it.
- Film grain, and a column grid overlay bound to `G`.

### Content

- All copy, projects, timeline, disciplines and links consolidated into
  `src/content/site.config.ts` with exported types (`Project`, `Discipline`, `TimelineEntry`)
  validated by `satisfies`.
- Project artwork generated from a seeded PRNG (`src/lib/rng.ts`, cyrb128 + sfc32) so a project
  always draws the same plate. No stock imagery anywhere in the project.

### Accessibility

- `prefers-reduced-motion` honoured throughout: Lenis is never constructed, the preloader is
  skipped, the canvas draws one static frame, the marquee stops and wraps, and all reveals
  render in their resting state.
- Split text exposes one clean string to assistive technology; animated spans are `aria-hidden`.
- Skip link, visible focus rings on every interactive element, and a mobile overlay menu so
  navigation exists below the 52 rem breakpoint where the inline links are hidden.
- Live regions on the copy-to-clipboard status and the theme toggle.

### Documentation

- `README.md`, `ROADMAP.md`, this changelog, and eight documents under `docs/`.

---

[Unreleased]: https://example.com/compare/v1.0.0...HEAD
[1.0.0]: https://example.com/releases/tag/v1.0.0
