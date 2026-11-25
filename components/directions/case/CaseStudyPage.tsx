// A case study on the redesign's ground. One page, in the order the portfolio reads the work:
// what it is (name, the parts of the sentence it proves, the facts, the site in use), then Build
// (the website), Run (the journey, the page's one signature: CaseJourney), Fix (what was found and
// what broke), what came of it, what is still open, the client in her own words, and the next piece.
// Every section renders complete on the server; CaseMotion adds the reveals, the journey's pulse
// and stage, and plays the recording while it is seen.

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CaseStudy } from '../../../lib/case-studies'
import type { Layer } from '../../../lib/directions/triage'
import { LENS_WORDS, PIECES } from '../../../lib/directions/portfolio'
import { CASES } from '../home/Cases'
import theme from '../home/theme.module.css'
import CaseJourney from './CaseJourney'
import CaseMotion from './CaseMotion'
import Directed from '../home/Directed'
import DirectedAuto from '../home/DirectedAuto'
import { DIRECTED } from '../../../lib/directions/recordings'
import ProjectViewTracker from '../../case-study/ProjectViewTracker'
import content from '../../../content.json'
import s from './case.module.css'
import Arrow from '../shared/Arrow'

const LENSES: Layer[] = [1, 2, 3]

// The next piece with its own case study, in the portfolio's order
function nextStudy(slug: string) {
  const withPage = PIECES.filter((p) => p.links.some((l) => l.href === `/portfolio/${p.slug}`))
  const i = withPage.findIndex((p) => p.slug === slug)
  return withPage[(i + 1) % withPage.length]
}

