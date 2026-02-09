'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Grid3X3, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import GraphicDesignModal from '../../components/ui/GraphicDesignModal'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import RobustImage from '../../components/ui/RobustImage'
import PagePreloader from '../../components/PagePreloader'
import { getProjectImage, getLuxuryGridClass } from '../../utils/imageMapping'

// Import content data
import contentData from '../../content.json'

const portfolioData = contentData.portfolio

type ViewMode = 'grid' | 'list'
type FilterType = 'All' | 'Premium Brand Authority' | 'Premium Lead Generation' | 'Revenue-Optimized Commerce' | 'Brand Identity'

interface Project {
  slug: string
  title: string
  short_description: string
  category: string
  strategicCategory?: string
  strategicFilter?: string
}

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [preloaderComplete, setPreloaderComplete] = useState(false)

  // Refs for animations with proper typing
  const heroRef = useRef<HTMLElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const pageContentRef = useRef<HTMLDivElement>(null)

  // Cleanup function for GSAP contexts
  const gsapContextRef = useRef<gsap.Context | null>(null)

  // Preloader completion handler
  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return portfolioData.projects

    // Brand Identity filters by category "Brand Identity"
    if (activeFilter === 'Brand Identity') {
      return portfolioData.projects.filter(project => project.category === 'Brand Identity')
    }

    // Strategic filters use strategicFilter field
    return portfolioData.projects.filter(project =>
      (project as Record<string, string>).strategicFilter === activeFilter
    )
  }, [activeFilter])

  // Project count
  const projectCount = filteredProjects.length
  const authorityCount = portfolioData.projects.filter(p =>
    (p as Record<string, string>).strategicFilter === 'Premium Brand Authority'
  ).length
  const leadGenCount = portfolioData.projects.filter(p =>
    (p as Record<string, string>).strategicFilter === 'Premium Lead Generation'
  ).length
  const commerceCount = portfolioData.projects.filter(p =>
    (p as Record<string, string>).strategicFilter === 'Revenue-Optimized Commerce'
  ).length
  const brandIdentityCount = portfolioData.projects.filter(p =>
    p.category === 'Brand Identity'
  ).length

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
    }
  }, [preloaderComplete])

  const initializeAnimations = (): gsap.Context => {
    return gsap.context(() => {
      // Hero section entrance
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelectorAll('.animate-hero'),
          {
            y: 80,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            delay: 0.3
          }
        )
      }

      // Filter controls entrance
      if (filterRef.current) {
        gsap.fromTo(filterRef.current.querySelectorAll('.animate-filter'),
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
            delay: 0.8
          }
        )
      }

      // Project cards entrance with IntersectionObserver
      const observerOptions = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.1
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const index = projectRefs.current.indexOf(element as HTMLDivElement)

            if (element && index !== -1) {
              gsap.fromTo(element,
                {
                  y: 60,
                  opacity: 0,
                  scale: 0.95
                },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  ease: 'power2.out',
                  delay: index * 0.05
                }
              )
              observer.unobserve(element)
            }
          }
        })
      }, observerOptions)

      projectRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref)
      })

      return () => {
        projectRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref)
        })
      }
    })
  }

  useEffect(() => {
    if (!preloaderComplete) return

    // Clean up previous animations
    if (gsapContextRef.current) {
      gsapContextRef.current.revert()
    }

    // Initialize GSAP animations
    gsapContextRef.current = initializeAnimations()

    // Cleanup on unmount
    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert()
      }
    }
  }, [preloaderComplete])

  const handleProjectClick = (project: Project) => {
    if (project.category === 'Brand Identity') {
      setSelectedProject(project)
      setIsModalOpen(true)
    } else {
      // Navigate to case study for websites and web apps
      window.location.href = `/portfolio/${project.slug}`
    }
  }

  const getProjectNumber = (index: number) => {
    return String(index + 1).padStart(2, '0')
  }

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader
          pageName="Portfolio"
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
        <main className="min-h-screen bg-background-primary">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="hero-section pt-24 pb-16 sm:pt-28 sm:pb-18 md:pt-32 md:pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 md:px-8 lg:px-10"
        >
          <div className="w-full max-w-7xl mx-auto">
            {/* Hero Headline */}
            <div className="mb-16 lg:mb-24">
              <h1 
                className="animate-hero text-4xl lg:text-6xl xl:text-7xl font-satoshi font-light text-text-primary leading-tight"
                style={{ 
                  letterSpacing: '0.02em',
                  lineHeight: '1.1'
                }}
              >
                {portfolioData.headline}
              </h1>
              <p 
                className="animate-hero mt-8 lg:mt-12 text-lg lg:text-xl text-text-secondary max-w-2xl font-satoshi font-normal leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                {portfolioData.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Filter and View Controls */}
        <section
          ref={filterRef}
          className="px-4 sm:px-6 md:px-8 lg:px-10 mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-3">
                {(['All', 'Premium Brand Authority', 'Premium Lead Generation', 'Revenue-Optimized Commerce', 'Brand Identity'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`animate-filter px-6 py-3 rounded-full transition-all duration-600 font-satoshi font-medium text-sm tracking-wide relative overflow-hidden group ${
                      activeFilter === filter
                        ? 'bg-[#2a2a2a] text-white scale-105 dark:bg-[#2a2a2a] dark:text-white dark:shadow-lg dark:shadow-black/20'
                        : 'bg-background-secondary text-text-secondary hover:bg-[#d5d5d5] hover:text-text-primary dark:hover:bg-[#3a3a3a] dark:hover:text-white'
                    }`}
                    style={{
                      letterSpacing: '0.05em',
                      transform: activeFilter === filter ? 'translateY(-1px)' : 'translateY(0)',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {/* Dark theme gradient overlay for active state only */}
                    {activeFilter === filter && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
                    )}

                    {/* Button content */}
                    <span className="relative z-10">
                      {filter}
                      {filter !== 'All' && (
                        <span className="ml-2 opacity-60 transition-opacity duration-500 group-hover:opacity-90">
                          ({
                            filter === 'Premium Brand Authority' ? authorityCount :
                            filter === 'Premium Lead Generation' ? leadGenCount :
                            filter === 'Revenue-Optimized Commerce' ? commerceCount :
                            filter === 'Brand Identity' ? brandIdentityCount : 0
                          })
                        </span>
                      )}
                      {filter === 'All' && (
                        <span className="ml-2 opacity-60 transition-opacity duration-500 group-hover:opacity-90">
                          ({portfolioData.projects.length})
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Mode Toggle & Project Count */}
              <div className="flex items-center gap-6">
                {/* Project Count */}
                <div className="animate-filter text-text-tertiary font-satoshi font-normal text-sm">
                  <span className="text-text-primary font-medium">{projectCount}</span> 
                  {' '}{projectCount === 1 ? 'Project' : 'Projects'}
                </div>

                {/* View Mode Toggle */}
                <div className="animate-filter flex items-center bg-background-secondary rounded-full p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-full transition-all duration-600 ease-out relative overflow-hidden group ${
                      viewMode === 'grid'
                        ? 'bg-text-primary text-background-primary dark:shadow-md dark:shadow-black/20'
                        : 'text-text-tertiary hover:bg-[#d5d5d5] hover:text-text-primary dark:hover:bg-[#3a3a3a] dark:hover:text-white'
                    }`}
                    style={{
                      transform: viewMode === 'grid' ? 'translateY(-1px)' : 'translateY(0)',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    title="Grid View"
                  >
                    {/* Dark theme gradient overlay for active state only */}
                    {viewMode === 'grid' && (
                      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/15 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-600" />
                    )}
                    
                    <Grid3X3 
                      size={18} 
                      strokeWidth={1.5} 
                      className="relative z-10"
                    />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-full transition-all duration-600 ease-out relative overflow-hidden group ${
                      viewMode === 'list'
                        ? 'bg-text-primary text-background-primary dark:shadow-md dark:shadow-black/20'
                        : 'text-text-tertiary hover:bg-[#d5d5d5] hover:text-text-primary dark:hover:bg-[#3a3a3a] dark:hover:text-white'
                    }`}
                    style={{
                      transform: viewMode === 'list' ? 'translateY(-1px)' : 'translateY(0)',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    title="List View"
                  >
                    {/* Dark theme gradient overlay for active state only */}
                    {viewMode === 'list' && (
                      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/15 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-600" />
                    )}
                    
                    <List 
                      size={18} 
                      strokeWidth={1.5} 
                      className="relative z-10"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <ErrorBoundary 
          fallback={
            <div className="px-6 lg:px-10 pb-32">
              <div className="max-w-7xl mx-auto text-center py-16">
                <h3 className="text-xl font-satoshi font-medium text-text-primary mb-4">
                  Unable to load projects grid
                </h3>
                <p className="text-text-secondary font-satoshi">
                  Please refresh the page to try again.
                </p>
              </div>
            </div>
          }
        >
          <section
            ref={gridRef}
            className="px-4 sm:px-6 md:px-8 lg:px-10 pt-24 sm:pt-32 md:pt-40 lg:pt-[120px] pb-24 sm:pb-28 md:pb-32 bg-[#1a1a1a] dark:bg-[#000000]"
          >
            <div className="w-full max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="luxury-editorial-grid"
                >
                  {filteredProjects.map((project, index) => (
                    <div
                      key={`${project.slug}-${activeFilter}`}
                      ref={(el) => {
                        projectRefs.current[index] = el
                      }}
                      className={`${getLuxuryGridClass(index, project.category)} group cursor-pointer`}
                      onClick={() => handleProjectClick(project)}
                    >
                      {/* Project Number */}
                      <div className="luxury-number">
                        {getProjectNumber(index)}
                      </div>

                      {/* Project Image with Editorial Treatment */}
                      <div className="relative w-full h-full overflow-hidden">
                        <RobustImage
                          src={getProjectImage(project.slug, project.category)}
                          alt={project.title}
                          category={project.category}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, (max-width: 1200px) 50vw, 40vw"
                          priority={index < 3}
                          loading={index < 3 ? "eager" : "lazy"}
                          quality={85}
                          showPlaceholder={false}
                          placeholderText={`${project.category} project`}
                        />
                        
                        {/* Content */}
                        <div className="luxury-content">
                          <h3 className="luxury-title">
                            {project.title}
                            {project.category === 'Web Apps' && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 backdrop-blur-sm">
                                In Development
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="space-y-8"
                >
                  {filteredProjects.map((project, index) => (
                    <div
                      key={`${project.slug}-${activeFilter}-list`}
                      ref={(el) => {
                        projectRefs.current[index] = el
                      }}
                      className="group cursor-pointer rounded-2xl p-8 lg:p-12"
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Project Number & Category */}
                        <div className="lg:col-span-1">
                          <div className="text-text-tertiary font-satoshi font-medium text-sm tracking-widest mb-2" style={{ letterSpacing: '0.15em' }}>
                            {getProjectNumber(index)}
                          </div>
                          <div className="text-xs text-text-tertiary font-satoshi tracking-wide">
                            {(project as Record<string, string>).strategicCategory ||
                             (project.category === 'Websites' ? 'Website' :
                              project.category === 'Web Apps' ? 'Web App' :
                              project.category)}
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="lg:col-span-8">
                          {project.category === 'Brand Identity' ? (
                            <h3
                              className="text-2xl lg:text-3xl font-satoshi font-medium text-text-primary mb-3 group-hover:text-text-secondary transition-colors duration-600 cursor-pointer"
                              style={{
                                letterSpacing: '0.01em',
                                lineHeight: '1.3',
                                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                              }}
                            >
                              {project.title}
                            </h3>
                          ) : (
                            <Link href={`/portfolio/${project.slug}`}>
                              <h3
                                className="text-2xl lg:text-3xl font-satoshi font-medium text-text-primary mb-3 group-hover:text-text-secondary transition-all duration-600 cursor-pointer hover:translate-x-2 hover:text-accent"
                                style={{
                                  letterSpacing: '0.01em',
                                  lineHeight: '1.3',
                                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                }}
                              >
                                {project.title}
                                {project.category === 'Web Apps' && (
                                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                    In Development
                                  </span>
                                )}
                              </h3>
                            </Link>
                          )}
                          <p 
                            className="text-text-secondary font-satoshi font-normal text-base lg:text-lg leading-relaxed"
                            style={{ letterSpacing: '0.01em' }}
                          >
                            {project.short_description}
                          </p>
                        </div>

                        {/* Project Image */}
                        <div className="lg:col-span-3">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                            {project.category === 'Brand Identity' ? (
                              <RobustImage
                                src={getProjectImage(project.slug, project.category)}
                                alt={project.title}
                                category={project.category}
                                fill
                                className="object-cover cursor-pointer transition-all duration-1000 ease-out group-hover:brightness-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 30vw, 25vw"
                                loading="lazy"
                                quality={85}
                                showPlaceholder={false}
                                placeholderText={`${project.category} project`}
                              />
                            ) : (
                              <Link href={`/portfolio/${project.slug}`}>
                                <div className="relative">
                                  <RobustImage
                                    src={getProjectImage(project.slug, project.category)}
                                    alt={project.title}
                                    category={project.category}
                                    fill
                                    className="object-cover cursor-pointer transition-all duration-1000 ease-out group-hover:brightness-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 30vw, 25vw"
                                    loading="lazy"
                                    quality={85}
                                    showPlaceholder={false}
                                    placeholderText={`${project.category} project`}
                                  />
                                  {project.category === 'Web Apps' && (
                                    <div className="absolute top-2 right-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 backdrop-blur-sm">
                                        In Development
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </ErrorBoundary>
        </main>

        <Footer />
      </div>

      {/* Brand Identity Modal */}
      {selectedProject && (
        <GraphicDesignModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          imageSrc={getProjectImage(selectedProject.slug, selectedProject.category)}
        />
      )}
    </>
  )
}