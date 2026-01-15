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
      // Send to your analytics endpoint
      // fetch('/api/analytics/web-vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: metric.name,
      //     id: metric.id,
      //     value: metric.value,
      //     delta: metric.delta,
      //     rating: getVitalsRating(metric.name, metric.value),
      //     timestamp: Date.now(),
      //     url: window.location.href,
      //     userAgent: navigator.userAgent,
      //   }),
      // }).catch(console.error)
    }
  })

  return null
}

/**
 * Get performance rating based on Core Web Vitals thresholds
 * Luxury sites should aim for "good" ratings across all metrics
 */