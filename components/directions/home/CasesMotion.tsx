'use client'

// "Fix what breaks", in the headlines. One word of each incident's headline starts broken the way
// the incident was, and settles as the headline reaches the middle of the screen (scrubbed, so it
// follows the scroll both ways):
//   gone   the word is missing: the people who paid heard nothing
//   drift  the word has landed in the wrong place: a payment credited to the wrong event
//   jam    the word is stopped, smeared and slanted: the outage that froze every follow-up
// Reduced motion, or no script: nothing here runs, and the headlines are whole.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function CasesMotion() {
  useEffect(() => {
    const words = [...document.querySelectorAll<HTMLElement>('[data-break]')]
    if (!words.length) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      words.forEach((word) => {
        // Offsets are in em of the headline, read as px at refresh so they follow the type size
        const em = () => parseFloat(getComputedStyle(word).fontSize)
        const kind = word.dataset.break
        const [from, to] =
          kind === 'gone'
            ? [{ opacity: 0 }, { opacity: 1 }]
            : kind === 'drift'
              ? [
                  { x: () => em() * 0.6, y: () => em() * 0.85, rotate: 9, transformOrigin: '0% 100%' },
                  { x: 0, y: 0, rotate: 0 },
                ]
              : [
                  { x: () => -em() * 0.14, skewX: -18, opacity: 0.35, filter: 'blur(6px)' },
                  { x: 0, skewX: 0, opacity: 1, filter: 'blur(0px)' },
                ]
        gsap.fromTo(word, from, {
          ...to,
          ease: 'none',
          scrollTrigger: {
            trigger: word.closest('summary') ?? word,
            start: 'top 90%',
            end: 'top 52%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return null
}
