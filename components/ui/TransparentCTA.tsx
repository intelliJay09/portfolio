'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { trackButtonClick } from '../../lib/analytics'

interface TransparentCTAProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  trackingName?: string
}

export default function TransparentCTA({ href, children, className = '', target, rel, trackingName }: TransparentCTAProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleClick = () => {
    if (trackingName) {
      trackButtonClick(trackingName, {
        button_type: 'TransparentCTA',
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
    
    // Calculate offset from center with reduced sensitivity
    const offsetX = (mouseX - centerX) * 0.15
    const offsetY = (mouseY - centerY) * 0.1
    
    setMousePosition({ x: offsetX, y: offsetY })
  }

  return (
    <motion.div
      className="inline-block mt-12 md:mt-0"
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
      <a
        href={href}
        target={target}
        rel={rel}
        className={`inline-flex items-center justify-center font-satoshi font-normal px-10 py-4 rounded-full border border-text-primary/20 bg-text-primary/5 text-text-primary backdrop-blur-sm w-full sm:w-auto ${className}`}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setMousePosition({ x: 0, y: 0 })
        }}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>
    </motion.div>
  )
}