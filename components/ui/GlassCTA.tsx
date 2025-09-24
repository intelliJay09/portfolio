'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface GlassCTAProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  variant?: 'light' | 'dark' | 'white' | 'auto'
}

export default function GlassCTA({ href, children, className = '', target, rel, variant = 'auto' }: GlassCTAProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  const baseClasses = "inline-flex items-center justify-center backdrop-blur-xl border font-satoshi font-normal px-10 py-4 rounded-full whitespace-nowrap tracking-wide"
  
  const getVariantStyles = () => {
    // Auto variant uses CSS variables for theme-aware styling
    if (variant === 'auto') {
      return {
        background: `rgba(var(--glass-cta-bg), var(--glass-cta-bg-opacity))`,
        borderColor: `rgba(var(--glass-cta-border), var(--glass-cta-border-opacity))`,
        color: `rgb(var(--glass-cta-text))`,
        boxShadow: `0 8px 32px rgba(var(--glass-cta-shadow), var(--glass-cta-shadow-opacity)), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        hoverBackground: `rgba(var(--glass-cta-bg), var(--glass-cta-hover-bg-opacity))`,
        hoverBorderColor: `rgba(var(--glass-cta-border), var(--glass-cta-hover-border-opacity))`,
        hoverBoxShadow: `0 12px 40px rgba(var(--glass-cta-shadow), var(--glass-cta-hover-shadow-opacity)), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
      }
    } else if (variant === 'dark') {
      // For dark backgrounds - elegant white glassmorphism
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        hoverBackground: 'rgba(255, 255, 255, 0.15)',
        hoverBorderColor: 'rgba(255, 255, 255, 0.3)',
        hoverBoxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      }
    } else if (variant === 'white') {
      // For light backgrounds or dark theme - refined white glassmorphism  
      return {
        background: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000000',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)',
        hoverBackground: 'rgba(255, 255, 255, 0.9)',
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBoxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)'
      }
    } else {
      // Default light variant - subtle dark glassmorphism for light backgrounds
      return {
        background: 'rgba(0, 0, 0, 0.04)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        color: '#000000',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        hoverBackground: 'rgba(0, 0, 0, 0.08)',
        hoverBorderColor: 'rgba(0, 0, 0, 0.15)',
        hoverBoxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
      }
    }
  }

  const variantStyles = getVariantStyles()

  const getHoverStyles = () => {
    return isHovered ? {
      background: variantStyles.hoverBackground,
      borderColor: variantStyles.hoverBorderColor,
      boxShadow: variantStyles.hoverBoxShadow,
    } : {
      background: variantStyles.background,
      borderColor: variantStyles.borderColor,
      boxShadow: variantStyles.boxShadow,
    }
  }

  return (
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
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`${baseClasses} ${className}`}
        style={{
          ...getHoverStyles(),
          color: variantStyles.color,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setMousePosition({ x: 0, y: 0 })
        }}
        onMouseMove={handleMouseMove}
      >
        {children}
      </Link>
    </motion.div>
  )
}