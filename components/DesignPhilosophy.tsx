'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGSAPManager } from '../hooks/useGSAPManager'
import { useSectionManager } from '../hooks/useSectionManager'
import useResponsiveBreakpoint from '../hooks/useResponsiveBreakpoint'

// Golden ratio for mathematical precision in spacing
const GOLDEN_RATIO = 1.618

// Strategic philosophy principles for growth-focused positioning
const philosophyElements = [
  {
    id: "challenge-thinking",
    primaryText: "Challenge",
    secondaryText: "Thinking",
    morphText: ["Question", "Refine", "Transform", "Elevate"],
    description: "Your vision is the starting point, not the blueprint. I challenge assumptions, refine strategies, and engineer solutions that push beyond what you thought possible.",
    // Responsive positioning for different breakpoints
    position: {
      desktop: { x: 15, y: 20 },
      tablet: { x: 10, y: 15 },
      mobile: { x: 5, y: 10 }
    },
    scale: {
      desktop: 1.2,
      tablet: 1.0,
      mobile: 0.85
    },
    delay: 0
  },
  {
    id: "growth-systems",
    primaryText: "Engineer",
    secondaryText: "Systems",
    morphText: ["Architect", "Build", "Optimize", "Scale"],
    description: "Not websites. Not campaigns. Complete growth ecosystems—acquisition funnels, conversion engines, authority platforms—designed to scale from $100K to $10M.",
    position: {
      desktop: { x: 65, y: 35 },
      tablet: { x: 60, y: 35 },
      mobile: { x: 5, y: 35 }
    },
    scale: {
      desktop: 0.9,
      tablet: 0.85,
      mobile: 0.75
    },
    delay: 0.3
  },
  {
    id: "premium-value",
    primaryText: "Command",
    secondaryText: "Value",
    morphText: ["Premium", "Authority", "Positioning", "Excellence"],
    description: "Luxury brands refuse to compete on price. I build digital presence that attracts high-value clients and justifies premium positioning.",
    position: {
      desktop: { x: 25, y: 65 },
      tablet: { x: 15, y: 60 },
      mobile: { x: 5, y: 60 }
    },
    scale: {
      desktop: 1.1,
      tablet: 0.95,
      mobile: 0.8
    },
    delay: 0.6
  },
  {
    id: "compounding-results",
    primaryText: "Deliver",
    secondaryText: "Results",
    morphText: ["Growth", "Impact", "Outcomes", "Revenue"],
    description: "340% traffic growth. 28% conversion increases. Success measured in business metrics that compound month over month, not vanity numbers.",
    position: {
      desktop: { x: 70, y: 80 },
      tablet: { x: 55, y: 80 },
      mobile: { x: 5, y: 85 }
    },
    scale: {
      desktop: 0.85,
      tablet: 0.8,
      mobile: 0.7
    },
    delay: 0.9
  }
]


