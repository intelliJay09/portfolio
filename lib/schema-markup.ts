/**
 * Structured data (schema.org JSON-LD). Identity copy comes from lib/site.ts, so this file
 * never carries its own claims: no prices, ratings or results unless they are verified.
 */

import { PAGES, SITE } from './site'

const PERSON_REF = {
  "@type": "Person" as const,
  name: SITE.legalName,
  url: SITE.url,
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.legalName,
    url: SITE.url,
    image: `${SITE.url}/images/jackie-studio.png`,
    sameAs: [...SITE.sameAs],
    jobTitle: SITE.role,
    description: SITE.description,
    worksFor: SITE.employers.map((name) => ({ "@type": "Organization", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressCountry: SITE.location.country,
    },
    knowsAbout: [...SITE.knowsAbout],
    alumniOf: SITE.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    hasCredential: SITE.education.map((e) => ({
      "@type": "EducationalOccupationalCredential",
      name: e.name,
      credentialCategory: e.name.startsWith('BSc') ? 'degree' : 'diploma',
    })),
  }
}

export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#professional-service`,
    name: SITE.employers[0],
    description:
      'Customer lifecycle strategy, CRM and email and WhatsApp automation, and the websites that sit in front of them.',
    url: SITE.url,
    image: `${SITE.url}/images/jackie-studio.png`,
    areaServed: { "@type": "Place", name: "Ghana and remote" },
    serviceType: [
      "Customer lifecycle marketing",
      "Email and WhatsApp automation",
      "CRM setup and automation",
      "Website design and development",
    ],
    provider: {
      ...PERSON_REF,
      jobTitle: SITE.role,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.location.city,
        addressCountry: SITE.location.country,
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Customer lifecycle automation",
            description:
              "Mapping each stage of the customer journey and building the email and WhatsApp messages that run at the right moment: sign-up, payment, onboarding, retention and win-back.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "CRM setup",
            description:
              "A CRM built around how a business actually runs, connected to its payments, forms and messaging.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website design and development",
            description:
              "Websites built in React and Next.js and connected to the bookings, payments and follow-up behind them.",
          },
        },
      ],
    },
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: `${SITE.name} | ${SITE.role}`,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/images/jackie-studio.png`,
    author: PERSON_REF,
    publisher: PERSON_REF,
    inLanguage: "en-US",
    keywords: [...SITE.keywords],
    mainEntity: PERSON_REF,
  }
}

export function generatePortfolioSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: PAGES.portfolio.title,
    description: PAGES.portfolio.description,
    creator: PERSON_REF,
    hasPart: [
      {
        "@type": "CreativeWork",
        name: "Gwen Addo: customer lifecycle, CRM and website",
        description:
          "Her whole customer journey, from the first sign-up to the next cohort: the website, the CRM and the automated emails behind them.",
        url: `${SITE.url}/portfolio/gwen-addo`,
        image: `${SITE.url}/images/case-studies/gwen-addo/og.jpg`,
        genre: "Customer lifecycle and website",
      },
      {
        "@type": "CreativeWork",
        name: "Anabs: luxury high-rise development",
        description: "A website for a 26-floor luxury residential tower in Accra.",
        url: `${SITE.url}/portfolio/anabs`,
        image: `${SITE.url}/images/anabs.png`,
        genre: "Website",
      },
      {
        "@type": "CreativeWork",
        name: "Eleven Eleven Ghana: beachfront resort",
        description: "A website for a luxury beachfront resort in Ghana, designed to immerse visitors in the experience and drive bookings.",
        url: `${SITE.url}/portfolio/eleven-eleven-ghana`,
        image: `${SITE.url}/images/eleven-eleven.png`,
        genre: "Website",
      },
    ],
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
