/**
 * SEO Utilities for Luxury Portfolio Site
 * Advanced SEO functions and internal linking strategies
 */

export interface LuxuryKeyword {
  primary: string[]
  secondary: string[]
  location: string[]
  services: string[]
  industry: string[]
}

export interface InternalLink {
  href: string
  text: string
  title: string
  keywords: string[]
  priority: 'high' | 'medium' | 'low'
}

export const luxuryKeywords: LuxuryKeyword = {
  primary: [
    'luxury web developer',
    'premium website design',
    'high-end web development',
    'luxury brand websites',
    'bespoke digital solutions',
    'sophisticated web applications',
    'exclusive digital experiences',
    'premium e-commerce development'
  ],
  secondary: [
    'creative technologist',
    'luxury portfolio',
    'premium brand design',
    'high-performance websites',
    'sophisticated UI/UX',
    'enterprise web solutions',
    'luxury creative services',
    'premium digital consulting'
  ],
  location: [
    'Ghana web developer',
    'Accra luxury design',
    'West Africa premium services',
    'Ghana creative technology',
    'African luxury web development'
  ],
  services: [
    'React development',
    'Next.js applications',
    'luxury e-commerce',
    'premium SEO services',
    'high-end database solutions',
    'sophisticated API integration',
    'luxury brand identity',
    'premium performance optimization'
  ],
  industry: [
    'luxury hospitality websites',
    'high-end real estate platforms',
    'premium fashion e-commerce',
    'luxury automotive websites',
    'exclusive resort booking systems',
    'high-end consultancy websites'
  ]
}

export const strategicInternalLinks: InternalLink[] = [
  // High priority - main services and portfolio
  {
    href: '/portfolio',
    text: 'luxury web development portfolio',
    title: 'View Premium Web Development Portfolio - Luxury Digital Experiences',
    keywords: ['luxury portfolio', 'premium websites', 'high-end development'],
    priority: 'high'
  },
  {
    href: '/about',
    text: 'luxury web developer',
    title: 'About Jacqueline Amoako - Luxury Web Developer & Creative Technologist',
    keywords: ['luxury web developer', 'creative technologist', 'premium services'],
    priority: 'high'
  },
  {
    href: '/contact',
    text: 'premium web development consultation',
    title: 'Contact for Luxury Web Development Services - Premium Digital Solutions',
    keywords: ['luxury consultation', 'premium services', 'bespoke solutions'],
    priority: 'high'
  },
  
  // Medium priority - specific project categories
  {
    href: '/portfolio/anabs-ghana',
    text: 'luxury real estate website development',
    title: 'Anabs Ghana - Luxury High-Rise Development Website',
    keywords: ['luxury real estate', 'premium property websites', 'high-end development'],
    priority: 'medium'
  },
  {
    href: '/portfolio/eleven-eleven-ghana',
    text: 'luxury hospitality web development',
    title: 'Eleven Eleven Ghana - Luxury Beachfront Resort Website',
    keywords: ['luxury hospitality', 'premium resort websites', 'booking systems'],
    priority: 'medium'
  },
  {
    href: '/portfolio/lovel-ai',
    text: 'sophisticated web application development',
    title: 'Lovel.ai - AI-Powered Relationship Platform',
    keywords: ['web applications', 'AI platforms', 'sophisticated development'],
    priority: 'medium'
  },
  
  // Service-specific links
  {
    href: '/portfolio',
    text: 'premium e-commerce development',
    title: 'Premium E-commerce Solutions - Luxury Online Store Development',
    keywords: ['luxury e-commerce', 'premium online stores', 'high-end retail'],
    priority: 'medium'
  },
  {
    href: '/about',
    text: 'React development expertise',
    title: 'Expert React Developer - Sophisticated Frontend Development',
    keywords: ['React development', 'frontend expertise', 'modern web apps'],
    priority: 'medium'
  }
]

/**
 * Generate contextual internal links based on current page and content
 */
export function generateContextualLinks(
  currentPage: string,
  contentType: 'homepage' | 'portfolio' | 'project' | 'about' | 'contact',
  maxLinks: number = 3
): InternalLink[] {
  const availableLinks = strategicInternalLinks.filter(link => 
    link.href !== currentPage
  )
  
  // Sort by priority and relevance
  const sortedLinks = availableLinks.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    return priorityWeight[b.priority] - priorityWeight[a.priority]
  })
  
  return sortedLinks.slice(0, maxLinks)
}

/**
 * Generate luxury-focused meta description
 */
export function generateLuxuryMetaDescription(
  baseDescription: string,
  keywords: string[],
  location?: string
): string {
  const luxuryModifiers = [
    'sophisticated',
    'premium',
    'bespoke',
    'exclusive',
    'high-end',
    'luxury',
    'elite'
  ]
  
  const randomModifier = luxuryModifiers[Math.floor(Math.random() * luxuryModifiers.length)]
  const locationSuffix = location ? ` in ${location}` : ''
  
  // Ensure description is under 160 characters
  const maxLength = 155
  let description = `${baseDescription} ${randomModifier} ${keywords[0]}${locationSuffix}.`
  
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...'
  }
  
  return description
}

