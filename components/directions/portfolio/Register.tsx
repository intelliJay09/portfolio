// The portfolio: one sentence, then everything she has built, run and fixed.
// The sentence is the way through ("See what I've built, the journeys I run, and what I've fixed",
// its own line, not the homepage's). Each phrase is a button: pick "the journeys I run" and
// the ink drains from the other two phrases, the work that doesn't prove it folds away, and what
// is left shows that side of itself (Gwen Addo's emails instead of her website). Pick it again,
// or "Show everything", to have it all back. RegisterMotion runs it.
// The list: each piece's number and the parts of the sentence it proves, its name as the
// headline, what it is, and where to see more. On a desktop with motion, a stage beside the list
// holds the work you are reading, swapping as you scroll. Everywhere else (phones, reduced
// motion, no script) each piece carries its own media in the list, and everything is shown.

import type { Layer } from '../../../lib/directions/triage'
import { LENS_WORDS, PIECES } from '../../../lib/directions/portfolio'
import theme from '../home/theme.module.css'
import Shown from './Shown'
import RegisterMotion from './RegisterMotion'
import s from './register.module.css'
import Arrow from '../shared/Arrow'

const PHRASES: [Layer, string][] = [[1, 'See what I’ve built,'], [2, 'the journeys I run,'], [3, 'and what I’ve fixed.']]
const LENSES: Layer[] = [1, 2, 3]

export default function Register() {
  return (
    <section className={s.root} data-register="" aria-labelledby="portfolio-title">
      <header className={s.intro}>
        <h1 id="portfolio-title" className={s.kicker}>Portfolio</h1>
        <p className={s.sentence} role="group" aria-label="Show only the work for one part of the sentence">
          {PHRASES.map(([n, p]) => (
            <span key={n}>
              <button type="button" className={s.phrase} data-pick={n} aria-pressed="false">{p}</button>{' '}
            </span>
          ))}
        </p>
        <p className={s.status}>
          <span data-status="" aria-live="polite">{PIECES.length} pieces of work.</span>
          <button type="button" className={s.clear} data-clear="" hidden>Show everything</button>
        </p>
      </header>

      <div className={s.body} data-register-body="">
        <ol className={s.list}>
          {PIECES.map((p, i) => (
            <li key={p.slug} className={s.row} data-piece={p.slug} data-lenses={p.lenses.join(' ')}>
              <div className={s.rowIn}>
                <p className={s.meta}>
                  <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.marks}>
                    <span className={theme.sr}>Proves: </span>
                    {LENSES.map((l) => {
                      const lit = p.lenses.includes(l)
                      return lit ? <span key={l} data-lit="">{LENS_WORDS[l]}</span> : <span key={l} data-mark={LENS_WORDS[l]} />
                    })}
                  </span>
                </p>
                <h2 className={s.name}>{p.name}</h2>
                {p.lenses.map((l) => (
                  <p key={l} className={s.caption} data-for={l} data-primary={l === p.lenses[0] ? '' : undefined}>{p.show[l]?.caption}</p>
                ))}
                {p.quote && (
                  <figure className={s.quote}>
                    <blockquote><p className={s.quoteText}>“{p.quote.quote}”</p></blockquote>
                    <figcaption className={s.cite}>{p.quote.name}{p.quote.role && <span>, {p.quote.role}</span>}</figcaption>
                  </figure>
                )}
                <div className={s.media}>
                  {p.lenses.map((l) => <Shown key={l} piece={p} lens={l} where="row" />)}
                </div>
                {p.links.length > 0 && (
                  <p className={s.links}>
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {l.label}<Arrow out={l.external} />
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* The stage repeats the list's media for sighted desktop visitors, so it is hidden from screen readers */}
        <aside className={s.stage} aria-hidden="true" data-stage="">
          <div className={s.screen}>
            {PIECES.map((p) => (
              <div key={p.slug} className={s.slide} data-slide={p.slug}>
                {p.lenses.map((l) => <Shown key={l} piece={p} lens={l} where="stage" />)}
              </div>
            ))}
          </div>
        </aside>
      </div>
      <RegisterMotion />
    </section>
  )
}
