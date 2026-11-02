/**
 * Image Mapping Utility
 * Handles mapping between project slugs and actual image file paths
 * Resolves issues with spaces in filenames and different extensions
 */

// Image file mappings for website projects
const websiteImages: Record<string, string> = {
  'eleven-eleven-ghana': '/images/eleven-eleven.png',
  'gwen-addo': '/images/gwen-addo.png', 
  'emmanuel-kotia': '/images/emma-kotia.png',
  'royal-itech': '/images/royal-itech.png',
  'girl-code-africa': '/images/girlcode.png',
  'eden-heights': '/images/eden-heights.png',
  'landmark-homes': '/images/landmark-homes.png',
  'ghana-optometric-association': '/images/ghana-optometric- association-main.png',
  'twist-nightclub': '/images/twist-night-club.png',
  'command-space': '/images/command-space.png',
  'anabs': '/images/anabs.png',
  'kline-designs': '/images/klinedesign.png',
  'eddy': '/images/eddy-hero.jpg',
  'finest-dietitian': '/images/case-studies/finest-dietitian/site-home.webp'
}

/**
 * Get the correct image path for a project
 */
export function getProjectImage(slug: string, category: string): string {
  if (category === 'Websites') {
    return websiteImages[slug] || '/images/hero%20image.png'
  }
  
  return '/images/hero%20image.png'
}

/**
 * Get luxury grid class - Clean, sophisticated layout pattern
 */
export function getLuxuryGridClass(index: number): string {
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
  
  return websitePatterns[index % websitePatterns.length]
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
  }
  
  return false
}

/**
 * Get fallback image for missing projects with encoding
 */
export function getFallbackImage(): string {
  return '/images/hero%20image.png'
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