'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { getFallbackImage } from '../../utils/imageMapping'

interface RobustImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
  fallbackSrc?: string
  category?: string
  onImageError?: (error: Error) => void
  showPlaceholder?: boolean
  placeholderText?: string
}

export default function RobustImage({
  src,
  fallbackSrc,
  category = 'Websites',
  onImageError,
  showPlaceholder = true,
  placeholderText,
  alt,
  className = '',
  ...props
}: RobustImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  // Fallback timeout to ensure loading state is reset
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('RobustImage: Fallback timeout - forcing loading state to false for:', src)
        setIsLoading(false)
      }
    }, 5000) // 5 second fallback

    return () => clearTimeout(timeout)
  }, [isLoading, src])

  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`RobustImage: Image failed to load: ${currentSrc}`)
    onImageError?.(new Error(`Image failed to load: ${currentSrc}`))
    setHasError(true)
    setIsLoading(false)

    // Try fallback image if provided
    const nextFallback = fallbackSrc || getFallbackImage(category)
    if (currentSrc !== nextFallback) {
      console.log('RobustImage: Trying fallback image:', nextFallback)
      setCurrentSrc(nextFallback)
      setHasError(false)
      setIsLoading(true)
    }
  }

  const handleLoad = () => {
    console.log('RobustImage: onLoad fired for:', src)
    setIsLoading(false)
    setHasError(false)
  }

  // Show placeholder if image fails to load and showPlaceholder is true
  if (hasError && showPlaceholder) {
    return (
      <div 
        className={`flex items-center justify-center text-text-tertiary ${className}`}
        {...props}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📸</div>
          <p className="text-sm font-satoshi">
            {placeholderText || 'Image not available'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center animate-pulse ${className}`}
        >
          <div className="text-text-tertiary">
            <div className="w-8 h-8 border-2 border-text-tertiary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  )
}