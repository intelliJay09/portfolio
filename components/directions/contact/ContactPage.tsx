// Contact: the heading and the direct ways to reach her on the left, the form on the right (stacked
// on a phone). The form is the page's one moving part (ContactForm); everything else is static.

import { CONTACT } from '../../../lib/directions/work'
import Lines from '../shared/Lines'
import ContactForm from './ContactForm'
import ContactMotion from './ContactMotion'
import s from './contact.module.css'
import Arrow from '../shared/Arrow'

export default function ContactPage({ message, about }: { message: string; about: string }) {
  return (
    <div className={s.page} data-contact="">
      <header className={s.intro}>
        <p className={s.kicker}>Contact</p>
        <Lines as="h1" className={s.title} lines={['Tell me what', 'you need.']} />
        <p className={s.line}>A role, a project, or a question about your customer journey. I’ll get back to you.</p>
        <dl className={s.direct}>
          <div>
            <dt>Rather email?</dt>
            <dd><a href={`mailto:${CONTACT.email}`} className={s.u} data-method="email">{CONTACT.email}<Arrow /></a></dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd><a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className={s.u} data-method="linkedin">Jacqueline Amoako<Arrow out /></a></dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>Accra, Ghana. GMT, all year.</dd>
          </div>
        </dl>
      </header>

      <ContactForm initialMessage={message} initialAbout={about} />
      <ContactMotion />
    </div>
  )
}
