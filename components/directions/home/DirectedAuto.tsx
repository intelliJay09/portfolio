'use client'

// Plays a standalone directed recording while a good part of it is on screen, from the page's
// load event on (a recording in the first view never competes with the page's first paint).
// Reduced motion or Save-Data: it waits for the visitor (the toggle and the step marks still play it).

import { useEffect } from 'react'
import { attachDirected, prefersStill } from './direct'

export default function DirectedAuto({ within }: { within: string }) {
  useEffect(() => {
    const root = document.getElementById(within)?.querySelector<HTMLElement>('[data-directed]')
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = prefersStill()
    const c = attachDirected(root, reduce)
    const seen = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!still && !c.held()) c.play() } else c.video.pause()
    }, { threshold: 0.35 })
    const start = () => seen.observe(c.lens)
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => { window.removeEventListener('load', start); seen.disconnect(); c.destroy() }
  }, [within])

  return null
}
