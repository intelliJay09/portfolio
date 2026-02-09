'use client'

import { Code2, Database, Search, Settings, Palette } from 'lucide-react'
import { motion, useTransform } from 'framer-motion'
import GlassCTA from './ui/GlassCTA'
import content from '../content.json'
import { useScrollExpansion } from '../hooks/useScrollExpansion'
import { useTheme } from '../contexts/ThemeProvider'

const iconMap = {
  'Frontend Development': Code2,
  'Backend Development': Database,
  'SEO & Performance': Search,
  'APIs & Automation': Settings,
  'Brand Identity': Palette,
}

export default function ServicesOverview() {
  const { theme } = useTheme()
  const {
    containerRef,
    containerWidth,
    borderRadius,
    containerScale,
    shadowIntensity,
    cardsOpacity,
    cardsY,
    cardsScale
  } = useScrollExpansion()

  // Theme-based card styles
  const getCardStyles = (isMainCard: boolean) => {
    if (theme === 'dark') {
      return {
        background: isMainCard ? 'rgba(18, 18, 20, 0.8)' : 'rgba(18, 18, 20, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: isMainCard 
          ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 6px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }
    } else {
      // Original light theme styles preserved
      return {
        background: isMainCard ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isMainCard
          ? '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 6px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      }
    }
  }

  // Enhanced dynamic shadow for elegant section differentiation
  const dynamicShadow = useTransform(
    shadowIntensity,
    (value) => `
      0 -10px 40px -8px rgba(0, 0, 0, ${value * 0.4}),
      -10px 0 40px -8px rgba(0, 0, 0, ${value * 0.3}),
      10px 0 40px -8px rgba(0, 0, 0, ${value * 0.3}),
      0 25px 50px -12px rgba(0, 0, 0, ${value}),
      inset 0 1px 0 rgba(255, 255, 255, ${value * 0.1})
    `
  )

  return (
    <>
      {/* My Expertise Section */}
      <div className="bg-background-primary" style={{ paddingTop: 'calc(3rem + 20px)', paddingBottom: '5rem' }}>
        <div className="relative w-full flex justify-center items-center min-h-screen">
          <motion.div 
            ref={containerRef}
            className="relative overflow-hidden expertise-section-bg"
            style={{ 
              width: containerWidth,
              borderRadius: borderRadius,
              scale: containerScale,
              boxShadow: dynamicShadow,
              minHeight: '600px'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div 
              className="relative z-10 h-full flex flex-col justify-center"
              style={{
                opacity: cardsOpacity,
                y: cardsY,
                scale: cardsScale
              }}
            >
              <div className="max-w-7xl mx-auto px-8 w-full" style={{ contain: 'layout', willChange: 'transform', transform: 'translateZ(0)' }}>
                <div className="text-center max-w-3xl mx-auto mb-16 py-16">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-satoshi font-normal text-primary mb-6" style={{ letterSpacing: '0.1em' }}>
                    {content.homepage.services_overview.title}
                  </h2>
                  <p className="text-lg lg:text-xl text-secondary leading-relaxed">
                    {content.homepage.services_overview.intro}
                  </p>
                </div>

                {/* Asymmetrical Grid - 2 large cards on top, 3 medium cards below */}
                <div className="space-y-8 lg:space-y-12 mb-16">
                  {/* Top Row - Core Development Skills (2 cards) */}
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {content.homepage.services_overview.services
                      .filter(service => service.title === 'Frontend Development' || service.title === 'Backend Development')
                      .map((service, index) => {
                        const Icon = iconMap[service.title as keyof typeof iconMap] || Settings
                        
                        return (
                          <motion.div
                            key={service.title}
                            className="group relative p-8 lg:p-10 rounded-3xl"
                            style={{
                              ...getCardStyles(true),
                              backdropFilter: 'blur(32px)',
                              WebkitBackdropFilter: 'blur(32px)',
                            }}
                            initial={{ opacity: 0, y: 60, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.15,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            whileHover={{ 
                              scale: 1.03,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative">
                              <Icon className="w-14 h-14 text-primary mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-lg group-hover:text-text-secondary" style={{ strokeWidth: 1.5 }} />
                              <h3 className="text-2xl lg:text-3xl font-satoshi font-medium text-on-dark-primary mb-4 group-hover:text-text-secondary transition-colors duration-300" style={{ letterSpacing: '0.06em' }}>
                                {service.title}
                              </h3>
                              <p className="text-on-dark-secondary leading-relaxed font-inter text-base lg:text-lg mb-4">
                                {service.description}
                              </p>
                              {service.experience && (
                                <div className="text-sm font-satoshi font-medium text-primary opacity-80">
                                  {service.experience}
                                </div>
                              )}
                            </div>
                            
                            {/* Subtle glow effect */}
                            <motion.div 
                              className="absolute inset-0 rounded-3xl pointer-events-none"
                              style={{
                                background: 'radial-gradient(600px circle at center, rgb(var(--color-text-primary) / 0.06), transparent 40%)'
                              }}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </motion.div>
                        )
                      })}
                  </div>

                  {/* Bottom Row - Specialized Skills (3 cards) */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {content.homepage.services_overview.services
                      .filter(service => service.title !== 'Frontend Development' && service.title !== 'Backend Development')
                      .map((service, index) => {
                        const Icon = iconMap[service.title as keyof typeof iconMap] || Settings
                        
                        return (
                          <motion.div
                            key={service.title}
                            className="group relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl"
                            style={{
                              ...getCardStyles(false),
                              backdropFilter: 'blur(24px)',
                              WebkitBackdropFilter: 'blur(24px)',
                            }}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.3 + (index * 0.1),
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative">
                              <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-primary mb-4 lg:mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-lg group-hover:text-text-secondary" style={{ strokeWidth: 1.5 }} />
                              <h3 className="text-lg lg:text-xl font-satoshi font-medium text-on-dark-primary mb-3 lg:mb-4 group-hover:text-text-secondary transition-colors duration-300" style={{ letterSpacing: '0.06em' }}>
                                {service.title}
                              </h3>
                              <p className="text-on-dark-secondary leading-relaxed font-inter text-sm lg:text-base mb-3">
                                {service.description}
                              </p>
                              {service.experience && (
                                <div className="text-xs lg:text-sm font-satoshi font-medium text-primary opacity-80">
                                  {service.experience}
                                </div>
                              )}
                            </div>
                            
                            {/* Subtle glow effect */}
                            <motion.div 
                              className="absolute inset-0 rounded-2xl lg:rounded-3xl pointer-events-none"
                              style={{
                                background: 'radial-gradient(400px circle at center, rgb(var(--color-text-primary) / 0.04), transparent 40%)'
                              }}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </motion.div>
                        )
                      })}
                  </div>
                </div>

                <motion.div 
                  className="text-center pb-16"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <GlassCTA href="/contact" variant="white">
                    Get Started
                  </GlassCTA>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </>
  )
}