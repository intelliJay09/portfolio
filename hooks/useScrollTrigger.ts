'use client'

import { useState, useEffect, useRef } from 'react'

interface ScrollTriggerConfig {
  desktopTrigger: number
  mobileTrigger: number
  mobileBreakpoint: number
  bufferZone?: number // Buffer zone for hysteresis
}

export const useScrollTrigger = (config: ScrollTriggerConfig) => {
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showHamburger, setShowHamburger] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const lastScrollY = useRef(0)
  const [hideDefault, setHideDefault] = useState(false)

  // Buffer zone for smooth transitions (default 15% of viewport)
  const bufferZone = config.bufferZone || (typeof window !== 'undefined' ? window.innerHeight * 0.15 : 120)

  // Simple viewport detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < config.mobileBreakpoint)
    }
    
    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [config.mobileBreakpoint])

  // Smooth scroll handler with hysteresis and buffer zones
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setScrollY(currentScrollY)
          
          // Determine scroll direction
          const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
          setScrollDirection(direction)
          lastScrollY.current = currentScrollY
          
          const baseTrigger = isMobile ? config.mobileTrigger : config.desktopTrigger
          
          // CORRECTED: Create buffer zones with logical trigger ordering
          // Scroll DOWN triggers (higher scroll values)
          const hideDefaultTrigger = baseTrigger - bufferZone * 0.25  // Hide default nav early (e.g., 750px)
          const showHamburgerTrigger = baseTrigger                    // Show hamburger at main trigger (e.g., 810px)
          
          // Scroll UP triggers (lower scroll values) - CORRECTED LOGIC  
          const hideHamburgerTrigger = baseTrigger - bufferZone * 0.1  // Hide hamburger when scrolling up (e.g., 790px)
          const showDefaultTrigger = baseTrigger - bufferZone * 0.4   // Show default nav when scrolling up (e.g., 730px)
          
          // FIXED: Ensure logical order - showDefaultTrigger (730px) < hideHamburgerTrigger (790px)
          
          // Handle default navigation visibility
          if (direction === 'down' && currentScrollY > hideDefaultTrigger && !hideDefault) {
            setHideDefault(true)
          } else if (direction === 'up' && currentScrollY < showDefaultTrigger && hideDefault) {
            setHideDefault(false)
          }
          
          // Handle hamburger visibility  
          if (direction === 'down' && currentScrollY > showHamburgerTrigger && !showHamburger) {
            setShowHamburger(true)
          } else if (direction === 'up' && currentScrollY < hideHamburgerTrigger && showHamburger) {
            setShowHamburger(false)
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, config.mobileTrigger, config.desktopTrigger, bufferZone, hideDefault, showHamburger])

  return { 
    scrollY, 
    isMobile, 
    showHamburger, 
    hideDefault,
    scrollDirection 
  }
}