import { useState } from 'react'
import { site } from '@/content/site.config'
import { Reveal } from '@/components/Reveal'
import { useMagnetic, useScramble } from '@/lib/hooks'
import './contact.css'

/* ------------------------------------------------------------------
   Contact.

   One address, set as large as the headline, because the entire page
   exists to get someone to this line. The copy-to-clipboard is the
   real affordance; mailto is the fallback for people who want it.
   ------------------------------------------------------------------ */

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <p className="label contact__eyebrow">
          <span className="accent">06</span>
          <span aria-hidden="true">—</span>
          Contact
        </p>

        <h2 className="contact__title display" id="contact-title">
          <Reveal y={26}>
            <span className="contact__line">Let’s make</span>
          </Reveal>
          <Reveal y={26} delay={0.06}>
            <span className="contact__line">
              something <em className="contact__em">solid</em>
            </span>
          </Reveal>
        </h2>

        <div className="contact__actions">
          <EmailButton />
          <p className="contact__note muted">
            {site.availability.open
              ? site.availability.note
              : 'Not currently taking on new work — still happy to talk.'}
          </p>
        </div>

        <ul className="contact__links">
          {site.links.map((link) => (
            <li key={link.label}>
              <a
                className="contact__link"
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                data-cursor-label="Open"
              >
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-handle label">{link.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function EmailButton() {
  const ref = useMagnetic<HTMLButtonElement>(0.22, 120)
  const [copied, setCopied] = useState(false)
  const { output, run } = useScramble(site.email, { speed: 22, hold: 1 })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard blocked (insecure context, permission denied) — hand
      // the visitor off to their mail client instead of failing silently.
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <div className="email">
      <button
        ref={ref}
        type="button"
        className="email__button magnetic"
        onClick={copy}
        onMouseEnter={run}
        onFocus={run}
        data-cursor="view"
        data-cursor-label={copied ? 'Copied' : 'Copy'}
      >
        <span className="email__text" aria-hidden="true">
          {output}
        </span>
        <span className="sr-only">Copy email address {site.email} to clipboard</span>
      </button>

      <p className="email__status label" role="status" aria-live="polite">
        {copied ? 'Copied to clipboard' : 'Click to copy'}
      </p>

      <a className="email__fallback label" href={`mailto:${site.email}`}>
        or open your mail client
      </a>
    </div>
  )
}
