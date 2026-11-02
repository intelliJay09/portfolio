import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudy from '../../../components/case-study/CaseStudy'
import LegacyCaseStudy from '../../../components/case-study/LegacyCaseStudy'
import { getCaseStudy } from '../../../lib/case-studies'
import content from '../../../content.json'

type Params = { params: Promise<{ slug: string }> }

// content.json is the one source keyed by slug; only projects flagged caseStudy have a page
const getLegacyProject = (slug: string) =>
  content.portfolio.projects.find((p) => p.slug === slug && 'caseStudy' in p && p.caseStudy)

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  const url = `https://jacquelineamoako.com/portfolio/${slug}`

  if (study) {
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
        images: [{ url: study.ogImage, width: 1200, height: 630, alt: `${study.title} case study` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: study.metaTitle,
        description: study.metaDescription,
        images: [study.ogImage],
      },
    }
  }

  const project = getLegacyProject(slug)
  return project
    ? { title: { absolute: `${project.title} | Jacqueline Amoako` }, alternates: { canonical: url } }
    : {}
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (study) return <CaseStudy study={study} />
  // notFound() must run here on the server: called from the client component it renders
  // Next's bare error shell, which has no Trusted Types policy, and the CSP then crashes the page
  if (!getLegacyProject(slug)) notFound()
  return <LegacyCaseStudy />
}
