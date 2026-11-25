// The work as all three homepage directions present it. One list, so the directions differ
// only in design. Images are real captures of each live site (19 Nov 2026), or of the
// Gwen Addo rebuild, taken without device frames. Proof lines use only verified figures.
// A full-length capture, for the design that scrolls a site inside a frame.
// Finest Dietitian's has its pinned scroll scene cut out: a full-page screenshot can't
// render it and left 2,300px of black between the hero and the logos (1440 x 9342).
export const FULL = {
  'finest-dietitian': '/directions/work/finest-dietitian-scroll.webp',
} as const

export type Work = {
  slug: string
  name: string
  url: string
  /** What the site is, in plain words */
  line: string
  /** What she did on it */
  role: 'Website' | 'Website and journey' | 'Website, CRM and journey'
  desk: string
  phone: string
}

const img = (slug: string, kind: 'desk' | 'phone') => `/directions/work/${slug}-${kind}.webp`

export const WORK: Work[] = [
  {
    slug: 'gwen-addo',
    name: 'Gwen Addo',
    url: 'https://www.gwenaddo.com',
    line: 'A leadership programme’s whole customer journey, from first sign-up to the next cohort.',
    role: 'Website, CRM and journey',
    desk: img('gwen-addo', 'desk'),
    phone: img('gwen-addo', 'phone'),
  },
  {
    slug: 'finest-dietitian',
    name: 'Finest Dietitian',
    url: 'https://finestdietitian.com',
    line: 'Booking site for a registered dietitian in Accra, with the emails that follow each booking.',
    role: 'Website and journey',
    desk: img('finest-dietitian', 'desk'),
    phone: img('finest-dietitian', 'phone'),
  },
  {
    slug: 'command-space',
    name: 'Command Space',
    url: 'https://command-space.com',
    line: 'Website for Command Space, a digital marketing agency, built in Next.js.',
    role: 'Website',
    desk: img('command-space', 'desk'),
    phone: img('command-space', 'phone'),
  },
  {
    slug: 'anabs',
    name: 'Anabs',
    url: 'https://anabsgh.com',
    line: 'A residential tower in North Dzorwulu, Accra.',
    role: 'Website',
    desk: img('anabs', 'desk'),
    phone: img('anabs', 'phone'),
  },
  {
    slug: 'eleven-eleven-ghana',
    name: 'Eleven Eleven',
    url: 'https://www.11-11ghana.com',
    line: 'A beachfront resort in Ghana.',
    role: 'Website',
    desk: img('eleven-eleven', 'desk'),
    phone: img('eleven-eleven', 'phone'),
  },
  {
    slug: 'girl-code-africa',
    name: 'GirlCode Africa',
    url: 'https://www.girlcodeafrica.org',
    line: 'A non-profit teaching girls and young women across Africa to code.',
    role: 'Website',
    desk: img('girlcode', 'desk'),
    phone: img('girlcode', 'phone'),
  },
  {
    slug: 'eden-heights',
    name: 'Eden Heights',
    url: 'https://edenheights.com.gh',
    line: 'An apartment development in Accra.',
    role: 'Website',
    desk: img('eden-heights', 'desk'),
    phone: img('eden-heights', 'phone'),
  },
  {
    slug: 'landmark-homes',
    name: 'Landmark Homes',
    url: 'https://landmarkhomesgh.com',
    line: 'A residential developer’s showcase.',
    role: 'Website',
    desk: img('landmark-homes', 'desk'),
    phone: img('landmark-homes', 'phone'),
  },
  {
    slug: 'kline-designs',
    name: 'K_Line Designs',
    url: 'https://klinedesignltd.com',
    line: 'A design and engineering firm.',
    role: 'Website',
    desk: img('kline', 'desk'),
    phone: img('kline', 'phone'),
  },
  // Ghana Optometric Association and Twist are left out: on 19 Nov 2026 the first site's
  // domain resolved to 127.0.0.1 and the second sat behind a Cloudflare bot check, so
  // neither could be captured. Both are still on the live portfolio.
  {
    slug: 'emmanuel-kotia',
    name: 'Dr. Emmanuel Kotia',
    url: 'https://www.emmakotia.org',
    line: 'An academic’s research and publications.',
    role: 'Website',
    desk: img('emma-kotia', 'desk'),
    phone: img('emma-kotia', 'phone'),
  },
]

export const work = (slug: string) => {
  const w = WORK.find((x) => x.slug === slug)
  if (!w) throw new Error(`Unknown work: ${slug}`)
  return w
}

// Verified figures only (canonical work history and the Cohort 3 value digest)
export const PROOF = {
  emails: '1,695',
  people: '194',
  lapsedReturned: '9',
  lapsedValue: 'GHS 14,050',
  reconciled: 'GHS 67,400',
  channels: 'five',
  afterHours: '70%',
  missedEmails: '11',
  firstBookingDays: 'three',
  womenTrained: '100+',
} as const

// Where the homepage lives. The redesign is previewed at /directions/home; this becomes '/' when it
// replaces the live homepage, and every link back to a homepage section follows it.
export const HOME = '/directions/home'

export const CONTACT = {
  email: 'hello@jacquelineamoako.com',
  linkedin: 'https://linkedin.com/in/jacqueline-frempomah-amoako',
  github: 'https://github.com/intelliJay09',
  instagram: 'https://instagram.com/jackieofzera',
} as const

// Real emails from the journeys she built. The event-morning and payment-confirmation emails
// carry a QR ticket and a team member's phone number, so they are never shown large.
const g = (name: string, w: number, h: number, alt: string) => ({
  src: `/images/case-studies/gwen-addo/email-${name}.webp`, w, h, alt,
})
export const GWEN_EMAILS = [
  g('nurture-final-call', 1136, 1573, 'Gwen Addo email: doors close today'),
  g('alumni-invite', 1136, 1683, 'Gwen Addo email inviting a past attendee back'),
  g('booking-reminder', 1136, 1415, 'Gwen Addo email: booking reminder'),
  g('nurture-4', 1136, 1501, 'Gwen Addo email: The Character Advantage'),
  g('alumni-why', 1136, 1633, 'Gwen Addo email: why this cohort is different'),
  g('payment-nudge', 1136, 1731, 'Gwen Addo email: complete your registration'),
  g('non-converter', 1136, 1609, 'Gwen Addo email to someone who did not sign up'),
  g('post-event-attendee', 1136, 2267, 'Gwen Addo email after the event'),
]

export const FD_EMAILS = [
  { src: '/images/case-studies/finest-dietitian/email-confirmation.webp', w: 1064, h: 914, alt: 'Finest Dietitian booking confirmation email' },
  { src: '/images/case-studies/finest-dietitian/email-guide.webp', w: 1064, h: 544, alt: 'Finest Dietitian follow-up email with a guide' },
]

export const DESK = { w: 2880, h: 1800 } as const
export const PHONE = { w: 1170, h: 2532 } as const
