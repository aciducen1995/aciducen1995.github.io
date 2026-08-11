import { useMemo } from 'react'
import { makeRng } from '@/lib/rng'
import './plate.css'

/* ------------------------------------------------------------------
   Plate — generative artwork for a project.

   Deliberately *not* a screenshot and not stock imagery. Each plate is
   a deterministic composition drawn from the project's seed: a ruled
   field, two or three geometric figures, and exactly one accent mark.
   Same seed → same plate, forever.
   ------------------------------------------------------------------ */

const W = 480
const H = 360

type Props = {
  seed: string
  className?: string
  /** Rendered into the SVG title for assistive tech. */
  label: string
}

type Figure = { d: string; fill?: boolean; width: number }

function compose(seed: string) {
  const rng = makeRng(seed)

  /* --- The ruled field: vertical hairlines with a drifting gap ----- */
  const rules: number[] = []
  let x = rng.range(8, 26)
  const gap = rng.range(9, 17)
  while (x < W) {
    rules.push(x)
    x += gap * rng.range(0.65, 1.5)
  }

  /* --- Halftone band ------------------------------------------------ */
  const bandY = rng.range(H * 0.15, H * 0.6)
  const bandH = rng.range(50, 120)
  const dotStep = rng.range(11, 18)
  const dots: { cx: number; cy: number; r: number }[] = []
  for (let dy = bandY; dy < bandY + bandH; dy += dotStep) {
    for (let dx = rng.range(0, dotStep); dx < W; dx += dotStep) {
      // Radius falls off toward the band edges — reads as a gradient
      // without ever using one.
      const t = 1 - Math.abs((dy - (bandY + bandH / 2)) / (bandH / 2))
      const r = Math.max(0, t * (dotStep * 0.28) * rng.range(0.55, 1.15))
      if (r > 0.35) dots.push({ cx: dx, cy: dy, r })
    }
  }

  /* --- Figures ------------------------------------------------------ */
  const figures: Figure[] = []
  const count = rng.int(2, 3)

  for (let i = 0; i < count; i += 1) {
    const kind = rng.pick(['arc', 'ring', 'quad', 'chevron'] as const)
    const cx = rng.range(W * 0.2, W * 0.82)
    const cy = rng.range(H * 0.22, H * 0.78)
    const s = rng.range(52, 130)
    const width = rng.range(1, 2.4)

    if (kind === 'ring') {
      figures.push({
        d: `M ${cx - s} ${cy} a ${s} ${s} 0 1 0 ${s * 2} 0 a ${s} ${s} 0 1 0 ${-s * 2} 0`,
        width,
      })
    } else if (kind === 'arc') {
      const sweep = rng.chance(0.5) ? 1 : 0
      figures.push({
        d: `M ${cx - s} ${cy} A ${s} ${s} 0 0 ${sweep} ${cx + s} ${cy}`,
        width: width * 1.4,
      })
    } else if (kind === 'quad') {
      const w = s * rng.range(0.8, 1.6)
      const h = s * rng.range(0.5, 1.2)
      figures.push({
        d: `M ${cx - w / 2} ${cy - h / 2} h ${w} v ${h} h ${-w} Z`,
        width,
      })
    } else {
      const w = s * rng.range(0.7, 1.3)
      figures.push({
        d: `M ${cx - w} ${cy + w * 0.5} L ${cx} ${cy - w * 0.5} L ${cx + w} ${cy + w * 0.5}`,
        width: width * 1.6,
      })
    }
  }

  /* --- Exactly one accent mark -------------------------------------- */
  const accent = rng.chance(0.5)
    ? {
        kind: 'dot' as const,
        cx: rng.range(W * 0.12, W * 0.88),
        cy: rng.range(H * 0.12, H * 0.88),
        r: rng.range(5, 13),
      }
    : {
        kind: 'bar' as const,
        cx: rng.range(W * 0.1, W * 0.7),
        cy: rng.range(H * 0.12, H * 0.86),
        r: rng.range(46, 130),
      }

  const rotation = rng.range(-4, 4)

  return { rules, dots, figures, accent, rotation }
}

export function Plate({ seed, className, label }: Props) {
  const art = useMemo(() => compose(seed), [seed])
  const titleId = `plate-${seed.replace(/[^a-z0-9]/gi, '')}`

  return (
    <svg
      className={`plate ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid slice"
    >
      <title id={titleId}>{`Generative plate for ${label}`}</title>

      <rect width={W} height={H} className="plate__ground" />

      <g className="plate__rules">
        {art.rules.map((x, i) => (
          <line key={i} x1={x} y1={0} x2={x} y2={H} />
        ))}
      </g>

      <g className="plate__dots">
        {art.dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>

      <g
        className="plate__figures"
        transform={`rotate(${art.rotation.toFixed(2)} ${W / 2} ${H / 2})`}
      >
        {art.figures.map((f, i) => (
          <path key={i} d={f.d} strokeWidth={f.width} />
        ))}
      </g>

      <g className="plate__accent">
        {art.accent.kind === 'dot' ? (
          <circle cx={art.accent.cx} cy={art.accent.cy} r={art.accent.r} />
        ) : (
          <rect
            x={art.accent.cx}
            y={art.accent.cy}
            width={art.accent.r}
            height={3}
          />
        )}
      </g>
    </svg>
  )
}
