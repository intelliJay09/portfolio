'use client'

import { useRef } from 'react'
import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

export function useScrollExpansion() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress for the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Create smooth spring-based animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Transform values for elegant expansion
  const containerWidth = useTransform(
    smoothProgress,
    [0, 1],
    ['95vw', '100vw']
  )

  const borderRadius = useTransform(
    smoothProgress,
    [0, 1],
    ['24px', '0px']
  )

  const containerScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [1, 1.02, 1]
  )

  // Shadow and backdrop effects
  const shadowIntensity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.15, 0.25, 0.4]
  )

  const backdropBlur = useTransform(
    smoothProgress,
    [0, 1],
    [0, 20]
  )

  // Card reveal animations with staggered timing
  const cardsOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 0.9, 1, 1]
  )

  const cardsY = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [20, 0, 0]
  )

  const cardsScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.95, 1, 1]
  )

  return {
    containerRef,
    // Container animations
    containerWidth,
    borderRadius,
    containerScale,
    shadowIntensity,
    backdropBlur,
    // Card animations
    cardsOpacity,
    cardsY,
    cardsScale,
    // Progress values
    scrollYProgress,
    smoothProgress
  }
}

export type ScrollExpansionReturn = ReturnType<typeof useScrollExpansion>