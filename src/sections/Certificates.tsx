import { site } from '@/content/site.config'
import { SectionHead } from '@/components/SectionHead'
import { Reveal, RevealText } from '@/components/Reveal'
import './certificates.css'

export function Certificates() {
  return (
    <section className="section certificates" id="certificates" aria-labelledby="certificates-title">
      <div className="shell">
        <SectionHead
          id="certificates-title"
          index="05"
          label="Certificates"
          title="Credentials & training"
          aside={<p>Selected professional certifications and completed training.</p>}
        />

        {site.certificates.length ? (
          <ul className="certificates__list">
            {site.certificates.map((certificate, i) => (
              <li key={`${certificate.name}-${certificate.issuer}`}>
                <Reveal delay={i * 0.05} y={18}>
                  <CertificateCard certificate={certificate} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="certificates__empty muted">Certificates will be added here shortly.</p>
        )}
      </div>
    </section>
  )
}

function CertificateCard({ certificate }: { certificate: (typeof site.certificates)[number] }) {
  const content = (
    <>
      <span className="certificates__year label tabular">{certificate.year}</span>
      <h3 className="certificates__name">
        <RevealText>{certificate.name}</RevealText>
      </h3>
      <span className="certificates__issuer muted">{certificate.issuer}</span>
      {certificate.href ? <span className="certificates__verify label">Verify ↗</span> : null}
    </>
  )

  return certificate.href ? (
    <a
      className="certificates__card"
      href={certificate.href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="link"
      data-cursor-label="Verify"
    >
      {content}
    </a>
  ) : (
    <article className="certificates__card">{content}</article>
  )
}
