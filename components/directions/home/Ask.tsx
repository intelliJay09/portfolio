'use client'

// "What do you need?", on the ink ground. The question is the field's own label; the visitor
// answers it on the line beneath, in the same voice, and the answer happens as they type:
//   - three lanes (the three kinds of work) sit beside the field; the one the problem lives in
//     lights, with the same pulse that runs the journeys, and opens to what she would do, where she
//     has done it before, and one way to send it
//   - while the field is idle it types through the examples itself, and the lanes light for each,
//     so the page shows how it works before anyone touches it
//   - the examples are lines you can click: they type themselves into the field
// Matching runs in the browser (lib/directions/triage.ts, deterministic, no model); nothing is sent
// anywhere until the visitor chooses to send it. Reduced motion: no self-typing and no pulse; the
// lanes and answer simply appear.

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { triage, contactHref, LAYER_NAMES, type Layer, type Triage } from '../../../lib/directions/triage'
import { onPath, readPath } from './path'
import s from './ask.module.css'

const EXAMPLES = [
  'Our site gets visitors but no bookings',
  'People sign up, then go quiet',
  'Customers paid but never got a confirmation',
  'We’re hiring a frontend developer',
]
// The lanes each example lights, for the idle demonstration
const DEMO: Layer[][] = EXAMPLES.map((e) => triage(e).layers)
const LANES: Layer[] = [1, 2, 3]
// Below this the words are too few to place; unplaced text shows the fallback only once it is a real sentence
const MIN_MATCH = 4
const MIN_FALLBACK = 14

function Answer({ result, asked, sendRef }: { result: Triage; asked: string; sendRef: React.Ref<HTMLAnchorElement> }) {
  return (
    <div className={s.answer} key={result.id}>
      <h3 className={s.heading}>{result.heading}</h3>
      <p className={s.body}>{result.answer}</p>
      {result.also && <p className={s.also}>{result.also.heading}</p>}
      {result.proof && (
        <p className={s.proof}>
          <span className={s.label}>Done before</span>
          <span>{result.proof.text}</span>
          {result.proof.href && <Link href={result.proof.href} className={s.proofLink}>{result.proof.link}</Link>}
        </p>
      )}
      <Link ref={sendRef} href={contactHref(asked, result.service)} className={s.send}>
        Send this to me<span aria-hidden="true"> →</span>
      </Link>
    </div>
  )
}

