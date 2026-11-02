'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { pushEvent } from '../lib/analytics'

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

    // In production, hand the metric to GTM, which forwards it to GA4
    if (process.env.NODE_ENV === 'production') {
      pushEvent('web_vitals', {
        metric_name: metric.name,
        metric_id: metric.id,
        // CLS is a unitless fraction; scale it so it survives integer rounding
        metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  })

  return null
}
