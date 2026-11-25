import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google'
import MosaicCanvas from '../../../components/directions/mosaic/MosaicCanvas'
import MosaicMotion from '../../../components/directions/mosaic/MosaicMotion'
import Lines from '../../../components/directions/shared/Lines'
import { WORK, work, GWEN_EMAILS, CONTACT, DESK, PHONE } from '../../../lib/directions/work'
import s from './mosaic.module.css'

const serif = Instrument_Serif({ weight: '400', subsets: ['latin'], variable: '--m-serif', display: 'swap' })
const sans = Geist({ subsets: ['latin'], variable: '--m-sans', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--m-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Direction A: Made of her work',
  description: 'Homepage direction A for Jacqueline Amoako.',
  robots: { index: false, follow: false },
}

export default function MosaicDirection() {
  const cs = work('command-space')
  const fd = work('finest-dietitian')
  const more = WORK.filter((w) => w.slug !== 'command-space' && w.slug !== 'finest-dietitian')
  const left = GWEN_EMAILS.filter((_, i) => i % 2 === 0)
  const right = GWEN_EMAILS.filter((_, i) => i % 2 === 1)

  return (
    <div data-direction="mosaic" className={`${serif.variable} ${sans.variable} ${mono.variable} ${s.root}`}>
      <a href="#main" className={s.skip}>Skip to content</a>
      <header className={s.nav}>
        <Link href="/directions/mosaic" className={s.mark} aria-label="Jacqueline Amoako, home">JA</Link>
        <nav aria-label="Main">
          <ul>
            <li><a href="#work">Work</a></li>
            <li><Link href="/about">About</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="hero" className={s.hero} aria-labelledby="hero-title">
          <div className={s.stage}>
            <div id="mosaic-slot" className={s.slot} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element -- a 42x41 grid, upscaled on purpose */}
              <img className={s.poster} src="/directions/mosaic/poster.png" alt="" width={42} height={41} />
            </div>
            <MosaicCanvas heroId="hero" slotId="mosaic-slot" />
            <div className={s.heroText} data-hero-text="">
              <h1 id="hero-title" className={s.h1}>
                <span>Jacqueline</span> <span>Amoako</span>
              </h1>
              <p className={s.role}>Frontend developer, lifecycle marketer and technical support. Accra, Ghana.</p>
            </div>
            <p className={s.caption} data-hero-text="">
              1,695 squares, one for every email my system sent for one client. None by hand.
            </p>
            <p className={s.hint} data-hero-hint="" aria-hidden="true">Scroll</p>
            <p className={s.statement} data-hero-statement="" aria-hidden="true">
              I build the website, run the customer journey behind it, and fix what breaks.
            </p>
          </div>
        </section>

        <section id="work" className={s.chapter} aria-labelledby="build-title">
          <p className={s.label}><span>01</span>Frontend development</p>
          <Lines id="build-title" className={s.h2} lines={['I build', 'the website.']} />

          <figure className={s.bleed} data-clip="">
            <Image src={cs.desk} alt="The Command Space home page" width={DESK.w} height={DESK.h} sizes="100vw" />
          </figure>
          <div className={s.project}>
            <h3 className={s.projectName}>{cs.name}</h3>
            <p className={s.projectLine}>{cs.line}</p>
            <p className={s.links}>
              <Link href={`/portfolio/${cs.slug}`}>Case study</Link>
              <a href={cs.url} target="_blank" rel="noopener noreferrer">Visit the site<span aria-hidden="true"> ↗</span></a>
            </p>
          </div>

          <div className={s.pair}>
            <figure className={s.pairDesk} data-clip="">
              <Image src={fd.desk} alt="The Finest Dietitian home page" width={DESK.w} height={DESK.h} sizes="(max-width: 760px) 100vw, 74vw" />
            </figure>
            <figure className={s.pairPhone} data-par="-14">
              <Image src={fd.phone} alt="The Finest Dietitian home page on a phone" width={PHONE.w} height={PHONE.h} sizes="(max-width: 760px) 40vw, 22vw" />
            </figure>
          </div>
          <div className={s.project}>
            <h3 className={s.projectName}>{fd.name}</h3>
            <p className={s.projectLine}>{fd.line} Her first paid booking came three days after launch.</p>
            <p className={s.links}>
              <Link href={`/portfolio/${fd.slug}`}>Case study</Link>
              <a href={fd.url} target="_blank" rel="noopener noreferrer">Visit the site<span aria-hidden="true"> ↗</span></a>
            </p>
          </div>

          <div className={s.more}>
            <p className={s.label}>More of the work</p>
            <ul className={s.phones}>
              {more.map((w) => (
                <li key={w.slug}>
                  <Link href={`/portfolio/${w.slug}`} className={s.phoneLink}>
                    <span className={s.phoneShot}>
                      <Image src={w.phone} alt="" width={PHONE.w} height={PHONE.h} sizes="(max-width: 760px) 44vw, 21vw" />
                    </span>
                    <span className={s.phoneName}>{w.name}</span>
                    <span className={s.phoneLine}>{w.line}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.chapter} aria-labelledby="grow-title">
          <div className={s.grow}>
            <div className={s.growText}>
              <p className={s.label}><span>02</span>Lifecycle and growth marketing</p>
              <Lines id="grow-title" className={`${s.h2} ${s.h2Column}`} lines={['I run what', 'happens after', 'someone signs up.']} />
              <p className={s.body}>
                For Gwen Addo’s leadership programme I built the whole customer journey: sign-up, payment, the run-up
                to the event, the day itself, what follows, and bringing past attendees back.
              </p>
              <dl className={s.stats}>
                <div><dt>1,695</dt><dd>emails to 194 people. None sent by hand.</dd></div>
                <div><dt>9</dt><dd>past customers came back, worth GHS 14,050.</dd></div>
              </dl>
              <p className={s.links}><Link href="/portfolio/gwen-addo">Read the Gwen Addo case study</Link></p>
            </div>
            <div className={s.emails}>
              <div className={s.emailCol} data-par="-10">
                {left.map((e) => (
                  <Image key={e.src} src={e.src} alt={e.alt} width={e.w} height={e.h} sizes="(max-width: 760px) 46vw, 24vw" />
                ))}
              </div>
              <div className={`${s.emailCol} ${s.emailColLow}`} data-par="8">
                {right.map((e) => (
                  <Image key={e.src} src={e.src} alt={e.alt} width={e.w} height={e.h} sizes="(max-width: 760px) 46vw, 24vw" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${s.chapter} ${s.fix}`} aria-labelledby="fix-title">
          <p className={s.label}><span>03</span>Technical support</p>
          <Lines id="fix-title" className={s.h2} lines={['I fix what breaks.']} />
          <div className={s.fixStory}>
            <p className={s.bigNum} aria-hidden="true">11</p>
            <p className={s.fixText}>
              Eleven people had paid and heard nothing back. I found why, fixed it, and sent each of them their email
              before the client knew anything was wrong.
            </p>
          </div>
          <dl className={s.stats}>
            <div><dt>70%</dt><dd>of payments came in outside business hours. None were missed.</dd></div>
            <div><dt>GHS 67,400</dt><dd>across five payment channels, with zero mismatches.</dd></div>
          </dl>
          <p className={s.body}>
            I started on the support desk and later ran customer success, so I build for the moment something goes wrong.
          </p>
        </section>

        <section className={s.teach} aria-labelledby="teach-title">
          <figure className={s.teachImage} data-clip="">
            <Image src="/images/girlcode-teaching-3.jpg" alt="Jacqueline teaching a class of girls learning to code" width={3840} height={2160} sizes="100vw" />
          </figure>
          <div className={s.teachText}>
            <h2 id="teach-title" className={s.label}>Teaching</h2>
            <p>I mentor girls learning to code with Girl Code Africa, and I have trained more than 100 women entrepreneurs in digital skills.</p>
          </div>
        </section>
      </main>

      <footer id="contact" className={s.footer}>
        <p className={s.label}>Contact</p>
        <a className={s.hello} href={`mailto:${CONTACT.email}`}>Say hello</a>
        <p className={s.email}><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
        <ul className={s.social}>
          <li><a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
        <p className={s.small}>© 2026 Jacqueline Amoako. Accra, Ghana.</p>
      </footer>
      <MosaicMotion />
    </div>
  )
}
