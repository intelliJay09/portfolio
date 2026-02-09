/**
 * Open Graph & Social Media Meta Tags Generator
 * Strategic Growth Positioning for Digital Growth Strategist
 */

export interface OpenGraphData {
  title: string
  description: string
  url: string
  type: 'website' | 'article' | 'profile' | 'portfolio'
  images: Array<{
    url: string
    width: number
    height: number
    alt: string
  }>
  siteName: string
  locale: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  site: string
  creator: string
  title: string
  description: string
  image: string
  imageAlt: string
}

/**
 * Generate Open Graph meta tags for strategic positioning
 */
export function generateOpenGraphTags(data: OpenGraphData): Record<string, string> {
  const tags: Record<string, string> = {
    'og:type': data.type,
    'og:site_name': data.siteName,
    'og:title': data.title,
    'og:description': data.description,
    'og:url': data.url,
    'og:locale': data.locale,
  }

  // Add images
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      const prefix = index === 0 ? 'og:image' : `og:image:${index}`
      tags[prefix] = image.url
      tags[`${prefix}:width`] = image.width.toString()
      tags[`${prefix}:height`] = image.height.toString()
      tags[`${prefix}:alt`] = image.alt
    })
  }

  // Add article-specific tags
  if (data.type === 'article') {
    if (data.author) tags['article:author'] = data.author
    if (data.publishedTime) tags['article:published_time'] = data.publishedTime
    if (data.modifiedTime) tags['article:modified_time'] = data.modifiedTime
    if (data.section) tags['article:section'] = data.section
    if (data.tags) {
      data.tags.forEach((tag, index) => {
        tags[`article:tag:${index}`] = tag
      })
    }
  }

  return tags
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(data: TwitterCardData): Record<string, string> {
  return {
    'twitter:card': data.card,
    'twitter:site': data.site,
    'twitter:creator': data.creator,
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.image,
    'twitter:image:alt': data.imageAlt,
  }
}

/**
 * Homepage Open Graph - Digital Growth Strategist
 */
export function getHomepageOpenGraph(): OpenGraphData {
  return {
    title: 'Jacqueline Amoako | Digital Growth Strategist & Systems Architect',
    description: 'Digital Growth Strategist architecting revenue-generating ecosystems for premium brands worldwide. From 340% traffic growth to 28% conversion increases—complete growth systems that scale your vision from $100K to $10M.',
    url: 'https://jacquelineamoako.com',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Jacqueline Amoako - Digital Growth Strategist building revenue ecosystems for luxury brands'
      }
    ],
    siteName: 'Jacqueline Amoako',
    locale: 'en_US'
  }
}

/**
 * About Page Open Graph - Strategic Authority
 */
export function getAboutOpenGraph(): OpenGraphData {
  return {
    title: 'About Jacqueline | Strategic Growth Partner for Premium Brands',
    description: 'Digital Growth Strategist with 5+ years architecting complete growth ecosystems—SEO authority platforms, conversion engines, revenue systems. Working with luxury brands from Ghana to global markets.',
    url: 'https://jacquelineamoako.com/about',
    type: 'profile',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Jacqueline Amoako - Digital Growth Strategist and Systems Architect'
      }
    ],
    siteName: 'Jacqueline Amoako',
    locale: 'en_US',
    author: 'Jacqueline Frempomah Amoako'
  }
}

/**
 * Portfolio Page Open Graph - Growth Outcomes
 */
export function getPortfolioOpenGraph(): OpenGraphData {
  return {
    title: 'Strategic Growth Portfolio | Measurable Results for Premium Brands',
    description: 'From luxury real estate commanding 340% traffic growth to lead generation systems achieving 28% conversion increases—complete growth ecosystems engineered for premium brands who refuse to compete on price.',
    url: 'https://jacquelineamoako.com/portfolio',
    type: 'portfolio',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Strategic growth outcomes and business results portfolio'
      }
    ],
    siteName: 'Jacqueline Amoako',
    locale: 'en_US'
  }
}

