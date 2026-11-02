import { MetadataRoute } from 'next'
import content from '../content.json'

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

  // Case study pages: content.json is the one source, only projects flagged caseStudy have a page
  const portfolioProjects = content.portfolio.projects
    .filter((p) => 'caseStudy' in p && p.caseStudy)
    .map((p) => p.slug)

  const portfolioPages = portfolioProjects.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7, // Good priority for individual project pages
  }))

  // Combine all pages
  return [...staticPages, ...portfolioPages]
}

