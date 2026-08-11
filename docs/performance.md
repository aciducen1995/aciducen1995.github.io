# Performance

A portfolio that animates heavily and loads slowly makes exactly the wrong argument about the
person who built it.

---

## Current build

Measured from `npm run build`, 2026-08-10:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| `index.html` | 2.5 kB | 1.1 kB |
| CSS (one file) | 28.8 kB | 6.9 kB |
| App JS | 74.8 kB | 24.3 kB |
| `motion` chunk | 130.1 kB | 42.5 kB |
| `react` chunk | 181.7 kB | 57.2 kB |
| Rolldown runtime | 0.9 kB | 0.5 kB |
| **Total JS** | **387.5 kB** | **124.5 kB** |

Plus three webfont families from Google Fonts, which are **not** in the table above and are
currently the largest uncontrolled cost. Self-hosting and subsetting them is the top item on the
[roadmap](../ROADMAP.md).

### Budgets

Targets, not achievements. Enforcement in CI is planned, not built.

| Metric | Budget |
| --- | --- |
| JS, gzipped | < 130 kB |
| CSS, gzipped | < 10 kB |
| LCP (Fast 3G, mid-tier mobile) | < 2.5 s |
| CLS | < 0.02 |
| INP | < 200 ms |
| Frame rate while scrolling | 60 fps, 4× CPU throttle |
| Image requests | 0 |

The last one is not a stunt. There is no bitmap image in the project: the artwork is generated
SVG, the grain is an SVG filter, the favicon is a path, and the icons are inline. It is also
what makes the CSS budget affordable.

---

## What was done

**No image pipeline, because there are no images.** Project artwork is composed at render time
from a seeded PRNG (`src/lib/rng.ts` → `src/components/Plate.tsx`). This is not just a size win:
it removes an entire class of work — sourcing, optimising, `srcset`, lazy loading, layout shift,
alt text for decorative images.

**Chunk splitting.** `motion` and `react` are split into separate chunks
(`build.rollupOptions.output.codeSplitting` in `vite.config.ts`) so the browser fetches them in
parallel rather than serialising behind one large bundle. They also cache independently — a copy
change invalidates only the 24 kB app chunk.

**Theme resolved before paint.** A small inline script in `index.html` reads `localStorage` and
the system preference and stamps `data-theme` on `<html>` before React loads. No flash, no
layout shift.

**Animation confined to the compositor.** Only `transform` and `opacity` animate. The single
exception is the case detail's `height`, which is user-initiated and happens once per click.

**Every loop stops.**

- `FieldCanvas` — an `IntersectionObserver` stops the `rAF` loop when the hero leaves the
  viewport, and `visibilitychange` stops it when the tab is hidden. It is the only ambient
  animation on the site and it costs nothing once you scroll past it.
- `useMagnetic` — the loop exits when the element settles within 0.05 px rather than spinning
  forever at rest.
- All of them cancel their frame on cleanup, which also makes them correct under `StrictMode`'s
  double-mount.

**Canvas DPR capped at 2.** Above that you are drawing four times the pixels for no perceivable
gain on a field of 1 px dots.

**Scroll and pointer listeners are passive** (`{ passive: true }`) so they never block scrolling.

**Direct DOM writes for per-frame values.** The cursor, the floating plate and the marquee write
transforms straight to the node instead of going through `setState`. Sixty renders a second for a
value nothing else reads is pure waste.

---

## What is still on the table

Ordered by expected gain. Tracked in [ROADMAP.md](../ROADMAP.md).

1. **`LazyMotion` + `m` components** — 15–20 kB gzip. The site uses `motion.div`, which pulls in
   every animation feature; `domAnimation` covers everything used here except layout animations,
   which are not used. This is the single biggest remaining win.
2. **Self-host and subset the fonts** — removes two DNS lookups, a TLS handshake, and a
   render-blocking stylesheet on a third-party origin. Expected 200–400 ms of LCP on a cold
   cache, plus a privacy improvement.
3. **`content-visibility: auto`** on below-fold sections — cuts initial style and layout work.
   Needs `contain-intrinsic-size` per section or the scrollbar will jump as you scroll.
4. **Lighthouse CI** — the budgets above are currently asserted rather than enforced.

---

## Measuring

```bash
npm run build && npm run preview
```

Then, against the preview server:

- **Lighthouse** — DevTools → Lighthouse → Mobile, with "Simulated throttling". Run it three
  times and take the median; a single run is noise.
- **Scrolling** — DevTools → Performance, 4× CPU throttle, record a scroll from top to bottom.
  Look for long tasks and dropped frames, not for a single number. The hero and the marquee are
  where problems will appear first.
- **Bundle** — the build output above is printed by every `npm run build`. If a number moves,
  find out why before committing.

Test on a real mid-tier phone at least once. A throttled desktop is a model of a slow device,
not a slow device.

---

## Regression risks

The things most likely to quietly break the numbers, so they can be watched:

| Change | Risk |
| --- | --- |
| Adding a third runtime dependency | The two current ones are load-bearing. A third needs an argument. |
| Real screenshots for projects | Reintroduces the entire image pipeline and the zero-image budget. |
| A second ambient animation | The canvas is affordable because it is the only one, and because it stops. |
| A fourth font weight or family | Fonts are already the largest uncontrolled cost. |
| `will-change` on more elements | It is a promise to the compositor; over-promising costs memory. |
