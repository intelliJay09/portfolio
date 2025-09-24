'use client'

import { useEffect, useRef } from 'react'
import { useGSAPManager } from '../hooks/useGSAPManager'
import useResponsiveBreakpoint from '../hooks/useResponsiveBreakpoint'

// Golden ratio for mathematical precision
const GOLDEN_RATIO = 1.618


// Opacity levels for depth hierarchy
const OPACITY_LEVELS = [0.04, 0.03, 0.025, 0.035, 0.03] // Different depths for sophistication
const BLUR_INTENSITIES = [25, 20, 18, 22, 20] // Varying blur for visual interest

// Premium testimonial data with sophisticated content (6 testimonials)
const testimonials = [
  {
    id: 'gwen',
    quote: "Jacqueliene has a remarkable ability to translate a personal brand into a compelling digital experience. The website she built for me is not only professional and polished but also strategically designed to convert visitors into clients.",
    author: "Gwen Addo",
    role: "Business Strategist",
    company: "Personal Brand",
    priority: 'accent' // Featured testimonial
  },
  {
    id: 'curtis',
    quote: "We develop luxury experiences, and we needed a website that reflected that same standard of quality. Jacqueliene delivered precisely that—elegant, immersive, and perfectly communicates exclusivity.",
    author: "Curtis",
    role: "Founder",
    company: "Eleven Eleven",
    priority: 'primary'
  },
  {
    id: 'mimi',
    quote: "She took my vision for a premium lash brand and translated it into a stunning and cohesive brand identity. Every single piece is pure luxury.",
    author: "Mimi",
    role: "CEO",
    company: "Allure Bloom",
    priority: 'standard'
  },
  {
    id: 'remie',
    quote: "Handling the digital needs of a national professional body is a massive undertaking, and Jacqueliene exceeded all expectations with technical excellence.",
    author: "Dr. Remie",
    role: "President",
    company: "Ghana Optometric Association",
    priority: 'standard'
  },
  {
    id: 'tyrone',
    quote: "As a digital agency, our website has to be flawless—it&apos;s our ultimate business card. Jacqueliene built a company website that is sleek, functional, and showcases our expertise.",
    author: "Tyrone",
    role: "CEO",
    company: "Command Space",
    priority: 'standard'
  },
  {
    id: 'bossj',
    quote: "For a high-rise development like ours, projecting prestige and reliability is paramount. Her work has been foundational—instilling immediate confidence in potential buyers and investors.",
    author: "Boss J.",
    role: "Developer",
    company: "Anabs Ghana",
    priority: 'primary'
  }
]

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([])
  const { breakpoint } = useResponsiveBreakpoint()
  
  const { createScrollTrigger, createFromToTween, cleanup } = useGSAPManager({
    componentId: 'social-proof',
    debugMode: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    if (!sectionRef.current) return

    testimonialRefs.current.forEach((testimonial, index) => {
      if (!testimonial) return

      const delay = index * 150 // Staggered entrance delays

      // Set initial state
      testimonial.style.opacity = '0'
      testimonial.style.willChange = 'transform, opacity'

      // Entrance animation with ScrollTrigger
      createScrollTrigger({
        trigger: testimonial,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          createFromToTween(
            testimonial,
            {
              y: breakpoint === 'mobile' ? 30 : 60,
              opacity: 0,
              scale: 0.95
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: breakpoint === 'mobile' ? 0.8 : 1.2,
              ease: 'power3.out',
              delay: delay / 1000
            }
          )
        }
      })

      // Subtle parallax effect for desktop
      if (breakpoint !== 'mobile') {
        createScrollTrigger({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            if (testimonial) {
              const progress = self.progress
              const yPos = progress * (index % 2 === 0 ? -10 : 10) // Alternating movement
              testimonial.style.transform = `translateY(${yPos}px)`
            }
          }
        })
      }
    })

    return cleanup
  }, [breakpoint, createScrollTrigger, createFromToTween, cleanup])

  // Get luxury CSS Grid positioning and sizing
  const getTestimonialStyles = (testimonial: typeof testimonials[0], index: number) => {
    const baseStyles = "testimonial-card transition-all duration-500 group hover:scale-[1.02] rounded-2xl"
    
    if (breakpoint === 'mobile') {
      return {
        className: `${baseStyles} mb-8`,
        style: {
          padding: '2rem'
        }
      }
    }

    // Luxury asymmetrical CSS Grid areas (6 testimonials)
    const gridAreas = [
      'gwen',      // Gwen - Featured testimonial (spans 2 columns)
      'curtis',    // Curtis - Top right  
      'mimi',      // Mimi - Middle left
      'remie',     // Dr. Remie - Middle right (spans 1.5 columns)
      'tyrone',    // Tyrone - Bottom left
      'bossj'      // Boss J. - Bottom right (spans 2 columns)
    ]

    const paddingLevels = {
      accent: '2.5rem',   // Featured testimonial
      primary: '2.25rem', // Important testimonials  
      standard: '2rem'    // Standard testimonials
    }

    return {
      className: baseStyles,
      style: {
        gridArea: gridAreas[index],
        padding: paddingLevels[testimonial.priority as keyof typeof paddingLevels]
      }
    }
  }

  // Sophisticated glass morphism treatments with depth hierarchy
  const getTestimonialBackground = (priority: string, index: number) => {
    const baseStyle = {
      background: `rgba(255, 255, 255, ${OPACITY_LEVELS[index]})`,
      backdropFilter: `blur(${BLUR_INTENSITIES[index]}px)`,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: `
        0 ${20 + index * 5}px ${40 + index * 10}px rgba(0, 0, 0, ${0.08 + index * 0.01}),
        0 ${8 + index * 2}px ${16 + index * 4}px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, ${0.03 + index * 0.005})
      `
    }

    if (priority === 'accent') {
      return {
        ...baseStyle,
        background: 'rgba(255, 255, 255, 0.06)', // More prominent
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: `
          0 30px 60px rgba(0, 0, 0, 0.15),
          0 15px 35px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 0 0 1px rgba(255, 255, 255, 0.02)
        `
      }
    }

    return baseStyle
  }

  return (
    <section 
      ref={sectionRef}
      className="social-proof-section relative z-20"
      style={{
        paddingTop: `${GOLDEN_RATIO * 6}rem`,
        paddingBottom: `${GOLDEN_RATIO * 6}rem`,
        background: `linear-gradient(180deg, 
          rgba(26, 26, 26, 0) 0%, 
          rgba(26, 26, 26, 0.02) 50%, 
          rgba(26, 26, 26, 0) 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Elegant Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="font-satoshi font-light text-text-secondary opacity-80"
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '2rem'
            }}
          >
            Trusted By Visionaries
          </h2>
        </div>

        {/* Luxury CSS Grid Layout - 6 Testimonials */}
        <div className={`testimonials-grid ${
          breakpoint === 'mobile' 
            ? 'flex flex-col items-center' 
            : 'grid gap-8'
        }`} style={{
          gridTemplateColumns: breakpoint === 'mobile' ? 'none' : 'repeat(3, 1fr)',
          gridTemplateRows: breakpoint === 'mobile' ? 'none' : 'auto auto auto',
          gridTemplateAreas: breakpoint === 'mobile' ? 'none' : 
            '"gwen gwen curtis" ' +
            '"mimi remie remie" ' +
            '"tyrone bossj bossj"',
          width: '100%'
        }}>
          {testimonials.map((testimonial, index) => {
            const cardStyles = getTestimonialStyles(testimonial, index)
            const backgroundStyles = getTestimonialBackground(testimonial.priority, index)
            
            return (
              <div
                key={testimonial.id}
                ref={(el) => {
                  testimonialRefs.current[index] = el
                }}
                className={cardStyles.className}
                style={{
                  ...backgroundStyles,
                  ...cardStyles.style
                }}
              onMouseEnter={(e) => {
                const target = e.currentTarget
                if (testimonial.priority === 'accent') {
                  target.style.boxShadow = `
                    0 35px 70px rgba(0, 0, 0, 0.2),
                    0 20px 45px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.03)
                  `
                  target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  target.style.background = 'rgba(255, 255, 255, 0.08)'
                } else {
                  target.style.boxShadow = `
                    0 ${25 + index * 5}px ${50 + index * 10}px rgba(0, 0, 0, ${0.12 + index * 0.01}),
                    0 ${12 + index * 2}px ${20 + index * 4}px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, ${0.05 + index * 0.005})
                  `
                  target.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  target.style.background = `rgba(255, 255, 255, ${OPACITY_LEVELS[index] + 0.01})`
                }
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget
                const originalStyle = getTestimonialBackground(testimonial.priority, index)
                target.style.boxShadow = originalStyle.boxShadow
                target.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                target.style.background = originalStyle.background
              }}
            >
              {/* Decorative Quote Mark */}
              <div 
                className="absolute -top-4 -left-2 text-text-primary/8 font-serif"
                style={{ 
                  fontSize: testimonial.priority === 'accent' ? '70px' : '60px',
                  lineHeight: '1',
                  fontWeight: '300'
                }}
              >
                &quot;
              </div>

              {/* Enhanced Quote Text with Typography Hierarchy */}
              <blockquote 
                className="font-satoshi italic text-text-primary leading-relaxed mb-6 relative z-10"
                style={{
                  fontSize: testimonial.priority === 'accent' ? '24px' : '18px', // Enhanced sizing for featured
                  fontWeight: testimonial.priority === 'accent' ? '300' : '300',
                  letterSpacing: testimonial.priority === 'accent' ? '0.025em' : '0.02em',
                  lineHeight: testimonial.priority === 'accent' ? '1.65' : '1.6',
                  marginBottom: testimonial.priority === 'accent' ? '1.75rem' : '1.5rem'
                }}
              >
                {testimonial.quote}
              </blockquote>

              {/* Attribution */}
              <div className="relative z-10">
                <cite className="not-italic">
                  <div 
                    className="font-satoshi text-text-primary mb-1"
                    style={{
                      fontSize: testimonial.priority === 'accent' ? '16px' : '15px',
                      fontWeight: '500',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {testimonial.author}
                  </div>
                  <div 
                    className="font-satoshi text-text-secondary"
                    style={{
                      fontSize: testimonial.priority === 'accent' ? '14px' : '13px',
                      fontWeight: '300',
                      letterSpacing: '0.02em',
                      opacity: testimonial.priority === 'accent' ? '0.9' : '0.8'
                    }}
                  >
                    {testimonial.role} — {testimonial.company}
                  </div>
                </cite>
              </div>

              {/* Subtle gradient overlay for depth */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)'
                }}
              />
            </div>
            )
          })}
        </div>

        {/* Mathematical accent elements */}
        <div className="absolute left-1/4 bottom-8 w-16 h-px bg-text-primary/20"></div>
        <div className="absolute right-1/3 top-16 w-px h-12 bg-text-primary/15"></div>
        
      </div>
    </section>
  )
}