export default function Ask() {
  const id = useId()
  const [text, setText] = useState('')
  // The text the lanes answer: it settles a moment after typing stops, so the lit lane does not flicker
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [busy, setBusy] = useState(false) // an example is typing itself in
  const [animate, setAnimate] = useState(false) // false until we know motion is allowed (and on the server)
  const [ghost, setGhost] = useState('')
  const [demo, setDemo] = useState<Layer[]>([])
  // The role picked in "What I do", if any, is marked while nothing has been asked yet
  const [path, setPath] = useState<Layer | null>(null)
  const timer = useRef<number>(0)
  const sendRef = useRef<HTMLAnchorElement>(null)
  const lanesRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setPath(readPath())
    return onPath(setPath)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Typing settles the query after a short pause; a pause of nothing when the field is cleared
  useEffect(() => {
    if (busy) return
    const t = window.setTimeout(() => setQuery(text), text ? 240 : 0)
    return () => window.clearTimeout(t)
  }, [text, busy])

  const trimmed = query.trim()
  const found = trimmed.length >= MIN_MATCH ? triage(trimmed) : null
  const result = found && (found.id !== 'other' || trimmed.length >= MIN_FALLBACK) ? found : null

  // Idle: the field types through the examples by itself and the lanes light for each
  const idle = animate && !focused && text === '' && !busy
  useEffect(() => {
    if (!idle) { setGhost(''); setDemo([]); return }
    let i = 0
    let k = 0
    let dead = false
    let t = 0
    const type = () => {
      if (dead) return
      const full = EXAMPLES[i]
      k += 1
      setGhost(full.slice(0, k))
      if (k < full.length) { t = window.setTimeout(type, 46); return }
      setDemo(DEMO[i])
      t = window.setTimeout(erase, 2600)
    }
    const erase = () => {
      if (dead) return
      const full = EXAMPLES[i]
      if (k === full.length) setDemo([])
      k -= 1
      setGhost(full.slice(0, Math.max(k, 0)))
      if (k > 0) { t = window.setTimeout(erase, 20); return }
      i = (i + 1) % EXAMPLES.length
      t = window.setTimeout(type, 500)
    }
    t = window.setTimeout(type, 700)
    return () => { dead = true; window.clearTimeout(t) }
  }, [idle])

  // Stacked layout (a phone): the lanes sit below the examples, so after an example is chosen the
  // lit lane is brought into view. Typing is left alone, since the keyboard is up.
  const showAnswer = (delay: number) => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    window.setTimeout(
      () => lanesRef.current?.querySelector('[data-primary]')?.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: 'center' }),
      delay,
    )
  }

  // An example types itself into the field, then the lanes answer
  const typeIn = (value: string) => {
    window.clearTimeout(timer.current)
    if (!animate) { setText(value); setQuery(value); showAnswer(150); return }
    setBusy(true)
    setText('')
    let k = 0
    const tick = () => {
      k += 1
      setText(value.slice(0, k))
      if (k < value.length) { timer.current = window.setTimeout(tick, 24); return }
      setBusy(false)
      setQuery(value)
      showAnswer(700)
    }
    timer.current = window.setTimeout(tick, 140)
  }

  const lit: Layer[] = result ? result.layers : demo
  const primary = result?.layers[0]

  return (
    <div className={s.ask}>
      <div className={s.say}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* The question is the field's own label, so the heading and the thing you type into are one */}
          <h2 id="ask-title" className={s.question}><label htmlFor={id}>What do you need?</label></h2>
          <div className={s.field}>
            <textarea
              id={id}
              className={s.input}
              value={text}
              rows={1}
              onChange={(e) => {
                window.clearTimeout(timer.current)
                setBusy(false)
                setText(e.target.value)
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                // Enter moves on to sending; Shift+Enter starts a new line
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendRef.current?.focus()
                }
              }}
              placeholder={animate && idle ? '' : EXAMPLES[1]}
              autoComplete="off"
              maxLength={300}
              enterKeyHint="go"
            />
            {animate && idle && (
              <span className={s.ghost} aria-hidden="true">{ghost}<i className={s.caret} /></span>
            )}
          </div>
          <p className={s.private}>Say it the way you’d say it out loud. What you type stays in your browser until you choose to send it.</p>
        </form>

        <div className={s.examples}>
          <span className={s.label}>Or try</span>
          <ul>
            {EXAMPLES.map((ex) => (
              <li key={ex}>
                <button type="button" className={s.example} data-on={text === ex ? '' : undefined} onClick={() => typeIn(ex)}>
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.answers}>
        <p className={s.sr} role="status">{result ? `${result.heading} ${result.answer}` : ''}</p>
        <ol ref={lanesRef} className={s.lanes}>
          {LANES.map((n) => (
            <li
              key={n}
              className={s.lane}
              data-lit={lit.includes(n) ? '' : undefined}
              data-primary={primary === n ? '' : undefined}
            >
              <span className={s.dot} aria-hidden="true" />
              <span className={s.pulse} aria-hidden="true" />
              <p className={s.name}>
                {LAYER_NAMES[n]}
                {!result && path === n && <span className={s.tag}>Your pick</span>}
              </p>
              <div className={s.reveal}>
                <div>{result && primary === n && <Answer result={result} asked={trimmed} sendRef={sendRef} />}</div>
              </div>
            </li>
          ))}
        </ol>
        {/* Teaching, or text that places nowhere: no lane, but the answer and a way to send it */}
        {result && result.layers.length === 0 && (
          <div className={s.other}><Answer result={result} asked={trimmed} sendRef={sendRef} /></div>
        )}
      </div>
    </div>
  )
}
