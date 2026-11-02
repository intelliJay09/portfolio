'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, TrendingUp, Star, type LucideIcon } from 'lucide-react'
import Navigation from '../Navigation'
import Footer from '../Footer'
import PortfolioFooter from '../PortfolioFooter'
import PagePreloader from '../PagePreloader'
import GlassCTA from '../ui/GlassCTA'
import portfolioData from '../../portfolio.json'
import content from '../../content.json'
import testimonialData from '../../testimonials.json'
import { useTheme } from '../../contexts/ThemeProvider'
import { trackProjectView } from '../../lib/analytics'

// Project data mapping
const getProjectData = (slug: string) => {
  const portfolioProject = portfolioData.portfolio.find(p => p.id === slug || p.id === slug.replace(/-/g, '-'))
  const contentProject = content.portfolio.projects.find(p => p.slug === slug)
  
  return {
    ...portfolioProject,
    ...contentProject,
  }
}

// Hero image mapping
const getProjectHeroImage = (slug: string) => {
  const heroImageMap: { [key: string]: string } = {
    'gwen-addo': '/images/gwen-portfolio-image.jpg',
    'eleven-eleven-ghana': '/images/11-11-case-study-hero.webp',
    'emmanuel-kotia': '/images/emma-kotia.png',
    'girl-code-africa': '/images/girlcode.png',
    'eden-heights': '/images/eden-heights.png',
    'landmark-homes': '/images/landmark-homes.png',
    'ghana-optometric-association': '/images/ghana-optometric- association-main.png',
    'twist-nightclub': '/images/twist-night-club.png',
    'command-space': '/images/command-space.png',
    'anabs': '/images/anabs.png',
    'kline-designs': '/images/klinedesign.png',
  }

  return heroImageMap[slug] || '/images/11-11-case-study-hero.webp' // Default fallback
}

// Types
interface PortfolioProject {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  client?: string;
  url?: string;
  year?: string;
  theChallenge?: string;
  [key: string]: unknown;
}

interface ProjectData {
  title?: string;
  category?: string;
  description?: string;
  client?: string;
  url?: string;
  year?: string;
  challenge?: {
    quote?: string;
    keyPoints?: string[];
  };
  video?: {
    src?: string;
    poster?: string;
  };
  results?: {
    description?: string;
  };
  techStack?: string[];
  stats?: Array<{ label: string; value: string }>;
  [key: string]: unknown;
}

// Project year assignment helper
const getProjectYear = (slug: string, portfolioProject: PortfolioProject | undefined, projectData: ProjectData): string => {
  const projectYears: { [key: string]: string } = {
    'gwen-addo': '2025',
    'eleven-eleven-ghana': '2024',
    'emmanuel-kotia': '2023',
    'girl-code-africa': '2025',
    'eden-heights': '2025',
    'landmark-homes': '2025',
    'ghana-optometric-association': '2024',
    'twist-nightclub': '2025',
    'command-space': '2023',
    'anabs': '2025',
    'kline-designs': '2025',
  }

  return projectYears[slug] || portfolioProject?.year || projectData?.year || '2024'
}

// Project-specific challenge content helpers
const getProjectChallengeQuote = (slug: string, projectData: ProjectData, portfolioProject: PortfolioProject | undefined): string => {
  const quotes: { [key: string]: string } = {
    'gwen-addo': 'How do you position a business strategist as searchable authority while converting visitors into paying clients?',
    'eleven-eleven-ghana': 'How do you establish luxury beachfront positioning that drives direct bookings and premium perception?',
    'emmanuel-kotia': 'How do you establish academic authority that makes distinguished research globally accessible?',
    'girl-code-africa': 'How do you position tech education authority that drives program applications and attracts corporate partnerships?',
    'eden-heights': 'How do you position luxury residential authority that attracts high-net-worth buyers and drives premium property sales?',
    'landmark-homes': 'How do you establish real estate development authority that builds investor confidence and accelerates property acquisitions?',
    'ghana-optometric-association': 'How do you position professional association authority that centralizes member operations and enhances industry influence?',
    'twist-nightclub': 'How do you establish nightlife entertainment authority that drives attendance and builds loyal patron community?',
    'command-space': 'How do you position digital agency authority that converts prospects into high-value client partnerships?',
    'anabs': 'How do you position luxury high-rise authority that attracts discerning investors and commands premium pricing?',
    'kline-designs': 'How do you establish architectural design authority that positions firm as innovation leader and drives project inquiries?',
  }

  return quotes[slug] || projectData?.challenge?.quote || portfolioProject?.theChallenge || 'How do you create something exceptional for this project?'
}

