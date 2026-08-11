import { useEffect, useRef, type HTMLAttributes } from 'react'
import { useReducedMotion } from '@/lib/hooks'
import './marquee.css'

/* ------------------------------------------------------------------
   Marquee.

   Driven by scroll velocity rather than a fixed CSS animation: it
   drifts at a base speed, accelerates while you scroll, and reverses
   when you scroll up. That connection to input is the difference
   between a marquee that feels alive and one that feels like a banner
   ad from 2004.
   ------------------------------------------------------------------ */

export function Marquee({ items, baseSpeed = 0.35 }: { items: readonly string[]; baseSpeed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const track = trackRef.current
    if (!track || reduced) return

    let raf = 0
    let offset = 0
    let velocity = 0
    let lastScroll = window.scrollY
    let direction = 1
    let halfWidth = track.scrollWidth / 2

    const measure = () => {
      halfWidth = track.scrollWidth / 2
    }

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScroll
      lastScroll = y
      if (delta !== 0) direction = delta > 0 ? 1 : -1
      // Clamped so a flick of the trackpad can't launch it into orbit.
      velocity = Math.min(14, Math.abs(delta) * 0.55)
    }

    const loop = () => {
      velocity *= 0.92
      offset -= direction * (baseSpeed + velocity)

      // Wrap on the duplicated half so the seam is never visible.
      if (halfWidth > 0) {
        if (offset <= -halfWidth) offset += halfWidth
        if (offset > 0) offset -= halfWidth
      }

      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(track)
    measure()

    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [baseSpeed, reduced])

  // The list is duplicated for seamless wrapping; only the first copy is
  // exposed to assistive tech.
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track" ref={trackRef}>
        <MarqueeRun items={items} />
        <MarqueeRun items={items} aria-hidden="true" />
      </div>
    </div>
  )
}

function MarqueeRun({
  items,
  ...rest
}: { items: readonly string[] } & HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="marquee__run" {...rest}>
      {items.map((item, i) => (
        <li className="marquee__item" key={`${item}-${i}`}>
          <span className="marquee__dot" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}
