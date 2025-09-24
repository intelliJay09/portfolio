'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { useGSAPManager } from '../hooks/useGSAPManager'
import content from '../content.json'

export default function Footer() {
  const [localTime, setLocalTime] = useState<string>('')
  const emailButtonRef = useRef<HTMLAnchorElement>(null)
  const phoneButtonRef = useRef<HTMLAnchorElement>(null)
  const touchButtonRef = useRef<HTMLAnchorElement>(null)
  const availabilityInfoRef = useRef<HTMLDivElement>(null)
  
  // Component isolation with GSAP manager
  const { createScrollTrigger, createTween, gsap, cleanup } = useGSAPManager({ 
    componentId: 'footer',
    debugMode: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const ghanaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Accra',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now)
      
      setLocalTime(`${ghanaTime} GMT+0`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Footer reveal effect with isolated ScrollTrigger
  useEffect(() => {
    // Early return if GSAP manager is not ready
    if (!gsap || !createScrollTrigger) {
      console.warn('[Footer] GSAP manager not ready, skipping ScrollTrigger setup')
      return cleanup
    }

    const footer = document.querySelector('.footer-reveal')
    
    if (!footer) {
      console.warn('[Footer] Footer element not found, skipping ScrollTrigger setup')
      return cleanup
    }

    try {
      // Check if footer is already in viewport on mount (refresh case)
      const footerRect = footer.getBoundingClientRect()
      const isInViewport = footerRect.top < window.innerHeight
      
      if (isInViewport) {
        // If already in viewport (refresh case), show footer immediately
        gsap.set(footer, {
          clipPath: 'inset(0 0 0% 0)'
        })
      }

      // Create isolated ScrollTrigger for footer reveal with comprehensive error handling
      createScrollTrigger({
        trigger: footer,
        start: "top bottom", // Start when footer top hits bottom of viewport
        end: "top top", // End when footer top hits top of viewport
        scrub: 1, // Smooth scroll-tied animation with slight catch-up
        onUpdate: (self) => {
          try {
            // Verify elements still exist before animation
            const footerElement = document.querySelector('.footer-reveal')
            if (!footerElement || !gsap || !self) {
              return
            }

            // Calculate progress for bottom-to-top reveal
            const progress = self.progress
            const insetValue = Math.max(0, Math.min(100, 100 - (progress * 100))) // Clamp between 0-100
            
            gsap.set(footerElement, {
              clipPath: `inset(0 0 ${insetValue}% 0)` // Bottom-to-top reveal
            })
          } catch (error) {
            console.error('[Footer] Error in onUpdate callback:', error)
          }
        },
        onLeave: () => {
          try {
            // Ensure fully revealed when completely scrolled past
            const footerElement = document.querySelector('.footer-reveal')
            if (footerElement && gsap) {
              gsap.set(footerElement, {
                clipPath: 'inset(0 0 0% 0)'
              })
            }
          } catch (error) {
            console.error('[Footer] Error in onLeave callback:', error)
          }
        },
        onEnterBack: () => {
          try {
            // Maintain reveal state when scrolling back into view
            const footerElement = document.querySelector('.footer-reveal')
            if (footerElement && gsap) {
              gsap.set(footerElement, {
                clipPath: 'inset(0 0 0% 0)'
              })
            }
          } catch (error) {
            console.error('[Footer] Error in onEnterBack callback:', error)
          }
        },
        onLeaveBack: () => {
          try {
            // Hide again when scrolling back up past the trigger
            const footerElement = document.querySelector('.footer-reveal')
            if (footerElement && gsap) {
              gsap.set(footerElement, {
                clipPath: 'inset(0 0 100% 0)'
              })
            }
          } catch (error) {
            console.error('[Footer] Error in onLeaveBack callback:', error)
          }
        }
      })
    } catch (error) {
      console.error('[Footer] Error setting up footer reveal ScrollTrigger:', error)
    }

    return cleanup
  }, [createScrollTrigger, gsap, cleanup])

  // Scroll-based horizontal movement for get in touch button with isolated ScrollTrigger
  useEffect(() => {
    // Early return if GSAP manager is not ready
    if (!gsap || !createScrollTrigger) {
      console.warn('[Footer] GSAP manager not ready, skipping button movement setup')
      return cleanup
    }

    const buttons = document.querySelectorAll('.get-in-touch-btn')
    const footer = document.querySelector('footer')
    
    if (!footer || buttons.length === 0) {
      console.warn('[Footer] Footer or buttons not found, skipping button movement setup')
      return cleanup
    }

    try {
      let lastScrollY = window.scrollY
      
      buttons.forEach((button, index) => {
        if (!button) return

        // Create isolated ScrollTrigger for button movement
        createScrollTrigger({
          trigger: footer,
          start: "top bottom", // Start when footer top hits bottom of viewport  
          end: "bottom top", // End when footer bottom hits top of viewport
          onUpdate: (self) => {
            try {
              // Verify elements and instances still exist
              const currentButton = document.querySelectorAll('.get-in-touch-btn')[index]
              if (!currentButton || !gsap || !self) {
                return
              }

              const currentScrollY = window.scrollY
              const scrollDirection = currentScrollY > lastScrollY ? 1 : -1 // 1 = down, -1 = up
              const progress = Math.max(0, Math.min(1, self.progress)) // Clamp progress between 0-1
              
              // Calculate movement: right when scrolling down, left when scrolling up
              // Max movement of 60px in either direction
              const targetX = scrollDirection * progress * 60
              
              // Direct transform for immediate response, no animation delays
              gsap.set(currentButton, {
                x: targetX
              })
              
              lastScrollY = currentScrollY
            } catch (error) {
              console.error(`[Footer] Error in button movement callback (button ${index}):`, error)
            }
          }
        })
      })
    } catch (error) {
      console.error('[Footer] Error setting up button movement ScrollTrigger:', error)
    }

    return cleanup
  }, [createScrollTrigger, gsap, cleanup])

  // Spring animation handlers using isolated tweens
  const handleButtonHover = (ref: React.RefObject<HTMLAnchorElement | HTMLDivElement | null>, isHovering: boolean) => {
    // Defensive programming: check all dependencies
    if (!ref?.current || !createTween) {
      return
    }

    try {
      if (isHovering) {
        createTween(ref.current, {
          scale: 1.05,
          y: -5,
          duration: 0.3,
          ease: 'power2.out'
        })
      } else {
        createTween(ref.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    } catch (error) {
      console.error('[Footer] Error in handleButtonHover:', error)
    }
  }



  return (
    <footer className="text-white flex flex-col justify-center footer-reveal relative z-footer" style={{ clipPath: 'inset(0 0 100% 0)', backgroundColor: '#1C1D20' }}>
      <style jsx>{`
        @media (min-width: 768px) {
          footer {
            padding-bottom: 15px !important;
          }
        }
        @media (max-width: 767px) {
          footer {
            padding-bottom: 15px !important;
          }
        }
      `}</style>
      <div className="container">
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center py-24">
          <div className="flex items-start mb-12 relative">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
              <Image
                src="/images/favicon-new.png"
                alt="Jacqueline Amoako"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-satoshi font-light mb-12 md:mb-8" style={{ lineHeight: '1.2em', letterSpacing: '0.08em', paddingBottom: '30px' }}>
                Ready to<br />collaborate
              </h2>
            </div>
            <div className="ml-auto block transform -translate-x-2 translate-y-20 rotate-45 cursor-pointer md:block"
                 onMouseEnter={(e) => {
                   gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3, ease: 'power2.out' })
                 }}
                 onMouseLeave={(e) => {
                   gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
                 }}
            >
              <ArrowDown size={32} className="text-white" strokeWidth={1} />
            </div>
          </div>
          
          {/* Full width underline */}
          <div className="w-full h-px mb-12 relative" style={{ backgroundColor: '#353638', marginTop: '24px' }}>
            {/* Get in touch button on the line - Desktop only */}
            <div className="hidden md:block absolute right-40 top-1/2 transform -translate-y-1/2">
              <Link 
                ref={touchButtonRef}
                href="/contact"
                onMouseEnter={() => handleButtonHover(touchButtonRef, true)}
                onMouseLeave={() => handleButtonHover(touchButtonRef, false)}
                className="get-in-touch-btn btn-pill-white w-40 h-40 flex items-center justify-center text-lg"
              >
                Get in touch
              </Link>
            </div>
          </div>
          
          {/* Mobile Contact Layout */}
          <div className="block md:hidden relative">
            {/* Get in touch button on the line */}
            <div className="absolute right-32 -top-30 z-10">
              <Link 
                ref={touchButtonRef}
                href="/contact"
                onMouseEnter={() => handleButtonHover(touchButtonRef, true)}
                onMouseLeave={() => handleButtonHover(touchButtonRef, false)}
                className="get-in-touch-btn btn-pill-white w-32 h-32 flex items-center justify-center text-center whitespace-nowrap"
                style={{ fontSize: '16px' }}
              >
                Get in touch
              </Link>
            </div>
            
            {/* Contact section */}
            <div className="pt-16 px-8 space-y-4">
              <Link 
                ref={emailButtonRef}
                href={`mailto:${content.global.email}`}
                onMouseEnter={() => handleButtonHover(emailButtonRef, true)}
                onMouseLeave={() => handleButtonHover(emailButtonRef, false)}
                className="btn-pill block w-full text-center px-6 py-5"
              >
                {content.global.email}
              </Link>
              
              {/* Availability Info - Mobile */}
              <div 
                onMouseEnter={() => handleButtonHover(availabilityInfoRef, true)}
                onMouseLeave={() => handleButtonHover(availabilityInfoRef, false)}
                className="btn-pill block w-full px-6 py-5 text-center"
              >
                <div className="text-white font-satoshi font-light text-base flex items-center justify-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Available for projects
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Contact Layout */}
          <div className="hidden md:flex justify-start gap-8">
            {/* Email Button */}
            <div>
              <Link 
                ref={emailButtonRef}
                href={`mailto:${content.global.email}`}
                onMouseEnter={() => handleButtonHover(emailButtonRef, true)}
                onMouseLeave={() => handleButtonHover(emailButtonRef, false)}
                className="btn-pill inline-flex items-center justify-center px-6 py-5"
              >
                {content.global.email}
              </Link>
            </div>
            
            {/* Availability Info */}
            <div 
              ref={availabilityInfoRef}
              onMouseEnter={() => handleButtonHover(availabilityInfoRef, true)}
              onMouseLeave={() => handleButtonHover(availabilityInfoRef, false)}
              className="btn-pill inline-flex items-center justify-center px-6 py-5"
            >
              <div className="text-white font-satoshi font-light text-base flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Available for projects
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="md:border-t-0 border-t pt-16 mt-auto" style={{ borderTopColor: '#353638' }}>
          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Socials First - Full Width */}
            <div className="mb-10">
              <p className="text-sm font-inter mb-6 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>SOCIALS</p>
              <div className="flex flex-wrap gap-8">
                <a
                  href="https://www.instagram.com/intellijay09/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg md:text-xl relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/intelliJay09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg md:text-xl relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  Twitter
                </a>
                <a
                  href={content.global.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg md:text-xl relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            
            
            {/* Copyright and Time Row */}
            <div className="flex justify-between items-center mt-12">
              <div>
                <p className="text-sm font-inter mb-2 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>VERSION</p>
                <p className="text-white font-satoshi font-light text-sm md:text-base">
                  {new Date().getFullYear()} © Edition
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-inter mb-2 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>LOCAL TIME</p>
                <p className="text-white font-satoshi font-light text-sm md:text-base">
                  {localTime || 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-start md:items-center gap-8">
            {/* Version */}
            <div>
              <p className="text-sm font-inter mb-2 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>VERSION</p>
              <p className="text-white font-satoshi font-light">
                {new Date().getFullYear()} © Edition
              </p>
            </div>
            
            {/* Local Time */}
            <div>
              <p className="text-sm font-inter mb-2 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>LOCAL TIME</p>
              <p className="text-white font-satoshi font-light">
                {localTime || 'Loading...'}
              </p>
            </div>
            
            {/* Socials */}
            <div>
              <p className="text-sm font-inter mb-6 font-light" style={{ letterSpacing: '0.08em', color: '#8D8E85' }}>SOCIALS</p>
              <div className="flex space-x-10">
                <a
                  href="https://www.instagram.com/intellijay09/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/intelliJay09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  Twitter
                </a>
                <a
                  href={content.global.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-satoshi text-lg relative transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90 active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}