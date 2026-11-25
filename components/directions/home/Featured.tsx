// Featured work: three pieces on one stage. The names sit in a line across the top and one screen
// plays the work beneath them, directed: as each step of the recording happens, the camera leans
// in on it (the quiz being answered, the plan it recommends, the call transcript) so the work is
// seen at close to real size, and a caption says what is happening. Under the screen, a rail
// marks each step; any step can be jumped to, and the recording can be paused.
// Scrolling hands the stage from one piece to the next: the name comes up to full strength and the screen
// wipes to its recording (FeaturedMotion). Without that script (no JS, reduced motion, phones)
// the same markup reads as a plain list: name, recording, steps, details.
// Everything else she has built lives on the portfolio page.
//
// Facts: the live sites and Vocyx's own page, plus each project's package.json (19 Nov 2026).
// Step times and camera positions were read off each recording: one frame a second, with the
// on-screen elements located by text recognition (x and y are fractions of the frame).

import Link from 'next/link'
import Chapter from './Chapter'
import Directed, { type Cue } from './Directed'
import { DIRECTED, WIDE } from '../../../lib/directions/recordings'
import FeaturedMotion from './FeaturedMotion'
import s from './featured.module.css'
import Arrow from '../shared/Arrow'
type Piece = {
  name: string
  kind: 'Website' | 'App'
  line: string
  stack: string[]
  rec: string
  duration: number
  cues: Cue[]
  live: { href: string; label: string }
  caseStudy?: string
}


const FEATURED: Piece[] = [
  {
    name: 'Orella',
    kind: 'Website',
    line: 'The website for Orella, a customer lifecycle platform: the product tour, the pricing, and a five-question plan finder that recommends a plan.',
    stack: ['Next.js'],
    rec: 'orella-site-demo',
    duration: 20.6,
    cues: [
      [0, 'Switches the sample record from a shop to a services business', WIDE],
      [1, 'Switches the sample record from a shop to a services business', [0.7, 0.52, 1.7]],
      [4, 'Scrolls to pricing', WIDE],
      [6.5, 'Answers the plan finder’s five questions', [0.465, 0.72, 2]],
      [14, 'Answers the plan finder’s five questions', [0.5, 0.45, 1.15]],
      [16, 'It recommends Pro, GHS 999 a month', [0.465, 0.73, 2]],
      [19, 'Pro is marked on the plan grid', [0.6, 0.35, 1.6]],
    ],
    live: { href: 'https://orellahub.com', label: 'orellahub.com' },
  },
  {
    name: 'Gwen Addo',
    kind: 'Website',
    line: 'A leadership coach’s website, built in Next.js. It’s where people find her programmes and book.',
    stack: ['Next.js'],
    // The steps are shared with her case study (lib/directions/recordings.ts)
    rec: 'gwen-new-demo',
    ...DIRECTED['gwen-new-demo'],
    live: { href: 'https://www.gwenaddo.com', label: 'gwenaddo.com' },
    caseStudy: '/portfolio/gwen-addo',
  },
  {
    name: 'Vocyx',
    kind: 'App',
    line: 'Voice-first sales training. You talk live with an AI buyer who holds a hidden brief, then the brief is revealed and the call is graded.',
    stack: ['Next.js', 'Gemini Live', 'Postgres', 'Expo'],
    rec: 'vocyx-call',
    duration: 101.3,
    cues: [
      [0, 'A cold call to Yaw, a grill-house owner. The goal: a ten-minute follow-up', [0.58, 0.44, 1.7]],
      [3, 'Live call. Yaw picks up first', [0.58, 0.45, 1.6]],
      [12, 'He pushes back, and every line is transcribed as it’s said', [0.585, 0.72, 1.75]],
      [68, 'Grading the call against what Yaw was really thinking', [0.58, 0.42, 1.2]],
      [70.6, 'A scripted test call, graded honestly. Then what Yaw wasn’t telling you', [0.55, 0.33, 1.4]],
      [78, 'His real objection, then his private thoughts, line by line', [0.55, 0.45, 1.45]],
    ],
    live: { href: 'https://vocyx.zerahq.com', label: 'vocyx.zerahq.com' },
  },
]

export default function Featured() {
  return (
    <section id="work" className={s.root} aria-labelledby="featured-title" data-featured="">
      <div className={s.track} data-featured-track="">
        <div className={s.stage} data-featured-stage="">
          {/* The chapter mark rides in the stage, so the names under it are the section's headlines */}
          <Chapter className={s.chapter} n="01" title="Build the software" titleId="featured-title" role="Frontend development" pickFor={1} />
          {FEATURED.map((p, i) => {
            return (
              <div key={p.name} id={`feature-${i}`} className={s.piece} data-piece={i}>
                <div className={s.head}>
                  <p className={s.meta}>{p.kind}</p>
                  <h3 className={s.name}>
                    <a href={`#feature-${i}`} className={s.nameLink} data-piece-name={i}>{p.name}</a>
                  </h3>
                </div>
                <Directed rec={p.rec} cues={p.cues} duration={p.duration} label={`${p.name} in use`} className={s.screen} />
                <div className={s.body} data-piece-body={i}>
                  <p className={s.line}>{p.line}</p>
                  <div className={s.detail}>
                    <p className={s.stack}>{p.stack.join(' · ')}</p>
                    <p className={s.links}>
                      <a href={p.live.href} target="_blank" rel="noopener noreferrer">{p.live.label}<Arrow out /></a>
                      {p.caseStudy && <Link href={p.caseStudy}>Case study<Arrow /></Link>}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <p className={s.all}>
        <Link href="/portfolio" className={s.allLink}>Everything I’ve built<Arrow /></Link>
      </p>
      <FeaturedMotion />
    </section>
  )
}
