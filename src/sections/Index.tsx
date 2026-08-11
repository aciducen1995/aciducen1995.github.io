import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { site } from '@/content/site.config'
import { SectionHead } from '@/components/SectionHead'
import { Reveal, RevealText } from '@/components/Reveal'
import { useReducedMotion } from '@/lib/hooks'
import './index-section.css'

/* ------------------------------------------------------------------
   Index — the "about" section, framed as a table of contents for the
   person rather than a biography. Prose on the left, principles as a
   numbered list on the right, each one revealing on its own beat.
   ------------------------------------------------------------------ */

export function IndexSection() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // A very small counter-drift on the prose column. Any more and it
  // becomes a parallax demo instead of a page.
  const driftY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['4%', '-4%'])

  return (
    <section className="section index-sec" id="index" aria-labelledby="index-title">
      <div className="shell">
        <SectionHead
          id="index-title"
          index="01"
          label="Index"
          title="What I actually do"
          aside={<p>Written in plain language, because the work is the credential.</p>}
        />

        <div className="index-sec__body grid12" ref={ref}>
          <motion.div className="index-sec__prose" style={{ y: driftY }}>
            {site.intro.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="prose">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2} className="index-sec__sig">
              <span className="label">Signed</span>
              <span className="index-sec__sig-name display">{site.shortName}</span>
            </Reveal>
          </motion.div>

          <ol className="index-sec__principles">
            {site.principles.map((p, i) => (
              <Principle key={p.n} n={p.n} title={p.title} text={p.text} delay={i * 0.05} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Principle({
  n,
  title,
  text,
  delay,
}: {
  n: string
  title: string
  text: string
  delay: number
}) {
  return (
    <li className="principle">
      <Reveal delay={delay} y={16}>
        <div className="principle__inner">
          <span className="principle__n label">{n}</span>
          <div className="principle__text">
            <h3 className="principle__title">
              <RevealText>{title}</RevealText>
            </h3>
            <p className="principle__body muted">{text}</p>
          </div>
        </div>
      </Reveal>
    </li>
  )
}
