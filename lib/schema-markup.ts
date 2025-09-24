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
    jobTitle: "Luxury Web Developer & Creative Technologist",
    worksFor: {
      "@type": "Organization",
      name: "Freelance Creative Technology Studio",
      url: "https://jacquelineamoako.com"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "Ghana"
    },
    knowsAbout: [
      "Luxury Web Development",
      "Premium Brand Design",
      "E-commerce Solutions",
      "SEO Optimization",
      "Frontend Development",
      "Backend Architecture",
      "Creative Technology",
      "React Development",
      "Next.js Applications",
      "Database Optimization",
      "User Experience Design",
      "Brand Identity Design"
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
    name: "Luxury Web Development & Creative Technology Services",
    description: "Premium web development, e-commerce solutions, and creative technology services for luxury brands and high-end businesses. Specializing in custom websites that drive growth and conversions.",
    url: "https://jacquelineamoako.com",
    image: "https://jacquelineamoako.com/images/jackie-studio.png",
    priceRange: "$2000-$50000",
    areaServed: {
      "@type": "Place",
      name: "Ghana, West Africa, International"
    },
    serviceType: [
      "Custom Web Development",
      "Luxury E-commerce Solutions", 
      "SEO & Performance Optimization",
      "Brand Identity Design",
      "Creative Technology Consulting",
      "Frontend Development",
      "Backend Architecture",
      "Database Optimization",
      "Website Maintenance"
    ],
    provider: {
      "@type": "Person",
      name: "Jacqueline Frempomah Amoako",
      url: "https://jacquelineamoako.com",
      image: "https://jacquelineamoako.com/images/jackie-studio.png",
      jobTitle: "Luxury Web Developer & Creative Technologist",
      email: "jacque.amoako@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "Ghana"
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Creative Technology Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Luxury Web Development",
            description: "Bespoke websites crafted for premium brands with focus on performance, aesthetics, and conversion optimization."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "High-End E-commerce Solutions",
            description: "Sophisticated online stores with advanced features, secure payments, and optimized user experiences."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SEO & Performance Optimization",
            description: "Technical SEO, Core Web Vitals optimization, and performance tuning for maximum visibility and speed."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Brand Identity & Visual Design",
            description: "Complete brand identity systems including logos, marketing materials, and cohesive visual experiences."
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
    name: "Jacqueline Amoako - Luxury Web Developer & Creative Technologist",
    description: "Premium web development and creative technology services. Specializing in luxury websites, e-commerce solutions, and brand experiences that drive growth for high-end businesses.",
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
      "Portfolio",
      "Professional Services",
      "Creative Technology",
      "Web Development",
      "Luxury Design"
    ],
    keywords: [
      "luxury web development",
      "premium website design",
      "high-end e-commerce",
      "Ghana web developer",
      "luxury brand websites",
      "custom web development",
      "creative technology",
      "React developer Ghana",
      "Next.js developer",
      "luxury digital experiences",
      "premium brand design",
      "high-performance websites"
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Business executives, luxury brand owners, entrepreneurs, marketing directors"
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
    name: "Luxury Web Development Portfolio",
    description: "A curated collection of premium websites, e-commerce platforms, and creative technology solutions for luxury brands and high-end businesses.",
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
    email: "jacque.amoako@gmail.com",
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