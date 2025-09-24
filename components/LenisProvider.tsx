'use client'

import { useEffect, useRef, useCallback, createContext, useContext, useState } from 'react'

interface LenisInstance {
  raf: (time: number) => void
  stop: () => void
  start: () => void
  destroy: () => void
}

interface LenisConstructor {
  new (options: Record<string, unknown>): LenisInstance
}

interface LenisContextType {
  lenis: LenisInstance | null
  stop: () => void
  start: () => void
  isActive: () => boolean
}

export const LenisContext = createContext<LenisContextType | null>(null)

// Export the useLenis hook here to avoid circular dependency
export const useLenis = () => {
  const context = useContext(LenisContext)
  if (!context) {
    // Return safe defaults if context is not available
    return {
      lenis: null,
      stop: () => {},
      start: () => {},
      isActive: () => false
    }
  }
  return context
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisInstance | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const isRunningRef = useRef(false)
  const [LenisConstructorClass, setLenisConstructorClass] = useState<LenisConstructor | null>(null)
  const [isLenisLoaded, setIsLenisLoaded] = useState(false)

  // Load Lenis dynamically to avoid webpack issues
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis')
        if (typeof Lenis === 'function') {
          setLenisConstructorClass(() => Lenis)
          setIsLenisLoaded(true)
        } else {
          console.error('Lenis is not a constructor function:', typeof Lenis)
        }
      } catch (error) {
        console.error('Failed to load Lenis:', error)
        // Fallback: disable smooth scrolling
        setIsLenisLoaded(false)
      }
    }

    loadLenis()
  }, [])

  useEffect(() => {
    // Only initialize when Lenis is loaded and we're on client side
    if (!isLenisLoaded || !LenisConstructorClass || typeof window === 'undefined') return

    // Verify LenisConstructorClass is actually a constructor function
    if (typeof LenisConstructorClass !== 'function') {
      console.error('LenisConstructorClass is not a function:', typeof LenisConstructorClass, LenisConstructorClass)
      return
    }

    try {
      // Initialize Lenis instance
      const lenis = new LenisConstructorClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const,
        gestureOrientation: 'vertical' as const,
        smoothWheel: true,
        touchMultiplier: 2,
      }) as LenisInstance

      lenisRef.current = lenis
      isRunningRef.current = true
    } catch (error) {
      console.error('Failed to initialize Lenis:', error)
      return
    }

    // Improved RAF loop with proper state management
    function raf(time: number) {
      if (lenisRef.current && isRunningRef.current) {
        try {
          lenisRef.current.raf(time)
          rafIdRef.current = requestAnimationFrame(raf)
        } catch (error) {
          console.error('RAF error:', error)
          isRunningRef.current = false
          rafIdRef.current = null
        }
      } else {
        // RAF stops when not running - prevents unnecessary cycles
        rafIdRef.current = null
      }
    }

    // Start initial RAF
    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      isRunningRef.current = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy()
        } catch (error) {
          console.error('Error destroying Lenis:', error)
        } finally {
          lenisRef.current = null
        }
      }
    }
  }, [isLenisLoaded, LenisConstructorClass])

  // Memoized control functions with proper RAF coordination
  const stop = useCallback(() => {
    if (lenisRef.current) {
      try {
        lenisRef.current.stop()
        isRunningRef.current = false
        // Cancel current RAF to immediately stop the loop
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
      } catch (error) {
        console.error('Error stopping Lenis:', error)
      }
    }
  }, [])

  const start = useCallback(() => {
    if (lenisRef.current && !isRunningRef.current) {
      try {
        lenisRef.current.start()
        isRunningRef.current = true
        
        // Restart RAF loop
        function raf(time: number) {
          if (lenisRef.current && isRunningRef.current) {
            try {
              lenisRef.current.raf(time)
              rafIdRef.current = requestAnimationFrame(raf)
            } catch (error) {
              console.error('RAF error in start:', error)
              isRunningRef.current = false
              rafIdRef.current = null
            }
          } else {
            rafIdRef.current = null
          }
        }
        
        rafIdRef.current = requestAnimationFrame(raf)
      } catch (error) {
        console.error('Error starting Lenis:', error)
      }
    }
  }, [])

  const isActive = useCallback(() => {
    return isRunningRef.current && lenisRef.current !== null
  }, [])

  const contextValue: LenisContextType = {
    lenis: lenisRef.current,
    stop,
    start,
    isActive
  }

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  )
}