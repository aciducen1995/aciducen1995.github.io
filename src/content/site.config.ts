/* ==================================================================
   SITE CONTENT — single source of truth
   ------------------------------------------------------------------
   Everything a visitor reads lives in this file. Editing copy should
   never require touching a component.

   ⚠️  The projects, timeline and testimonial entries below are SAMPLE
       DATA, written to exercise every layout state (long title, short
       title, no link, in-progress, archived). Replace them with your
       real work before publishing. See docs/content.md.
   ================================================================== */

export type Discipline = {
  title: string
  blurb: string
  tools: string[]
}

export type Project = {
  /** Stable slug — used for anchors and the `?case=` deep link. */
  id: string
  index: string
  title: string
  year: string
  /** One line, present tense, no adjectives you can't defend. */
  summary: string
  role: string
  stack: string[]
  /** Longer body shown when the row is expanded. Plain strings = paragraphs. */
  body: string[]
  /** Two or three facts with a number in them. Numbers beat adjectives. */
  metrics?: { value: string; label: string }[]
  href?: string
  repo?: string
  status: 'live' | 'in progress' | 'archived'
  /** Seed for the generative plate artwork. Any string; changes the composition. */
  seed: string
}

export type TimelineEntry = {
  period: string
  org: string
  role: string
  note: string
}

