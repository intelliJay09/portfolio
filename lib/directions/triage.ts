// "What do you need?": a visitor describes a problem in their own words, and the page
// answers with where it lives (the three layers of the drawing above it), what Jacqueline
// would do, and where she has done it before.
//
// Deterministic on purpose: no model call, so it costs nothing, answers instantly, keeps
// the visitor's words in their browser, and can never invent a claim. Every answer and
// proof line below uses only verified figures (canonical work history, Cohort 3 digest).
// Plain TypeScript with no enums, so `node --test` can run the tests without a build.

export type Layer = 1 | 2 | 3

export type Service =
  | 'website'
  | 'lifecycle-automation'
  | 'crm-setup'
  | 'role-or-opportunity'
  | 'teaching-mentorship'
  | 'other'

export type Proof = { text: string; href?: string; link?: string }

type Intent = {
  id: string
  layers: Layer[]
  service: Service
  /** Phrases count 3 points each */
  phrases: string[]
  /** Whole words count 1 point each */
  words: string[]
  /** Generic words count half a point */
  weak?: string[]
  /** Breaks ties: a failure described alongside a journey is a support problem first */
  priority?: number
  heading: string
  answer: string
  proof?: Proof
}

// The three kinds of work; 'Layer' is kept as the type name for the matcher's internals
export const LAYER_NAMES: Record<Layer, string> = { 1: 'Frontend development', 2: 'Lifecycle and growth marketing', 3: 'Technical support' }

const GWEN = '/portfolio/gwen-addo'

