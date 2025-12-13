'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'

interface GraphicDesignModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    slug: string
    title: string
    short_description: string
    category: string
  }
  imageSrc: string
}

export default function GraphicDesignModal({ isOpen, onClose, project, imageSrc }: GraphicDesignModalProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isOpen && imageRef.current) {
      // Elegant entrance animation for the image
      gsap.fromTo(imageRef.current,
        { 
          scale: 0.95, 
          opacity: 0,
          y: 20
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out' as const,
          delay: 0.2
        }
      )
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleBackdropClick}
        >
          {/* Clean Dark Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-16 right-8 z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <X size={20} className="text-white/90 group-hover:text-white transition-colors duration-300" />
          </motion.button>

          {/* Pure Image Display */}
          <motion.div
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Image
              ref={imageRef}
              src={imageSrc}
              alt={project.title}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                width: 'auto',
                height: 'auto'
              }}
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}