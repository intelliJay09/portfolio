'use client'

import { useEffect, useState, useCallback } from 'react'

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoadCallback: () => void
  }
}

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  useEffect(() => {
    // Check if siteKey is configured
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured')
      return
    }

    // Check if already loaded
    if (window.grecaptcha && window.grecaptcha.execute) {
      setIsLoaded(true)
      setIsReady(true)
      return
    }

    // Define callback
    window.onRecaptchaLoadCallback = () => {
      setIsLoaded(true)
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setIsReady(true)
        })
      }
    }

    // Load script
    if (!document.querySelector('script[src*="recaptcha"]')) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=onRecaptchaLoadCallback`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [siteKey])

  const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    if (!isReady || !window.grecaptcha) {
      console.warn('reCAPTCHA not ready')
      return null
    }

    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error)
      return null
    }
  }, [isReady, siteKey])

  return {
    isLoaded,
    isReady,
    executeRecaptcha
  }
}