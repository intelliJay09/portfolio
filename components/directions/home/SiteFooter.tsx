// The footer every page in the redesign closes on, on the ink ground: "Say hello" (which carries the
// visitor's picked role as the email subject) and the ways to reach her.

import Hello from './Hello'
import { CONTACT } from '../../../lib/directions/work'
import s from './footer.module.css'

export default function SiteFooter() {
  return (
    <footer id="contact" data-tone="ink" className={s.footer}>
      <p className={s.kicker}>Contact</p>
      <Hello className={s.hello} email={CONTACT.email} />
      <div className={s.row}>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        <span>© 2026 Jacqueline Amoako</span>
      </div>
    </footer>
  )
}
