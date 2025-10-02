'use client'

import { useEffect } from 'react'

export default function NgrokSetup() {
  useEffect(() => {
    // Store the original fetch function
    const originalFetch = window.fetch

    // Override the global fetch function to always include ngrok header
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      // Create new headers object with ngrok header
      const headers = new Headers(init?.headers || {})
      headers.set('ngrok-skip-browser-warning', 'some_value')
      
      // Create new init object with updated headers
      const newInit: RequestInit = {
        ...init,
        headers,
      }
      
      // Call original fetch with new headers
      return originalFetch.call(this, input, newInit)
    }

    // Cleanup function to restore original fetch on unmount
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null // This component doesn't render anything
}