export default function DesignPhilosophy() {
  // Component isolation and management
  const { 
    createScrollTrigger, 
    createTween, 
    createFromToTween,
    cleanup 
  } = useGSAPManager({ 
    componentId: 'design-philosophy',
    debugMode: process.env.NODE_ENV === 'development'
  })
  
  const { sectionRef, isVisible } = useSectionManager({
    id: 'design-philosophy',
    minHeight: 'screen',
    spacing: { top: 150, bottom: 200 }
  })

  const typographyRefs = useRef<HTMLDivElement[]>([])
  const morphRefs = useRef<HTMLSpanElement[]>([])
  const floatingAnimations = useRef<gsap.core.Tween[]>([])
  
  const [currentMorphIndex, setCurrentMorphIndex] = useState<number[]>([0, 0, 0, 0])
  const { breakpoint, isTouchDevice, prefersReducedMotion } = useResponsiveBreakpoint()

  // Advanced text morphing system
  useEffect(() => {
    if (!isVisible) return

    const intervals = philosophyElements.map((element, elementIndex) => {
      return setInterval(() => {
        setCurrentMorphIndex(prev => {
          const newIndex = [...prev]
          newIndex[elementIndex] = (newIndex[elementIndex] + 1) % element.morphText.length
          return newIndex
        })
      }, 3000 + (elementIndex * 500)) // Staggered morphing
    })

    return () => intervals.forEach(interval => clearInterval(interval))
  }, [isVisible])

  // Mobile-optimized GSAP animation system with reduced motion support
  useEffect(() => {
    if (!isVisible) return

    // Clear existing floating animations
    floatingAnimations.current.forEach(animation => animation?.kill())
    floatingAnimations.current = []

    // Adjust animation complexity based on device capabilities and user preferences
    const useSimpleAnimations = prefersReducedMotion || breakpoint === 'mobile'

    // Mobile-optimized typography animations with isolated triggers
    typographyRefs.current.forEach((typography, index) => {
      if (typography) {
        const element = philosophyElements[index]
        const currentScale = element.scale[breakpoint]
        const entranceDuration = prefersReducedMotion ? 0.3 : (breakpoint === 'mobile' ? 0.8 : 1.5)
        
        // Create isolated ScrollTrigger for this element
        createScrollTrigger({
          trigger: typography,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            // Responsive entrance animation
            if (useSimpleAnimations) {
              // Simple fade and slide for mobile/reduced motion
              createFromToTween(
                typography,
                {
                  y: 30,
                  opacity: 0
                },
                {
                  y: 0,
                  opacity: 1,
                  duration: entranceDuration,
                  ease: 'power2.out',
                  delay: element.delay * 0.5 // Shorter delays on mobile
                }
              )
            } else {
              // Full entrance animation for desktop
              createFromToTween(
                typography,
                {
                  y: 150,
                  opacity: 0,
                  scale: currentScale * 0.7,
                  rotation: Math.random() * 10 - 5
                },
                {
                  y: 0,
                  opacity: 1,
                  scale: currentScale,
                  rotation: 0,
                  duration: entranceDuration,
                  ease: 'power3.out',
                  delay: element.delay
                }
              )
            }
          }
        })

        // Conditional floating animation (disabled on mobile for performance)
        if (!prefersReducedMotion && breakpoint !== 'mobile') {
          // Position-aware floating to prevent overlaps
          const yPosition = element.position[breakpoint].y
          let floatingRange, floatingDirection
          
          // Smart floating ranges based on vertical position to prevent overlaps
          if (yPosition <= 20) {
            // Top elements - can float both directions with larger range
            floatingRange = 20
            floatingDirection = Math.sin(index * 0.7) * floatingRange
          } else if (yPosition <= 40) {
            // Upper-middle - limited upward movement
            floatingRange = 12
            floatingDirection = -Math.abs(Math.sin(index * 0.7)) * floatingRange * 0.3
          } else if (yPosition <= 70) {
            // Lower-middle - primarily sideways and slight downward
            floatingRange = 15
            floatingDirection = Math.abs(Math.sin(index * 0.7)) * floatingRange * 0.5
          } else {
            // Bottom elements - primarily downward movement
            floatingRange = 18
            floatingDirection = Math.abs(Math.sin(index * 0.7)) * floatingRange
          }

          const floatingAnimation = createTween(typography, {
            y: floatingDirection,
            x: Math.sin(index * 1.2) * (8 + index * 2), // Varied horizontal movement
            rotation: Math.cos(index * 0.8) * (1.5 + index * 0.3), // Subtle rotation variation
            duration: 7 + (index * 0.7), // Staggered durations for natural feel
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: element.delay + 2 + (index * 0.4) // Phase offset to prevent synchronization
          })

          floatingAnimations.current[index] = floatingAnimation
        }

        // Subtle scroll effects (simplified on mobile)
        if (!prefersReducedMotion) {
          const scrollScale = breakpoint === 'mobile' ? 1.02 : 1.1
          createScrollTrigger({
            trigger: typography,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: breakpoint === 'mobile' ? false : 1,
            onUpdate: (self) => {
              const progress = self.progress
              const scale = currentScale + (currentScale * (scrollScale - 1) * progress)
              if (typography) {
                typography.style.transform = `scale(${scale})`
              }
            }
          })
        }
      }
    })

    // Component-specific cleanup
    return () => {
      cleanup()
      floatingAnimations.current.forEach(animation => animation?.kill())
      floatingAnimations.current = []
    }
  }, [breakpoint, prefersReducedMotion, isVisible, createScrollTrigger, createTween, createFromToTween, cleanup])

  // Touch-friendly interaction system with mobile optimization
  const handleTypographyInteraction = useCallback((index: number, isActive: boolean) => {
    // Safety checks to prevent errors
    if (!typographyRefs.current || index < 0 || index >= typographyRefs.current.length) {
      return
    }

    const typography = typographyRefs.current[index]
    const floatingAnimation = floatingAnimations.current[index]
    const element = philosophyElements[index]
    
    // Additional safety checks
    if (!typography || !element || !element.scale || !element.scale[breakpoint]) {
      return
    }
    
    const currentScale = element.scale[breakpoint]
    
    if (typography) {
      if (isActive) {
        // Pause floating animation if it exists
        if (floatingAnimation && typeof floatingAnimation.pause === 'function') {
          floatingAnimation.pause()
        }
        
        if (isTouchDevice) {
          // Touch-friendly interaction - subtle scale and visual feedback using GSAP manager
          createTween(typography, {
            scale: currentScale * 1.08,
            duration: 0.2,
            ease: 'power2.out',
            transformOrigin: 'center center'
          })
        } else if (!prefersReducedMotion) {
          // Desktop hover effects - more dramatic using GSAP manager
          createTween(typography, {
            scale: currentScale * 1.15,
            rotationX: -5,
            rotationY: 5,
            z: 30,
            duration: 0.4,
            ease: 'power2.out',
            transformOrigin: 'center center'
          })
        }
      } else {
        // Reset interaction effects
        const resetDuration = isTouchDevice ? 0.3 : 1.0
        const resetEase = isTouchDevice ? 'power2.out' : 'elastic.out(0.7, 0.4)'
        
        createTween(typography, {
          scale: currentScale,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: resetDuration,
          ease: resetEase,
          onComplete: () => {
            // Resume floating animation if it exists
            if (floatingAnimation && typeof floatingAnimation.resume === 'function') {
              floatingAnimation.resume()
            }
          }
        })
      }
    }
  }, [breakpoint, isTouchDevice, prefersReducedMotion, createTween])

  // Simple cursor magnetism that works with floating animations
  const handleMouseMove = useCallback((event: React.MouseEvent, index: number) => {
    // Safety checks to prevent errors
    if (!typographyRefs.current || index < 0 || index >= typographyRefs.current.length) {
      return
    }

    const typography = typographyRefs.current[index]
    const floatingAnimation = floatingAnimations.current[index]
    
    // Additional safety checks
    if (!typography) {
      return
    }
    
    // Only apply magnetism when floating is paused (during hover)
    if (floatingAnimation && typeof floatingAnimation.paused === 'function' && floatingAnimation.paused()) {
      try {
        const rect = typography.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = event.clientX
        const mouseY = event.clientY
        
        // Calculate magnetism offset
        const deltaX = (mouseX - centerX) * 0.1
        const deltaY = (mouseY - centerY) * 0.08
        
        // Apply magnetism with smooth easing using GSAP manager
        createTween(typography, {
          x: deltaX,
          y: deltaY,
          duration: 0.6,
          ease: 'power2.out'
        })
      } catch (error) {
        console.warn('Error in handleMouseMove:', error)
      }
    }
  }, [createTween])


  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background-primary z-design-philosophy"
      style={{
        paddingTop: breakpoint === 'mobile' ? '16px' : '104px',
        paddingBottom: breakpoint === 'mobile' ? '50px' : `${GOLDEN_RATIO * 6 + 11.25}rem`
      }}
    >
      {/* Sophisticated Multi-Layered Background System */}
      <div className="absolute inset-0">
        {/* Primary Ambient Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary opacity-60"></div>
        
        {/* Dynamic Gradient Orbs - Mathematically Positioned */}
        <div
          className="absolute w-[50vw] max-w-[800px] h-[50vw] max-h-[800px] rounded-full bg-gradient-radial from-text-primary/[0.04] via-text-primary/[0.02] to-transparent blur-3xl"
          style={{
            top: `${20 * GOLDEN_RATIO}%`,
            right: `${15 * GOLDEN_RATIO}%`,
            animation: 'pulse 8s ease-in-out infinite alternate'
          }}
        ></div>
        <div
          className="absolute w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] rounded-full bg-gradient-radial from-text-secondary/[0.03] to-transparent blur-3xl"
          style={{
            bottom: `${25 * GOLDEN_RATIO}%`,
            left: `${18 * GOLDEN_RATIO}%`,
            animation: 'pulse 10s ease-in-out infinite alternate-reverse'
          }}
        ></div>
        
        {/* Sophisticated Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.008] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Layered Transparency Depth System */}
        <div className="absolute inset-0 bg-text-primary/[0.01] backdrop-blur-[120px] mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-background-secondary/30 backdrop-blur-[80px] mix-blend-screen opacity-20"></div>
      </div>


      {/* Section Header with Silver Metallic Effect */}
      <div className="relative z-20 text-center mb-8 px-4 py-12">
        <h2
          className="font-satoshi font-light relative text-text-primary [html[data-theme='dark']_&]:text-transparent [html[data-theme='dark']_&]:bg-gradient-to-r [html[data-theme='dark']_&]:from-neutral-400 [html[data-theme='dark']_&]:via-neutral-300 [html[data-theme='dark']_&]:to-neutral-400 [html[data-theme='dark']_&]:bg-clip-text"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: '1.4',
            letterSpacing: '0.08em',
            fontWeight: '300'
          }}
        >
          Strategic Philosophy
        </h2>
      </div>

      {/* Revolutionary Interactive Typography Cinema */}
      <div className={`relative z-20 ${
        breakpoint === 'mobile' 
          ? 'px-4 py-8 space-y-16' // Mobile: stack vertically with generous spacing
          : breakpoint === 'tablet'
          ? 'min-h-[60vh] px-6' // Tablet: reduced height, side padding
          : 'min-h-[80vh]' // Desktop: original height
      }`}>
        {philosophyElements.map((element, index) => {
          const position = element.position[breakpoint]
          
          return (
            <div
              key={element.id}
              className={`${
                breakpoint === 'mobile' 
                  ? 'relative w-full' // Mobile: full width, no absolute positioning
                  : 'absolute transform-gpu'
              }`}
              style={breakpoint === 'mobile' ? {} : {
                left: `${position.x}%`,
                top: `${position.y + (index * (breakpoint === 'tablet' ? 3 : 5))}%`,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity'
              }}
            >
            {/* Kinetic Typography Container */}
            <div
              ref={(el) => {
                if (el) typographyRefs.current[index] = el
              }}
              className={`relative select-none ${
                breakpoint === 'mobile' 
                  ? 'w-full text-center py-4' // Mobile: full width with padding for touch targets
                  : 'cursor-pointer'
              }`}
              // Touch-friendly event handlers with proper touch target size (minimum 44px)
              onMouseEnter={!isTouchDevice ? () => handleTypographyInteraction(index, true) : undefined}
              onMouseLeave={!isTouchDevice ? () => handleTypographyInteraction(index, false) : undefined}
              onTouchStart={isTouchDevice ? () => handleTypographyInteraction(index, true) : undefined}
              onTouchEnd={isTouchDevice ? () => handleTypographyInteraction(index, false) : undefined}
              onMouseMove={!isTouchDevice && !prefersReducedMotion ? (e) => handleMouseMove(e, index) : undefined}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                minHeight: breakpoint === 'mobile' ? '44px' : 'auto' // Apple HIG minimum touch target
              }}
            >
              {/* Primary Typography Element */}
              <div className="relative">
                {/* Main Text with Responsive Typography */}
                <h2 
                  className="font-satoshi text-text-primary font-light leading-tight tracking-tight"
                  style={{
                    fontSize: breakpoint === 'mobile' 
                      ? `clamp(1.8rem, 8vw, 2.5rem)` // Mobile: smaller, more readable sizes
                      : breakpoint === 'tablet'
                      ? `clamp(2rem, 6vw, 3.5rem)` // Tablet: medium sizes
                      : `clamp(${2.5 * element.scale[breakpoint]}rem, ${8 * element.scale[breakpoint]}vw, ${5 * element.scale[breakpoint]}rem)`, // Desktop: original formula
                    letterSpacing: breakpoint === 'mobile' ? '0.02em' : '0.03em',
                    lineHeight: breakpoint === 'mobile' ? '1.3' : '0.9', // Better mobile readability
                    textShadow: '0 0 40px rgba(0,0,0,0.1)'
                  }}
                >
                  {element.primaryText}
                  <br />
                  <span className="text-text-secondary opacity-70 [html[data-theme='light']_&]:opacity-80 italic font-extralight">
                    {element.secondaryText}
                  </span>
                </h2>

                {/* Morphing Text Layer */}
                <div 
                  className={`${
                    breakpoint === 'mobile' 
                      ? 'relative mt-2 text-center' // Mobile: below main text, centered
                      : 'absolute top-full left-0 mt-4'
                  } opacity-60 [html[data-theme='light']_&]:opacity-80`}
                  style={breakpoint === 'mobile' ? {} : {
                    transform: 'translateZ(20px)'
                  }}
                >
                  <motion.span
                    ref={(el) => {
                      if (el) morphRefs.current[index] = el
                    }}
                    className="font-satoshi font-light text-text-tertiary tracking-wider"
                    style={{
                      fontSize: breakpoint === 'mobile' 
                        ? '0.875rem' // Mobile: fixed readable size
                        : `${0.5 * element.scale[breakpoint]}rem`,
                      letterSpacing: breakpoint === 'mobile' ? '0.1em' : '0.15em'
                    }}
                    key={currentMorphIndex[index]}
                    initial={prefersReducedMotion 
                      ? { opacity: 0 } 
                      : { opacity: 0, y: 20, scale: 0.8 }
                    }
                    animate={prefersReducedMotion 
                      ? { opacity: 1 } 
                      : { opacity: 1, y: 0, scale: 1 }
                    }
                    exit={prefersReducedMotion 
                      ? { opacity: 0 } 
                      : { opacity: 0, y: -20, scale: 0.8 }
                    }
                    transition={{ 
                      duration: prefersReducedMotion ? 0.2 : 0.6, 
                      ease: [0.4, 0, 0.2, 1] 
                    }}
                  >
                    {element.morphText[currentMorphIndex[index]]}
                  </motion.span>
                </div>

                {/* Sophisticated Transparency Overlay */}
                <div 
                  className="absolute -inset-8 rounded-3xl bg-background-primary/5 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    transform: 'translateZ(-10px)',
                    filter: 'blur(0.5px)'
                  }}
                />
              </div>

            </div>

            {/* Ambient Particle System - Disabled on mobile for performance */}
            {breakpoint !== 'mobile' && (
              <div 
                className="absolute -inset-16 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, rgba(var(--color-text-primary), 0.02) 0%, transparent 70%)`,
                  animation: `pulse ${6 + index}s ease-in-out infinite alternate`,
                  animationDelay: `${element.delay}s`
                }}
              />
            )}
          </div>
          )
        })}

        {/* Mathematical Geometric Accents */}
        <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-text-primary/15 to-transparent opacity-40"></div>
        <div className="absolute top-1/2 right-12 w-px h-24 bg-gradient-to-t from-text-primary/10 to-transparent opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full border border-text-primary/8 opacity-25"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full border border-text-primary/6 opacity-20"></div>
      </div>


      {/* Sophisticated CSS for Advanced Effects */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.05) rotate(1deg); opacity: 0.8; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  )
}