const INTENTS: Intent[] = [
  {
    id: 'site',
    layers: [1],
    service: 'website',
    phrases: ['web site', 'landing page', 'home page', 'booking site', 'not ranking', 'on google', 'too slow', 'loads slowly', 'looks old', 'looks outdated', 'no bookings', 'not getting bookings', 'nobody books', 'no enquiries', 'new site', 'on mobile', 'on a phone'],
    words: ['website', 'websites', 'site', 'redesign', 'slow', 'speed', 'seo', 'google', 'wordpress', 'nextjs', 'next.js', 'react', 'frontend', 'front-end', 'design', 'bookings', 'enquiries', 'visitors', 'traffic', 'responsive', 'pagespeed'],
    weak: ['page', 'pages', 'mobile', 'booking', 'convert', 'conversions'],
    heading: 'That’s a website job.',
    answer:
      'I build sites people can find, trust and act on, in Next.js or WordPress. Fast on a phone, clear about the next step, and set up so everyone who books or enquires is someone you can follow up with.',
    proof: { text: 'Finest Dietitian’s first paid booking came three days after launch.', href: '/portfolio/finest-dietitian', link: 'Read the case study' },
  },
  {
    id: 'activation',
    layers: [2],
    service: 'lifecycle-automation',
    phrases: ['sign up', 'signed up', 'never buy', "don't buy", 'dont buy', 'never pay', 'go quiet', 'goes quiet', 'went quiet', 'go cold', 'leads go cold', 'follow up', 'not converting', 'trial to paid', 'after they register'],
    words: ['signup', 'signups', 'sign-ups', 'leads', 'onboarding', 'activation', 'activate', 'nurture', 'funnel', 'trial', 'registrations', 'registered', 'follow-up'],
    weak: ['lead', 'register', 'conversion', 'quiet'],
    heading: 'That’s a customer journey job.',
    answer:
      'I map every stage between sign-up and the first payment, then automate the email and WhatsApp messages that move people to the next one, and stop each message the moment someone acts.',
    proof: { text: 'For Gwen Addo’s programme: 1,695 emails to 194 people, none sent by hand.', href: GWEN, link: 'See the whole journey' },
  },
  {
    id: 'checkout',
    layers: [2],
    service: 'lifecycle-automation',
    phrases: ['abandoned cart', 'abandoned checkout', 'abandoned carts', 'abandoned checkouts', 'leave the checkout', 'add to cart'],
    words: ['abandoned', 'cart', 'carts', 'checkout', 'checkouts', 'basket'],
    heading: 'That’s a customer journey job.',
    answer:
      'A checkout someone left is a warm lead. I set up the reminders that bring them back to finish, timed to when they are most likely to act.',
  },
  {
    id: 'retention',
    layers: [2],
    service: 'lifecycle-automation',
    phrases: ['come back', 'coming back', 'buy again', 'repeat customers', 'past customers', 'lost customers', 'win back', 'keep customers', 'one-time buyers', 'only buy once'],
    words: ['retention', 'retain', 'churn', 'lapsed', 'inactive', 'loyalty', 'repeat', 'reactivate', 'winback', 'win-back', 'returning'],
    heading: 'That’s a customer journey job.',
    answer:
      'Keeping customers is part of the journey. I find the people who have gone quiet, work out what brought them in the first time, and give them a real reason to come back.',
    proof: { text: 'Nine of Gwen Addo’s past customers came back, worth GHS 14,050.', href: GWEN, link: 'Read how' },
  },
  {
    id: 'automation',
    layers: [2],
    service: 'crm-setup',
    phrases: ['by hand', 'copy and paste', 'too much admin', 'email marketing', 'set up a crm', 'whatsapp messages'],
    words: ['crm', 'automation', 'automate', 'automated', 'automations', 'whatsapp', 'newsletter', 'activecampaign', 'hubspot', 'make.com', 'zapier', 'spreadsheet', 'spreadsheets', 'manual', 'manually', 'admin'],
    weak: ['email', 'emails', 'messages'],
    heading: 'That’s a customer journey job.',
    answer:
      'If someone on your team does it by hand every week, it can usually run on its own. I set up the CRM and the automations around how your business already runs.',
  },
  {
    id: 'support',
    layers: [3],
    service: 'other',
    priority: 2,
    phrases: ['not working', "doesn't work", 'doesnt work', 'stopped working', "didn't get", 'didnt get', "didn't receive", 'never received', 'never got', 'went missing', 'keeps breaking', 'error message', 'customers complain', 'support tickets', 'something broke', 'is broken', 'never arrive', 'not arriving', "isn't arriving", 'never came'],
    words: ['broken', 'broke', 'bug', 'bugs', 'error', 'errors', 'crash', 'crashes', 'outage', 'failed', 'failing', 'missing', 'complaint', 'complaints', 'ticket', 'tickets', 'glitch', 'refund', 'refunds'],
    weak: ['fix', 'issue', 'issues', 'problem', 'problems', 'support', 'down'],
    heading: 'That’s a support job.',
    answer:
      'I find the actual cause, fix it so it can’t happen again, and clean up after it, so the people affected hear from you before they have to ask.',
    proof: { text: 'Eleven of Gwen Addo’s customers had paid and heard nothing. I found why, fixed it and sent every email before the client knew.', href: GWEN, link: 'Read the case study' },
  },
  {
    id: 'payments',
    layers: [3],
    service: 'crm-setup',
    priority: 1,
    phrases: ['mobile money', 'payment link', 'bank transfer', "don't match", 'dont match', 'after hours', 'outside business hours', 'at night'],
    words: ['payment', 'payments', 'paystack', 'momo', 'invoice', 'invoices', 'reconcile', 'reconciliation', 'mismatch', 'mismatches', 'receipt', 'receipts'],
    weak: ['pay', 'paid', 'money'],
    heading: 'That’s a support job, around payments.',
    answer:
      'Money is where small gaps cost the most. I connect every payment channel to the CRM so each payment is matched, confirmed and followed up, whatever time it lands.',
    proof: { text: 'GHS 67,400 across five payment channels with zero mismatches, and 70% of payments arrived outside business hours with none missed.', href: GWEN, link: 'Read the case study' },
  },
  {
    id: 'role',
    layers: [1, 2, 3],
    service: 'role-or-opportunity',
    phrases: ["we're hiring", 'we are hiring', 'hiring for', 'hiring a', 'job opening', 'open role', 'full time', 'full-time', 'part time', 'part-time', 'contract role', 'join our team', 'join the team'],
    words: ['hiring', 'hire', 'role', 'job', 'position', 'vacancy', 'recruiter', 'recruiting', 'candidate', 'interview', 'salary'],
    weak: ['team', 'developer', 'engineer', 'marketer', 'manager', 'specialist', 'lead'],
    heading: 'Hiring? Here’s where each skill shows up in my work.',
    answer:
      'Frontend: I built the sites for Finest Dietitian, Command Space and Gwen Addo. Lifecycle: I built Gwen Addo’s whole customer journey. Support: I started on the support desk and ran customer success at BLUETOWN.',
    proof: { text: 'Dates, roles and the rest of my history are on the About page.', href: '/about', link: 'See my experience' },
  },
  {
    id: 'teaching',
    layers: [],
    service: 'teaching-mentorship',
    phrases: ['speak at', 'run a workshop', 'teach our', 'mentor our'],
    words: ['teach', 'teaching', 'mentor', 'mentorship', 'mentoring', 'workshop', 'workshops', 'training', 'speaker', 'speaking', 'bootcamp', 'students', 'class', 'course'],
    weak: ['train', 'talk', 'girls'],
    heading: 'I teach too.',
    answer:
      'I mentor girls learning to code with Girl Code Africa, and I have trained more than 100 women entrepreneurs in digital skills.',
  },
]

