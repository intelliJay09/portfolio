// About, on the redesign's ground. It answers one question a visitor has after the portfolio:
// why does one person build, run and fix? Because she held each side of the customer first.
// Order: who she is (the line, the bio, the portrait), where the three came from (the page's one
// signature: her nine roles drawn in the portfolio's three lanes, Build, Run and Fix, with the
// role being read lit as you scroll), what she gives back (teaching), how she works, the way on.
// Every section renders complete on the server; AboutMotion adds the reveals and the lit lanes.

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ROLES, span, type Role } from '../../../lib/directions/about'
import { LENS_WORDS } from '../../../lib/directions/portfolio'
import type { Layer } from '../../../lib/directions/triage'
import { SITE } from '../../../lib/site'
import Lines from '../shared/Lines'
import Recording from '../shared/Recording'
import theme from '../home/theme.module.css'
import AboutMotion from './AboutMotion'
import s from './about.module.css'
import Arrow from '../shared/Arrow'

const LANES: Layer[] = [1, 2, 3]
const START = 2019

const PRINCIPLES = [
  {
    title: 'I start with the customer',
    body: 'I started on support and success desks, so I plan every message from the customer’s side before I open a tool.',
  },
  {
    title: 'Every stage gets its own message',
    body: 'Sign-up, payment, onboarding, the day itself, the days after, win-back. Each one has its own timing and its own words.',
  },
  {
    title: 'Nothing sends without checking first',
    body: 'Every sequence checks before it sends, so someone who has already paid or booked never gets an email that no longer applies to them.',
  },
  {
    title: 'When the fix is on the site, I build it',
    body: 'I’m also a frontend developer, so when the problem is in the product and not the inbox, I fix it there.',
  },
]

// Months since January 2019, so every role can be placed on one axis that ends this month
const index = ([y, m]: [number, number]) => (y - START) * 12 + (m - 1)

