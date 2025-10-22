'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { debugLogger } from '../utils/debugLogger'

export const useHamburgerAnimations = (
  showHamburger: boolean, 
  isMobile: boolean, 
  hideDefault: boolean,
  scrollDirection: 'up' | 'down',
  isMenuOpen: boolean
) => {
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const defaultNavRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLButtonElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)

  // Initialize elements to correct states on mount
  useEffect(() => {
    debugLogger.log('NAV ANIMATIONS', '🎬 Initializing GSAP states', '🎬')

    // Desktop hamburger starts hidden - only set opacity/y, let Framer Motion handle scale
    if (hamburgerRef.current) {
      gsap.set(hamburgerRef.current, {
        opacity: 0,
        y: -8,
        pointerEvents: 'none',
        zIndex: -1
        // Removed scale to avoid conflicts with Framer Motion hover
      })
      debugLogger.log('NAV ANIMATIONS', 'Desktop hamburger initialized', '🍔')
    }

    // Mobile menu button starts hidden - only set opacity/y, let Framer Motion handle scale
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, {
        opacity: 0,
        y: -8,
        pointerEvents: 'none',
        zIndex: -1
        // Removed scale to avoid conflicts with Framer Motion hover
      })
      debugLogger.log('NAV ANIMATIONS', 'Mobile menu initialized', '📱')
    }

    // Default navigation starts visible
    if (defaultNavRef.current) {
      gsap.set(defaultNavRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        pointerEvents: 'auto'
      })
      debugLogger.log('NAV ANIMATIONS', 'Default nav initialized', '🧭')
    }
  }, [])

  // Handle hamburger visibility animations with buttery smooth easing
  useEffect(() => {
    const targetRef = isMobile ? mobileMenuRef : hamburgerRef
    
    if (!targetRef.current) return

    if (showHamburger || isMenuOpen) {
      // Buttery entrance animation with anticipation - AVOIDING scale/transform conflicts
      const tl = gsap.timeline()

      tl.to(targetRef.current, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        zIndex: 10,
        duration: 0.4,
        ease: 'power2.out',
        // CRITICAL: Only overwrite opacity and y, preserve scale for Framer Motion
        overwrite: false,
        onComplete: () => {
          // Ensure base scale is set but allow Framer Motion to override
          gsap.set(targetRef.current, { scale: 1, overwrite: false })
        }
      })
    } else {
      // Smooth exit animation - only control opacity and y
      gsap.to(targetRef.current, {
        opacity: 0,
        y: -8,
        pointerEvents: 'none',
        zIndex: -1,
        duration: 0.5,
        ease: 'power2.inOut',
        // CRITICAL: Don't overwrite scale, let Framer Motion handle hover animations
        overwrite: false
      })
    }
  }, [showHamburger, isMobile, isMenuOpen])

  // Handle default navigation visibility - hide when scrolled OR when menu is open
  useEffect(() => {
    if (!defaultNavRef.current || isMobile) return

    if (hideDefault || isMenuOpen) {
      // Buttery hide animation - faster, more elegant
      gsap.to(defaultNavRef.current, {
        opacity: 0,
        scale: 0.95,
        y: -12,
        pointerEvents: 'none',
        duration: 0.45,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    } else {
      // Elegant show animation with slight delay for smoothness
      gsap.to(defaultNavRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.6,
        ease: 'power2.out',
        delay: scrollDirection === 'up' ? 0.1 : 0, // Slight delay when scrolling up
        overwrite: 'auto',
      })
    }
  }, [hideDefault, isMobile, scrollDirection, isMenuOpen])

  // Handle logo visibility - hide when default nav is hidden OR when menu is open
  useEffect(() => {
    if (!logoRef.current) return
    
    if (hideDefault || isMenuOpen) {
      gsap.to(logoRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.45,
        ease: 'power2.out',
        transformOrigin: 'center center',
        overwrite: false
      })
    } else {
      gsap.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: scrollDirection === 'up' ? 0.1 : 0,
        transformOrigin: 'center center',
        overwrite: false
      })
    }
  }, [hideDefault, scrollDirection, isMenuOpen])

  return { 
    hamburgerRef, 
    defaultNavRef, 
    mobileMenuRef,
    logoRef 
  }
}