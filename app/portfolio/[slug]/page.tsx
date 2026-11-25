import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Shell from '../../../components/directions/home/Shell'
import Study from '../../../components/directions/case/CaseStudyPage'
import { getCaseStudy } from '../../../lib/case-studies'

type Params = { params: Promise<{ slug: string }> }

// Every case study lives in lib/case-studies.ts. A slug without one is a 404.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}
  const url = `https://jacquelineamoako.com/portfolio/${slug}`
  // The deep studies have a made-to-size share card; the website studies share the site's own homepage
  const og = study.ogImage === study.cover.src
    ? { url: study.ogImage, width: study.cover.width, height: study.cover.height }
    : { url: study.ogImage, width: 1200, height: 630 }

  return {
    // The portfolio layout sets a plain title, which drops the root template, so the suffix is explicit
    title: { absolute: `${study.metaTitle} | Jacqueline Amoako` },
    description: study.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: study.metaTitle,
      description: study.metaDescription,
      url,
      type: 'article',
      images: [{ ...og, alt: `${study.title} case study` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.metaTitle,
      description: study.metaDescription,
      images: [study.ogImage],
    },
  }
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  // notFound() must run here on the server: called from a client component it renders Next's bare
  // error shell, which has no Trusted Types policy, and the CSP then crashes the page
  if (!study) notFound()
  return <Shell><Study study={study} /></Shell>
}
