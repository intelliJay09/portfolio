/**
 * Local SEO Strategy for Ghana/Accra Market Domination
 * Geographic targeting and local optimization
 */

export interface LocalBusinessInfo {
  name: string
  address: {
    street: string
    locality: string
    region: string
    postalCode: string
    country: string
    countryCode: string
  }
  phone: string
  alternatePhone?: string
  email: string
  hours: {
    [key: string]: { open: string; close: string } | 'Closed'
  }
  geo: {
    latitude: number
    longitude: number
  }
  serviceAreas: string[]
  languages: string[]
}

export const localBusinessInfo: LocalBusinessInfo = {
  name: 'Jacqueline Amoako - Luxury Web Developer & Creative Technology Studio',
  address: {
    street: '', // Add your street address for better local SEO
    locality: 'Accra',
    region: 'Greater Accra Region',
    postalCode: '',
    country: 'Ghana',
    countryCode: 'GH'
  },
  phone: '+233 XX XXX XXXX', // Add your business phone
  alternatePhone: '+233 XX XXX XXXX', // WhatsApp business number
  email: 'hello@jacquelineamoako.com',
  hours: {
    Monday: { open: '09:00', close: '18:00' },
    Tuesday: { open: '09:00', close: '18:00' },
    Wednesday: { open: '09:00', close: '18:00' },
    Thursday: { open: '09:00', close: '18:00' },
    Friday: { open: '09:00', close: '18:00' },
    Saturday: { open: '10:00', close: '14:00' },
    Sunday: 'Closed'
  },
  geo: {
    latitude: 5.6037, // Accra coordinates
    longitude: -0.1870
  },
  serviceAreas: [
    'Accra',
    'Tema',
    'East Legon',
    'Airport Residential Area',
    'Cantonments',
    'Labone',
    'Osu',
    'Ridge',
    'Tesano',
    'Dzorwulu',
    'Greater Accra Region',
    'Kumasi',
    'Takoradi',
    'Cape Coast',
    'Ghana',
    'West Africa'
  ],
  languages: ['English', 'Twi', 'Ga']
}

/**
 * Generate comprehensive LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://jacquelineamoako.com/#localbusiness',
    name: localBusinessInfo.name,
    image: [
      'https://jacquelineamoako.com/images/jackie-studio.png',
      'https://jacquelineamoako.com/images/jackie-studio-bnw.png'
    ],
    logo: 'https://jacquelineamoako.com/images/favicon-new.png',
    url: 'https://jacquelineamoako.com',
    telephone: localBusinessInfo.phone,
    email: localBusinessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: localBusinessInfo.address.street,
      addressLocality: localBusinessInfo.address.locality,
      addressRegion: localBusinessInfo.address.region,
      postalCode: localBusinessInfo.address.postalCode,
      addressCountry: localBusinessInfo.address.countryCode
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localBusinessInfo.geo.latitude,
      longitude: localBusinessInfo.geo.longitude
    },
    openingHoursSpecification: Object.entries(localBusinessInfo.hours)
      .filter(([, hours]) => hours !== 'Closed')
      .map(([day, hours]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: typeof hours === 'object' ? hours.open : '',
        closes: typeof hours === 'object' ? hours.close : ''
      })),
    priceRange: '$$-$$$$',
    areaServed: localBusinessInfo.serviceAreas.map(area => ({
      '@type': 'Place',
      name: area
    })),
    sameAs: [
      'https://linkedin.com/in/jacqueline-frempomah-amoako',
      'https://github.com/jacquelineamoako',
      'https://twitter.com/jacquelineamoako',
      'https://www.wikidata.org/wiki/Q138331544',
    ],
    knowsLanguage: localBusinessInfo.languages,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Luxury Web Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Luxury Website Development',
            description: 'Bespoke website development for luxury brands in Ghana and West Africa'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Premium E-commerce Solutions',
            description: 'High-end online stores for Ghana businesses targeting affluent customers'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise Web Applications',
            description: 'Sophisticated web applications for Accra-based corporations and organizations'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '24',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Emmanuel Kotia'
        },
        datePublished: '2024-11-15',
        reviewBody: 'Exceptional luxury web development services. Jacqueline transformed our online presence completely.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        }
      }
    ]
  }
}

/**
 * Location-specific landing pages for better local SEO
 */
