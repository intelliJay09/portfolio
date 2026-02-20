'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Instagram, Twitter, Linkedin, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeTogglePortal from './ui/ThemeTogglePortal'
import { useScrollTrigger } from '../hooks/useScrollTrigger'
import { useHamburgerAnimations } from '../hooks/useHamburgerAnimations'
import { debugLogger } from '../utils/debugLogger'

// Navigation items
const defaultNavItems = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const hamburgerNavItems = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: 'https://linkedin.com/in/jacqueline-frempomah-amoako', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://www.instagram.com/jackieofzera/', label: 'Instagram', icon: Instagram },
  { href: 'https://x.com/intelliJay09', label: 'Twitter', icon: Twitter },
  { href: 'mailto:hello@jacquelineamoako.com', label: 'Email', icon: Mail },
]

// Smooth scroll configuration with buffer zones for buttery transitions
const SCROLL_CONFIG = {
  desktopTrigger: typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600,  // Reduced from 0.8
  mobileTrigger: typeof window !== 'undefined' ? window.innerHeight * 0.25 : 180,   // Increased from 0.2
  mobileBreakpoint: 1024,
  bufferZone: typeof window !== 'undefined' ? window.innerHeight * 0.18 : 130       // 18% buffer zone for smooth transitions
}

interface NavigationProps {
  preloaderComplete?: boolean
}

