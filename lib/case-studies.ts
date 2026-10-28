// Structured case studies, rendered by components/case-study/CaseStudy.tsx.
// Every figure here traces to a client record: for Gwen Addo, the Orella
// production data behind COHORT_3_VALUE_DIGEST.md and the lifecycle code in
// orella-gwen/workflows/sequences.ts. Slugs without an entry here still render
// through the legacy template.

export interface CaseStudyImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface StageEmail extends CaseStudyImage {
  subject: string
  sentAt: string
}

export interface JourneyStage {
  id: string
  name: string
  when: string
  says: string
  stops?: string
  result?: string
  emails: StageEmail[]
}

export interface CaseStudy {
  slug: string
  title: string
  line: string
  metaTitle: string
  metaDescription: string
  // 1200x630 JPEG: LinkedIn and others do not reliably render WebP share images
  ogImage: string
  facts: { label: string; value: string }[]
  liveUrl?: string
  cover: CaseStudyImage
  situation: { heading: string; body: string[] }
  journey: { heading: string; intro: string; stages: JourneyStage[]; beyond: string }
  finding: {
    heading: string
    body: string[]
    table: { caption: string; headers: string[]; rows: string[][] }
    response: string[]
  }
  results: { heading: string; items: { value: string; label: string }[]; source: string }
  open: { heading: string; items: { title: string; body: string }[] }
  site: { heading: string; body: string; images: CaseStudyImage[] }
  testimonial: { quote: string; name: string; role: string }
}

const gwenEmail = (name: string, height: number, subject: string, sentAt: string): StageEmail => ({
  src: `/images/case-studies/gwen-addo/email-${name}.webp`,
  alt: `The "${subject}" email, as sent`,
  width: 1136,
  height,
  subject,
  sentAt,
})

