import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '../../lib/schema-markup'

export const metadata: Metadata = {
  title: 'About Jacqueline Amoako | Luxury Web Developer & Creative Technologist',
  description: 'Meet Jacqueline Amoako, a luxury web developer and creative technologist from Accra, Ghana. Specializing in premium digital experiences for discerning brands worldwide, with expertise in sophisticated web development and bespoke creative solutions.',
  keywords: [
    'luxury web developer Ghana',
    'creative technologist Accra',
    'premium web developer West Africa',
    'high-end website designer',
    'luxury brand specialist',
    'bespoke digital solutions',
    'sophisticated web development',
    'premium e-commerce expert',
    'luxury creative professional',
    'high-end React developer',
    'Next.js luxury specialist',
    'Ghana creative technology',
    'West Africa premium design',
    'luxury digital consultant',
    'exclusive web services'
  ],
  openGraph: {
    title: 'About Jacqueline Amoako | Luxury Web Developer & Creative Technologist',
    description: 'Meet the creative mind behind sophisticated digital experiences. Specializing in luxury web development, premium brand websites, and bespoke creative technology solutions for discerning clients.',
    url: 'https://jacquelineamoako.com/about',
    type: 'profile',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/about-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Jacqueline Amoako - Luxury Web Developer & Creative Technologist',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Jacqueline Amoako | Luxury Web Developer & Creative Technologist',
    description: 'Meet the creative mind behind sophisticated digital experiences. Luxury web development and premium brand solutions.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/about-hero.jpg',
        alt: 'Jacqueline Amoako - Luxury Web Developer',
        width: 1200,
        height: 630,
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