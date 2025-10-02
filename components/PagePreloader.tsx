'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PagePreloaderProps {
  pageName: string
  onComplete: () => void
  pageContentRef?: React.RefObject<HTMLDivElement | null>
}

export default function PagePreloader({ pageName, onComplete, pageContentRef }: PagePreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline()
    
    // Set initial state for page content (blurred and scaled, visible behind preloader)
    if (pageContentRef && pageContentRef.current) {
      gsap.set(pageContentRef.current, {
        opacity: 1,
        filter: 'blur(15px)',
        scale: 0.985
      })
    }

    // Pure Elegance: Simultaneous fade in with perfect timing
    if (dotRef.current && textRef.current) {
      tl.fromTo(
        [dotRef.current, textRef.current],
        { 
          opacity: 0
        },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        }
      )
    }

    // Hold for viewing
    tl.to({}, { duration: 0.5 })

    // Exit animation - slide up with coordinated page content reveal
    tl.to(containerRef.current, {
      y: '-100vh',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsComplete(true)
        onComplete()
      }
    }, "exit")
    
    // Smooth reveal of page content - gradual focus transition
    if (pageContentRef && pageContentRef.current) {
      tl.to(pageContentRef.current, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, "exit-=0.15")
    }

    return () => {
      tl.kill()
    }
  }, [onComplete, pageContentRef])

  if (isComplete) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center font-satoshi"
      style={{ 
        background: 'radial-gradient(ellipse at center, #000000 0%, #0c0c0c 70%, #141414 100%)',
        willChange: 'transform' 
      }}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* Elegant dot - positioned inline */}
        <div
          ref={dotRef}
          className="w-2 h-2 bg-white rounded-full"
          style={{
            opacity: 0,
            willChange: 'opacity'
          }}
        />
        
        {/* Page name - positioned inline */}
        <h1
          ref={textRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-satoshi font-light text-white"
          style={{ 
            opacity: 0,
            letterSpacing: '0.1em',
            willChange: 'opacity'
          }}
        >
          {pageName}
        </h1>
      </div>
    </div>
  )
}