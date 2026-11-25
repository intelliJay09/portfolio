// Structured case studies, rendered by components/case-study/CaseStudy.tsx.
// Every figure here traces to a client record: for Gwen Addo, the Orella
// production data behind COHORT_3_VALUE_DIGEST.md and the lifecycle code in
// orella-gwen/workflows/sequences.ts. Finest Dietitian: the booking journey and
// first-booking date come from the live site and the build records. Slugs without an entry here still render
// through the legacy template.

import { testimonial, type Testimonial } from './testimonials'

export interface CaseStudyImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface StageEmail extends CaseStudyImage {
  subject: string
  sentAt: string
  /** Carries a real entry ticket (QR code, reference) or a team member's number: listed by subject, never shown */
  private?: boolean
}

export interface JourneyStage {
  id: string
  name: string
  when: string
  says: string
  stops?: string
  result?: string
  emails: StageEmail[]
  /** A step that happens on the site: the site's own screen for it, captured live */
  screen?: CaseStudyImage
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
  /** The site in use, played in place of the cover where motion is welcome (public/directions/rec) */
  rec?: { name: string; width: number; height: number; label: string }
  /** Her three support incidents (Cases on the homepage) belong to this study */
  incidents?: boolean
  situation?: { heading: string; body: string[] }
  journey?: { heading: string; intro: string; stages: JourneyStage[]; beyond?: string }
  // Only studies with a measured finding or open work carry these sections
  finding?: {
    heading: string
    body: string[]
    table: { caption: string; headers: string[]; rows: string[][] }
    response: string[]
  }
  results?: { heading: string; items: { value: string; label: string }[]; source: string }
  open?: { heading: string; items: { title: string; body: string }[] }
  site: { heading: string; body: string; images: CaseStudyImage[]; built?: string[] }
  testimonial?: Testimonial
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
    'How I mapped and automated the customer journey for a leadership-training business in Accra: 1,695 emails to 194 people with none sent by hand, and nine past attendees back for the next cohort.',
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
  rec: { name: 'gwen-new-demo', width: 1440, height: 900, label: 'Gwen Addo’s website in use: her programmes, then a strategy session application' },
  incidents: true,
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
          { ...gwenEmail('payment-confirmation', 2242, 'Your seat at The Character Advantage is confirmed', 'On payment'), private: true },
          { ...gwenEmail('event-morning', 1652, 'Today is the day', '2 hours before start'), private: true },
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
        result: 'Nine past attendees came back and paid GHS 14,050 for the next cohort. Three of them got these emails and registered after they started. Registration was about 5% whether or not someone got them, so I can’t say the emails caused it.',
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
      { value: '9', label: 'past attendees came back for the next cohort, worth GHS 14,050' },
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
    body: 'I built her website in Next.js. It’s the front door to everything above: the masterclass, her book, strategy sessions and speaking.',
    images: [
      {
        src: '/images/case-studies/gwen-addo/site-rebuild-home-mobile.webp',
        alt: 'The new gwenaddo.com homepage on a phone',
        width: 1170,
        height: 2532,
      },
    ],
  },
  testimonial: testimonial(1),
}

const finest = (name: string, height: number, subject: string, sentAt: string): StageEmail => ({
  src: `/images/case-studies/finest-dietitian/email-${name}.webp`,
  alt: `The "${subject}" email, as sent`,
  width: 1064,
  height,
  subject,
  sentAt,
})

