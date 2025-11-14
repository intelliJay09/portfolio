'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { ArrowLeft, Search } from 'lucide-react'
import GlassCTA from '../components/ui/GlassCTA'
import TransparentCTA from '../components/ui/TransparentCTA'

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const floatingElementsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      console.log('Particles found:', particlesRef.current.length) // Debug log
      
      if (particlesRef.current.length > 0) {
        // Initial scattered state
        gsap.set(particlesRef.current, {
          opacity: 0,
          scale: 0,
          x: () => gsap.utils.random(-50, 50),
          y: () => gsap.utils.random(-50, 50)
        })
        
        // Animate particles into formation
        gsap.to(particlesRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: 'back.out(1.2)',
          delay: 0.5
        })
        
        // Add subtle floating animation after formation
        setTimeout(() => {
          particlesRef.current.forEach((particle, index) => {
            if (particle) {
              gsap.to(particle, {
                y: `+=${gsap.utils.random(-3, 3)}`,
                x: `+=${gsap.utils.random(-2, 2)}`,
                duration: gsap.utils.random(3, 5),
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.1
              })
            }
          })
        }, 2000)
      }
      
      // Content animation
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 1.5, ease: 'power2.out' }
        )
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  // Generate constellation particles for "404"
  const generateParticles = () => {
    const particles: React.JSX.Element[] = []
    
    // Define positions for "404" constellation using percentages for responsive design
    const positions = [
      // "4" - Left digit (proper 4 shape)
      { x: 21.11, y: 18.75 }, { x: 21.11, y: 31.25 }, { x: 21.11, y: 43.75 }, // Left vertical line
      { x: 25.56, y: 43.75 }, { x: 30, y: 43.75 }, // Horizontal line
      { x: 30, y: 18.75 }, { x: 30, y: 31.25 }, { x: 30, y: 43.75 }, { x: 30, y: 56.25 }, { x: 30, y: 68.75 }, // Right vertical line
      
      // "0" - Center digit  
      { x: 45.56, y: 18.75 }, { x: 50, y: 18.75 }, { x: 54.44, y: 18.75 },
      { x: 41.11, y: 31.25 }, { x: 58.89, y: 31.25 },
      { x: 41.11, y: 43.75 }, { x: 58.89, y: 43.75 },
      { x: 41.11, y: 56.25 }, { x: 58.89, y: 56.25 },
      { x: 45.56, y: 68.75 }, { x: 50, y: 68.75 }, { x: 54.44, y: 68.75 },
      
      // "4" - Right digit (proper 4 shape)
      { x: 70, y: 18.75 }, { x: 70, y: 31.25 }, { x: 70, y: 43.75 }, // Left vertical line
      { x: 74.44, y: 43.75 }, { x: 78.89, y: 43.75 }, // Horizontal line
      { x: 78.89, y: 18.75 }, { x: 78.89, y: 31.25 }, { x: 78.89, y: 43.75 }, { x: 78.89, y: 56.25 }, { x: 78.89, y: 68.75 }, // Right vertical line
    ]
    
    positions.forEach((pos, index) => {
      particles.push(
        <div
          key={index}
          ref={(el) => { if (el) particlesRef.current[index] = el }}
          className="absolute rounded-full"
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: 'clamp(8px, 2.67vw, 12px)',
            height: 'clamp(8px, 2.67vw, 12px)',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
            opacity: 0.9,
            zIndex: 50,
            border: '2px solid rgba(255, 255, 255, 0.8)',
            transform: 'translate(-50%, -50%)', // Center the particle on its position
          }}
        />
      )
    })
    
    return particles
  }

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden">
        
        {/* Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          {/* Floating geometric elements with higher opacity for visibility */}
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[0] = el }}
            className="absolute top-1/4 left-1/6 w-80 h-80 bg-text-primary/[0.05] rounded-full blur-3xl"
          />
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[1] = el }}
            className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-text-primary/[0.03] rounded-full blur-3xl"
          />
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[2] = el }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-text-primary/[0.04] rounded-full blur-3xl"
          />
        </div>
        
        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-6 py-20 text-center max-w-6xl">
            
            {/* Digital Constellation */}
            <div
              className="relative w-full h-80 mb-1 flex items-center justify-center"
              style={{ minHeight: '320px' }}
            >
              {/* Constellation Container */}
              <div 
                className="relative border border-white/20 rounded-2xl backdrop-blur-sm mx-auto"
                style={{ 
                  width: 'min(450px, 90vw)', 
                  height: 'min(160px, 36vw)',
                  minHeight: '120px',
                  aspectRatio: '2.8125',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {generateParticles()}
                
              </div>
            </div>
            
            {/* Content */}
            <div ref={contentRef} className="space-y-6 max-w-2xl mx-auto">
              
              {/* Main Headline */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-satoshi text-text-primary mb-4"
                    style={{ 
                      fontWeight: 300,
                      letterSpacing: '0.02em',
                      lineHeight: 1.1
                    }}>
                  Lost in Space.
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed max-w-lg mx-auto">
                  This page exists in another dimension. Let&apos;s navigate you back to familiar territory.
                </p>
              </div>
              
              {/* Floating Information Card */}
              <div className="bg-background-primary/60 backdrop-blur-xl rounded-2xl p-8 border border-text-primary/[0.08] max-w-md mx-auto"
                   style={{
                     boxShadow: `
                       0 20px 60px -20px rgba(0, 0, 0, 0.15),
                       0 8px 25px -8px rgba(0, 0, 0, 0.08),
                       inset 0 1px 0 rgba(255, 255, 255, 0.1)
                     `
                   }}>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-text-primary/70 uppercase tracking-wider text-center">Quick Navigation</h3>
                  <ul className="space-y-3 text-center">
                    <li className="flex items-center justify-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-primary flex-shrink-0" />
                      <Link href="/portfolio" className="text-sm text-text-secondary leading-relaxed hover:text-text-primary hover:scale-105 transition-all duration-300 cursor-pointer">
                        Explore my portfolio and recent projects
                      </Link>
                    </li>
                    <li className="flex items-center justify-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-primary flex-shrink-0" />
                      <a href="/services" className="text-sm text-text-secondary leading-relaxed hover:text-text-primary hover:scale-105 transition-all duration-300 cursor-pointer">
                        Learn about my expertise and services
                      </a>
                    </li>
                    <li className="flex items-center justify-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-primary flex-shrink-0" />
                      <a href="/contact" className="text-sm text-text-secondary leading-relaxed hover:text-text-primary hover:scale-105 transition-all duration-300 cursor-pointer">
                        Get in touch for your next project
                      </a>
                    </li>
                  </ul>
                </div>
                
              </div>
              
              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-8">
                <div className="w-full sm:w-auto">
                  <TransparentCTA href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="whitespace-nowrap">Return Home</span>
                  </TransparentCTA>
                </div>
                
                <div className="w-full sm:w-auto">
                  <GlassCTA href="/portfolio" variant="white">
                    <Search className="w-4 h-4 mr-2" />
                    <span className="whitespace-nowrap">Explore Work</span>
                  </GlassCTA>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
        
      </main>
      <Footer />
    </>
  )
}