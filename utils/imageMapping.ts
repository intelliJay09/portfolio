/**
 * Image Mapping Utility
 * Handles mapping between project slugs and actual image file paths
 * Resolves issues with spaces in filenames and different extensions
 */

// Image file mappings for website projects
const websiteImages: Record<string, string> = {
  'eleven-eleven-ghana': '/images/eleven-eleven.png',
  'gwen-addo': '/images/gwen-addo.png', 
  'optimum-property-solutions': '/images/optimum-property.png',
  'emmanuel-kotia': '/images/emma-kotia.png',
  'imagebloom-by-saida': '/images/image-bloom.png',
  'rosemond-prempeh': '/images/rosemond-prempeh.png',
  'royal-itech': '/images/royal-itech.png',
  'girl-code-africa': '/images/girlcode.png',
  'goa-conference': '/images/ghana-optometric- association-conference.png',
  'eden-heights': '/images/eden-heights.png',
  'landmark-homes': '/images/landmark-homes.png',
  'ghana-optometric-association': '/images/ghana-optometric- association-main.png',
  'twist-nightclub': '/images/twist-night-club.png',
  'command-space': '/images/command-space.png',
  'qualivex-solutions': '/images/qualivex-solutions.png',
  'anabs': '/images/anabs.png',
  'kline-designs': '/images/klinedesign.png'
}

// Image file mappings for web app projects
const webAppImages: Record<string, string> = {
  'lovel-ai': '/images/lovel.ai.png'
}

// Image file mappings for graphic design projects - URL encoded for spaces
const graphicDesignImages: Record<string, string> = {
  'vwear-coming-soon': '/graphic-design/vwear-coming-soon.png',
  'allure-bloom-pricelist': '/graphic-design/Allure%20Bloom%20Piercing%20%26%20Waxing%20Pricelist.png',
  'allure-bloom-training-flyer': '/graphic-design/Allure%20Bloom%20May%20Training%20Flyer.png',
  'braids-and-beyond-2': '/graphic-design/braids-and-beyond2.jpg',
  'vwear-logo-black': '/graphic-design/V%20Wear%20Logo%20Black.png',
  'ab-beauty-supply': '/graphic-design/AB%20Beauty%20Supply%20Paper%20Bag%20Design%20(3).png',
  'allure-bloom-brand': '/graphic-design/Allure%20Bloom%202nd%20Anniversary%20Promo%20(1).png',
  'leejay-looks-brand': '/graphic-design/Leejay%20Looks%20Faboulous%20Friday%20Flyer.png',
  'mavis-nails-logo': '/graphic-design/Mavis%20Nails%20GH%20Logo%20Black.png',
  'tda-luxe-logo': '/graphic-design/TDA%20Luxe%20Set%20Logo.png',
  'kloves-advisor-hotels': '/graphic-design/Kloves%20Advisor%20Hotels%20Flyer.jpg',
  'braids-and-beyond': '/graphic-design/braids-and-beyond.jpg',
  'accra-price-list': '/graphic-design/Accra%20Price%20List%20Flyer.png',
  'allure-bloom-loyalty-card': '/graphic-design/Allure%20Bloom%20Loyalty%20Card%20(1).png',
  'allure-bloom-certificate': '/graphic-design/Allure%20Bloom%20Training%20Certificate%20(1).png',
  'gift-voucher': '/graphic-design/Gift%20Voucher%20(1).png',
  'leejay-looks-intensive': '/graphic-design/Leejay%20Looks%202%20weeks%20Intensive%20Flyer%20(1).png',
  'leejay-looks-hours': '/graphic-design/Leejay%20Looks%20Opening%20Hours%20(2).png',
  'spa-on-the-go': '/graphic-design/Spa%20on%20the%20go%20packages.jpg'
}

/**
 * Get the correct image path for a project
 */
export function getProjectImage(slug: string, category: string): string {
  if (category === 'Websites') {
    return websiteImages[slug] || '/images/hero%20image.png'
  } else if (category === 'Web Apps') {
    return webAppImages[slug] || '/images/lovel.ai.png'
  } else if (category === 'Graphic Design') {
    return graphicDesignImages[slug] || '/graphic-design/braids-and-beyond.jpg'
  }
  
  return '/images/hero%20image.png'
}

/**
 * Get luxury grid class - Clean, sophisticated layout pattern
 */
