'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import testimonialsData from '../testimonials.json'

interface Testimonial {
  id: number
  quote: string
  clientName: string
  clientInfo: string
}

const testimonials: Testimonial[] = testimonialsData.testimonials

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Register GSAP plugin on client side only
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => setIsVisible(true),
        onLeave: () => setIsVisible(false),
        onEnterBack: () => setIsVisible(true),
        onLeaveBack: () => setIsVisible(false)
      },
    })

    // Parallax background animation
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        backgroundPosition: '50% 30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    }

    return () => {
      tl.kill()
    }
  }, [])

  // Function to start progress tracking for current testimonial
  const startProgressTracking = () => {
    // Clear any existing progress timer
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    
    // Reset progress to 0 for new testimonial
    setProgress(0)
    
    // Update progress every 50ms to show real progress through 6 seconds
    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const increment = (100 / 6000) * 50 // Progress per 50ms over 6 seconds
        const newProgress = prevProgress + increment
        
        // Don't exceed 100%
        if (newProgress >= 100) {
          return 100
        }
        return newProgress
      })
    }, 50)
  }

  // Auto-rotate testimonials when visible and not paused
  useEffect(() => {
    if (isVisible && !isPaused) {
      // Start progress tracking immediately for current testimonial
      startProgressTracking()
      
      // Auto-rotate testimonials every 6 seconds
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        )
      }, 6000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isVisible, isPaused])

  // Restart progress tracking when testimonial changes (but not if paused)
  useEffect(() => {
    if (isVisible && !isPaused) {
      startProgressTracking()
    }
  }, [currentIndex, isVisible, isPaused])

  const currentTestimonial = testimonials[currentIndex]

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)'
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: 'blur(2px)'
    }
  }


  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-background-primary py-16 lg:py-24"
    >
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 191, 31, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 191, 31, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 191, 31, 0.08) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
          backgroundPosition: '50% 50%'
        }}
      />

      <div className="container relative z-10">
        <div 
          className="max-w-4xl mx-auto text-center min-h-[80vh] flex flex-col justify-center space-y-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, ease: 'easeOut' }
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-satoshi text-primary mb-6">
                Client Success Stories
              </h2>
              <div 
                className="w-24 h-px mx-auto opacity-60"
                style={{
                  background: 'linear-gradient(to right, rgb(var(--color-accent)) 0%, rgb(var(--color-accent-hover)) 50%, transparent 100%)'
                }}
              ></div>
            </div>
          </motion.div>

          {/* Main Testimonial Content */}
          <div className="relative flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* Elegant Quote Icon */}
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-accent-hover mx-auto mb-8 flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' }
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-background-primary dark:text-text-primary">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" fill="currentColor"/>
                  </svg>
                </motion.div>
                
                {/* Main Quote */}
                <blockquote className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-text-primary leading-relaxed font-satoshi italic max-w-4xl mx-auto">
                  {currentTestimonial.quote}
                </blockquote>
                
                {/* Client Attribution */}
                <motion.div 
                  className="pt-8 space-y-2"
                  variants={textVariants}
                >
                  <p className="text-xl font-medium text-primary">
                    {currentTestimonial.clientName}
                  </p>
                  {currentTestimonial.clientInfo && (
                    <p className="text-lg text-accent font-medium">
                      {currentTestimonial.clientInfo}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar - Bottom */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 }
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-6">
              <div className="flex-1 max-w-md">
                <div 
                  className="w-full h-1 rounded-full overflow-hidden shadow-inner dark:bg-background-tertiary"
                  style={{ backgroundColor: '#A0A0A0' }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-75 ease-linear shadow-sm"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: 'var(--progress-fill-color, #1a1a1a)'
                    }}
                  />
                </div>
              </div>
              <div className="text-sm text-text-secondary font-medium min-w-[60px]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}