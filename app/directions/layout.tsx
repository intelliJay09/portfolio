import type { Metadata } from 'next'
import './directions.css'

// Three homepage directions for review. Not linked from the site and never indexed.
export const metadata: Metadata = {
  title: 'Homepage directions',
  robots: { index: false, follow: false },
}

export default function DirectionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
