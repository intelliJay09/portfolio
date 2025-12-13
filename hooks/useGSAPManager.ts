'use client'

import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP plugin registration moved inside hook to prevent module-level execution

interface GSAPManagerConfig {
  componentId: string
  enableDebug?: boolean
  debugMode?: boolean
}

interface GSAPManager {
  registerTween: (tween: gsap.core.Tween) => void
  registerScrollTrigger: (trigger: ScrollTrigger) => void
  cleanup: () => void
  killTween: (tween: gsap.core.Tween) => void
  killScrollTrigger: (trigger: ScrollTrigger) => void
  getActiveAnimations: () => {
    tweens: gsap.core.Tween[]
    scrollTriggers: ScrollTrigger[]
  }
  // Helper functions for easy component usage
  createTween: (target: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.core.Tween
  createFromToTween: (target: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => gsap.core.Tween
  createTimeline: (vars?: gsap.TimelineVars) => gsap.core.Timeline
  createScrollTrigger: (vars: ScrollTrigger.Vars) => ScrollTrigger
  pauseAll: () => void
  resumeAll: () => void
  gsap: typeof gsap // Export gsap instance for direct use
}

/**
 * Component-specific GSAP animation manager
 * Provides isolated cleanup and prevents cross-component animation conflicts
 */
export function useGSAPManager(config: GSAPManagerConfig): GSAPManager {
  const { componentId, enableDebug = false, debugMode = false } = config
  const debug = enableDebug || debugMode
  
  const tweensRef = useRef<Set<gsap.core.Tween>>(new Set())
  const scrollTriggersRef = useRef<Set<ScrollTrigger>>(new Set())
  const isCleanedUpRef = useRef(false)
  const isRegistered = useRef(false)

  // Register GSAP plugins only once, on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && !isRegistered.current) {
      gsap.registerPlugin(ScrollTrigger)
      isRegistered.current = true
    }
  }, [])

  // Register a tween for component-specific cleanup
  const registerTween = useCallback((tween: gsap.core.Tween) => {
    if (isCleanedUpRef.current) return
    
    tweensRef.current.add(tween)
    
    if (debug) {
      console.log(`[${componentId}] Registered tween:`, tween)
    }
    
    // Clean up from set when tween completes or is killed
    const originalKill = tween.kill.bind(tween)
    tween.kill = () => {
      tweensRef.current.delete(tween)
      return originalKill()
    }
  }, [componentId, debug])

  // Register a ScrollTrigger for component-specific cleanup
  const registerScrollTrigger = useCallback((trigger: ScrollTrigger) => {
    if (isCleanedUpRef.current) return
    
    scrollTriggersRef.current.add(trigger)
    
    if (debug) {
      console.log(`[${componentId}] Registered ScrollTrigger:`, trigger)
    }
    
    // Clean up from set when ScrollTrigger is killed
    const originalKill = trigger.kill.bind(trigger)
    trigger.kill = () => {
      scrollTriggersRef.current.delete(trigger)
      return originalKill()
    }
  }, [componentId, debug])

  // Kill specific tween
  const killTween = useCallback((tween: gsap.core.Tween) => {
    if (tweensRef.current.has(tween)) {
      tween.kill()
      tweensRef.current.delete(tween)
    }
  }, [])

  // Kill specific ScrollTrigger
  const killScrollTrigger = useCallback((trigger: ScrollTrigger) => {
    if (scrollTriggersRef.current.has(trigger)) {
      trigger.kill()
      scrollTriggersRef.current.delete(trigger)
    }
  }, [])

  // Get current active animations
  const getActiveAnimations = useCallback(() => ({
    tweens: Array.from(tweensRef.current),
    scrollTriggers: Array.from(scrollTriggersRef.current)
  }), [])

  // Helper functions for easy component usage
  const createTween = useCallback((target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => {
    const tween = gsap.to(target, vars)
    registerTween(tween)
    return tween
  }, [registerTween])

  const createFromToTween = useCallback((
    target: gsap.TweenTarget, 
    fromVars: gsap.TweenVars, 
    toVars: gsap.TweenVars
  ): gsap.core.Tween => {
    const tween = gsap.fromTo(target, fromVars, toVars)
    registerTween(tween)
    return tween
  }, [registerTween])

  const createTimeline = useCallback((vars?: gsap.TimelineVars): gsap.core.Timeline => {
    const timeline = gsap.timeline(vars)
    registerTween(timeline as any) // Timeline extends Tween
    return timeline
  }, [registerTween])

  const createScrollTrigger = useCallback((vars: ScrollTrigger.Vars): ScrollTrigger => {
    const trigger = ScrollTrigger.create(vars)
    registerScrollTrigger(trigger)
    return trigger
  }, [registerScrollTrigger])

  // Pause all registered tweens
  const pauseAll = useCallback(() => {
    tweensRef.current.forEach(tween => {
      if (tween && typeof tween.pause === 'function') {
        tween.pause()
      }
    })
  }, [])

  // Resume all registered tweens
  const resumeAll = useCallback(() => {
    tweensRef.current.forEach(tween => {
      if (tween && typeof tween.resume === 'function') {
        tween.resume()
      }
    })
  }, [])

  // Component-specific cleanup function
  const cleanup = useCallback(() => {
    if (isCleanedUpRef.current) return

    if (debug) {
      console.log(`[${componentId}] Cleaning up:`, {
        tweens: tweensRef.current.size,
        scrollTriggers: scrollTriggersRef.current.size
      })
    }

    // Kill all registered tweens
    tweensRef.current.forEach(tween => {
      if (tween && typeof tween.kill === 'function') { // Check if tween exists and has kill method
        try {
          tween.kill()
        } catch (error) {
          console.warn(`[${componentId}] Error killing tween:`, error)
        }
      }
    })

    // Kill all registered ScrollTriggers
    scrollTriggersRef.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        try {
          trigger.kill()
        } catch (error) {
          console.warn(`[${componentId}] Error killing ScrollTrigger:`, error)
        }
      }
    })

    // Clear the sets
    tweensRef.current.clear()
    scrollTriggersRef.current.clear()
    isCleanedUpRef.current = true

    if (debug) {
      console.log(`[${componentId}] Cleanup complete`)
    }
  }, [componentId, debug])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Reset cleanup flag when component remounts
  useEffect(() => {
    isCleanedUpRef.current = false
  }, [])

  return {
    registerTween,
    registerScrollTrigger,
    cleanup,
    killTween,
    killScrollTrigger,
    getActiveAnimations,
    createTween,
    createFromToTween,
    createTimeline,
    createScrollTrigger,
    pauseAll,
    resumeAll,
    gsap // Export gsap instance for direct use
  }
}

