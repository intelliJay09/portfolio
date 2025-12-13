'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LightTransparentCTAProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

export default function LightTransparentCTA({ href, children, className = '', target, rel }: LightTransparentCTAProps) {
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

  const baseClasses = "inline-flex items-center justify-center font-satoshi font-normal px-8 py-4 rounded-full text-black"
  
  const getStyles = () => {
    if (isHovered) {
      return {
        border: '2px solid rgba(0, 0, 0, 0.6)',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        color: '#000000 !important'
      }
    } else {
      return {
        border: '1px solid rgba(0, 0, 0, 0.6)',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        color: '#000000 !important'
      }
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
        style={getStyles()}
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