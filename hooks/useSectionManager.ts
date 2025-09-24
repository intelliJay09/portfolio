'use client'

import { useRef, useEffect, useState } from 'react'

interface SectionManagerConfig {
  id: string
  minHeight?: 'screen' | 'auto'
  spacing?: {
    top?: number
    bottom?: number
  }
}

interface SectionManager {
  sectionRef: React.RefObject<HTMLElement | null>
  isVisible: boolean
}

/**
 * Section layout manager
 * Provides basic section management functionality
 */
export function useSectionManager(config: SectionManagerConfig): SectionManager {
  const { id } = config
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return {
    sectionRef,
    isVisible
  }
}