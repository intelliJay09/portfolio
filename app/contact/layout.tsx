import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'
import { PAGES, SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: PAGES.contact.title,
  description: PAGES.contact.description,
  openGraph: {
    title: `${PAGES.contact.title} | ${SITE.name}`,
    description: PAGES.contact.description,
    url: `${SITE.url}/contact`,
    type: 'website',
    images: [{ ...SITE.ogImage, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGES.contact.title} | ${SITE.name}`,
    description: PAGES.contact.description,
    images: [{ ...SITE.ogImage }],
  },
  alternates: {
    canonical: `${SITE.url}/contact`,
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