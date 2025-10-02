'use client'

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals Reporter for Luxury Portfolio Site
 * Tracks Core Web Vitals metrics for SEO performance monitoring
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Google Analytics 4 - Enhanced eCommerce tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          custom_map: {
            metric_id: 'dimension1',
            metric_value: 'metric1',
            metric_delta: 'metric2',
          },
        })
      }

      // Performance monitoring for luxury site standards
      const performanceData = {
        name: metric.name,
        id: metric.id,
        value: metric.value,
        delta: metric.delta,
        rating: getVitalsRating(metric.name, metric.value),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }

      // Send to your analytics endpoint
      // fetch('/api/analytics/web-vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(performanceData),
      // }).catch(console.error)
    }
  })

  return null
}

/**
 * Get performance rating based on Core Web Vitals thresholds
 * Luxury sites should aim for "good" ratings across all metrics
 */
function getVitalsRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      if (value <= 2500) return 'good'
      if (value <= 4000) return 'needs-improvement'
      return 'poor'
    
    case 'FID':
      if (value <= 100) return 'good'
      if (value <= 300) return 'needs-improvement'
      return 'poor'
    
    case 'INP':
      if (value <= 200) return 'good'
      if (value <= 500) return 'needs-improvement'
      return 'poor'
    
    case 'CLS':
      if (value <= 0.1) return 'good'
      if (value <= 0.25) return 'needs-improvement'
      return 'poor'
    
    case 'FCP':
      if (value <= 1800) return 'good'
      if (value <= 3000) return 'needs-improvement'
      return 'poor'
    
    case 'TTFB':
      if (value <= 800) return 'good'
      if (value <= 1800) return 'needs-improvement'
      return 'poor'
    
    default:
      return 'good'
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      parameters?: {
        event_category?: string
        event_label?: string
        value?: number
        non_interaction?: boolean
        custom_map?: Record<string, string>
      }
    ) => void
  }
}