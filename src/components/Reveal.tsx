import { type ElementType, type ReactNode, useMemo } from 'react'
import { motion, type Variants } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks'
import './reveal.css'

/* ------------------------------------------------------------------
   Reveal primitives.

   One rule governs all of them: text rises out of a mask, it never
   fades in from nowhere and it never slides in from the side. The mask
   implies the text was always there and the page simply uncovered it.
   ------------------------------------------------------------------ */

const RISE: Variants = {
  hidden: { y: '108%' },
  shown: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.045,
    },
  }),
}

type RevealTextProps = {
  children: string
  /** element to render. Defaults to a span so it inherits type styles. */
  as?: ElementType
  className?: string
  /** Extra delay in seconds before the first word moves. */
  delay?: number
  /** `word` reads better for headlines; `line` for long paragraphs. */
  split?: 'word' | 'line'
  once?: boolean
}

export function RevealText({
  children,
  as: Tag = 'span',
  className = '',
  delay = 0,
  split = 'word',
  once = true,
}: RevealTextProps) {
  const reduced = useReducedMotion()

  const parts = useMemo(
    () => (split === 'word' ? children.split(/(\s+)/).filter((s) => s.trim()) : [children]),
    [children, split],
  )

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag className={`reveal ${className}`}>
      {/* The accessible copy — one clean string, not a pile of spans. */}
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {parts.map((part, i) => (
          <span className="reveal__mask" key={`${part}-${i}`}>
            <motion.span
              className="reveal__inner"
              variants={RISE}
              custom={i + delay / 0.045}
              initial="hidden"
              whileInView="shown"
              viewport={{ once, amount: 0.55, margin: '0px 0px -6% 0px' }}
            >
              {part}
            </motion.span>
            {split === 'word' && i < parts.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  )
}

/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Distance travelled, in px. Keep small — this is a settle, not a slide. */
  y?: number
  once?: boolean
}

/** Generic block reveal: a short rise with a fade, for non-text content. */
export function Reveal({ children, className = '', delay = 0, y = 22, once = true }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */

/** A hairline that draws itself left-to-right when it enters view. */
export function DrawRule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion()

  if (reduced) return <hr className={`rule ${className}`} />

  return (
    <motion.hr
      className={`rule draw-rule ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
    />
  )
}
