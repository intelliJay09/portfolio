'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useRecaptcha } from '../../hooks/useRecaptcha'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import PagePreloader from '../../components/PagePreloader'
import { Send, Mail, MapPin } from 'lucide-react'
import content from '../../content.json'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ContactPage() {
  const router = useRouter()
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const { executeRecaptcha, isReady } = useRecaptcha(preloaderComplete)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    service: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isFormActive, setIsFormActive] = useState(false)

  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const floatingAnimationRef = useRef<GSAPTween | null>(null)
  const pageContentRef = useRef<HTMLDivElement>(null)

  // Preloader completion handler
  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  // Ensure blur is removed when preloader completes
  useEffect(() => {
    if (preloaderComplete && pageContentRef.current) {
      // Force remove any lingering filters
      pageContentRef.current.style.filter = 'none'
      pageContentRef.current.style.transform = 'none'
    }
  }, [preloaderComplete])

  // Initial animations
  useEffect(() => {
    if (!preloaderComplete) return

    const tl = gsap.timeline({ delay: 0.2 })

    // Card scales in with gentle fade
    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out'
        }
      )

      // Add continuous gentle floating animation
      floatingAnimationRef.current = gsap.to(cardRef.current, {
        y: -10,
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5
      })
    }

    // Form fields stagger in
    if (formRef.current) {
      const fields = formRef.current.querySelectorAll('.form-field')
      tl.fromTo(
        fields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.8'
      )
    }
  }, [preloaderComplete])

  // Effect to handle floating animation based on form interaction
  useEffect(() => {
    if (floatingAnimationRef.current) {
      if (isFormActive) {
        floatingAnimationRef.current.pause()
      } else {
        floatingAnimationRef.current.resume()
      }
    }
  }, [isFormActive])

  const handleFormMouseEnter = () => {
    setIsFormActive(true)
  }

  const handleFormMouseLeave = () => {
    // Only set to false if no field is focused
    if (!focusedField) {
      setIsFormActive(false)
    }
  }

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName)
    setIsFormActive(true)
  }

  const handleFieldBlur = () => {
    setFocusedField(null)
    // Small delay to check if mouse is still over form
    setTimeout(() => {
      const formElement = formRef.current
      if (formElement && !formElement.matches(':hover')) {
        setIsFormActive(false)
      }
    }, 100)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if reCAPTCHA is ready
    if (!isReady || !executeRecaptcha) {
      console.log('reCAPTCHA not yet ready')
      return
    }

    setStatus('loading')

    // Animate button while loading
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: -1
      })
    }

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('contact_form')

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      })

      if (response.ok) {
        // Success animation before redirect
        if (cardRef.current) {
          gsap.to(cardRef.current, {
            scale: 1.02,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: () => {
              router.push('/contact/success')
            }
          })
        } else {
          router.push('/contact/success')
        }
      } else {
        // Redirect to error page
        router.push('/contact/error')
      }
    } catch (_error) {
      // Redirect to error page on network errors
      router.push('/contact/error')
    } finally {
      if (buttonRef.current) {
        gsap.killTweensOf(buttonRef.current)
        gsap.set(buttonRef.current, { scale: 1 })
      }
    }
  }, [executeRecaptcha, formData, router, isReady])

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader
          pageName="Contact"
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
          <main className="relative flex items-center justify-center overflow-hidden">
          
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
            {/* Mesh gradient overlay for depth */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-text-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-text-primary/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-text-primary/5 rounded-full blur-3xl" />
            </div>
          </div>
          
          {/* Floating Island Container */}
          <section className="relative z-10 w-full px-4 sm:px-6 md:px-8 pt-28 pb-16 sm:pt-32 sm:pb-18 md:pt-40 md:pb-20 lg:pt-48 lg:pb-24">
            <div className="w-full max-w-2xl mx-auto">
              
              {/* Main Floating Card */}
              <div 
                ref={cardRef}
                className="relative bg-background-primary/95 backdrop-blur-xl rounded-3xl contact-floating-card"
                style={{
                  boxShadow: `
                    0 10px 40px -10px rgba(0, 0, 0, 0.1),
                    0 20px 60px -20px rgba(0, 0, 0, 0.15),
                    0 30px 80px -30px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  border: '1px solid rgba(234, 234, 234, 0.1)'
                }}
              >
                <div className="p-6 sm:p-10 md:p-12 lg:p-16">
                  
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="relative w-[120px] h-[120px] mx-auto mb-6 rounded-full overflow-hidden shadow-lg next-image-protected">
                      <Image
                        src="/images/contact-image.jpg"
                        alt="Jacqueline Amoako"
                        fill
                        className="object-cover"
                        sizes="120px"
                        quality={85}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        style={{
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          userSelect: 'none',
                          // @ts-expect-error - WebKit properties not in React.CSSProperties
                          WebkitUserDrag: 'none',
                          WebkitTouchCallout: 'none'
                        }}
                      />
                    </div>
                    <h1 
                      ref={headlineRef}
                      className="text-4xl sm:text-5xl font-satoshi text-text-primary mb-4"
                      style={{ 
                        fontWeight: 300,
                        letterSpacing: '0.02em',
                        lineHeight: 1.2
                      }}
                    >
                      Let&apos;s Connect
                    </h1>
                    <p className="text-lg text-text-secondary max-w-md mx-auto">
                      {content.contact.intro}
                    </p>
                  </div>
                  
                  {/* Contact Form */}
                    <form 
                      ref={formRef} 
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      onMouseEnter={handleFormMouseEnter}
                      onMouseLeave={handleFormMouseLeave}
                    >
                      {/* Name Field */}
                      <div className="form-field">
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('name')}
                          onBlur={handleFieldBlur}
                          required
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 focus:outline-none focus:ring-0 
                                   border-0 border-b contact-form-field`}
                          style={{ 
                            borderRadius: '5px 5px 5px 5px',
                            borderBottomWidth: '0.5px',
                            borderTopWidth: '0',
                            borderLeftWidth: '0', 
                            borderRightWidth: '0',
                            borderStyle: 'solid',
                            borderColor: '#9CA3AF',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'name' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            outline: 'none'
                          }}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      {/* Organization Field */}
                      <div className="form-field">
                        <label htmlFor="organization" className="block text-sm font-medium text-text-secondary mb-2">
                          Organization/Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('organization')}
                          onBlur={handleFieldBlur}
                          required
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 focus:outline-none focus:ring-0 
                                   border-0 border-b contact-form-field`}
                          style={{ 
                            borderRadius: '5px 5px 5px 5px',
                            borderBottomWidth: '0.5px',
                            borderTopWidth: '0',
                            borderLeftWidth: '0', 
                            borderRightWidth: '0',
                            borderStyle: 'solid',
                            borderColor: '#9CA3AF',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'organization' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            outline: 'none'
                          }}
                          placeholder="Your company or organization"
                        />
                      </div>
                      
                      {/* Service Field */}
                      <div className="form-field">
                        <label htmlFor="service" className="block text-sm font-medium text-text-secondary mb-2">
                          Service Needed <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('service')}
                          onBlur={handleFieldBlur}
                          required
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 focus:outline-none focus:ring-0 
                                   border-0 contact-form-field appearance-none`}
                          style={{ 
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'service' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            letterSpacing: 'normal',
                            fontSize: '15px'
                          }}
                        >
                          <option value="">Select a service...</option>
                          <option value="custom-web-development">Custom Web Development</option>
                          <option value="app-development">App Development</option>
                          <option value="ecommerce-solutions">E-Commerce Solutions</option>
                          <option value="seo-digital-strategy">SEO & Digital Strategy</option>
                          <option value="website-maintenance">Website Maintenance & Support</option>
                          <option value="teaching-mentorship">Teaching/Mentorship</option>
                          <option value="consultation">Consultation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      {/* Email Field */}
                      <div className="form-field">
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('email')}
                          onBlur={handleFieldBlur}
                          required
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 focus:outline-none focus:ring-0 
                                   border-0 border-b contact-form-field`}
                          style={{ 
                            borderRadius: '5px 5px 5px 5px',
                            borderBottomWidth: '0.5px',
                            borderTopWidth: '0',
                            borderLeftWidth: '0', 
                            borderRightWidth: '0',
                            borderStyle: 'solid',
                            borderColor: '#9CA3AF',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'email' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            outline: 'none'
                          }}
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      {/* Subject Field */}
                      <div className="form-field">
                        <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('subject')}
                          onBlur={handleFieldBlur}
                          required
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 focus:outline-none focus:ring-0 
                                   border-0 border-b contact-form-field`}
                          style={{ 
                            borderRadius: '5px 5px 5px 5px',
                            borderBottomWidth: '0.5px',
                            borderTopWidth: '0',
                            borderLeftWidth: '0', 
                            borderRightWidth: '0',
                            borderStyle: 'solid',
                            borderColor: '#9CA3AF',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'subject' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            outline: 'none'
                          }}
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      {/* Message Field */}
                      <div className="form-field">
                        <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus('message')}
                          onBlur={handleFieldBlur}
                          required
                          rows={5}
                          className={`w-full px-5 py-4 bg-transparent text-text-primary 
                                   transition-all duration-500 resize-none focus:outline-none focus:ring-0 
                                   border-0 border-b contact-form-field`}
                          style={{ 
                            borderRadius: '5px 5px 5px 5px',
                            borderBottomWidth: '0.5px',
                            borderTopWidth: '0',
                            borderLeftWidth: '0', 
                            borderRightWidth: '0',
                            borderStyle: 'solid',
                            borderColor: '#9CA3AF',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: focusedField === 'message' 
                              ? '0 8px 20px -5px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)' 
                              : 'none',
                            outline: 'none'
                          }}
                          placeholder="Tell me about your project..."
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <button
                        ref={buttonRef}
                        type="submit"
                        disabled={status === 'loading'}
                        className="group w-full py-4 px-6 bg-text-primary text-background-primary rounded-xl
                                 font-medium transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 active:scale-[0.98] contact-submit-btn"
                        style={{ fontSize: '16px', letterSpacing: '0.02em' }}
                      >
                        <span className="flex items-center justify-center">
                          {status === 'loading' ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </span>
                      </button>

                      {/* reCAPTCHA Notice */}
                      <div className="mt-4 text-center">
                        <p className="text-xs text-text-tertiary">
                          This site is protected by reCAPTCHA and the Google{' '}
                          <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-text-secondary transition-colors"
                          >
                            Privacy Policy
                          </a>{' '}
                          and{' '}
                          <a
                            href="https://policies.google.com/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-text-secondary transition-colors"
                          >
                            Terms of Service
                          </a>{' '}
                          apply.
                        </p>
                      </div>
                    </form>
                  
                </div>
              </div>
              
              {/* Contact Info Below Card */}
              <div className="mt-8 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg text-text-secondary"
                     style={{ fontSize: '18px' }}>
                  <a 
                    href={`mailto:${content.global.email}`}
                    className="group flex items-center gap-3 hover:text-text-primary transition-all duration-500 hover:scale-105 cursor-pointer"
                    style={{
                      transform: 'translateY(0px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                      e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px) scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <Mail className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    {content.global.email}
                  </a>
                  <span className="hidden sm:block text-text-tertiary">•</span>
                  <div 
                    className="group flex items-center gap-3 transition-all duration-500 hover:text-text-primary hover:scale-105"
                    style={{
                      transform: 'translateY(0px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                      e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px) scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <MapPin className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    {content.global.location}
                  </div>
                </div>
              </div>
              
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}