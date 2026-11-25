// Any address that isn't a page. Next returns 404 and adds noindex itself.

import type { Metadata } from 'next'
import Shell from '../components/directions/home/Shell'
import NotFoundPage from '../components/directions/notfound/NotFoundPage'

// The root layout's title template doesn't reach the root 404, so the title is whole; and robots
// is set here so the layout's "index, follow" isn't left beside Next's own noindex
export const metadata: Metadata = {
  title: { absolute: 'Page not found | Jacqueline Amoako' },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Shell>
      <NotFoundPage />
    </Shell>
  )
}
