# Design system

Everything here is defined in [`src/styles/tokens.css`](../src/styles/tokens.css) and used
through [`src/styles/base.css`](../src/styles/base.css). Changing a token changes the site;
there is no second place to update.

---

## Position

The direction is **Swiss-editorial**: a visible grid, hairline rules, oversized display type as
an object on the page, and metadata set in mono like a printed caption. It is deliberately not
the current default portfolio look — no gradient meshes, no glassmorphism, no rounded cards
floating on a dark blur, no glow.

Three constraints hold it together:

1. **Nothing casts a shadow.** Depth comes from ground tones and hairlines. The only
   `box-shadow` in the project is the expanding ring on the availability dot — a pulse, not an
   elevation. No element is lifted off the page.
2. **One accent colour, used sparingly.** It appears on index numbers, the availability dot, the
   full stop in the hero, the current section, and hover affordances. Perhaps two percent of the
   pixels. That is what makes it read as a signal.
3. **Corners are square.** `--radius-s` is 2 px and `--radius-m` is 4 px, used only where a
   shape would otherwise look broken. The pill radius is reserved for genuinely pill-shaped
   things — status chips, the theme toggle.

---

## Colour

Two themes, defined as complete sets of overrides. Light is not "dark inverted" — the ground is
a warm bone rather than white, and the accent shifts darker to hold contrast.

| Token | Dark | Light | Used for |
| --- | --- | --- | --- |
| `--paper` | `#0c0c0d` | `#efece4` | Page ground |
| `--paper-raised` | `#141416` | `#f7f5f0` | Hint chip, floating plate ground |
| `--paper-sunken` | `#070708` | `#e3dfd4` | Plate artwork ground |
| `--ink` | `#eeeae2` | `#14120f` | Body and display text |
| `--ink-muted` | `#8b867b` | `#5f594e` | Secondary text, labels |
| `--ink-faint` | `#4d4a45` | `#a49d90` | Non-essential metadata only |
| `--rule` | ink @ 13% | ink @ 15% | Hairlines |
| `--rule-strong` | ink @ 28% | ink @ 34% | Borders that need to be seen |
| `--accent` | `#ff5a38` | `#d84021` | The signal |

**Contrast.** `--ink` on `--paper` is well past AAA in both themes. `--ink-muted` on `--paper`
clears AA for body text in both. `--ink-faint` does **not** clear AA and is used only for
decoration and duplicated metadata — a year that also appears in the expanded case, a handle
that follows a labelled link. Nothing that is only available in `--ink-faint` is information you
need. If you repurpose it, check it first.

The accent is never used as a text colour on a large body of copy — only on short labels, single
glyphs, and rules.

### Changing the accent

Change `--accent` in both theme blocks and check three things: the hero's full stop, the
`work-row__status--live` chip, and the focus ring. Those are the three places where the accent
carries meaning rather than decoration, and they need to survive the change.

---

## Type

Three faces, three jobs. A face is never borrowed for another job.

| Role | Face | Where |
| --- | --- | --- |
| Display | **Fraunces** (variable) | Headlines, project titles, metric values, the footer mark |
| UI | **Inter Tight** | Body copy, navigation, everything unmarked |
| Meta | **JetBrains Mono** | Labels, clocks, years, keys, the email address |

Fraunces is variable on `SOFT` (how rounded the terminals are) and `WONK` (whether certain
letters take their eccentric alternates). The site uses this as a real axis of expression rather
than picking one setting:

| Context | `SOFT` | `WONK` | Effect |
| --- | --- | --- | --- |
| Hero, nav monogram | 12 / 0 | 1 | Sharp, architectural |
| Section headlines | 20 | 1 | Slightly warmer |
| Signature, contact emphasis | 60–70 | 1 | Loose, handwritten-adjacent |
| Metric numerals | 10 | 0 | Sober — numbers should not be wonky |

### Scale

Fluid, `clamp()`-based, tuned by hand rather than generated from a ratio. `--step--2` through
`--step-5` are the text sizes; the three display sizes deliberately break the scale, because a
headline that sits neatly on the same ratio as body copy does not read as an object.

```
--step--2  0.66 → 0.72rem    labels, mono metadata
--step--1  0.79 → 0.89rem    secondary copy, nav
--step-0   0.95 → 1.10rem    body
--step-1   1.14 → 1.40rem    lead paragraphs
--step-2   1.37 → 1.79rem    sub-headings
--step-3   1.64 → 2.28rem    timeline organisations
--step-4   1.97 → 2.90rem    metric values
--step-5   2.37 → 3.70rem    section headlines
--display-sm  3.0 → 6.5rem   preloader
--display-md  3.8 → 10rem    contact
--display-lg  4.4 → 15.5rem  hero
```

### Rules of thumb

- Measure is capped at `62ch` (`--measure`) for prose and tighter — 46 ch — for secondary copy.
- Every display size carries negative tracking; the larger the size, the tighter (`-0.025em` to
  `-0.045em`). Large type set at default tracking looks slack.
- `.tabular` on anything that animates or ticks — clocks, counters, metrics — so digits do not
  jitter as they change.
- `text-wrap: balance` on headlines only. On body copy it costs more than it gives.

---

## Grid and space

A 12-column grid (`.grid12`) that collapses to 6 below 60 rem. The gutter is fluid
(`--gutter`, 1.15 → 3.25 rem) and doubles as the page's side padding, so content and grid share
one rhythm. Maximum content width is 96 rem.

Press **`G`** to see it. The overlay is a working tool, not an easter egg — it is how the
layouts were checked.

Spacing is a seven-step scale from `--space-3xs` (0.25 rem) to `--space-3xl` (8 rem), plus
`--section-gap` (6 → 11 rem) for the vertical rhythm between sections. Use the scale. A one-off
`margin-top: 27px` is how a system starts to drift.

### Breakpoints

Four, all in `rem`, all chosen where the layout actually breaks rather than at device sizes:

| Width | What changes |
| --- | --- |
| 72 rem | Work rows drop the four-column layout; case detail reflows |
| 60 rem | Grid halves to 6 columns; scroll rail and floating plate disappear |
| 52 rem | Nav links become the overlay menu; hero scroll cue hides |
| 46 rem | Capability cards go full width |

---

## Motion tokens

Three easings and three durations, shared by CSS and Motion so hand-written transitions and
JS-driven animation feel like the same hand.

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);     /* things arriving */
--ease-io:     cubic-bezier(0.65, 0, 0.35, 1);    /* things moving under their own power */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* things that snap — used twice */
--dur-fast: 180ms;   --dur: 420ms;   --dur-slow: 900ms;
```

Full reasoning in [motion.md](motion.md).

---

## Adding to the system

Before adding a token, check whether an existing one is close enough. The value of a small
system is that it stays small.

If you do add one:

1. Define it in **both** theme blocks if it is a colour.
2. Give it a name that says what it is *for*, not what it looks like — `--rule-strong`, not
   `--grey-40`.
3. Check it in both themes, and check any pairing against WCAG AA if text will sit on it.
