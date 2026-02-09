import type { Metadata } from 'next'
import { generatePortfolioSchema, generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'Strategic Growth Portfolio | Measurable Results for Premium Brands',
  description: 'From luxury real estate commanding 340% traffic growth to lead generation systems achieving 28% conversion increases—complete growth ecosystems engineered for premium brands who refuse to compete on price.',
  keywords: [
    'strategic growth portfolio',
    'business outcomes case studies',
    'measurable growth results',
    'premium brand growth',
    'revenue systems portfolio',
    'conversion optimization results',
    'SEO authority case studies',
    'lead generation outcomes',
    'business growth examples',
    'strategic consulting portfolio',
    'premium brand transformations',
    'growth analytics results',
    'Ghana growth strategist portfolio',
    'West Africa business growth',
    'strategic partnership outcomes'
  ],
  openGraph: {
    title: 'Strategic Growth Portfolio | Measurable Results for Premium Brands',
    description: 'From luxury real estate commanding 340% traffic growth to lead generation systems achieving 28% conversion increases—complete growth ecosystems engineered for premium brands who refuse to compete on price.',
    url: 'https://jacquelineamoako.com/portfolio',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Strategic growth outcomes and business results portfolio',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strategic Growth Portfolio | Measurable Business Outcomes',
    description: '340% traffic growth, 28% conversion increases—complete growth ecosystems for premium brands. SEO authority, revenue systems, strategic positioning.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        alt: 'Strategic Growth Portfolio - Business Results',
        width: 3000,
        height: 1575,
      }
    ],
  },
  alternates: {
    canonical: 'https://jacquelineamoako.com/portfolio',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for portfolio
  const portfolioSchema = generatePortfolioSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://jacquelineamoako.com' },
    { name: 'Portfolio', url: 'https://jacquelineamoako.com/portfolio' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      {children}
    </>
  )
}