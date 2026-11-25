// Where a sent message lands. Kept out of search: it only means something after sending.

import type { Metadata } from 'next'
import Shell from '../../../components/directions/home/Shell'
import Outcome from '../../../components/directions/contact/Outcome'

export const metadata: Metadata = {
  // The contact layout sets a plain title, which drops the root template, so the suffix is explicit
  title: { absolute: 'Message sent | Jacqueline Amoako' },
  robots: { index: false, follow: true },
}

export default function Sent() {
  return (
    <Shell>
      <Outcome
        kicker="Message sent"
        lines={['Thank you. Your', 'message is in', 'my inbox.']}
        line="I’ll reply to the email address you gave me."
        ways={[
          { href: '/portfolio', label: 'See the portfolio' },
          { href: '/about', label: 'About me' },
          { href: '/contact', label: 'Send another message' },
        ]}
      />
    </Shell>
  )
}