// Job titles name a layer even when no problem words do
const ROLE_SKILLS: [Layer, string[]][] = [
  [1, ['frontend', 'front-end', 'front end', 'react', 'next.js', 'nextjs', 'web developer', 'wordpress', 'ui ']],
  [2, ['lifecycle', 'growth', 'crm', 'retention', 'email marketing', 'marketing automation', 'customer marketing', 'onboarding']],
  [3, ['support', 'customer success', 'success manager', 'helpdesk', 'help desk', 'customer experience', 'cx ']],
]

const FALLBACK = {
  id: 'other',
  layers: [] as Layer[],
  service: 'other' as Service,
  heading: 'Tell me a little more.',
  answer: 'I couldn’t place that yet. Send it to me as it is and I’ll tell you what I’d look at first.',
}

export type Triage = {
  id: string
  /** Every layer the problem touches, primary first */
  layers: Layer[]
  heading: string
  answer: string
  proof?: Proof
  /** A second layer the text also touches, when it clearly does */
  also?: { layer: Layer; heading: string }
  service: Service
}

const normalise = (text: string) =>
  ` ${text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9.'\- ]+/g, ' ').replace(/\s+/g, ' ').trim()} `

export function scoreAll(text: string) {
  const t = normalise(text)
  // Edge punctuation off each word, so "website." still counts as "website"
  const tokens = new Set(t.trim().split(' ').map((w) => w.replace(/^[.'-]+|[.'-]+$/g, '')))
  return INTENTS.map((intent) => {
    let score = 0
    for (const p of intent.phrases) if (t.includes(` ${p} `) || t.includes(` ${p}`)) score += 3
    for (const w of intent.words) if (tokens.has(w)) score += 1
    for (const w of intent.weak ?? []) if (tokens.has(w)) score += 0.5
    return { intent, score }
  }).sort((a, b) => b.score - a.score || (b.intent.priority ?? 0) - (a.intent.priority ?? 0))
}

export function triage(text: string): Triage {
  const ranked = scoreAll(text)
  const top = ranked[0]
  if (!text.trim() || !top || top.score < 1) return { ...FALLBACK }

  const { intent } = top
  const result: Triage = {
    id: intent.id,
    layers: [...intent.layers],
    heading: intent.heading,
    answer: intent.answer,
    proof: intent.proof,
    service: intent.service,
  }

  // A recruiter's message names a skill: light the layers it names, not all three
  if (intent.id === 'role') {
    const t = normalise(text)
    const named = new Set<Layer>(ranked.filter((r) => r.intent.id !== 'role' && r.score >= 1).flatMap((r) => r.intent.layers))
    for (const [layer, terms] of ROLE_SKILLS) if (terms.some((w) => t.includes(` ${w}`))) named.add(layer)
    if (named.size) result.layers = ([1, 2, 3] as Layer[]).filter((l) => named.has(l))
    return result
  }

  // A second, clearly present layer gets a one-line mention
  const second = ranked.find(
    (r) => r.score >= Math.max(1, top.score * 0.4) && r.intent.layers.length === 1 && !intent.layers.includes(r.intent.layers[0]),
  )
  if (second) {
    const layer = second.intent.layers[0]
    result.layers.push(layer)
    result.also = { layer, heading: `It touches ${LAYER_NAMES[layer].toLowerCase()} too.` }
  }
  return result
}

/** The contact page reads these, so the visitor's words arrive in the form */
export function contactHref(text: string, service: Service) {
  const q = new URLSearchParams({ about: service, message: text.trim().slice(0, 2000) })
  return `/contact?${q.toString()}`
}
