'use client'

// Direction C: her cursor works in the page while the visitor scrolls. The visitor holds the
// timeline (every step is scrubbed by scroll, so nothing makes anyone wait); she does the
// work: opens Finest Dietitian's live site and scrolls it, books a consultation, the real
// confirmation and follow-up emails arrive, then she finds and fixes eleven missed emails.
//
// The cursor is decorative (aria-hidden) and never replaces the visitor's own pointer.
// Every caption and figure is in the server-rendered HTML; under reduced motion the stage is
// laid out as three plain panels and the cursor is hidden.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveals } from '../shared/useReveals'

// The "Book a consultation" button in the full-length capture (1440px wide), as fractions
// of the capture's width: measured from the image, centre of the green button
const BOOK = { fx: 1310.5 / 1440, fy: 42 / 1440 }

export default function SessionMotion() {
  useReveals('[data-direction="session"]')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = document.querySelector<HTMLElement>('[data-direction="session"]')
    if (!root) return
    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)
    const stage = q('[data-stage]')
    const cursor = q('[data-cursor]')
    const ripple = q('[data-ripple]')
    const site = q('[data-site]')
    const siteImg = q('[data-site-img]')
    if (!stage || !cursor || !ripple || !site || !siteImg) return

    const mm = gsap.matchMedia()
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', phone: '(max-width: 760px)' },
      (ctx) => {
        const { motion, phone } = ctx.conditions as { motion: boolean; phone: boolean }
        if (!motion) return

        // ---- Hero: she points out the three things she does ----
        const heroCursor = q('[data-hero-cursor]')
        const marks = [...root.querySelectorAll<HTMLElement>('[data-mark]')]
        if (heroCursor && marks.length) {
          const at = (el: HTMLElement, end = false) => {
            const r = el.getBoundingClientRect()
            const p = heroCursor.offsetParent!.getBoundingClientRect()
            return { x: (end ? r.right : r.left) - p.left, y: r.bottom - p.top - 6 }
          }
          const intro = gsap.timeline({ delay: 0.5, defaults: { ease: 'power3.inOut' } })
          const first = at(marks[0])
          intro.fromTo(heroCursor, { x: first.x + 220, y: first.y + 260, autoAlpha: 0 }, { x: first.x, y: first.y, autoAlpha: 1, duration: 1.1 })
          marks.forEach((m) => {
            const a = at(m)
            const b = at(m, true)
            intro.to(heroCursor, { x: a.x, y: a.y, duration: 0.45 })
              .to(m, { '--mark': 1, duration: 0.55, ease: 'power2.inOut' })
              .to(heroCursor, { x: b.x, y: b.y, duration: 0.55, ease: 'power2.inOut' }, '<')
          })
          const cue = q('[data-cue]')
          if (cue) {
            const r = cue.getBoundingClientRect()
            const p = heroCursor.offsetParent!.getBoundingClientRect()
            intro.to(heroCursor, { x: r.right - p.left + 12, y: r.top - p.top - 4, duration: 0.9 })
          }
        }

        // ---- The session: one scrubbed timeline over the sticky stage ----
        const W = () => stage.clientWidth
        const H = () => stage.clientHeight
        // Must match .site in session.module.css
        const win = () => (phone ? { l: 0.04, t: 0.16, w: 0.92, h: 0.5 } : { l: 0.38, t: 0.12, w: 0.55, h: 0.76 })
        const pt = (fx: number, fy: number) => ({ x: () => fx * W(), y: () => fy * H() })
        const book = {
          x: () => (win().l + BOOK.fx * win().w) * W(),
          y: () => win().t * H() + BOOK.fy * win().w * W(),
        }
        const scrollBy = () => -Math.min(siteImg.offsetHeight - site.clientHeight, H() * 1.6)

        // Counters write text (textContent is not a Trusted Types sink); the server render
        // already holds the final figure for readers without motion
        const counters = { sent: { n: 0 }, fixed: { n: 0 } }
        const show = (sel: string, n: number) => {
          const el = q(sel)
          if (el) el.textContent = Math.round(n).toLocaleString('en-GB')
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '#session',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        const click = (at: number) => {
          tl.fromTo(cursor, { scale: 1 }, { scale: 0.86, duration: 0.03, yoyo: true, repeat: 1 }, at)
          tl.fromTo(ripple, { scale: 0, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 0.12, ease: 'power1.out' }, at)
        }

        // 1. Build: she arrives, scrolls the site, comes back up and books
        tl.set('[data-scene="1"]', { autoAlpha: 1 }, 0)
          .fromTo(cursor, { ...pt(0.66, 1.1), autoAlpha: 0 }, { ...pt(phone ? 0.5 : 0.62, phone ? 0.4 : 0.5), autoAlpha: 1, duration: 0.06 }, 0)
          .fromTo(siteImg, { y: 0 }, { y: scrollBy, duration: 0.14 }, 0.07)
          .to(cursor, { ...pt(phone ? 0.6 : 0.72, phone ? 0.5 : 0.62), duration: 0.14 }, 0.07)
          .to(siteImg, { y: 0, duration: 0.08 }, 0.22)
          .to(cursor, { x: book.x, y: book.y, duration: 0.08 }, 0.24)
        click(0.33)
        tl.to(ripple, { x: book.x, y: book.y, duration: 0.001 }, 0.32)

        // 2. Grow: the site steps aside and the real emails arrive
        tl.to('[data-scene="1"]', { autoAlpha: 0, duration: 0.03 }, 0.35)
          .to('[data-scene="2"]', { autoAlpha: 1, duration: 0.03 }, 0.37)
          .to(site, { scale: phone ? 0.8 : 0.62, yPercent: phone ? -10 : 0, transformOrigin: '0% 0%', duration: 0.07 }, 0.35)
          .fromTo('[data-mail="1"]', { xPercent: 30, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.07, ease: 'power3.out' }, 0.4)
          .to(cursor, { ...pt(phone ? 0.7 : 0.84, phone ? 0.4 : 0.32), duration: 0.07 }, 0.4)
          .fromTo('[data-mail="2"]', { xPercent: 30, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.07, ease: 'power3.out' }, 0.5)
          .to(cursor, { ...pt(phone ? 0.62 : 0.8, phone ? 0.6 : 0.7), duration: 0.07 }, 0.5)
          .fromTo(counters.sent, { n: 0 }, { n: 1695, duration: 0.1, ease: 'none', onUpdate: () => show('[data-count]', counters.sent.n) }, 0.5)

        // 3. Fix: eleven people never got their email; she selects them and sends
        tl.to(['[data-scene="2"]', site, '[data-mail]'], { autoAlpha: 0, duration: 0.04 }, 0.64)
          .to('[data-scene="3"]', { autoAlpha: 1, duration: 0.04 }, 0.67)
          .fromTo('[data-dots]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.67)
          .to(cursor, { ...pt(phone ? 0.03 : 0.37, phone ? 0.28 : 0.33), duration: 0.06 }, 0.7)
          .fromTo('[data-marquee]', { autoAlpha: 0, scaleX: 0, scaleY: 0 }, { autoAlpha: 1, scaleX: 1, scaleY: 1, transformOrigin: '0% 0%', duration: 0.08, ease: 'none' }, 0.76)
          .to(cursor, { ...pt(phone ? 0.97 : 0.94, phone ? 0.44 : 0.43), duration: 0.08, ease: 'none' }, 0.76)
          .to(cursor, { ...pt(phone ? 0.5 : 0.66, phone ? 0.36 : 0.38), duration: 0.05 }, 0.85)
        click(0.9)
        tl.to(ripple, { ...pt(phone ? 0.5 : 0.66, phone ? 0.36 : 0.38), duration: 0.001 }, 0.89)
          .to('[data-dot]', { '--sent': 1, stagger: 0.006, duration: 0.02 }, 0.9)
          .to('[data-marquee]', { autoAlpha: 0, duration: 0.03 }, 0.92)
          .fromTo(counters.fixed, { n: 0 }, { n: 11, duration: 0.07, ease: 'none', onUpdate: () => show('[data-fixed]', counters.fixed.n) }, 0.9)
          .to({}, { duration: 0.05 }, 0.95)

        // ---- More work: the row drifts sideways as the section passes ----
        const row = q('[data-row]')
        if (row) {
          gsap.fromTo(row, { x: 0 }, {
            x: () => -(row.scrollWidth - row.clientWidth),
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          })
        }

        // ---- Footer: she points at the way to reach her ----
        const footCursor = q('[data-foot-cursor]')
        if (footCursor) {
          gsap.fromTo(footCursor, { x: 140, y: 120, autoAlpha: 0 }, {
            x: 0, y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: footCursor, start: 'top 85%', once: true },
          })
        }
      },
    )
    return () => mm.revert()
  }, [])

  return null
}
