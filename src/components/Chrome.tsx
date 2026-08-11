import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useKey } from '@/lib/hooks'
import { scrollToId } from '@/lib/scroll'
import './chrome.css'

/* ------------------------------------------------------------------
   Page chrome: the persistent furniture that sits above the content.
   ------------------------------------------------------------------ */

/** Film grain. One SVG turbulence, tiled, no image request. */
export function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <svg className="grain__svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  )
}

/**
 * The column grid, revealed with `G`. A working tool rather than a
 * gimmick — it is how the layout was checked while building.
 */
export function GridOverlay() {
  const [on, setOn] = useState(false)
  useKey('g', () => setOn((v) => !v))

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          className="grid-overlay"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="shell grid12 grid-overlay__inner">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="grid-overlay__col" />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Right-hand rail: a hairline that fills with scroll progress, with a
 * tick per section. Doubles as navigation.
 */
export function ScrollRail({
  sections,
  active,
}: {
  sections: { id: string; label: string }[]
  active: string
}) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <nav className="rail" aria-label="Section progress">
      <div className="rail__track" aria-hidden="true">
        <motion.div className="rail__fill" style={{ scaleY: progress }} />
      </div>
      <ul className="rail__list">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`rail__tick ${active === s.id ? 'is-active' : ''}`}
              onClick={() => scrollToId(s.id)}
              aria-current={active === s.id ? 'true' : undefined}
            >
              <span className="rail__tick-label">{s.label}</span>
              <span className="rail__tick-mark" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Discoverability for the keyboard shortcuts, shown once then dismissed. */
export function ShortcutHint() {
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    try {
      if (!localStorage.getItem('hint-seen')) setSeen(false)
    } catch {
      /* ignore */
    }
  }, [])

  const dismiss = () => {
    setSeen(true)
    try {
      localStorage.setItem('hint-seen', '1')
    } catch {
      /* ignore */
    }
  }

  useKey('escape', dismiss)

  return (
    <AnimatePresence>
      {!seen && (
        <motion.aside
          className="hint"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 2.4 }}
        >
          <p className="label hint__text">
            Press <kbd>G</kbd> for the grid · <kbd>T</kbd> for theme
          </p>
          <button type="button" className="hint__close" onClick={dismiss} aria-label="Dismiss hint">
            ×
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
