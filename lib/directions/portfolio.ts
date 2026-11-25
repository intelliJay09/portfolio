// Everything on the portfolio page, in one list. Each piece says which parts of her sentence it
// proves (1 build the software, 2 run the journey behind it, 3 fix what breaks) and what to show
// for each, so picking part of the sentence shows the same work through that part.
//
// Facts: the homepage's work list (work.ts) and Featured work, each app's own repo and recording,
// and the live sites, all of which answered on 20 Nov 2026. Figures are verified ones only (PROOF).
// Twist Night Club and Ghana Optometric Association are no longer listed (her call, 20 Nov 2026).
// The Gwen Addo command center runs on invented demo data, and its caption says so (her call, same day).

import type { Layer } from './triage'
import { DESK, FD_EMAILS, GWEN_EMAILS, HOME, PROOF, PHONE, work } from './work'
import { testimonial, type Testimonial } from '../testimonials'

type Img = { src: string; w: number; h: number; alt: string }

export type Media =
  | { kind: 'video'; src: string; poster: string; w: number; h: number; label: string }
  | { kind: 'image'; img: Img; phone?: Img }
  | { kind: 'emails'; items: Img[] }
  | { kind: 'cases' }

export type Show = { media: Media; caption: string }

export type Piece = {
  slug: string
  name: string
  /** The parts of the sentence it proves, the first being what it shows when nothing is picked */
  lenses: Layer[]
  show: Partial<Record<Layer, Show>>
  links: { href: string; label: string; external?: boolean }[]
  /** What the client said, shown with the piece */
  quote?: Testimonial
}

export const LENS_WORDS: Record<Layer, string> = { 1: 'Build', 2: 'Run', 3: 'Fix' }

const rec = (name: string, w: number, h: number, label: string): Media => ({
  kind: 'video', src: `/directions/rec/${name}.mp4`, poster: `/directions/rec/${name}-poster.jpg`, w, h, label,
})

// A live site, shown as its own homepage: the desktop capture, and on a phone the phone capture.
// A site with a recording of it in use shows the recording instead.
function site(slug: string, quote?: number, recording?: Media): Piece {
  const w = work(slug)
  return {
    slug,
    name: w.name,
    lenses: [1],
    show: {
      1: {
        caption: w.line,
        media: recording ?? {
          kind: 'image',
          img: { src: w.desk, ...DESK, alt: `${w.name} homepage` },
          phone: { src: w.phone, ...PHONE, alt: `${w.name} homepage on a phone` },
        },
      },
    },
    links: [
      { href: `/portfolio/${slug}`, label: 'Case study' },
      { href: w.url, label: w.url.replace(/^https?:\/\/(www\.)?/, ''), external: true },
    ],
    quote: quote ? testimonial(quote) : undefined,
  }
}

