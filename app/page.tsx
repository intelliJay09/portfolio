'use client'

import { useState, useRef, useEffect } from 'react'
import InitialPreloader from '../components/InitialPreloader'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import FeaturedProjects from '../components/FeaturedProjects'
import DesignPhilosophy from '../components/DesignPhilosophy'
import TeachingTeaser from '../components/TeachingTeaser'
import Footer from '../components/Footer'

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const pageContentRef = useRef<HTMLDivElement>(null)


  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  // Failsafe: ensure content becomes visible and unblurred after reasonable time
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!preloaderComplete) {
        setPreloaderComplete(true)
      }
      // Additional failsafe to ensure blur is removed
      if (pageContentRef.current) {
        pageContentRef.current.style.filter = 'none'
        pageContentRef.current.style.transform = 'none'
      }
    }, 8000) // Extended timeout to account for longer smooth transition

    return () => clearTimeout(timeout)
  }, [preloaderComplete])


  // Ensure blur is removed when preloader completes
  useEffect(() => {
    if (preloaderComplete && pageContentRef.current) {
      // Force remove any lingering filters
      pageContentRef.current.style.filter = 'none'
      pageContentRef.current.style.transform = 'none'
    }
  }, [preloaderComplete])

  return (
    <>
      {!preloaderComplete && (
        <InitialPreloader 
          onComplete={handlePreloaderComplete} 
          pageContentRef={pageContentRef}
        />
      )}
      
      <Navigation preloaderComplete={preloaderComplete} />
      
      <div 
        ref={pageContentRef}
        className={preloaderComplete ? 'opacity-100' : 'opacity-0'}
        style={{ 
          willChange: 'filter, transform, opacity'
        }}
      >
        <main>
          <Hero />
          <FeaturedProjects />
          <DesignPhilosophy />
          <TeachingTeaser />
        </main>
        <Footer />
      </div>
    </>
  )
}