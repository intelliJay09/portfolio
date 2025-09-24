import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jacquelineamoako.com'
  const currentDate = new Date()
  
  // Static pages with high priority for luxury positioning
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0, // Highest priority for homepage
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9, // High priority for about page
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // High priority for portfolio overview
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8, // Important for lead generation
    },
  ]

  // Portfolio project pages - dynamic generation (matches content.json slugs)
  const portfolioProjects = [
    'lovel-ai',
    'anabs',
    'eleven-eleven-ghana',
    'gwen-addo',
    'optimum-property-solutions',
    'emmanuel-kotia',
    'imagebloom-by-saida',
    'rosemond-prempeh',
    'royal-itech',
    'girl-code-africa',
    'goa-conference',
    'eden-heights',
    'landmark-homes',
    'ghana-optometric-association',
    'twist-nightclub',
    'command-space',
    'qualivex-solutions'
  ]

  const portfolioPages = portfolioProjects.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7, // Good priority for individual project pages
  }))

  // Combine all pages
  return [...staticPages, ...portfolioPages]
}

// Generate a separate portfolio sitemap for better organization
export function generatePortfolioSitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jacquelineamoako.com'
  const currentDate = new Date()

  // All portfolio projects with detailed categorization (matches content.json slugs)
  const webProjects = [
    { slug: 'lovel-ai', priority: 0.8, category: 'AI/Technology' },
    { slug: 'anabs', priority: 0.9, category: 'Luxury Real Estate' },
    { slug: 'eleven-eleven-ghana', priority: 0.9, category: 'Luxury Hospitality' },
    { slug: 'gwen-addo', priority: 0.8, category: 'Professional Services' },
    { slug: 'optimum-property-solutions', priority: 0.8, category: 'Real Estate' },
    { slug: 'emmanuel-kotia', priority: 0.7, category: 'Academic/Professional' },
    { slug: 'imagebloom-by-saida', priority: 0.7, category: 'Beauty/E-commerce' },
    { slug: 'rosemond-prempeh', priority: 0.7, category: 'Ministry/Community' },
    { slug: 'royal-itech', priority: 0.8, category: 'Technology/Security' },
    { slug: 'girl-code-africa', priority: 0.8, category: 'Education/Tech' },
    { slug: 'goa-conference', priority: 0.6, category: 'Events/Professional' },
    { slug: 'eden-heights', priority: 0.8, category: 'Luxury Real Estate' },
    { slug: 'landmark-homes', priority: 0.8, category: 'Luxury Real Estate' },
    { slug: 'ghana-optometric-association', priority: 0.7, category: 'Professional Association' },
    { slug: 'twist-nightclub', priority: 0.6, category: 'Entertainment' },
    { slug: 'command-space', priority: 0.7, category: 'Marketing Agency' },
    { slug: 'qualivex-solutions', priority: 0.7, category: 'Business Solutions' }
  ]

  const graphicDesignProjects = [
    { slug: 'vwear-coming-soon', priority: 0.5, category: 'Fashion Branding' },
    { slug: 'allure-bloom-pricelist', priority: 0.4, category: 'Beauty Services' },
    { slug: 'allure-bloom-training-flyer', priority: 0.4, category: 'Beauty Services' },
    { slug: 'braids-and-beyond-2', priority: 0.4, category: 'Hair Styling' },
    { slug: 'vwear-logo-black', priority: 0.5, category: 'Fashion Branding' },
    { slug: 'ab-beauty-supply', priority: 0.4, category: 'Beauty Retail' },
    { slug: 'allure-bloom-brand', priority: 0.4, category: 'Beauty Services' },
    { slug: 'leejay-looks-brand', priority: 0.4, category: 'Beauty Services' },
    { slug: 'mavis-nails-logo', priority: 0.4, category: 'Beauty Services' },
    { slug: 'tda-luxe-logo', priority: 0.5, category: 'Luxury Branding' },
    { slug: 'kloves-advisor-hotels', priority: 0.4, category: 'Hospitality' },
    { slug: 'braids-and-beyond', priority: 0.4, category: 'Hair Styling' }
  ]

  const allProjects = [...webProjects, ...graphicDesignProjects]

  return allProjects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: project.priority,
  }))
}