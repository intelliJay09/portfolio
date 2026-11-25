'use client'

// Motion for direction A outside the canvas: the hero text leaves as the dive begins and the
// one-line summary arrives in the middle of it; everything else uses the shared reveals.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveals } from '../shared/useReveals'

export default function MosaicMotion() {
  useReveals('[data-direction="mosaic"]')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: true },
      })
      tl.to('[data-hero-text]', { autoAlpha: 0, y: -40, ease: 'none', duration: 0.22 }, 0.03)
        .to('[data-hero-hint]', { autoAlpha: 0, ease: 'none', duration: 0.08 }, 0)
        .fromTo('[data-hero-statement]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.2 }, 0.56)
        .to({}, { duration: 0.22 })
    })
    return () => mm.revert()
  }, [])

  return null
}
