'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface InitialPreloaderProps {
  onComplete: () => void
  pageContentRef: React.RefObject<HTMLDivElement | null>
}

const greetings = [
  'Akwaaba', 'Hello', 'Bonjour', 'Hola', '你好', 
  'नमस्ते', 'مرحبا', 'Olá', 'Привет', 'こんにちは'
]

// The whole intro, content reveal included, finishes inside the 2.5s loader cap
const FIRST_SLOT = 0.5 // Akwaaba holds longer
const SLOT = 0.11 // every greeting after it
const SEEN_KEY = 'intro-seen'

const shouldSkipIntro = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false // storage blocked: play the intro
  }
}

export default function InitialPreloader({ onComplete, pageContentRef }: InitialPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const greetingsRef = useRef<HTMLDivElement[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Once per browser session, and never for visitors who ask for reduced motion
    if (shouldSkipIntro()) {
      setIsComplete(true)
      onComplete()
      return
    }

    const tl = gsap.timeline()
    
    // Set initial state for page content (blurred and scaled, visible behind preloader)
    if (pageContentRef.current) {
      gsap.set(pageContentRef.current, {
        opacity: 1,
        filter: 'blur(15px)',
        scale: 0.985
      })
    }

    // Animate through greetings sequentially without overlap
    greetings.forEach((_, index) => {
      const greetingEl = greetingsRef.current[index]
      if (!greetingEl) return

      // Give first greeting (Akwaaba) more time for elegant entrance
      const fadeInDuration = index === 0 ? 0.25 : 0.05
      const holdDuration = index === 0 ? 0.1 : 0.02
      const fadeOutDuration = index === 0 ? 0.15 : 0.04

      const startTime = index === 0 ? 0 : FIRST_SLOT + (index - 1) * SLOT
      
      // Special elegant entrance for Akwaaba
      if (index === 0) {
        // Akwaaba elegant entrance: fade with whisper scale
        tl.fromTo(
          greetingEl,
          { 
            opacity: 0,
            scale: 0.98
          },
          {
            opacity: 1,
            scale: 1.0,
            duration: fadeInDuration,
            ease: 'power2.out'
          },
          startTime
        )
      } else {
        // Regular fade in for other greetings
        tl.fromTo(
          greetingEl,
          { 
            opacity: 0, 
            scale: 0.9, 
            y: 20 
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: fadeInDuration,
            ease: 'power2.out'
          },
          startTime
        )
      }

      // Fade out all except the last one
      if (index < greetings.length - 1) {
        tl.to(
          greetingEl,
          {
            opacity: 0,
            scale: 1.1,
            y: -20,
            duration: fadeOutDuration,
            ease: 'power2.in'
          },
          startTime + fadeInDuration + holdDuration
        )
      }
    })

    // Hold the last greeting, then exit with coordinated page content reveal
    tl.to({}, { duration: 0.15 })
      .to(containerRef.current, {
        y: '-100vh',
        duration: 0.7,
        ease: 'power3.inOut'
      }, "exit")
      
    // Smooth reveal of page content - gradual focus transition
    if (pageContentRef.current) {
      tl.to(pageContentRef.current, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, '1')
          } catch {
            // storage blocked: the intro plays again next visit
          }
          // Delay state updates until all animations are completely finished
          setTimeout(() => {
            setIsComplete(true)
            onComplete()
          }, 100) // Small buffer to ensure smooth handoff
        }
      }, "exit-=0.2")
    }

    return () => {
      tl.kill()
    }
  }, [onComplete, pageContentRef])

  if (isComplete) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[80] flex items-center justify-center font-satoshi"
      style={{ 
        background: 'radial-gradient(ellipse at center, #000000 0%, #0c0c0c 70%, #141414 100%)',
        willChange: 'transform' 
      }}
    >
      <div className="relative">
        {greetings.map((greeting, index) => (
          <div
            key={greeting}
            ref={(el) => {
              if (el) greetingsRef.current[index] = el
            }}
            className="absolute inset-0 flex items-center justify-center text-white whitespace-nowrap"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '400',
              letterSpacing: '0.1em',
              opacity: 0,
              transform: 'scale(0.9) translateY(20px)',
              willChange: 'transform, opacity'
            }}
          >
            {greeting}
          </div>
        ))}
      </div>
    </div>
  )
}