export const locationPages = [
  {
    slug: 'web-developer-accra',
    title: 'Luxury Web Developer in Accra | Premium Website Design Services',
    description: 'Leading luxury web developer in Accra, Ghana. Specializing in high-end websites for East Legon, Airport Residential, and Cantonments businesses.',
    h1: 'Premium Web Development Services in Accra',
    content: {
      intro: 'Serving Accra\'s most prestigious neighborhoods including East Legon, Airport Residential Area, Cantonments, and Labone with luxury web development services.',
      services: 'Custom websites for Accra businesses, e-commerce solutions for Ghana retailers, and enterprise applications for corporations.',
      areas: ['East Legon', 'Airport Residential', 'Cantonments', 'Labone', 'Osu', 'Ridge']
    }
  },
  {
    slug: 'luxury-web-design-ghana',
    title: 'Luxury Web Design Ghana | High-End Website Development',
    description: 'Ghana\'s premier luxury web design studio. Creating sophisticated digital experiences for discerning brands across Accra, Kumasi, and Takoradi.',
    h1: 'Luxury Web Design Services Across Ghana',
    content: {
      intro: 'Elevating Ghana\'s digital landscape with premium web design and development services for luxury brands and high-end businesses.',
      services: 'Luxury hotel websites, premium real estate platforms, high-end e-commerce, and exclusive brand experiences.',
      areas: ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tema', 'Ho']
    }
  },
  {
    slug: 'web-developer-east-legon',
    title: 'Web Developer East Legon | Premium Website Services',
    description: 'Specialized web development services for East Legon businesses. Creating luxury websites for Ghana\'s most affluent neighborhood.',
    h1: 'East Legon\'s Premium Web Developer',
    content: {
      intro: 'Providing bespoke web development services to East Legon\'s luxury businesses, from high-end retail to exclusive services.',
      services: 'Custom web development, luxury e-commerce, and premium digital solutions for East Legon enterprises.',
      areas: ['East Legon', 'East Legon Hills', 'Adjiriganor', 'Trasacco Valley']
    }
  },
  {
    slug: 'hotel-website-developer-ghana',
    title: 'Hotel Website Developer Ghana | Luxury Hospitality Web Design',
    description: 'Specialized in luxury hotel and resort website development in Ghana. Creating booking-ready websites for Accra, Cape Coast, and beachfront properties.',
    h1: 'Ghana\'s Premier Hotel Website Developer',
    content: {
      intro: 'Creating stunning, booking-optimized websites for Ghana\'s luxury hotels, resorts, and hospitality businesses.',
      services: 'Hotel booking systems, resort showcases, restaurant websites, and tourism platforms.',
      areas: ['Accra Hotels', 'Cape Coast Resorts', 'Volta Region Tourism', 'Beach Resorts']
    }
  }
]

/**
 * Ghana-specific keywords and search terms
 */
export const ghanaKeywords = {
  commercial: [
    'web developer ghana',
    'website design accra',
    'web development company ghana',
    'website designer accra',
    'ghana web design',
    'accra web developer',
    'web design services ghana',
    'website development ghana'
  ],
  luxury: [
    'luxury web developer ghana',
    'premium website design accra',
    'high-end web development ghana',
    'luxury brand websites ghana',
    'exclusive web design accra',
    'premium web services ghana'
  ],
  location: [
    'web developer east legon',
    'website design airport residential',
    'cantonments web developer',
    'labone website designer',
    'osu web development',
    'ridge website services',
    'tema web developer',
    'kumasi website design'
  ],
  industry: [
    'hotel website developer ghana',
    'real estate website ghana',
    'e-commerce developer accra',
    'restaurant website design ghana',
    'fashion website developer accra',
    'corporate website ghana'
  ],
  longtail: [
    'how much does a website cost in ghana',
    'best web developer in accra',
    'luxury website design company ghana',
    'professional web developer east legon',
    'affordable website design accra',
    'ghana website development prices',
    'hire web developer ghana',
    'custom website design accra'
  ]
}

/**
 * Local citation sources for Ghana
 */
export const ghanaCitations = {
  directories: [
    'Ghana Business Directory (ghanayello.com)',
    'Ghana Companies Directory (ghanacompanies.com)',
    'BusinessGhana Directory',
    'Ghana Trade (ghanatrade.com.gh)',
    'Accra Business Directory',
    'Ghana Services (ghanaservices.com)'
  ],
  social: [
    'LinkedIn Company Page',
    'Facebook Business Page',
    'Instagram Business Profile',
    'Twitter/X Business Profile',
    'WhatsApp Business',
    'Google My Business'
  ],
  industry: [
    'Ghana Tech Companies Directory',
    'West Africa Tech Hub',
    'Accra Digital Directory',
    'Ghana Creative Industry Directory',
    'African Tech Directory'
  ],
  local: [
    'Accra Metropolitan Assembly Business Registry',
    'Ghana Chamber of Commerce',
    'Association of Ghana Industries',
    'Ghana Investment Promotion Centre'
  ]
}

/**
 * Generate location-specific meta tags
 */
export function generateLocationMetaTags(location: string) {
  return {
    'geo.region': 'GH-AA', // Ghana - Greater Accra
    'geo.placename': location,
    'geo.position': `${localBusinessInfo.geo.latitude};${localBusinessInfo.geo.longitude}`,
    'ICBM': `${localBusinessInfo.geo.latitude}, ${localBusinessInfo.geo.longitude}`,
    'dc.title': `Luxury Web Developer ${location}`,
    'dc.creator': 'Jacqueline Amoako',
    'dc.subject': `Web Development Services ${location}`,
    'dc.description': `Premium web development and design services in ${location}, Ghana`
  }
}

/**
 * Local content optimization suggestions
 */
export const localContentOptimization = {
  homepage: [
    'Add "Accra" and "Ghana" to main headline',
    'Include service areas section',
    'Add local business hours',
    'Display Ghana phone number prominently',
    'Include "Serving Greater Accra Region" tagline'
  ],
  about: [
    'Mention Ghana Technology University College',
    'Highlight work with Ghana businesses',
    'Include GirlCode Africa involvement',
    'Reference Digitalize for Jobs (D4J) program',
    'Emphasize local community impact'
  ],
  portfolio: [
    'Categorize projects by Ghana regions',
    'Highlight Accra-based clients',
    'Include Ghana business success stories',
    'Add testimonials from Ghana clients',
    'Feature Ghana-specific industries'
  ],
  contact: [
    'Display Ghana phone with WhatsApp option',
    'Show Accra timezone (GMT)',
    'Include physical address or area',
    'Add map showing Accra location',
    'Offer in-person consultations for Accra clients'
  ]
}

/**
 * Ghana-specific review platforms
 */
export const ghanaReviewPlatforms = [
  'Google Reviews',
  'Facebook Reviews',
  'LinkedIn Recommendations',
  'Trustpilot Ghana',
  'Local Ghana forums',
  'Industry-specific Ghana directories'
]