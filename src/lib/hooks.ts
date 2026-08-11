import { useCallback, useEffect, useRef, useState } from 'react'

/* ==================================================================
   Small, dependency-free hooks shared across the site.
   Each one is written to degrade safely: SSR-less, but guarded for
   missing APIs, and every motion hook checks reduced-motion itself so
   callers cannot forget.
   ================================================================== */

/** Subscribe to a media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True when the visitor has asked the OS to reduce motion. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** True for mouse/trackpad users. Touch devices get no cursor effects. */
export const useFinePointer = () => useMediaQuery('(pointer: fine)')

/**
 * Magnetic hover: the element leans toward the cursor and springs back.
 * Applied via CSS custom properties so the element keeps its own
 * transform stack (useful when Motion is also animating it).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 90) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !fine) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const tick = () => {
      cx += (tx - cx) * 0.16
      cy += (ty - cy) * 0.16
      el.style.setProperty('--mx', `${cx.toFixed(2)}px`)
      el.style.setProperty('--my', `${cy.toFixed(2)}px`)
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const falloff = Math.max(0, 1 - dist / (Math.max(r.width, r.height) / 2 + radius))
      tx = dx * strength * falloff
      ty = dy * strength * falloff
      start()
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      start()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      el.style.removeProperty('--mx')
      el.style.removeProperty('--my')
    }
  }, [strength, radius, reduced, fine])

  return ref
}

const GLYPHS = '▚▞░▒█/\\<>*+=-_:.#%$&@'

/**
 * Text that resolves out of noise, character by character.
 * Returns the current string plus a `run` trigger.
 */
export function useScramble(target: string, { speed = 28, hold = 2 } = {}) {
  const reduced = useReducedMotion()
  const [output, setOutput] = useState(target)
  const timer = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  const run = useCallback(() => {
    if (reduced) {
      setOutput(target)
      return
    }
    stop()
    let frame = 0
    const total = target.length * hold + 8

    timer.current = window.setInterval(() => {
      frame += 1
      const revealed = Math.floor(frame / hold)
      let next = ''
      for (let i = 0; i < target.length; i += 1) {
        const ch = target[i]
        if (ch === ' ') next += ' '
        else if (i < revealed) next += ch
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setOutput(next)
      if (frame >= total) {
        setOutput(target)
        stop()
      }
    }, speed)
  }, [target, speed, hold, reduced, stop])

  useEffect(() => {
    setOutput(target)
    return stop
  }, [target, stop])

  return { output, run, stop }
}

/** Live clock in an arbitrary IANA timezone. Ticks once a second. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState('')

  useEffect(() => {
    let fmt: Intl.DateTimeFormat
    try {
      fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    } catch {
      // Unknown zone (very old engines) — fall back to the visitor's own.
      fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    }

    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])

  return time
}

export type Theme = 'dark' | 'light'

/** Theme with persistence, applied to <html data-theme>. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}

/** Register a single-key shortcut, ignoring keystrokes aimed at inputs. */
export function useKey(key: string, handler: () => void) {
  const saved = useRef(handler)
  saved.current = handler

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        saved.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key])
}

/**
 * Tracks which section is currently occupying the reading position.
 * Used by the nav and the progress rail.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        // Choose the entry closest to 40% viewport height — the spot the
        // eye actually rests on — rather than whichever fired last.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}
