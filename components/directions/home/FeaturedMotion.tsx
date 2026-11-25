'use client'

// Drives Featured work. Each piece's recording is a directed recording (direct.ts).
// Desktop with motion: turns the list into the stage (data-live) and scrubs the hand-over from
// piece to piece across the track: the incoming name comes up to full strength as the outgoing one sits back,
// the screen wipes up to the new recording, and the player and details cross-fade. Only the
// piece on stage plays, and all three load as the section nears so a hand-over never waits.
// A name jumps to its piece.
// Below 1024px or with reduced motion: the list stays a list, and each recording plays while it
// is seen (with reduced motion or Save-Data, only when the visitor plays it).

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachDirected, prefersStill } from './direct'

// Below 1024px the list serves better: each recording gets the full width
const STAGE = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)'
// Where in the track each hand-over runs (0 to 1). A name's jump lands where its piece settles.
const HANDOVER: [number, number][] = [[0.3, 0.5], [0.8, 1]]
// The names off stage sit back at this strength. The hand-over cross-fades them; the ink sweep
// is kept for "What I do", so it appears once on the page.
const NAME_OFF = 0.18

export default function FeaturedMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-featured]')
    const track = root?.querySelector<HTMLElement>('[data-featured-track]')
    if (!root || !track) return
    const q = <T extends Element>(sel: string) => [...root.querySelectorAll<T>(sel)]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = prefersStill()

    const pieces = q<HTMLElement>('[data-directed]').map((el) => attachDirected(el, reduce))
    const names = q<HTMLAnchorElement>('[data-piece-name]')
    let staged = false
    let active = 0
    let near = false

    const sync = () => {
      if (!staged) return
      pieces.forEach((c, i) => {
        if (near && i === active) { if (!still && !c.held()) c.play() } else c.video.pause()
      })
    }

    // List mode: each recording plays while a good part of it is on screen (the lens is watched,
    // not the video, which the camera scales past it)
    const lenses = pieces.map((c) => c.lens)
    const seen = new IntersectionObserver((entries) => {
      if (staged) return
      entries.forEach(({ target, isIntersecting }) => {
        const c = pieces[lenses.indexOf(target as HTMLElement)]
        if (isIntersecting) { if (!still && !c.held()) c.play() } else c.video.pause()
      })
    }, { threshold: 0.35 })
    lenses.forEach((l) => seen.observe(l))

    const onScreen = new IntersectionObserver(([e]) => {
      near = e.isIntersecting
      if (near && staged && !still) pieces.forEach((c) => c.load())
      sync()
    })
    onScreen.observe(track)

    // In stage mode a name scrolls the track to where its piece is settled
    const jump = (e: MouseEvent) => {
      if (!staged) return
      e.preventDefault()
      const i = Number((e.currentTarget as HTMLElement).dataset.pieceName)
      const top = track.getBoundingClientRect().top + window.scrollY
      const span = track.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + span * (i === 0 ? 0 : HANDOVER[i - 1][1]), behavior: 'smooth' })
    }
    names.forEach((a) => a.addEventListener('click', jump))

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add(STAGE, () => {
      staged = true
      root.setAttribute('data-live', '')
      const players = q<HTMLElement>('[data-player]')
      const bodies = q<HTMLElement>('[data-piece-body]')
      gsap.set(names.slice(1), { opacity: NAME_OFF })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: ({ progress }) => {
            const next = progress < 0.4 ? 0 : progress < 0.9 ? 1 : 2
            if (next !== active) { active = next; sync() }
          },
        },
      })
      HANDOVER.forEach(([from, to], k) => {
        const d = to - from, i = k + 1
        tl.fromTo(lenses[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: 'power2.inOut' }, from)
          .fromTo(names[i], { opacity: NAME_OFF }, { opacity: 1, duration: d }, from)
          .to(names[k], { opacity: NAME_OFF, duration: d }, from)
          .to([bodies[k], players[k]], { autoAlpha: 0, duration: d * 0.4 }, from)
          .fromTo([bodies[i], players[i]], { autoAlpha: 0 }, { autoAlpha: 1, duration: d * 0.5 }, from + d * 0.5)
      })
      ScrollTrigger.refresh()
      sync()

      return () => {
        staged = false
        root.removeAttribute('data-live')
        gsap.set([...lenses, ...players, ...bodies, ...names], { clearProps: 'all' })
        pieces.forEach((c) => c.video.pause())
      }
    })

    return () => {
      mm.revert()
      seen.disconnect()
      onScreen.disconnect()
      names.forEach((a) => a.removeEventListener('click', jump))
      pieces.forEach((c) => c.destroy())
    }
  }, [])

  return null
}
