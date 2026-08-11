import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks'
import './field.css'

/* ------------------------------------------------------------------
   FieldCanvas — the hero's background.

   A ruled dot field that swells under the pointer and breathes on a
   slow sine. It is the only ambient animation on the site, so it is
   held to strict rules:

     · pauses entirely when scrolled out of view or the tab is hidden
     · caps device pixel ratio at 2 (retina gains nothing past that)
     · falls back to a static field under prefers-reduced-motion
     · never captures pointer events
   ------------------------------------------------------------------ */

const SPACING = 34
const MAX_DPR = 2
const INFLUENCE = 170

export function FieldCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let running = true
    let t = 0

    // Pointer in CSS pixels, parked far away so nothing is lit at rest.
    const pointer = { x: -9999, y: -9999, active: false }

    const readInk = () => {
      const styles = getComputedStyle(document.documentElement)
      return {
        ink: styles.getPropertyValue('--ink').trim() || '#eeeae2',
        accent: styles.getPropertyValue('--accent').trim() || '#ff5a38',
      }
    }
    let palette = readInk()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      const cols = Math.ceil(width / SPACING) + 1
      const rows = Math.ceil(height / SPACING) + 1
      const offsetX = (width - (cols - 1) * SPACING) / 2
      const offsetY = (height - (rows - 1) * SPACING) / 2

      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const x = offsetX + i * SPACING
          const y = offsetY + j * SPACING

          // Slow diagonal wave — the field's resting heartbeat.
          const wave = Math.sin((x + y) * 0.006 + t * 0.0009) * 0.5 + 0.5

          let r = 0.7 + wave * 0.7
          let push = 0

          if (pointer.active) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            const dist = Math.hypot(dx, dy)
            if (dist < INFLUENCE) {
              const f = 1 - dist / INFLUENCE
              const eased = f * f
              r += eased * 2.6
              push = eased * 13
              // Displace away from the cursor along the radius.
              const angle = Math.atan2(dy, dx)
              ctx.beginPath()
              ctx.arc(x + Math.cos(angle) * push, y + Math.sin(angle) * push, r, 0, Math.PI * 2)
              ctx.fillStyle = eased > 0.62 ? palette.accent : palette.ink
              ctx.globalAlpha = 0.18 + eased * 0.55
              ctx.fill()
              continue
            }
          }

          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = palette.ink
          ctx.globalAlpha = 0.1 + wave * 0.1
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      t = now
      draw()
      if (running) raf = requestAnimationFrame(loop)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active =
        pointer.x > -INFLUENCE &&
        pointer.x < rect.width + INFLUENCE &&
        pointer.y > -INFLUENCE &&
        pointer.y < rect.height + INFLUENCE
    }

    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()

    if (reduced) {
      running = false
      draw()
    } else {
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!running) draw()
    })
    ro.observe(canvas)

    // Stop drawing the moment the hero leaves the viewport.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => {
      palette = readInk()
      if (!running) draw()
    }

    // Theme changes swap the CSS variables the canvas samples.
    const mo = new MutationObserver(onTheme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className={`field ${className}`} aria-hidden="true" />
}
