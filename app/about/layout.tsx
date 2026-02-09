import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'About Jacqueline | Strategic Growth Partner for Premium Brands',
  description: 'Digital Growth Strategist with 5+ years architecting complete growth ecosystems—SEO authority platforms, conversion engines, revenue systems. Working with luxury brands from Ghana to global markets.',
  keywords: [
    'digital growth strategist Ghana',
    'strategic growth consultant Accra',
    'business growth architect West Africa',
    'conversion optimization specialist',
    'SEO authority strategist',
    'premium brand growth expert',
    'revenue systems architect',
    'strategic business consultant',
    'growth analytics expert',
    'market authority strategist',
    'premium lead generation specialist',
    'Ghana strategic consulting',
    'West Africa business growth',
    'strategic partnership consultant',
    'measurable business outcomes'
  ],
  openGraph: {
    title: 'About Jacqueline | Strategic Growth Partner for Premium Brands',
    description: 'Digital Growth Strategist with 5+ years architecting complete growth ecosystems—SEO authority platforms, conversion engines, revenue systems. Working with luxury brands from Ghana to global markets.',
    url: 'https://jacquelineamoako.com/about',
    type: 'profile',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Jacqueline Amoako - Digital Growth Strategist and Systems Architect',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Jacqueline | Digital Growth Strategist & Systems Architect',
    description: 'Architecting complete growth ecosystems for premium brands—from SEO authority to revenue systems. 340% traffic growth, 28% conversion increases.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        alt: 'Digital Growth Strategist building revenue ecosystems',
        width: 3000,
        height: 1575,
      }
    ],
  },
  alternates: {
    canonical: 'https://jacquelineamoako.com/about',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://jacquelineamoako.com' },
    { name: 'About', url: 'https://jacquelineamoako.com/about' }
  ])

  return (
    <>
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