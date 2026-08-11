import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'
import './cursor.css'

/* ------------------------------------------------------------------
   Cursor.

   The native cursor is kept — it is never hidden, because hiding it is
   how custom cursors become an accessibility problem. What we add is a
   trailing ring that lags slightly behind and changes state over
   interactive elements.

   Any element can drive it with `data-cursor="view|link|drag"` and
   `data-cursor-label="..."`.
   ------------------------------------------------------------------ */

type Mode = 'default' | 'view' | 'link' | 'drag'

export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!fine || reduced) return

    const el = ring.current
    if (!el) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let seeded = false

    const loop = () => {
      // Lag factor of 0.18 gives ~90ms of trail: enough to feel alive,
      // little enough that it never feels broken.
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!seeded) {
        cx = tx
        cy = ty
        seeded = true
        setVisible(true)
      }

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      if (target) {
        setMode((target.dataset.cursor as Mode) || 'link')
        setLabel(target.dataset.cursorLabel ?? '')
      } else {
        setMode('default')
        setLabel('')
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null

  return (
    <div
      ref={ring}
      className={`cursor cursor--${mode} ${visible ? 'is-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="cursor__label">{label}</span>
    </div>
  )
}
