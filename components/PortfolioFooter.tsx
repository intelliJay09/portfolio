'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import content from '../content.json'

interface PortfolioFooterProps {
  currentSlug: string
}

export default function PortfolioFooter({ currentSlug }: PortfolioFooterProps) {
  const [localTime, setLocalTime] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const socialLinksRef = useRef<HTMLAnchorElement[]>([])
  
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
  
  // Social hover animation handler (same as main Footer)
  const handleSocialHover = (index: number, isHovering: boolean) => {
    const social = socialLinksRef.current[index]
    if (social) {
      if (isHovering) {
        gsap.to(social, {
          scale: 1.1,
          y: -3,
          duration: 0.4,
          ease: 'back.out(1.7)'
        })
      } else {
        gsap.to(social, {
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        })
      }
    }
  }

  // Mouse tracking for All Work button (same as GlassCTA)
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    // Calculate offset from center with reduced sensitivity
    const offsetX = (mouseX - centerX) * 0.15
    const offsetY = (mouseY - centerY) * 0.1
    
    setMousePosition({ x: offsetX, y: offsetY })
  }

  // Get website projects only (filter out graphic design projects)
  const websiteProjectSlugs = [
    'anabs', 'eleven-eleven-ghana', 'gwen-addo', 'optimum-property-solutions', 'emmanuel-kotia',
    'imagebloom-by-saida', 'rosemond-prempeh', 'royal-itech', 'girl-code-africa',
    'goa-conference', 'eden-heights', 'landmark-homes', 'ghana-optometric-association',
    'twist-nightclub', 'command-space', 'qualivex-solutions'
  ];
  
  const websiteProjects = content.portfolio.projects.filter(project => 
    websiteProjectSlugs.includes(project.slug)
  );
  
  const currentIndex = websiteProjects.findIndex(project => project.slug === currentSlug)
  const nextProject = currentIndex !== -1 && currentIndex < websiteProjects.length - 1 
    ? websiteProjects[currentIndex + 1] 
    : websiteProjects[0] // Loop back to first website project

  // Get corresponding portfolio data for the next project

  // Get next project image using existing portfolio images
  const getProjectImage = (slug: string) => {
    const imageMap: { [key: string]: string } = {
      'anabs': '/images/anabs.png',
      'gwen-addo': '/images/gwen-addo.png',
      'eleven-eleven-ghana': '/images/eleven-eleven.png',
      'optimum-property-solutions': '/images/optimum-property.png',
      'emmanuel-kotia': '/images/emma-kotia.png',
      'imagebloom-by-saida': '/images/image-bloom.png',
      'rosemond-prempeh': '/images/rosemond-prempeh.png',
      'royal-itech': '/images/royal-itech.png',
      'girl-code-africa': '/images/girlcode.png',
      'goa-conference': '/images/ghana-optometric- association-conference.png',
      'eden-heights': '/images/eden-heights.png',
      'landmark-homes': '/images/landmark-homes.png',
      'ghana-optometric-association': '/images/ghana-optometric- association-main.png',
      'twist-nightclub': '/images/twist-night-club.png',
      'command-space': '/images/command-space.png',
      'qualivex-solutions': '/images/qualivex-solutions.png'
    }
    
    return imageMap[slug] || '/images/11-11-case-study-hero.webp'
  }

  return (
    <footer className="relative min-h-screen flex flex-col justify-center text-white"
            style={{ 
              backgroundColor: '#1C1D20',
              zIndex: 50
            }}>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center py-20">
        <div className="container mx-auto px-6">
          
          {/* Next Case Label */}
          <div className="text-center mb-12">
            <p className="text-white/40 text-sm font-satoshi uppercase tracking-wider">
              Next case
            </p>
          </div>
          
          {/* Project Title */}
          <div className="text-center mb-12">
            <h2 className="font-satoshi font-extralight text-white leading-none mb-8"
                style={{ 
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  letterSpacing: '0.04em',
                  lineHeight: '0.9'
                }}>
              {nextProject.title}
            </h2>
          </div>
          
          {/* Project Image */}
          <div className="max-w-6xl md:max-w-5xl mx-auto mb-16">
            <Link href={`/portfolio/${nextProject.slug}`} 
                  className="group block relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src={getProjectImage(nextProject.slug)}
                  alt={nextProject.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={90}
                />
                
                {/* Hover Arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* All Work Button */}
          <div className="text-center">
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
                x: mousePosition.x,
                y: mousePosition.y + (isHovered ? -3 : 0),
                rotate: mousePosition.x * 0.02,
                transition: {
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  mass: 0.1
                }
              }}
            >
              <Link href="/portfolio" 
                    className="inline-flex items-center px-8 py-4 rounded-full border text-white font-satoshi font-normal backdrop-blur-xl transition-all duration-500"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: isHovered 
                        ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                        : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                      setIsHovered(false)
                      setMousePosition({ x: 0, y: 0 })
                    }}
                    onMouseMove={handleMouseMove}>
                All work
                <span className="text-xs align-super ml-1">{content.portfolio.projects.length}</span>
              </Link>
            </motion.div>
          </div>
          
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center text-sm">
            {/* Version */}
            <div>
              <p className="text-white/40 font-inter mb-1 uppercase tracking-wider text-xs">VERSION</p>
              <p className="text-white font-satoshi">
                {new Date().getFullYear()} © Edition
              </p>
            </div>
            
            {/* Local Time */}
            <div className="text-center">
              <p className="text-white/40 font-inter mb-1 uppercase tracking-wider text-xs">LOCAL TIME</p>
              <p className="text-white font-satoshi">
                {localTime || 'Loading...'}
              </p>
            </div>
            
            {/* Socials */}
            <div className="text-left">
              <p className="text-white/40 font-inter mb-1 uppercase tracking-wider text-xs">SOCIALS</p>
              <div className="flex space-x-6">
                <a ref={(el) => {
                     if (el) socialLinksRef.current[0] = el
                   }}
                   href="https://www.instagram.com/jackieofzera/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onMouseEnter={() => handleSocialHover(0, true)}
                   onMouseLeave={() => handleSocialHover(0, false)}
                   className="text-white font-satoshi transition-none">
                  Instagram
                </a>
                <a ref={(el) => {
                     if (el) socialLinksRef.current[1] = el
                   }}
                   href="https://x.com/intelliJay09" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onMouseEnter={() => handleSocialHover(1, true)}
                   onMouseLeave={() => handleSocialHover(1, false)}
                   className="text-white font-satoshi transition-none">
                  Twitter
                </a>
                <a ref={(el) => {
                     if (el) socialLinksRef.current[2] = el
                   }}
                   href={content.global.social.linkedin} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onMouseEnter={() => handleSocialHover(2, true)}
                   onMouseLeave={() => handleSocialHover(2, false)}
                   className="text-white font-satoshi transition-none">
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