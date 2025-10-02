'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { type Theme, validateThemeWithLogging, THEME_COOKIE_CONFIG, createThemeCookieString } from '../lib/theme-security'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
  isLoading: boolean
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  enableSystemTheme?: boolean
  enableTransitions?: boolean
  serverTheme?: Theme // New: Accept server-detected theme
}

/**
 * Secure utility to get current theme from DOM (set by server-side rendering)
 * This respects the theme already set by our blocking script and SSR
 */
function getCurrentThemeFromDOM(): Theme {
  if (typeof document !== 'undefined') {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    return validateThemeWithLogging(currentTheme, 'dom-read') || 'dark'
  }
  return 'dark' // SSR fallback
}

/**
 * Enhanced theme DOM application with luxury transitions and security
 * Works in harmony with server-side rendering and blocking script
 */
function applyThemeToDOM(theme: Theme, enableTransitions = true) {
  if (typeof document === 'undefined') return

  try {
    // Enable instant theme switching for color/background properties only
    document.documentElement.setAttribute('data-theme-switching', 'true')
    
    // INSTANT: Apply theme immediately - no delays or transition classes
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme

    // Batch DOM queries and apply theme colors instantly
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    const appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    
    const themeColor = theme === 'dark' ? '#000000' : '#ffffff'
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor)
    }
    if (appleStatusBar) {
      appleStatusBar.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default')
    }

    // Remove theme switching flag after theme application to restore smooth animations
    setTimeout(() => {
      document.documentElement.removeAttribute('data-theme-switching')
    }, 50)

    // Dispatch event for components that need theme change notification
    const themeChangeEvent = new CustomEvent('themeChanged', { 
      detail: { theme, timestamp: Date.now() }
    })
    document.dispatchEvent(themeChangeEvent)
    
  } catch (error) {
    console.warn('Theme DOM application error:', error)
    // Fallback: at least try to set the basic theme
    try {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.removeAttribute('data-theme-switching')
    } catch (fallbackError) {
      console.error('Critical theme application failure:', fallbackError)
    }
  }
}

/**
 * Enhanced theme management hook with server-side integration
 * Works seamlessly with blocking script and SSR theme detection
 */
function useThemeManager(
  defaultTheme: Theme = 'dark',
  enableSystemTheme = true,
  enableTransitions = true,
  serverTheme?: Theme
) {
  const [theme, setThemeState] = useState<Theme | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Priority 1: Use server-detected theme if available (prevents hydration mismatch)
      // Priority 2: Read from DOM (set by SSR + blocking script)
      const initialTheme = serverTheme || getCurrentThemeFromDOM()
      setThemeState(initialTheme)
      setMounted(true)
      setIsLoading(false)

      // Enhanced system theme change listener for luxury experience
      if (enableSystemTheme) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          try {
            // Security: Only apply system preference if no explicit theme is stored
            const storedTheme = localStorage.getItem('theme')
            const validatedStored = validateThemeWithLogging(storedTheme, 'localStorage-system-check')
            
            if (!validatedStored) {
              const systemTheme = e.matches ? 'dark' : 'light'
              setThemeState(systemTheme)
              applyThemeToDOM(systemTheme, enableTransitions)
              
              // Sync with localStorage and secure cookie
              try {
                localStorage.setItem('theme', systemTheme)
                document.cookie = createThemeCookieString(systemTheme)
              } catch (storageError) {
                console.warn('Failed to sync system theme change:', storageError)
              }
            }
          } catch (error) {
            console.warn('System theme change handler error:', error)
          }
        }

        // Modern event listener with fallback
        const addListener = mediaQuery.addEventListener || mediaQuery.addListener
        const removeListener = mediaQuery.removeEventListener || mediaQuery.removeListener
        
        if (addListener) {
          addListener.call(mediaQuery, 'change', handleSystemThemeChange as EventListener)
        }

        return () => {
          try {
            if (removeListener) {
              removeListener.call(mediaQuery, 'change', handleSystemThemeChange as EventListener)
            }
          } catch (error) {
            console.warn('Failed to remove system theme listener:', error)
          }
        }
      }
    } catch (error) {
      console.error('Theme manager initialization error:', error)
      setThemeState(defaultTheme)
      setMounted(true)
      setIsLoading(false)
    }
  }, [enableSystemTheme, enableTransitions, serverTheme, defaultTheme])

  const setTheme = (newTheme: Theme) => {
    const validatedTheme = validateThemeWithLogging(newTheme, 'context-setTheme')
    setThemeState(validatedTheme)
    
    try {
      // Apply to DOM first for immediate visual feedback
      applyThemeToDOM(validatedTheme, enableTransitions)
      
      // Secure persistence: localStorage
      localStorage.setItem('theme', validatedTheme)
      
      // Secure persistence: cookie with proper security attributes
      document.cookie = createThemeCookieString(validatedTheme)
      
    } catch (error) {
      console.warn('Failed to persist theme preference:', error)
      // Critical: Even if storage fails, maintain visual theme
      try {
        applyThemeToDOM(validatedTheme, enableTransitions)
      } catch (domError) {
        console.error('Critical: Theme DOM application failed:', domError)
      }
    }
  }

  const toggleTheme = () => {
    if (!theme) return // Don't toggle before mount
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    theme: theme || defaultTheme,
    setTheme,
    toggleTheme,
    mounted,
    isLoading,
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  enableSystemTheme = true,
  enableTransitions = true,
  serverTheme,
}: ThemeProviderProps) {
  const themeManager = useThemeManager(defaultTheme, enableSystemTheme, enableTransitions, serverTheme)

  return (
    <ThemeContext.Provider value={themeManager}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Advanced theme utilities for luxury portfolio usage
export const themeUtils = {
  // Get theme from server-side headers with security validation
  getServerTheme: (headers: Headers): Theme => {
    const serverTheme = headers.get('x-portfolio-theme') || headers.get('x-theme')
    return validateThemeWithLogging(serverTheme, 'server-headers') || 'dark'
  },

  // Preload opposite theme for instant switching (luxury UX)
  preloadTheme: (theme: Theme) => {
    if (typeof document === 'undefined') return
    
    try {
      const oppositeTheme = theme === 'light' ? 'dark' : 'light'
      
      // Check if already preloaded
      const existingPreload = document.querySelector(`link[data-theme-preload="${oppositeTheme}"]`)
      if (existingPreload) return
      
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.setAttribute('data-theme-preload', oppositeTheme)
      // Note: This would be used with actual theme CSS files if they existed
      // For CSS-in-JS systems like ours, this is more conceptual
      link.href = `/themes/${oppositeTheme}.css`
      document.head.appendChild(link)
    } catch (error) {
      console.warn('Failed to preload theme:', error)
    }
  },

  // Re-export secure validation
  validateTheme: validateThemeWithLogging,

  // Re-export DOM utilities
  getCurrentThemeFromDOM,
  applyThemeToDOM,

  // New: Force theme sync across all storage mechanisms
  syncTheme: (theme: Theme) => {
    try {
      const validatedTheme = validateThemeWithLogging(theme, 'sync-operation')
      
      // DOM
      applyThemeToDOM(validatedTheme, false) // No transitions for sync
      
      // localStorage
      localStorage.setItem('theme', validatedTheme)
      
      // Secure cookie
      document.cookie = createThemeCookieString(validatedTheme)
      
      return validatedTheme
    } catch (error) {
      console.error('Theme sync failed:', error)
      return 'dark'
    }
  }
}