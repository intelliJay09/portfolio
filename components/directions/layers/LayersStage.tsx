'use client'

// Direction B's signature: Gwen Addo's customer system drawn as an exploded stack. Scrolling
// the hero pulls the three layers apart (the site, the journey, the safety net), draws a
// leader line from each to its label, then walks through them one at a time.
//
// The plates are CSS 3D (no WebGL needed: they are flat images and type). GSAP tweens three
// CSS variables on the stack and the leader lines are recomputed from each plate's anchor.
// Under reduced motion the stack is drawn already open, with every label shown.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LayersStage({ heroId }: { heroId: string }) {
  useEffect(() => {
    const hero = document.getElementById(heroId)
    if (!hero) return
    gsap.registerPlugin(ScrollTrigger)
    const stage = hero.querySelector<HTMLElement>('[data-stage]')
    const stack = hero.querySelector<HTMLElement>('[data-stack]')
    const svg = hero.querySelector<SVGSVGElement>('[data-leaders]')
    if (!stage || !stack || !svg) return
    // Plates sit bottom-up in the markup; leaders pair by layer number, not DOM order
    const anchors = [...hero.querySelectorAll<HTMLElement>('[data-anchor]')].sort(
      (a, b) => Number(a.dataset.for) - Number(b.dataset.for),
    )
    const labels = [...hero.querySelectorAll<HTMLElement>('[data-layer-label]')]
    const lines = [...svg.querySelectorAll<SVGLineElement>('line')]
    const dots = [...svg.querySelectorAll<SVGCircleElement>('circle')]

    let raf = 0
    const drawLeaders = () => {
      raf = 0
      const s = stage.getBoundingClientRect()
      anchors.forEach((a, i) => {
        const ar = a.getBoundingClientRect()
        const lr = labels[i]?.getBoundingClientRect()
        if (!lr || !lines[i]) return
        const x1 = lr.right - s.left + 14
        const y1 = lr.top - s.top + 10
        const x2 = ar.left - s.left
        const y2 = ar.top - s.top
        lines[i].setAttribute('x1', String(x1))
        lines[i].setAttribute('y1', String(y1))
        lines[i].setAttribute('x2', String(x2))
        lines[i].setAttribute('y2', String(y2))
        dots[i]?.setAttribute('cx', String(x2))
        dots[i]?.setAttribute('cy', String(y2))
      })
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(drawLeaders) }

    const setActive = (n: number) => {
      if (stack.dataset.active !== String(n)) {
        stack.dataset.active = String(n)
        hero.dataset.active = String(n)
      }
    }

    const mm = gsap.matchMedia()
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        phone: '(max-width: 760px)',
      },
      (ctx) => {
        const { motion, phone } = ctx.conditions as { motion: boolean; phone: boolean }
        const open = phone ? 120 : 190
        if (!motion) {
          gsap.set(stack, { '--gap': `${open}px` })
          gsap.set(labels, { autoAlpha: 1 })
          gsap.set(svg, { autoAlpha: 1 })
          setActive(0)
          queue()
          return
        }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress
              setActive(p < 0.38 ? 0 : p < 0.56 ? 1 : p < 0.74 ? 2 : p < 0.9 ? 3 : 0)
              queue()
            },
          },
        })
        tl.to('[data-title]', { autoAlpha: 0, y: -30, duration: 0.12 }, 0.02)
          .fromTo(stack, { '--gap': '14px', '--rz': '-36deg' }, { '--gap': `${open}px`, '--rz': '-30deg', duration: 0.3 }, 0.04)
          .fromTo(svg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.22)
          .fromTo(labels, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.08 }, 0.22)
          .to(stack, { '--rz': '-24deg', '--rx': '52deg', duration: 0.6 }, 0.34)
      },
    )

    window.addEventListener('resize', queue)
    queue()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', queue)
      mm.revert()
    }
  }, [heroId])

  return null
}
