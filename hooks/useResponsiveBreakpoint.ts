'use client'

import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

interface ResponsiveBreakpoint {
  breakpoint: Breakpoint
  isTouchDevice: boolean
  prefersReducedMotion: boolean
}

const useResponsiveBreakpoint = (): ResponsiveBreakpoint => {
  // SSR-safe initial states
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Ensure we're in client-side environment
    if (typeof window === 'undefined') return
    
    // Mark as client-side for hydration safety
    setIsClient(true)

    // Detect touch device
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsTouchDevice(hasTouch)
    }

    // Check breakpoint
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    // Check reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      return mediaQuery
    }

    // Initial checks
    checkTouch()
    checkBreakpoint()
    const mediaQuery = checkReducedMotion()

    // Event handlers
    const handleResize = () => checkBreakpoint()
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches)

    // Add event listeners
    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleMotionChange)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return { 
    breakpoint, 
    isTouchDevice: isClient ? isTouchDevice : false, 
    prefersReducedMotion: isClient ? prefersReducedMotion : false 
  }
}

export default useResponsiveBreakpoint

// Export types for external usage
export type { Breakpoint, ResponsiveBreakpoint }