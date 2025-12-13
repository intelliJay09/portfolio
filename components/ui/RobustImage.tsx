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
  const [hasError, setHasError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    console.warn(`RobustImage: Image failed to load: ${currentSrc}`)
    onImageError?.(new Error(`Image failed to load: ${currentSrc}`))
    setHasError(true)

    // Try fallback image if provided
    const nextFallback = fallbackSrc || getFallbackImage(category)
    if (currentSrc !== nextFallback) {
      console.log('RobustImage: Trying fallback image:', nextFallback)
      setCurrentSrc(nextFallback)
      setHasError(false)
    }
  }

  const handleLoad = () => {
    console.log('RobustImage: onLoad fired for:', src)
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
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  )
}