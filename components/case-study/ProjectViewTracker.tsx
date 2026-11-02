'use client'

import { useEffect } from 'react'
import { trackProjectView } from '../../lib/analytics'

// Sends one view_portfolio_project event per visit, the same event the legacy
// template sends, so every case study reports the same way in GA4.
export default function ProjectViewTracker({ slug, title, category }: { slug: string; title: string; category: string }) {
  useEffect(() => {
    trackProjectView(title, category, { project_slug: slug })
  }, [slug, title, category])

  return null
}
