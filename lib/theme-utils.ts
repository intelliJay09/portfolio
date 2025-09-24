export type Theme = 'light' | 'dark'

/**
 * Validates if a string is a valid theme value
 */
export function validateTheme(theme: string | null | undefined): Theme | null {
  return theme === 'light' || theme === 'dark' ? theme : null
}

/**
 * Gets the current theme from the DOM data-theme attribute
 */
export function getCurrentThemeFromDOM(): Theme {
  if (typeof document !== 'undefined') {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    return validateTheme(currentTheme) || 'dark' // Default to dark theme
  }
  return 'dark' // Default to dark theme for SSR
}

/**
 * Applies theme to DOM with performance optimizations
 */
export function applyThemeToDOM(theme: Theme, enableTransitions = true): void {
  if (typeof document === 'undefined') return

  // Performance optimization: use requestAnimationFrame for DOM updates
  requestAnimationFrame(() => {
    // Add transition class for smooth theme switching
    if (enableTransitions) {
      document.documentElement.classList.add('theme-transition')
      
      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition')
      }, 300)
    }

    // Apply theme attribute
    document.documentElement.setAttribute('data-theme', theme)
    
    // Update color-scheme for browser UI consistency
    document.documentElement.style.colorScheme = theme
    
    // Update theme-color meta tag for mobile browsers
    updateThemeColorMeta(theme)
    
    // Update Apple status bar style for iOS
    updateAppleStatusBar(theme)
  })
}

/**
 * Updates the theme-color meta tag for mobile browsers
 */
export function updateThemeColorMeta(theme: Theme): void {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]')
  
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta')
    metaThemeColor.setAttribute('name', 'theme-color')
    document.head.appendChild(metaThemeColor)
  }
  
  metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff')
}

/**
 * Updates Apple-specific meta tags for iOS status bar styling
 */
export function updateAppleStatusBar(theme: Theme): void {
  let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
  
  if (!appleStatusBar) {
    appleStatusBar = document.createElement('meta')
    appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    document.head.appendChild(appleStatusBar)
  }
  
  appleStatusBar.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default')
}

/**
 * Gets system preference for theme
 */
export function getSystemThemePreference(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark' // Default to dark theme
}

/**
 * Gets theme from localStorage with validation
 */
export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('theme')
    return validateTheme(stored)
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return null
  }
}

/**
 * Stores theme to localStorage with error handling
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof localStorage === 'undefined') return
  
  try {
    localStorage.setItem('theme', theme)
  } catch (error) {
    console.warn('Failed to store theme to localStorage:', error)
  }
}

/**
 * Sets theme cookie for server-side persistence
 */
export function setThemeCookie(theme: Theme): void {
  if (typeof document === 'undefined') return
  
  try {
    document.cookie = [
      `theme=${theme}`,
      'path=/',
      `max-age=${60 * 60 * 24 * 365}`, // 1 year
      'SameSite=Lax',
      process.env.NODE_ENV === 'production' ? 'Secure' : ''
    ].filter(Boolean).join('; ')
  } catch (error) {
    console.warn('Failed to set theme cookie:', error)
  }
}

/**
 * Detects if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

/**
 * Creates a system theme change listener
 */
export function createSystemThemeListener(
  callback: (theme: Theme) => void,
  options: { respectStoredTheme?: boolean } = {}
): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = (e: MediaQueryListEvent) => {
    // Only apply system preference if no explicit theme is stored
    if (options.respectStoredTheme && getStoredTheme()) {
      return
    }
    
    const systemTheme = e.matches ? 'dark' : 'light'
    callback(systemTheme)
  }
  
  // Add listener with proper browser support
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }
}

/**
 * Preloads theme assets for better performance
 */
export function preloadThemeAssets(theme: Theme): void {
  if (typeof document === 'undefined') return
  
  // Preload CSS for the opposite theme for instant switching
  const oppositeTheme = theme === 'light' ? 'dark' : 'light'
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = `/_next/static/css/theme-${oppositeTheme}.css`
  
  // Only add if not already preloaded
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link)
  }
}

/**
 * Gets theme from server-side headers
 */
export function getServerTheme(headers: Headers): Theme {
  const serverTheme = headers.get('x-theme')
  return validateTheme(serverTheme) || 'dark'
}

/**
 * Performance monitoring for theme switches
 */
export function measureThemeSwitch(themeOperation: () => void): number {
  if (typeof performance === 'undefined') {
    themeOperation()
    return 0
  }
  
  const startTime = performance.now()
  themeOperation()
  const endTime = performance.now()
  
  const duration = endTime - startTime
  
  // Log slow theme switches for debugging
  if (duration > 100) {
    console.warn(`Slow theme switch detected: ${duration.toFixed(2)}ms`)
  }
  
  return duration
}

/**
 * Theme debugging utilities
 */
export const themeDebug = {
  logCurrentState: () => {
    if (typeof console === 'undefined') return
    
    console.group('Theme Debug Info')
    console.log('Current DOM theme:', getCurrentThemeFromDOM())
    console.log('Stored theme:', getStoredTheme())
    console.log('System preference:', getSystemThemePreference())
    console.log('Prefers reduced motion:', prefersReducedMotion())
    console.groupEnd()
  },
  
  testThemeSwitch: () => {
    const currentTheme = getCurrentThemeFromDOM()
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    
    console.log(`Testing theme switch: ${currentTheme} → ${newTheme}`)
    
    const duration = measureThemeSwitch(() => {
      applyThemeToDOM(newTheme, false) // No transitions for testing
    })
    
    console.log(`Theme switch completed in ${duration.toFixed(2)}ms`)
    
    // Switch back after 1 second
    setTimeout(() => {
      applyThemeToDOM(currentTheme, false)
      console.log('Theme reverted')
    }, 1000)
  }
}