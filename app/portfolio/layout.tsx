import type { Metadata } from 'next'
import { generatePortfolioSchema, generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'Premium Design Portfolio | Luxury Web Development & Creative Services',
  description: 'Explore my portfolio of luxury websites, sophisticated e-commerce solutions, and premium brand designs. Each project represents the pinnacle of creative technology and bespoke digital experiences.',
  keywords: [
    'luxury portfolio',
    'premium web design portfolio',
    'high-end website examples',
    'luxury e-commerce portfolio',
    'sophisticated web development',
    'premium brand websites',
    'luxury creative portfolio',
    'high-end digital experiences',
    'bespoke web solutions showcase',
    'luxury website gallery',
    'premium React portfolio',
    'Next.js luxury projects',
    'Ghana luxury web developer',
    'West Africa premium design',
    'luxury brand case studies'
  ],
  openGraph: {
    title: 'Premium Design Portfolio | Luxury Web Development Showcase',
    description: 'Discover sophisticated websites and premium digital experiences crafted for discerning clients. View luxury e-commerce platforms, high-end brand websites, and bespoke creative solutions.',
    url: 'https://jacquelineamoako.com/portfolio',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/portfolio-cta.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Web Development Portfolio - Premium Digital Experiences',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Design Portfolio | Luxury Web Development Showcase',
    description: 'Sophisticated websites and premium digital experiences for discerning clients. Luxury e-commerce, high-end brands, bespoke solutions.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/portfolio-cta.jpg',
        alt: 'Luxury Web Development Portfolio',
        width: 1200,
        height: 630,
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