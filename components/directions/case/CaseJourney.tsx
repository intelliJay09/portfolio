// Run the journey: the case study's one signature, on the ink ground.
// The stages sit on a rail. As you scroll, a pulse runs down it and lights each stage as it
// arrives, and beside the rail a stage shows the real emails that stage sends, when they go out,
// with the result where there is one (CaseMotion). It is the homepage's journey rail, run for one
// client, email by email.
// Default (phones, reduced motion, no script): each stage carries its own emails in a row under it.
// Emails marked private (a real entry ticket or a team member's number) are listed by subject only.
// A stage that sends nothing shows the site's own screen for that step, its result, or the site itself.

import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { CaseStudy, StageEmail } from '../../../lib/case-studies'
import s from './journey.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

function Mail({ e, sizes }: { e: StageEmail; sizes: string }) {
  return (
    <figure className={s.mail}>
      <div className={s.mailImg}>
        <Image src={e.src} alt={e.alt} width={e.width} height={e.height} sizes={sizes} />
      </div>
      <figcaption className={s.mailCap}>
        <span className={s.mailWhen}>{e.sentAt}</span>
        <span className={s.mailSubject}>{e.subject}</span>
      </figcaption>
    </figure>
  )
}

function Kept({ emails }: { emails: StageEmail[] }) {
  if (!emails.length) return null
  return (
    <ul className={s.kept}>
      {emails.map((e) => (
        <li key={e.src}><span className={s.mailWhen}>{e.sentAt}</span> {e.subject} <span className={s.keptNote}>· carries a real entry ticket, so it isn’t shown</span></li>
      ))}
    </ul>
  )
}

export default function CaseJourney({ n, journey, site }: { n: string; journey: NonNullable<CaseStudy['journey']>; site: CaseStudy['cover'] }) {
  const { stages } = journey
  return (
    <section className={s.root} data-tone="ink" data-journey="" aria-labelledby="cs-run">
      <header className={s.head}>
        <p className={s.part}><span className={s.n}>{n}</span>Run · the journey</p>
        <h2 id="cs-run" className={s.statement}>{journey.heading}</h2>
        <p className={s.intro}>{journey.intro}</p>
      </header>

      <div className={s.body}>
        <div className={s.rail} data-stages="">
          <span className={s.track} aria-hidden="true"><span className={s.fill} data-fill="" /></span>
          <ol className={s.stages}>
          {stages.map((st, i) => {
            const shown = st.emails.filter((e) => !e.private)
            const kept = st.emails.filter((e) => e.private)
            return (
              <li key={st.id} className={s.stage} data-stage={i} data-emails={Math.max(1, shown.length)} style={{ '--emails': Math.max(1, shown.length) } as CSSProperties}>
                <span className={s.dot} aria-hidden="true" />
                <p className={s.stageNum}>{pad(i + 1)} / {pad(stages.length)}</p>
                <h3 className={s.stageName}>{st.name}</h3>
                <dl className={s.rows}>
                  <div><dt>When</dt><dd>{st.when}</dd></div>
                  <div><dt>What happens</dt><dd>{st.says}</dd></div>
                  {st.stops && <div><dt>Stops</dt><dd>{st.stops}</dd></div>}
                </dl>
                {st.result && <p className={s.result}>{st.result}</p>}
                {st.screen && (
                  <figure className={s.inlineScreen}>
                    <Image src={st.screen.src} alt={st.screen.alt} width={st.screen.width} height={st.screen.height} sizes="(min-width: 761px) 46vw, 92vw" />
                  </figure>
                )}
                {/* In the list (phones, reduced motion, no script) each stage carries its own emails */}
                {shown.length > 0 && (
                  <div className={s.inline}>
                    {shown.map((e) => <Mail key={e.src} e={e} sizes="(min-width: 761px) 30vw, 72vw" />)}
                  </div>
                )}
                <Kept emails={kept} />
              </li>
            )
          })}
          </ol>
        </div>

        {/* The stage repeats the emails above for sighted desktop visitors, so it is hidden from screen readers */}
        <div className={s.viewer} aria-hidden="true" data-viewer="">
          <div className={s.screen}>
            {/* One slide per email, so each is read at size: scrolling through a stage steps through
                its emails. A stage with none it can show gets one slide saying why. */}
            {stages.flatMap((st, i) => {
              const shown = st.emails.filter((e) => !e.private)
              const kept = st.emails.filter((e) => e.private)
              const label = `Stage ${pad(i + 1)} · ${st.name}`
              if (!shown.length) {
                return [
                  <div key={st.id} className={`${s.slide} ${s.slideText}`} data-slide={`${i}-0`}>
                    <p className={s.slideLabel}>{label}</p>
                    {kept.length > 0 ? (
                      <>
                        <ul className={s.slideKept}>{kept.map((e) => <li key={e.src}><span className={s.mailWhen}>{e.sentAt}</span>{e.subject}</li>)}</ul>
                        <p className={s.slideNote}>These carry a real entry ticket, so they aren’t shown.</p>
                      </>
                    ) : st.screen ? (
                      // A step that happens on the site shows the site's own screen for it
                      <div className={s.slideSite}>
                        <Image src={st.screen.src} alt="" width={st.screen.width} height={st.screen.height} sizes="(min-width: 1024px) 46vw, 0px" />
                      </div>
                    ) : st.result ? (
                      <>
                        <p className={s.slideResult}>{st.result}</p>
                        <p className={s.slideNote}>No email goes out at this stage.</p>
                      </>
                    ) : (
                      // Nothing is sent and nothing counted: this step happens on the site, so show the site
                      <div className={s.slideSite}>
                        <Image src={site.src} alt="" width={site.width} height={site.height} sizes="(min-width: 1024px) 46vw, 0px" />
                      </div>
                    )}
                  </div>,
                ]
              }
              return shown.map((e, j) => (
                <div key={e.src} className={s.slide} data-slide={`${i}-${j}`}>
                  <div className={s.slideHead}>
                    <p className={s.slideLabel}>{label}{shown.length > 1 && <> · Email {j + 1} of {shown.length}</>}</p>
                    <p className={s.mailWhen}>{e.sentAt}</p>
                    <p className={s.slideSubject}>{e.subject}</p>
                  </div>
                  <div className={s.slideImg}>
                    <Image src={e.src} alt="" width={e.width} height={e.height} sizes="(min-width: 1024px) 46vw, 0px" />
                  </div>
                </div>
              ))
            })}
          </div>
        </div>
      </div>

      {journey.beyond && <p className={s.beyond}>{journey.beyond}</p>}
    </section>
  )
}
