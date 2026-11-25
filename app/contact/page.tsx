// Contact on the redesign's ground. The homepage's "What do you need?" hands over here with the
// visitor's words and topic in the link (?message=&about=). They are read on the server, so the
// form arrives already filled, with no flash. Metadata and structured data come from layout.tsx.

import Shell from '../../components/directions/home/Shell'
import ContactPage from '../../components/directions/contact/ContactPage'
import { TOPICS } from '../../lib/directions/contact'

type Search = { searchParams: Promise<{ message?: string | string[]; about?: string | string[] }> }

const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? ''

export default async function Contact({ searchParams }: Search) {
  const q = await searchParams
  const about = one(q.about)
  return (
    <Shell>
      <ContactPage
        message={one(q.message).slice(0, 2000)}
        about={TOPICS.some((t) => t.value === about) ? about : ''}
      />
    </Shell>
  )
}
