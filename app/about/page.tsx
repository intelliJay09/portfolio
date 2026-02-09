'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Code2, Palette, Search, Monitor, Settings } from 'lucide-react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import PagePreloader from '../../components/PagePreloader'
import { useGSAPManager } from '../../hooks/useGSAPManager'
import content from '../../content.json'

// GSAP registration moved inside useEffect

export default function AboutPage() {
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const pageContentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [projectsCount, setProjectsCount] = useState(0)
  const [yearsCount, setYearsCount] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const countersRef = useRef<HTMLDivElement>(null)

  // GSAP Manager for Gallery Animations
  useGSAPManager({ componentId: 'gallery-tools' })

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  useEffect(() => {
    // Register GSAP plugin on client side only
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  // Ensure blur is removed when preloader completes
  useEffect(() => {
    if (preloaderComplete && pageContentRef.current) {
      // Force remove any lingering filters
      pageContentRef.current.style.filter = 'none'
      pageContentRef.current.style.transform = 'none'
      // Force set opacity with !important to override any CSS conflicts
      pageContentRef.current.style.setProperty('opacity', '1', 'important')
    }
  }, [preloaderComplete])

  useEffect(() => {
    if (!preloaderComplete) return

    const heroTl = gsap.timeline()
    
    // Editorial Hero Animations
    if (heroRef.current) {
      const heroPortrait = heroRef.current.querySelector('.hero-portrait-frame')
      const heroHeading = heroRef.current.querySelector('h1')
      const heroHeadingSpans = heroHeading?.querySelectorAll('span')
      const heroGlassPanel = heroRef.current.querySelector('.hero-glass-panel')
      const heroOrbs = heroRef.current.querySelectorAll('.counter-orb')
      const heroBackgroundText = document.querySelector('.hero-background-text')
      const heroGradientAccent = document.querySelector('.hero-gradient-accent')
      
      // Background text entrance animation
      if (heroBackgroundText) {
        // Set initial state
        gsap.set(heroBackgroundText, {
          opacity: 0,
          scale: 0.7,
          x: 120,
          y: -60,
          rotation: 8,
          filter: 'blur(8px)'
        })
        
        // Entrance animation with staggered properties
        const backgroundTl = gsap.timeline({ delay: 0.8 })
        
        backgroundTl.to(heroBackgroundText, {
          opacity: 0.03,
          scale: 1.05,
          x: -10,
          y: 5,
          rotation: -1,
          filter: 'blur(0px)',
          duration: 1.8,
          ease: 'power2.out'
        })
        .to(heroBackgroundText, {
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.8)'
        }, '-=0.6')
      }
      
      // Main heading - starts first
      if (heroHeadingSpans) {
        heroTl.to(heroHeadingSpans, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
      }
      
      // Glass panel slide in - starts while heading is animating
      if (heroGlassPanel) {
        heroTl.to(heroGlassPanel, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out'
        }, '-=0.8')
      }
      
      // Portrait frame animation - starts while glass panel is animating
      if (heroPortrait) {
        heroTl.to(heroPortrait, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.8')
      }
      
      // Counter orbs elastic animation (keep original timing)
      if (heroOrbs.length > 0) {
        heroTl.to(heroOrbs, {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.6)'
        }, '-=0.4')
      }
      
      // Gradient accent float
      if (heroGradientAccent) {
        gsap.to(heroGradientAccent, {
          x: 50,
          y: -50,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
      
      // Parallax on scroll for portrait - bidirectional rotation
      if (heroPortrait) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
          onUpdate: (self) => {
            const progress = self.progress
            
            // Bidirectional rotation: 0deg at top → -12deg at scroll → back to 0deg when returning up
            let targetRotation
            let targetY
            
            if (self.direction === 1) {
              // Scrolling down: 0deg → -12deg
              targetRotation = progress * -12
              targetY = progress * -80
            } else {
              // Scrolling up: maintain current position but allow return to 0deg at top
              targetRotation = progress * -12
              targetY = progress * -80
            }
            
            gsap.set(heroPortrait, {
              rotation: targetRotation,
              y: targetY,
              transformOrigin: 'center center'
            })
          }
        })
        
        // Additional trigger to return to 15deg when fully scrolled back to top
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top 80%',
          end: 'top 100%',
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress === 0) {
              // When completely at top, smoothly return to 15deg default
              gsap.to(heroPortrait, {
                rotation: 15,
                duration: 0.8,
                ease: 'power2.out'
              })
            }
          }
        })
      }
    }

    // Editorial Showcase Animations
    if (missionRef.current) {
      // Mobile detection for faster animations
      const isMobile = window.innerWidth <= 768
      const mobileMultiplier = isMobile ? 0.7 : 1 // Faster animations on mobile
      
      const editorialHeader = missionRef.current.querySelector('.editorial-header')
      const editorialMeta = missionRef.current.querySelector('.editorial-meta')
      const editorialHeadline = missionRef.current.querySelectorAll('.editorial-headline span')
      const editorialLead = missionRef.current.querySelector('.editorial-lead')
      const statOrb = missionRef.current.querySelector('.floating-stat-orb')
      const cinematicFrames = missionRef.current.querySelectorAll('.cinematic-frame')
      const storyBlocks = missionRef.current.querySelectorAll('.editorial-story-block')
      const editorialQuote = missionRef.current.querySelector('.editorial-quote-block')
      const accentElement = missionRef.current.querySelector('.editorial-accent-element')

      // Editorial Header Animation
      if (editorialMeta) {
        gsap.fromTo(editorialMeta, 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8 * mobileMultiplier,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: editorialHeader,
              start: 'top 80%',
            }
          }
        )
      }

      // Headline Animation
      if (editorialHeadline.length > 0) {
        gsap.fromTo(editorialHeadline,
          { y: 60, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2 * mobileMultiplier,
            stagger: 0.2 * mobileMultiplier,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: editorialHeader,
              start: 'top 75%',
            }
          }
        )
      }

      // Lead text animation
      if (editorialLead) {
        gsap.fromTo(editorialLead,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1 * mobileMultiplier,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: editorialHeader,
              start: 'top 70%',
            }
          }
        )
      }

      // Floating stat orb animation
      if (statOrb) {
        gsap.fromTo(statOrb,
          { scale: 0, rotate: -180, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)',
            scrollTrigger: {
              trigger: editorialHeader,
              start: 'top 65%',
            }
          }
        )
      }

      // Cinematic frames animation
      cinematicFrames.forEach((frame) => {
        gsap.fromTo(frame,
          { y: 80, opacity: 0, rotateY: 15 },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: frame,
              start: 'top 75%',
            }
          }
        )

        // Parallax for cinematic images
        const cinematicImage = frame.querySelector('.cinematic-image')
        if (cinematicImage) {
          gsap.to(cinematicImage, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          })
        }
      })

      // Story blocks animation
      storyBlocks.forEach((block) => {
        const storyNumber = block.querySelector('.story-number')
        const storyTitle = block.querySelector('.story-title')
        const storyText = block.querySelector('.story-text')
        const storyImageContainer = block.querySelector('.story-image-container')
        const enhancedMetrics = block.querySelector('.enhanced-metrics')

        // Story number animation
        if (storyNumber) {
          gsap.fromTo(storyNumber,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 0.1,
              duration: 1,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: block,
                start: 'top 80%',
              }
            }
          )
        }

        // Story content stagger animation
        const storyElements = [storyTitle, storyText].filter(Boolean)
        if (storyElements.length > 0) {
          gsap.fromTo(storyElements,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: block,
                start: 'top 75%',
              }
            }
          )
        }

        // Enhanced metrics animation
        if (enhancedMetrics) {
          gsap.fromTo(enhancedMetrics,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: enhancedMetrics,
                start: 'top 85%',
              }
            }
          )
        }

        // Story image container animation with elegant entrance
        if (storyImageContainer) {
          gsap.fromTo(storyImageContainer,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: storyImageContainer,
                start: 'top 85%',
                onEnter: () => {
                  storyImageContainer.classList.add('animate-in')
                }
              }
            }
          )
        }
      })

      // Editorial quote animation
      if (editorialQuote) {
        const quoteDecoration = editorialQuote.querySelector('.quote-decoration')
        const quote = editorialQuote.querySelector('.editorial-quote')
        const attribution = editorialQuote.querySelector('.quote-attribution')

        gsap.fromTo(quoteDecoration,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.2,
            duration: 1.5,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: editorialQuote,
              start: 'top 80%',
            }
          }
        )

        gsap.fromTo(quote,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: editorialQuote,
              start: 'top 75%',
            }
          }
        )

        gsap.fromTo(attribution,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: editorialQuote,
              start: 'top 75%',
            }
          }
        )
      }

      // Accent element floating animation
      if (accentElement) {
        gsap.fromTo(accentElement,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: accentElement,
              start: 'top 80%',
            }
          }
        )
      }
    }

    // Desktop Timeline Animations
    if (skillsRef.current) {
      const timelineContainer = skillsRef.current
      const skillNodes = timelineContainer.querySelectorAll('.skill-node')
      const milestones = timelineContainer.querySelectorAll('.milestone')
      
      // Timeline path drawing animation
      ScrollTrigger.create({
        trigger: timelineContainer,
        start: 'top 80%',
        onEnter: () => {
          timelineContainer.classList.add('timeline-animate-in')
        }
      })

      // Skill nodes entrance animation
      gsap.fromTo(
        skillNodes,
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.8,
          rotation: -10 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 70%',
          },
        }
      )

      // Milestones animation
      gsap.fromTo(
        milestones,
        { 
          opacity: 0, 
          scale: 0.5 
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'elastic.out(1, 0.8)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 60%',
          },
        }
      )

      // Add hover interactions for skill nodes
      skillNodes.forEach((node) => {
        const circle = node.querySelector('.skill-node-circle')
        const content = node.querySelector('.skill-node-content')
        
        if (circle && content) {
          node.addEventListener('mouseenter', () => {
            gsap.to(circle, {
              scale: 1.1,
              y: -8,
              duration: 0.4,
              ease: 'power2.out'
            })
            gsap.to(content, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out'
            })
          })
          
          node.addEventListener('mouseleave', () => {
            gsap.to(circle, {
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            })
            gsap.to(content, {
              opacity: 0,
              y: 20,
              scale: 0.9,
              duration: 0.4,
              ease: 'power2.out'
            })
          })
        }
      })
    }

    // Mobile Timeline Animations
    const mobileTimelineContainer = document.querySelector('.mobile-timeline-container')
    if (mobileTimelineContainer) {
      const mobileCards = mobileTimelineContainer.querySelectorAll('.mobile-skill-card')
      const progressLine = mobileTimelineContainer.querySelector('.mobile-progress-line')
      
      // Mobile progress line animation
      if (progressLine) {
        ScrollTrigger.create({
          trigger: mobileTimelineContainer,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress * 100
            gsap.set(progressLine, { height: `${progress}%` })
          }
        })
      }

      // Mobile cards staggered entrance
      gsap.fromTo(
        mobileCards,
        { 
          opacity: 0, 
          x: -30,
          scale: 0.95
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mobileTimelineContainer,
            start: 'top 70%',
          },
        }
      )

      // Mobile card hover interactions
      mobileCards.forEach((card) => {
        const cardContent = card.querySelector('.mobile-skill-content')
        
        if (cardContent) {
          card.addEventListener('mouseenter', () => {
            gsap.to(cardContent, {
              scale: 1.02,
              y: -4,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
          
          card.addEventListener('mouseleave', () => {
            gsap.to(cardContent, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
        }
      })
    }


    // Gallery Exhibition Animations - Museum Quality
    if (galleryRef.current) {
      const galleryTitle = galleryRef.current.querySelector('.gallery-title')
      const galleryDivider = galleryRef.current.querySelector('.gallery-divider')
      const gallerySubtitle = galleryRef.current.querySelector('.gallery-subtitle')
      const galleryPanels = galleryRef.current.querySelectorAll('.gallery-panel')
      
      // Gallery entrance timeline - sophisticated sequencing
      const galleryTl = gsap.timeline({
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
      
      // Gallery title emerges with dramatic presence
      if (galleryTitle) {
        galleryTl.fromTo(galleryTitle,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
          }
        )
      }

      // Divider line draws across with precision
      if (galleryDivider) {
        galleryTl.fromTo(galleryDivider,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.4,
            ease: 'power2.out',
            transformOrigin: 'center center'
          },
          '-=0.3'
        )
      }

      // Subtitle materializes with elegant timing
      if (gallerySubtitle) {
        galleryTl.fromTo(gallerySubtitle,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          },
          '-=0.2'
        )
      }

      // Gallery panels emerge - animate entire cards only
      if (galleryPanels.length > 0) {
        galleryTl.fromTo(galleryPanels,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'transform'
          },
          '-=0.2'
        )
      }
      
      // Enhanced hover interactions for gallery panels
      galleryPanels.forEach((panel) => {
        const spotlight = panel.querySelector('.spotlight')
        
        // Sophisticated hover entrance
        panel.addEventListener('mouseenter', () => {
          gsap.to(panel, {
            scale: 1.02,
            y: -8,
            duration: 0.6,
            ease: 'power2.out',
            force3D: true
          })
          
          if (spotlight) {
            gsap.to(spotlight, {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out'
            })
          }
        })
        
        // Elegant hover exit
        panel.addEventListener('mouseleave', () => {
          gsap.to(panel, {
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            force3D: true
          })
          
          if (spotlight) {
            gsap.to(spotlight, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out'
            })
          }
        })
      })
      
    }

    // Smooth Counter Animations - starting from 1
    if (countersRef.current) {
      const projectsTarget = 50
      const yearsTarget = 5
      
      // Create scroll trigger for counters
      ScrollTrigger.create({
        trigger: countersRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          // Animate projects counter smoothly from 0
          gsap.to({ value: 0 }, {
            value: projectsTarget,
            duration: 3.5,
            ease: 'power1.inOut',
            onUpdate: function() {
              const val = Math.floor(this.targets()[0].value)
              setProjectsCount(val)
            }
          })
          
          // Animate years counter smoothly from 0 with slight delay
          gsap.to({ value: 0 }, {
            value: yearsTarget,
            duration: 3,
            delay: 0.2,
            ease: 'power1.inOut',
            onUpdate: function() {
              const val = Math.floor(this.targets()[0].value)
              setYearsCount(val)
            }
          })
        }
      })
    }

    // Teaching Section Animations
    const teachingCards = document.querySelectorAll('.teaching-card') as NodeListOf<HTMLElement>
    const teachingVideo = document.getElementById('teaching-video') as HTMLVideoElement
    const counters = document.querySelectorAll('.counter')

    // Animate teaching cards on scroll
    teachingCards.forEach((card, index) => {
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Counter animation
    const animateCounters = () => {
      counters.forEach(counter => {
        const dataCount = counter.getAttribute('data-count')
        if (!dataCount) return
        const target = parseInt(dataCount)
        gsap.fromTo({ count: 0 }, 
          { count: 0 },
          {
            count: target,
            duration: 2,
            ease: 'power3.out',
            onUpdate: function() {
              const currentCount = Math.round(this.targets()[0].count)
              counter.textContent = currentCount.toString()
            },
            scrollTrigger: {
              trigger: counter,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }

    // Initialize counter animation
    animateCounters()

    // Video interaction effects
    if (teachingVideo) {
      const statsCard = document.querySelector('[data-card="stats"]') as HTMLElement
      const philosophyCard = document.querySelector('[data-card="philosophy"]') as HTMLElement
      const successCard = document.querySelector('[data-card="success"]') as HTMLElement

      // Video event listeners for card highlighting
      teachingVideo.addEventListener('timeupdate', () => {
        const currentTime = teachingVideo.currentTime
        const duration = teachingVideo.duration

        // Reset all card highlights using CSS custom properties
        teachingCards.forEach(card => {
          card.style.setProperty('--card-transform', 'translateY(0) scale(1) rotateY(0deg)')
          card.style.setProperty('--card-shadow', '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 8px 25px -8px rgba(0, 0, 0, 0.1)')
        })

        // Highlight cards based on video progress with subtle animation
        if (currentTime / duration < 0.33 && statsCard) {
          // Highlight stats card in first third
          statsCard.style.setProperty('--card-transform', 'translateY(-6px) scale(1.03) rotateY(1deg)')
          statsCard.style.setProperty('--card-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 30px -8px rgba(0, 0, 0, 0.3)')
        } else if (currentTime / duration < 0.66 && philosophyCard) {
          // Highlight philosophy card in second third
          philosophyCard.style.setProperty('--card-transform', 'translateY(-6px) scale(1.03) rotateY(1deg)')
          philosophyCard.style.setProperty('--card-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 30px -8px rgba(0, 0, 0, 0.3)')
        } else if (successCard) {
          // Highlight success card in final third
          successCard.style.setProperty('--card-transform', 'translateY(-6px) scale(1.03) rotateY(1deg)')
          successCard.style.setProperty('--card-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 30px -8px rgba(0, 0, 0, 0.3)')
        }
      })

      // Reset highlights when video pauses
      teachingVideo.addEventListener('pause', () => {
        teachingCards.forEach(card => {
          card.style.setProperty('--card-transform', 'translateY(0) scale(1) rotateY(0deg)')
          card.style.setProperty('--card-shadow', '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 8px 25px -8px rgba(0, 0, 0, 0.1)')
        })
      })
    }

    // Teaching moments gallery animation
    const galleryImages = document.querySelectorAll('[src*="girlcode-teaching-"]')
    galleryImages.forEach((img, index) => {
      gsap.fromTo(img.parentElement, 
        { 
          opacity: 0, 
          y: 40,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: (index % 4) * 0.1, // Stagger by columns
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [preloaderComplete])

  // Carousel autoplay effect
  return (
    <>
      {!preloaderComplete && (
        <PagePreloader
          pageName="About"
          onComplete={handlePreloaderComplete}
          pageContentRef={pageContentRef}
        />
      )}

      <Navigation preloaderComplete={preloaderComplete} />
      <div
        ref={pageContentRef}
        style={{
          opacity: preloaderComplete ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          willChange: 'filter, transform, opacity'
        }}
      >
          <main className="min-h-screen pt-24">
        {/* Editorial Elegance Hero Section */}
        <section className="editorial-hero hero-section bg-background-primary">
          {/* Background Elements */}
          <div className="hero-background-text font-satoshi text-primary" style={{ right: '10%', top: '10%' }}>
            JACQUELINE
          </div>
          
          {/* Animated Gradient Accent */}
          <div className="hero-gradient-accent opacity-50" style={{ right: '-300px', top: '20%' }}></div>
          
          
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-20">
            <div ref={heroRef} className="w-full max-w-7xl mx-auto">
              {/* Main Content Grid - Mobile-first with portrait on top */}
              <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center min-h-screen py-12 md:py-16 lg:py-20">
                
                {/* Left Content Area - Order 2 on mobile, 1 on desktop */}
                <div className="lg:col-span-5 space-y-6 md:space-y-8 order-2 lg:order-1 px-4 lg:px-0">
                  {/* Main Heading */}
                  <div className="space-y-2">
                    <h1 className="font-satoshi text-primary text-center lg:text-left" style={{
                      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                      lineHeight: '1.1',
                      letterSpacing: '-0.02em'
                    }}>
                      <span className="hero-heading-light opacity-0" style={{ fontWeight: '200', display: 'inline-block', transform: 'translateY(80px) rotateX(-10deg)' }}>Empowering</span><br />
                      <span style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <span className="hero-heading-bold opacity-0" style={{ fontWeight: '600', display: 'inline-block', transform: 'translateY(80px) rotateX(-10deg)' }}>Digital</span>
                        <span className="hero-heading-light opacity-0" style={{ fontWeight: '200', display: 'inline-block', transform: 'translateY(80px) rotateX(-10deg)' }}>Journeys</span>
                      </span>
                    </h1>
                    
                  </div>
                  
                  {/* Bio in Glass Panel */}
                  <div className="hero-glass-panel opacity-0" style={{ transform: 'translateX(-60px) scale(0.95)' }}>
                    <p className="text-text-secondary leading-relaxed font-inter text-center lg:text-left px-2 lg:px-0" style={{ fontSize: 'clamp(calc(0.875rem + 2px), 2vw, calc(1rem + 2px))' }}>
                      Digital Growth Strategist architecting revenue-generating ecosystems for premium brands worldwide.
                    </p>
                  </div>
                  
                  {/* Floating Counter Orbs */}
                  <div ref={countersRef} className="flex gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
                    <div className="counter-orb group opacity-0" style={{ transform: 'scale(0) rotate(-180deg)' }}>
                      <div 
                        data-counter="projects" 
                        className="counter-number text-2xl md:text-3xl font-satoshi font-extralight text-primary mb-1 relative overflow-hidden"
                      >
                        <span className="counter-value relative inline-block transition-all duration-600 group-hover:text-text-primary">
                          {projectsCount}{projectsCount >= 50 ? '+' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-widest uppercase transition-all duration-500 group-hover:text-text-secondary">
                        Projects
                      </div>
                    </div>
                    
                    <div className="counter-orb group opacity-0" style={{ transform: 'scale(0) rotate(-180deg)' }}>
                      <div 
                        data-counter="years" 
                        className="counter-number text-2xl md:text-3xl font-satoshi font-extralight text-primary mb-1 relative overflow-hidden"
                      >
                        <span className="counter-value relative inline-block transition-all duration-600 group-hover:text-text-primary">
                          {yearsCount}{yearsCount >= 5 ? '+' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-widest uppercase transition-all duration-500 group-hover:text-text-secondary">
                        Years
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Spacer */}
                <div className="lg:col-span-2 order-3 lg:order-2"></div>
                
                {/* Right Portrait Area - Order 1 on mobile, 3 on desktop */}
                <div className="lg:col-span-5 order-1 lg:order-3 px-4 lg:px-0 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-sm lg:max-w-md">
                    {/* Portrait Image Container */}
                    <div 
                      className="hero-portrait-frame w-full aspect-[4/5] relative rounded-2xl overflow-hidden cursor-pointer"
                      style={{
                        opacity: 0,
                        transform: 'scale(0.8) rotate(15deg)'
                      }}
                      onMouseEnter={(e) => {
                        if (preloaderComplete) {
                          gsap.to(e.currentTarget, {
                            rotation: '+=3',
                            scale: 1.02,
                            duration: 0.6,
                            ease: 'power2.out'
                          })
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (preloaderComplete) {
                          gsap.to(e.currentTarget, {
                            rotation: '-=3',
                            scale: 1,
                            duration: 0.8,
                            ease: 'elastic.out(1, 0.5)'
                          })
                        }
                      }}
                    >
                      <Image
                        src="/images/about-hero.jpg"
                        alt="Jacqueline Amoako"
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Decorative Element */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-text-tertiary/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Showcase - Project Spotlight */}
        <section className="editorial-showcase bg-background-secondary relative overflow-hidden">
          {/* Background Elements */}
          <div className="editorial-bg-accent opacity-30" style={{ right: '-200px', top: '20%' }}></div>
          <div className="editorial-bg-grain"></div>
          
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-20">
            <div ref={missionRef} className="w-full max-w-7xl mx-auto py-8 md:py-16 lg:py-24">
              
              {/* Editorial Header */}
              <div className="editorial-header mb-12 md:mb-16 lg:mb-20 text-center">
                <div className="editorial-meta mb-4 md:mb-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                  <span className="editorial-category text-xs md:text-sm">Impact Story</span>
                  <span className="editorial-divider hidden sm:block">—</span>
                  <span className="editorial-date text-xs md:text-sm">2023</span>
                </div>
                <h2 className="editorial-headline text-center mb-8 md:mb-12 lg:mb-16 px-4">
                  <span className="editorial-headline-main block md:inline">Empowering Women</span>
                  <span className="editorial-headline-accent block md:inline">Through Technology</span>
                </h2>
                <p className="editorial-lead text-center max-w-3xl mx-auto text-sm md:text-base lg:text-lg px-6 md:px-4 lg:px-0 leading-relaxed">
                  A significant highlight of my career has been my role as the sole female technologist in the
                  &quot;Digitalize for Jobs (D4J)&quot; program, a transformative initiative by German Agency for International Cooperation (GIZ) and Ghana Enterprise Agency (GEA).
                </p>
              </div>

              {/* Editorial Grid Layout */}
              <div className="editorial-grid">
                
                {/* Large Stat Block */}
                <div className="editorial-stat-block">
                  <div className="floating-stat-orb">
                    <div className="flex items-start justify-center">
                      <div className="stat-number" data-count="100">100</div>
                      <div className="stat-suffix">+</div>
                    </div>
                    <div className="stat-label">Women<br />Empowered</div>
                  </div>
                </div>

                {/* Hero Image Block */}
                <div className="editorial-image-block">
                  <div className="cinematic-frame">
                    <Image
                      src="/images/img-carousel-8.jpg"
                      alt="Women in tech training session"
                      fill
                      className="cinematic-image"
                    />
                    <div className="cinematic-overlay"></div>
                    <div className="image-caption">
                      <span className="caption-text">Training sessions across Ghana</span>
                    </div>
                  </div>
                </div>

                {/* Introduction Text Block */}
                <div className="editorial-intro-block">
                  <div className="editorial-large-text">
                    Through this groundbreaking program, I&apos;ve had the privilege of bridging the digital divide 
                    and empowering women entrepreneurs across Ghana with essential technology skills.
                  </div>
                </div>

                {/* Story Block 01 */}
                <div className="editorial-story-block story-01 pt-8 md:pt-12 lg:pt-16">
                  <div className="story-content px-4 md:px-0">
                    <div 
                      style={{
                        position: 'relative',
                        fontSize: '4rem',
                        fontWeight: '100',
                        opacity: '0.15',
                        zIndex: '1',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-satoshi), sans-serif',
                        lineHeight: '1',
                        color: 'rgb(var(--color-text-primary))'
                      }}
                      className="md:!text-left"
                    >01</div>
                    <h3 className="story-title mb-4 md:mb-6 text-lg md:text-xl lg:text-2xl text-center md:text-left">Digital Empowerment Solutions</h3>
                    <p className="story-text text-sm md:text-base leading-relaxed text-center md:text-left">
                      {content.about.mission.points[0]}
                    </p>
                    
                    {/* Quote Section - moved back to story block 01 (desktop only) */}
                    <div className="editorial-quote-block mt-8 md:mt-12 lg:mt-16 hidden md:block">
                      <div className="quote-decoration mb-4">&quot;</div>
                      <blockquote className="editorial-quote text-center md:text-left text-sm md:text-base px-2 md:px-0">
                        {content.about.mission.conclusion}
                      </blockquote>
                      <div className="quote-attribution">
                        <div className="attribution-line"></div>
                        <span className="attribution-text">Personal Mission</span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Story Block 02 */}
                <div className="editorial-story-block story-02 pt-8 md:pt-12 lg:pt-16">
                  <div className="story-content px-4 md:px-0">
                    <div 
                      style={{
                        position: 'relative',
                        fontSize: '4rem',
                        fontWeight: '100',
                        opacity: '0.15',
                        zIndex: '1',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-satoshi), sans-serif',
                        lineHeight: '1',
                        color: 'rgb(var(--color-text-primary))'
                      }}
                      className="md:!text-left"
                    >02</div>
                    <h3 className="story-title mb-4 md:mb-6 w-full text-lg md:text-xl lg:text-2xl text-center md:text-left">Skill Transfer & Training</h3>
                    <p className="story-text text-sm md:text-base leading-relaxed text-center md:text-left">
                      {content.about.mission.points[1]}
                    </p>
                    
                    
                    {/* Full Width Image */}
                    <div className="story-visual mt-8 md:mt-12 lg:mt-16 w-full">
                      <div className="story-image-container w-full aspect-[16/10] md:aspect-[16/9] relative overflow-hidden rounded-xl">
                        <Image
                          src="/images/img-carousel-1.jpg"
                          alt="Skill transfer and training sessions across Ghana"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Skills & Expertise - Interactive Timeline Journey */}
        <section className="pt-8 md:pt-12 lg:pt-16 pb-12 md:pb-16 lg:pb-24 bg-background-primary relative overflow-hidden">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="w-full max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20 lg:mb-32">
                <h2 className="font-satoshi font-light text-primary mb-6 px-4 lg:px-0" style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}>
                  Strategic Capabilities
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-3xl mx-auto font-light px-4 md:px-0">
                  The intersection of business strategy, technical mastery, and growth systems that drive measurable revenue impact
                </p>
              </div>
              
              {/* Desktop Timeline Container - Hidden on Mobile */}
              <div ref={skillsRef} className="relative timeline-container hidden lg:block" style={{ 
                minHeight: '400px',
                transform: 'translateY(-40px)'
              }}>
                {/* Flowing SVG Path */}
                <svg className="timeline-path absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                  {/* Background guide path - more visible */}
                  <path
                    id="timeline-curve"
                    d="M100,120 Q350,40 600,120 T1100,350"
                    fill="none"
                    stroke="rgb(var(--color-border-light))"
                    strokeWidth="1.5"
                    className="timeline-stroke"
                    opacity="0.4"
                  />
                  {/* Animated progress path */}
                  <path
                    id="timeline-progress"
                    d="M100,120 Q350,40 600,120 T1100,350"
                    fill="none"
                    stroke="rgb(var(--color-text-primary))"
                    strokeWidth="1.5"
                    className="timeline-progress-stroke"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    opacity="0.8"
                  />
                </svg>

                {/* Desktop Nodes */}
                <div className="skill-node-container absolute z-20" style={{ left: '8.33%', top: '35%', transform: 'translate(-50%, -50%)' }}>
                  <div className="skill-node">
                    <div className="skill-node-circle">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div className="skill-node-label">
                      <h3 className="skill-node-title">Brand Identity</h3>
                    </div>
                    <div className="skill-node-content skill-node-expanded">
                      <p className="skill-node-description">Strategic visual systems that establish premium positioning and market differentiation</p>
                      <div className="skill-node-details">
                        <span className="skill-years">3+ Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="skill-node-container absolute z-20" style={{ left: '29.17%', top: '20%', transform: 'translate(-50%, -50%)' }}>
                  <div className="skill-node">
                    <div className="skill-node-circle">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div className="skill-node-label">
                      <h3 className="skill-node-title">Frontend Development</h3>
                    </div>
                    <div className="skill-node-content skill-node-expanded">
                      <p className="skill-node-description">Conversion-optimized interfaces engineered for premium user experiences</p>
                      <div className="skill-node-details">
                        <span className="skill-years">4+ Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="skill-node-container absolute z-20" style={{ left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                  <div className="skill-node">
                    <div className="skill-node-circle">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="skill-node-label">
                      <h3 className="skill-node-title">SEO & Performance</h3>
                    </div>
                    <div className="skill-node-content skill-node-expanded">
                      <p className="skill-node-description">Search optimization, Core Web Vitals & performance tuning</p>
                      <div className="skill-node-details">
                        <span className="skill-years">4+ Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="skill-node-container absolute z-20" style={{ left: '70.83%', top: '60%', transform: 'translate(-50%, -50%)' }}>
                  <div className="skill-node">
                    <div className="skill-node-circle">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div className="skill-node-label">
                      <h3 className="skill-node-title">Backend Development</h3>
                    </div>
                    <div className="skill-node-content skill-node-expanded">
                      <p className="skill-node-description">Scalable data architecture and robust systems that power business growth</p>
                      <div className="skill-node-details">
                        <span className="skill-years">4+ Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="skill-node-container absolute z-20" style={{ left: '91.67%', top: '90%', transform: 'translate(-50%, -50%)' }}>
                  <div className="skill-node">
                    <div className="skill-node-circle">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="skill-node-label">
                      <h3 className="skill-node-title">APIs & Automation</h3>
                    </div>
                    <div className="skill-node-content skill-node-expanded">
                      <p className="skill-node-description">Business process automation and intelligent system orchestration</p>
                      <div className="skill-node-details">
                        <span className="skill-years">3+ Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Vertical Timeline - Visible only on Mobile/Tablet */}
              <div className="mobile-timeline-container lg:hidden relative max-w-2xl mx-auto px-4">
                {/* Timeline Items */}
                <div className="relative">
                  {/* Timeline Item 1: Brand Identity */}
                  <div className="mobile-skill-card relative flex items-start gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {/* Icon with connecting line */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 mobile-timeline-icon rounded-full flex items-center justify-center z-30">
                        <Palette className="w-6 h-6 mobile-timeline-icon-svg" />
                      </div>
                      {/* Connecting line from bottom of this icon to top of next icon */}
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-px h-48 sm:h-56 bg-gray-400 z-10"></div>
                    </div>
                    {/* Content Card */}
                    <div className="flex-1 bg-background-secondary rounded-2xl p-5 sm:p-6 border border-border-light hover:shadow-lg transition-all duration-600 mobile-skill-content mt-1" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <h3 className="text-base sm:text-lg font-satoshi font-medium text-primary mb-2 sm:mb-3">Brand Identity</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                        Strategic visual systems that establish premium positioning and market differentiation
                      </p>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                        3+ Years Experience
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 2: SEO & Performance */}
                  <div className="mobile-skill-card relative flex items-start gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {/* Icon with connecting line */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 mobile-timeline-icon rounded-full flex items-center justify-center z-30">
                        <Search className="w-6 h-6 mobile-timeline-icon-svg" />
                      </div>
                      {/* Connecting line from bottom of this icon to top of next icon */}
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-px h-48 sm:h-56 bg-gray-400 z-10"></div>
                    </div>
                    {/* Content Card */}
                    <div className="flex-1 bg-background-secondary rounded-2xl p-5 sm:p-6 border border-border-light hover:shadow-lg transition-all duration-600 mobile-skill-content mt-1" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <h3 className="text-base sm:text-lg font-satoshi font-medium text-primary mb-2 sm:mb-3">SEO & Performance</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                        Search optimization, Core Web Vitals & performance tuning
                      </p>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                        4+ Years Experience
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 3: Backend Development */}
                  <div className="mobile-skill-card relative flex items-start gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {/* Icon with connecting line */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 mobile-timeline-icon rounded-full flex items-center justify-center z-30">
                        <Monitor className="w-6 h-6 mobile-timeline-icon-svg" />
                      </div>
                      {/* Connecting line from bottom of this icon to top of next icon */}
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-px h-48 sm:h-56 bg-gray-400 z-10"></div>
                    </div>
                    {/* Content Card */}
                    <div className="flex-1 bg-background-secondary rounded-2xl p-5 sm:p-6 border border-border-light hover:shadow-lg transition-all duration-600 mobile-skill-content mt-1" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <h3 className="text-base sm:text-lg font-satoshi font-medium text-primary mb-2 sm:mb-3">Backend Development</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                        Scalable data architecture and robust systems that power business growth
                      </p>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                        4+ Years Experience
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 4: Frontend Development */}
                  <div className="mobile-skill-card relative flex items-start gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {/* Icon with connecting line */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 mobile-timeline-icon rounded-full flex items-center justify-center z-30">
                        <Code2 className="w-6 h-6 mobile-timeline-icon-svg" />
                      </div>
                      {/* Connecting line from bottom of this icon through the final icon */}
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-px h-56 sm:h-64 bg-gray-400 z-10"></div>
                    </div>
                    {/* Content Card */}
                    <div className="flex-1 bg-background-secondary rounded-2xl p-5 sm:p-6 border border-border-light hover:shadow-lg transition-all duration-600 mobile-skill-content mt-1" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <h3 className="text-base sm:text-lg font-satoshi font-medium text-primary mb-2 sm:mb-3">Frontend Development</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                        Conversion-optimized interfaces engineered for premium user experiences
                      </p>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                        5+ Years Experience
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 5: APIs & Automation (Final Item - No Connecting Line) */}
                  <div className="mobile-skill-card relative flex items-start gap-4 sm:gap-6">
                    {/* Icon without connecting line */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 mobile-timeline-icon rounded-full flex items-center justify-center z-30">
                        <Settings className="w-6 h-6 mobile-timeline-icon-svg" />
                      </div>
                    </div>
                    {/* Content Card */}
                    <div className="flex-1 bg-background-secondary rounded-2xl p-5 sm:p-6 border border-border-light hover:shadow-lg transition-all duration-600 mobile-skill-content mt-1" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <h3 className="text-base sm:text-lg font-satoshi font-medium text-primary mb-2 sm:mb-3">APIs & Automation</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                        Business process automation and intelligent system orchestration
                      </p>
                      <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                        3+ Years Experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Girlcode Africa Teaching - Side-by-Side Showcase */}
        <section id="teaching" className="pt-16 md:pt-24 lg:pt-16 pb-2 md:pb-3 lg:pb-4 relative overflow-hidden bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary" style={{ marginTop: 'clamp(0px, 0px, -20em)' }}>
          {/* Subtle Background Elements */}
          <div className="absolute top-20 right-32 w-[300px] h-[300px] rounded-full opacity-5" 
               style={{
                 background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                 filter: 'blur(60px)',
                 animation: 'float 15s ease-in-out infinite'
               }}></div>
          <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full opacity-5" 
               style={{
                 background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                 filter: 'blur(80px)',
                 animation: 'float 20s ease-in-out infinite reverse'
               }}></div>
          
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-20">
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Section Header */}
              <div className="text-center mb-12 md:mb-16 lg:mb-24">
                <div className="inline-flex items-center gap-3 sm:gap-4 px-6 py-3 sm:px-8 sm:py-4 rounded-full mb-6 sm:mb-8" 
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                       backdropFilter: 'blur(25px)',
                       border: '1px solid rgba(255, 255, 255, 0.15)',
                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-hover opacity-20 blur-md"></div>
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-on-dark-primary sm:w-[18px] sm:h-[18px]">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-text-primary font-normal tracking-wider text-sm sm:text-base lg:text-lg">Teaching & Mentorship</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight tracking-tight text-text-primary px-4"
                    style={{
                      letterSpacing: '-0.03em'
                    }}>
                  Empowering Future STEM Leaders
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light px-4">
                  Empowering girls and young women in technology through hands-on STEM education at GirlCode Africa
                </p>
              </div>

              {/* Main Content - Side by Side Layout */}
              <div className="relative" style={{ minHeight: 'auto' }}>

                {/* Golden Ratio Layout Container - 61.8% / 38.2% proportions */}
                <div className="relative flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">

                  {/* Primary Content Zone - Golden Ratio Major (61.8%) */}
                  <div className="relative lg:w-[61.8%] flex flex-col"
                       style={{
                         transform: 'translateX(0)', // Remove transform on mobile
                         zIndex: 20
                       }}>
                    {/* Hero Video - Fibonacci Positioning */}
                    <div className="relative mb-6 sm:mb-8 lg:mb-[55px]">
                      {/* Enhanced Ambient Glow - Mathematical Precision */}
                      <div className="absolute rounded-3xl opacity-30 lg:opacity-40"
                           style={{
                             left: '-20px',
                             right: '-20px',
                             top: '-20px',
                             bottom: '-20px',
                             background: 'radial-gradient(ellipse at center, rgba(var(--color-accent), 0.25) 0%, rgba(var(--color-accent-hover), 0.15) 40%, transparent 70%)',
                             filter: 'blur(20px)'
                           }}></div>

                      {/* Dramatic Contact Shadow - Golden Ratio Positioning */}
                      <div className="absolute rounded-2xl opacity-40 lg:opacity-60"
                           style={{
                             left: '-10px',
                             right: '-10px',
                             top: '-10px',
                             bottom: '-10px',
                             background: 'radial-gradient(ellipse at center bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 80%)',
                             filter: 'blur(15px)',
                             transform: 'translateY(8px) scaleY(0.4)'
                           }}></div>
                    
                    <video
                      className="w-full aspect-[4/3] md:aspect-video rounded-xl sm:rounded-2xl object-cover relative transition-all duration-600 ease-out hover:scale-[1.02] cursor-pointer"
                      controls
                      preload="metadata"
                      style={{
                        boxShadow: `
                          0 40px 80px -20px rgba(0, 0, 0, 0.3),
                          0 20px 40px -12px rgba(0, 0, 0, 0.25),
                          0 10px 20px -8px rgba(0, 0, 0, 0.2),
                          0 4px 8px -4px rgba(0, 0, 0, 0.1)
                        `,
                        transform: 'translateY(0)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                        e.currentTarget.style.boxShadow = `
                          0 60px 120px -20px rgba(0, 0, 0, 0.4),
                          0 30px 60px -12px rgba(0, 0, 0, 0.3),
                          0 15px 30px -8px rgba(0, 0, 0, 0.25),
                          0 6px 12px -4px rgba(0, 0, 0, 0.15)
                        `
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = `
                          0 40px 80px -20px rgba(0, 0, 0, 0.3),
                          0 20px 40px -12px rgba(0, 0, 0, 0.25),
                          0 10px 20px -8px rgba(0, 0, 0, 0.2),
                          0 4px 8px -4px rgba(0, 0, 0, 0.1)
                        `
                      }}
                      id="teaching-video"
                    >
                      <source src="/images/gc-teaching-full.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Custom Video Info Overlay */}
                    <div className="absolute top-2 right-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                         style={{
                           background: 'rgba(0, 0, 0, 0.6)',
                           backdropFilter: 'blur(10px)',
                           color: 'white'
                         }}>
                      Live Teaching Session
                    </div>
                  </div>
                  
                    {/* Student Success Card - Sophisticated Positioning */}
                    <div className="teaching-card opacity-0 transform translate-y-8 backdrop-blur-xl bg-white/8 border border-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-700 cursor-pointer group hover:bg-white/12 hover:border-white/30 shadow-2xl"
                         style={{
                           boxShadow: '0 32px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                           willChange: 'transform, background-color, border-color',
                           transform: 'translateX(0)',
                           zIndex: 15
                         }}
                         data-card="success">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-background-primary dark:text-text-primary sm:w-6 sm:h-6">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Real Transformations</h3>
                        <p className="text-text-secondary text-xs sm:text-sm">Student success stories</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 sm:p-4 rounded-lg bg-background-secondary/30 transition-all duration-600 ease-in-out hover:bg-background-secondary/50 cursor-pointer group hover:shadow-lg" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <p className="text-text-primary text-xs sm:text-sm font-medium mb-1 group-hover:text-accent transition-colors duration-600" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>&quot;From zero to building my first website in 8 weeks!&quot;</p>
                        <p className="text-text-secondary text-[10px] sm:text-xs group-hover:text-text-primary transition-colors duration-600" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>- Jasmine K.</p>
                      </div>
                      <div className="p-3 sm:p-4 rounded-lg bg-background-secondary/30 transition-all duration-600 ease-in-out hover:bg-background-secondary/50 cursor-pointer group hover:shadow-lg" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <p className="text-text-primary text-xs sm:text-sm font-medium mb-1 group-hover:text-accent transition-colors duration-600" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>&quot;Jackie&apos;s teaching style made complex concepts so clear.&quot;</p>
                        <p className="text-text-secondary text-[10px] sm:text-xs group-hover:text-text-primary transition-colors duration-600" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>- Adelaide D.</p>
                      </div>
                    </div>
                    </div>
                  </div>
                  
                  {/* Secondary Content Zone - Golden Ratio Minor (38.2%) */}
                  <div className="relative lg:w-[38.2%] flex flex-col lg:pl-[34px] lg:-mt-[21px] lg:translate-x-[8px]"
                       style={{
                         zIndex: 10,
                       }}>
                  
                    {/* Impact Statistics Card - Elevated Position */}
                    <div className="teaching-card opacity-0 transform translate-y-8 backdrop-blur-xl bg-white/8 border border-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-700 cursor-pointer group hover:bg-white/12 hover:border-white/30 shadow-2xl mb-6 sm:mb-8 lg:mb-[55px] lg:-translate-y-[42px]"
                         style={{
                           boxShadow: '0 32px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                           willChange: 'transform, background-color, border-color',
                         }}
                         data-card="stats">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-background-primary dark:text-text-primary sm:w-6 sm:h-6">
                          <circle cx="9" cy="7" r="4"/>
                          <path d="m22 21-3-3m0 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Impact Metrics</h3>
                        <p className="text-text-secondary text-xs sm:text-sm">Transforming lives through code</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl transition-all duration-500 hover:bg-background-secondary/40 hover:scale-[1.02] cursor-pointer group" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-500 text-xs sm:text-sm">Girls Taught</span>
                        <span className="text-xl sm:text-2xl font-bold text-text-primary counter transition-all duration-500 group-hover:scale-110 group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" data-count="200">0</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl transition-all duration-500 hover:bg-background-secondary/40 hover:scale-[1.02] cursor-pointer group" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-500 text-xs sm:text-sm">Cohorts Completed</span>
                        <span className="text-xl sm:text-2xl font-bold text-text-primary counter transition-all duration-500 group-hover:scale-110 group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" data-count="15">0</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl transition-all duration-500 hover:bg-background-secondary/40 hover:scale-[1.02] cursor-pointer group" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-500 text-xs sm:text-sm">Years Teaching</span>
                        <span className="text-xl sm:text-2xl font-bold text-text-primary counter transition-all duration-500 group-hover:scale-110 group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" data-count="3">0</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl transition-all duration-500 hover:bg-background-secondary/40 hover:scale-[1.02] cursor-pointer group" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-500 text-xs sm:text-sm">Success Rate</span>
                        <div>
                          <span className="text-xl sm:text-2xl font-bold text-text-primary counter transition-all duration-500 group-hover:scale-110 group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" data-count="95">0</span><span className="text-text-primary group-hover:text-accent transition-colors duration-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Teaching Philosophy Card - Floating Position */}
                    <div className="teaching-card opacity-0 transform translate-y-8 backdrop-blur-xl bg-white/8 border border-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-700 flex flex-col justify-center text-center cursor-pointer group hover:bg-white/12 hover:border-white/30 shadow-2xl lg:translate-x-[-13px] lg:translate-y-[13px]"
                         style={{
                           boxShadow: '0 32px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                           willChange: 'transform, background-color, border-color',
                         }}
                         data-card="philosophy">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-accent to-accent-hover mx-auto mb-5 sm:mb-6 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-background-primary dark:text-text-primary sm:w-6 sm:h-6">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                      </svg>
                    </div>
                    <blockquote className="text-text-primary text-base sm:text-lg font-light italic leading-relaxed mb-3 sm:mb-4">
                      &quot;Every line of code is a step towards independence. I believe in empowering girls to not just learn technology, but to lead with it.&quot;
                    </blockquote>
                    <div className="text-text-secondary text-xs sm:text-sm font-medium">Teaching Philosophy</div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>



        {/* Why Partner With Me - Compact Manifesto Grid */}
        <section className="pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20 bg-background-primary relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Header row: label + title inline for density */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-10 md:mb-16 lg:mb-20 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-text-primary/30"></div>
                <span className="text-xs font-satoshi tracking-[0.2em] uppercase text-text-tertiary">
                  Strategic Partnership
                </span>
                <div className="w-8 h-px bg-text-primary/30"></div>
              </div>
              <h2
                className="font-satoshi text-text-primary"
                style={{
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em'
                }}
              >
                {content.about.whyPartnerWithMe.title}
              </h2>
            </motion.div>

            {/* 2x2 Manifesto Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-text-primary/[0.06] rounded-2xl overflow-hidden">
              {content.about.whyPartnerWithMe.differentiators.map((diff, index) => (
                <motion.div
                  key={diff.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group relative bg-background-primary"
                >
                  <div
                    className="relative p-5 md:p-9 lg:p-10 h-full transition-all group-hover:-translate-y-0.5"
                    style={{
                      transitionDuration: '600ms',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 md:gap-4 mb-4 md:mb-5">
                      <h3
                        className="font-satoshi text-text-primary tracking-tight flex-1 transition-all group-hover:tracking-wide"
                        style={{
                          fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          transitionDuration: '600ms',
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {diff.title}
                      </h3>
                      <span
                        className="manifesto-number font-satoshi flex-shrink-0 select-none pointer-events-none"
                        style={{
                          fontSize: 'clamp(1.875rem, 5vw, 3.5rem)',
                          fontWeight: 300,
                          lineHeight: 0.85,
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <p
                      className="font-satoshi font-normal text-text-secondary transition-colors group-hover:text-text-primary"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.2vw, 0.9375rem)',
                        lineHeight: 1.7,
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {diff.description}
                    </p>

                    {/* Hover: inner glow from bottom-left corner */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-none transition-opacity"
                      style={{
                        background: 'radial-gradient(ellipse at 0% 100%, rgb(var(--color-text-primary) / 0.05) 0%, transparent 60%)',
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Who I Work Best With - Asymmetric Editorial Cards */}
        <section className="pt-12 md:pt-16 lg:pt-20 pb-20 md:pb-24 lg:pb-28 bg-background-secondary relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

            {/* Header - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 md:mb-28 lg:mb-32 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-text-primary/20"></div>
                <span className="text-xs font-satoshi tracking-[0.2em] uppercase text-text-tertiary">
                  Partnership Criteria
                </span>
                <div className="w-8 h-px bg-text-primary/20"></div>
              </div>
              <h2
                className="font-satoshi text-text-primary mb-8"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em'
                }}
              >
                {content.about.idealClient.title}
              </h2>
              <p
                className="font-satoshi text-text-secondary max-w-2xl mx-auto"
                style={{
                  fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  letterSpacing: '0.01em'
                }}
              >
                {content.about.idealClient.intro}
              </p>
            </motion.div>

            {/* Staggered Editorial Cards */}
            <div className="space-y-6 md:space-y-12 lg:space-y-16">
              {content.about.idealClient.criteria.map((item, index) => (
                <motion.article
                  key={item.characteristic}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className={`group relative ${index % 2 === 0 ? 'md:ml-0 md:mr-auto md:max-w-4xl' : 'md:ml-auto md:mr-0 md:max-w-4xl lg:max-w-5xl'}`}
                >
                  {/* Floating Card */}
                  <div
                    className="relative overflow-hidden bg-background-primary px-6 py-8 md:px-12 md:py-14 lg:px-16 lg:py-16 transition-all"
                    style={{
                      transitionDuration: '600ms',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    {/* Oversized Index Number - Decorative Watermark */}
                    <div
                      className="absolute top-2 right-4 md:top-3 md:right-12 lg:top-2 lg:right-16 font-satoshi text-text-primary transition-all select-none pointer-events-none"
                      style={{
                        fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                        fontWeight: 200,
                        lineHeight: 0.8,
                        letterSpacing: '-0.05em',
                        opacity: 0.04,
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3
                        className="font-satoshi text-text-primary mb-4 md:mb-6 transition-all group-hover:translate-x-2"
                        style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                          fontWeight: 400,
                          lineHeight: 1.25,
                          letterSpacing: '-0.015em',
                          transitionDuration: '600ms',
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {item.characteristic}
                      </h3>
                      <p
                        className="font-satoshi transition-all group-hover:translate-x-2"
                        style={{
                          fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                          fontWeight: 400,
                          lineHeight: 1.75,
                          letterSpacing: '0.005em',
                          color: 'rgb(var(--color-text-secondary) / 0.9)',
                          transitionDuration: '600ms',
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Accent Line - Expands on Hover */}
                    <div
                      className="absolute bottom-0 left-0 h-px bg-text-primary w-0 group-hover:w-full transition-all"
                      style={{
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Not Ideal For - Elegant Closing Statement */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-12 md:mt-20 lg:mt-24 max-w-4xl mx-auto"
            >
              {/* Divider with title */}
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <div className="flex-1 h-px bg-text-primary/10" />
                <span
                  className="font-satoshi text-text-tertiary tracking-[0.15em] uppercase"
                  style={{ fontSize: '0.75rem', fontWeight: 500 }}
                >
                  {content.about.idealClient.notIdealFor.title}
                </span>
                <div className="flex-1 h-px bg-text-primary/10" />
              </div>

              {/* Criteria with subtle bullets */}
              <div className="space-y-3 md:space-y-5">
                {content.about.idealClient.notIdealFor.criteria.map((criterion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="flex items-start gap-3 md:gap-4 group"
                  >
                    <div
                      className="flex-shrink-0 w-1.5 h-1.5 mt-2 md:mt-2.5 rounded-full transition-all"
                      style={{
                        backgroundColor: 'rgb(var(--color-text-tertiary) / 0.3)',
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                    <p
                      className="font-satoshi transition-colors group-hover:text-text-secondary"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                        fontWeight: 400,
                        lineHeight: 1.7,
                        color: 'rgb(var(--color-text-tertiary) / 0.75)',
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {criterion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* Unique Approach - Horizontal Accordion Strips */}
        <section className="py-20 md:py-28 lg:py-32 bg-background-primary relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

            {/* Header with philosophy as typographic art */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 md:mb-20 lg:mb-24 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-8 h-px bg-text-primary/30"></div>
                <span className="text-xs font-satoshi tracking-[0.2em] uppercase text-text-tertiary">
                  Methodology
                </span>
                <div className="w-8 h-px bg-text-primary/30"></div>
              </div>
              <h2
                className="font-satoshi text-text-primary mb-12 md:mb-16"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em'
                }}
              >
                {content.about.uniqueApproach.title}
              </h2>

              {/* Philosophy as oversized typographic statement */}
              <div className="relative max-w-5xl mx-auto">
                <p
                  className="font-satoshi text-text-secondary"
                  style={{
                    fontSize: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    letterSpacing: '0.02em'
                  }}
                >
                  {content.about.uniqueApproach.philosophy}
                </p>
                {/* Subtle decorative line below philosophy */}
                <div className="mt-8 md:mt-16 w-24 h-px bg-text-primary/15 mx-auto" />
              </div>
            </motion.div>

            {/* Accordion strips */}
            <div className="space-y-0">
              {content.about.uniqueApproach.principles.map((item, index) => {
                const isOpen = openAccordion === index;
                return (
                <motion.div
                  key={item.principle}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group relative"
                >
                  {/* Top hairline */}
                  <div
                    className="h-px w-full bg-text-primary/8 group-hover:bg-text-primary/15 transition-colors duration-600"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  />

                  {/* Strip content */}
                  <div
                    className="relative py-6 md:py-10 lg:py-12 px-0 md:px-4 lg:px-8 rounded-none transition-all duration-600 group-hover:bg-background-secondary/40 lg:group-hover:px-12"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  >
                    {/* Strip header row - tappable on mobile */}
                    <button
                      type="button"
                      className="flex items-center justify-between gap-4 md:gap-8 w-full text-left cursor-pointer lg:cursor-default"
                      onClick={() => setOpenAccordion(isOpen ? null : index)}
                    >
                      <h3
                        className="font-satoshi text-text-primary flex-1 transition-colors duration-600 group-hover:text-accent"
                        style={{
                          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                          fontWeight: 400,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3,
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {item.principle}
                      </h3>

                      {/* Index + expand indicator */}
                      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                        <span
                          className="font-satoshi text-text-tertiary hidden md:block transition-colors duration-600 group-hover:text-text-secondary"
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                          }}
                        >
                          {String(index + 1).padStart(2, '0')} / {String(content.about.uniqueApproach.principles.length).padStart(2, '0')}
                        </span>
                        {/* Expand indicator */}
                        <div
                          className={`w-11 h-11 flex items-center justify-center transition-transform duration-600 lg:group-hover:rotate-45 ${isOpen ? 'rotate-45' : ''}`}
                          style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-tertiary group-hover:text-text-primary transition-colors duration-600" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                            <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expandable explanation - tap to toggle on mobile, hover on desktop */}
                    <div
                      className={`overflow-hidden transition-all duration-600 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-60 lg:group-hover:opacity-100 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    >
                      <p className="pt-5 md:pt-8 text-base md:text-lg text-text-secondary font-satoshi font-normal leading-[1.8] max-w-3xl">
                        {item.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Bottom hairline for last item */}
                  {index === content.about.uniqueApproach.principles.length - 1 && (
                    <div className="h-px w-full bg-text-primary/8" />
                  )}
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      </div>
    </>
  )
}