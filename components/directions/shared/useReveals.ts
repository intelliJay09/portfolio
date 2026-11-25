'use client'

// The calm, shared motion vocabulary every direction uses outside its one signature moment:
//  - [data-lines]: each line rises from behind its mask once, on entering the viewport
//  - [data-clip]: an image (or a Recording) opens from an inset clip and settles from 1.12 to 1,
//    scrubbed as it arrives. One already in the first view opens once on load instead (its
//    scrub would already be over, so it would never move)
//  - [data-par="n"]: a light parallax, n percent of the element's height each way, scrubbed
// One easing family (expo out for entrances, none for scrubs). Under reduced motion nothing
// here runs and the server-rendered layout is the finished state.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useReveals(rootSelector: string) {
  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('[data-lines]').forEach((el) => {
        const inner = el.querySelectorAll('[data-line-inner]')
        gsap.from(inner, {
          yPercent: 108,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })
      root.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
        const img = el.firstElementChild
        const inFirstView = el.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.92
        const tl = inFirstView
          ? gsap.timeline({ delay: 0.15, defaults: { duration: 1.6, ease: 'expo.out' } })
          : gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 35%', scrub: true }, defaults: { ease: 'none' } })
        tl.fromTo(el, { clipPath: 'inset(9% 7% 9% 7%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
        if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1 }, 0)
      })
      root.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
        const n = Number(el.dataset.par) || 10
        gsap.fromTo(
          el,
          { yPercent: n },
          { yPercent: -n, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    })
    return () => mm.revert()
  }, [rootSelector])
}
