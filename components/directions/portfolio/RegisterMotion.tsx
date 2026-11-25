'use client'

// Runs the portfolio register (Register.tsx).
// The sentence: picking a phrase sets data-lens on the root (the CSS drains the other phrases and
// shows each piece's matching media and caption), folds away the pieces that don't prove it and
// makes them inert, and says how many are left. The pick is remembered for the visit (path.ts),
// so "Say hello" carries it as the email subject. Picking it again, or "Show everything", undoes it.
// Desktop with motion: the stage beside the list shows the piece crossing the middle of the
// screen, or the one pointed at or focused, and only its recording plays, from the moment its
// wipe ends (starting a video mid-wipe costs a frame, measured: one dropped frame at every switch).
// Everywhere else: each recording in the list plays while it is on screen. With reduced motion
// or Save-Data, recordings stay on their poster.

import { useEffect } from 'react'
import gsap from 'gsap'
import type { Layer } from '../../../lib/directions/triage'
import { choosePath } from '../home/path'
import { prefersStill } from '../home/direct'

const STAGE = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)'
const PARTS: Record<Layer, string> = { 1: 'what I’ve built', 2: 'the journeys I run', 3: 'what I’ve fixed' }

export default function RegisterMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-register]')
    if (!root) return
    const q = <T extends Element>(sel: string) => [...root.querySelectorAll<T>(sel)]
    const phrases = q<HTMLButtonElement>('[data-pick]')
    const clear = root.querySelector<HTMLButtonElement>('[data-clear]')
    const status = root.querySelector<HTMLElement>('[data-status]')
    const rows = q<HTMLElement>('[data-piece]')
    const slides = new Map(q<HTMLElement>('[data-slide]').map((el) => [el.dataset.slide!, el]))
    const still = prefersStill()
    const shown = (v: HTMLVideoElement) => v.offsetParent !== null || v.getClientRects().length > 0

    let lens: Layer | null = null
    let staged = false
    let active: string | null = null
    // The slide whose wipe is still running: its recording waits for the wipe to end
    let wiping: HTMLElement | null = null
    const inView = new Set<HTMLVideoElement>()

    // Exactly the recordings that should be moving are playing: on the stage, the visible one in
    // the active slide; in the list, the visible ones on screen
    const sync = () => {
      q<HTMLVideoElement>('[data-video]').forEach((v) => {
        const onStage = !!v.closest('[data-slide]')
        const want = !still && shown(v) && (staged
          ? onStage && v.closest('[data-slide]') === slides.get(active ?? '') && slides.get(active ?? '') !== wiping
          : !onStage && inView.has(v))
        if (want) { if (v.paused) v.play().catch(() => {}) } else if (!v.paused) v.pause()
      })
    }

    const setActive = (slug: string | null) => {
      if (!staged || !slug || slug === active) return
      if (rows.find((r) => r.dataset.piece === slug)?.hasAttribute('data-out')) return
      const prev = active ? slides.get(active) : undefined
      slides.forEach((el) => { el.removeAttribute('data-on'); el.removeAttribute('data-prev') })
      prev?.setAttribute('data-prev', '')
      slides.get(slug)?.setAttribute('data-on', '')
      wiping = slides.get(slug) ?? null
      rows.forEach((r) => r.toggleAttribute('data-active', r.dataset.piece === slug))
      active = slug
      sync()
    }

    const visibleRows = () => rows.filter((r) => !r.hasAttribute('data-out'))

    const pick = (n: Layer | null) => {
      lens = n
      if (n) root.dataset.lens = String(n)
      else delete root.dataset.lens
      phrases.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.pick) === n)))
      rows.forEach((r) => {
        const out = n !== null && !r.dataset.lenses!.split(' ').includes(String(n))
        r.toggleAttribute('data-out', out)
        r.toggleAttribute('inert', out)
      })
      const left = visibleRows().length
      if (status) {
        status.textContent = n
          ? `Showing ${left} of ${rows.length}: ${PARTS[n]}.`
          : `${rows.length} pieces of work. Pick a part of the sentence to see just that work.`
      }
      if (clear) clear.hidden = n === null
      if (n) choosePath(n)
      // The stage moves to the first piece still listed if the one it showed has folded away
      if (staged && (!active || rows.find((r) => r.dataset.piece === active)?.hasAttribute('data-out'))) {
        active = null
        setActive(visibleRows()[0]?.dataset.piece ?? null)
      }
      sync()
    }

    const onPhrase = (e: Event) => {
      const n = Number((e.currentTarget as HTMLElement).dataset.pick) as Layer
      pick(lens === n ? null : n)
    }
    const onClear = () => {
      pick(null)
      phrases[0]?.focus()
    }
    phrases.forEach((b) => b.addEventListener('click', onPhrase))
    clear?.addEventListener('click', onClear)
    pick(null)

    // List mode: a recording plays while a good part of it is on screen
    const seen = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const v = target as HTMLVideoElement
        if (isIntersecting) inView.add(v)
        else inView.delete(v)
      })
      if (!staged) sync()
    }, { threshold: 0.35 })
    q<HTMLVideoElement>('[data-video]').filter((v) => !v.closest('[data-slide]')).forEach((v) => seen.observe(v))

    // Live mode: the piece crossing the middle of the screen is the one on the stage
    const middle = new IntersectionObserver((entries) => {
      const hit = entries.find((e) => e.isIntersecting)
      if (hit) setActive((hit.target as HTMLElement).dataset.piece ?? null)
    }, { rootMargin: '-50% 0px -50% 0px' })
    const onPoint = (e: Event) => setActive((e.currentTarget as HTMLElement).dataset.piece ?? null)
    const onWiped = (e: AnimationEvent) => {
      if (e.target !== e.currentTarget || e.currentTarget !== wiping) return
      wiping = null
      sync()
    }
    slides.forEach((el) => el.addEventListener('animationend', onWiped))

    const mm = gsap.matchMedia()
    mm.add(STAGE, () => {
      staged = true
      root.setAttribute('data-live', '')
      rows.forEach((r) => {
        middle.observe(r)
        r.addEventListener('pointerenter', onPoint)
        r.addEventListener('focusin', onPoint)
      })
      setActive(visibleRows()[0]?.dataset.piece ?? null)
      sync()
      return () => {
        staged = false
        active = null
        root.removeAttribute('data-live')
        middle.disconnect()
        rows.forEach((r) => {
          r.removeAttribute('data-active')
          r.removeEventListener('pointerenter', onPoint)
          r.removeEventListener('focusin', onPoint)
        })
        slides.forEach((el) => { el.removeAttribute('data-on'); el.removeAttribute('data-prev') })
        wiping = null
        sync()
      }
    })

    return () => {
      mm.revert()
      seen.disconnect()
      middle.disconnect()
      phrases.forEach((b) => b.removeEventListener('click', onPhrase))
      clear?.removeEventListener('click', onClear)
      slides.forEach((el) => el.removeEventListener('animationend', onWiped))
    }
  }, [])

  return null
}
