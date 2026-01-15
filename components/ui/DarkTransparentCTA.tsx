'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackButtonClick } from '../../lib/analytics'

interface DarkTransparentCTAProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  trackingName?: string
}

export default function DarkTransparentCTA({ href, children, className = '', target, rel, trackingName }: DarkTransparentCTAProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleClick = () => {
    if (trackingName) {
      trackButtonClick(trackingName, {
        button_type: 'DarkTransparentCTA',
        destination: href,
      })
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const offsetX = (mouseX - centerX) * 0.1
    const offsetY = (mouseY - centerY) * 0.08
    
    setMousePosition({ x: offsetX, y: offsetY })
  }

  const baseClasses = "inline-flex items-center justify-center font-satoshi font-normal px-8 py-4 rounded-full"
  
  const getStyles = () => {
    if (isHovered) {
      return {
        border: '2px solid rgba(255, 255, 255, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        color: '#ffffff'
      }
    } else {
      return {
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        color: '#ffffff'
      }
    }
  }

  return (
    <motion.div
      className="inline-block"
      initial={{ scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y + (isHovered ? -2 : 0),
        rotate: mousePosition.x * 0.01,
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
        style={getStyles()}
        onClick={handleClick}
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