// The About page's career, from the canonical work history (re-locked 2026-11-24, the same nine
// roles LinkedIn lists). Each role sits in the lane of the work it grew: Build (the web), Run (keeping
// and selling to customers, now the whole journey) and Fix (support: answering what went wrong).
// Zera sits in two lanes, because running a client's journey includes fixing what breaks in it.
// Dates are months; a role with no end is current.

import type { Layer } from './triage'

export type Role = {
  org: string
  title: string
  kind?: string
  from: [number, number]
  to?: [number, number]
  lanes: Layer[]
  line?: string
}

export const ROLES: Role[] = [
  { org: 'WopeDigital', title: 'Customer Support Specialist', kind: 'Internship', from: [2019, 1], to: [2019, 3], lanes: [3] },
  {
    org: 'DerkOnline', title: 'Frontend Developer', kind: 'Freelance', from: [2019, 4], to: [2024, 9], lanes: [1],
    line: 'More than 25 websites for clients, as a freelancer.',
  },
  {
    org: 'miLife Insurance', title: 'Customer Service Specialist', from: [2019, 10], to: [2020, 10], lanes: [3],
    line: 'Customer service for an insurance company.',
  },
  {
    org: 'BLUETOWN', title: 'Customer Success Manager', from: [2020, 11], to: [2022, 1], lanes: [2],
    line: 'I owned accounts from the first conversation through to conversion, with customer satisfaction at 90%.',
  },
  {
    org: 'Fair Trade Outsourcing Ghana', title: 'Proctor and Technical Support Facilitator', from: [2022, 5], to: [2023, 5], lanes: [3],
    line: 'Proctoring exams, and sorting out the technical problems that came up during them.',
  },
  { org: 'Buwelo Ghana', title: 'Telesales Representative', from: [2024, 1], to: [2024, 6], lanes: [2] },
  {
    org: 'Command Space', title: 'Frontend Developer', kind: 'Part-time', from: [2024, 7], lanes: [1],
    line: 'Websites for a digital marketing agency, on an eight-person team.',
  },
  { org: 'Day&Night Support', title: 'Payment Recovery Agent', kind: 'Contract', from: [2025, 1], to: [2025, 4], lanes: [2] },
  {
    org: 'Zera', title: 'Lifecycle Marketing and CRM Automation Lead', kind: 'Full-time', from: [2025, 11], lanes: [2, 3],
    line: 'I run the customer journey for clients: the CRM, the email and WhatsApp automation, and whatever breaks in it.',
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "Jan to Mar 2019", "Apr 2019 to Sep 2024", "Jul 2024 to now"
export function span({ from, to }: Role) {
  const [fy, fm] = from
  if (!to) return `${MONTHS[fm - 1]} ${fy} to now`
  const [ty, tm] = to
  return fy === ty ? `${MONTHS[fm - 1]} to ${MONTHS[tm - 1]} ${fy}` : `${MONTHS[fm - 1]} ${fy} to ${MONTHS[tm - 1]} ${ty}`
}
