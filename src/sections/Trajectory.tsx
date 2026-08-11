import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { site } from '@/content/site.config'
import { SectionHead } from '@/components/SectionHead'
import { Reveal, RevealText } from '@/components/Reveal'
import './trajectory.css'

/* ------------------------------------------------------------------
   Trajectory.

   A CV without the CV formatting. The vertical rule fills as you read
   through it, which is the only progress indicator on the page that is
   scoped to a single section — it makes the list feel finite.
   ------------------------------------------------------------------ */

export function Trajectory() {
  const ref = useRef<HTMLOListElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 78%', 'end 62%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 })

  return (
    <section className="section trajectory" id="trajectory" aria-labelledby="trajectory-title">
      <div className="shell">
        <SectionHead
          id="trajectory-title"
          index="04"
          label="Trajectory"
          title="How I got here"
          aside={<p>Shortened. The full version is available on request.</p>}
        />

        <div className="traj">
          <div className="traj__spine" aria-hidden="true">
            <motion.span className="traj__spine-fill" style={{ scaleY: fill }} />
          </div>

          <ol className="traj__list" ref={ref}>
            {site.timeline.map((entry, i) => (
              <li className="traj__item" key={entry.org}>
                <Reveal delay={i * 0.05} y={18}>
                  <div className="traj__row grid12">
                    <span className="traj__period label tabular">{entry.period}</span>

                    <h3 className="traj__org">
                      <RevealText>{entry.org}</RevealText>
                    </h3>

                    <p className="traj__role">{entry.role}</p>
                    <p className="traj__note muted">{entry.note}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
