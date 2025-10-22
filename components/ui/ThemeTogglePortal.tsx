'use client'

import { createPortal } from 'react-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeProvider'
import gsap from 'gsap'

interface ThemeTogglePortalProps {
  navigationState: {
    isMenuOpen: boolean
    isMobile: boolean
    showHamburger: boolean
    hideDefault: boolean
    preloaderComplete: boolean
  }
}

export default function ThemeTogglePortal({ navigationState }: ThemeTogglePortalProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const positionRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  const lastDetectedPositionRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  const [iconColor, setIconColor] = useState<'white' | 'black'>('white')

  // Initialize portal root
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortalRoot(document.body)
    }
  }, [])

  // Detect background luminance at a specific position
  const detectBackgroundLuminance = useCallback((x: number, y: number): number => {
    try {
      // Temporarily hide the toggle button to check what's BEHIND it
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'hidden'
      }

      // Get elements at the position (now without the button blocking)
      const elements: Element[] = []
      let currentElement = document.elementFromPoint(x, y)

      // Restore button visibility immediately
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'visible'
      }

      // Walk up the DOM tree to find the first element with a visible background
      while (currentElement && elements.length < 10) {
        elements.push(currentElement)
        currentElement = currentElement.parentElement
      }

      // Check each element for a visible background color
      for (const element of elements) {
        const styles = window.getComputedStyle(element)
        const bgColor = styles.backgroundColor

        // Skip transparent backgrounds
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          continue
        }

        // Parse RGB values
        const rgb = bgColor.match(/\d+/g)
        if (!rgb || rgb.length < 3) continue

        const r = parseInt(rgb[0])
        const g = parseInt(rgb[1])
        const b = parseInt(rgb[2])
        const a = rgb[3] ? parseFloat(rgb[3]) : 1

        // Skip very transparent backgrounds
        if (a < 0.5) continue

        // Calculate relative luminance (perceived brightness)
        // Formula: (0.299 * R + 0.587 * G + 0.114 * B) / 255
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        return luminance
      }

      // Default to dark background if no background found
      return 0
    } catch (error) {
      console.warn('Background detection error:', error)
      return 0.5 // Default to middle luminance on error
    }
  }, [])

  // Position synchronization system
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return

    const { isMenuOpen, isMobile, showHamburger, hideDefault } = navigationState

    let targetPosition = { left: 0, top: 0 }
    let referenceElement = null
    let lastNavLink = null

    if (isMobile) {
      if (isMenuOpen) {
        // Position in mobile menu overlay - top right area
        targetPosition = { left: window.innerWidth - 80, top: 120 }
      } else if (showHamburger) {
        // Position next to mobile hamburger button
        referenceElement = document.querySelector('[data-nav="hamburger"]')
        if (referenceElement) {
          const rect = referenceElement.getBoundingClientRect()
          targetPosition = { 
            left: rect.left - 60, 
            top: rect.top + (rect.height / 2) - 24 
          }
        } else {
          // Fallback positioning
          targetPosition = { left: window.innerWidth - 120, top: 24 }
        }
      } else {
        // Position in mobile initial menu area - next to the Menu button
        const mobileMenuButton = document.querySelector('[data-menu-button="mobile-initial"]')
        if (mobileMenuButton) {
          const menuRect = mobileMenuButton.getBoundingClientRect()
          targetPosition = { 
            left: menuRect.right + 24, // Smaller gap for mobile
            top: menuRect.top + (menuRect.height / 2) - 24 
          }
        } else {
          // Fallback positioning
          targetPosition = { left: window.innerWidth - 80, top: 24 }
        }
      }
    } else {
      // Desktop positioning
      if (isMenuOpen) {
        // Position in desktop menu overlay - top right area
        targetPosition = { left: window.innerWidth - 100, top: 140 }
      } else if (!hideDefault) {
        // Position as the next sibling in the space-x-8 navigation container
        // Try multiple selector approaches for better reliability
        lastNavLink = document.querySelector('[data-nav="default"] a[href="/contact"]') ||
                     document.querySelector('[data-nav="default"] a:last-child') ||
                     document.querySelector('a[href="/contact"]')
        
        if (lastNavLink) {
          const linkRect = lastNavLink.getBoundingClientRect()
          targetPosition = { 
            left: linkRect.right + 32, // space-x-8 gap (32px)
            top: linkRect.top + (linkRect.height / 2) - 24 
          }
        } else {
          // Fallback: Target the navigation container if link not found
          referenceElement = document.querySelector('[data-nav="default"]') ||
                            document.querySelector('nav [class*="lg:flex"][class*="space-x-8"]')
          
          if (referenceElement) {
            const navRect = referenceElement.getBoundingClientRect()
            targetPosition = { 
              left: navRect.right + 32, // space-x-8 gap (32px)
              top: navRect.top + (navRect.height / 2) - 24 
            }
          } else {
            // Navigation-aware fallback - stay within nav area instead of viewport edge
            const mainNavContainer = document.querySelector('nav [class*="px-"]')
            if (mainNavContainer) {
              const containerRect = mainNavContainer.getBoundingClientRect()
              targetPosition = { 
                left: containerRect.right - 80, // Stay within navigation area
                top: containerRect.top + 24 
              }
            } else {
              // Final emergency fallback
              targetPosition = { left: window.innerWidth - 120, top: 32 }
            }
          }
        }
      } else {
        // Position next to desktop hamburger
        referenceElement = document.querySelector('[data-nav="desktop-hamburger"]')
        if (referenceElement) {
          const rect = referenceElement.getBoundingClientRect()
          targetPosition = { 
            left: rect.left - 60, 
            top: rect.top + (rect.height / 2) - 24 
          }
        } else {
          // Fallback positioning
          targetPosition = { left: window.innerWidth - 120, top: 24 }
        }
      }
    }

    // Prevent redundant animations if position hasn't actually changed
    const currentPosition = positionRef.current
    const positionChanged =
      Math.abs(targetPosition.left - currentPosition.left) > 1 ||
      Math.abs(targetPosition.top - currentPosition.top) > 1

    // Always update the ref to track current target position
    positionRef.current = targetPosition

    if (!positionChanged) {
      // Position hasn't changed significantly, skip animation
      // Don't run detection here - let scroll/theme handlers handle it
      return
    }

    // Smooth position animation using CSS properties for fixed elements
    gsap.to(buttonRef.current, {
      left: targetPosition.left,
      top: targetPosition.top,
      duration: 0.4,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        // Only detect if button moved >10px from last detected position
        const lastPos = lastDetectedPositionRef.current
        const distanceMoved = Math.sqrt(
          Math.pow(targetPosition.left - lastPos.left, 2) +
          Math.pow(targetPosition.top - lastPos.top, 2)
        )

        if (distanceMoved > 10) {
          // Detect background luminance after positioning completes
          const luminance = detectBackgroundLuminance(
            targetPosition.left + 24, // Center of button (48px width / 2)
            targetPosition.top + 24    // Center of button (48px height / 2)
          )

          // Update last detected position
          lastDetectedPositionRef.current = { ...targetPosition }

          // If background is dark (luminance < 0.5), use white icon
          // If background is light (luminance >= 0.5), use black icon
          setIconColor(luminance < 0.5 ? 'white' : 'black')
        }
      }
    })

  }, [detectBackgroundLuminance, navigationState])

  // Initial position setup with enhanced timing and element detection
  useEffect(() => {
    if (!mounted || !navigationState.preloaderComplete) return
    
    // Check if navigation elements are ready, retry if not
    const checkAndPosition = () => {
      const navReady = document.querySelector('[data-nav="default"]') || 
                      document.querySelector('nav [class*="px-"]')
      
      if (navReady) {
        updatePosition()
      } else {
        // Retry after additional delay if elements not ready
        setTimeout(() => {
          updatePosition()
        }, 200)
      }
    }
    
    // Initial delay to ensure navigation elements are rendered
    const initialSetup = setTimeout(checkAndPosition, 150) // Increased from 100ms
    
    return () => clearTimeout(initialSetup)
  }, [mounted, updatePosition])

  // Update position when navigation state changes
  useEffect(() => {
    if (!mounted || !navigationState.preloaderComplete) return
    updatePosition()
  }, [mounted, navigationState.preloaderComplete, navigationState.isMenuOpen, navigationState.isMobile, navigationState.showHamburger, navigationState.hideDefault, updatePosition])

  // Handle window resize and orientation change
  useEffect(() => {
    if (!mounted || !navigationState.preloaderComplete) return

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        updatePosition()
      }, 150)
    }

    const handleOrientationChange = () => {
      // Handle mobile orientation changes
      setTimeout(() => updatePosition(), 200)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      clearTimeout(resizeTimeout)
    }
  }, [mounted, updatePosition])

  // Update icon color on scroll to adapt to background changes
  useEffect(() => {
    if (!buttonRef.current || !mounted || !navigationState.preloaderComplete) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (!buttonRef.current) return

      // Debounce scroll detection to prevent conflicts with GSAP positioning
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (!buttonRef.current) return

        const rect = buttonRef.current.getBoundingClientRect()

        // Button is fixed position - doesn't move during scroll
        // Always detect because content scrolls behind the fixed button
        const luminance = detectBackgroundLuminance(
          rect.left + 24,
          rect.top + 24
        )

        setIconColor(luminance < 0.5 ? 'white' : 'black')
      }, 200) // Wait 200ms after scroll stops
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [mounted, navigationState.preloaderComplete, detectBackgroundLuminance])

  // Update icon color when theme changes
  useEffect(() => {
    if (!buttonRef.current || !mounted || !navigationState.preloaderComplete) return

    // Small delay to let theme transition complete
    const timer = setTimeout(() => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()

      // Only detect if button moved >10px from last detected position
      const lastPos = lastDetectedPositionRef.current
      const distanceMoved = Math.sqrt(
        Math.pow(rect.left - lastPos.left, 2) +
        Math.pow(rect.top - lastPos.top, 2)
      )

      if (distanceMoved > 10) {
        const luminance = detectBackgroundLuminance(
          rect.left + 24,
          rect.top + 24
        )

        // Update last detected position
        lastDetectedPositionRef.current = { left: rect.left, top: rect.top }

        setIconColor(luminance < 0.5 ? 'white' : 'black')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [theme, mounted, navigationState.preloaderComplete, detectBackgroundLuminance])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Use nativeEvent for broader compatibility
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation()
    }
    
    if (buttonRef.current) {
      // Kill any existing animations
      gsap.killTweensOf(buttonRef.current)
      
      // Click animation with proper isolation
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.out',
        force3D: true,
        transformOrigin: 'center center',
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)',
            force3D: true
          })
        }
      })
    }
    
    // Toggle theme with slight delay for animation
    setTimeout(() => toggleTheme(), 50)
  }, [toggleTheme])

  const handleHover = useCallback((isHovering: boolean) => {
    if (buttonRef.current) {
      gsap.killTweensOf(buttonRef.current)
      
      gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: isHovering ? 'back.out(1.7)' : 'power2.out',
        force3D: true,
        transformOrigin: 'center center',
        overwrite: 'auto'
      })
    }
  }, [])

  // Primary hide: Remove from DOM if preloader not complete, not mounted, or portal root unavailable
  if (!mounted || !portalRoot || !navigationState.preloaderComplete) {
    return null
  }

  // Secondary hide: Remove from DOM if menu open or mobile hamburger showing
  if (navigationState.isMenuOpen || (navigationState.isMobile && navigationState.showHamburger)) {
    return null
  }

  const themeToggleElement = (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onTouchStart={() => handleHover(true)}
      onTouchEnd={() => handleHover(false)}
      data-theme-toggle-portal="true"
      className="fixed w-12 h-12 flex items-center justify-center transition-colors duration-300 focus:outline-none cursor-pointer"
      style={{
        // Z-index above navigation (Navigation: 70) to ensure clickability
        zIndex: 75,
        // CSS-based visibility control (defense in depth)
        opacity: navigationState.preloaderComplete ? 1 : 0,
        visibility: navigationState.preloaderComplete ? 'visible' : 'hidden',
        pointerEvents: navigationState.preloaderComplete ? 'auto' : 'none',
        // Hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, left, top',
        // Isolation from any parent stacking contexts
        isolation: 'isolate',
        // Touch optimization
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        // Initial position (will be updated by GSAP)
        left: positionRef.current.left || window.innerWidth - 80,
        top: positionRef.current.top || 24,
        // Smooth transitions for manual CSS updates
        transition: 'opacity 0.3s ease'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={16} className={iconColor === 'white' ? 'text-white' : 'text-black'} />
      ) : (
        <Sun size={16} className={iconColor === 'white' ? 'text-white' : 'text-black'} />
      )}
    </button>
  )

  // Render through portal to escape all stacking context conflicts
  return createPortal(themeToggleElement, portalRoot)
}