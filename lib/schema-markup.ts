/**
 * Schema Markup Generator for Luxury Design Portfolio
 * Implements structured data for enhanced SEO and rich snippets
 */

export interface PersonSchema {
  "@context": "https://schema.org"
  "@type": "Person"
  name: string
  url: string
  image: string
  sameAs: string[]
  jobTitle: string
  worksFor: {
    "@type": "Organization"
    name: string
    url: string
  }
  address: {
    "@type": "PostalAddress"
    addressLocality: string
    addressCountry: string
  }
  knowsAbout: string[]
  hasCredential: Array<{
    "@type": "EducationalOccupationalCredential"
    name: string
    educationalLevel: string
    credentialCategory: string
  }>
  alumniOf: Array<{
    "@type": "CollegeOrUniversity"
    name: string
    url?: string
  }>
}

export interface CreativeWorkSchema {
  "@context": "https://schema.org"
  "@type": "CreativeWork"
  name: string
  description: string
  creator: {
    "@type": "Person"
    name: string
    url: string
  }
  dateCreated: string
  image: string
  url: string
  keywords: string[]
  genre: string
  audience: {
    "@type": "Audience"
    audienceType: string
  }
  mainEntity: {
    "@type": "WebSite"
    url: string
  }
}

export interface ProfessionalServiceSchema {
  "@context": "https://schema.org"
  "@type": "ProfessionalService"
  "@id": string
  name: string
  description: string
  url: string
  image: string
  priceRange: string
  areaServed: {
    "@type": "Place"
    name: string
  }
  serviceType: string[]
  provider: {
    "@type": "Person"
    name: string
    url: string
    image: string
    jobTitle: string
    telephone?: string
    email?: string
    address: {
      "@type": "PostalAddress"
      addressLocality: string
      addressCountry: string
    }
  }
  hasOfferCatalog: {
    "@type": "OfferCatalog"
    name: string
    itemListElement: Array<{
      "@type": "Offer"
      itemOffered: {
        "@type": "Service"
        name: string
        description: string
      }
    }>
  }
  aggregateRating?: {
    "@type": "AggregateRating"
    ratingValue: string
    reviewCount: string
  }
}

export interface PortfolioSchema {
  "@context": "https://schema.org"
  "@type": "Collection"
  name: string
  description: string
  creator: {
    "@type": "Person"
    name: string
    url: string
  }
  hasPart: Array<{
    "@type": "CreativeWork"
    name: string
    description: string
    url: string
    image: string
    dateCreated: string
    keywords: string[]
    genre: string
  }>
}

export interface WebsiteSchema {
  "@context": "https://schema.org"
  "@type": "WebSite"
  "@id": string
  name: string
  description: string
  url: string
  image: string
  author: {
    "@type": "Person"
    name: string
    url: string
  }
  publisher: {
    "@type": "Person"
    name: string
    url: string
  }
  inLanguage: string
  copyrightYear: string
  genre: string[]
  keywords: string[]
  audience: {
    "@type": "Audience"
    audienceType: string
  }
  potentialAction: {
    "@type": "SearchAction"
    target: {
      "@type": "EntryPoint"
      urlTemplate: string
    }
    "query-input": string
  }
  mainEntity: {
    "@type": "Person"
    name: string
    url: string
  }
}

export function generatePersonSchema(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jacqueline Frempomah Amoako",
    url: "https://jacquelineamoako.com",
    image: "https://jacquelineamoako.com/images/jackie-studio.png",
    sameAs: [
      "https://linkedin.com/in/jacqueline-frempomah-amoako",
      "https://github.com/jacquelineamoako"
    ],
    jobTitle: "Digital Growth Strategist & Systems Architect",
    worksFor: {
      "@type": "Organization",
      name: "Strategic Growth Consulting",
      url: "https://jacquelineamoako.com"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "Ghana"
    },
    knowsAbout: [
      "Digital Growth Strategy",
      "Revenue Systems Architecture",
      "SEO Authority Building",
      "Conversion Rate Optimization",
      "Premium Brand Positioning",
      "Lead Generation Systems",
      "Growth Analytics Strategy",
      "Market Authority Development",
      "Traffic Acquisition Systems",
      "Business Growth Consulting",
      "Strategic Partnerships",
      "Measurable Business Outcomes"
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "BSC Information Technology",
        educationalLevel: "Bachelor's Degree",
        credentialCategory: "degree"
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Diploma in Software Engineering",
        educationalLevel: "Diploma",
        credentialCategory: "diploma"
      }
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Ghana Technology University College"
      },
      {
        "@type": "CollegeOrUniversity",
        name: "IPMC Ghana"
      }
    ]
  }
}