const finestDietitian: CaseStudy = {
  slug: 'finest-dietitian',
  title: 'Finest Dietitian',
  line: 'A booking site where every patient becomes someone she can stay in touch with.',
  metaTitle: 'Finest Dietitian: a booking site that keeps every patient',
  metaDescription:
    'How I built a booking website for a registered dietitian in Accra, from calendar and payment to the emails that follow, so every booking leaves her with a patient she can contact again.',
  ogImage: '/images/case-studies/finest-dietitian/og.jpg',
  facts: [
    { label: 'Client', value: 'Fredericka Doku, registered dietitian in Accra' },
    { label: 'My role', value: 'Website, booking and follow-up emails' },
    { label: 'First paid booking', value: 'Three days after launch' },
  ],
  liveUrl: 'https://finestdietitian.com',
  cover: {
    src: '/images/case-studies/finest-dietitian/site-home.webp',
    alt: 'The Finest Dietitian homepage, with Fredericka Doku in a green suit and her name in large type.',
    width: 1440,
    height: 900,
  },
  rec: { name: 'finest-dietitian-demo', width: 1440, height: 900, label: 'Finest Dietitian’s website in use: the BMI calculator, then booking a consultation' },
  situation: {
    heading: 'A booking that happens on WhatsApp is a patient she can’t email again',
    body: [
      'Fredericka is a registered dietitian in Accra. A booking that happens over WhatsApp leaves her with a chat thread and no easy way to follow up with the patient.',
      'The brief was to move every booking onto her own site, so that each one leaves her with a patient she can contact again. I built the site, the booking and payment flow, and the emails behind it.',
    ],
  },
  journey: {
    heading: 'From the first visit to a paid booking, in one place',
    intro:
      'Each step is on her own site, so by the end she has the patient’s details, the payment and the appointment in her calendar.',
    stages: [
      {
        id: 'visit',
        name: 'They land on the site',
        when: 'The first visit',
        says: 'A site built to earn trust before it asks for anything.',
        emails: [],
        screen: { src: '/images/case-studies/finest-dietitian/site-home.webp', alt: 'The Finest Dietitian homepage', width: 1440, height: 900 },
      },
      {
        id: 'pick',
        name: 'They pick a consultation and a time',
        when: 'Before booking',
        says: 'They choose a consultation, then a time from her live calendar.',
        emails: [],
        screen: { src: '/images/case-studies/finest-dietitian/site-book.webp', alt: 'The booking page: a general consultation, online, with the times open on her calendar', width: 1440, height: 900 },
      },
      {
        id: 'pay',
        name: 'They pay',
        when: 'At checkout',
        says: 'Payment is on Paystack, by mobile money or card.',
        emails: [],
        screen: { src: '/images/case-studies/finest-dietitian/site-checkout.webp', alt: 'The checkout step: the patient’s details, the booking summary and “Pay GH₵600 and book”', width: 1440, height: 900 },
      },
      {
        id: 'booked',
        name: 'The booking is confirmed',
        when: 'The moment payment lands',
        says: 'The appointment goes into her Google Calendar, with a Google Meet link for online sessions. The patient gets a confirmation with the details and a link to view or cancel.',
        emails: [finest('confirmation', 914, 'Your booking is confirmed', 'On payment')],
      },
      {
        id: 'guide',
        name: 'They join her list',
        when: 'One tick on the booking form',
        says: 'Ticking the box sends the free PCOS guide straight away and adds the patient to her list, so she can write to them again.',
        emails: [finest('guide', 544, 'Here’s your PCOS guide', 'On sign-up')],
      },
    ],
  },
  results: {
    heading: 'What happened',
    items: [
      { value: '3 days', label: 'From the site going live to her first patient booking and paying through it.' },
    ],
    source: 'Her first booking through the site.',
  },
  site: {
    heading: 'The website',
    body: 'The front door to everything above, built to earn trust before it asks for anything.',
    images: [
      {
        src: '/images/case-studies/finest-dietitian/site-home-mobile.webp',
        alt: 'The Finest Dietitian homepage on a phone',
        width: 390,
        height: 844,
      },
    ],
  },
  testimonial: testimonial(13),
}