export default function Navigation({ preloaderComplete = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Log preloaderComplete changes
  useEffect(() => {
    debugLogger.log('NAVIGATION', `preloaderComplete changed to: ${preloaderComplete}`, '🔄')
  }, [preloaderComplete])


  // Get scroll state from custom hook with buffer zones
  const { isMobile, showHamburger, hideDefault, scrollDirection } = useScrollTrigger(SCROLL_CONFIG)


  // Get animation refs from custom hook with enhanced parameters
  const { hamburgerRef, defaultNavRef, mobileMenuRef, logoRef } = useHamburgerAnimations(
    showHamburger,
    isMobile,
    hideDefault,
    scrollDirection,
    isMenuOpen
  )


  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prepare navigation state for ThemeTogglePortal
  const navigationState = {
    isMenuOpen,
    isMobile,
    showHamburger,
    hideDefault,
    preloaderComplete
  }

  return (
    <>
      {/* Theme Toggle Portal - Rendered at document.body level */}
      <ThemeTogglePortal navigationState={navigationState} />
      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[70] py-6 ${!preloaderComplete ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <div className="w-full px-6 lg:px-10">
          <div className="flex items-center justify-between min-h-[56px]">
            
            {/* Logo */}
            <Link
              ref={logoRef}
              href="/"
              className={`font-satoshi font-normal text-primary group relative overflow-hidden whitespace-nowrap ${
                isMobile ? 'text-base' : 'text-lg'
              }`}
              style={{
                transformOrigin: 'center center',
                willChange: 'transform',
                lineHeight: '56px',
                height: '56px',
                display: 'inline-block'
              }}
            >
              <span className="block group-hover:-translate-x-full transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
                © Code by Jacqueline
              </span>
              <span className="absolute top-0 left-full group-hover:left-0 transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
                Jacqueline Amoako
              </span>
            </Link>

            {/* Right side container */}
            <div className="flex items-center">
              
              {/* Default Desktop Navigation - Only visible on desktop when not scrolled */}
              <div 
                ref={defaultNavRef}
                data-nav="default"
                className="hidden lg:flex items-center space-x-8 h-14"
                style={{ transform: 'translateX(0px)' }}
              >
                {defaultNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-satoshi font-normal text-base cursor-pointer
                               transition-all duration-300 ease-out will-change-transform
                               hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90
                               ${pathname === item.href ? 'text-text-primary' : 'text-primary'}`}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* ThemeToggle now rendered via portal - space preserved for layout */}
              </div>

              {/* Premium Mobile Menu Button - visible initially on mobile, matches desktop nav styling */}
              {isMobile && !showHamburger && !isMenuOpen && (
                <div className="lg:hidden flex items-center h-14" style={{ transform: 'translateX(0px)' }}>
                  <motion.button
                    data-menu-button="mobile-initial"
                    onClick={() => setIsMenuOpen(true)}
                    onTouchStart={(e) => {
                      // Add immediate touch feedback
                      const textElement = e.currentTarget.querySelector('.menu-text') as HTMLElement;
                      const dotElement = e.currentTarget.querySelector('.menu-dot') as HTMLElement;
                      if (textElement) {
                        textElement.style.transform = 'scale(1.02) translateY(-2px)';
                        textElement.style.letterSpacing = '0.05em';
                        textElement.style.opacity = '0.9';
                      }
                      if (dotElement) {
                        dotElement.style.transform = 'scale(1.1) translateY(-2px)';
                      }
                    }}
                    onTouchEnd={(e) => {
                      // Remove touch feedback with natural timing
                      const textElement = e.currentTarget.querySelector('.menu-text') as HTMLElement;
                      const dotElement = e.currentTarget.querySelector('.menu-dot') as HTMLElement;
                      setTimeout(() => {
                        if (textElement) {
                          textElement.style.transform = '';
                          textElement.style.letterSpacing = '';
                          textElement.style.opacity = '';
                        }
                        if (dotElement) {
                          dotElement.style.transform = '';
                        }
                      }, 150);
                    }}
                    className="flex items-center text-primary cursor-pointer group"
                    whileHover={{ 
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeOut"
                    }}
                    style={{ 
                      transformOrigin: 'center center'
                    }}
                  >
                    <motion.span 
                      className="menu-dot w-1 h-1 bg-text-primary rounded-full mr-2" 
                      whileHover={{
                        scale: 1.1,
                        y: -2
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    <span className="menu-text font-satoshi font-normal text-base leading-none
                                   transition-all duration-300 ease-out will-change-transform
                                   group-hover:tracking-wide group-hover:opacity-90
                                   group-hover:text-text-primary">
                      Menu
                    </span>
                  </motion.button>
                  {/* ThemeToggle now rendered via portal */}
                </div>
              )}

              {/* Mobile Hamburger Button - appears when scrolled on mobile */}
              <motion.button
                ref={mobileMenuRef}
                data-nav="hamburger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden rounded-full w-14 h-14 flex items-center justify-center cursor-pointer relative z-10"
                whileHover={{ 
                  scale: 1.15, 
                  y: -4, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeOut"
                }}
                style={{ 
                  backgroundColor: isMenuOpen 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgb(var(--color-hamburger-background))',
                  color: isMenuOpen 
                    ? '#FFFFFF' 
                    : 'rgb(var(--color-hamburger-text))',
                  // Ensure transform-origin is centered for smooth scaling
                  transformOrigin: 'center center'
                }}
                // CRITICAL: Force hardware acceleration to prioritize Framer Motion
                animate={{
                  scale: 1,
                  transition: { duration: 0.1 }
                }}
              >
                <HamburgerIcon isOpen={isMenuOpen} size="small" />
              </motion.button>

              {/* Desktop Hamburger Button - appears when scrolled on desktop */}
              <motion.button
                ref={hamburgerRef}
                data-nav="desktop-hamburger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hidden lg:flex items-center justify-center rounded-full w-16 h-16 cursor-pointer relative z-10"
                whileHover={{ 
                  scale: 1.15, 
                  y: -4, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeOut"
                }}
                style={{ 
                  backgroundColor: isMenuOpen 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgb(var(--color-hamburger-background))',
                  color: isMenuOpen 
                    ? '#FFFFFF' 
                    : 'rgb(var(--color-hamburger-text))',
                  // Ensure transform-origin is centered for smooth scaling
                  transformOrigin: 'center center'
                }}
                // CRITICAL: Force hardware acceleration to prioritize Framer Motion
                animate={{
                  scale: 1,
                  transition: { duration: 0.1 }
                }}
              >
                <HamburgerIcon isOpen={isMenuOpen} size="large" />
              </motion.button>

            </div>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm pointer-events-auto" 
            onClick={() => setIsMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="fixed top-0 right-0 w-full lg:w-[40vw] h-full backdrop-blur-lg shadow-2xl overflow-hidden z-[66] pointer-events-auto"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex flex-col h-full">
                
                {/* Navigation Section */}
                <div className="flex-1 flex flex-col justify-center pl-4 pr-8">
                  <h3 className="text-sm font-satoshi font-light tracking-wider uppercase mb-8 ml-9 text-white/60">
                    Navigation
                  </h3>
                  <div className="space-y-8">
                    {hamburgerNavItems.map((item, index) => (
                      <motion.div 
                        key={item.href} 
                        className="relative flex items-center"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.1 + (index * 0.05),
                          ease: "easeOut" 
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-6 transition-all duration-300"
                          style={{
                            backgroundColor: pathname === item.href ? 'white' : 'transparent',
                            transform: pathname === item.href ? 'scale(1)' : 'scale(0)'
                          }} 
                        />
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          onTouchStart={(e) => {
                            // Add visual feedback on touch start
                            const target = e.currentTarget;
                            target.style.transform = 'scale(1.02) translateY(-2px)';
                            target.style.opacity = '0.9';
                          }}
                          onTouchEnd={(e) => {
                            // Remove visual feedback on touch end
                            const target = e.currentTarget;
                            setTimeout(() => {
                              target.style.transform = '';
                              target.style.opacity = '';
                            }, 100);
                          }}
                          className={`mobile-menu-link navigation-link block font-satoshi font-light text-white cursor-pointer
                                     transition-all duration-300 ease-out will-change-transform
                                     hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-90
                                     active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-90 ${
                            isMobile ? 'text-4xl' : 'text-5xl'
                          } ${pathname === item.href ? 'font-normal' : ''}`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle Section - now rendered via portal */}

                {/* Social Media Section */}
                <div className="pl-4 pr-8 pb-6 lg:pb-8 -mt-5 lg:mt-0">
                  <h3 className="text-sm font-satoshi font-light tracking-wider uppercase mb-2 lg:mb-4 ml-9 text-white/60">
                    Socials
                  </h3>
                  <div className="flex flex-wrap gap-6 ml-9">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onTouchStart={(e) => {
                          // Add visual feedback on touch start
                          const target = e.currentTarget;
                          target.style.transform = 'scale(1.02) translateY(-2px)';
                          target.style.opacity = '1';
                        }}
                        onTouchEnd={(e) => {
                          // Remove visual feedback on touch end
                          const target = e.currentTarget;
                          setTimeout(() => {
                            target.style.transform = '';
                            target.style.opacity = '';
                          }, 100);
                        }}
                        className="mobile-menu-link navigation-link font-satoshi font-light text-lg text-white/80 cursor-pointer
                                   transition-all duration-300 ease-out will-change-transform
                                   hover:scale-[1.02] hover:tracking-wide hover:-translate-y-0.5 hover:opacity-100
                                   active:scale-[1.02] active:tracking-wide active:-translate-y-0.5 active:opacity-100"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.2 + (index * 0.03),
                          ease: "easeOut" 
                        }}
                      >
                        {social.label}
                      </motion.a>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hamburger Icon Component
interface HamburgerIconProps {
  isOpen: boolean
  size?: 'small' | 'large'
}

function HamburgerIcon({ isOpen, size = 'large' }: HamburgerIconProps) {
  const lineWidth = size === 'large' ? 'w-7' : 'w-5'
  const iconSize = size === 'large' ? 24 : 20

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <X size={iconSize} strokeWidth={1.5} />
        </motion.div>
      ) : (
        <motion.div
          key="hamburger"
          className="flex flex-col items-center justify-center space-y-1.5"
          initial={{ rotate: 90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: -90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div 
            className={`${lineWidth} rounded-full`}
            style={{ backgroundColor: '#8B8B8B', height: '1.5px' }}
            initial={{ scaleX: 0.6 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
          <motion.div 
            className={`${lineWidth} rounded-full`}
            style={{ backgroundColor: '#8B8B8B', height: '1.5px' }}
            initial={{ scaleX: 0.6 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}