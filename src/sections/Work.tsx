import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site, type Project } from '@/content/site.config'
import { SectionHead } from '@/components/SectionHead'
import { Plate } from '@/components/Plate'
import { RevealText } from '@/components/Reveal'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'
import './work.css'

/* ------------------------------------------------------------------
   Work.

   A list, not a card grid. Cards flatten everything to the same
   importance; a list lets the title carry the weight and keeps the
   eye moving down the page.

   Two interactions:
     · hovering a row floats that project's plate near the cursor
     · activating a row expands the case in place (no route change,
       no modal, no lost scroll position)
   ------------------------------------------------------------------ */

export function Work() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const fine = useFinePointer()

  const hovered = site.projects.find((p) => p.id === hoverId) ?? null

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="shell">
        <SectionHead
          id="work-title"
          index="02"
          label="Selected work"
          title="Four things worth showing"
          aside={<p>Open a row for the reasoning behind it.</p>}
        />

        <ul
          className="work__list"
          onMouseLeave={() => setHoverId(null)}
        >
          {site.projects.map((project) => (
            <Row
              key={project.id}
              project={project}
              open={openId === project.id}
              onToggle={() => setOpenId((id) => (id === project.id ? null : project.id))}
              onHover={() => setHoverId(project.id)}
            />
          ))}
        </ul>
      </div>

      {fine && <FloatingPlate project={hovered} suppressed={openId !== null} />}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Row({
  project,
  open,
  onToggle,
  onHover,
}: {
  project: Project
  open: boolean
  onToggle: () => void
  onHover: () => void
}) {
  const panelId = `case-${project.id}`

  return (
    <li className={`work-row ${open ? 'is-open' : ''}`} onMouseEnter={onHover}>
      <h3 className="work-row__heading">
        <button
          type="button"
          className="work-row__trigger"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          data-cursor="view"
          data-cursor-label={open ? 'Close' : 'Open'}
        >
          <span className="work-row__index label">{project.index}</span>

          <span className="work-row__title display">
            <RevealText>{project.title}</RevealText>
          </span>

          <span className="work-row__summary muted">{project.summary}</span>

          <span className="work-row__tail">
            <span className={`work-row__status work-row__status--${project.status.replace(' ', '-')}`}>
              {project.status}
            </span>
            <span className="work-row__year label tabular">{project.year}</span>
            <span className="work-row__chevron" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            </span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && <CaseDetail id={panelId} project={project} />}
      </AnimatePresence>
    </li>
  )
}

/* ------------------------------------------------------------------ */

function CaseDetail({ id, project }: { id: string; project: Project }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      id={id}
      className="case"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { duration: reduced ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.1 },
      }}
    >
      <div className="case__inner grid12">
        <div className="case__plate">
          <Plate seed={project.seed} label={project.title} />
        </div>

        <div className="case__body">
          {project.body.map((para, i) => (
            <p className="case__para" key={i}>
              {para}
            </p>
          ))}

          {project.metrics && (
            <dl className="case__metrics">
              {project.metrics.map((m) => (
                <div className="case__metric" key={m.label}>
                  <dt className="case__metric-value tabular">{m.value}</dt>
                  <dd className="case__metric-label label">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="case__facts">
          <Fact label="Role" value={project.role} />
          <Fact label="Stack" value={project.stack.join(' · ')} />
          <Fact label="Year" value={project.year} />

          {(project.href || project.repo) && (
            <div className="case__links">
              {project.href && (
                <a className="case__link" href={project.href} data-cursor="link" data-cursor-label="Visit">
                  Visit site
                  <Arrow />
                </a>
              )}
              {project.repo && (
                <a className="case__link" href={project.repo} data-cursor="link" data-cursor-label="Code">
                  Source
                  <Arrow />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <dt className="label">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function Arrow() {
  return (
    <svg className="case__arrow" viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
  )
}

/* ------------------------------------------------------------------
   The plate that trails the cursor. Kept outside React's render loop —
   position is written straight to the transform every frame.
   ------------------------------------------------------------------ */

function FloatingPlate({ project, suppressed }: { project: Project | null; suppressed: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const visible = Boolean(project) && !suppressed && !reduced

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty

    const loop = () => {
      cx += (tx - cx) * 0.1
      cy += (ty - cy) * 0.1
      // Rotation derived from horizontal velocity — the plate leans into
      // the direction of travel, then levels off.
      const lean = Math.max(-9, Math.min(9, (tx - cx) * 0.09))
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${lean.toFixed(2)}deg)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={ref} className={`float-plate ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <AnimatePresence mode="wait">
        {project && (
          <motion.div
            key={project.id}
            className="float-plate__inner"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Plate seed={project.seed} label={project.title} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
