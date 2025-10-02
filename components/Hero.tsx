'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowDownRight, ArrowDownLeft } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '../contexts/ThemeProvider'

export default function Hero() {
  const { theme } = useTheme()
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register GSAP plugin on client side only
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
    
    // Single sophisticated entrance animation
    const tl = gsap.timeline({ delay: 0.3 })

    // Coordinated reveal with subtle offsets
    if (textRef.current) {
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' }
      )
    }

    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' },
        '-=1.4' // Slight overlap
      )
    }

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out' },
        '-=1.2'
      )
    }

    if (arrowRef.current) {
      tl.fromTo(
        arrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out' },
        '-=1.4'
      )
    }

    // Substantial, responsive parallax with proper reset to default
    if (imageRef.current) {
      ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2,
        animation: gsap.fromTo(imageRef.current, 
          { y: 0, scale: 1 },
          { y: -120, scale: 0.98, ease: 'none' }
        ),
        onLeaveBack: () => {
          // Ensure image returns to default position when scrolling back to top
          gsap.set(imageRef.current, { y: 0, scale: 1 })
        }
      })
    }

    // Refined hover state for main text only
    if (textRef.current) {
      textRef.current.addEventListener('mouseenter', () => {
        gsap.to(textRef.current, {
          scale: 1.02,
          duration: 0.6,
          ease: 'power2.out'
        })
      })
      
      textRef.current.addEventListener('mouseleave', () => {
        gsap.to(textRef.current, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        })
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])


  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden bg-background-secondary">
      <div className="container relative px-4 h-full" style={{ maxWidth: '1440px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="flex items-center justify-center relative h-full">
          
          {/* Jacqueline Text - Centered in Hero */}
          <h1
            ref={textRef}
            className="absolute text-[18vw] sm:text-[17vw] md:text-[20vw] lg:text-[18vw] xl:text-[18vw] font-satoshi font-black text-text-primary/90 select-none cursor-pointer z-0 text-center lg:text-left"
            style={{
              lineHeight: '1.1',
              letterSpacing: '0.02em',
              fontWeight: '900',
              transformOrigin: 'center center'
            }}
          >
            Jacqueline
          </h1>
          
          {/* Arrow and Text Container */}
          <div className="absolute top-1/2 left-4 md:left-auto md:right-16 lg:right-24 z-30 transform translate-y-36 md:translate-y-44 lg:translate-y-44">
            {/* Arrow Element */}
            <div 
              ref={arrowRef}
              className="mb-5 md:mb-5 flex justify-start md:justify-start"
            >
              <div className="bg-text-primary/10 backdrop-blur-sm rounded-full p-4 md:p-6 hover:bg-text-primary/20 transition-all duration-300 cursor-pointer group">
                <ArrowDownRight 
                  size={24} 
                  className="text-text-primary group-hover:text-text-secondary transition-colors duration-300 md:hidden" 
                />
                <ArrowDownLeft 
                  size={24} 
                  className="text-text-primary group-hover:text-text-secondary transition-colors duration-300 hidden md:block" 
                />
              </div>
            </div>

            {/* Full-Stack Developer Text */}
            <div 
              ref={titleRef}
            >
              <div className="text-left md:text-left">
                <p className="text-text-primary font-satoshi font-normal text-lg md:text-xl lg:text-2xl leading-tight tracking-wide">
                  Full-Stack Developer
                </p>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div 
            ref={imageRef}
            className="relative z-20 w-[300px] h-[80vh] md:w-[400px] md:h-[100vh] lg:w-[500px] lg:h-[100vh] mb-8 pt-24 md:pt-32 next-image-protected"
          >
            <Image
              src={theme === 'dark' ? "/images/jackie-studio-bnw.png" : "/images/jackie-studio.png"}
              alt="Jacqueline Amoako"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 500px"
              quality={90}
              draggable={false}
              unoptimized={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                // @ts-expect-error - WebKit properties not in React.CSSProperties
                WebkitUserDrag: 'none',
                WebkitTouchCallout: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}