/**
 * Generate luxury-focused page titles
 */
export function generateLuxuryTitle(
  baseName: string,
  service: string,
  modifier: string = 'Luxury'
): string {
  return `${baseName} | ${modifier} ${service} & Creative Technology`
}

/**
 * Extract and optimize keywords from content
 */
export function optimizeContentKeywords(content: string): string {
  const keywordReplacements: { [key: string]: string } = {
    'web developer': 'luxury web developer',
    'website design': 'premium website design',
    'e-commerce': 'luxury e-commerce',
    'digital solutions': 'bespoke digital solutions',
    'web development': 'high-end web development',
    'creative services': 'luxury creative services',
    'brand design': 'premium brand design',
    'portfolio': 'luxury portfolio',
    'consultation': 'premium consultation'
  }
  
  let optimizedContent = content
  
  Object.entries(keywordReplacements).forEach(([original, luxury]) => {
    // Only replace if not already luxury-modified
    const regex = new RegExp(`\\b${original}\\b(?!\\s+(luxury|premium|high-end|bespoke|sophisticated))`, 'gi')
    optimizedContent = optimizedContent.replace(regex, luxury)
  })
  
  return optimizedContent
}

/**
 * Generate structured data for luxury services
 */
export interface LuxuryService {
  name: string
  description: string
  price?: string
  category: string
  keywords: string[]
}

export function generateServiceStructuredData(services: LuxuryService[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Luxury Web Development",
    "provider": {
      "@type": "Person",
      "name": "Jacqueline Frempomah Amoako",
      "url": "https://jacquelineamoako.com"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Luxury Web Development Services",
      "itemListElement": services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description,
          "category": service.category
        },
        "price": service.price,
        "priceCurrency": "USD"
      }))
    }
  }
}

/**
 * SEO-optimized URL slug generator
 */
export function generateSEOSlug(title: string, type: 'luxury' | 'premium' | 'bespoke' = 'luxury'): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove multiple hyphens
    .trim()
  
  return `${type}-${cleanTitle}`
}

/**
 * Generate luxury-focused alt text for images
 */
export function generateLuxuryAltText(
  projectName: string,
  category: 'website' | 'e-commerce' | 'branding' | 'application',
  modifier: string = 'luxury'
): string {
  const categoryDescriptions = {
    website: `${modifier} website design`,
    'e-commerce': `${modifier} e-commerce platform`,
    branding: `${modifier} brand identity design`,
    application: `sophisticated web application`
  }
  
  return `${projectName} - ${categoryDescriptions[category]} by Jacqueline Amoako`
}

/**
 * Luxury-focused content analysis and suggestions
 */
export interface ContentAnalysis {
  keywordDensity: { [key: string]: number }
  suggestions: string[]
  luxuryScore: number
  readabilityScore: number
}

export function analyzeLuxuryContent(content: string): ContentAnalysis {
  const words = content.toLowerCase().split(/\s+/)
  const totalWords = words.length
  
  // Calculate keyword density
  const keywordCounts: { [key: string]: number } = {}
  const allLuxuryKeywords = [
    ...luxuryKeywords.primary,
    ...luxuryKeywords.secondary,
    ...luxuryKeywords.services
  ]
  
  allLuxuryKeywords.forEach(keyword => {
    const keywordWords = keyword.toLowerCase().split(' ')
    let count = 0
    
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      if (keywordWords.every((word, j) => words[i + j] === word)) {
        count++
      }
    }
    
    if (count > 0) {
      keywordCounts[keyword] = (count / totalWords) * 100
    }
  })
  
  // Calculate luxury score (percentage of luxury terms)
  const luxuryTerms = ['luxury', 'premium', 'sophisticated', 'bespoke', 'exclusive', 'high-end', 'elite']
  const luxuryTermCount = words.filter(word => luxuryTerms.includes(word)).length
  const luxuryScore = (luxuryTermCount / totalWords) * 100
  
  // Generate suggestions
  const suggestions: string[] = []
  
  if (luxuryScore < 2) {
    suggestions.push('Consider adding more luxury-focused terms to enhance brand positioning')
  }
  
  if (!content.includes('bespoke') && !content.includes('sophisticated')) {
    suggestions.push('Add terms like "bespoke" or "sophisticated" to emphasize custom solutions')
  }
  
  if (Object.keys(keywordCounts).length < 3) {
    suggestions.push('Include more strategic keywords from the luxury keyword list')
  }
  
  return {
    keywordDensity: keywordCounts,
    suggestions,
    luxuryScore,
    readabilityScore: calculateReadabilityScore(content)
  }
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0)
  
  if (sentences.length === 0 || words.length === 0) return 0
  
  const avgWordsPerSentence = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length
  
  // Flesch Reading Ease Score
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  return Math.max(0, Math.min(100, score))
}

function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  const vowels = 'aeiouy'
  let count = 0
  let previousWasVowel = false
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !previousWasVowel) {
      count++
    }
    previousWasVowel = isVowel
  }
  
  // Adjust for silent e
  if (word.endsWith('e')) {
    count--
  }
  
  return Math.max(1, count)
}