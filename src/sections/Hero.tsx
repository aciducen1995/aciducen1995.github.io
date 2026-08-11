import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { site } from '@/content/site.config'
import { FieldCanvas } from '@/components/FieldCanvas'
import { useLocalTime, useReducedMotion } from '@/lib/hooks'
import { scrollToId } from '@/lib/scroll'
import './hero.css'

/* ------------------------------------------------------------------
   Hero.

   One idea: the name is the object on the page, everything else is
   annotation around it. The headline lines rise out of masks on load
   (not on scroll — this is above the fold), then drift on a small
   parallax as you leave.
   ------------------------------------------------------------------ */

const LINE = {
  hidden: { y: '112%' },
  shown: (i: number) => ({
    y: '0%',
    transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 + i * 0.09 },
  }),
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const time = useLocalTime(site.timezone)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0.25])

  return (
    <section className="hero" id="top" ref={ref}>
      <FieldCanvas className="hero__field" />

      <motion.div className="hero__inner shell" style={{ y, opacity }}>
        <p className="hero__eyebrow label">
          <span className={`hero__status ${site.availability.open ? 'is-open' : ''}`} aria-hidden="true" />
          {site.availability.note}
        </p>

        <h1 className="hero__title display">
          <span className="sr-only">
            {site.name} — {site.role}
          </span>
          {site.headline.map((line, i) => (
            <span className="hero__line" key={line} aria-hidden="true">
              <motion.span
                className="hero__line-inner"
                custom={i}
                variants={LINE}
                initial={reduced ? 'shown' : 'hidden'}
                animate={ready || reduced ? 'shown' : 'hidden'}
              >
                {line}
                {i === site.headline.length - 1 && <span className="hero__period">.</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero__meta">
          <Meta label="Who" value={site.name} delay={0.85} ready={ready} />
          <Meta label="What" value={site.role} delay={0.92} ready={ready} />
          <Meta label="Where" value={`${site.location} · ${time}`} delay={0.99} ready={ready} />
        </div>
      </motion.div>

      <motion.button
        type="button"
        className="hero__cue"
        onClick={() => scrollToId('index')}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="label">Scroll</span>
        <span className="hero__cue-track" aria-hidden="true">
          <span className="hero__cue-dot" />
        </span>
      </motion.button>
    </section>
  )
}

function Meta({
  label,
  value,
  delay,
  ready,
}: {
  label: string
  value: string
  delay: number
  ready: boolean
}) {
  return (
    <motion.div
      className="hero__meta-item"
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <span className="label hero__meta-label">{label}</span>
      <span className="hero__meta-value tabular">{value}</span>
    </motion.div>
  )
}
