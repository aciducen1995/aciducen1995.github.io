# Content

All copy lives in [`src/content/site.config.ts`](../src/content/site.config.ts). You should never
need to open a component to change a word.

---

## Replace the sample data first

The four projects, the timeline, and the availability note are **fictional**. They were written
to exercise every layout state the components handle — a one-word title next to a seven-word
one, an entry with no live link, one archived, one in progress, one with three metrics and one
with none.

They describe work that does not exist. Replace them before publishing.

---

## The fields

### Identity

```ts
name: 'Rashid',   // full name — footer mark, meta, hero screen-reader text
shortName: 'Rashid',         // preloader, signature
monogram: 'R',                 // nav mark
role: 'Engineer & Interface Designer',
headline: ['Systems', 'and their', 'surfaces'],
location: 'Port-au-Prince, HT',
timezone: 'America/Port-au-Prince',   // IANA zone — drives the live clocks
email: 'rash@gmail.com',
```

**`headline`** is an array of lines, and each entry is a real line break in the hero, set at up
to 15.5 rem. Three short lines works; four gets cramped below 900 px tall. A trailing accent
full stop is added to the last line automatically.

**`timezone`** must be a valid IANA identifier — `America/New_York`, `Europe/Lisbon`,
`Asia/Tokyo`. An invalid one falls back to the visitor's own zone rather than throwing, which
means a typo fails silently. Check the clock in the nav after changing it.

**`monogram`** is set in Fraunces at 1.35 rem. Two characters is the design; three still works;
more will crowd the nav on small screens.

Also update the `<title>`, the meta description, and the Open Graph tags in
[`index.html`](../index.html) — those are outside the config because they need to be in the HTML
before React runs.

### Availability

```ts
availability: { open: true, note: 'Taking on selected work from Q4' },
```

`open` drives the pulsing accent dot in the hero. When `false`, the dot goes grey and the
contact section swaps to its "not currently taking on new work" line. The `note` is shown in the
hero either way — keep it under about 40 characters or it will wrap awkwardly beside the dot.

### Intro and principles

`intro` is an array of paragraphs for the Index section. Three is the design; two reads thin,
four pushes the principles list out of alignment on tall screens.

`principles` is four entries of `{ n, title, text }`. The numbers are written by hand rather
than generated, so you can renumber or skip. Keep `title` to three or four words — it is set at
`--step-2` and will wrap past that. Keep `text` under about 180 characters.

### Projects

```ts
{
  id: 'atlas',            // stable slug — anchors and the planned ?case= deep link
  index: '01',            // displayed number; hand-written so you can renumber freely
  title: 'Atlas',
  year: '2025',
  summary: '…',           // one line, shown in the collapsed row
  role: '…',
  stack: ['TypeScript', 'React', …],
  status: 'live' | 'in progress' | 'archived',
  seed: 'atlas-2025',     // drives the generative artwork
  body: ['…', '…'],       // paragraphs, shown when expanded
  metrics: [{ value: '280ms', label: 'to first row (p50)' }],   // optional
  href: '…',              // optional
  repo: '…',              // optional
}
```

Writing guidance, which matters more than the schema:

- **`summary`** is the line that decides whether anyone opens the row. State what the thing does
  and for whom, in the present tense. "A query console that renders results before the query
  finishes" — not "A modern, beautiful analytics experience."
- **`body`** should include the problem, the interesting decision, and the hard part. The third
  paragraph of the Atlas sample is the model: it names the thing that was genuinely difficult.
  Three paragraphs is plenty; the layout holds more but readers will not.
- **`metrics`** are the strongest thing on the page and the easiest to fake. Use numbers you
  could defend in an interview. Two or three; a wall of them reads as padding. `value` is set at
  `--step-4`, so keep it to about six characters — `280ms`, `11×`, `−41%`.
- **`status`** is not decoration. `archived` renders in faint grey and is a good honest signal;
  a portfolio where everything is `live` is less believable, not more.
- **`stack`** is joined with `·` in the case detail. Five entries is the practical maximum.

Four to six projects is the right number. The layout takes more, but the section is called
*Selected* work.

#### `seed` and the artwork

Each project's plate is drawn from `seed` by a deterministic PRNG — the same seed always produces
the same composition, on every machine and every reload. There is no image file anywhere in this
project.

If you dislike a project's plate, change its `seed` string to anything else and you get a
different composition. It is a lottery ticket, not a parameter: there is no way to ask for "more
circles". The composer lives in [`src/components/Plate.tsx`](../src/components/Plate.tsx) if you
want to change the vocabulary of shapes itself.

Note that `title` and `year` remain the visible identity of a project — the plate is texture, not
a screenshot. If you want real screenshots, that is a component change, not a content change.

### Disciplines, timeline, links

**`disciplines`** — four entries of `{ title, blurb, tools }`. Four fills the 12-column grid as
three-column cards. Three or six also work; five will leave a gap. The `blurb` should say what
you do with the skill, not that you have it.

**`timeline`** — `{ period, org, role, note }`, newest first. `period` is free text (`'2025 —'`,
`'2022 — 2025'`) so open-ended entries read naturally. Four to six entries; this is a
trajectory, not a full CV.

**`links`** — `{ label, href, handle }`. The handle is the small grey text on the right. The
grid is `auto-fit`, so any number works, but four makes an even row on desktop.

**`marquee`** — short phrases, no punctuation. Six to eight; the band is duplicated for seamless
wrapping, so fewer than about five leaves visible repetition on a wide screen.

**`colophon`** — three strings in the footer. Update `built` if you change the stack, or delete
the whole block if you would rather not say.

---

## Editing outside the config

| Change | Where |
| --- | --- |
| Page title, meta description, OG tags | [`index.html`](../index.html) |
| Fonts | The Google Fonts `<link>` in `index.html`, then `--font-*` in `tokens.css` |
| Favicon | [`public/favicon.svg`](../public/favicon.svg) — the monogram is drawn as a path |
| Section names and order | `SECTIONS` in [`src/App.tsx`](../src/App.tsx) |
| Section numbers (`01 —`, `02 —`) | The `index` prop on each `SectionHead` |
| Copyright line, "no cookies" note | [`src/sections/Footer.tsx`](../src/sections/Footer.tsx) |

---

## Tone

The copy on this site follows a few rules. They are not universal, but they are consistent, and
consistency is most of what makes writing sound like a person.

- **First person, plain, no hedging.** "I build the parts of software people actually touch."
- **Concrete over evaluative.** Say what the thing does. Let the reader decide it is impressive.
- **No adjective you could not defend.** "Passionate", "innovative", "cutting-edge", "seamless"
  and "robust" appear nowhere, and should not.
- **Numbers instead of intensifiers.** "11× faster perceived response", not "dramatically
  faster".
- **Admit the boring parts.** The archived project says it was archived and why. That single
  sentence does more for credibility than another success story.