/**
 * Contact Page Open Graph - Strategic Partnership
 */
export function getContactOpenGraph(): OpenGraphData {
  return {
    title: 'Partner With Jacqueline | Strategic Growth Consultation',
    description: 'Ready to architect a complete growth ecosystem for your premium brand? From SEO authority to revenue systems—let\'s engineer measurable business outcomes that compound month over month.',
    url: 'https://jacquelineamoako.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Strategic partnership consultation for premium brand growth'
      }
    ],
    siteName: 'Jacqueline Amoako',
    locale: 'en_US'
  }
}

/**
 * Generate Project-Specific Open Graph
 */
export function getProjectOpenGraph(
  projectTitle: string,
  projectDescription: string,
  projectSlug: string,
  projectImage: string,
  businessChallenge: string,
  measurableOutcome: string
): OpenGraphData {
  return {
    title: `${projectTitle} | Strategic Growth Case Study`,
    description: `${businessChallenge} ${measurableOutcome}`,
    url: `https://jacquelineamoako.com/portfolio/${projectSlug}`,
    type: 'article',
    images: [
      {
        url: projectImage,
        width: 1200,
        height: 630,
        alt: `${projectTitle} - Strategic growth case study showcasing measurable business outcomes`
      }
    ],
    siteName: 'Jacqueline Amoako',
    locale: 'en_US',
    author: 'Jacqueline Frempomah Amoako',
    section: 'Strategic Growth Portfolio',
    tags: ['Growth Systems', 'Digital Strategy', 'Business Outcomes', 'Premium Brands']
  }
}

/**
 * Default Twitter Card for all pages
 */
export function getDefaultTwitterCard(): TwitterCardData {
  return {
    card: 'summary_large_image',
    site: '@jacquelineamoako',
    creator: '@jacquelineamoako',
    title: 'Jacqueline Amoako | Digital Growth Strategist',
    description: 'Architecting revenue-generating ecosystems for premium brands worldwide. Complete growth systems from $100K to $10M.',
    image: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
    imageAlt: 'Digital Growth Strategist building complete growth ecosystems'
  }
}

/**
 * Generate complete meta tags for Next.js metadata
 */
export function generateCompleteMetadata(ogData: OpenGraphData, twitterData: TwitterCardData) {
  const ogTags = generateOpenGraphTags(ogData)
  const twitterTags = generateTwitterCardTags(twitterData)

  return {
    title: ogData.title,
    description: ogData.description,
    openGraph: {
      type: ogData.type,
      url: ogData.url,
      title: ogData.title,
      description: ogData.description,
      siteName: ogData.siteName,
      locale: ogData.locale,
      images: ogData.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
      ...(ogData.type === 'article' && {
        article: {
          author: ogData.author,
          publishedTime: ogData.publishedTime,
          modifiedTime: ogData.modifiedTime,
          section: ogData.section,
          tags: ogData.tags,
        }
      })
    },
    twitter: {
      card: twitterData.card,
      site: twitterData.site,
      creator: twitterData.creator,
      title: twitterData.title,
      description: twitterData.description,
      images: [
        {
          url: twitterData.image,
          alt: twitterData.imageAlt,
        }
      ],
    },
  }
}

/**
 * Strategic keyword enrichment for social sharing
 */
export function enrichSocialDescription(baseDescription: string): string {
  const strategicTerms = [
    'measurable outcomes',
    'strategic growth',
    'revenue systems',
    'business results',
    'premium positioning'
  ]

  // Check if description already contains strategic terms
  const hasStrategicLanguage = strategicTerms.some(term =>
    baseDescription.toLowerCase().includes(term.toLowerCase())
  )

  if (hasStrategicLanguage) {
    return baseDescription
  }

  // Add strategic context if missing
  return `${baseDescription} Delivering measurable business outcomes and strategic growth systems.`
}
