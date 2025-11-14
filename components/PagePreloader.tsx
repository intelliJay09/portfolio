'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { debugLogger } from '../utils/debugLogger'

interface PagePreloaderProps {
  pageName: string
  onComplete: () => void
  onRevealComplete?: () => void
  pageContentRef?: React.RefObject<HTMLDivElement | null>
}

export default function PagePreloader({ pageName, onComplete, onRevealComplete, pageContentRef }: PagePreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    debugLogger.log('PRELOADER', `useEffect fired, onRevealComplete is ${onRevealComplete ? 'defined' : 'undefined'}`, '🔧')

    if (!containerRef.current) {
      debugLogger.log('PRELOADER', 'containerRef.current is null, returning', '⚠️')
      return
    }

    const tl = gsap.timeline()

    debugLogger.log('PRELOADER', 'Timeline started', '⏱️')

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
          ease: 'power3.out',
          onStart: () => {
            debugLogger.log('PRELOADER', 'Fade in started', '💫')
          }
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
      onStart: () => {
        debugLogger.log('PRELOADER', '⬆️ Exit animation started', '⬆️')
      },
      onComplete: () => {
        debugLogger.log('PRELOADER', '✅ Exit complete, calling onComplete()', '✅')
        setIsComplete(true)
        onComplete()
      }
    }, "exit")

    return () => {
      tl.kill()
    }
  }, [onComplete, pageContentRef, onRevealComplete])

  // Independent blur animation effect - runs separately from preloader timeline
  useEffect(() => {
    if (!pageContentRef?.current) {
      debugLogger.log('PRELOADER', '⚠️ Blur effect: pageContentRef is null!', '⚠️')
      return
    }

    debugLogger.log('PRELOADER', 'Setting up independent blur animation', '📦')

    // Set initial blur state
    gsap.set(pageContentRef.current, {
      filter: 'blur(15px)',
      scale: 0.985
    })

    // Wait for preloader exit to start (after fade in + hold = 1100ms), then animate blur removal
    const blurTimeline = gsap.timeline({
      delay: 1.1 // Match the preloader fade + hold timing
    })

    blurTimeline.to(pageContentRef.current, {
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      onStart: () => {
        debugLogger.log('PRELOADER', '🌫️ Blur removal started', '🌫️')
      },
      onUpdate: function() {
        const progress = this.progress()
        if (Math.abs(progress - 0.25) < 0.01) {
          debugLogger.log('PRELOADER', 'Blur at 25%', '▓')
        } else if (Math.abs(progress - 0.5) < 0.01) {
          debugLogger.log('PRELOADER', 'Blur at 50%', '▓▓')
        } else if (Math.abs(progress - 0.75) < 0.01) {
          debugLogger.log('PRELOADER', 'Blur at 75%', '▓▓▓')
        } else if (progress > 0.99) {
          debugLogger.log('PRELOADER', 'Blur at 100%', '▓▓▓▓')
        }
      },
      onComplete: () => {
        debugLogger.log('PRELOADER', '✨ Blur removal complete', '✨')
        // Fire onRevealComplete callback when blur animation finishes
        if (onRevealComplete) {
          debugLogger.log('PRELOADER', '🎉 Calling onRevealComplete()', '🎉')
          onRevealComplete()
        } else {
          debugLogger.log('PRELOADER', '⚠️ onRevealComplete is not defined!', '⚠️')
        }
      }
    })

    return () => {
      blurTimeline.kill()
    }
  }, [pageContentRef, onRevealComplete])

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