export default function AboutPage() {
  // Rendered on the server: the axis ends on the month the page was built
  const today = new Date()
  const now: [number, number] = [today.getFullYear(), today.getMonth() + 1]
  const total = index(now) + 1
  const pct = (i: number) => `${((i / total) * 100).toFixed(3)}%`
  const years = Array.from({ length: now[0] - START + 1 }, (_, k) => START + k)
  const bar = (r: Role) => ({ left: pct(index(r.from)), width: pct(index(r.to ?? now) - index(r.from) + 1) })

  return (
    <article className={s.page} data-about="">
      {/* ---------- Who she is ---------- */}
      <header className={s.open}>
        <div className={s.openWords}>
          <p className={s.kicker}>About</p>
          <Lines as="h1" className={s.title} lines={['I started on the', 'customer’s side', 'of the screen.']} />
          <p className={s.bio}>I’m Jacqueline Amoako, a lifecycle and growth marketer and frontend developer in Accra. I build websites, and the email and WhatsApp automation behind them.</p>
          <p className={s.reach}>
            <a href={`mailto:${SITE.email}`} className={s.u}>{SITE.email}<Arrow /></a>
            <a href={SITE.sameAs[0]} target="_blank" rel="noopener noreferrer" className={s.u}>LinkedIn<Arrow out /></a>
          </p>
        </div>
        {/* The portrait in two layers, so she can come through the screen (AboutMotion): the office
            behind her, inside a window, and her, cut out. At rest they are the photo. */}
        <figure className={s.portrait} data-portrait="">
          <div className={s.window} data-window="">
            <Image className={s.plate} data-plate="" src="/images/about/portrait-plate.jpg" alt="" width={1500} height={2000} sizes="(min-width: 761px) 38vw, 92vw" priority />
          </div>
          <div className={s.stage}>
            <Image data-subject="" src="/images/about/portrait-subject.webp" alt="Jacqueline Amoako" width={1500} height={2000} sizes="(min-width: 761px) 38vw, 92vw" priority fetchPriority="high" />
          </div>
        </figure>
      </header>

      {/* ---------- Where the three came from (the signature) ---------- */}
      <section className={s.section} aria-labelledby="about-career">
        <header className={s.chapter}>
          <p className={s.chapterPart}><span className={s.chapterN}>01</span>Where the three came from</p>
          <h2 id="about-career" className={s.statement}>Seven years of answering customers, keeping them, and building what they use.</h2>
        </header>

        <div className={s.career} data-career="">
          {/* The lanes repeat the list beside them as a picture, so screen readers get the list only */}
          <div className={s.chartWrap} aria-hidden="true">
            <div className={s.chart} data-chart="">
              {LANES.map((l) => (
                <div key={l} className={s.lane}>
                  <span className={s.laneName}>{LENS_WORDS[l]}</span>
                  <span className={s.track}>
                    {ROLES.map((r, i) => r.lanes.includes(l) && (
                      <span key={r.org} className={s.bar} data-bar={i} style={bar(r) as CSSProperties} />
                    ))}
                  </span>
                </div>
              ))}
              <div className={s.axis}>
                <span className={s.laneName} />
                <span className={s.ticks}>
                  {years.map((y) => (
                    <span key={y} className={s.tick} style={{ left: pct(index([y, 1])) }}>{y === now[0] ? `${y}` : `’${String(y).slice(2)}`}</span>
                  ))}
                  <span className={s.cursor} data-cursor="" />
                </span>
              </div>
              <p className={s.chartNow} data-now="">{ROLES[0].org}</p>
            </div>
          </div>

          <ol className={s.roles}>
            {ROLES.map((r, i) => (
              <li
                key={r.org}
                className={r.line ? s.role : `${s.role} ${s.roleShort}`}
                data-role={i}
                data-at={pct(index(r.to ?? now) + 1)}
              >
                <p className={s.when}>{span(r)}</p>
                <h3 className={s.org}>{r.org}</h3>
                <p className={s.titleLine}>{r.title}{r.kind && <span> · {r.kind}</span>}</p>
                {r.line && <p className={s.line}>{r.line}</p>}
                <p className={s.marks}>
                  <span className={theme.sr}>Lane: </span>
                  {LANES.map((l) => {
                    const lit = r.lanes.includes(l)
                    return lit ? <span key={l} data-lit="">{LENS_WORDS[l]}</span> : <span key={l} data-mark={LENS_WORDS[l]} />
                  })}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Teaching ---------- */}
      <section className={`${s.section} ${s.teach}`} data-tone="ink" aria-labelledby="about-teach">
        <header className={`${s.chapter} ${s.teachHead}`}>
          <div>
            <p className={s.chapterPart}><span className={s.chapterN}>02</span>Teaching</p>
            <h2 id="about-teach" className={s.statement}>I was the only female developer training on Digitalize for Jobs.</h2>
          </div>
          <p className={s.teachText}>The programme was run by GIZ and the Ghana Enterprise Agency. I trained more than 100 women entrepreneurs across Ghana in websites, social media and the digital skills their businesses needed.</p>
        </header>
        <div className={s.d4j}>
          <figure className={s.d4jWide} data-clip="">
            <Image src="/images/img-carousel-9.jpg" alt="Jacqueline with women entrepreneurs and the organisers of the training programme" width={3213} height={2285} sizes="(min-width: 761px) 52vw, 92vw" />
          </figure>
          <figure className={s.d4jTall} data-clip="">
            <Image src="/images/img-carousel-7.jpg" alt="Jacqueline teaching a training session, a website on the projector behind her" width={3024} height={4032} sizes="(min-width: 761px) 28vw, 92vw" />
          </figure>
        </div>
        <div className={s.gc}>
          <figure className={s.gcVideo}>
            <Recording
              name="girlcode-teaching"
              width={1280}
              height={720}
              label="Jacqueline helping students at their laptops during a Girl Code Africa class"
              sizes="(min-width: 761px) 52vw, 92vw"
            />
          </figure>
          <div className={s.gcWords}>
            <h3 className={s.gcName}>Girl Code Africa</h3>
            <p className={s.teachText}>I mentor girls learning to code, in classes like this one.</p>
          </div>
        </div>
      </section>

      {/* ---------- How I work ---------- */}
      <section className={`${s.section} ${s.howSection}`} aria-labelledby="about-how">
        <header className={s.chapter}>
          <p className={s.chapterPart}><span className={s.chapterN}>03</span>How I work</p>
          <h2 id="about-how" className={s.statement}>Four things I do on every project.</h2>
        </header>
        <ol className={s.how}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title}>
              <span className={s.howN}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.howTitle}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- The way on ---------- */}
      <nav className={s.next} aria-label="See the work">
        <p className={s.kicker}>See what came of it</p>
        <Link href="/portfolio" className={s.nextName}>
          <span className={s.nowrap}>Portfolio<Arrow /></span>
        </Link>
      </nav>

      <AboutMotion />
    </article>
  )
}
