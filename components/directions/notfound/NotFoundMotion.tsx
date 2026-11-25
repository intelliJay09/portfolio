'use client'

// The 404 arriving: the title's lines rise (the shared reveal), and the word "missing" is missing
// until the field's empty square is outlined, when it arrives. Reduced motion, or no script: the headline is whole.

import { useEffect } from 'react'
import gsap from 'gsap'
import { useReveals } from '../shared/useReveals'

export default function NotFoundMotion() {
  useReveals('[data-notfound]')

  useEffect(() => {
    const word = document.querySelector<HTMLElement>('[data-notfound] [data-missing]')
    if (!word) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Lands with the orange outline at the end of the field's arrival (MissingField, ARRIVAL)
      gsap.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out', delay: 1.5 })
    })
    return () => mm.revert()
  }, [])

  return null
}
