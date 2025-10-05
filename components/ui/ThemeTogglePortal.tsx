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
  }
}

export default function ThemeTogglePortal({ navigationState }: ThemeTogglePortalProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const positionRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })

  // Initialize portal root
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortalRoot(document.body)
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

    positionRef.current = targetPosition

    // Smooth position animation using CSS properties for fixed elements
    gsap.to(buttonRef.current, {
      left: targetPosition.left,
      top: targetPosition.top,
      duration: 0.4,
      ease: 'power2.out',
      force3D: true
    })

  }, [navigationState])

  // Initial position setup with enhanced timing and element detection
  useEffect(() => {
    if (!mounted) return
    
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
    if (!mounted) return
    updatePosition()
  }, [mounted, updatePosition])

  // Handle window resize and orientation change
  useEffect(() => {
    if (!mounted) return
    
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

  // Don't render until mounted and portal root is available
  if (!mounted || !portalRoot) {
    return null
  }

  // Hide theme toggle when menu is open or on mobile when sticky header (hamburger) is triggered
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
        // Maximum z-index to ensure it's always on top
        zIndex: 9999,
        // Hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, left, top',
        // Isolation from any parent stacking contexts
        isolation: 'isolate',
        // Touch optimization
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        // Pointer events always enabled
        pointerEvents: 'auto',
        // Initial position (will be updated by GSAP)
        left: positionRef.current.left || window.innerWidth - 80,
        top: positionRef.current.top || 24,
        // Smooth transitions for manual CSS updates
        transition: 'opacity 0.3s ease'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={16} className="text-primary" />
      ) : (
        <Sun size={16} className="text-primary" />
      )}
    </button>
  )

  // Render through portal to escape all stacking context conflicts
  return createPortal(themeToggleElement, portalRoot)
}