export function generateProfessionalServiceSchema(): ProfessionalServiceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://jacquelineamoako.com/#professional-service",
    name: "Strategic Growth & Business Development Services",
    description: "Digital growth strategist architecting complete revenue-generating ecosystems for premium brands. From 340% traffic growth to 28% conversion increases—delivering measurable business outcomes that scale from $100K to $10M.",
    url: "https://jacquelineamoako.com",
    image: "https://jacquelineamoako.com/images/jackie-studio.png",
    priceRange: "$5000-$50000",
    areaServed: {
      "@type": "Place",
      name: "Ghana, West Africa, Global"
    },
    serviceType: [
      "Strategic Growth Consulting",
      "SEO Authority Building",
      "Conversion Rate Optimization",
      "Premium Lead Generation Systems",
      "Revenue-Optimized Commerce",
      "Market Authority Development",
      "Brand Positioning Strategy",
      "Growth Analytics & Measurement",
      "Traffic Acquisition Systems"
    ],
    provider: {
      "@type": "Person",
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com",
      image: "https://jacquelineamoako.com/images/jackie-studio.png",
      jobTitle: "Digital Growth Strategist & Systems Architect",
      email: "hello@jacquelineamoako.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "Ghana"
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Strategic Growth Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium Brand Authority Building",
            description: "Establish category leadership through SEO strategy, content positioning, and authority architecture. Achieving 340% average traffic growth for premium brands."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium Lead Generation Systems",
            description: "Convert high-value prospects with strategic acquisition funnels, conversion optimization, and buyer journey architecture. 28% average conversion increase."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Revenue-Optimized Commerce",
            description: "Maximize e-commerce revenue with conversion psychology, checkout optimization, and customer lifetime value systems. 42% average order value increase."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Strategic Brand Positioning",
            description: "Command premium pricing through sophisticated positioning, immersive storytelling, and exclusivity architecture for luxury brands."
          }
        }
      ]
    }
  }
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jacquelineamoako.com/#website",
    name: "Jacqueline Amoako - Digital Growth Strategist & Systems Architect",
    description: "Digital growth strategist architecting revenue-generating ecosystems for premium brands worldwide. Complete growth systems delivering measurable outcomes from $100K to $10M—340% traffic growth, 28% conversion increases, 42% revenue optimization.",
    url: "https://jacquelineamoako.com",
    image: "https://jacquelineamoako.com/images/jackie-studio.png",
    author: {
      "@type": "Person",
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com"
    },
    publisher: {
      "@type": "Person", 
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com"
    },
    inLanguage: "en-US",
    copyrightYear: "2025",
    genre: [
      "Strategic Growth Portfolio",
      "Business Development Services",
      "Digital Growth Strategy",
      "Revenue Systems Architecture",
      "Premium Brand Consulting"
    ],
    keywords: [
      "digital growth strategist",
      "strategic growth systems",
      "revenue-generating ecosystems",
      "Ghana growth consultant",
      "SEO authority building",
      "conversion rate optimization",
      "premium lead generation",
      "business growth architect",
      "market authority development",
      "strategic brand positioning",
      "measurable business outcomes",
      "growth analytics strategy"
    ],
    audience: {
      "@type": "Audience",
      audienceType: "CEOs, founders, luxury brand owners, marketing directors seeking measurable growth outcomes and strategic partnerships"
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jacquelineamoako.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    mainEntity: {
      "@type": "Person",
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com"
    }
  }
}

export function generatePortfolioSchema(): PortfolioSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: "Strategic Growth Portfolio - Measurable Business Outcomes",
    description: "Complete growth ecosystems delivering measurable results for premium brands—from 340% traffic growth to 28% conversion increases. SEO authority, lead generation, revenue optimization, and brand positioning case studies.",
    creator: {
      "@type": "Person",
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com"
    },
    hasPart: [
      {
        "@type": "CreativeWork",
        name: "Lovel.ai - AI Relationship Platform",
        description: "Advanced AI-powered platform for relationship insights and compatibility matching with sophisticated user experience design.",
        url: "https://jacquelineamoako.com/portfolio/lovel-ai",
        image: "https://jacquelineamoako.com/images/lovel.ai.png",
        dateCreated: "2024",
        keywords: ["AI platform", "web application", "React", "user experience"],
        genre: "Web Application"
      },
      {
        "@type": "CreativeWork",
        name: "Anabs - Luxury Residential Development",
        description: "Premium high-rise residential showcase with immersive user experience and sophisticated property presentation.",
        url: "https://jacquelineamoako.com/portfolio/anabs",
        image: "https://jacquelineamoako.com/images/anabs.png",
        dateCreated: "2024",
        keywords: ["luxury real estate", "property showcase", "premium design"],
        genre: "Luxury Website"
      },
      {
        "@type": "CreativeWork", 
        name: "Eleven Eleven Ghana - Beachfront Resort",
        description: "Luxury beachfront resort website with integrated booking system and immersive visual storytelling.",
        url: "https://jacquelineamoako.com/portfolio/eleven-eleven-ghana",
        image: "https://jacquelineamoako.com/images/eleven-eleven.png", 
        dateCreated: "2024",
        keywords: ["luxury hospitality", "resort website", "booking system"],
        genre: "Hospitality Website"
      }
    ]
  }
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://jacquelineamoako.com/#local-business",
    name: "Jacqueline Amoako Creative Technology Studio",
    description: "Premier web development and creative technology services in Accra, Ghana. Specializing in luxury websites and e-commerce solutions.",
    url: "https://jacquelineamoako.com",
    telephone: "+233-XX-XXX-XXXX",
    email: "hello@jacquelineamoako.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "Ghana"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 5.6037,
      longitude: -0.1870
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    sameAs: [
      "https://linkedin.com/in/jacqueline-frempomah-amoako"
    ]
  }
}