// The website studies: the site, what was built, and the client's words. Only what was built is
// claimed, and every feature listed was checked on the live site on 25 Nov 2026. These builds
// have no measured results, so none are given. Old claims that the sites don't bear out were
// dropped: Anabs' virtual tours and "trust indicators", Eleven Eleven's booking engine and video
// backgrounds (it sells units; it doesn't take stays), Landmark Homes' galleries and availability
// status, and Dr. Kotia's "CMS he manages himself". Captures are each live site's own homepage
// (public/directions/work, 19 Nov 2026); each site's recording (public/directions/rec, 25 Nov 2026) shows it
// in use, moving forward only. Years are from the previous case studies.
function siteStudy(o: {
  slug: string
  title: string
  line: string
  metaTitle: string
  metaDescription: string
  client: string
  role?: string
  year: string
  stack: string
  liveUrl: string
  capture: string
  heroAlt: string
  heading: string
  body: string
  built: string[]
  rec?: CaseStudy['rec']
  quote?: number
}): CaseStudy {
  const desk = `/directions/work/${o.capture}-desk.webp`
  return {
    slug: o.slug,
    title: o.title,
    line: o.line,
    metaTitle: o.metaTitle,
    metaDescription: o.metaDescription,
    ogImage: desk,
    facts: [
      { label: 'Client', value: o.client },
      { label: 'My role', value: o.role ?? 'I built the website' },
      { label: o.year.includes('now') ? 'Timeline' : 'Year', value: o.year },
      { label: 'Built with', value: o.stack },
    ],
    liveUrl: o.liveUrl,
    cover: { src: desk, alt: o.heroAlt, width: 2880, height: 1800 },
    rec: o.rec,
    site: {
      heading: o.heading,
      body: o.body,
      built: o.built,
      images: [{ src: `/directions/work/${o.capture}-phone.webp`, alt: `The ${o.title} homepage on a phone`, width: 1170, height: 2532 }],
    },
    testimonial: o.quote ? testimonial(o.quote) : undefined,
  }
}

