import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'Partner With Jacqueline | Strategic Growth Consultation',
  description: 'Ready to architect a complete growth ecosystem for your premium brand? From SEO authority to revenue systems—let\'s engineer measurable business outcomes that compound month over month.',
  keywords: [
    'strategic growth consultation',
    'business growth partnership',
    'premium brand growth strategy',
    'conversion optimization consultation',
    'SEO authority consulting',
    'revenue systems strategy',
    'premium lead generation consultation',
    'strategic business partnership',
    'Ghana growth strategist contact',
    'West Africa business consulting',
    'strategic growth services inquiry',
    'premium brand consulting',
    'measurable outcomes partnership',
    'growth ecosystem consultation'
  ],
  openGraph: {
    title: 'Partner With Jacqueline | Strategic Growth Consultation',
    description: 'Ready to architect a complete growth ecosystem for your premium brand? From SEO authority to revenue systems—let\'s engineer measurable business outcomes that compound month over month.',
    url: 'https://jacquelineamoako.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Strategic partnership consultation for premium brand growth',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner With Jacqueline | Strategic Growth Partnership',
    description: 'Architect complete growth ecosystems for your premium brand. SEO authority, revenue systems, measurable outcomes.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        alt: 'Strategic Growth Consultation',
        width: 3000,
        height: 1575,
      }
    ],
  },
  alternates: {
    canonical: 'https://jacquelineamoako.com/contact',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://jacquelineamoako.com' },
    { name: 'Contact', url: 'https://jacquelineamoako.com/contact' }
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