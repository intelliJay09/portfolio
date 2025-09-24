'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import content from '../content.json'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const greetingsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power3.inOut',
          onComplete: onComplete,
        })
      },
    })

    greetingsRef.current.forEach((greeting, index) => {
      if (!greeting) return
      
      // Each greeting appears with 0.8s stagger, visible for 0.8s each
      const startTime = index * 0.8
      const visibleDuration = 0.8
      
      tl.fromTo(
        greeting,
        {
          opacity: 0,
          scale: 0.95,
          y: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        startTime
      )
      
      // Only fade out previous greetings, keep the last one
      if (index < greetingsRef.current.length - 1) {
        tl.to(
          greeting,
          {
            opacity: 0,
            scale: 1.05,
            y: -15,
            duration: 0.3,
            ease: 'power2.in',
          },
          startTime + visibleDuration
        )
      }
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background-secondary flex items-center justify-center"
    >
      <div className="relative">
        {content.preloader.greetings.map((greeting, index) => (
          <div
            key={greeting}
            ref={(el) => {
              if (el) greetingsRef.current[index] = el
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              index === 0 ? 'text-text-primary' : 'text-primary'
            }`}
            style={{ opacity: 0 }}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-satoshi">
              {greeting}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}