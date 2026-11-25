'use client'

// "What I do" behaviour.
// Fill: while the sentence is held in view, its three phrases fill grey to ink one after another,
// scrubbed to the scroll position (no pin, no steps). Reduced motion: CSS shows them inked.
// Paths: pointing at or focusing a role inks its phrase. Picking a role (or a phrase) remembers it
// (path.ts), glides to the section that proves it, marks the role as current and that section's
// kicker as "Your pick". A choice made earlier in the visit is shown again on load.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Layer } from '../../../lib/directions/triage'
import { PATHS, choosePath, onPath, readPath } from './path'

export default function SkillsMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-skills]')
    if (!root) return
    const phrases = [...root.querySelectorAll<HTMLElement>('[data-phrase]')]
    const labels = [...root.querySelectorAll<HTMLAnchorElement>('[data-path-label]')]
    const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-path-link]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      phrases.forEach((p, i) => tl.fromTo(p, { '--fill': '0%' }, { '--fill': '100%', duration: 1 }, i * 1.1))
    })

    // Pointing at a role inks its phrase
    const hot = (n: number, on: boolean) => {
      const p = phrases[n - 1]
      if (p) { if (on) p.setAttribute('data-hot', ''); else p.removeAttribute('data-hot') }
    }
    const offs: (() => void)[] = []
    const on = (el: EventTarget, type: string, fn: EventListener) => { el.addEventListener(type, fn); offs.push(() => el.removeEventListener(type, fn)) }
    labels.forEach((a) => {
      const n = Number(a.dataset.pathLabel)
      on(a, 'pointerenter', () => hot(n, true))
      on(a, 'pointerleave', () => hot(n, false))
      on(a, 'focus', () => hot(n, true))
      on(a, 'blur', () => hot(n, false))
    })

    // Show a choice: the role current, its phrase inked, its section marked
    const show = (n: Layer) => {
      labels.forEach((a) => a.setAttribute('aria-current', String(Number(a.dataset.pathLabel) === n)))
      phrases.forEach((p, i) => { if (i + 1 === n) p.setAttribute('data-on', ''); else p.removeAttribute('data-on') })
      document.querySelectorAll<HTMLElement>('[data-pick-for]').forEach((el) => { el.hidden = Number(el.dataset.pickFor) !== n })
    }
    const saved = readPath()
    if (saved) show(saved)
    offs.push(onPath(show))

    // Picking: remember it and glide to its proof
    links.forEach((a) => on(a, 'click', (e) => {
      const n = Number(a.dataset.pathLink) as Layer
      const target = document.getElementById(PATHS[n - 1].target)
      choosePath(n)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      history.replaceState(null, '', `#${target.id}`)
    }))

    return () => { mm.revert(); offs.forEach((off) => off()) }
  }, [])

  return null
}