// Comprehensive project-specific content system
const getProjectSpecificContent = (slug: string) => {
  const projectContent: { [key: string]: Record<string, unknown> } = {
    'gwen-addo': {
      challengePoints: [
        'Establishing credibility and expertise in a competitive consulting market',
        'Creating an intuitive booking system that converts visitors into clients',
        'Designing a professional brand that reflects business strategy expertise',
        'Implementing content structure that showcases value proposition clearly'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of personal branding and client psychology.',
      resultDescription: 'A website for Gwen Addo\'s consulting practice, with a booking system for client consultations and a design that earns trust at first look.',
      focusAreas: ['Personal Branding', 'Lead Generation', 'Professional Credibility', 'Client Conversion']
    },
    'eleven-eleven-ghana': {
      challengePoints: [
        'Capturing the essence of luxury beachfront living through digital design',
        'Creating an immersive experience that drives accommodation bookings',
        'Implementing high-performance media without compromising load times',
        'Establishing premium brand positioning in the competitive hospitality market'
      ],
      resolutionText: 'The solution required more than technology— it demanded an understanding of luxury hospitality and exclusivity.',
      resultDescription: 'A website that shows off the Eleven Eleven beachfront setting and its luxury positioning, and lets visitors enquire about the apartments directly.',
      focusAreas: ['Luxury Design', 'Immersive Experience', 'Hospitality Branding', 'Booking Conversion']
    },
    'emmanuel-kotia': {
      challengePoints: [
        'Organizing extensive academic publications into an accessible digital archive',
        'Creating authoritative presentation befitting distinguished career',
        'Ensuring global accessibility for academic and policy research',
        'Implementing intuitive navigation for complex scholarly content'
      ],
      resolutionText: 'The solution required more than organization— it demanded an understanding of academic authority and scholarly presentation.',
      resultDescription: 'A digital archive of Dr. Kotia\'s work, built to make his research easy to find for academics, students and policymakers.',
      focusAreas: ['Academic Excellence', 'Digital Archiving', 'Scholarly Presentation', 'Global Accessibility']
    },
    'girl-code-africa': {
      challengePoints: [
        'Appealing to multiple audiences: students, sponsors, and industry partners',
        'Creating inspiring pathways for women entering tech industry',
        'Implementing application systems and donation functionality',
        'Building community around empowerment and education mission'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of empowerment and community building.',
      resultDescription: 'A website that explains GirlCode\'s mission and impact, with clear paths to apply to programs and to reach out as a partner.',
      focusAreas: ['Education & Empowerment', 'Community Building', 'Non-Profit Impact', 'Tech Industry Access']
    },
    'ghana-optometry-conference': {
      challengePoints: [
        'Managing comprehensive conference information and logistics',
        'Implementing multi-step registration for professional attendees',
        'Creating interactive schedules and speaker presentations',
        'Streamlining event management and administrative workflows'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of professional conference management.',
      resultDescription: 'A microsite for registration and information-sharing, designed to cut administrative work for organisers and make things easier for attendees.',
      focusAreas: ['Event Management', 'Professional Registration', 'Conference Logistics', 'Administrative Efficiency']
    },
    'eden-heights': {
      challengePoints: [
        'Conveying prestige and quality of luxury residential development',
        'Showcasing premium properties to attract high-net-worth buyers',
        'Implementing immersive visual experiences and virtual tours',
        'Generating qualified leads for high-value real estate sales'
      ],
      resolutionText: 'The solution required more than visuals— it demanded an understanding of luxury real estate psychology.',
      resultDescription: 'A website that presents Eden Heights as a premier residential option in Accra, with immersive visuals and a polished presentation for prospective buyers.',
      focusAreas: ['Luxury Real Estate', 'Premium Positioning', 'Visual Storytelling', 'High-Value Sales']
    },
    'landmark-homes': {
      challengePoints: [
        'Serving dual purpose as corporate profile and project showcase',
        'Instilling confidence in investors and potential buyers',
        'Organizing multiple high-end development projects effectively',
        'Creating professional presentation for sales team usage'
      ],
      resolutionText: 'The solution required more than presentation— it demanded an understanding of real estate investment psychology.',
      resultDescription: 'A website that presents the Landmark Homes brand and the quality of their developments, used to show project information to prospective investors and buyers.',
      focusAreas: ['Real Estate Development', 'Investor Relations', 'Project Showcase', 'Corporate Branding']
    },
    'ghana-optometric-association': {
      challengePoints: [
        'Managing comprehensive professional association digital operations',
        'Implementing member-only sections with secure authentication',
        'Serving as authoritative information source for optometry in Ghana',
        'Streamlining administrative tasks and member communication'
      ],
      resolutionText: 'The solution required more than functionality— it demanded an understanding of professional association management.',
      resultDescription: 'A website that brings the association\'s digital operations together, with a secure member portal for administrative tasks and member communication.',
      focusAreas: ['Professional Association', 'Member Management', 'Industry Authority', 'Digital Operations']
    },
    'twist-nightclub': {
      challengePoints: [
        'Capturing dynamic and energetic nightclub atmosphere digitally',
        'Creating mobile-first experience for on-the-go patrons',
        'Implementing event calendar and social media integration',
        'Encouraging social sharing and community engagement'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of nightlife culture and social engagement.',
      resultDescription: 'A website that carries the club\'s energy into digital, with mobile-optimized photo galleries made for sharing.',
      focusAreas: ['Nightlife & Entertainment', 'Mobile-First Design', 'Social Engagement', 'Event Promotion']
    },
    'command-space': {
      challengePoints: [
        'Creating the ultimate business card for a digital marketing agency',
        'Showcasing technical expertise and creative capabilities',
        'Building trust and credibility in competitive digital market',
        'Implementing portfolio showcase that converts prospects to clients'
      ],
      resolutionText: 'The solution required more than presentation— it demanded an understanding of digital agency positioning and client psychology.',
      resultDescription: 'The website for Command Space, built to show their expertise through clean design and working functionality.',
      focusAreas: ['Digital Agency Branding', 'B2B Credibility', 'Portfolio Showcase', 'Lead Generation']
    },
    'anabs': {
      challengePoints: [
        'Conveying exclusivity and prestige of luxury high-rise living',
        'Attracting high-net-worth individuals and serious investors',
        'Creating immersive digital experience that matches physical luxury',
        'Building immediate trust and credibility in competitive real estate market'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of luxury real estate psychology and high-end buyer behavior.',
      resultDescription: 'A website that presents Anabs Ghana as a luxury residential option, with a sophisticated presentation aimed at high-net-worth buyers.',
      focusAreas: ['Luxury Real Estate', 'Premium Positioning', 'High-End Marketing', 'Investor Relations']
    },
    'kline-designs': {
      challengePoints: [
        'Establishing credibility and professional trust for a design and engineering firm',
        'Communicating unique expertise and engineering approaches clearly',
        'Creating a sophisticated digital presence that reflects design excellence',
        'Building brand recognition in Ghana\'s competitive architectural market'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of architectural authority and design excellence.',
      resultDescription: 'A website for K_Line Designs LTD, a design and engineering firm, that presents their expertise and approach clearly to potential clients.',
      focusAreas: ['Architectural Design', 'Engineering Excellence', 'Professional Credibility', 'Design Innovation']
    }
  }
  
  return projectContent[slug] || null
}

// Get testimonial for specific project  
const getProjectTestimonial = (slug: string) => {
  const testimonialMapping: { [key: string]: number } = {
    'gwen-addo': 1,                        // Gwen Addo
    'eleven-eleven-ghana': 11,             // Curtis (Eleven Eleven)
    'emmanuel-kotia': 6,                   // Dr. Emmanuel Kotia  
    'ghana-optometric-association': 7,     // Dr. Remie
    'command-space': 3,                   // Tyrone
    'ghana-optometry-conference': 7,      // Dr. Remie (same as main GOA site)
    'anabs': 12,                    // Boss J. (Anabs)
  }
  
  const testimonialId = testimonialMapping[slug]
  if (!testimonialId) return null
  
  return testimonialData.testimonials.find(t => t.id === testimonialId)
}

// Eleven Eleven specific data (since it's our template project)
const elevenElevenData = {
  hero: {
    headline: "Eleven Eleven Ghana",
    tagline: "Digital Luxury Redefined",
    description: "A high-end website for Eleven Eleven, a luxury beachfront resort in Ghana where exclusive beachfront apartments are available for purchase, designed to immerse users in the resort lifestyle and drive sales inquiries.",
    client: "11-11 Ghana",
    year: "2023",
    category: "Luxury Real Estate",
    url: "https://www.11-11ghana.com"
  },
  challenge: {
    title: "The Luxury Imperative",
    quote: "How do you digitally replicate the luxurious and exclusive atmosphere of beachfront living?",
    description: "The primary challenge was to digitally replicate the luxurious and exclusive atmosphere of this premium beachfront resort where exclusive beachfront apartments are available for purchase. The website needed to be visually stunning, highly performant, and feature an integrated inquiry system for brochure requests and resort tours.",
    keyPoints: [
      "Capture the essence of luxury resort living online",
      "Seamless inquiry experience for apartment viewings and resort tours",
      "High-performance across all devices",
      "Visual storytelling that converts browsers to prospective apartment buyers"
    ]
  },
  solution: {
    title: "Crafting Digital Luxury",
    description: "I developed a visually-driven website with high-resolution imagery, video backgrounds, and elegant typography. I implemented a seamless inquiry system for brochure requests and tour bookings, ensuring the site was fully responsive to provide an optimal experience on all devices.",
    features: [
      {
        title: "Immersive Visual Experience",
        description: "High-resolution imagery and video backgrounds that transport users to this exclusive beachfront resort"
      },
      {
        title: "Seamless Inquiry Integration",
        description: "Custom inquiry system for apartment brochures, beachfront property viewings, and resort tours"
      },
      {
        title: "Performance Optimization",
        description: "Lightning-fast load times without compromising visual quality"
      },
      {
        title: "Responsive Excellence",
        description: "Flawless experience across desktop, tablet, and mobile devices"
      }
    ]
  },
  result: {
    title: "Luxury Achieved",
    description: "The website effectively captures the essence of the Eleven Eleven brand, resulting in increased user engagement and direct sales inquiries for beachfront apartments. It serves as a powerful digital showcase that aligns with the resort's luxury positioning."
  },
  techStack: [
    "Immersive Visual Experience",
    "Seamless Inquiry Integration", 
    "Performance Optimization",
    "Responsive Excellence"
  ]
}

export default function LegacyCaseStudy() {
  const params = useParams()
  const slug = params.slug as string
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  
  // Contact image for CTA section - no dynamic logic needed
  
  // Always try to get project-specific data first, fallback to eleven-eleven template structure
  const portfolioProject = portfolioData.portfolio.find(p => p.id === slug || p.id === slug.replace(/-/g, '-'))
  const projectData = (slug === 'eleven-eleven-ghana' || slug === 'eleven-eleven') ? elevenElevenData : getProjectData(slug)
  // Stat cards render only when a project carries real, verified figures in its data
  const stats = (projectData as { stats?: Array<{ value: string; label: string; icon?: LucideIcon }> })?.stats
  const contentProject = content.portfolio.projects.find(p => p.slug === slug)
  const projectStack = (contentProject as { stack?: string[] } | undefined)?.stack

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  const getButtonStyles = () => {
    if (theme === 'dark') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#000000',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        hoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        hoverBoxShadow: '0 8px 24px rgba(255, 255, 255, 0.25)'
      }
    } else {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(0, 0, 0, 1)',
        hoverBoxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }
    }
  }

  useEffect(() => {
    if (!preloaderComplete) return

    // Track project view. content.json is keyed by slug and covers every case
    // study; portfolio.json ids don't always match slugs, which silently
    // dropped the event for some projects.
    if (contentProject) {
      trackProjectView(contentProject.title, contentProject.category, {
        project_slug: slug,
        client: portfolioProject?.client,
        year: getProjectYear(slug, portfolioProject, projectData),
      })
    }

    const initAnimations = async () => {
      try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger')
        ])
        
        const gsap = gsapModule.default
        const { ScrollTrigger } = scrollTriggerModule
        
        // Register GSAP plugin on client side only
        if (typeof window !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger)
        }
      
      // Hero image entrance and parallax setup
      if (heroImageRef.current) {
        // Entrance animation - sophisticated reveal
        gsap.fromTo(heroImageRef.current,
          { 
            opacity: 0, 
            y: 60, 
            scale: 0.95 
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.3
          }
        )
        
        // Set initial scale for parallax (after entrance completes)
        gsap.set(heroImageRef.current, { scale: 1.1, delay: 1.8 })
        
        // Parallax effect for hero image
        gsap.to(heroImageRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          delay: 1.8
        })
      }
      
      // Scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
        )
        
        // Continuous bounce animation
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        })
      }
      
      // Content sections animation
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('.animate-section')
        sections.forEach((section) => {
          const elements = section.querySelectorAll('.animate-element')
          
          // Special handling for video showcase section
          if (section.querySelector('.hero-video-container')) {
            // Hero video entrance
            const heroVideo = section.querySelector('.hero-video-container')
            if (heroVideo) {
              gsap.fromTo(heroVideo,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 1.2,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 15%',
                  }
                }
              )
            }
            
            // Floating videos with staggered entrance
            const floatingVideos = section.querySelectorAll('.floating-video')
            gsap.fromTo(floatingVideos,
              { y: 80, opacity: 0, scale: 0.9 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.3,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  end: 'bottom 15%',
                },
                delay: 0.5
              }
            )
          } 
          // Special handling for immersive storytelling section
          else if (false && section.classList.contains('story-section')) {
            // Story Scene Animations - Cinematic Progression
            const storyScenes = section.querySelectorAll('.story-scene')

            storyScenes.forEach((scene) => {
              // Scene 1: Question Animation Only
              if (scene.classList.contains('scene-1')) {
                const question = scene.querySelector('.story-question')
                
                // Question animates immediately when scene enters view
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      gsap.fromTo(question,
                        { y: 100, opacity: 0, scale: 0.9 },
                        { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
                      )
                      
                      observer.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 2: Context Development  
              else if (scene.classList.contains('scene-2')) {
                const context = scene.querySelector('.story-context')
                
                // Scene 2 - no ScrollTriggers
                const observer2 = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      gsap.fromTo(context,
                        { y: 80, opacity: 0 },
                        {
                          y: 0,
                          opacity: 1,
                          duration: 1.8,
                          ease: 'power2.out'
                        }
                      )
                      observer2.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.8 })  // Higher threshold = waits longer before triggering
                
                observer2.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 2: Challenge Points Reveal
              else if (scene.classList.contains('scene-2')) {
                const chapterTitle = scene.querySelector('.story-chapter-title')
                const challengeCards = scene.querySelectorAll('.story-challenge-card')
                
                // Scene 2 - no ScrollTriggers
                const observer2b = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const tl3 = gsap.timeline()
                      
                      tl3.fromTo(chapterTitle,
                        { y: 60, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' }
                      )
                      .fromTo(challengeCards,
                        { y: 120, opacity: 0, scale: 0.8 },
                        { y: 0, opacity: 1, scale: 1, duration: 1.0, stagger: 0.1, ease: 'power3.out' },
                        "-=0.2"  // Starts shortly after heading begins
                      )
                      
                      observer2b.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer2b.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 4: Cinematic Conclusion
              else if (scene.classList.contains('scene-3')) {
                const resolution = scene.querySelector('.story-resolution')
                const transitionElement = scene.querySelector('.story-transition-element')
                
                // Scene 4 - no ScrollTriggers
                const observer4 = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const tl4 = gsap.timeline()
                      
                      tl4.fromTo(resolution,
                        { y: 80, opacity: 0 },
                        { y: 0, opacity: 1, duration: 2.2, ease: 'power2.out' }
                      )
                      
                      if (transitionElement) {
                        tl4.fromTo(transitionElement,
                          { y: 40, opacity: 0, scale: 0.9 },
                          { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
                          "+=1.0"
                        )
                      }
                      
                      observer4.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer4.observe(scene)
              }
            })
          }
          // Special handling for luxury card elevation section
          else if (section.querySelector('.vision-main-card')) {
            // Main vision card entrance - dramatic reveal
            const mainCard = section.querySelector('.vision-main-card')
            if (mainCard) {
              gsap.fromTo(mainCard,
                { y: 100, opacity: 0, scale: 0.8, rotationY: -15, rotationX: 15 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotationY: -2,
                  rotationX: 2,
                  duration: 1.8,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 30%',
                  }
                }
              )
            }
            
            // Floating stat cards with sophisticated staggered entrance
            const statCards = section.querySelectorAll('.stat-card')
            statCards.forEach((card, index) => {
              // Each card has unique entrance timing and direction
              const directions = [
                { x: -80, y: -60 }, // top-left
                { x: 80, y: -80 },  // top-right  
                { x: -60, y: 80 },  // bottom-left
                { x: 60, y: 60 }    // bottom-right
              ]
              
              gsap.fromTo(card,
                { 
                  x: directions[index].x,
                  y: directions[index].y,
                  opacity: 0, 
                  scale: 0.7,
                  rotation: index % 2 === 0 ? -10 : 10
                },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotation: index % 2 === 0 ? -3 + (index * 1) : 2 - (index * 0.5),
                  duration: 1.4,
                  ease: 'back.out(1.4)',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    end: 'bottom 25%',
                  },
                  delay: 0.3 + (index * 0.15) // Staggered timing
                }
              )
              
              // Continuous subtle floating animation
              gsap.to(card, {
                y: index % 2 === 0 ? -8 : 8,
                duration: 3 + (index * 0.5),
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.5
              })
            })
            
            // Mobile stats cards animation
            const mobileStatCards = section.querySelectorAll('.stat-card-mobile')
            gsap.fromTo(mobileStatCards,
              { y: 40, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 80%',
                  end: 'bottom 20%',
                },
                delay: 1.2 // After main card animation
              }
            )
          } else {
            // Standard section animation
            gsap.fromTo(elements,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 85%',
                  end: 'bottom 15%',
                }
              }
            )
          }
        })
      }
      
      // Standard section animations will handle the new CTA section
      } catch (error) {
        console.warn('GSAP failed to load:', error)
      }
    }
    
    initAnimations()
    
    return () => {
      const cleanup = async () => {
        try {
          const { ScrollTrigger } = await import('gsap/ScrollTrigger')
          ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        } catch (error) {
          // Ignore cleanup errors if GSAP didn't load
          console.warn('ScrollTrigger cleanup failed:', error)
        }
      }
      cleanup()
    }
  }, [preloaderComplete])


  // Which slugs have a page is decided on the server in app/portfolio/[slug]/page.tsx
  if (!projectData && !portfolioProject) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-24 flex items-center justify-center bg-background-primary">
          <div className="text-center">
            <h1 className="text-4xl font-satoshi font-bold text-text-primary mb-4">
              Project Not Found
            </h1>
            <Link href="/portfolio" className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const displayData = (slug === 'eleven-eleven-ghana' || slug === 'eleven-eleven') ? elevenElevenData : {
    hero: {
      headline: portfolioProject?.title || (projectData as Record<string, string>)?.title || 'Project Title',
      tagline: portfolioProject?.category || (projectData as Record<string, string>)?.category || 'Web Development',
      description: portfolioProject?.description || (projectData as Record<string, string>)?.description || '',
      client: portfolioProject?.client || (projectData as Record<string, string>)?.client || '',
      year: getProjectYear(slug, portfolioProject, projectData),
      category: portfolioProject?.category || (projectData as Record<string, string>)?.category || '',
      url: portfolioProject?.url || (projectData as Record<string, string>)?.url || ''
    }
  }

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader 
          pageName={displayData.hero.headline} 
          onComplete={handlePreloaderComplete} 
        />
      )}
      
      <div style={{ opacity: preloaderComplete ? 1 : 0 }}>
        <style jsx>{`
          @media (max-width: 639px) {
            .mobile-question-style {
              font-size: 26px !important;
              font-weight: 500 !important;
            }
            .resolution-text {
              font-size: 20px !important;
            }
          }
          @media (min-width: 640px) {
            .resolution-text {
              font-size: 25px !important;
            }
          }
        `}</style>
        <Navigation preloaderComplete={preloaderComplete} />

        {/* Hero Section - Project Overview */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-start bg-background-primary pt-32 md:pt-24 pb-16 md:pb-0">
          <div className="max-w-[90vw] mx-auto px-6 w-full">
            {/* Project Title */}
            <div className="text-left mb-16 animate-element">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-satoshi font-light text-text-primary" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                {displayData.hero.headline}
              </h1>
            </div>

            {/* Stack Tags */}
            {projectStack && projectStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12 animate-element">
                {projectStack.map((tech: string) => (
                  <span key={tech} className="inline-block text-[11px] font-satoshi tracking-widest uppercase px-3 py-1 rounded-full bg-background-secondary text-text-tertiary border border-text-tertiary/20">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Project Details Grid */}
            <div className="grid md:grid-cols-3 gap-12 md:gap-16 animate-element relative">
              {/* Client */}
              <div>
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  CLIENT
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium">
                  {displayData.hero.client}
                </p>
              </div>

              {/* Category */}
              <div>
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  CATEGORY
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium">
                  {displayData.hero.category}
                </p>
              </div>

              {/* Location & Year */}
              <div className="relative">
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  LOCATION & YEAR
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium mb-6">
                  Ghana © {displayData.hero.year}
                </p>
                
                {/* Live Site Button */}
                {displayData.hero.url && (
                  <div className="absolute -right-4 -bottom-4 md:right-0 md:bottom-0 z-10">
                    <a
                      href={displayData.hero.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center text-center text-base md:text-lg font-satoshi font-medium whitespace-nowrap rounded-full backdrop-blur-sm border transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 active:scale-98"
                      style={{
                        backgroundColor: getButtonStyles().backgroundColor,
                        color: getButtonStyles().color,
                        borderColor: getButtonStyles().borderColor,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1
                      }}
                      onMouseEnter={(e) => {
                        const styles = getButtonStyles()
                        e.currentTarget.style.backgroundColor = styles.hoverBackgroundColor
                        e.currentTarget.style.boxShadow = styles.hoverBoxShadow
                        e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        const styles = getButtonStyles()
                        e.currentTarget.style.backgroundColor = styles.backgroundColor
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                        e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      }}
                    >
                      Live site ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="animate-section pt-4 pb-2 md:pt-6 md:pb-3 bg-background-primary">
          <div className="w-full md:w-[70vw] mx-auto px-6 md:px-0">
            <div 
              ref={heroImageRef}
              className="relative w-full h-[600px] rounded-2xl overflow-hidden group cursor-pointer animate-element portfolio-hero-container"
              style={{
                opacity: 0,
                transform: 'translateY(60px) scale(0.95)'
              }}
            >
              {/* Gradient overlays for luxury hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/4 z-10 rounded-2xl portfolio-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/3 group-hover:to-text-primary/6 z-10 rounded-2xl portfolio-overlay"></div>
              
              <Image
                src={getProjectHeroImage(slug)}
                alt={(projectData as Record<string, string>)?.title || portfolioProject?.title || "Portfolio Project"}
                fill
                className="object-cover portfolio-hero-image"
                priority
                quality={95}
              />
            </div>
          </div>
        </section>


        {/* Case Study Content */}
        <div ref={contentRef} className="bg-background-primary">
          
          {/* Challenge Section - Rebuilt */}
          <section className="animate-section bg-background-primary pt-12 pb-8 md:pt-24 md:pb-12 relative">
            <div className="max-w-6xl mx-auto px-6">

              {/* Challenge Question - No heading, just the quote */}
              <div className="text-center mb-12 md:mb-16">
                <blockquote className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-satoshi font-light text-text-primary animate-element"
                            style={{ lineHeight: '1.3', letterSpacing: '0.01em' }}>
                  &quot;{getProjectChallengeQuote(slug, projectData, portfolioProject)}&quot;
                </blockquote>
              </div>

            </div>
          </section>

          {/* Systems Approach Section */}
          {(() => {
            const systemsFramework = (portfolioProject as Record<string, unknown>)?.systemsFramework as Record<string, unknown> | undefined
            if (!systemsFramework) return null

            const foundationalSetup = systemsFramework.foundationalAuthoritySetup as { description?: string; systems?: string[] } | undefined
            const growthSystems = systemsFramework.growthSystemsImplemented as Record<string, unknown> | undefined
            const measurableImpact = systemsFramework.measurableImpact as { systemsDelivered?: string[] } | undefined

            return (
              <section className="animate-section bg-background-primary py-12 md:py-20 relative">
                <div className="max-w-6xl mx-auto px-6">

                  {/* Section Title */}
                  <div className="text-center mb-12 md:mb-16 animate-element">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-satoshi font-medium text-text-primary mb-6"
                        style={{ letterSpacing: '0.06em' }}>
                      SYSTEMS APPROACH
                    </h2>
                    <div className="w-16 h-px bg-text-primary/30 mx-auto mb-8"></div>
                    {foundationalSetup && (
                      <p className="text-text-secondary text-lg md:text-xl font-inter leading-relaxed max-w-3xl mx-auto"
                         style={{ fontWeight: '400' }}>
                        {foundationalSetup.description}
                      </p>
                    )}
                  </div>

                  {/* Foundational Systems Grid */}
                  {foundationalSetup && (
                    <div className="mb-24 md:mb-32 animate-element">

                      {/* Elegant Systems Grid - Luxury redesign */}
                      {foundationalSetup.systems && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                          {foundationalSetup.systems.map((system: string, index: number) => {
                            const parts = system.split(' - ')
                            const title = parts[0]
                            const description = parts[1] || ''

                            return (
                              <div
                                key={index}
                                className="group relative"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="relative p-6 md:p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                                     style={{
                                       background: 'rgba(255, 255, 255, 0.02)',
                                       borderColor: 'rgba(255, 255, 255, 0.08)',
                                       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                                     }}>
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                         style={{
                                           background: 'rgba(255, 255, 255, 0.05)',
                                           border: '1px solid rgba(255, 255, 255, 0.1)'
                                         }}>
                                      <span className="text-text-primary text-sm font-satoshi font-light">
                                        {String(index + 1).padStart(2, '0')}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-text-primary font-satoshi text-base md:text-lg mb-2"
                                          style={{ fontWeight: '500', letterSpacing: '0.01em' }}>
                                        {title}
                                      </h4>
                                      {description && (
                                        <p className="text-text-secondary font-inter text-sm md:text-base leading-relaxed"
                                           style={{ fontWeight: '400' }}>
                                          {description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Growth Systems Implemented - Complete Unified Timeline */}
                  {(foundationalSetup || growthSystems) && (
                    <div className="mb-24 md:mb-32 animate-element">
                      <h3 className="text-3xl md:text-4xl font-satoshi font-light text-text-primary mb-8 text-center"
                          style={{ letterSpacing: '0.02em' }}>
                        Growth Systems Implemented
                      </h3>
                      <p className="text-text-secondary text-base md:text-lg font-inter max-w-2xl mx-auto text-center mb-16"
                         style={{ fontWeight: '400' }}>
                        Complete digital infrastructure delivering measurable business growth
                      </p>

                      <div className="max-w-3xl mx-auto relative">
                        {/* Visible connecting line - adapts to theme */}
                        <div
                          className="absolute top-0 bottom-0 w-px bg-text-primary/30"
                          style={{ left: '1.5rem' }}
                        >
                        </div>

                        <div className="space-y-10 md:space-y-12 relative">
                          {/* Foundational Authority Setup */}
                          {foundationalSetup && (
                            <div className="relative pl-16 md:pl-20">
                              {/* Connector node */}
                              <div className="absolute left-3 top-1">
                                <div className="w-6 h-6 rounded-full border-2 border-text-primary bg-background-primary flex items-center justify-center"
                                     style={{
                                       boxShadow: '0 0 0 4px var(--background-primary), 0 0 20px rgba(255, 255, 255, 0.2)'
                                     }}>
                                  <span className="text-text-primary text-xs font-satoshi font-medium">1</span>
                                </div>
                              </div>

                              {/* Horizontal connector */}
                              <div className="absolute left-9 top-3 w-7 md:w-11 h-0.5 bg-gradient-to-r from-text-primary/60 to-transparent"></div>

                              <div className="group">
                                <h4 className="text-xl md:text-2xl font-satoshi text-text-primary mb-3"
                                    style={{ fontWeight: '500', letterSpacing: '0.01em', lineHeight: '1.3' }}>
                                  Foundational Authority Setup
                                </h4>
                                <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed"
                                   style={{ fontWeight: '400' }}>
                                  {foundationalSetup.description}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Lead Acquisition Pipeline */}
                          {(() => {
                            const pipeline = growthSystems?.leadAcquisitionPipeline as { implemented?: boolean; description?: string } | undefined
                            if (!pipeline?.implemented) return null

                            return (
                              <div className="relative pl-16 md:pl-20">
                                <div className="absolute left-3 top-1">
                                  <div className="w-6 h-6 rounded-full border-2 border-text-primary bg-background-primary flex items-center justify-center"
                                       style={{
                                         boxShadow: '0 0 0 4px var(--background-primary), 0 0 20px rgba(255, 255, 255, 0.2)'
                                       }}>
                                    <span className="text-text-primary text-xs font-satoshi font-medium">2</span>
                                  </div>
                                </div>
                                <div className="absolute left-9 top-3 w-7 md:w-11 h-0.5 bg-gradient-to-r from-text-primary/60 to-transparent"></div>

                                <div className="group">
                                  <h4 className="text-xl md:text-2xl font-satoshi text-text-primary mb-3"
                                      style={{ fontWeight: '500', letterSpacing: '0.01em', lineHeight: '1.3' }}>
                                    Lead Acquisition Pipeline
                                  </h4>
                                  <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed"
                                     style={{ fontWeight: '400' }}>
                                    {pipeline.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Lead Capture Engine */}
                          {(() => {
                            const captureEngine = growthSystems?.leadCaptureEngine as { implemented?: boolean; description?: string } | undefined
                            if (!captureEngine?.implemented) return null

                            return (
                              <div className="relative pl-16 md:pl-20">
                                <div className="absolute left-3 top-1">
                                  <div className="w-6 h-6 rounded-full border-2 border-text-primary bg-background-primary flex items-center justify-center"
                                       style={{
                                         boxShadow: '0 0 0 4px var(--background-primary), 0 0 20px rgba(255, 255, 255, 0.2)'
                                       }}>
                                    <span className="text-text-primary text-xs font-satoshi font-medium">3</span>
                                  </div>
                                </div>
                                <div className="absolute left-9 top-3 w-7 md:w-11 h-0.5 bg-gradient-to-r from-text-primary/60 to-transparent"></div>

                                <div className="group">
                                  <h4 className="text-xl md:text-2xl font-satoshi text-text-primary mb-3"
                                      style={{ fontWeight: '500', letterSpacing: '0.01em', lineHeight: '1.3' }}>
                                    Lead Capture Engine
                                  </h4>
                                  <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed"
                                     style={{ fontWeight: '400' }}>
                                    {captureEngine.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Traffic Converter */}
                          {(() => {
                            const converter = growthSystems?.trafficConverter as { implemented?: boolean; description?: string } | undefined
                            if (!converter?.implemented) return null

                            return (
                              <div className="relative pl-16 md:pl-20">
                                <div className="absolute left-3 top-1">
                                  <div className="w-6 h-6 rounded-full border-2 border-text-primary bg-background-primary flex items-center justify-center"
                                       style={{
                                         boxShadow: '0 0 0 4px var(--background-primary), 0 0 20px rgba(255, 255, 255, 0.2)'
                                       }}>
                                    <span className="text-text-primary text-xs font-satoshi font-medium">4</span>
                                  </div>
                                </div>
                                <div className="absolute left-9 top-3 w-7 md:w-11 h-0.5 bg-gradient-to-r from-text-primary/60 to-transparent"></div>

                                <div className="group">
                                  <h4 className="text-xl md:text-2xl font-satoshi text-text-primary mb-3"
                                      style={{ fontWeight: '500', letterSpacing: '0.01em', lineHeight: '1.3' }}>
                                    Traffic Converter (CRO)
                                  </h4>
                                  <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed"
                                     style={{ fontWeight: '400' }}>
                                    {converter.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )
          })()}

          {/* Video Showcase Section */}
          {((projectData as { video?: string })?.video || (portfolioProject as { video?: string })?.video) && (
            <section className="animate-section bg-background-secondary relative z-10" style={{ paddingTop: '8px', paddingBottom: '32px' }}>
              <div className="animate-element hero-video-container">
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                  <div className="group">
                    <div className="relative overflow-hidden bg-text-primary/5 aspect-[16/10]">
                      <video 
                        id="project-video"
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        loop
                        poster={(projectData as Record<string, Record<string, string>>)?.video?.poster || `/images/${slug}.jpg`}
                      >
                        <source src={(projectData as Record<string, Record<string, string>>)?.video?.src || `/images/${slug}-showcase.webm`} type="video/webm" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* The Result - Luxury Card Elevation */}
          {(projectData || portfolioProject) && (
            <section 
              className="animate-section bg-background-secondary relative pt-4 pb-14 md:pt-16 md:pb-60 z-20"
            >
              <div className="max-w-7xl mx-auto px-6 w-full">
                
                {/* Main Result Card - Elevated Center */}
                <div className="relative z-25 animate-element vision-main-card">
                  <div 
                    className="max-w-2xl mx-auto text-center p-12 md:p-16 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: `
                        0 25px 50px rgba(0, 0, 0, 0.25),
                        0 15px 35px rgba(0, 0, 0, 0.15),
                        0 5px 15px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                      `,
                      transform: 'rotateY(-2deg) rotateX(2deg)'
                    }}
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-satoshi font-extralight text-text-primary mb-8"
                        style={{ lineHeight: '1.1', letterSpacing: '0.05em' }}>
                      What I Built
                    </h2>
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 font-inter font-light">
                      {(() => {
                        const specificContent = getProjectSpecificContent(slug)
                        const result = (specificContent?.resultDescription as string) ||
                               (projectData as { results?: { description?: string } })?.results?.description ||
                               portfolioProject?.mySolution ||
                               'Delivered integrated digital systems that drive measurable business outcomes.'
                        return result as string
                      })()}
                    </p>
                    {Array.isArray(portfolioProject?.builtTo) && portfolioProject.builtTo.length > 0 && (
                      <ul className="mb-10 space-y-3 text-base md:text-lg text-text-secondary font-inter font-light">
                        {(portfolioProject.builtTo as string[]).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Stats Cards - Floating Around Main Card (Desktop Only) */}
                {stats && (
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                  
                  {/* Stat Card 1 - Top Left */}
                  <div 
                    className="absolute top-16 left-4 md:left-12 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(-3deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 15px 30px rgba(0, 0, 0, 0.2),
                          0 8px 20px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[0]?.value)}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[0]?.label)}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 2 - Top Right */}
                  <div 
                    className="absolute top-20 right-4 md:right-16 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(2deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 20px 40px rgba(0, 0, 0, 0.22),
                          0 10px 25px rgba(0, 0, 0, 0.14),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[1]?.value)}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[1]?.label)}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 3 - Bottom Left */}
                  <div 
                    className="absolute bottom-16 left-8 md:left-20 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(1deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 12px 25px rgba(0, 0, 0, 0.18),
                          0 6px 15px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[2]?.value)}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[2]?.label)}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 4 - Bottom Right */}
                  <div 
                    className="absolute bottom-20 right-8 md:right-24 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 10px 20px rgba(0, 0, 0, 0.15),
                          0 4px 10px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[3]?.value)}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[3]?.label)}
                      </div>
                    </div>
                  </div>

                </div>
                )}

              </div>

              {/* Mobile-Only: Single Column Stats Cards */}
              {stats && (
              <div className="md:hidden mt-20">
                <div className="flex flex-col space-y-8 px-6 max-w-md mx-auto">
                  {stats && stats.map((stat: {value: string, label: string, icon?: LucideIcon}, index: number) => (
                    <div key={index} 
                         className="animate-element stat-card-mobile">
                      <div 
                        className="w-full p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 text-center group cursor-pointer transform hover:scale-[1.02] hover:-translate-y-2 active:scale-[1.02] active:-translate-y-2"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: `
                            0 12px 25px rgba(0, 0, 0, 0.18),
                            0 6px 15px rgba(0, 0, 0, 0.12),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `,
                        }}
                      >
                        {/* Gradient overlays for touch interaction */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent/5 group-active:from-accent/10 group-active:to-accent/5 transition-all duration-500 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/5 group-hover:to-text-primary/10 group-active:from-text-primary/5 group-active:to-text-primary/10 transition-all duration-500 rounded-2xl"></div>
                        
                        {/* Content with relative positioning */}
                        <div className="relative z-10">
                          <div className="mb-4">
                            {stat.icon && <stat.icon className="w-10 h-10 text-text-primary group-hover:text-accent group-active:text-accent mx-auto transition-colors duration-500" />}
                          </div>
                          <div className="text-3xl font-satoshi font-light text-text-primary mb-2">
                            {stat.value}
                          </div>
                          <div className="text-text-secondary text-sm font-satoshi uppercase tracking-wider">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

            </section>
          )}


          {/* Client Testimonial Section */}
          {(() => {
            const testimonial = getProjectTestimonial(slug)
            if (!testimonial) return null
            
            return (
              <section className="animate-section bg-background-secondary py-16 md:py-24 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  
                  {/* Section Header */}
                  <div className="mb-12 md:mb-16 animate-element">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-satoshi font-medium text-text-primary mb-4"
                        style={{ letterSpacing: '0.06em' }}>
                      CLIENT TESTIMONIAL
                    </h2>
                    <div className="w-16 h-px bg-text-primary/30 mx-auto"></div>
                  </div>

                  {/* Testimonial Card */}
                  <div className="animate-element">
                    <div 
                      className="relative p-8 md:p-12 rounded-2xl backdrop-blur-lg border border-text-primary/15 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: `
                          0 25px 50px rgba(0, 0, 0, 0.15),
                          0 15px 35px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 0.08)
                        `
                      }}
                    >
                      {/* Decorative Quote Mark */}
                      <div 
                        className="absolute -top-4 -left-2 text-text-primary/8 font-serif"
                        style={{ 
                          fontSize: '70px',
                          lineHeight: '1',
                          fontWeight: '300'
                        }}
                      >
                        &quot;
                      </div>

                      {/* Quote Text */}
                      <blockquote 
                        className="font-satoshi italic text-text-primary leading-relaxed mb-8 relative z-10"
                        style={{
                          fontSize: '20px',
                          fontWeight: '300',
                          letterSpacing: '0.025em',
                          lineHeight: '1.65'
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
                              fontSize: '16px',
                              fontWeight: '500',
                              letterSpacing: '0.01em'
                            }}
                          >
                            {testimonial.clientName}
                          </div>
                          {testimonial.clientInfo && (
                            <div 
                              className="font-satoshi text-text-secondary"
                              style={{
                                fontSize: '14px',
                                fontWeight: '300',
                                letterSpacing: '0.02em',
                                opacity: '0.8'
                              }}
                            >
                              {testimonial.clientInfo}
                            </div>
                          )}
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
                  </div>

                </div>
              </section>
            )
          })()}

          {/* Option 1: Integrated Navigation CTA */}
          <section className="animate-section bg-background-primary py-16 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Left: Project CTA */}
                <div className="space-y-8 animate-element text-left md:text-left">
                  <h2 className="text-4xl md:text-5xl font-satoshi font-light text-text-primary text-center md:text-left" style={{ lineHeight: '1.2', letterSpacing: '0.02em' }}>
                    Ready for your
                    <span className="block font-medium">next project?</span>
                  </h2>
                  <p className="text-text-secondary text-lg md:text-xl font-inter leading-relaxed text-center md:text-left">
                    Let&apos;s create something extraordinary together.
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <GlassCTA href="/contact" variant={theme === 'dark' ? 'white' : 'light'}>
                      Let&apos;s work together
                    </GlassCTA>
                  </div>
                </div>
                
                {/* Right: Portfolio CTA Image */}
                <div className="animate-element">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-text-primary/5 group relative portfolio-cta-container">
                    {/* Gradient overlays for luxury hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/4 z-10 rounded-xl portfolio-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/3 group-hover:to-text-primary/6 z-10 rounded-xl portfolio-overlay"></div>
                    
                    <Image
                      src="/images/about-hero.jpg"
                      alt="Let's work together"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover portfolio-cta-image"
                      quality={90}
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </section>
        </div>
        
        <PortfolioFooter currentSlug={slug} />
      </div>
    </>
  )
}