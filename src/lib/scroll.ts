import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from './hooks'

/* ------------------------------------------------------------------
   Smooth scrolling.

   Lenis is initialised once and parked on the module so anything can
   ask it to scroll without prop-drilling a ref. When the visitor
   prefers reduced motion we never construct it at all — native
   scrolling is left completely alone.
   ------------------------------------------------------------------ */

let instance: Lenis | null = null

export function useSmoothScroll() {
  const reduced = useReducedMotion()
  const raf = useRef(0)

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly overshooting ease — gives the page weight without drift.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      syncTouch: false,
    })

    instance = lenis

    const loop = (time: number) => {
      lenis.raf(time)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf.current)
      lenis.destroy()
      instance = null
    }
  }, [reduced])
}

/** Scroll to an element id, honouring reduced motion and Lenis alike. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  if (instance) {
    instance.scrollTo(el, { offset: -12, duration: 1.2 })
  } else {
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
  // Move focus for keyboard and screen-reader users, without a second scroll.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Freeze the page — used while the preloader and the menu are open. */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
