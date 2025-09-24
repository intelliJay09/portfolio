'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeProvider'
import { useRef, useCallback } from 'react'
import gsap from 'gsap'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevent all event propagation and default behavior
    e.preventDefault()
    e.stopPropagation()
    // Use nativeEvent for broader compatibility
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation()
    }
    
    if (buttonRef.current) {
      // Set transform-origin for predictable scaling
      gsap.set(buttonRef.current, { transformOrigin: 'center center' })
      
      // Click animation with proper GPU acceleration
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.out',
        force3D: true,
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
    
    // Toggle theme with slight delay for visual feedback
    setTimeout(() => toggleTheme(), 50)
  }, [toggleTheme])

  const handleHover = useCallback((isHovering: boolean) => {
    if (buttonRef.current) {
      // Kill any existing hover animations to prevent conflicts
      gsap.killTweensOf(buttonRef.current)
      
      gsap.set(buttonRef.current, { transformOrigin: 'center center' })
      gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1, // Reduced from 1.1 to prevent conflicts
        duration: 0.3,
        ease: isHovering ? 'back.out(1.4)' : 'power2.out',
        force3D: true,
        overwrite: 'auto' // Automatically overwrite conflicting animations
      })
    }
  }, [])

  if (!mounted) {
    return (
      <div 
        className={`w-12 h-12 rounded-full bg-primary/10 ${className}`} 
        style={{ zIndex: 80, position: 'relative' }}
      />
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onTouchStart={() => handleHover(true)}
      onTouchEnd={() => handleHover(false)}
      data-theme-toggle="true"
      className={`
        w-12 h-12 flex items-center justify-center transition-colors duration-300
        focus:outline-none relative cursor-pointer ${className}
      `}
      style={{
        // Critical: Remove CSS class z-index conflict by using only inline styles
        zIndex: 80,
        position: 'relative',
        isolation: 'isolate', // Create stacking context
        // Performance optimizations
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        pointerEvents: 'auto',
        willChange: 'transform', // Optimize for animations
        transformOrigin: 'center center',
        // Ensure hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
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
}