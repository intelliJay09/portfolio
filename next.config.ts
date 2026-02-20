import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: process.cwd(),
  
  // Enhanced image optimization for luxury portfolio
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year caching for images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  
  // Compression and performance
  compress: true,
  poweredByHeader: false,
  
  // Generate static exports where possible for performance
  trailingSlash: false,
  
  // Optimize bundle analysis
  webpack: (config, { dev, isServer }) => {
    // CRITICAL FIX: Disable module concatenation to fix "Cannot read properties of undefined (reading 'call')" error
    // This is a known issue with Next.js 15.5.2 + React 19.1.1 on Windows
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        concatenateModules: false, // Disable module concatenation to fix the error
      }
    }
    
    // Optimize for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        concatenateModules: false, // Keep disabled in production too
      }
    }
    
    // Add bundle analyzer in development
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }

    return config
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        // Security headers
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; media-src 'self'; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com/recaptcha/; frame-src 'self' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://recaptcha.google.com/;"
        },
        // Performance headers for Core Web Vitals
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    // Specific caching for static assets
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
        {
          key: 'Vary',
          value: 'Accept'
        }
      ]
    },
    // Font optimization
    {
      source: '/fonts/(.*)',
      headers: [
        {
          key: 'Cache-Control', 
          value: 'public, max-age=31536000, immutable'
        },
        {
          key: 'Access-Control-Allow-Origin',
          value: '*'
        }
      ]
    },
    // Video optimization
    {
      source: '/images/(.*).mp4',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000'
        },
        {
          key: 'Accept-Ranges',
          value: 'bytes'
        }
      ]
    }
  ],
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
  },
};

export default nextConfig;