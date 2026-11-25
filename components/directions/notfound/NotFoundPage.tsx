// The 404. An ink opening holds the wall (MissingField): squares of the emails her system sent for
// one client, with one square that never arrives. That empty one is this page.
// Over it, the words in the shape she writes up a support incident: a case number, the headline
// (the word "missing" arrives with the outline), what happened, and the fix: the ways on, and a
// way to tell her where the broken link was.
// The title's lines are split in the markup (with shared/Lines' masks) so the word can sit inside one.

import Link from 'next/link'
import Arrow from '../shared/Arrow'
import { LINE_INNER as INNER, LINE_MASK as LINE } from '../shared/Lines'
import MissingField from './MissingField'
import NotFoundMotion from './NotFoundMotion'
import ReportLink from './ReportLink'
import s from './notfound.module.css'

const WAYS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
]

export default function NotFoundPage() {
  return (
    <section className={s.hero} data-tone="ink" data-notfound="">
      <MissingField className={s.field} />
      <div className={s.words}>
        <p className={s.kicker}>Case 404</p>
        <h1 className={s.title} data-lines="">
          <span data-line="" style={LINE}><span data-line-inner="" style={INNER}>This page </span></span>
          <span data-line="" style={LINE}>
            <span data-line-inner="" style={INNER}>is <span className={s.word} data-missing="">missing.</span></span>
          </span>
        </h1>
        <dl className={s.rows}>
          <div>
            <dt className={s.rowKey}>What happened</dt>
            <dd>The link points to a page that isn’t on this site. It may have moved, or there’s a typo in the address.</dd>
          </div>
          <div>
            <dt className={s.rowKey}>Fix</dt>
            <dd>
              <ul className={s.ways}>
                {WAYS.map((w) => <li key={w.href}><Link href={w.href} className={s.way}>{w.label}<Arrow /></Link></li>)}
              </ul>
              <ReportLink className={s.report} />
            </dd>
          </div>
        </dl>
        <p className={s.caption}>Each square is one of the 1,695 emails my system sent for one client. The empty one is this page.</p>
      </div>
      <NotFoundMotion />
    </section>
  )
}
