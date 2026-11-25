// The page shell every inner page of the redesign shares: the two families, the theme's ground,
// the skip link, the header and the footer. The homepage composes its own, around its opening scene.
// `zone` is how much scroll the header stays transparent for; inner pages have no opening scene,
// so their header takes its backdrop as soon as the page starts to move, and it opens on paper.

import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import { sans, mono } from './fonts'
import theme from './theme.module.css'
import '../../../app/directions/directions.css'

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div data-direction="portfolio" className={`${sans.variable} ${mono.variable} ${theme.theme}`}>
      <a href="#main" className={theme.skip}>Skip to content</a>
      <SiteNav zone={0.1} ground="paper" />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  )
}
