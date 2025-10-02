/**
 * Theme Security Utilities
 * Provides secure validation and sanitization for theme values
 * Prevents XSS attacks and ensures type safety
 */

export type Theme = 'light' | 'dark'

/**
 * Valid theme values - used for validation
 */
const VALID_THEMES = ['light', 'dark'] as const

/**
 * Validates theme value with strict type checking
 * @param value - Unknown value to validate
 * @returns Valid theme or null if invalid
 */
export function validateTheme(value: unknown): Theme | null {
  if (typeof value === 'string' && VALID_THEMES.includes(value as Theme)) {
    return value as Theme
  }
  return null
}

/**
 * Sanitizes theme value by removing potentially dangerous characters
 * @param value - String value to sanitize
 * @returns Sanitized string containing only safe characters
 */
export function sanitizeThemeValue(value: string): string {
  // Remove all non-alphanumeric characters except hyphens
  return value.replace(/[^a-zA-Z0-9-]/g, '')
}

/**
 * Gets validated theme with fallback to default
 * @param value - Theme value to validate
 * @param fallback - Fallback theme (defaults to 'dark' for luxury portfolio)
 * @returns Valid theme value
 */
export function getValidTheme(value: unknown, fallback: Theme = 'dark'): Theme {
  const validated = validateTheme(value)
  return validated ?? fallback
}

/**
 * Security event logging for production monitoring
 * @param event - Security event type
 * @param details - Event details for logging
 */
export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'production') {
    console.warn(`[SECURITY] ${event}:`, JSON.stringify(details))
    // In production, this would integrate with monitoring service
    // Example: analytics.track('security_event', { event, ...details })
  }
}

/**
 * Validates theme with security logging
 * @param value - Value to validate
 * @param context - Context for logging (e.g., 'cookie', 'localStorage')
 * @returns Valid theme with security logging for invalid attempts
 */
export function validateThemeWithLogging(value: unknown, context: string = 'unknown'): Theme {
  const validatedTheme = validateTheme(value)
  
  if (!validatedTheme && value !== null && value !== undefined) {
    // Log potential attack or data corruption
    logSecurityEvent('INVALID_THEME_VALUE', {
      value,
      type: typeof value,
      context,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: new Date().toISOString()
    })
  }
  
  return validatedTheme ?? 'dark' // Default to dark theme for luxury portfolio
}

/**
 * Theme cookie configuration for secure handling
 */
export const THEME_COOKIE_CONFIG = {
  name: 'portfolio-theme',
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  path: '/',
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Must be false for client-side theme sync
} as const

/**
 * Creates secure cookie string for theme
 * @param theme - Theme value to set
 * @returns Secure cookie string
 */
export function createThemeCookieString(theme: Theme): string {
  const config = THEME_COOKIE_CONFIG
  const parts = [
    `${config.name}=${theme}`,
    `Max-Age=${config.maxAge}`,
    `Path=${config.path}`,
    `SameSite=${config.sameSite}`
  ]
  
  if (config.secure) {
    parts.push('Secure')
  }
  
  return parts.join('; ')
}