// Client testimonials. testimonials.json is the one source; case studies and the portfolio read
// them from here by id. Wording was edited for plain reading (her permission, 20 Nov 2026); each
// keeps only what that client said. Fredericka Doku's (13) is word for word.

import data from '../testimonials.json'

export type Testimonial = { quote: string; name: string; role: string }

export function testimonial(id: number): Testimonial {
  const t = data.testimonials.find((x) => x.id === id)
  if (!t) throw new Error(`Unknown testimonial: ${id}`)
  return { quote: t.quote, name: t.clientName, role: t.clientInfo }
}
