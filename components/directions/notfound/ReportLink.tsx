'use client'

// "Tell me where you found the link": opens Contact with the broken address already written in,
// so the visitor only adds where the link was. The address is read in the browser (a 404 page
// gets no props, and Next's docs point path-dependent content to the client).

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '../../../lib/site'
import Arrow from '../shared/Arrow'

const HOST = new URL(SITE.url).host

export default function ReportLink({ className }: { className?: string }) {
  const path = usePathname()
  const message = `The link to ${HOST}${path} goes to a missing page. I found the link on: `
  return (
    <Link href={{ pathname: '/contact', query: { about: 'other', message } }} className={className}>
      Tell me where you found the link<Arrow />
    </Link>
  )
}
