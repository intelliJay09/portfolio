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
    
    // Don't watch .playwright-mcp: browser tooling writes logs there continuously,
    // and each write triggered a recompile, so requests landing mid-rebuild read
    // half-written manifests and 500'd. Same regex as Next's default ignore list,
    // with .playwright-mcp added.
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /^((?:[^/]*(?:\/|$))*)(\.(git|next|playwright-mcp)|node_modules)(\/((?:[^/]*(?:\/|$))*)(?:$|\/))?/,
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
  // NOTE: X-Frame-Options, X-Content-Type-Options, Content-Security-Policy, and
  // Cross-Origin-Opener-Policy are set in middleware.ts, not here — middleware is
  // the only layer that can generate the per-request CSP nonce, so it's the single
  // source of truth for those headers. Cache-Control for images/fonts/css/js is
  // likewise owned by middleware.ts (it already covers those extensions). This file
  // only owns headers middleware does NOT set: Referrer-Policy, HSTS, and video
  // Accept-Ranges/caching.
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        }
        // Note: Cache-Control is intentionally NOT set here — HTML pages must not be
        // immutably cached so social media scrapers and browsers always get fresh metadata.
        // Next.js sets appropriate Cache-Control per route type automatically.
      ]
    },
    // Video optimization — not covered by middleware.ts's extension matching
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
  // Case studies that were removed from the portfolio keep their old links alive
  async redirects() {
    return ['goa-conference', 'qualivex-solutions', 'optimum-property-solutions', 'imagebloom-by-saida', 'rosemond-prempeh', 'royal-itech'].map((slug) => ({
      source: `/portfolio/${slug}`,
      destination: '/portfolio',
      permanent: true,
    }))
  },
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
  },
};

export default nextConfig;