const gwenAddo: CaseStudy = {
  slug: 'gwen-addo',
  title: 'Gwen Addo',
  line: 'Her whole customer journey, from the first sign-up to the next cohort.',
  metaTitle: 'Gwen Addo: customer lifecycle, CRM and website',
  metaDescription:
    'How I mapped and automated the customer journey for a leadership-training business in Accra: 1,695 emails to 194 people with none sent by hand, and 9 of 114 past attendees back for another cohort.',
  ogImage: '/images/case-studies/gwen-addo/og.jpg',
  facts: [
    { label: 'Client', value: 'Gwen Addo, leadership coach and author' },
    { label: 'My role', value: 'Lifecycle strategy, CRM and website' },
    { label: 'Timeline', value: '2025 to now' },
  ],
  liveUrl: 'https://www.gwenaddo.com',
  cover: {
    src: '/images/case-studies/gwen-addo/site-rebuild-home.webp',
    alt: 'The new gwenaddo.com homepage, with Gwen’s portrait beside “Build A Brand That Outlasts You.”',
    width: 2880,
    height: 1800,
  },
  situation: {
    heading: 'Every follow-up depended on someone remembering to send it',
    body: [
      'Gwen runs The Vision Masterclass, a one-day leadership programme in Accra, alongside a book, strategy sessions and mentoring. People signed up through forms and paid by mobile money, card, cash or straight to a member of her team. Past attendees sat in old spreadsheets, filed away as done.',
      'I built her website first. Then I mapped every stage a customer goes through and built the CRM and the journey that now run underneath it.',
    ],
  },
  journey: {
    heading: 'Six stages, each with its own timing and its own reason to stop',
    intro:
      'Every message waits for a real moment in the customer’s journey, and every sequence checks before it sends. Once someone pays, books or comes back, the emails that no longer apply stop.',
    stages: [
      {
        id: 'signed-up',
        name: 'Signed up, not yet paid',
        when: 'Two hours after sign-up, then 1pm Accra time each day',
        says:
          'A nudge, a reminder the next day, the speakers the day after, then one nurture email a day. Seven angles take turns: the curriculum, the faculty, what changes, a personal note from Gwen, what the ticket covers, her thesis and the cost of waiting. On the last day a final call replaces them.',
        stops: 'The moment they pay, or when registration closes.',
        emails: [
          gwenEmail('payment-nudge', 1731, 'Your seat at The Character Advantage is one step away', '2 hours after sign-up'),
          gwenEmail('nurture-4', 1501, 'A personal note before you decide', 'Daily, 1:00 pm'),
          gwenEmail('nurture-final-call', 1573, 'Doors close today for The Character Advantage', 'Last day, 1:00 pm'),
        ],
      },
      {
        id: 'paid',
        name: 'Paid',
        when: 'The moment a payment lands, on any of five channels',
        says:
          'A confirmation with a QR entry ticket straight away, the faculty two days later, a countdown a week out, everything they need at 6pm the evening before, and a reminder two hours before doors open.',
        stops: 'Stages already in the past are skipped, so someone who pays the night before gets their entry pass at once.',
        emails: [
          gwenEmail('payment-confirmation', 2242, 'Your seat at The Character Advantage is confirmed', 'On payment'),
          gwenEmail('event-morning', 1652, 'Today is the day', '2 hours before start'),
        ],
      },
      {
        id: 'event-day',
        name: 'Event day',
        when: 'At the door',
        says: 'Check-in is one scan of the QR code from the confirmation email. No clipboard, no list to search.',
        result: '42 of 54 paid attendees checked in.',
        emails: [],
      },
      {
        id: 'after',
        name: 'After the event',
        when: 'Three hours after the day ends',
        says:
          'Each person gets the email for what happened to them. Attendees get a thank-you, two reminders over five days to book a paid strategy session, and their slides and photos. People who paid but didn’t come hear that they were missed. People who signed up and never paid hear what they missed.',
        stops: 'As soon as someone books a session.',
        result: 'One of these emails turned into a GHS 2,500 strategy session.',
        emails: [
          gwenEmail('post-event-attendee', 2267, 'Thank you for showing up on Saturday', '3 hours after close'),
          gwenEmail('no-show', 1647, 'I noticed you were not there on Saturday', '3 hours after close'),
          gwenEmail('booking-reminder', 1415, 'A few strategy session spots are already gone', '2 days later'),
        ],
      },
      {
        id: 'past-attendees',
        name: 'Past attendees',
        when: 'When a new cohort opens',
        says:
          'An invitation back, the reason this cohort matters six days later, and a last call three days before registration closes. Anyone who doesn’t return is offered a paid one-on-one when it closes, with one follow-up five days later.',
        stops: 'The moment they register again or book.',
        result: '565 emails to 114 past attendees. 9 came back and paid again because someone finally asked, worth GHS 14,050.',
        emails: [
          gwenEmail('alumni-invite', 1683, 'Come back to the room for The Character Advantage', 'When the cohort opens'),
          gwenEmail('alumni-why', 1633, 'Why The Character Advantage, and why now', '6 days later'),
          gwenEmail('alumni-one-on-one', 1551, 'Something more personal than the room', 'When registration closes'),
        ],
      },
      {
        id: 'not-now',
        name: 'Not now',
        when: 'Whenever a journey ends without a purchase',
        says:
          'Nobody gets dropped. They join a long-term list and hear from Gwen every two weeks, one short letter at a time, until the next thing she runs is right for them.',
        stops: 'When they unsubscribe.',
        emails: [
          gwenEmail('nurture-pool-positioning', 1633, 'Would a stranger get it in ten seconds?', 'Every two weeks'),
        ],
      },
    ],
    beyond:
      'Her book and guide subscribers, one-on-one clients, speaking and media requests, and group bookings each have a journey of their own, mapped the same way.',
  },
  finding: {
    heading: 'The no-shows weren’t random',
    body: [
      '12 of 54 paid attendees didn’t come. Email opens couldn’t explain it. Open tracking recorded nothing, and Apple Mail loads every email automatically anyway, so an open can’t tell an attendee from a no-show. So I looked at how each person paid.',
      '4 of the 12 had no working email or phone at all. Nothing sent before the day ever reached them.',
    ],
    table: {
      caption: 'No-shows by how people paid, The Character Advantage, August 2026',
      headers: ['How they paid', 'Paid', 'Didn’t come', 'Rate'],
      rows: [
        ['Sign-up form', '5', '0', '0%'],
        ['Invited by Gwen', '9', '1', '11%'],
        ['Group booking page', '4', '1', '25%'],
        ['Mobile money, entered by hand', '21', '6', '29%'],
        ['Payment link', '13', '4', '31%'],
      ],
    },
    response: [
      'Now every payment is checked for a working email and phone the moment it lands, every attendee gets a confirm-your-seat link, and anyone on a higher-risk channel who hasn’t confirmed is flagged the day before.',
      'One cohort is a small sample, so the next step is testing WhatsApp check-ins by hand before building anything for them.',
    ],
  },
  results: {
    heading: 'What one cohort looked like',
    items: [
      { value: '1,695', label: 'emails to 194 people, none sent by hand' },
      { value: '9 of 114', label: 'past attendees came back, worth GHS 14,050' },
      { value: 'GHS 67,400', label: 'across five payment channels, no mismatches' },
      { value: '70%', label: 'of payments arrived outside office hours, none missed' },
    ],
    source: 'Queried from the CRM’s records for The Character Advantage, August 2026.',
  },
  open: {
    heading: 'What’s still open',
    items: [
      {
        title: 'Scoring past attendees as warm, cooling or cold',
        body: 'It needs real open and click data first. Scoring with none would mark everyone cold, so it waits until a full send cycle has been measured.',
      },
      {
        title: 'A step above the one-on-one',
        body: 'Her most loyal attendees have nothing to graduate into yet. That’s a product decision for Gwen, so I flagged it instead of building around it.',
      },
    ],
  },
  site: {
    heading: 'The website came first',
    body: 'I built her first site in 2025 and I’m now rebuilding it in Next.js. It’s the front door to everything above: the masterclass, her book, strategy sessions and speaking.',
    images: [
      {
        src: '/images/case-studies/gwen-addo/site-rebuild-home-mobile.webp',
        alt: 'The new gwenaddo.com homepage on a phone',
        width: 1170,
        height: 2532,
      },
    ],
  },
  testimonial: {
    quote:
      'Jacqueline has a remarkable ability to translate a personal brand into a compelling digital experience. The website she built for me is not only professional and polished but also strategically designed to convert visitors into clients. It has become the cornerstone of my business’s online presence.',
    name: 'Gwen Addo',
    role: 'Leadership coach and author',
  },
}

const caseStudies: Record<string, CaseStudy> = {
  [gwenAddo.slug]: gwenAddo,
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug]
}
