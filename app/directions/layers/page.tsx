import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import LayersStage from '../../../components/directions/layers/LayersStage'
import LayersMotion from '../../../components/directions/layers/LayersMotion'
import Lines from '../../../components/directions/shared/Lines'
import { WORK, work, CONTACT, DESK } from '../../../lib/directions/work'
import s from './layers.module.css'

const sans = Archivo({ subsets: ['latin'], weight: 'variable', axes: ['wdth'], variable: '--l-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--l-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Direction B: Every layer',
  description: 'Homepage direction B for Jacqueline Amoako.',
  robots: { index: false, follow: false },
}

const JOURNEY = [
  { name: 'payment-nudge', stamp: 'Before payment' },
  { name: 'booking-reminder', stamp: 'Booking reminder' },
  { name: 'nurture-final-call', stamp: 'Doors close' },
  { name: 'post-event-attendee', stamp: 'After the event' },
  { name: 'alumni-invite', stamp: 'Come back' },
]

const LEDGER: [string, string][] = [
  ['Payments reconciled', 'GHS 67,400'],
  ['Payment channels', '5'],
  ['Mismatches', '0'],
  ['Paid outside office hours', '70%'],
  ['Payments missed', '0'],
  ['Paid, no email sent', '11 → 0'],
]

const LAYERS = [
  {
    n: '01',
    skill: 'Frontend development',
    detail: 'The site people find and book on. I rebuilt it in Next.js.',
  },
  {
    n: '02',
    skill: 'Lifecycle and growth marketing',
    detail: '1,695 emails to 194 people, from sign-up to the next cohort. None sent by hand.',
  },
  {
    n: '03',
    skill: 'Technical support',
    detail: 'Eleven people had paid and heard nothing. I found why, fixed it and sent every email before the client knew.',
  },
]

export default function LayersDirection() {
  const featured = ['command-space', 'finest-dietitian', 'anabs', 'eleven-eleven-ghana'].map(work)
  const others = WORK.filter((w) => !featured.includes(w))
  const gwen = work('gwen-addo')

  return (
    <div data-direction="layers" className={`${sans.variable} ${mono.variable} ${s.root}`}>
      <a href="#main" className={s.skip}>Skip to content</a>
      <header className={s.nav}>
        <Link href="/directions/layers" className={s.mark}>Jacqueline Amoako</Link>
        <nav aria-label="Main">
          <ul>
            <li><a href="#work">Work</a></li>
            <li><Link href="/about">About</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="anatomy" className={s.hero} aria-labelledby="hero-title">
          <div className={s.stage} data-stage="">
            <span className={`${s.cross} ${s.crossTl}`} aria-hidden="true" />
            <span className={`${s.cross} ${s.crossTr}`} aria-hidden="true" />
            <span className={`${s.cross} ${s.crossBl}`} aria-hidden="true" />
            <span className={`${s.cross} ${s.crossBr}`} aria-hidden="true" />

            <div className={s.title} data-title="">
              <h1 id="hero-title" className={s.h1}>
                <span>Jacqueline</span> <span>Amoako</span>
              </h1>
              <p className={s.role}>Frontend developer, lifecycle marketer and technical support, in Accra.</p>
            </div>

            <ol className={s.layerLabels}>
              {LAYERS.map((l, i) => (
                <li key={l.n} className={s.layerLabel} data-layer-label="" data-n={i + 1}>
                  <span className={s.layerNum}>{l.n}</span>
                  <span className={s.layerSkill}>{l.skill}</span>
                  <span className={s.layerDetail}>{l.detail}</span>
                </li>
              ))}
            </ol>

            <div className={s.scene} aria-hidden="true">
              <div className={s.stack} data-stack="" data-active="0">
                <div className={`${s.plate} ${s.plateSafety}`} style={{ '--i': 0 } as React.CSSProperties} data-plate="3">
                  <span className={s.anchor} data-anchor="" data-for="3" />
                  <p className={s.plateTag}>03 / Safety net</p>
                  <dl className={s.ledger}>
                    {LEDGER.map(([k, v]) => (
                      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                  </dl>
                </div>
                <div className={`${s.plate} ${s.plateJourney}`} style={{ '--i': 1 } as React.CSSProperties} data-plate="2">
                  <span className={s.anchor} data-anchor="" data-for="2" />
                  <p className={s.plateTag}>02 / Journey</p>
                  <ol className={s.journey}>
                    {JOURNEY.map((j) => (
                      <li key={j.name}>
                        <Image src={`/images/case-studies/gwen-addo/email-${j.name}.webp`} alt="" width={1136} height={1600} sizes="9vw" />
                        <span>{j.stamp}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={`${s.plate} ${s.plateSite}`} style={{ '--i': 2 } as React.CSSProperties} data-plate="1">
                  <span className={s.anchor} data-anchor="" data-for="1" />
                  <Image src={gwen.desk} alt="" width={DESK.w} height={DESK.h} sizes="(max-width: 760px) 86vw, 46vw" priority />
                </div>
              </div>
            </div>

            <svg className={s.leaders} data-leaders="" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <g key={n} data-n={n}>
                  <line x1="0" y1="0" x2="0" y2="0" />
                  <circle r="4" cx="0" cy="0" />
                </g>
              ))}
            </svg>

            <p className={s.sheet} aria-hidden="true">
              <span>Drawing 01</span>
              <span>Gwen Addo, customer system, as built</span>
            </p>
          </div>
        </section>

        <section id="work" className={s.work} aria-labelledby="work-title">
          <Lines id="work-title" className={s.h2} lines={['Sites', 'I have built']} />
          <ol className={s.sheets}>
            {featured.map((w, i) => (
              <li key={w.slug} className={s.sheetRow}>
                <figure className={s.sheetImage} data-clip="">
                  <Image src={w.desk} alt={`The ${w.name} home page`} width={DESK.w} height={DESK.h} sizes="(max-width: 760px) 100vw, 64vw" />
                </figure>
                <dl className={s.block}>
                  <div><dt>No.</dt><dd>{String(i + 2).padStart(2, '0')}</dd></div>
                  <div><dt>Client</dt><dd className={s.blockName}>{w.name}</dd></div>
                  <div><dt>About</dt><dd>{w.line}{w.slug === 'finest-dietitian' ? ' First paid booking three days after launch.' : ''}</dd></div>
                  <div><dt>Built</dt><dd>{w.role}</dd></div>
                  <div>
                    <dt>Links</dt>
                    <dd className={s.blockLinks}>
                      <Link href={`/portfolio/${w.slug}`}>Case study</Link>
                      <a href={w.url} target="_blank" rel="noopener noreferrer">Live site<span aria-hidden="true"> ↗</span></a>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          <div className={s.index}>
            <h3 className={s.indexTitle}>Also built</h3>
            <ul>
              {others.map((w) => (
                <li key={w.slug}>
                  <Link href={`/portfolio/${w.slug}`}>
                    <span className={s.indexName}>{w.name}</span>
                    <span className={s.indexLine}>{w.line}</span>
                    <span className={s.indexRole}>{w.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.teach} aria-labelledby="teach-title">
          <figure className={s.teachImage} data-clip="">
            <Image src="/images/girlcode-teaching-1.jpg" alt="Jacqueline with students at a Girl Code Africa class" width={2560} height={1758} sizes="(max-width: 760px) 100vw, 56vw" />
          </figure>
          <div className={s.teachText}>
            <h2 id="teach-title" className={s.kicker}>Teaching</h2>
            <p>I mentor girls learning to code with Girl Code Africa, and I have trained more than 100 women entrepreneurs in digital skills.</p>
          </div>
        </section>
      </main>

      <footer id="contact" className={s.footer}>
        <p className={s.kicker}>Contact</p>
        <a className={s.hello} href={`mailto:${CONTACT.email}`}>Say hello</a>
        <div className={s.footRow}>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <span>© 2026 Jacqueline Amoako</span>
        </div>
      </footer>
      <LayersStage heroId="anatomy" />
      <LayersMotion />
    </div>
  )
}
