'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { CaseStudyImage } from '../../lib/case-studies'

// The cover opens from an inset frame to full bleed as it scrolls in. Normal
// scroll, scrubbed, no pin. The server-rendered state is the finished,
// full-bleed image, so without JS or with reduced motion nothing is hidden.
export default function CoverReveal({ image }: { image: CaseStudyImage }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        const trigger = { trigger: frameRef.current, start: 'top bottom', end: 'top 15%', scrub: 0.6 }
        gsap.fromTo(
          frameRef.current,
          { clipPath: 'inset(0% 7% 0% 7% round 1.25rem)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0rem)', ease: 'none', scrollTrigger: trigger }
        )
        gsap.fromTo(imgRef.current, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: trigger })
      })
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      </div>
    </div>
  )
}
