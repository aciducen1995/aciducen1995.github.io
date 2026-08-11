import { site } from '@/content/site.config'
import { useLocalTime } from '@/lib/hooks'
import { scrollToId } from '@/lib/scroll'
import './footer.css'

/* ------------------------------------------------------------------
   Footer.

   Colophon rather than sitemap. If someone has read this far they
   want to know what it was built with, not to be sold a newsletter.
   ------------------------------------------------------------------ */

export function Footer() {
  const time = useLocalTime(site.timezone)
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top grid12">
          <div className="footer__col">
            <span className="label">Colophon</span>
            <p className="footer__text">
              Set in {site.colophon.typefaces}. Built with {site.colophon.built}.{' '}
              {site.colophon.note}
            </p>
          </div>

          <div className="footer__col">
            <span className="label">Shortcuts</span>
            <ul className="footer__keys">
              <li>
                <kbd>G</kbd> grid overlay
              </li>
              <li>
                <kbd>T</kbd> theme
              </li>
              <li>
                <kbd>Esc</kbd> close
              </li>
            </ul>
          </div>

          <div className="footer__col footer__col--end">
            <span className="label">{site.location}</span>
            <span className="footer__time tabular">{time}</span>
          </div>
        </div>

        <button
          type="button"
          className="footer__mark"
          onClick={() => scrollToId('top')}
          data-cursor="view"
          data-cursor-label="Top"
          aria-label="Back to top"
        >
          <span className="footer__mark-text display" aria-hidden="true">
            {site.name}
          </span>
        </button>

        <div className="footer__bottom">
          <span className="label">
            © {year} {site.name}
          </span>
          <span className="label">
            No cookies · No tracking · No template
          </span>
        </div>
      </div>
    </footer>
  )
}
