'use client'

// Runs a case study (CaseStudyPage).
// - The shared reveals: images open from an inset clip as they arrive.
// - The recording at the top is a directed recording, run by DirectedAuto beside it.
// - The journey (desktop with motion): turns it live, scrubs the pulse down the rail, lights each
//   stage as the pulse reaches it, and wipes the stage beside the rail to that stage's emails, one
//   at a time as you scroll through the stage.
//   Everywhere else the journey stays a list, each stage with its emails under it.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveals } from '../shared/useReveals'

const LIVE = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)'

export default function CaseMotion() {
  useReveals('[data-case]')

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-case]')
    if (!root) return

    const journey = root.querySelector<HTMLElement>('[data-journey]')
    const rail = journey?.querySelector<HTMLElement>('[data-stages]')
    const fill = journey?.querySelector<HTMLElement>('[data-fill]')
    const stages = [...(journey?.querySelectorAll<HTMLElement>('[data-stage]') ?? [])]
    const slides = new Map([...(journey?.querySelectorAll<HTMLElement>('[data-slide]') ?? [])].map((el) => [el.dataset.slide!, el]))
    let active = ''

    // Show email j of stage i beside the rail, and light every stage up to i
    const show = (i: number, j: number) => {
      const key = `${i}-${j}`
      if (key === active) return
      const prev = slides.get(active)
      slides.forEach((el) => { el.removeAttribute('data-on'); el.removeAttribute('data-prev') })
      prev?.setAttribute('data-prev', '')
      slides.get(key)?.setAttribute('data-on', '')
      stages.forEach((st, k) => st.toggleAttribute('data-lit', k <= i))
      active = key
    }

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    if (journey && rail && fill) {
      mm.add(LIVE, () => {
        journey.setAttribute('data-live', '')
        // The stage at the middle of the screen is on show; scrolling through it steps through its
        // emails, one per equal share of its height
        const pick = (i: number, count: number, progress: number) => show(i, Math.min(count - 1, Math.floor(progress * count)))
        const triggers = stages.map((st, i) => {
          const count = Number(st.dataset.emails) || 1
          return ScrollTrigger.create({
            trigger: st, start: 'top 50%', end: 'bottom 50%',
            onUpdate: ({ progress }) => pick(i, count, progress),
            onToggle: ({ isActive, progress }) => { if (isActive) pick(i, count, progress) },
          })
        })
        show(0, 0)
        // The pulse runs down the rail with the reader
        const tween = gsap.fromTo(fill, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: rail, start: 'top 50%', end: 'bottom 50%', scrub: 0.4 },
        })
        ScrollTrigger.refresh()
        return () => {
          triggers.forEach((t) => t.kill())
          tween.scrollTrigger?.kill()
          tween.kill()
          journey.removeAttribute('data-live')
          stages.forEach((st) => st.removeAttribute('data-lit'))
          slides.forEach((el) => { el.removeAttribute('data-on'); el.removeAttribute('data-prev') })
          gsap.set(fill, { clearProps: 'all' })
          active = ''
        }
      })
    }

    return () => {
      mm.revert()
    }
  }, [])

  return null
}
