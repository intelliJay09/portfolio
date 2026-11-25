// Where the contact form lands: sent (/contact/success) or not sent (/contact/error). One screen,
// on the redesign's ground: a label, the sentence, one line, and the ways on as large links.

import Link from 'next/link'
import Lines from '../shared/Lines'
import ContactMotion from './ContactMotion'
import s from './outcome.module.css'
import Arrow from '../shared/Arrow'

type Way = { href: string; label: string; method?: string }

export default function Outcome({ kicker, lines, line, ways }: { kicker: string; lines: string[]; line: string; ways: Way[] }) {
  return (
    <div className={s.page} data-contact="">
      <p className={s.kicker}>{kicker}</p>
      <Lines as="h1" className={s.title} lines={lines} />
      <p className={s.line}>{line}</p>
      <ul className={s.ways}>
        {ways.map((w) => (
          <li key={w.href}>
            {w.href.startsWith('/') ? (
              <Link href={w.href} className={s.way}>{w.label}<Arrow /></Link>
            ) : (
              <a href={w.href} className={s.way} data-method={w.method}>{w.label}<Arrow /></a>
            )}
          </li>
        ))}
      </ul>
      <ContactMotion />
    </div>
  )
}
