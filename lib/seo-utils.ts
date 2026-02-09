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
    'digital growth strategist',
    'strategic growth systems',
    'revenue-generating ecosystems',
    'premium brand growth',
    'business growth architect',
    'conversion optimization specialist',
    'SEO authority strategist',
    'digital growth partner'
  ],
  secondary: [
    'strategic business outcomes',
    'measurable growth results',
    'premium brand positioning',
    'revenue systems architect',
    'growth ecosystem engineer',
    'conversion rate optimization',
    'market authority building',
    'premium lead generation'
  ],
  location: [
    'Ghana growth strategist',
    'Accra digital strategist',
    'West Africa business growth',
    'Ghana strategic consulting',
    'African market growth expert'
  ],
  services: [
    'SEO authority building',
    'conversion rate optimization',
    'lead generation systems',
    'revenue optimization',
    'growth analytics strategy',
    'traffic acquisition systems',
    'brand positioning strategy',
    'business growth consulting'
  ],
  industry: [
    'luxury real estate growth',
    'hospitality revenue systems',
    'premium e-commerce optimization',
    'high-end property marketing',
    'resort booking optimization',
    'consultancy lead generation'
  ]
}

export const strategicInternalLinks: InternalLink[] = [
  // High priority - main services and portfolio
  {
    href: '/portfolio',
    text: 'strategic growth portfolio',
    title: 'View Strategic Growth Portfolio - Measurable Business Outcomes',
    keywords: ['growth portfolio', 'business outcomes', 'strategic results'],
    priority: 'high'
  },
  {
    href: '/about',
    text: 'digital growth strategist',
    title: 'About Jacqueline Amoako - Digital Growth Strategist & Systems Architect',
    keywords: ['growth strategist', 'systems architect', 'strategic partner'],
    priority: 'high'
  },
  {
    href: '/contact',
    text: 'strategic growth consultation',
    title: 'Contact for Strategic Growth Partnership - Revenue-Generating Ecosystems',
    keywords: ['growth consultation', 'strategic partnership', 'business outcomes'],
    priority: 'high'
  },
  
  // Medium priority - specific project categories
  {
    href: '/portfolio/anabs-ghana',
    text: 'luxury real estate growth strategy',
    title: 'Anabs Ghana - Premium Brand Authority Case Study',
    keywords: ['real estate growth', 'premium positioning', 'brand authority'],
    priority: 'medium'
  },
  {
    href: '/portfolio/eleven-eleven-ghana',
    text: 'hospitality revenue optimization',
    title: 'Eleven Eleven Ghana - Direct Booking Revenue System',
    keywords: ['hospitality growth', 'booking optimization', 'revenue systems'],
    priority: 'medium'
  },
  {
    href: '/portfolio/gwen-addo',
    text: 'consultation lead generation',
    title: 'Gwen Addo - Premium Lead Generation System',
    keywords: ['lead generation', 'conversion optimization', 'client acquisition'],
    priority: 'medium'
  },

  // Service-specific links
  {
    href: '/portfolio',
    text: 'revenue-optimized e-commerce',
    title: 'Revenue-Optimized E-commerce - Growth Systems for Premium Brands',
    keywords: ['e-commerce growth', 'revenue optimization', 'conversion systems'],
    priority: 'medium'
  },
  {
    href: '/about',
    text: 'conversion optimization expertise',
    title: 'Conversion Optimization Strategist - Measurable Business Outcomes',
    keywords: ['conversion optimization', 'CRO expertise', 'growth systems'],
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
    'web developer': 'digital growth strategist',
    'website': 'growth system',
    'e-commerce': 'revenue-optimized commerce',
    'digital solutions': 'growth ecosystems',
    'web development': 'strategic growth systems',
    'services': 'strategic partnerships',
    'brand design': 'brand positioning strategy',
    'portfolio': 'growth outcomes portfolio',
    'consultation': 'strategic growth consultation'
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