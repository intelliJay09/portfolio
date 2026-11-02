// One source of truth for how the site describes Jacqueline: page metadata, social cards and
// structured data all read from here, so the positioning cannot drift between them.
//
// Every claim below is on her LinkedIn or in her canonical work history. Do not add a figure
// here unless it is verified there.

export const SITE = {
  url: 'https://jacquelineamoako.com',
  name: 'Jacqueline Amoako',
  legalName: 'Jacqueline Frempomah Amoako',
  role: 'Lifecycle & Growth Marketer',
  // The plain sentence a recruiter should be able to repeat after five seconds
  tagline: 'I build websites and automate customer journeys.',
  description:
    'Lifecycle and growth marketer in Accra. I build the website and the email and WhatsApp automation that bring customers in and keep them coming back.',
  email: 'hello@jacquelineamoako.com',
  location: { city: 'Accra', country: 'Ghana' },
  ogImage: {
    url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
    width: 3000,
    height: 1575,
    alt: 'Jacqueline Amoako, lifecycle and growth marketer',
  },
  sameAs: [
    'https://linkedin.com/in/jacqueline-frempomah-amoako',
    'https://github.com/intelliJay09',
    'https://www.wikidata.org/wiki/Q138331544',
  ],
  keywords: [
    'lifecycle marketing',
    'growth marketing',
    'customer lifecycle automation',
    'email marketing automation',
    'WhatsApp automation',
    'CRM automation',
    'customer onboarding',
    'customer retention',
    'win-back campaigns',
    'ActiveCampaign',
    'Make.com',
    'Next.js developer',
    'frontend developer Ghana',
    'Accra',
  ],
  knowsAbout: [
    'Lifecycle marketing',
    'Customer onboarding',
    'Email automation',
    'WhatsApp automation',
    'CRM automation',
    'Customer retention',
    'Win-back campaigns',
    'Customer success',
    'Frontend development',
    'React',
    'Next.js',
  ],
  // Current roles, as in her canonical work history
  employers: ['Zera | Automated Revenue Systems', 'Command Space'],
  education: [
    { name: 'BSc Information Technology', school: 'Ghana Communication Technology University' },
    { name: 'Diploma in Software Engineering', school: 'IPMC Ghana' },
  ],
} as const

export const PAGES = {
  about: {
    title: 'About',
    description:
      'Lifecycle and growth marketer and frontend developer in Accra. I started in customer success, and I build both the website and the automation behind it.',
  },
  portfolio: {
    title: 'Work',
    description:
      'Websites, CRM and customer-journey automation I have built for clients in Ghana, including one client’s whole lifecycle from sign-up to win-back.',
  },
  contact: {
    title: 'Contact',
    description:
      'Get in touch about lifecycle marketing, email and WhatsApp automation, or a website build.',
  },
} as const
