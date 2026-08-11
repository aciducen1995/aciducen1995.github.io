# Motion

## The test

Every animation on this site answers one of four questions:

1. **Where did this come from?** — mask reveals, the case detail expanding
2. **Where did it go?** — the preloader lifting, the menu closing
3. **How far through am I?** — the scroll rail, the timeline spine, the marquee
4. **Is this interactive?** — magnetic hover, the cursor ring, the row wash

An animation that answers none of them is decoration. Several were built during development and
cut on this test: a staggered letter-by-letter hero (answered nothing, delayed reading), a
tilt-on-hover for the capability cards (implied a depth the design does not have), and a
scroll-triggered counter on the metrics (numbers that count up are harder to read than numbers).

---

## The vocabulary

### Rise out of a mask

The default. Content is wrapped in a container with `overflow: clip` and translated from `108%`
to `0%`. The mask implies the text was always there and the page uncovered it — which is true.
A fade implies it materialised, which is not.

```
duration  0.9s      easing  cubic-bezier(0.16, 1, 0.3, 1)      stagger  45ms per word
```

Implemented by `RevealText` in [`src/components/Reveal.tsx`](../src/components/Reveal.tsx).
Use it for anything typographic.

The mask needs vertical headroom or Fraunces' descenders get clipped:

```css
.reveal__mask { padding-block: 0.14em; margin-block: -0.14em; }
```

That pattern — pad, then pull the padding back with a negative margin — appears in four places.
If you build a new masked reveal, copy it.

### Settle

For non-text blocks: 22 px of travel plus a fade, 0.75 s. Implemented by `Reveal`. This is the
only place a fade is allowed, because a plate or a card has no baseline to reveal against.

### Draw

Hairlines scale from `scaleX(0)` with a left origin over 1.1 s (`DrawRule`). Used at the top of
every section head, which is why the sections feel like they are being ruled onto the page.

### Scroll-linked

Position mapped directly to scroll progress, no trigger, no threshold:

| element | Mapping |
| --- | --- |
| Scroll rail | `scrollYProgress` → `scaleY`, spring 120/28 |
| Timeline spine | section progress → `scaleY`, spring 90/26 |
| Hero parallax | `0 → 1` → `0% → 18%` translate, plus opacity to 0.25 |
| Index prose | `4% → -4%` counter-drift |
| Marquee | scroll *velocity* → speed and direction |

Springs, not tweens, on anything the visitor is directly driving. A tween lags behind the input
and reads as broken; a spring reads as weight.

### Pointer-linked

| Effect | Behaviour |
| --- | --- |
| Cursor ring | Lerp factor 0.18 → ~90 ms trail. Grows and fills on `[data-cursor]` elements. |
| Magnetic | element leans toward the cursor with a radial falloff, springs back on leave. |
| Floating plate | Lerp 0.1, plus a rotation derived from horizontal velocity, clamped to ±9°. |
| Field canvas | Dots swell and displace away from the pointer within a 170 px radius. |

All four are **fine-pointer only** and all four are disabled under reduced motion.

---

## Stagger

Stagger reads as authorship at 45–60 ms and as a loading bug past 100 ms. The site uses:

- **45 ms** between words in a headline
- **50–60 ms** between siblings in a list
- **90 ms** between the three hero lines — slower, because they are enormous

Nothing staggers past the fourth item. Beyond that the last item arrives late enough to feel
broken, and `Reveal` is applied per item on scroll instead, so each one animates when it is
actually reached.

---

## Reduced motion

`prefers-reduced-motion: reduce` is not "the same animations, faster". It is a different path.

| Component | Under reduced motion |
| --- | --- |
| Lenis | Never constructed. Native scrolling, untouched. |
| Preloader | Returns `null` immediately. No count, no curtain. |
| `RevealText` / `Reveal` | Render plain markup with no wrapper spans. |
| `FieldCanvas` | Draws one static frame. No `rAF` loop. |
| Marquee | Stops. The duplicate run is hidden and the items wrap. |
| Cursor | Returns `null`. Native cursor only. |
| Magnetic | Effect returns early; no listeners attached. |
| Scramble | Resolves instantly to the final string. |
| Grain, scroll cue, status pulse | Animation cancelled in CSS. |
| Case detail | Height transition set to `0s` — it opens, it does not animate. |

The global `@media (prefers-reduced-motion: reduce)` block in `base.css` collapses every
remaining CSS transition to 0.01 ms. That is the backstop, not the strategy: components check
`useReducedMotion()` themselves so that they never *construct* the machinery in the first place.

**Test it**: macOS System Settings → Accessibility → Display → Reduce motion. Or run Chrome with
`--force-prefers-reduced-motion`.

---

## Performance rules

- **Only `transform` and `opacity`.** Nothing animates a property that triggers layout. The one
  exception is the case detail's `height: auto`, which Motion measures and animates once per
  interaction — acceptable for a deliberate, user-initiated expansion, not for anything ambient.
- **`will-change` only on elements that are actually about to move**, and never on more than a
  handful at once. It is a promise to the compositor, and over-promising costs memory.
- **Every `rAF` loop stops.** The canvas stops when off-screen or the tab is hidden; the magnetic
  loop stops when the element settles below 0.05 px; every effect cancels its frame on cleanup.
- **Ambient animation is rationed.** There is exactly one thing moving when you are not
  interacting: the hero's dot field, which stops the moment it scrolls away. The grain drifts on
  a 6-step CSS animation, which the compositor handles for free.

---

## Adding an animation

1. Which of the four questions does it answer? If none, stop.
2. Can `Reveal`, `RevealText` or `DrawRule` do it? Use them.
3. If not: use the shared easings and durations from `tokens.css` so it moves like the rest of
   the site.
4. Handle reduced motion explicitly — early-return in the effect, do not just shorten it.
5. Restrict to `transform` and `opacity`.
6. Check it on a 4× CPU throttle in DevTools. If the site drops below 60 fps while scrolling,
   the animation is too expensive regardless of how it looks.
