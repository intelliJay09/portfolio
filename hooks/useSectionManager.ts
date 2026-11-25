'use client'

import { useRef, useEffect, useState } from 'react'

interface SectionManager {
  sectionRef: React.RefObject<HTMLElement | null>
  isVisible: boolean
}

/**
 * Section layout manager
 * Provides basic section management functionality
 */
export function useSectionManager(): SectionManager {
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

    const section = sectionRef.current
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return {
    sectionRef,
    isVisible
  }
}