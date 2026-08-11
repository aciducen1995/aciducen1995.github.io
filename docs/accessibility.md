# Accessibility

An animation-heavy site has more ways to exclude people than a plain one, so the commitments
here are specific rather than aspirational.

**Target:** WCAG 2.2 AA.

---

## What is implemented

### Motion

`prefers-reduced-motion: reduce` is handled in 14 files — ten TypeScript modules that branch on
`useReducedMotion()`, and four stylesheets that cancel CSS animation. It is not a duration
override — components take a different path, and in most cases never construct the animation
machinery at all. The full table is in [motion.md](motion.md#reduced-motion).

The two that matter most:

- **Lenis is never instantiated.** Smooth scrolling hijacks the scroll wheel, which is a
  vestibular trigger and a common complaint. Under reduced motion the browser's own scrolling is
  left completely alone.
- **The preloader is skipped.** No count, no curtain — the page is simply there.

### Text and assistive technology

Split text is the classic accessibility failure in animated sites: a screen reader reads
`S-y-s-t-e-m-s` one span at a time. `RevealText` avoids this by rendering the string twice — one
clean copy in a `.sr-only` span, and the animated spans marked `aria-hidden="true"`:

```tsx
<span className="sr-only">{children}</span>
<span aria-hidden="true">{/* the animated word spans */}</span>
```

The hero does the same for the whole headline, including the name and role, which are otherwise
split across three visual lines.

### Structure

- One `<h1>` (the hero), one `<h2>` per section, `<h3>` for items inside them.
- Every section is `aria-labelledby` its own heading.
- `<main id="main">` with a skip link that becomes visible on focus.
- The work list is a `<ul>` of `<li>`; the timeline is an `<ol>`; the metrics are a `<dl>`. The
  markup describes what the content *is*.

### Keyboard

Everything on the site is reachable and operable without a pointer.

- Every interactive element is a real `<button>` or `<a>`. There are no `onClick` divs.
- `:focus-visible` is a 2 px accent outline with 3 px offset, defined once in `base.css` and
  never removed.
- Expandable work rows use `aria-expanded` and `aria-controls` on the trigger.
- The mobile menu uses `aria-expanded` / `aria-controls` and closes on `Escape`.
- Shortcuts (`G`, `T`, `Escape`) are ignored while focus is in an input, a textarea, a select,
  or a `contenteditable`, and when a modifier key is held.
- `scrollToId` moves focus to the target section (`tabindex="-1"`, `focus({ preventScroll: true })`)
  so keyboard users land where sighted users are looking.

### Pointer

- The custom cursor is **additive**. The native cursor is never hidden, so pointer size,
  contrast and shape settings from the OS keep working.
- All pointer effects are gated on `(pointer: fine)`. Touch devices get none of them.
- Nothing on the site requires hover to reach its content — the floating plate is decorative,
  and the information it accompanies is in the row and the expanded case.

### Status changes

- Copy-to-clipboard announces through `role="status"` with `aria-live="polite"`.
- The theme toggle announces the new theme through a visually hidden live region.
- The preloader is `role="status"` with `aria-live="polite"` and an `aria-label`.

### Colour

- `--ink` on `--paper` exceeds AAA in both themes.
- `--ink-muted` on `--paper` clears AA for body text in both themes.
- `--ink-faint` does **not** clear AA. It is used only for decoration and duplicated
  information — see [design-system.md](design-system.md#colour). No content exists only in
  `--ink-faint`.
- Colour is never the sole carrier of meaning. The active nav item is accent-coloured *and*
  underlined *and* marked `aria-current`. Project status is a word, not a dot.
- Theme choice persists in `localStorage` and defaults to the system preference, resolved
  before first paint so there is no flash.

### Other

- `:root` declares `color-scheme: dark light`, so form controls and scrollbars follow the theme.
- Zoom to 200% is supported: the layout is `rem`- and `clamp()`-based, and the grid collapses at
  breakpoints expressed in `rem`, so zooming triggers them the same way narrowing does.
- `<noscript>` gives the email address rather than a blank page.
- Language is declared (`<html lang="en">`).

---

## Known gaps

Stated plainly rather than left for someone to find.

| Gap | Impact | Status |
| --- | --- | --- |
| No focus trap in the mobile menu | Tab can reach content behind the overlay | Fix planned. The menu is short and `Escape` closes it, but this is a real WCAG 2.4.3 concern. |
| Marquee has no pause control | Moving content beside static text | Under reduced motion it stops entirely. A universal pause control is the correct fix (WCAG 2.2.2). |
| `--ink-faint` below AA | Decorative text is low contrast | Deliberate, and no information depends on it. `prefers-contrast: more` support is on the [roadmap](../ROADMAP.md). |
| No automated a11y testing | Regressions could slip in | `axe-core` in CI is planned. Testing so far has been manual. |

---

## How to test a change

Manual, in this order. It takes about ten minutes.

1. **Tab through the whole page.** Every stop should be visible, and the order should match the
   visual order. Nothing should be reachable that you cannot see.
2. **Turn on reduced motion** (macOS: System Settings → Accessibility → Display → Reduce motion,
   or run Chrome with `--force-prefers-reduced-motion`). Confirm nothing moves, the scroll wheel
   behaves natively, and every section is readable.
3. **Run a screen reader over one section.** VoiceOver: `⌘F5`, then `⌃⌥→` through it. Headings
   should read once and cleanly — no character-by-character text, no duplicated headlines.
4. **Zoom to 200%** and read the page. Nothing should be clipped or overlapping.
5. **Switch themes** and re-check any colour you touched.
6. **Unplug the mouse.** Open a work row, copy the email, switch the theme, open the mobile menu
   at a narrow width. All of it should work.

If you add an animation, step 2 is not optional — see the checklist at the end of
[motion.md](motion.md#adding-an-animation).
