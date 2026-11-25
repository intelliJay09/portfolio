'use client'

// The contact page's small behaviours outside the form: the title's lines rise once (the shared
// reveals), and a click on a direct route (email, LinkedIn) is sent to GA4 as contact_method_click,
// the event the old page sent.

import { useEffect } from 'react'
import { useReveals } from '../shared/useReveals'
import { trackContactMethod } from '../../../lib/analytics'

export default function ContactMotion() {
  useReveals('[data-contact]')

  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-contact] a[data-method]')]
    const onClick = (e: MouseEvent) => {
      const a = e.currentTarget as HTMLAnchorElement
      trackContactMethod(a.dataset.method ?? 'link', a.href.replace(/^mailto:/, ''))
    }
    links.forEach((a) => a.addEventListener('click', onClick))
    return () => links.forEach((a) => a.removeEventListener('click', onClick))
  }, [])

  return null
}
