// "What I do": the sentence alone, centred, held in view while each phrase fills with ink as you
// scroll (SkillsMotion). The sentence is also the way in: under it, the three roles a recruiter
// hires for, each a link to the section that proves it, and a line saying so. A phrase links
// there too. Picking one is remembered (path.ts) so the rest of the page can follow it.

import { PATHS } from './path'
import SkillsMotion from './SkillsMotion'
import s from './skills.module.css'

const PHRASES = ['I build the software,', 'run the journey behind it,', 'and fix what breaks.']

export default function Skills() {
  return (
    <section className={s.root} data-skills="" aria-labelledby="skills-title">
      <div className={s.hold}>
        <p className={s.kicker}>What I do</p>
        <h2 id="skills-title" className={s.sentence}>
          {PHRASES.map((p, i) => (
            <span key={p}>
              <a href={`#${PATHS[i].target}`} className={s.phrase} data-phrase={i} data-path-link={PATHS[i].n}>{p}</a>{' '}
            </span>
          ))}
        </h2>
        <nav className={s.paths} aria-label="Choose the role you’re hiring for">
          <ol>
            {PATHS.map((p) => (
              <li key={p.n}>
                <a href={`#${p.target}`} className={s.path} data-path-link={p.n} data-path-label={p.n}>
                  <span className={s.num}>{String(p.n).padStart(2, '0')}</span>
                  {p.name}
                  <span aria-hidden="true"> ↓</span>
                </a>
              </li>
            ))}
          </ol>
          <p className={s.hint}>Short on time? Jump to the part you’re hiring for.</p>
        </nav>
      </div>
      <SkillsMotion />
    </section>
  )
}
