/* ------------------------------------------------------------------
   Deterministic pseudo-randomness.

   Project artwork is generated, not photographed — but it must be
   stable: the same project must draw the same plate on every render,
   every reload, every machine. cyrb128 + sfc32 gives us a tiny,
   well-distributed seeded PRNG with no dependency.
   ------------------------------------------------------------------ */

function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703
  let h2 = 3144134277
  let h3 = 1013904242
  let h4 = 2773480762

  for (let i = 0; i < str.length; i += 1) {
    const k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }

  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ]
}

export type Rng = {
  /** Float in [0, 1). */
  next: () => number
  /** Float in [min, max). */
  range: (min: number, max: number) => number
  /** Integer in [min, max]. */
  int: (min: number, max: number) => number
  /** Uniform pick from a list. */
  pick: <T>(items: readonly T[]) => T
  /** True with probability p. */
  chance: (p: number) => boolean
}

export function makeRng(seed: string): Rng {
  const [a0, b0, c0, d0] = cyrb128(seed)
  let a = a0
  let b = b0
  let c = c0
  let d = d0

  const next = () => {
    a >>>= 0
    b >>>= 0
    c >>>= 0
    d >>>= 0
    let t = (a + b) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    d = (d + 1) | 0
    t = (t + d) | 0
    c = (c + t) | 0
    return (t >>> 0) / 4294967296
  }

  // Discard the first few values — sfc32 needs a moment to mix.
  for (let i = 0; i < 12; i += 1) next()

  const range = (min: number, max: number) => min + next() * (max - min)

  return {
    next,
    range,
    int: (min, max) => Math.floor(range(min, max + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    chance: (p) => next() < p,
  }
}
