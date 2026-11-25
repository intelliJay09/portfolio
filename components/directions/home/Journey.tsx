// "Run the journey behind it": the lifecycle proof, on the ink ground.
// A statement that holds on the left while six journeys scroll past on the right, each drawn as a
// rail of its steps with a pulse that runs along it as you scroll (JourneyMotion): the journey
// running. Under them, one directed recording of a journey running for real in Orella.
//
// journey-short: a real run in Orella's test tenant on 19 Nov 2026 (the email went to her own
// inbox), with her address blurred in every frame and checked by text recognition, and the 10 s
// page-refresh wait cut out. Steps and camera points were read off the clip the same way as
// Build the software. The journeys are read from Zera's live journeys in Orella (19 Nov 2026) and
// belong to Zera's clients, not to the Gwen Addo system in the next chapter.

import type { CSSProperties } from 'react'
import Chapter from './Chapter'
import Directed, { type Cue } from './Directed'
import DirectedAuto from './DirectedAuto'
import JourneyMotion from './JourneyMotion'
import s from './journey.module.css'

const CUES: Cue[] = [
  [0, 'A new client in Orella, at the first stage', [0.5, 0.5, 1]],
  [3.2, 'I move them to “Aha moment reached”', [0.28, 0.5, 2]],
  [9, 'The stage changes, and the journey picks it up', [0.75, 0.5, 1.5]],
  [11.6, 'The journey runs, and records the milestone', [0.33, 0.75, 1.8]],
  [13, 'And the email goes out by itself: sent', [0.32, 0.83, 2]],
  [16.8, 'And the email goes out by itself: sent', [0.32, 0.22, 2]],
]

const LEAD = 'At Zera, I built 17 live journeys for clients, on email, WhatsApp, Instagram and Messenger. They move on what the client does: a signature, a payment, a reply.'

// Each journey as the steps it takes, in order. Same facts as the live journeys, one step a line.
const JOURNEYS: [string, string[]][] = [
  ['Onboarding', ['Signed contract', 'Kickoff and deposit invoice', 'Deposit paid', 'Each sign-off chased', 'Stalled 20 days: the team gets a task']],
  ['Renewals', ['Reminder', 'Follow-up', 'Renewal booked, or closed out from the reply']],
  ['Late payments', ['Notice at day 7', 'Notice at day 14', 'Notice at day 30', 'Stops the moment the invoice is paid']],
  ['Satisfaction', ['WhatsApp check-in after setup', 'And every quarter', 'Each reply recorded', 'An unhappy one is flagged to the team']],
  ['Win-back', ['Offer by email', 'Then WhatsApp', 'Still no answer?', 'A person steps in, or a last email goes out']],
  ['Growth', ['Referral and testimonial asks', 'Anniversaries', 'A reply to every new enquiry, on whichever channel it came in']],
]

export default function Journey() {
  return (
    <section id="run" data-tone="ink" className={s.root} aria-labelledby="run-title">
      <Chapter className={s.chapter} n="02" title="Run the journey behind it" titleId="run-title" role="Lifecycle and growth marketing" pickFor={2} />

      <div className={s.split}>
        <div className={s.intro}>
          <p className={s.bridge}>Launching is the start. Then comes what happens to someone after they sign up.</p>
          <p className={s.lead}>{LEAD}</p>
        </div>

        <ol className={s.journeys}>
          {JOURNEYS.map(([name, steps]) => (
            <li key={name} className={s.journey}>
              <h3 className={s.jname}>{name}</h3>
              {/* data-journey-rail: the pulse runs along it and lights each step as it passes (JourneyMotion) */}
              <div className={s.rail} data-journey-rail="" style={{ '--n': steps.length } as CSSProperties}>
                <ol className={s.steps}>
                  {steps.map((step) => (
                    <li key={step}><span className={s.dot} data-dot="" aria-hidden="true" />{step}</li>
                  ))}
                </ol>
                <span className={s.fill} aria-hidden="true" />
                <span className={s.pulse} aria-hidden="true" />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <figure className={s.proof}>
        <figcaption className={s.caption}>A journey running for real, in Orella</figcaption>
        <Directed
          rec="journey-short"
          cues={CUES}
          duration={20.5}
          label="A journey running in Orella: a client is moved to Aha moment reached, and the email is sent"
          className={s.screen}
        />
      </figure>
      <DirectedAuto within="run" />
      <JourneyMotion />
    </section>
  )
}
