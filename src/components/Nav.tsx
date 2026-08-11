import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { site } from '@/content/site.config'
import { useKey, useLocalTime, useMagnetic, useTheme } from '@/lib/hooks'
import { lockScroll, scrollToId } from '@/lib/scroll'
import './nav.css'

/* ------------------------------------------------------------------
   Nav.

   Hides on scroll down, returns on scroll up — the standard behaviour,
   but with the header's own rule animating rather than the whole bar
   snapping, so it reads as one object rather than two.
   ------------------------------------------------------------------ */

type Section = { id: string; label: string }

export function Nav({ sections, active }: { sections: Section[]; active: string }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, toggleTheme] = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const time = useLocalTime(site.timezone)

  useKey('t', toggleTheme)
  useKey('escape', () => setMenuOpen(false))

  useEffect(() => {
    lockScroll(menuOpen)
    // The bar must never be mid-hide while it is hosting the menu.
    if (menuOpen) setHidden(false)
    return () => lockScroll(false)
  }, [menuOpen])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    // 8px of hysteresis so a trackpad's micro-jitter can't flicker it.
    if (y > prev + 8 && y > 260) setHidden(true)
    else if (y < prev - 8) setHidden(false)
  })

  return (
    <motion.header
      className={`nav ${scrolled ? 'is-scrolled' : ''}`}
      animate={{ y: hidden ? '-105%' : '0%' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav__inner shell">
        <button
          type="button"
          className="nav__brand"
          onClick={() => scrollToId('top')}
          data-cursor="link"
          data-cursor-label="Top"
        >
          <span className="nav__monogram">{site.monogram}</span>
          <span className="sr-only">Back to top — {site.name}</span>
        </button>

        <nav className="nav__links" aria-label="Sections">
          {sections.map((s, i) => (
            <NavLink
              key={s.id}
              section={s}
              index={String(i + 1).padStart(2, '0')}
              active={active === s.id}
            />
          ))}
        </nav>

        <div className="nav__meta">
          <span className="label tabular nav__clock" title={`Local time in ${site.location}`}>
            {site.location} {time}
          </span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <button
            type="button"
            className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="nav__burger-bar" aria-hidden="true" />
            <span className="nav__burger-bar" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="nav__rule" />

      <MobileMenu
        id="mobile-menu"
        open={menuOpen}
        sections={sections}
        onNavigate={(id) => {
          setMenuOpen(false)
          // Let the overlay begin lifting before the scroll starts, or the
          // two motions fight each other.
          window.setTimeout(() => scrollToId(id), 220)
        }}
      />
    </motion.header>
  )
}

function MobileMenu({
  id,
  open,
  sections,
  onNavigate,
}: {
  id: string
  open: boolean
  sections: Section[]
  onNavigate: (id: string) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          className="menu"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="menu__inner shell">
            <ul className="menu__list">
              {sections.map((s, i) => (
                <li key={s.id} className="menu__item">
                  <motion.button
                    type="button"
                    className="menu__link display"
                    onClick={() => onNavigate(s.id)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%', transition: { duration: 0.3 } }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.14 + i * 0.055,
                    }}
                  >
                    <span className="menu__index label">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </motion.button>
                </li>
              ))}
            </ul>

            <div className="menu__foot">
              <a className="label" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <span className="label">{site.location}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavLink({
  section,
  index,
  active,
}: {
  section: Section
  index: string
  active: boolean
}) {
  return (
    <button
      type="button"
      className={`nav__link ${active ? 'is-active' : ''}`}
      onClick={() => scrollToId(section.id)}
      aria-current={active ? 'true' : undefined}
    >
      <span className="nav__link-index label" aria-hidden="true">
        {index}
      </span>
      <span className="nav__link-text">{section.label}</span>
    </button>
  )
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const ref = useMagnetic<HTMLButtonElement>(0.4, 40)
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    setAnnounce(`${theme} theme`)
  }, [theme])

  return (
    <button
      ref={ref}
      type="button"
      className="nav__theme magnetic"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title="Toggle theme — T"
    >
      <span className="nav__theme-dial" data-theme-state={theme} />
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </button>
  )
}
