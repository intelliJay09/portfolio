import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateThemeWithLogging, THEME_COOKIE_CONFIG } from './lib/theme-security'
import { getThemeFromCookieHeader } from './lib/server-theme'
import type { Theme } from './lib/theme-security'

/**
 * Enhanced system preference detection from request headers
 * Provides intelligent fallbacks for luxury portfolio dark theme preference
 */
function getSystemPreferenceFromHeaders(request: NextRequest): Theme {
  try {
    // Priority 1: Sec-CH-Prefers-Color-Scheme header (modern browsers)
    const colorSchemeHeader = request.headers.get('sec-ch-prefers-color-scheme')
    if (colorSchemeHeader === 'dark') return 'dark'
    if (colorSchemeHeader === 'light') return 'light'
    
    // Priority 2: Accept header analysis for theme hints
    const acceptHeader = request.headers.get('accept') || ''
    if (acceptHeader.includes('dark')) return 'dark'
    
    // Priority 3: User-Agent analysis for luxury device detection
    const userAgent = request.headers.get('user-agent') || ''
    const isDesktop = !userAgent.match(/Mobile|Android|iPhone|iPad/)
    
    // Priority 4: Time-based heuristic (luxury users prefer dark in evening)
    const hour = new Date().getHours()
    const isEveningHours = hour < 8 || hour > 17 // Professional hours
    
    // Luxury portfolio bias: default to dark for sophistication
    // Desktop users and evening hours strongly suggest dark preference
    if (isDesktop || isEveningHours) return 'dark'
    
  } catch (error) {
    // Log middleware errors for monitoring
    console.warn('Middleware theme detection error:', error)
  }
  
  // Ultimate fallback: dark theme for luxury portfolio positioning
  return 'dark'
}

/**
 * Enhanced Next.js 15 middleware with secure theme management
 * Handles theme detection, cookie security, and performance optimization
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Essential: Add ngrok skip browser warning for development
  response.headers.set('ngrok-skip-browser-warning', 'any-value')
  
  try {
    // Secure Theme Detection and Management
    // Method 1: Get theme from secure cookie using new naming convention
    const portfolioThemeCookie = request.cookies.get(THEME_COOKIE_CONFIG.name)?.value
    const validatedCookieTheme = portfolioThemeCookie 
      ? validateThemeWithLogging(portfolioThemeCookie, 'middleware-cookie')
      : null
    
    // Method 2: Parse from raw cookie header for additional security
    const cookieHeader = request.headers.get('cookie')
    const headerTheme = getThemeFromCookieHeader(cookieHeader)
    
    // Method 3: System preference detection
    const systemPreference = getSystemPreferenceFromHeaders(request)
    
    // Theme Priority Resolution: cookie > header-parsed > system > dark
    const resolvedTheme = validatedCookieTheme || 
                         (headerTheme !== 'dark' ? headerTheme : null) ||
                         systemPreference
    
    // Cookie Management: Set secure cookie if not present or invalid
    if (!validatedCookieTheme || validatedCookieTheme !== resolvedTheme) {
      response.cookies.set({
        name: THEME_COOKIE_CONFIG.name,
        value: resolvedTheme,
        httpOnly: THEME_COOKIE_CONFIG.httpOnly, // false for client sync
        secure: THEME_COOKIE_CONFIG.secure,
        sameSite: THEME_COOKIE_CONFIG.sameSite,
        maxAge: THEME_COOKIE_CONFIG.maxAge,
        path: THEME_COOKIE_CONFIG.path,
      })
    }
    
    // Server Component Integration: Add theme to response headers
    response.headers.set('x-portfolio-theme', resolvedTheme)
    response.headers.set('x-theme-source', validatedCookieTheme ? 'cookie' : 'detected')
    
    // Performance Optimization: Enhanced cache headers
    const pathname = request.nextUrl.pathname
    
    if (pathname.startsWith('/_next/static/')) {
      // Static assets: aggressive caching
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    } else if (pathname.startsWith('/_next/')) {
      // Next.js internals: moderate caching
      response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    } else if (pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|webp|svg)$/)) {
      // Asset files: theme-aware caching
      response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
      response.headers.set('Vary', 'Cookie') // Vary by theme cookie
    }
    
    // Security Headers: Enhanced protection
    if (!pathname.startsWith('/_next/')) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      
      // CSP for theme security (development vs production)
      const isDev = process.env.NODE_ENV === 'development'
      const gtmDomains = 'https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://analytics.google.com'
      const recaptchaDomains = 'https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/'
      const cspHeader = isDev
        ? `default-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${gtmDomains} ${recaptchaDomains}; frame-src 'self' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://recaptcha.google.com/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${gtmDomains} https://www.google.com/recaptcha/;`
        : `default-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${gtmDomains} ${recaptchaDomains} https://static.cloudflareinsights.com; frame-src 'self' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://recaptcha.google.com/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${gtmDomains} https://static.cloudflareinsights.com https://www.google.com/recaptcha/;`

      response.headers.set('Content-Security-Policy', cspHeader)
    }
    
  } catch (error) {
    // Graceful fallback: log error but don't break the request
    console.error('Middleware error:', error)
    
    // Ensure theme header is always set
    if (!response.headers.get('x-portfolio-theme')) {
      response.headers.set('x-portfolio-theme', 'dark')
      response.headers.set('x-theme-source', 'fallback')
    }
  }
  
  return response
}

export const config = {
  // Match all paths except API routes, static files, and internal Next.js routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}