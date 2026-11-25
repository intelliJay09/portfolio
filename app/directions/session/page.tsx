import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Bricolage_Grotesque, DM_Mono } from 'next/font/google'
import SessionMotion from '../../../components/directions/session/SessionMotion'
import Lines from '../../../components/directions/shared/Lines'
import { WORK, work, FULL, FD_EMAILS, CONTACT, PHONE } from '../../../lib/directions/work'
import s from './session.module.css'

const sans = Bricolage_Grotesque({ subsets: ['latin'], weight: 'variable', axes: ['opsz', 'wdth'], variable: '--s-sans', display: 'swap' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--s-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Direction C: Live session',
  description: 'Homepage direction C for Jacqueline Amoako.',
  robots: { index: false, follow: false },
}

function Cursor({ className, label = 'Jacqueline', ...rest }: { className?: string; label?: string } & Record<string, string | undefined>) {
  return (
    <span className={className} aria-hidden="true" {...rest}>
      <svg width="22" height="24" viewBox="0 0 22 24">
        <path d="M2 2 L19 12.5 L11.2 14.1 L7.6 21.6 Z" />
      </svg>
      <span className={s.cursorLabel}>
        <Image src="/directions/people/face-bw.webp" alt="" width={40} height={40} />
        {label}
      </span>
    </span>
  )
}

export default function SessionDirection() {
  const fd = work('finest-dietitian')
  // Every site, Finest Dietitian included: its links in the session caption are hidden
  // until that scene plays, so the row keeps them reachable by keyboard
  const more = WORK

  return (
    <div data-direction="session" className={`${sans.variable} ${mono.variable} ${s.root}`}>
      <a href="#main" className={s.skip}>Skip to content</a>
      <header className={s.nav}>
        <Link href="/directions/session" className={s.mark}>Jacqueline Amoako</Link>
        <nav aria-label="Main">
          <ul>
            <li><a href="#work">Work</a></li>
            <li><Link href="/about">About</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroText}>
            <h1 id="hero-title" className={s.h1}>
              <span>Jacqueline</span> <span>Amoako</span>
            </h1>
            <p className={s.line}>
              I <span className={s.markWord} data-mark="">build websites</span>,{' '}
              <span className={s.markWord} data-mark="">run the customer journeys</span> behind them, and{' '}
              <span className={s.markWord} data-mark="">fix what breaks</span>.
            </p>
            <p className={s.meta}>Frontend development · Lifecycle and growth marketing · Technical support · Accra</p>
          </div>
          <figure className={s.portrait}>
            <Image src="/directions/people/seated-cutout.webp" alt="Jacqueline Amoako" width={1500} height={2449} sizes="(max-width: 760px) 70vw, 34vw" priority />
          </figure>
          <p className={s.cue} data-cue="">Scroll, and watch me work</p>
          <Cursor className={`${s.cursor} ${s.heroCursor}`} data-hero-cursor="" />
        </section>

        <section id="session" className={s.session} aria-label="Watch me work">
          <div className={s.stage} data-stage="">
            <div className={s.site} data-site="">
              <div className={s.siteScroll}>
                <Image data-site-img="" src={FULL['finest-dietitian']} alt="The Finest Dietitian website, full length" width={1440} height={9342} sizes="(max-width: 760px) 92vw, 86vw" />
              </div>
            </div>
            <figure className={`${s.mail} ${s.mailOne}`} data-mail="1">
              <Image src={FD_EMAILS[0].src} alt={FD_EMAILS[0].alt} width={FD_EMAILS[0].w} height={FD_EMAILS[0].h} sizes="(max-width: 760px) 60vw, 34vw" />
            </figure>
            <figure className={`${s.mail} ${s.mailTwo}`} data-mail="2">
              <Image src={FD_EMAILS[1].src} alt={FD_EMAILS[1].alt} width={FD_EMAILS[1].w} height={FD_EMAILS[1].h} sizes="(max-width: 760px) 60vw, 34vw" />
            </figure>

            <div className={s.dots} data-dots="" aria-hidden="true">
              <span className={s.marquee} data-marquee="" />
              <ol>
                {Array.from({ length: 11 }, (_, i) => (
                  <li key={i} data-dot="" />
                ))}
              </ol>
              <p className={s.dotsCount}><span data-fixed="">11</span> of 11 sent</p>
            </div>

            <div className={s.captions}>
              <div className={s.caption} data-scene="1">
                <p className={s.capLabel}>01 Frontend development</p>
                <h2 className={s.capTitle}>I build the website.</h2>
                <p className={s.capBody}>{fd.name}: a booking site for a registered dietitian in Accra. Her first paid booking came three days after launch.</p>
                <p className={s.capLinks}><Link href={`/portfolio/${fd.slug}`}>Case study</Link><a href={fd.url} target="_blank" rel="noopener noreferrer">Live site<span aria-hidden="true"> ↗</span></a></p>
              </div>
              <div className={s.caption} data-scene="2">
                <p className={s.capLabel}>02 Lifecycle and growth marketing</p>
                <h2 className={s.capTitle}>I run what happens next.</h2>
                <p className={s.capBody}>Book, and the confirmation and follow-up arrive on their own. For Gwen Addo’s programme I built the whole journey: 1,695 emails to 194 people, none sent by hand.</p>
                <p className={s.counter} aria-hidden="true"><span data-count="">1,695</span> emails</p>
              </div>
              <div className={s.caption} data-scene="3">
                <p className={s.capLabel}>03 Technical support</p>
                <h2 className={s.capTitle}>I fix what breaks.</h2>
                <p className={s.capBody}>Eleven people had paid and heard nothing. I found why, fixed it, and sent every one of them their email before the client knew.</p>
              </div>
            </div>

            <span className={s.ripple} data-ripple="" aria-hidden="true" />
            <Cursor className={`${s.cursor} ${s.stageCursor}`} data-cursor="" />
          </div>
        </section>

        <section id="work" className={s.work} aria-labelledby="work-title">
          <Lines id="work-title" className={s.h2} lines={['What I’ve', 'built']} />
          <div className={s.rowWrap}>
            <ul className={s.row} data-row="">
              {more.map((w) => (
                <li key={w.slug}>
                  <Link href={`/portfolio/${w.slug}`}>
                    <span className={s.shot}>
                      <Image src={w.phone} alt="" width={PHONE.w} height={PHONE.h} sizes="(max-width: 760px) 56vw, 19vw" />
                    </span>
                    <span className={s.shotName}>{w.name}</span>
                    <span className={s.shotLine}>{w.line}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.teach} aria-labelledby="teach-title">
          <figure className={s.teachImage} data-clip="">
            <Image src="/images/girlcode-teaching-2.jpg" alt="Jacqueline teaching a Girl Code Africa class" width={3840} height={2160} sizes="(max-width: 760px) 100vw, 60vw" />
          </figure>
          <div className={s.teachText}>
            <h2 id="teach-title" className={s.capLabel}>Teaching</h2>
            <p>I mentor girls learning to code with Girl Code Africa, and I have trained more than 100 women entrepreneurs in digital skills.</p>
          </div>
        </section>
      </main>

      <footer id="contact" className={s.footer}>
        <p className={s.capLabel}>Contact</p>
        <div className={s.helloWrap}>
          <a className={s.hello} href={`mailto:${CONTACT.email}`}>Say hello</a>
          <Cursor className={`${s.cursor} ${s.footCursor}`} label="Jacqueline" data-foot-cursor="" />
        </div>
        <div className={s.footRow}>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <span>© 2026 Jacqueline Amoako, Accra</span>
        </div>
      </footer>
      <SessionMotion />
    </div>
  )
}
