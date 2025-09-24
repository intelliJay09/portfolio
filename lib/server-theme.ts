/**
 * Server-Side Theme Utilities
 * Handles theme detection and cookie management for Next.js 15 App Router
 * Ensures server-side rendering consistency with client-side theme preferences
 */

import { cookies } from 'next/headers'
import { type Theme, validateThemeWithLogging, THEME_COOKIE_CONFIG } from './theme-security'

/**
 * Reads theme from server-side cookies using Next.js 15 async pattern
 * @returns Promise resolving to the user's theme preference
 */
export async function getServerTheme(): Promise<Theme> {
  try {
    const cookieStore = await cookies()
    const themeCookie = cookieStore.get(THEME_COOKIE_CONFIG.name)
    
    if (themeCookie?.value) {
      return validateThemeWithLogging(themeCookie.value, 'server-cookie')
    }
    
    // No theme cookie found, return default dark theme for luxury portfolio
    return 'dark'
  } catch (error) {
    console.warn('Failed to read theme cookie on server:', error)
    return 'dark' // Safe fallback to dark theme
  }
}

/**
 * Cookie configuration for server-side theme persistence
 * @param theme - Theme value to persist
 * @returns Cookie configuration object
 */
export function getServerThemeCookieConfig(theme: Theme) {
  return {
    name: THEME_COOKIE_CONFIG.name,
    value: theme,
    httpOnly: false, // Must be false for client-side sync
    secure: THEME_COOKIE_CONFIG.secure,
    sameSite: THEME_COOKIE_CONFIG.sameSite,
    maxAge: THEME_COOKIE_CONFIG.maxAge,
    path: THEME_COOKIE_CONFIG.path,
  }
}

/**
 * Server Action for updating theme cookie
 * Can be used in Server Components or called from Client Components
 * @param theme - New theme value to set
 */
export async function setServerTheme(theme: Theme): Promise<void> {
  'use server'
  
  try {
    const cookieStore = await cookies()
    const validatedTheme = validateThemeWithLogging(theme, 'server-action')
    
    cookieStore.set(getServerThemeCookieConfig(validatedTheme))
  } catch (error) {
    console.error('Failed to set theme cookie on server:', error)
    throw new Error('Failed to update theme preference')
  }
}

/**
 * Checks if theme cookie exists on the server
 * @returns Promise resolving to boolean indicating cookie presence
 */
export async function hasServerThemeCookie(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return cookieStore.has(THEME_COOKIE_CONFIG.name)
  } catch (error) {
    console.warn('Failed to check theme cookie existence:', error)
    return false
  }
}

/**
 * Gets theme from request headers (useful in middleware)
 * @param cookieHeader - Cookie header string from request
 * @returns Validated theme or default
 */
export function getThemeFromCookieHeader(cookieHeader: string | null): Theme {
  if (!cookieHeader) {
    return 'dark'
  }
  
  try {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    const themeCookie = cookies.find(cookie => 
      cookie.startsWith(`${THEME_COOKIE_CONFIG.name}=`)
    )
    
    if (themeCookie) {
      const themeValue = themeCookie.split('=')[1]
      return validateThemeWithLogging(themeValue, 'request-header')
    }
  } catch (error) {
    console.warn('Failed to parse theme from cookie header:', error)
  }
  
  return 'dark'
}

/**
 * Theme detection for SSR with comprehensive fallback strategy
 * Used in layout.tsx to ensure consistent server-client rendering
 * @returns Promise resolving to detected theme with fallbacks
 */
export async function detectServerTheme(): Promise<{
  theme: Theme
  source: 'cookie' | 'default'
  timestamp: string
}> {
  const timestamp = new Date().toISOString()
  
  try {
    const cookieStore = await cookies()
    const themeCookie = cookieStore.get(THEME_COOKIE_CONFIG.name)
    
    if (themeCookie?.value) {
      const theme = validateThemeWithLogging(themeCookie.value, 'ssr-detection')
      return {
        theme,
        source: 'cookie',
        timestamp
      }
    }
  } catch (error) {
    console.warn('Server theme detection error:', error)
  }
  
  // Default to dark theme for luxury portfolio positioning
  return {
    theme: 'dark',
    source: 'default',
    timestamp
  }
}