const SITES: CaseStudy[] = [
  siteStudy({
    slug: 'command-space',
    title: 'Command Space',
    line: 'The website for Command Space, a digital marketing agency in the US, the UK and Ghana.',
    metaTitle: 'Command Space: the agency’s Next.js website',
    metaDescription:
      'The Next.js website for Command Space, a digital marketing agency in the US, UK and Ghana, with a page for each of its ten services and a brief form on the homepage.',
    client: 'Command Space, digital marketing agency',
    role: 'I built the site and keep it running',
    year: '2024 to now',
    stack: 'Next.js',
    liveUrl: 'https://command-space.com',
    capture: 'command-space',
    heroAlt: 'The Command Space homepage: “We grow your business, and track every result.”',
    rec: { name: 'command-space-demo', width: 1440, height: 900, label: 'The Command Space website in use: a goal typed into the homepage brief, then the ten services' },
    heading: 'Every service gets its own page',
    body: 'The site presents the agency’s ten services and takes project briefs straight from the homepage.',
    built: [
      'A separate page for each of its ten services',
      'A short brief form on the homepage',
      'A Work section and a client logo strip',
    ],
    quote: 3,
  }),
  siteStudy({
    slug: 'anabs',
    title: 'Anabs',
    line: 'The website for Anabs, a residential tower in North Dzorwulu, Accra.',
    metaTitle: 'Anabs: the website for a residential tower in Accra',
    metaDescription:
      'The WordPress website for Anabs, a residential tower in North Dzorwulu, Accra: a page for each residence with its floor plans and pricing, the payment terms, and a form to reserve a unit.',
    client: 'Anabs Limited',
    year: '2025',
    stack: 'WordPress',
    liveUrl: 'https://anabsgh.com',
    capture: 'anabs',
    heroAlt: 'The Anabs homepage: “Redefining Luxury Living in Accra.”',
    rec: { name: 'anabs-demo', width: 1440, height: 900, label: 'The Anabs website in use: from the homepage into the two-bedroom residence, its floor plan and its pricing list' },
    heading: 'A buyer can see the units, the prices and the terms before they call',
    body: 'The site takes a buyer from the tower to the residence that suits them, then on to reserving it.',
    built: [
      'A page for each residence, with its floor plans, pricing and gallery',
      'A form to reserve a unit',
      'The payment terms, for cash and mortgage buyers',
      'A brochure to download',
    ],
    quote: 12,
  }),
  siteStudy({
    slug: 'eleven-eleven-ghana',
    title: 'Eleven Eleven',
    line: 'The website for Eleven Eleven, a beachfront resort in Ghana where you can buy an apartment, a villa or a penthouse.',
    metaTitle: 'Eleven Eleven: the website for a beachfront resort in Ghana',
    metaDescription:
      'The WordPress website for Eleven Eleven, a beachfront resort in Ghana: every unit with its starting price, life at the resort, and what owners get as investors.',
    client: 'Eleven Eleven Ghana',
    year: '2024',
    stack: 'WordPress',
    liveUrl: 'https://www.11-11ghana.com',
    capture: 'eleven-eleven',
    heroAlt: 'The Eleven Eleven homepage: “Follow Your Desire.”',
    rec: { name: 'eleven-eleven-demo', width: 1440, height: 900, label: 'The Eleven Eleven website in use: the homepage film, the unit types and prices, then the Units page' },
    heading: 'Every unit shows its starting price',
    body: 'The site sells the resort and the investment together: the units, life at the resort, and what owners get back.',
    built: [
      'A Units page with every unit type and its starting price, each with an enquiry form',
      'The Experience page, on the amenities and the dining',
      'An Investor Luxury Perks page for buyers who want to rent their unit out',
      'The founders’ story and a contact form',
    ],
    quote: 11,
  }),
  siteStudy({
    slug: 'girl-code-africa',
    title: 'GirlCode Africa',
    line: 'The website for GirlCode Africa, a non-profit teaching girls and young women across Africa to code.',
    metaTitle: 'GirlCode Africa: the website for a coding non-profit',
    metaDescription:
      'The WordPress website for GirlCode Africa, a non-profit teaching girls and young women to code: the courses, a form to register a child, and ways to donate.',
    client: 'GirlCode Africa, a non-profit',
    year: '2025',
    stack: 'WordPress',
    liveUrl: 'https://www.girlcodeafrica.org',
    capture: 'girlcode',
    heroAlt: 'The GirlCode Africa homepage: “Building The Next Generation of Geniuses.”',
    rec: { name: 'girlcode-demo', width: 1440, height: 900, label: 'The GirlCode Africa website in use: a parent starts the course registration form, then the donation options' },
    heading: 'Parents can register a child for a course on the site',
    body: 'The site explains what GirlCode does, lists the courses and makes it easy to sign up, give or get in touch.',
    built: [
      'The courses, with a form for parents to register a child',
      'A Get Involved page for donations, by GoFundMe, Paystack or mobile money',
      'The aims, the objectives and the board',
      'A help page on how signing up works, and a contact form',
    ],
  }),
  siteStudy({
    slug: 'eden-heights',
    title: 'Eden Heights',
    line: 'The website for Eden Heights, an apartment development in West Hills, Accra.',
    metaTitle: 'Eden Heights: the website for an apartment development in Accra',
    metaDescription:
      'The WordPress website for Eden Heights in Accra: a virtual tour of the whole site and a page for each of its six apartment types, with the starting price and floor plan.',
    client: 'Eden Heights',
    year: '2025',
    stack: 'WordPress',
    liveUrl: 'https://edenheights.com.gh',
    capture: 'eden-heights',
    heroAlt: 'The Eden Heights homepage: “The Height of Modern Living.”',
    rec: { name: 'eden-heights-demo', width: 1440, height: 900, label: 'The Eden Heights website in use: the virtual tour, the available units, then the two-bedroom price and floor plan' },
    heading: 'Every apartment has its price and floor plan on the page',
    body: 'A buyer can walk the whole development in a virtual tour, then compare the six apartment types.',
    built: [
      'A page for each of the six apartment types, with its starting price and floor plan',
      'A virtual tour of the whole site',
      'The amenities, the rentals and the facilities management',
      'Enquiry forms on every page',
    ],
  }),
  siteStudy({
    slug: 'landmark-homes',
    title: 'Landmark Homes',
    line: 'The website for Landmark Homes, a residential developer in Accra.',
    metaTitle: 'Landmark Homes: the website for a residential developer in Accra',
    metaDescription:
      'The WordPress website for Landmark Homes: a page for each of its three developments and each apartment type, from studios to penthouses.',
    client: 'Landmark Homes',
    year: '2025',
    stack: 'WordPress',
    liveUrl: 'https://landmarkhomesgh.com',
    capture: 'landmark-homes',
    heroAlt: 'The Landmark Homes homepage: “The Life You’ve Earned.”',
    rec: { name: 'landmark-homes-demo', width: 1440, height: 900, label: 'The Landmark Homes website in use: the homepage, its three developments, then the Deiterra page' },
    heading: 'Each development and each apartment type has its own page',
    body: 'The site introduces the developer, then takes a buyer from a development to the apartment that suits them.',
    built: [
      'A page for each of its three developments: Deiterra, Sapphire and The Madison',
      'A page for each apartment type, from studios to the penthouses',
      'The company’s story, its board and its management team',
    ],
  }),
  siteStudy({
    slug: 'kline-designs',
    title: 'K_Line Designs',
    line: 'The website for K_Line Designs, an architecture and interior design firm in Accra.',
    metaTitle: 'K_Line Designs: the website for an architecture firm in Accra',
    metaDescription:
      'The WordPress website for K_Line Designs, an architecture and interior design firm in Accra: its services, its process and its projects across Africa and the US.',
    client: 'K_Line Designs LTD',
    year: '2025',
    stack: 'WordPress',
    liveUrl: 'https://klinedesignltd.com',
    capture: 'kline',
    heroAlt: 'The K_Line Designs homepage: “DesignScape.”',
    rec: { name: 'kline-demo', width: 1440, height: 900, label: 'The K_Line Designs website in use: the services, the four-step process, then the projects' },
    heading: 'The firm’s process runs from first concept to the building site',
    body: 'The site sets out what the firm does and how it works, then shows the projects.',
    built: [
      'The services, from architecture and interiors to renovation',
      'The four-step process, from concept to construction oversight',
      'A projects page, with work in Accra, Togo, Abidjan and the US',
      'The team and a contact form',
    ],
  }),
  siteStudy({
    slug: 'emmanuel-kotia',
    title: 'Dr. Emmanuel Kotia',
    line: 'The website for Dr Emmanuel Kotia, with his career, his publications and his service in one place.',
    metaTitle: 'Dr. Emmanuel Kotia: a website for his career and publications',
    metaDescription:
      'The WordPress website for Dr Emmanuel Kotia: his education, his publications, his service in pictures, and his news and articles.',
    client: 'Dr Emmanuel Kotia',
    year: '2023',
    stack: 'WordPress',
    liveUrl: 'https://www.emmakotia.org',
    capture: 'emma-kotia',
    heroAlt: 'The homepage of Dr Emmanuel Wekem Kotia’s website',
    rec: { name: 'emma-kotia-demo', width: 1440, height: 900, label: 'Dr Emmanuel Kotia’s website in use: his education, publications, service in pictures, and news' },
    heading: 'His whole career fits on one page',
    body: 'The site gathers his education, his publications and his service in one place.',
    built: [
      'His background, education and publications, on one page',
      'His service in pictures',
      'His news and articles',
      'Ways to reach him by email or WhatsApp',
    ],
    quote: 6,
  }),
]

const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  [gwenAddo, finestDietitian, ...SITES].map((study) => [study.slug, study]),
)

/** Every case study's slug, for the sitemap */
export const caseStudySlugs = (): string[] => Object.keys(caseStudies)

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug]
}
