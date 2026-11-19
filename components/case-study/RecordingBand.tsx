'use client'

import { useEffect, useRef } from 'react'
import ScreenRecording from './ScreenRecording'
import type { CaseStudy } from '../../lib/case-studies'

// Recordings of the real site on a band in the client's brand colour. The laptop
// and the phone drift at different speeds as the band scrolls past: normal scroll,
// scrubbed, no pin. Without JS or with reduced motion they sit still, in place.
export default function RecordingBand({ showcase }: { showcase: NonNullable<CaseStudy['showcase']> }) {
  const bandRef = useRef<HTMLElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        const scrub = { trigger: bandRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        gsap.fromTo(laptopRef.current, { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: scrub })
        gsap.fromTo(phoneRef.current, { yPercent: 14 }, { yPercent: -10, ease: 'none', scrollTrigger: scrub })
      })
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={bandRef}
      aria-label="The site in use"
      className="overflow-hidden px-4 py-[clamp(5rem,11vw,10rem)] sm:px-8 lg:px-[6.5vw]"
      style={{ backgroundColor: showcase.tint }}
    >
      <div className="mx-auto grid max-w-[88rem] items-end gap-10 lg:grid-cols-12 lg:gap-[2em]">
        <div ref={laptopRef} className={showcase.phone ? 'lg:col-span-8' : 'lg:col-span-10 lg:col-start-2'}>
          <ScreenRecording recording={showcase.desktop} frame="laptop" />
        </div>
        {showcase.phone && (
          <div ref={phoneRef} className="mx-auto w-[min(70vw,17rem)] lg:col-span-3 lg:col-start-10 lg:w-full">
            <ScreenRecording recording={showcase.phone} frame="phone" />
          </div>
        )}
      </div>
    </section>
  )
}
