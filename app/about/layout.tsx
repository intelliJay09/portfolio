import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'
import { PAGES, SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: PAGES.about.title,
  description: PAGES.about.description,
  openGraph: {
    title: `${PAGES.about.title} | ${SITE.name}`,
    description: PAGES.about.description,
    url: `${SITE.url}/about`,
    type: 'profile',
    images: [{ ...SITE.ogImage, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGES.about.title} | ${SITE.name}`,
    description: PAGES.about.description,
    images: [{ ...SITE.ogImage }],
  },
  alternates: {
    canonical: `${SITE.url}/about`,
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