export const PIECES: Piece[] = [
  {
    slug: 'gwen-addo',
    name: 'Gwen Addo',
    lenses: [1, 2, 3],
    show: {
      1: {
        caption: 'A leadership coach’s website, built in Next.js. It’s where people find her programmes and book.',
        media: rec('gwen-new-demo', 1440, 900, 'Gwen Addo’s website in use'),
      },
      2: {
        caption: `I built her whole customer journey, from first sign-up to the next cohort: ${PROOF.emails} emails to ${PROOF.people} people, none sent by hand.`,
        media: { kind: 'emails', items: [GWEN_EMAILS[0], GWEN_EMAILS[1], GWEN_EMAILS[3]] },
      },
      3: {
        caption: 'Three times her system broke, and what I did about it.',
        media: { kind: 'cases' },
      },
    },
    links: [
      { href: '/portfolio/gwen-addo', label: 'Case study' },
      { href: `${HOME}#fix`, label: 'What broke' },
      { href: 'https://www.gwenaddo.com', label: 'gwenaddo.com', external: true },
    ],
    quote: testimonial(1),
  },
  {
    slug: 'gwen-ops',
    name: 'Command Center',
    lenses: [1],
    show: {
      1: {
        caption: 'The CRM behind Gwen Addo’s business, where her team sees every person, application and payment in one place. The numbers here are made up for the demo.',
        media: rec('gwen-ops', 1280, 800, 'The Gwen Addo command center, on demo data'),
      },
    },
    links: [],
  },
  {
    slug: 'finest-dietitian',
    name: 'Finest Dietitian',
    lenses: [1, 2],
    show: {
      1: {
        caption: `Booking site for a registered dietitian in Accra. Her first paid booking came ${PROOF.firstBookingDays} days after launch.`,
        media: rec('finest-dietitian-demo', 1440, 900, 'Finest Dietitian’s website in use: the BMI calculator, then booking a consultation'),
      },
      2: {
        caption: 'The emails each booking sets off: the confirmation, then a follow-up with a guide.',
        media: { kind: 'emails', items: FD_EMAILS },
      },
    },
    links: [
      { href: '/portfolio/finest-dietitian', label: 'Case study' },
      { href: 'https://finestdietitian.com', label: 'finestdietitian.com', external: true },
    ],
    quote: testimonial(13),
  },
  {
    slug: 'client-journeys',
    name: 'Client journeys',
    lenses: [2],
    show: {
      2: {
        caption: 'At Zera, I built 17 live journeys for clients. They run on email, WhatsApp, Instagram and Messenger, and each step waits for the client to do something: sign, pay, reply.',
        media: rec('journey-short', 1440, 900, 'A journey running in Orella: a client moves stage and the email goes out by itself'),
      },
    },
    links: [{ href: `${HOME}#run`, label: 'See them run' }],
  },
  {
    slug: 'orella',
    name: 'Orella',
    lenses: [1],
    show: {
      1: {
        caption: 'The website for Orella, software that runs what happens to a business’s customers after they sign up. It walks you through the product and the pricing, and five questions tell you which plan fits.',
        media: rec('orella-site-demo', 1436, 896, 'Orella’s website in use'),
      },
    },
    links: [{ href: 'https://orellahub.com', label: 'orellahub.com', external: true }],
  },
  {
    slug: 'vocyx',
    name: 'Vocyx',
    lenses: [1],
    show: {
      1: {
        caption: 'Sales practice you do out loud. You call an AI buyer who has reasons they won’t tell you, and after the call you see what they were thinking and how you did.',
        media: rec('vocyx-call', 1440, 900, 'A live call in Vocyx'),
      },
    },
    links: [{ href: 'https://vocyx.zerahq.com', label: 'vocyx.zerahq.com', external: true }],
  },
  {
    slug: 'cold-recall',
    name: 'Cold Recall',
    lenses: [1],
    show: {
      1: {
        caption: 'A study app I built to learn how software works. It turns real code into questions, then brings each one back just before you’d forget it.',
        media: rec('cold-recall', 1280, 800, 'Cold Recall in use'),
      },
    },
    links: [],
  },
  {
    slug: 'luriel',
    name: 'Luriel',
    lenses: [1],
    show: {
      1: {
        caption: 'A phone app that shows a Bible verse matching the time: at 4:17, a chapter 4, verse 17.',
        media: rec('luriel', 540, 1116, 'Luriel on a phone'),
      },
    },
    links: [],
  },
  site('command-space', 3, rec('command-space-demo', 1440, 900, 'The Command Space website in use: a goal typed into the homepage brief, then the ten services')),
  site('anabs', 12, rec('anabs-demo', 1440, 900, 'The Anabs website in use: from the homepage into the two-bedroom residence, its floor plan and its pricing list')),
  site('eleven-eleven-ghana', 11, rec('eleven-eleven-demo', 1440, 900, 'The Eleven Eleven website in use: the homepage film, the unit types and prices, then the Units page')),
  site('girl-code-africa', undefined, rec('girlcode-demo', 1440, 900, 'The GirlCode Africa website in use: a parent starts the course registration form, then the donation options')),
  site('eden-heights', undefined, rec('eden-heights-demo', 1440, 900, 'The Eden Heights website in use: the virtual tour, the available units, then the two-bedroom price and floor plan')),
  site('landmark-homes', undefined, rec('landmark-homes-demo', 1440, 900, 'The Landmark Homes website in use: the homepage, its three developments, then the Deiterra page')),
  site('kline-designs', undefined, rec('kline-demo', 1440, 900, 'The K_Line Designs website in use: the services, the four-step process, then the projects')),
  site('emmanuel-kotia', 6, rec('emma-kotia-demo', 1440, 900, 'Dr Emmanuel Kotia’s website in use: his education, publications, service in pictures, and news')),
]
