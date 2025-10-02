'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TeachingTeaser() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const mobileBadgesRef = useRef<HTMLDivElement>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [buttonMousePosition, setButtonMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Register GSAP plugin on client side only
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
    
    const section = sectionRef.current
    const content = contentRef.current
    const badges = badgesRef.current
    const mobileBadges = mobileBadgesRef.current

    if (!section || !content || (!badges && !mobileBadges)) return

    // Check if section is already in viewport on mount (refresh case)
    const isInViewport = () => {
      const sectionRect = section.getBoundingClientRect()
      return sectionRect.top < window.innerHeight * 0.7
    }

    // Set initial state based on viewport position
    const elementsToAnimate = [content, badges, mobileBadges].filter(Boolean)
    
    if (isInViewport()) {
      // If already in viewport (refresh case), show content immediately
      gsap.set(elementsToAnimate, { opacity: 1, y: 0 })
    } else {
      // If below viewport, set up for animation
      gsap.set(elementsToAnimate, { opacity: 0, y: 60 })
    }

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse'
      }
    })

    // Staggered entrance animations
    tl.to(content, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
    
    // Desktop badges animation
    if (badges) {
      tl.to(badges, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)'
      }, '-=0.6')
    }
    
    // Mobile badges animation
    if (mobileBadges) {
      tl.to(mobileBadges, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)'
      }, '-=0.6')
    }

    // Simplified video intersection observer
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting && video.paused) {
            console.log('Video entering viewport, attempting to play')
            video.play().catch((error) => {
              console.warn('Video autoplay failed:', error.message)
            })
          } else if (!entry.isIntersecting && !video.paused) {
            console.log('Video leaving viewport, pausing')
            video.pause()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (videoRef.current) {
      videoObserver.observe(videoRef.current)
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      videoObserver.disconnect()
    }
  }, [])

  const handleButtonMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    // Calculate offset from center with reduced sensitivity
    const offsetX = (mouseX - centerX) * 0.15
    const offsetY = (mouseY - centerY) * 0.1
    
    setButtonMousePosition({ x: offsetX, y: offsetY })
  }

  return (
    <section 
      ref={sectionRef}
      className="teaching-section relative w-full min-h-screen overflow-visible bg-black"
      style={{
        clipPath: 'inset(0)'
      }}
    >
      
      {/* Video Background - Simplified Robust Implementation */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Poster Image - Always Show as Fallback */}
        <img 
          src="/images/girlcode-teaching-1.jpg" 
          alt="Teaching and mentorship background" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => console.error('Poster image failed to load')}
          onLoad={() => console.log('Poster image loaded successfully')}
        />
        
        {/* Video Element - Overlay on top of poster */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          onError={(e) => {
            // Try fallback video if primary fails
            const sources = e.currentTarget.querySelectorAll('source')
            const currentSrc = e.currentTarget.currentSrc || e.currentTarget.src
            if (currentSrc.includes('mentorship-background.mp4')) {
              e.currentTarget.load()
            }
          }}
          style={{
            transform: 'scale(1.01)'
          }}
        >
          <source src="/images/mentorship-background.mp4" type="video/mp4" />
          <source src="/images/gc-teaching-full.mp4" type="video/mp4" />
        </video>
        
        {/* Premium Gradient Overlays - Museum Quality */}
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse at 30% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)'
          }}
        />
      </div>

      {/* Content Container - Museum Gallery Layout */}
      <div className="relative z-10 h-full min-h-screen flex items-center" style={{ paddingBottom: '60px', paddingTop: '30px' }}>
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          
          {/* Museum Gallery Grid Layout */}
          <div className="grid lg:grid-cols-12 h-full items-center gap-8 lg:gap-16">
            
            {/* Main Content - Gallery Exhibition Style */}
            <div className="lg:col-span-7 xl:col-span-8 overflow-hidden">
              <div 
                ref={contentRef}
                className="w-full max-w-4xl opacity-0 transform translate-y-16 text-center lg:text-left py-8 lg:py-16 lg:pl-24"
              >
                {/* Eyebrow Text - Museum Label Style */}
                <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
                  <div className="w-16 h-px bg-white/30"></div>
                  <span className="text-white/70 font-light tracking-[0.25em] text-xs uppercase">
                    Teaching & Mentorship
                  </span>
                </div>

                {/* Main Headline - Gallery Exhibition Piece */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-white mb-8 leading-[1.3] md:leading-[1.2] lg:leading-[0.85] tracking-[0.02em]">
                  Nurturing Tomorrow&apos;s
                  <br />
                  <span className="font-light">Tech Leaders</span>
                </h2>

                {/* Description - Exhibition Context */}
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-[1.5] font-light mb-8 lg:mb-16 mx-auto lg:mx-0">
                  Empowering young girls to build the future of technology 
                  through hands-on coding mentorship.
                </p>

                {/* Mobile Statistics - Above Button */}
                <div className="lg:hidden mb-12">
                  <div 
                    ref={mobileBadgesRef}
                    className="flex gap-4 justify-center overflow-x-auto pb-4 snap-x snap-mandatory opacity-0 transform translate-y-8 px-6"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    
                    {/* Mobile Students Badge */}
                    <motion.div 
                      className="flex-shrink-0 min-w-[120px] px-5 py-3 rounded-full backdrop-blur-2xl border cursor-pointer snap-start"
                      animate={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        scale: 1
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                        transition: { duration: 0.15, type: "spring", stiffness: 400 }
                      }}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">150+</div>
                        <div className="text-xs text-white/60 uppercase tracking-[0.1em] font-light">Students</div>
                      </div>
                    </motion.div>
                    
                    {/* Mobile Success Rate Badge */}
                    <motion.div 
                      className="flex-shrink-0 min-w-[120px] px-5 py-3 rounded-full backdrop-blur-2xl border cursor-pointer snap-start"
                      animate={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        scale: 1
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                        transition: { duration: 0.15, type: "spring", stiffness: 400 }
                      }}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">95%</div>
                        <div className="text-xs text-white/60 uppercase tracking-[0.1em] font-light">Success</div>
                      </div>
                    </motion.div>
                    
                    {/* Mobile Cohorts Badge */}
                    <motion.div 
                      className="flex-shrink-0 min-w-[120px] px-5 py-3 rounded-full backdrop-blur-2xl border cursor-pointer snap-start"
                      animate={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        scale: 1
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                        transition: { duration: 0.15, type: "spring", stiffness: 400 }
                      }}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">15</div>
                        <div className="text-xs text-white/60 uppercase tracking-[0.1em] font-light">Cohorts</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* CTA Button - Premium Glass Treatment */}
                <div className="flex justify-center lg:justify-start">
                  <motion.div
                    className="inline-block"
                  initial={{ scale: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -3,
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    x: buttonMousePosition.x,
                    y: buttonMousePosition.y + (isButtonHovered ? -3 : 0),
                    rotate: buttonMousePosition.x * 0.02,
                    transition: {
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                      mass: 0.1
                    }
                  }}
                >
                  <Link
                    href="/about#teaching"
                    className="group inline-flex items-center gap-4 px-12 py-5 rounded-full backdrop-blur-2xl font-light text-lg tracking-[0.02em] transition-all duration-700"
                    style={{
                      background: isButtonHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                      border: `1.5px solid ${isButtonHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)'}`,
                      boxShadow: isButtonHovered 
                        ? '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        : '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => {
                      setIsButtonHovered(false)
                      setButtonMousePosition({ x: 0, y: 0 })
                    }}
                    onMouseMove={handleButtonMouseMove}
                  >
                    <span className="text-white">
                      Learn More
                    </span>
                    <svg 
                      className="w-5 h-5 text-white/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Vertical Statistics Column - Museum Gallery Style */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center items-center">
              <div 
                ref={badgesRef}
                className="opacity-0 transform translate-y-8 hidden lg:flex flex-col gap-6"
                style={{
                  paddingTop: 'clamp(2rem, 6vh, 4rem)',
                  paddingLeft: 'clamp(1rem, 4vw, 3rem)'
                }}
              >
                {/* Students Badge - Enhanced Gallery Style */}
                <motion.div 
                  className="px-8 py-4 rounded-full backdrop-blur-2xl border border-white/15 cursor-pointer min-w-[140px]"
                  initial={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -12,
                    rotate: 2,
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-3xl font-light text-white mb-1"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.2 } 
                      }}
                    >150+</motion.div>
                    <div className="text-xs text-white/60 uppercase tracking-[0.15em] font-light">Students</div>
                  </div>
                </motion.div>

                {/* Success Rate Badge - Enhanced Gallery Style */}
                <motion.div 
                  className="px-8 py-4 rounded-full backdrop-blur-2xl border border-white/15 cursor-pointer min-w-[140px]"
                  initial={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -12,
                    rotate: -2,
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1
                    }
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-3xl font-light text-white mb-1"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.2 } 
                      }}
                    >95%</motion.div>
                    <div className="text-xs text-white/60 uppercase tracking-[0.15em] font-light">Success</div>
                  </div>
                </motion.div>

                {/* Cohorts Badge - Enhanced Gallery Style */}
                <motion.div 
                  className="px-8 py-4 rounded-full backdrop-blur-2xl border border-white/15 cursor-pointer min-w-[140px]"
                  initial={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -12,
                    rotate: 1,
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2
                    }
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-3xl font-light text-white mb-1"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.2 } 
                      }}
                    >15</motion.div>
                    <div className="text-xs text-white/60 uppercase tracking-[0.15em] font-light">Cohorts</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}