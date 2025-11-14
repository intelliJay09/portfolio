'use client'

import { useEffect } from 'react'

export default function ImageProtection() {
  useEffect(() => {
    // Mark document as having ImageProtection active
    document.body.setAttribute('data-image-protection', 'true')
    
    // Disable right-click context menu
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable drag and drop
    const disableDrag = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Disable text selection on images
    const disableSelection = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.tagName === 'IMAGE' || target.tagName === 'SVG') {
        e.preventDefault()
        return false
      }
    }

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, F5 refresh
    const disableDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        return false
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault()
        return false
      }
      // Ctrl+A (Select All) - only disable on images
      if (e.ctrlKey && e.keyCode === 65) {
        const target = e.target as HTMLElement
        if (target.tagName === 'IMG' || target.tagName === 'IMAGE' || target.tagName === 'SVG') {
          e.preventDefault()
          return false
        }
      }
    }

    // Mobile touch events
    const disableTouchEvents = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.tagName === 'IMAGE' || target.tagName === 'SVG') {
        e.preventDefault()
        return false
      }
    }

    // Disable print screen (limited effectiveness)
    const disablePrintScreen = (e: KeyboardEvent) => {
      if (e.keyCode === 44) {
        e.preventDefault()
        return false
      }
    }

    // Dev tools detection
    const devtools = {
      open: false,
      orientation: null as string | null
    }

    const threshold = 160

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          Object.assign(devtools, { open: true })
          // Optional: Show warning message
          console.clear()
          console.log('%cImage Protection Active', 'color: red; font-size: 20px; font-weight: bold;')
          console.log('%cUnauthorized access to developer tools detected.', 'color: red; font-size: 14px;')
        }
      } else {
        Object.assign(devtools, { open: false })
      }
    }

    // Add event listeners
    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('dragstart', disableDrag)
    document.addEventListener('selectstart', disableSelection)
    document.addEventListener('keydown', disableDevTools)
    document.addEventListener('keydown', disablePrintScreen)
    
    // Mobile events
    document.addEventListener('touchstart', disableTouchEvents, { passive: false })
    document.addEventListener('touchend', disableTouchEvents, { passive: false })
    document.addEventListener('touchmove', disableTouchEvents, { passive: false })

    // Dev tools detection interval
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Disable developer tools console methods (partially effective)
    let consoleClearInterval: NodeJS.Timeout | null = null
    if (typeof window !== 'undefined') {
      // Clear console periodically
      consoleClearInterval = setInterval(() => {
        if (devtools.open) {
          console.clear()
        }
      }, 2000)

      // Override console methods
      const originalLog = console.log
      console.log = function(...args: unknown[]) {
        if (!devtools.open) {
          originalLog.apply(console, args)
        }
      }
    }

    // Cleanup function
    return () => {
      // Remove ImageProtection marker
      document.body.removeAttribute('data-image-protection')

      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('dragstart', disableDrag)
      document.removeEventListener('selectstart', disableSelection)
      document.removeEventListener('keydown', disableDevTools)
      document.removeEventListener('keydown', disablePrintScreen)
      document.removeEventListener('touchstart', disableTouchEvents)
      document.removeEventListener('touchend', disableTouchEvents)
      document.removeEventListener('touchmove', disableTouchEvents)
      clearInterval(devToolsInterval)
      if (consoleClearInterval) clearInterval(consoleClearInterval)
    }
  }, [])

  return null // This component doesn't render anything
}