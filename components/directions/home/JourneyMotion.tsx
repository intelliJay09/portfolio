'use client'

// The journeys run. Each rail has a pulse that travels from its first step to its last as the rail
// scrolls through the middle of the screen (scrubbed, so it follows the scroll both ways). The line
// it leaves behind fills in, and each step lights as the pulse reaches it. When a journey has
// finished the pulse goes out and the rail stays lit.
// Reduced motion, or no script: nothing here runs, and the server-rendered rail is the finished state.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function JourneyMotion() {
  useEffect(() => {
    const rails = [...document.querySelectorAll<HTMLElement>('[data-journey-rail]')]
    if (!rails.length) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      rails.forEach((rail) => {
        const items = [...rail.querySelectorAll<HTMLElement>('li')]
        const dots = items.map((li) => li.querySelector<HTMLElement>('[data-dot]'))
        const last = items.length - 1
        let pts: [number, number][] = []

        // Where each step's dot sits inside the rail, whichever way the rail runs (across, or down on a phone)
        const measure = () => {
          const r = rail.getBoundingClientRect()
          pts = dots.map((d) => {
            const b = d!.getBoundingClientRect()
            return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2]
          })
        }

        const render = (p: number) => {
          if (pts.length !== items.length) measure()
          const seg = Math.min(Math.max(p, 0), 1) * last
          const i = Math.min(Math.floor(seg), last - 1)
          const t = seg - i
          const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t
          const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t
          rail.style.setProperty('--sx', `${pts[0][0]}px`)
          rail.style.setProperty('--sy', `${pts[0][1]}px`)
          rail.style.setProperty('--px', `${x}px`)
          rail.style.setProperty('--py', `${y}px`)
          // Out of sight before it starts and once it has finished; the rail stays lit
          rail.style.setProperty('--pulse', p > 0.001 && p < 0.999 ? '1' : '0')
          items.forEach((li, k) => li.toggleAttribute('data-lit', p > 0.001 && seg >= k - 0.001))
        }

        rail.setAttribute('data-run', '')
        measure()
        render(0)

        const state = { p: 0 }
        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: () => render(state.p),
          scrollTrigger: {
            trigger: rail,
            start: 'top 82%',
            end: 'top 36%',
            scrub: 0.5,
            onRefresh: () => { measure(); render(state.p) },
          },
        })
      })

      return () => {
        rails.forEach((rail) => {
          rail.removeAttribute('data-run')
          ;['--sx', '--sy', '--px', '--py', '--pulse'].forEach((v) => rail.style.removeProperty(v))
          rail.querySelectorAll('li').forEach((li) => li.removeAttribute('data-lit'))
        })
      }
    })

    return () => mm.revert()
  }, [])

  return null
}