// Enhanced GSAP creation helpers that auto-register
export function createTween(
  manager: GSAPManager,
  target: gsap.TweenTarget,
  vars: gsap.TweenVars
): gsap.core.Tween {
  const tween = gsap.to(target, vars)
  manager.registerTween(tween)
  return tween
}

export function createFromToTween(
  manager: GSAPManager,
  target: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars
): gsap.core.Tween {
  const tween = gsap.fromTo(target, fromVars, toVars)
  manager.registerTween(tween)
  return tween
}

export function createTimeline(
  manager: GSAPManager,
  vars?: gsap.TimelineVars
): gsap.core.Timeline {
  const timeline = gsap.timeline(vars)
  
  // Register timeline as a tween (Timeline extends Tween)
  manager.registerTween(timeline as any)
  
  return timeline
}

export function createScrollTrigger(
  manager: GSAPManager,
  vars: ScrollTrigger.Vars
): ScrollTrigger {
  const trigger = ScrollTrigger.create(vars)
  manager.registerScrollTrigger(trigger)
  return trigger
}

// Debug utilities
export function debugGSAPManager(componentId?: string) {
  if (typeof window === 'undefined') return
  
  const allTriggers = ScrollTrigger.getAll()
  const allTweens = gsap.globalTimeline.getChildren()
  
  console.group(`🎬 GSAP Debug ${componentId ? `[${componentId}]` : '(Global)'}`)
  console.log('📊 ScrollTriggers:', allTriggers.length, allTriggers)
  console.log('🎭 Tweens:', allTweens.length, allTweens)
  console.log('💾 Memory usage:', {
    triggers: allTriggers.length,
    tweens: allTweens.length,
    total: allTriggers.length + allTweens.length
  })
  console.groupEnd()
  
  return {
    triggers: allTriggers,
    tweens: allTweens,
    total: allTriggers.length + allTweens.length
  }
}