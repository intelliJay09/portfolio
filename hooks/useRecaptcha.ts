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
  const siteKey = '6LdXkIUUAAAAAEfWttpDPZ1zOmLBpKoImbvGO-zn'

  useEffect(() => {
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
  }, [])

  const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    if (!isReady || !window.grecaptcha) {
      console.warn('reCAPTCHA not ready')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error)
      return null
    }
  }, [isReady])

  return {
    isLoaded,
    isReady,
    executeRecaptcha
  }
}