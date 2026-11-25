'use client'

// Runs the About page (AboutPage).
// - The portrait (any screen, with motion): the window opens on arrival and she settles forward
//   out of the office behind her. Scrolling lowers the window's top edge while she stays, so her
//   head and shoulders come through it. With a fine pointer, she and the office shift at two
//   depths as the pointer moves over the opening. With reduced motion it stays the still photo.
// - The shared reveals: the title's lines rise, images open from an inset clip.
// - The teaching clip plays while it is on screen (never with reduced motion or Save-Data).
// - The career (desktop with motion): the lanes stay beside the list, and the role at the middle of
//   the screen lights its bar in signal, every role before it in ink, the ones still to come faint.
//   A cursor on the year axis moves to where that role ended, and the role's name sits under it.
//   Everywhere else the lanes are drawn complete above the list.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveals } from '../shared/useReveals'
import { prefersStill } from '../home/direct'
import { playWhileSeen } from '../shared/playWhileSeen'

const LIVE = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)'

export default function AboutMotion() {
  useReveals('[data-about]')

  // The portrait: she comes through the screen
  useEffect(() => {
    const fig = document.querySelector<HTMLElement>('[data-portrait]')
    const win = fig?.querySelector<HTMLElement>('[data-window]')
    const plate = fig?.querySelector<HTMLElement>('[data-plate]')
    const subject = fig?.querySelector<HTMLElement>('[data-subject]')
    const open = fig?.closest<HTMLElement>('header')
    if (!fig || !win || !plate || !subject || !open) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Room to move: the office is drawn larger than its window, and she slightly larger than the
      // frame, so no edge of either ever shows inside it
      gsap.set(plate, { scale: 1.1 })
      gsap.set(subject, { scale: 1.04 })

      // Arrival: the window opens from an inset, and she settles forward a beat later
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(fig, { clipPath: 'inset(12% 10% 12% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, clearProps: 'clipPath' }, 0.1)
        .fromTo(subject, { yPercent: 5, scale: 1.12 }, { yPercent: 0, scale: 1.04, duration: 1.9 }, 0.2)

      // Scrolling: the window's top edge comes down to a third of the frame, the office drifts
      // behind it, and she stays where she is. It ends while the frame's top is still just above
      // the screen, so her coming through is seen. clamp() starts it at the top of the page when
      // the portrait is already in the first view (desktop)
      const through = gsap.timeline({
        scrollTrigger: { trigger: fig, start: 'clamp(top 70%)', end: 'top -10%', scrub: true },
      })
        .fromTo(win, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(34% 0% 0% 0%)', ease: 'none' }, 0)
        .fromTo(plate, { yPercent: 0 }, { yPercent: 6, ease: 'none' }, 0)

      // Pointer: the office moves against the pointer, she moves with it, so they sit at two depths
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const to = fine ? {
        px: gsap.quickTo(plate, 'x', { duration: 1.4, ease: 'power3' }),
        py: gsap.quickTo(plate, 'y', { duration: 1.4, ease: 'power3' }),
        sx: gsap.quickTo(subject, 'x', { duration: 1.1, ease: 'power3' }),
        sy: gsap.quickTo(subject, 'y', { duration: 1.1, ease: 'power3' }),
      } : null
      const move = (e: PointerEvent) => {
        if (!to) return
        const r = fig.getBoundingClientRect()
        const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2))
        const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2))
        to.px(-nx * 14); to.py(-ny * 10); to.sx(nx * 9); to.sy(ny * 6)
      }
      const rest = () => { if (to) { to.px(0); to.py(0); to.sx(0); to.sy(0) } }
      if (to) {
        open.addEventListener('pointermove', move)
        open.addEventListener('pointerleave', rest)
      }
      return () => {
        through.scrollTrigger?.kill()
        open.removeEventListener('pointermove', move)
        open.removeEventListener('pointerleave', rest)
      }
    })
    return () => mm.revert()
  }, [])

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-about]')
    if (!root) return
    const still = prefersStill()

    const stopVideos = playWhileSeen([...root.querySelectorAll<HTMLVideoElement>('video[data-auto]')], still)

    const career = root.querySelector<HTMLElement>('[data-career]')
    const chart = career?.querySelector<HTMLElement>('[data-chart]')
    const name = career?.querySelector<HTMLElement>('[data-now]')
    const roles = [...(career?.querySelectorAll<HTMLElement>('[data-role]') ?? [])]
    const bars = [...(career?.querySelectorAll<HTMLElement>('[data-bar]') ?? [])]
    let active = -1

    const show = (i: number) => {
      if (i === active || !chart) return
      active = i
      bars.forEach((b) => {
        const k = Number(b.dataset.bar)
        b.toggleAttribute('data-on', k === i)
        b.toggleAttribute('data-past', k < i)
      })
      roles.forEach((r, k) => r.toggleAttribute('data-on', k === i))
      chart.style.setProperty('--at', roles[i].dataset.at ?? '0%')
      if (name) name.textContent = roles[i].querySelector('h3')?.textContent ?? ''
    }

    let watch: IntersectionObserver | null = null
    const start = () => {
      if (!career || !chart) return
      career.setAttribute('data-live', '')
      show(0)
      // The role crossing the middle of the screen is the one on show
      watch = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) show(Number((target as HTMLElement).dataset.role))
        })
      }, { rootMargin: '-50% 0px -50% 0px' })
      roles.forEach((r) => watch!.observe(r))
    }
    const stop = () => {
      watch?.disconnect()
      watch = null
      active = -1
      career?.removeAttribute('data-live')
      bars.forEach((b) => { b.removeAttribute('data-on'); b.removeAttribute('data-past') })
      roles.forEach((r) => r.removeAttribute('data-on'))
      chart?.style.removeProperty('--at')
    }

    const mq = window.matchMedia(LIVE)
    const apply = () => (mq.matches ? start() : stop())
    apply()
    mq.addEventListener('change', apply)

    return () => {
      mq.removeEventListener('change', apply)
      stop()
      stopVideos()
    }
  }, [])

  return null
}
