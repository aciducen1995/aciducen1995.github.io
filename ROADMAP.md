# Roadmap

Ordered by value, not by ease. Each item says what problem it solves — anything that could not
be written that way was cut and moved to [Declined](#declined).

Status: **✅ shipped** · **🔨 next** · **📋 planned** · **🧪 exploring**

---

## 1.0 — Foundation ✅

Shipped 2026-08-10. See [CHANGELOG.md](CHANGELOG.md).

- ✅ Editorial design system: tokens, fluid type scale, 12-column grid, two themes
- ✅ Motion language: mask reveals, scroll-driven marquee, magnetic hover, cursor trail
- ✅ Seven sections, all content driven from one config file
- ✅ Generative project plates — deterministic, no stock imagery
- ✅ `prefers-reduced-motion` honoured throughout, including Lenis and canvas
- ✅ Keyboard shortcuts (`G` grid, `T` theme, `Esc` close) and a mobile overlay menu
- ✅ Documentation set

---

## 1.1 — Weight and reach 🔨

**Problem:** 124 kB of gzipped JavaScript for a page with no application state. Motion alone is
42 kB of that, and most of its features are unused.

- 🔨 **Migrate to `LazyMotion` + `m` components.**
  Expected saving 15–20 kB gzip. The `domAnimation` feature bundle covers everything used here
  except layout animations, which the site does not use. Blocked on nothing — just work.
- 🔨 **Self-host the three typefaces.** Removes two DNS lookups and a render-blocking
  stylesheet from a third-party origin, and removes a privacy dependency on Google Fonts.
  Subset to Latin + the punctuation actually used. Expected LCP improvement 200–400 ms on
  cold cache.
- 📋 **`content-visibility: auto` on below-fold sections.** Cuts initial style and layout cost.
  Needs `contain-intrinsic-size` per section or the scrollbar will jump.
- 📋 **Real measurement.** Lighthouse CI in a GitHub Action, failing the build if LCP > 2.0 s
  or CLS > 0.02. Right now the budgets in [docs/performance.md](docs/performance.md) are
  asserted, not enforced.

---

## 1.2 — Depth on the work 📋

**Problem:** The expandable rows hold three paragraphs. Some projects deserve two thousand
words, and right now there is nowhere to put them.

- 📋 **Deep-linkable cases.** `?case=atlas` opens the row and scrolls to it, so a case can be
  shared. The `Project.id` field already exists for this. Uses the History API, not a router —
  adding a router to a one-page site is the wrong trade.
- 📋 **Long-form case pages.** Only if a case genuinely needs the room. A route split means
  code-splitting, which means the roadmap item above should land first.
- 📋 **Per-project accent.** Each case shifts `--accent` while open. Needs a contrast check
  per colour against both grounds; a token that fails AA in light mode is not shippable.
- 🧪 **Process artefacts.** Sketches, discarded directions, the version that did not work.
  This is the most interesting thing a portfolio can show and the hardest to do without it
  becoming filler.

---

## 1.3 — Reading it anywhere 📋

- 📋 **Print stylesheet.** People still print portfolios into PDFs to attach to applications.
  One column, hairlines to black, expanded work rows, URLs shown after links.
- 📋 **Open Graph image.** Generated at build time from the same `Plate` composer, so the
  share card is drawn from the same system as the site.
- 📋 **`prefers-contrast: more`.** Raise `--rule` and `--ink-muted` toward full contrast.
  Currently `--ink-faint` on `--paper` is the weakest pair on the site and is used only for
  non-essential metadata — acceptable, but not defensible under a contrast preference.
- 🧪 **A second theme beyond dark/light.** Probably a warm paper-and-ink print theme. Only if
  it earns its place; three themes is where token systems start to rot.

---

## 2.0 — Making it a system 🧪

Speculative. Each of these is a real project, not an afternoon.

- 🧪 **Writing section.** MDX, built at compile time, sharing the type scale. The reason to do
  it is that a portfolio of work plus a record of thinking is far more convincing than either
  alone. The reason not to is that an empty writing section is worse than no writing section.
- 🧪 **View Transitions between cases.** Now that the API has real cross-browser support, the
  plate could morph from list to detail. Must degrade cleanly — this is polish, not structure.
- 🧪 **WebGL hero.** The canvas dot field is deliberately 2D and cheap. A shader-based field
  would be more striking and cost a shader compile on the critical path. Currently not worth it.
- 🧪 **CMS.** Only if editing `site.config.ts` becomes a real friction. It has not.

---

## Declined

Recorded so they do not get re-proposed.

| Idea | Why not |
| --- | --- |
| Testimonial carousel | Unverifiable quotes from unnamed people persuade nobody. If someone will vouch by name with a link, it goes on the page as plain text. |
| Animated skill percentage bars | "React 92%" is not a measurement of anything. The disciplines section says what the skill is *for* instead. |
| Hit counter / "trusted by" logo wall | Borrowed credibility. The work is the credibility. |
| Chatbot or AI assistant | Nobody visiting a portfolio wants to interrogate a bot for information that fits on one page. |
| Auto-playing background video | Bandwidth cost, battery cost, accessibility cost, and it says nothing. |
| Newsletter modal | No. |
| Infinite scroll on work | Four projects. There is no scale problem to solve. |
| Page-transition loader between routes | There is one page. A loader between nothing and nothing is theatre. |
