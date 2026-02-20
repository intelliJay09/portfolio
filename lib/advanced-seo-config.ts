/**
 * Advanced SEO Configuration for Luxury Portfolio
 * Technical SEO enhancements and automation
 */

import { Metadata } from 'next'

export interface SEOConfig {
  baseUrl: string
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  siteAuthor: string
  twitterHandle: string
  googleVerification: string
  bingVerification: string
  yandexVerification: string
  pinterestVerification: string
}

export const seoConfig: SEOConfig = {
  baseUrl: 'https://jacquelineamoako.com',
  defaultTitle: 'Jacqueline Amoako - Luxury Web Developer & Creative Technologist Ghana',
  titleTemplate: '%s | Luxury Web Developer Ghana',
  defaultDescription: 'Premium web development and creative technology services in Accra, Ghana. Specializing in luxury websites, high-end e-commerce, and bespoke digital solutions for discerning brands across Africa.',
  siteAuthor: 'Jacqueline Frempomah Amoako',
  twitterHandle: '@intelliJay09',
  googleVerification: 'VXFIG8ay39DeBrq215zuCJtO0i0Z6wy6pRWr6uQom38',
  bingVerification: '',
  yandexVerification: '',
  pinterestVerification: ''
}

/**
 * Generate enhanced metadata with all SEO best practices
 */
export function generateEnhancedMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
  keywords?: string[],
  type: 'website' | 'article' | 'profile' = 'website'
): Metadata {
  const fullUrl = `${seoConfig.baseUrl}${path}`
  const imageUrl = image || `${seoConfig.baseUrl}/images/jackie-studio.png`
  
  return {
    title,
    description,
    keywords: keywords || [],
    authors: [{ name: seoConfig.siteAuthor, url: seoConfig.baseUrl }],
    creator: seoConfig.siteAuthor,
    publisher: 'Jacqueline Amoako Creative Technology Studio',
    
    // Enhanced Open Graph
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Jacqueline Amoako - Luxury Web Developer',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type,
      ...( type === 'article' && {
        article: {
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          authors: [seoConfig.siteAuthor],
          tags: keywords
        }
      })
    },
    
    // Enhanced Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: title.length > 70 ? `${title.substring(0, 67)}...` : title,
      description: description.length > 200 ? `${description.substring(0, 197)}...` : description,
      images: [imageUrl],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle
    },
    
    // Canonical URL
    alternates: {
      canonical: fullUrl,
      languages: {
        'en-US': fullUrl,
        'en-GB': `${fullUrl}?lang=en-gb`
      }
    },
    
    // Robots directives
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification
    verification: {
      google: seoConfig.googleVerification,
      // Add other verifications as needed
    }
  }
}

/**
 * Generate JSON-LD structured data for different page types
 */
export function generateStructuredData(type: string, data: Record<string, unknown>) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }
  
  return JSON.stringify(baseStructure)
}

/**
 * Breadcrumb generator with schema markup
 */
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { name: 'Home', url: seoConfig.baseUrl }
  ]
  
  let currentPath = ''
  segments.forEach((segment) => {
    currentPath += `/${segment}`
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      url: `${seoConfig.baseUrl}${currentPath}`
    })
  })
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

/**
 * Generate hreflang tags for international SEO
 */
export function generateHreflangTags(currentPath: string) {
  const languages = [
    { code: 'en', region: 'US', default: true },
    { code: 'en', region: 'GB' },
    { code: 'en', region: 'GH' }, // Ghana
    { code: 'en', region: 'NG' }, // Nigeria
    { code: 'en', region: 'ZA' }, // South Africa
    { code: 'en', region: 'KE' }, // Kenya
  ]
  
  return languages.map(lang => ({
    hrefLang: lang.region ? `${lang.code}-${lang.region}` : lang.code,
    href: `${seoConfig.baseUrl}${currentPath}${lang.default ? '' : `?lang=${lang.code}-${lang.region}`}`
  }))
}

/**
 * Advanced performance hints for SEO
 */
export const performanceHints = {
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  dnsPrefetch: [
    'https://linkedin.com',
    'https://github.com',
    'https://twitter.com'
  ],
  preload: [
    {
      href: '/fonts/Satoshi-Medium.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      href: '/images/jackie-studio.png',
      as: 'image',
      type: 'image/png'
    }
  ]
}

/**
 * Rich snippets for different content types
 */
export const richSnippets = {
  service: (service: Record<string, unknown>) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: 'Jacqueline Amoako',
      url: seoConfig.baseUrl
    },
    areaServed: {
      '@type': 'Country',
      name: 'Ghana'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: service.offerings
    }
  }),
  
  portfolio: (project: Record<string, unknown>) => ({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    creator: {
      '@type': 'Person',
      name: 'Jacqueline Amoako'
    },
    dateCreated: project.date,
    url: `${seoConfig.baseUrl}/portfolio/${project.slug}`,
    image: project.image,
    keywords: (project.keywords as string[])?.join(', ') || ''
  }),
  
  review: (review: Record<string, unknown>) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5'
    },
    reviewBody: review.text,
    itemReviewed: {
      '@type': 'ProfessionalService',
      name: 'Luxury Web Development Services'
    }
  })
}

/**
 * SEO monitoring and tracking pixels
 */
export const trackingScripts = {
  googleAnalytics: (measurementId: string) => `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
        cookie_flags: 'SameSite=None;Secure'
      });
    </script>
  `,
  
  googleTagManager: (containerId: string) => `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${containerId}');</script>
  `,
  
  facebookPixel: (pixelId: string) => `
    <!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    </script>
  `,
  
  linkedInInsight: (partnerId: string) => `
    <!-- LinkedIn Insight Tag -->
    <script type="text/javascript">
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    </script><script type="text/javascript">
    (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
    </script>
  `
}

/**
 * Core Web Vitals optimization settings
 */
export const webVitalsConfig = {
  LCP: { // Largest Contentful Paint
    target: 2.5, // seconds
    strategies: [
      'Preload hero images',
      'Optimize server response time',
      'Use CDN for assets',
      'Implement resource hints'
    ]
  },
  FID: { // First Input Delay
    target: 100, // milliseconds
    strategies: [
      'Break up long tasks',
      'Use web workers',
      'Optimize JavaScript execution',
      'Implement code splitting'
    ]
  },
  CLS: { // Cumulative Layout Shift
    target: 0.1,
    strategies: [
      'Set size attributes on images',
      'Reserve space for dynamic content',
      'Avoid inserting content above existing content',
      'Use transform animations instead of layout changes'
    ]
  },
  INP: { // Interaction to Next Paint (new metric)
    target: 200, // milliseconds
    strategies: [
      'Optimize event handlers',
      'Minimize main thread work',
      'Use requestIdleCallback for non-critical tasks',
      'Implement virtual scrolling for long lists'
    ]
  }
}