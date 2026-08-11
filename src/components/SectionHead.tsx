import type { ReactNode } from 'react'
import { DrawRule, RevealText } from './Reveal'
import './section-head.css'

/* ------------------------------------------------------------------
   Every section opens the same way: a hairline, an index number, a
   label, and a headline. Repetition is the point — it is what makes
   the page feel authored rather than assembled.
   ------------------------------------------------------------------ */

export function SectionHead({
  index,
  label,
  title,
  aside,
  id,
}: {
  index: string
  label: string
  title: string
  aside?: ReactNode
  id?: string
}) {
  return (
    <header className="sec-head">
      <DrawRule />
      <div className="sec-head__row grid12">
        <p className="sec-head__meta label">
          <span className="accent">{index}</span>
          <span aria-hidden="true">—</span>
          {label}
        </p>

        <h2 className="sec-head__title headline" id={id}>
          <RevealText>{title}</RevealText>
        </h2>

        {aside ? <div className="sec-head__aside">{aside}</div> : null}
      </div>
    </header>
  )
}