function Chapter({ n, part, title, id }: { n: string; part: string; title: string; id: string }) {
  return (
    <header className={s.chapter}>
      <p className={s.chapterPart}><span className={s.chapterN}>{n}</span>{part}</p>
      <h2 id={id} className={s.statement}>{title}</h2>
    </header>
  )
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const piece = PIECES.find((p) => p.slug === study.slug)
  // GA4's view_portfolio_project event keeps the title and category it has always reported
  const listing = content.portfolio.projects.find((p) => p.slug === study.slug)
  const lenses = piece?.lenses ?? [1]
  const next = nextStudy(study.slug)
  const { situation, results } = study
  const directed = study.rec ? DIRECTED[study.rec.name] : undefined
  const rate = (v: string) => parseFloat(v) || 0
  const maxRate = study.finding ? Math.max(...study.finding.table.rows.map((r) => rate(r[r.length - 1]))) : 1
  let n = 0
  const num = () => String(++n).padStart(2, '0')

  return (
    <article className={s.page} data-case="">
      {/* ---------- What it is ---------- */}
      <header className={s.open}>
        <p className={s.kicker}>
          <Link href="/portfolio" className={s.back}>Portfolio</Link>
          <span aria-hidden="true"> / </span>Case study
        </p>
        {/* --fit is the longest word, so a long name scales down to fit a phone instead of being cut */}
        <h1 className={s.title} style={{ '--fit': Math.max(...study.title.split(' ').map((w) => w.length)) } as CSSProperties}>{study.title}</h1>
        <p className={s.marks}>
          <span className={theme.sr}>Proves: </span>
          {LENSES.map((l) => {
            const lit = lenses.includes(l)
            return lit ? <span key={l} data-lit="">{LENS_WORDS[l]}</span> : <span key={l} data-mark={LENS_WORDS[l]} />
          })}
        </p>
        <p className={s.line}>{study.line}</p>
        <dl className={s.facts}>
          {study.facts.map((f) => (
            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
          ))}
          {study.liveUrl && (
            <div>
              <dt>Live site</dt>
              <dd><a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className={s.u}>{study.liveUrl.replace(/^https?:\/\/(www\.)?/, '')}<Arrow out /></a></dd>
            </div>
          )}
        </dl>
      </header>

      {/* The site in use: a directed recording (captions, a camera on each step, steps to play from)
          when its steps are written down, otherwise the cover image */}
      {directed && study.rec ? (
        <figure id="cs-recording" className={s.coverDirected}>
          <Directed rec={study.rec.name} cues={directed.cues} duration={directed.duration} label={study.rec.label} sizes="100vw" first />
          <DirectedAuto within="cs-recording" />
        </figure>
      ) : (
        <figure className={s.cover} data-clip="">
          <Image src={study.cover.src} alt={study.cover.alt} width={study.cover.width} height={study.cover.height} sizes="100vw" priority fetchPriority="high" />
        </figure>
      )}

      {/* ---------- The situation ---------- */}
      {situation && (
        <section className={s.section} aria-labelledby="cs-situation">
          <Chapter n={num()} part="The situation" title={situation.heading} id="cs-situation" />
          <div className={s.columns}>
            {situation.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>
      )}

      {/* ---------- Build: the website ---------- */}
      <section className={`${s.section} ${s.build}`} aria-labelledby="cs-build">
        {/* The words and the site on a phone sit side by side and end on the same line */}
        <div className={s.buildGrid}>
          <div className={s.buildWords}>
            <Chapter n={num()} part="Build · the website" title={study.site.heading} id="cs-build" />
            <p className={s.buildText}>{study.site.body}</p>
            {study.site.built && (
              <>
                <h3 className={s.builtLabel}>What I built</h3>
                <ol className={s.built}>
                  {study.site.built.map((b, i) => (
                    <li key={b}><span className={s.builtN}>{String(i + 1).padStart(2, '0')}</span>{b}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
          {study.site.images.map((img) => (
            <figure key={img.src} className={s.phone} data-clip="">
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 761px) 26vw, 70vw" />
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- Run: the journey (the signature) ---------- */}
      {study.journey && <CaseJourney n={num()} journey={study.journey} site={study.cover} />}

      {/* ---------- Fix: what was found, and what broke ---------- */}
      {(study.finding || study.incidents) && (
        <section className={s.section} aria-labelledby="cs-fix">
          <Chapter n={num()} part="Fix · what was found" title={study.finding?.heading ?? 'Three times it broke'} id="cs-fix" />
          {study.finding && (
            <>
              <div className={s.columns}>
                {study.finding.body.map((p) => <p key={p}>{p}</p>)}
              </div>
              <table className={s.table}>
                <caption>{study.finding.table.caption}</caption>
                <thead>
                  <tr>{study.finding.table.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {study.finding.table.rows.map((r) => (
                    <tr key={r[0]}>
                      <th scope="row">{r[0]}</th>
                      {r.slice(1, -1).map((c, i) => <td key={i}>{c}</td>)}
                      <td className={s.rate}>
                        <span className={s.bar} aria-hidden="true"><span style={{ width: `${(rate(r[r.length - 1]) / maxRate) * 100}%` }} data-bar="" /></span>
                        {r[r.length - 1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={s.columns}>
                {study.finding.response.map((p) => <p key={p}>{p}</p>)}
              </div>
            </>
          )}
          {study.incidents && (
            <div className={s.incidents}>
              <h3 className={s.subLabel}>Three times it broke</h3>
              <ol className={s.caseList}>
                {CASES.map((c, i) => (
                  <li key={c.title[1]}>
                    <details className={s.case}>
                      <summary className={s.summary}>
                        <span className={s.caseNum}>Case {String(i + 1).padStart(2, '0')}</span>
                        <span className={s.caseTitle}>{c.title[0]}{c.title[1]}</span>
                        <span className={s.plus} aria-hidden="true" />
                      </summary>
                      <dl className={s.caseRows}>
                        {c.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                      </dl>
                    </details>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* ---------- What came of it ---------- */}
      {results && (
      <section className={s.section} aria-labelledby="cs-results">
        <Chapter n={num()} part="What came of it" title={results.heading} id="cs-results" />
        <ul className={s.results} data-count={results.items.length}>
          {results.items.map((r) => (
            <li key={r.value}>
              <span className={s.value}>{r.value}</span>
              <span className={s.valueLabel}>{r.label}</span>
            </li>
          ))}
        </ul>
        <p className={s.source}>{results.source}</p>
      </section>
      )}

      {/* ---------- What is still open ---------- */}
      {study.open && (
        <section className={s.section} aria-labelledby="cs-open">
          <Chapter n={num()} part="Still open" title={study.open.heading} id="cs-open" />
          <ul className={s.openList}>
            {study.open.items.map((o) => (
              <li key={o.title}><h3 className={s.openTitle}>{o.title}</h3><p>{o.body}</p></li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- In their words ---------- */}
      {study.testimonial && (
        <figure className={s.quote}>
          <blockquote><p className={s.quoteText}>“{study.testimonial.quote}”</p></blockquote>
          <figcaption className={s.cite}>{study.testimonial.name}<span>, {study.testimonial.role}</span></figcaption>
        </figure>
      )}

      {/* ---------- The next piece ---------- */}
      {next && next.slug !== study.slug && (
        <nav className={s.next} aria-label="Next case study">
          <p className={s.kicker}>Next case study</p>
          <Link href={`/portfolio/${next.slug}`} className={s.nextName}>
            {/* The arrow stays on the line of the name's last word, so it never sits alone */}
            {next.name.split(' ').slice(0, -1).join(' ')}{next.name.includes(' ') ? ' ' : ''}
            <span className={s.nowrap}>{next.name.split(' ').pop()}<Arrow /></span>
          </Link>
        </nav>
      )}

      <CaseMotion />
      {listing && <ProjectViewTracker slug={study.slug} title={listing.title} category={listing.category} />}
    </article>
  )
}