export function getLuxuryGridClass(index: number, category: string): string {
  // Patterns without hero/featured - consistent editorial grid (12 columns total)
  const websitePatterns = [
    'luxury-large',     // 0: Row 1 = 8 columns
    'luxury-small',     // 1: Row 1 = 4 columns (8+4=12) ✓
    'luxury-medium',    // 2: Row 2 = 6 columns
    'luxury-medium',    // 3: Row 2 = 6 columns (6+6=12) ✓
    'luxury-small',     // 4: Row 3 = 4 columns
    'luxury-small',     // 5: Row 3 = 4 columns  
    'luxury-small',     // 6: Row 3 = 4 columns (4+4+4=12) ✓
    'luxury-small',     // 7: Row 4 = 4 columns
    'luxury-large',     // 8: Row 4 = 8 columns (4+8=12) ✓
    'luxury-medium',    // 9: Row 5 = 6 columns
    'luxury-medium',    // 10: Row 5 = 6 columns (6+6=12) ✓
    'luxury-small',     // 11: Row 6 = 4 columns
    'luxury-small',     // 12: Row 6 = 4 columns
    'luxury-small',     // 13: Row 6 = 4 columns (4+4+4=12) ✓
    'luxury-large',     // 14: Row 7 = 8 columns
    'luxury-small'      // 15: Row 7 = 4 columns (8+4=12) ✓
  ]
  
  const webAppPatterns = [
    'luxury-large',     // 0: Row 1 = 8 columns (featured app showcase)
    'luxury-small',     // 1: Row 1 = 4 columns (8+4=12) ✓
    'luxury-medium',    // 2: Row 2 = 6 columns
    'luxury-medium',    // 3: Row 2 = 6 columns (6+6=12) ✓
    'luxury-tall',      // 4: Row 3 = 4 columns (for mobile mockups)
    'luxury-small',     // 5: Row 3 = 4 columns
    'luxury-small',     // 6: Row 3 = 4 columns (4+4+4=12) ✓
    'luxury-large',     // 7: Row 4 = 8 columns
    'luxury-small'      // 8: Row 4 = 4 columns (8+4=12) ✓
  ]
  
  const graphicPatterns = [
    'luxury-medium',    // 0: Row 1 = 6 columns
    'luxury-medium',    // 1: Row 1 = 6 columns (6+6=12) ✓
    'luxury-small',     // 2: Row 2 = 4 columns
    'luxury-small',     // 3: Row 2 = 4 columns
    'luxury-small',     // 4: Row 2 = 4 columns (4+4+4=12) ✓
    'luxury-large',     // 5: Row 3 = 8 columns
    'luxury-small',     // 6: Row 3 = 4 columns (8+4=12) ✓
    'luxury-tall',      // 7: Row 4 = 4 columns
    'luxury-tall',      // 8: Row 4 = 4 columns
    'luxury-tall',      // 9: Row 4 = 4 columns (4+4+4=12) ✓
    'luxury-medium',    // 10: Row 5 = 6 columns
    'luxury-medium',    // 11: Row 5 = 6 columns (6+6=12) ✓
    'luxury-small',     // 12: Row 6 = 4 columns
    'luxury-small',     // 13: Row 6 = 4 columns
    'luxury-small'      // 14: Row 6 = 4 columns (4+4+4=12) ✓
  ]
  
  if (category === 'Websites') {
    return websitePatterns[index % websitePatterns.length]
  } else if (category === 'Web Apps') {
    return webAppPatterns[index % webAppPatterns.length]
  } else {
    return graphicPatterns[index % graphicPatterns.length]
  }
}

/**
 * Generate sophisticated staggered delays for animations
 */
export function getStaggerDelay(index: number): number {
  // Simple, elegant stagger timing
  return index * 0.08
}

/**
 * Check if an image exists in the mapping
 */
export function hasProjectImage(slug: string, category: string): boolean {
  if (category === 'Websites') {
    return slug in websiteImages
  } else if (category === 'Web Apps') {
    return slug in webAppImages
  } else if (category === 'Graphic Design') {
    return slug in graphicDesignImages
  }
  
  return false
}

/**
 * Get fallback image for missing projects with encoding
 */
export function getFallbackImage(category: string): string {
  const fallbacks = {
    'Websites': '/images/hero%20image.png',
    'Web Apps': '/images/lovel.ai.png',
    'Graphic Design': '/graphic-design/braids-and-beyond.jpg'
  }
  return fallbacks[category as keyof typeof fallbacks] || fallbacks['Websites']
}

/**
 * Properly encode image paths that may contain spaces
 */
export function encodeImagePath(path: string): string {
  try {
    // Split the path into segments to avoid double encoding
    const pathParts = path.split('/')
    const encodedParts = pathParts.map(part => 
      part === '' ? part : encodeURIComponent(part).replace(/%2520/g, '%20')
    )
    return encodedParts.join('/')
  } catch (error) {
    console.error('Error encoding image path:', error, path)
    return path
  }
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}