import { site } from '@/content/site.config'
import { SectionHead } from '@/components/SectionHead'
import { Marquee } from '@/components/Marquee'
import { Reveal, RevealText } from '@/components/Reveal'
import './capabilities.css'

/* ------------------------------------------------------------------
   Capabilities.

   Deliberately not a wall of technology logos. Four disciplines, each
   with a sentence that says what I do with it, and the tool names
   demoted to small type — because the tools are the least interesting
   thing about the work.
   ------------------------------------------------------------------ */

export function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="shell">
        <SectionHead
          id="capabilities-title"
          index="03"
          label="Capabilities"
          title="Four ways I'm useful"
          aside={<p>Usually two or three at once — that overlap is the point.</p>}
        />
      </div>

      <Marquee items={site.marquee} />

      <div className="shell">
        <ul className="cap__grid grid12">
          {site.disciplines.map((d, i) => (
            <li className="cap" key={d.title}>
              <Reveal delay={i * 0.06} y={18}>
                <article className="cap__card">
                  <span className="cap__n label">{String(i + 1).padStart(2, '0')}</span>

                  <h3 className="cap__title">
                    <RevealText>{d.title}</RevealText>
                  </h3>

                  <p className="cap__blurb muted">{d.blurb}</p>

                  <ul className="cap__tools">
                    {d.tools.map((t) => (
                      <li className="cap__tool" key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
