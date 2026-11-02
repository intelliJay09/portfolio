import type { Metadata } from 'next'
import { generatePortfolioSchema, generateBreadcrumbSchema } from '../../lib/schema-markup'
import { PAGES, SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: PAGES.portfolio.title,
  description: PAGES.portfolio.description,
  openGraph: {
    title: `${PAGES.portfolio.title} | ${SITE.name}`,
    description: PAGES.portfolio.description,
    url: `${SITE.url}/portfolio`,
    type: 'website',
    images: [{ ...SITE.ogImage, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGES.portfolio.title} | ${SITE.name}`,
    description: PAGES.portfolio.description,
    images: [{ ...SITE.ogImage }],
  },
  alternates: {
    canonical: `${SITE.url}/portfolio`,
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