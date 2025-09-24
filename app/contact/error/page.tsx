'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import { AlertTriangle, ArrowLeft, RefreshCw, Mail, Search, HelpCircle, X } from 'lucide-react'
import Link from 'next/link'
import GlassCTA from '../../../components/ui/GlassCTA'

export default function ContactErrorPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const errorOrbRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement[]>([])


  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.6 })
    
    // Error orb entrance with elegant animation
    if (errorOrbRef.current) {
      tl.fromTo(
        errorOrbRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.4,
          ease: 'back.out(1.2)',
        }
      )
    }
    
    // Timeline elements stagger in
    if (timelineRef.current) {
      const timelineSteps = timelineRef.current.querySelectorAll('.timeline-step')
      tl.fromTo(
        timelineSteps,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
        },
        '-=0.9'
      )
    }
    
    // Content reveals with sophisticated timing
    if (contentRef.current) {
      const elements = contentRef.current.children
      tl.fromTo(
        elements,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.7'
      )
    }

    // Floating background elements
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: -12 + (index * 4),
          duration: 5 + (index * 0.8),
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.4
        })
      }
    })
  }, [])

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden">
        
        {/* Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          {/* Floating geometric elements */}
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[0] = el }}
            className="absolute top-1/4 left-1/6 w-80 h-80 bg-text-primary/[0.02] rounded-full blur-3xl"
          />
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[1] = el }}
            className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-text-primary/[0.015] rounded-full blur-3xl"
          />
          <div 
            ref={(el) => { if (el) floatingElementsRef.current[2] = el }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-text-primary/[0.01] rounded-full blur-3xl"
          />
        </div>
        
        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-6 pt-40 pb-32 lg:pt-40 lg:pb-40">
            
            {/* Asymmetrical Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 lg:gap-24 max-w-7xl mx-auto">
              
              {/* Timeline - Shows Second on Mobile */}
              <div className="lg:col-span-1 order-2 lg:order-1 flex flex-col justify-center">
                <div ref={timelineRef} className="space-y-8">
                  
                  {/* Error Orb */}
                  <div className="flex items-center mb-12">
                    <div 
                      ref={errorOrbRef}
                      className="relative w-16 h-16 rounded-full bg-text-primary/5 backdrop-blur-sm border border-text-primary/10 flex items-center justify-center mr-6"
                      style={{
                        boxShadow: `
                          0 8px 32px -8px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `
                      }}
                    >
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-text-primary/70 uppercase tracking-wider mb-1">Status</h2>
                      <p className="text-lg text-text-primary font-medium">Message Failed</p>
                    </div>
                  </div>
                  
                  {/* Timeline Steps */}
                  <div className="timeline-step flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-3 h-3 rounded-full bg-red-500 mb-4" />
                      <div className="w-px h-16 bg-text-primary/20" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-text-primary/60" />
                        <span className="text-sm font-medium text-text-primary/70 uppercase tracking-wider">Issue</span>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-1">Error Occurred</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">Your message couldn&apos;t be delivered due to a technical issue.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-step flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-3 h-3 rounded-full bg-text-primary/40 mb-4" />
                      <div className="w-px h-16 bg-text-primary/20" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4 text-text-primary/60" />
                        <span className="text-sm font-medium text-text-primary/70 uppercase tracking-wider">Troubleshoot</span>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-1">Quick Solutions</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">Try refreshing the page or check your internet connection.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-step flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-3 h-3 rounded-full bg-text-primary/20 mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-text-primary/60" />
                        <span className="text-sm font-medium text-text-primary/70 uppercase tracking-wider">Support</span>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-1">Get Help</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">Contact me directly or try the form again.</p>
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Main Content - Shows First on Mobile */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div ref={contentRef} className="space-y-10">
                  
                  {/* Main Headline */}
                  <div className="max-w-2xl">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-satoshi text-text-primary mb-8"
                        style={{ 
                          fontWeight: 300,
                          letterSpacing: '0.02em',
                          lineHeight: 1.1
                        }}>
                      Something Went Wrong.
                    </h1>
                    <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                      Don&apos;t worry - technical hiccups happen. There are several ways we can still connect and get your project moving forward.
                    </p>
                  </div>
                  
                  {/* Floating Information Card */}
                  <div className="bg-background-primary/60 backdrop-blur-xl rounded-2xl p-8 border border-text-primary/[0.08]"
                       style={{
                         boxShadow: `
                           0 20px 60px -20px rgba(0, 0, 0, 0.15),
                           0 8px 25px -8px rgba(0, 0, 0, 0.08),
                           inset 0 1px 0 rgba(255, 255, 255, 0.1)
                         `
                       }}>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-medium text-text-primary/70 uppercase tracking-wider mb-3">Quick Solutions</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-text-secondary leading-relaxed">Refresh the page and try submitting again</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-text-secondary leading-relaxed">Check your internet connection</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-text-secondary leading-relaxed">Try again in a few minutes</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-text-primary/70 uppercase tracking-wider mb-3">Direct Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-text-primary/60" />
                            <a 
                              href="mailto:jacque.amoako@gmail.com"
                              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                            >
                              jacque.amoako@gmail.com
                            </a>
                          </div>
                          <div className="text-xs text-text-secondary/70 leading-relaxed">
                            Send me an email directly - I&apos;ll respond within 24 hours.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  {/* Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-12">
                    <GlassCTA href="/contact" variant="auto">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </GlassCTA>
                    
                    <GlassCTA href="/" variant="white">
                      Return Home
                    </GlassCTA>
                  </div>
                  
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