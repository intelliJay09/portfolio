import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'Contact Jacqueline Amoako | Luxury Web Development Services',
  description: 'Ready to elevate your brand with sophisticated web development? Contact Jacqueline Amoako for premium digital solutions, luxury e-commerce platforms, and bespoke creative technology services.',
  keywords: [
    'luxury web development contact',
    'premium website design consultation',
    'high-end web developer hire',
    'luxury e-commerce consultation',
    'bespoke digital solutions inquiry',
    'premium brand website contact',
    'sophisticated web development services',
    'luxury creative technology consultation',
    'Ghana web developer contact',
    'West Africa premium design services',
    'high-end React developer hire',
    'luxury Next.js development contact',
    'premium SEO services consultation',
    'exclusive web services inquiry'
  ],
  openGraph: {
    title: 'Contact Jacqueline Amoako | Luxury Web Development Services',
    description: 'Ready to transform your brand with sophisticated digital experiences? Get in touch for luxury web development, premium e-commerce solutions, and bespoke creative services.',
    url: 'https://jacquelineamoako.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/contact-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Jacqueline Amoako - Luxury Web Development Services',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Jacqueline Amoako | Luxury Web Development Services',
    description: 'Transform your brand with sophisticated digital experiences. Luxury web development and premium creative services.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/contact-image.jpg',
        alt: 'Contact - Luxury Web Development Services',
        width: 1200,
        height: 630,
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