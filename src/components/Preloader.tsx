import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks'
import { lockScroll } from '@/lib/scroll'
import { site } from '@/content/site.config'
import './preloader.css'

/* ------------------------------------------------------------------
   Preloader.

   Two jobs: hide the font swap, and set the tone before the first
   scroll. It counts real progress where it can (document readiness +
   font loading) rather than faking a bar, and it never blocks for
   longer than MAX_MS even if something hangs.
   ------------------------------------------------------------------ */

/** Hard ceiling. Nobody should ever wait longer than this to see the page. */
const MAX_MS = 2200

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(true)
  const finished = useRef(false)

  useEffect(() => {
    if (reduced) {
      setOpen(false)
      onDone()
      return
    }

    lockScroll(true)

    let raf = 0
    const started = performance.now()
    // Real signals we can wait on. Fonts matter most — the whole design
    // is typographic, so painting in a fallback would be a visible lie.
    let ready = 0
    const bump = () => {
      ready += 1
    }

    document.fonts?.ready.then(bump).catch(bump)
    if (document.readyState === 'complete') bump()
    else window.addEventListener('load', bump, { once: true })

    const tick = () => {
      const elapsed = performance.now() - started
      // Ease toward whichever is further along: elapsed time or real
      // readiness. Never reaches 100 until both agree.
      const byTime = Math.min(0.94, elapsed / MAX_MS)
      const byReady = ready / 2
      const target = Math.min(1, Math.max(byTime, byReady * 0.98))
      setCount((c) => {
        const next = c + (target * 100 - c) * 0.08
        return next > 99.4 ? 100 : next
      })

      if ((ready >= 2 && elapsed > 700) || elapsed > MAX_MS) {
        if (!finished.current) {
          finished.current = true
          setCount(100)
          window.setTimeout(() => setOpen(false), 420)
          window.setTimeout(() => {
            lockScroll(false)
            onDone()
          }, 1000)
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      lockScroll(false)
    }
  }, [reduced, onDone])

  if (reduced) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader__inner shell">
            <span className="preloader__mask">
              <motion.span
                className="preloader__word display"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {site.shortName}
              </motion.span>
            </span>

            <div className="preloader__meter" aria-hidden="true">
              <motion.div
                className="preloader__meter-fill"
                style={{ scaleX: count / 100 }}
              />
            </div>

            <span className="preloader__count label tabular">
              {String(Math.round(count)).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
