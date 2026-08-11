# Architecture

## Shape

One page. No router, no state manager, no data fetching. The entire application state is four
values, and each one lives in the smallest component that needs it:

| State | Owner | Why there |
| --- | --- | --- |
| `ready` (preloader finished) | `App` | The hero's entrance is gated on it. |
| `active` (current section) | `App` | Two consumers — the nav and the rail. |
| `openId` (expanded case) | `Work` | Nothing outside `Work` cares. |
| `theme` | `useTheme`, in `Nav` | Written to `<html data-theme>`; CSS distributes it. |

There is no context provider anywhere in this project. Adding one would be the first sign that
a section has started reaching into another section's business.

```
main.tsx  →  App.tsx  ┬─ chrome     (Preloader, Cursor, Grain, GridOverlay, Nav, ScrollRail)
                      └─ sections   (Hero, Index, Work, Capabilities, Trajectory, Contact, Footer)
```

---

## Layers

```
src/
├─ content/     data          — no imports from anywhere else in src/
├─ styles/      tokens + base — the only global CSS
├─ lib/         behaviour     — hooks and utilities, no JSX
├─ components/  reusable UI   — used by two or more sections
└─ sections/    page UI       — used exactly once
```

The dependency rule is one-directional: `sections → components → lib → content`. A component
never imports from a section. If two sections need the same thing, it moves into `components/`.

### `content/`

`site.config.ts` exports one object and three types. The arrays use `satisfies Project[]` rather
than a type annotation, so TypeScript checks the shape while still inferring the literal values —
which is what lets `site.projects.find(...)` return something usefully typed.

### `styles/`

Only two files are global, and they are imported once, in `main.tsx`:

- **`tokens.css`** — every colour, size, easing curve and duration on the site. Themes are
  defined here as two blocks of custom property overrides. Nothing downstream hard-codes a
  colour or a duration.
- **`base.css`** — the reset, the Lenis hooks, typographic primitives (`.display`, `.headline`,
  `.label`, `.prose`), and layout primitives (`.shell`, `.grid12`, `.section`).

Every other stylesheet is co-located with its component and imported by it. There is no
`components.css`, no `utilities.css`, and no cascade to reason about beyond two files.

### `lib/`

- **`hooks.ts`** — `useMediaQuery` and the two derived hooks every motion component checks
  (`useReducedMotion`, `useFinePointer`), plus `useMagnetic`, `useScramble`, `useLocalTime`,
  `useTheme`, `useKey`, `useActiveSection`.
- **`scroll.ts`** — the Lenis lifecycle plus `scrollToId` and `lockScroll`.
- **`rng.ts`** — a seeded PRNG (cyrb128 hash → sfc32 generator) for the generative plates.

### `components/` vs `sections/`

A file is a **component** if it is used more than once, and a **section** if it appears exactly
once on the page. `SectionHead` is a component because all five headed sections use it.
`Hero` is a section because there is one hero.

---

## Two decisions worth explaining

### Lenis lives on a module singleton

`scroll.ts` keeps the Lenis instance in a module-level variable rather than in React state or
context. This is deliberate: `scrollToId` is called from the nav, the rail, the hero cue, the
mobile menu and the footer, and threading a ref through all of them would add a provider to a
site that otherwise needs none.

The trade-off is that the module assumes one instance. That is enforced by `useSmoothScroll`
being called exactly once, in `App`. If you ever call it twice, the second instance wins and the
first leaks — so don't.

Under `prefers-reduced-motion` the instance is **never constructed**. `scrollToId` then falls
back to `scrollIntoView({ behavior: 'auto' })` and `lockScroll` falls back to setting
`overflow` on the document element. Reduced motion is not "the same code with the duration set
to zero" — it is a different, simpler path.

### Animation runs outside React where position is per-frame

Three effects write transforms directly to a DOM node in a `requestAnimationFrame` loop instead
of going through React state: the cursor ring, the floating project plate, and the marquee.

At 60 fps, a `setState` per frame means a render per frame for a value that no other component
reads. These loops read from a ref, write `element.style.transform`, and never touch the React
tree. React still owns *what* is rendered — which plate, which cursor mode — but not *where* it
sits this frame.

Everything else uses Motion, which does the same thing internally.

---

## Rendering behaviour worth knowing

- **`useActiveSection`** uses one `IntersectionObserver` with `rootMargin: '-38% 0px -55% 0px'`,
  which narrows the observation band to roughly the reading position. When several sections
  intersect it, the one with the highest ratio wins — that is why fast scrolling does not leave
  the nav pointing at the wrong place.
- **`FieldCanvas`** stops its `rAF` loop entirely when the hero leaves the viewport or the tab
  is hidden, and re-samples its colours through a `MutationObserver` on `data-theme` so the
  canvas follows the theme without a React re-render.
- **`Plate`** memoises its composition on `seed`. Composition is pure and deterministic, so the
  artwork is stable across re-renders, reloads and machines.
- **`StrictMode` is on**, so every effect mounts, cleans up and remounts in development. Each
  effect in `lib/` returns a cleanup that cancels its own `rAF` and removes its own listeners —
  this is why, and it is not optional.

---

## Adding a section

1. Add its content to `site.config.ts`.
2. Create `src/sections/Thing.tsx` and `src/sections/thing.css`.
3. Open with `<SectionHead index="06" label="…" title="…" />` and wrap in
   `<section className="section" id="thing" aria-labelledby="thing-title">`.
4. Register `{ id: 'thing', label: 'Thing' }` in `SECTIONS` in `App.tsx` — the nav, the rail and
   the active-section tracking all read from that one array.
5. Use `Reveal` / `RevealText` for entrances rather than writing new animation.

See [contributing.md](contributing.md) for the conventions, and [motion.md](motion.md) before
inventing a new movement.
