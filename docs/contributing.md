# Contributing

Mostly notes to a future self, or to anyone forking this.

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint — run before committing
npm run build      # typecheck + production build
```

---

## Conventions

### Files

- Components and sections: `PascalCase.tsx`, with a matching `kebab-case.css` beside them,
  imported by the component itself.
- Hooks and utilities: `camelCase.ts` in `lib/`.
- One section per file. When a section outgrows about 150 lines, extract a component — `Work.tsx`
  is at the limit and its `CaseDetail` and `FloatingPlate` are already separate functions in the
  file.

### Imports

Use the `@/` alias for anything outside the current directory. It is defined in both
`vite.config.ts` and `tsconfig.app.json` — if you change one, change the other.

```ts
import { site } from '@/content/site.config'
import { useReducedMotion } from '@/lib/hooks'
import './work.css'
```

Order: React, then third-party, then `@/`, then the local stylesheet last.

### CSS

- Block-element naming: `.work-row`, `.work-row__title`, `.work-row.is-open`. State classes are
  `is-` prefixed.
- Never hard-code a colour, duration or easing. If the token you need does not exist, add it to
  `tokens.css` in both themes.
- Component styles stay in the component's stylesheet. `base.css` is for primitives shared by
  three or more places.
- Media queries go at the bottom of the file they belong to, not in a central breakpoints file.
  Locality beats a global list you have to cross-reference.

### TypeScript

`strict` is on, along with `noUnusedLocals`, `noUnusedParameters` and `erasableSyntaxOnly`.
That last one means **no angle-bracket type assertions** (`<Foo[]>[...]`) and no enums — use
`satisfies` or `as`, which is what `site.config.ts` does.

There is no `any` in the project. Keep it that way.

### Comments

Comment the *why*, never the *what*. `// increment the counter` is noise. The comments worth
writing look like the ones already in the code:

```ts
// Lag factor of 0.18 gives ~90ms of trail: enough to feel alive,
// little enough that it never feels broken.
```

Numbers that look arbitrary — `0.18`, `INFLUENCE = 170`, `108%` — should say where they came
from. Most of them were tuned by eye, and saying so is more honest than implying a derivation.

---

## Before you commit

1. `npm run check` passes.
2. Reduced motion still works — see the checklist in
   [motion.md](motion.md#adding-an-animation).
3. Both themes look right.
4. You have tabbed to whatever you added.
5. `npm run build` output has not grown unexpectedly. The sizes are in
   [performance.md](performance.md); if a chunk moved, know why.
6. [CHANGELOG.md](../CHANGELOG.md) has an entry under `Unreleased` if a visitor would notice
   the change.

---

## Adding things

**A section** — see the five steps in [architecture.md](architecture.md#adding-a-section).

**An animation** — see the six questions in [motion.md](motion.md#adding-an-animation). The
first one is whether it should exist.

**A dependency** — there are two, and both are load-bearing. A third needs a written argument:
what it does, what it weighs gzipped, and why it cannot be forty lines in `lib/`. Several things
that would normally be packages are forty lines in `lib/` — the PRNG, the scramble effect, the
magnetic hover, the marquee.

**A token** — check first whether an existing one is close enough. If not, define it in both
theme blocks, name it for its role rather than its value, and check the contrast.

---

## Things that will bite you

- **`StrictMode` is on.** Every effect mounts, unmounts and remounts in development. If your
  `rAF` loop or listener does not clean up, you will get two of them and it will look like a
  performance bug rather than a lifecycle bug.
- **Lenis is a module singleton.** `useSmoothScroll()` must be called exactly once, in `App`.
  Two instances will fight over the scroll position.
- **Masked reveals need vertical headroom.** Fraunces' descenders and overshoot get clipped
  without the `padding-block` / negative `margin-block` pair. Copy the pattern from
  `.reveal__mask`.
- **The `--ink-faint` token fails AA.** It is for decoration only. Do not use it for anything a
  visitor needs to read.
- **The `timezone` field fails silently.** An invalid IANA zone falls back to the visitor's own
  rather than throwing. Check the nav clock after changing it.
- **The plate `seed` is not a parameter.** Changing it re-rolls the composition; it does not
  steer it.
