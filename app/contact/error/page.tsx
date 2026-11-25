// Where a message that failed to send lands. The form kept the visitor's words (ContactForm saves
// them before coming here), so "Try again" brings them back. Kept out of search.

import type { Metadata } from 'next'
import Shell from '../../../components/directions/home/Shell'
import Outcome from '../../../components/directions/contact/Outcome'
import { CONTACT } from '../../../lib/directions/work'

export const metadata: Metadata = {
  // The contact layout sets a plain title, which drops the root template, so the suffix is explicit
  title: { absolute: 'Message not sent | Jacqueline Amoako' },
  robots: { index: false, follow: true },
}

export default function NotSent() {
  return (
    <Shell>
      <Outcome
        kicker="Not sent"
        lines={['That message', 'didn’t send.']}
        line="Your words are still in the form, so you can send it again. If it fails a second time, email me instead."
        ways={[
          { href: '/contact', label: 'Try again' },
          { href: `mailto:${CONTACT.email}`, label: CONTACT.email, method: 'email' },
        ]}
      />
    </Shell>
  )
}