export const site = {
  /* --- Identity ---------------------------------------------------- */
  name: 'Rashid',
  shortName: 'Rashid',
  monogram: 'R',
  role: 'Engineer & Interface Designer',
  /** Used by the hero. Kept to three words per line on purpose. */
  headline: ['Systems', 'and their', 'surfaces'],
  location: 'Port-au-Prince, HT',
  timezone: 'America/Port-au-Prince',
  email: 'rash@gmail.com',
  availability: {
    open: true,
    note: 'Taking on selected work from Q4',
  },

  /* --- Voice ------------------------------------------------------- */
  intro: [
    'I build the parts of software people actually touch — and the parts underneath that decide whether touching it feels good.',
    'Most of my work sits at the seam between an interface and the system behind it: the loading state that hides a slow query, the animation that explains a state change, the API shape that makes a screen possible or impossible.',
    'I care about latency, legibility, and leaving a codebase easier to change than I found it.',
  ],

  /** Short, declarative, first-person. No mission statements. */
  principles: [
    {
      n: '01',
      title: 'Motion is explanation',
      text: 'An animation earns its place by telling you where something came from or where it went. If it only decorates, it gets cut.',
    },
    {
      n: '02',
      title: 'Fast is a feature',
      text: 'Perceived speed is designed, not discovered. Optimistic writes, skeletons that match the real layout, work moved off the critical path.',
    },
    {
      n: '03',
      title: 'Constraints before options',
      text: 'A tight palette, a fixed grid, and three type sizes produce better work than infinite choice. Same goes for architecture.',
    },
    {
      n: '04',
      title: 'Legible over clever',
      text: 'The next person to read the code is the user too. Clever costs interest; obvious compounds.',
    },
  ],

  /* --- Work -------------------------------------------------------- */
  projects: [
    {
      id: 'atlas',
      index: '01',
      title: 'Atlas',
      year: '2025',
      summary: 'A query console that renders results before the query finishes.',
      role: 'Design + frontend architecture',
      stack: ['TypeScript', 'React', 'DuckDB-WASM', 'Web Workers', 'Arrow'],
      status: 'live',
      seed: 'atlas-2025',
      body: [
        'Analysts were waiting eight to twelve seconds for a result set, then discovering they had written the wrong filter. The fix was not a faster database — it was showing the shape of the answer early.',
        'Atlas streams Arrow batches off a worker and paints rows as they land, so the first hundred rows are on screen in under 300ms. The grid is virtualised and column-typed from the schema rather than the data, which means headers, alignment and formatting are correct before a single value arrives.',
        'The hardest part was cancellation. Every keystroke can invalidate an in-flight query, so the worker protocol is generation-stamped and the UI treats a superseded result as a no-op rather than an error.',
      ],
      metrics: [
        { value: '280ms', label: 'to first row (p50)' },
        { value: '11×', label: 'faster perceived response' },
        { value: '1.4M', label: 'rows scrolled without jank' },
      ],
      href: '#',
      repo: '#',
    },
    {
      id: 'ledger',
      index: '02',
      title: 'Ledger for Small Cooperatives',
      year: '2024',
      summary: 'Double-entry bookkeeping for groups that share one phone.',
      role: 'Product engineering, end to end',
      stack: ['React Native', 'SQLite', 'CRDT sync', 'Rust'],
      status: 'live',
      seed: 'ledger-coop',
      body: [
        'Built for savings cooperatives where a single device is passed between members and the network is intermittent by default, not by exception.',
        'Every entry is written locally first and reconciled with a last-writer-wins CRDT keyed by member, so two treasurers recording the same meeting from different phones merge without a conflict dialog. Balances are derived, never stored — the ledger is the truth.',
        'The interface assumes shared use: no persistent login, a per-entry attribution chip, and an audit view that reads like a paper book because that is what it replaced.',
      ],
      metrics: [
        { value: '0', label: 'sync conflicts surfaced to users' },
        { value: '38kb', label: 'median offline day of data' },
      ],
      href: '#',
    },
    {
      id: 'signal-room',
      index: '03',
      title: 'Signal Room',
      year: '2024',
      summary: 'Realtime incident timeline stitched from six noisy sources.',
      role: 'Backend + data modelling',
      stack: ['Go', 'NATS', 'Postgres', 'ClickHouse'],
      status: 'in progress',
      seed: 'signal-room-x',
      body: [
        'On-call engineers were reconstructing incidents by hand from alerts, deploys, feature flags, chat, status pages and traces. Signal Room merges those into one ordered narrative.',
        'The interesting problem is time. Sources disagree about it, arrive late, and sometimes lie. Every event carries an observed-at and a claimed-at, and the timeline renders both — late arrivals slide into position with a motion cue rather than silently rewriting history under your cursor.',
      ],
      metrics: [
        { value: '6', label: 'sources unified' },
        { value: '−41%', label: 'time to write a postmortem' },
      ],
      repo: '#',
    },
    {
      id: 'kerning',
      index: '04',
      title: 'Kerning',
      year: '2023',
      summary: 'A type-spacing trainer that grades your eye against a master.',
      role: 'Solo — design, build, typography',
      stack: ['Canvas', 'OpenType.js', 'Svelte'],
      status: 'archived',
      seed: 'kerning-type',
      body: [
        'A small teaching tool. You space a word by dragging glyphs; it scores you against the font designer’s own metrics and shows the delta as a set of coloured gutters.',
        'Archived because the interesting part — the scoring model — turned out to be the whole product, and it now lives inside a type foundry’s internal tooling.',
      ],
    },
  ] satisfies Project[],

  /* --- What I do --------------------------------------------------- */
  disciplines: [
    {
      title: 'Interface engineering',
      blurb:
        'Component systems that survive three redesigns. State machines instead of boolean soup. Motion that carries meaning.',
      tools: ['React', 'TypeScript', 'Motion', 'CSS architecture'],
    },
    {
      title: 'Systems & data',
      blurb:
        'API shapes designed backwards from the screen. Query paths measured, not guessed. Caches you can reason about.',
      tools: ['Go', 'Postgres', 'Rust', 'Event sourcing'],
    },
    {
      title: 'Design direction',
      blurb:
        'Type, grid and colour decided once and enforced in code. Prototypes that run rather than decks that describe.',
      tools: ['Figma', 'Typography', 'Design tokens', 'Prototyping'],
    },
    {
      title: 'Performance',
      blurb:
        'Budgets set before the first commit. Profiling on the devices people actually own, on the networks they actually have.',
      tools: ['Lighthouse', 'Web Vitals', 'Profiling', 'Tracing'],
    },
  ] satisfies Discipline[],

  /* --- Trajectory --------------------------------------------------- */
  timeline: [
    {
      period: '2025 —',
      org: 'Independent',
      role: 'Consulting engineer',
      note: 'Interface architecture and performance work for teams shipping data-heavy products.',
    },
    {
      period: '2022 — 2025',
      org: 'Northbound',
      role: 'Senior frontend engineer',
      note: 'Owned the design system and the query console. Cut median interaction latency by more than half.',
    },
    {
      period: '2020 — 2022',
      org: 'Studio Vitre',
      role: 'Designer / developer',
      note: 'Small team, wide surface. Brand systems that had to survive being implemented by someone else.',
    },
    {
      period: '2018 — 2020',
      org: 'Self-taught',
      role: 'Nights and weekends',
      note: 'Built things badly, then built them again. Still the most useful two years.',
    },
  ] satisfies TimelineEntry[],

  /* --- Marquee band ------------------------------------------------- */
  marquee: [
    'Interface engineering',
    'Design systems',
    'Realtime data',
    'Motion',
    'Performance budgets',
    'Type',
    'Accessibility',
  ],

  /* --- Elsewhere ----------------------------------------------------- */
  links: [
    { label: 'GitHub', href: 'https://github.com/', handle: '@el' },
    { label: 'Read.cv', href: 'https://read.cv/', handle: '/el' },
    { label: 'X', href: 'https://x.com/', handle: '@el' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', handle: '/in/el' },
  ],

  /* --- Colophon ------------------------------------------------------ */
  colophon: {
    typefaces: 'Fraunces, Inter Tight, JetBrains Mono',
    built: 'React, TypeScript, Motion, Lenis',
    note: 'Hand-built. No template, no page builder.',
  },
}

export type Site = typeof site
