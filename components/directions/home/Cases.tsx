// "Fix what breaks": the support proof. Three real investigations. The big type is each
// incident's own headline, and one word of it starts out broken the way the incident was (gone,
// misrouted, frozen) and is fixed as you read it (CasesMotion). Each opens to the write-up a
// support lead looks for: what happened, the cause, the fix, and what the client was told.
// Native <details>, so it works with a keyboard, a screen reader and no JavaScript, and without
// motion the headlines are simply whole.
//
// Real investigations from Gwen Addo's system (orella-gwen SESSION_CONTEXT.md, sessions 4 to 6).
// No customer names, emails or unpublished digest figures.

import Chapter from './Chapter'
import CasesMotion from './CasesMotion'
import s from './cases.module.css'

/** How the headline's one word starts out: gone (silence), drift (landed in the wrong place), jam (stopped) */
type Break = 'gone' | 'drift' | 'jam'

export const CASES: { title: [before: string, word: string, kind: Break]; rows: [string, string][] }[] = [
  {
    title: ['Eleven people paid and heard ', 'nothing', 'gone'],
    rows: [
      ['What happened', 'After the masterclass, nine people who checked in and two who paid but missed it got none of the follow-up emails they were promised. None of them complained. I found it.'],
      ['Cause', 'Two bugs. Anyone already in the system before they paid skipped the follow-up journey, and the recovery tool only looked for journeys that had stalled, so it couldn’t see people who were never enrolled.'],
      ['Fix', 'Removed the condition, widened the recovery tool, and sent all eleven everything they were owed. Each email is keyed to the person, so nobody could get one twice.'],
      ['Client told', 'What happened, what I fixed, and that all eleven were caught up, before she had to ask.'],
    ],
  },
  {
    title: ['A payment for one class would have landed in ', 'another', 'drift'],
    rows: [
      ['What happened', 'The client added a payment page for a new class on the same Paystack account. Before anyone paid, I checked what the payment webhook would do with it.'],
      ['Cause', 'The webhook credited every payment to whichever event was active, which was the closed cohort. A new buyer would have been booked against it and sent the wrong welcome emails.'],
      ['Fix', 'Each payment now matches its own payment page. Caught before a single customer was affected.'],
    ],
  },
  {
    title: ['An email outage stopped every ', 'follow-up', 'jam'],
    rows: [
      ['What happened', 'On the night of the event the email provider hit its sending limit, and every follow-up journey failed and froze.'],
      ['Fix', 'I traced the frozen journeys, restarted them the next afternoon, and 60 emails went out to the people who were waiting for them.'],
    ],
  },
]

export default function Cases() {
  return (
    <section id="fix" className={s.root} aria-labelledby="fix-title">
      <Chapter className={s.chapter} n="03" title="Fix what breaks" titleId="fix-title" role="Technical support" pickFor={3} />
      <p className={s.bridge}>Automations run on their own until something breaks. Here are three times it did, and what I did about it.</p>
      <ol className={s.list}>
        {CASES.map((c, i) => (
          <li key={c.title[1]}>
            <details className={s.case}>
              <summary className={s.summary}>
                <span className={s.num}>Case {String(i + 1).padStart(2, '0')}</span>
                <span className={s.caseTitle}>
                  {c.title[0]}<span className={s.word} data-break={c.title[2]}>{c.title[1]}</span>
                </span>
                <span className={s.mark} aria-hidden="true" />
              </summary>
              <dl className={s.rows}>
                {c.rows.map(([k, v]) => (
                  <div key={k}><dt className={s.rowKey}>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </details>
          </li>
        ))}
      </ol>
      <CasesMotion />
    </section>
  )
}
