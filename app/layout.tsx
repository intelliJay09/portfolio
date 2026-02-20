import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import ClientLenisProvider from '../components/ClientLenisProvider'
import ImageProtection from '../components/ImageProtection'
import NgrokSetup from '../components/NgrokSetup'
import { WebVitalsReporter } from '../components/WebVitals'
import { ThemeProvider } from '../contexts/ThemeProvider'
import { detectServerTheme } from '../lib/server-theme'
import {
  generatePersonSchema,
  generateWebsiteSchema,
  generateProfessionalServiceSchema
} from '../lib/schema-markup'
import { getHomepageOpenGraph, getDefaultTwitterCard, generateCompleteMetadata } from '../lib/open-graph'
import '../globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Jacqueline Amoako - Digital Growth Strategist & Systems Architect',
    template: '%s | Jacqueline Amoako'
  },
  description: 'Digital Growth Strategist architecting revenue-generating ecosystems for premium brands worldwide. From 340% traffic growth to 28% conversion increases—complete growth systems that scale your vision from $100K to $10M.',
  keywords: [
    // Primary strategic keywords
    'digital growth strategist',
    'strategic growth systems',
    'revenue-generating ecosystems',
    'premium brand growth',
    'business growth architect',
    'conversion optimization specialist',

    // Service-specific strategic keywords
    'SEO authority building',
    'conversion rate optimization',
    'premium lead generation systems',
    'revenue-optimized commerce',
    'market authority development',
    'strategic brand positioning',

    // Location + strategic positioning
    'Ghana growth strategist',
    'Accra digital strategist',
    'West Africa business growth',
    'Ghana strategic consulting',
    'African market growth expert',

    // Outcome-focused keywords
    'measurable business outcomes',
    'strategic business growth',
    'revenue systems architect',
    'growth analytics strategy',
    'traffic acquisition systems',
    'premium business consulting'
  ],
  authors: [{
    name: 'Jacqueline Frempomah Amoako',
    url: 'https://jacquelineamoako.com'
  }],
  creator: 'Jacqueline Frempomah Amoako',
  publisher: 'Jacqueline Amoako - Strategic Growth Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/images/favicon-new.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-new.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/favicon-new.png',
    apple: [
      { url: '/images/favicon-new.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Jacqueline Amoako - Digital Growth Strategist',
  },
  verification: {
    google: 'VXFIG8ay39DeBrq215zuCJtO0i0Z6wy6pRWr6uQom38',
  },
  alternates: {
    canonical: 'https://jacquelineamoako.com',
    languages: {
      'en-US': 'https://jacquelineamoako.com',
      'en-GB': 'https://jacquelineamoako.com/en-gb',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jacquelineamoako.com',
    siteName: 'Jacqueline Amoako',
    title: 'Jacqueline Amoako | Digital Growth Strategist & Systems Architect',
    description: 'Digital Growth Strategist architecting revenue-generating ecosystems for premium brands worldwide. From 340% traffic growth to 28% conversion increases—complete growth systems that scale your vision from $100K to $10M.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Jacqueline Amoako - Digital Growth Strategist building revenue ecosystems for luxury brands',
        type: 'image/png',
      }
    ],
    videos: [
      {
        url: 'https://jacquelineamoako.com/images/gc-teaching-full.mp4',
        width: 1280,
        height: 720,
        type: 'video/mp4',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacqueline Amoako | Digital Growth Strategist',
    description: 'Architecting revenue-generating ecosystems for premium brands worldwide. Complete growth systems from $100K to $10M—340% traffic growth, 28% conversion increases.',
    creator: '@intelliJay09',
    site: '@intelliJay09',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        alt: 'Digital Growth Strategist building complete growth ecosystems',
        width: 3000,
        height: 1575,
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    notranslate: false,
    indexifembedded: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  category: 'Professional Services',
  classification: 'Strategic Growth Consulting, Digital Growth Strategy, Business Development',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Detect theme server-side to ensure SSR-client consistency
  const { theme: serverTheme } = await detectServerTheme()
  
  // Generate structured data for SEO
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebsiteSchema() 
  const professionalServiceSchema = generateProfessionalServiceSchema()

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${satoshi.variable}`}
      data-theme={serverTheme}
      style={{ colorScheme: serverTheme }}
      suppressHydrationWarning={true}
    >
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema)
          }}
        />
        
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://linkedin.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5X3MTQ5R');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7S9X5PWGY1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            if (!window.gtag) {
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
            }
            window.gtag('js', new Date());
            window.gtag('config', 'G-7S9X5PWGY1');
          `}
        </Script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Security: Validate theme values to prevent XSS
                  function validateTheme(theme) {
                    return (theme === 'light' || theme === 'dark') ? theme : null;
                  }
                  
                  // Security: Safe cookie reader with sanitization
                  function getCookie(name) {
                    try {
                      var value = '; ' + document.cookie;
                      var parts = value.split('; ' + name + '=');
                      if (parts.length === 2) {
                        var cookieValue = parts.pop().split(';').shift();
                        // Sanitize: only allow alphanumeric and hyphens
                        return cookieValue ? cookieValue.replace(/[^a-zA-Z0-9-]/g, '') : null;
                      }
                    } catch (e) {
                      // Cookie access failed in some browsers
                    }
                    return null;
                  }
                  
                  // Get server-rendered theme (already validated server-side)
                  var serverTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                  
                  // Check client-side theme preferences in priority order
                  var cookieTheme = getCookie('portfolio-theme');
                  var storedTheme = null;
                  var systemPreference = 'dark'; // Default to dark for luxury portfolio
                  
                  // Safe localStorage access
                  try {
                    storedTheme = localStorage.getItem('theme');
                  } catch (e) {
                    // localStorage unavailable (private browsing, etc.)
                  }
                  
                  // Safe system preference detection
                  try {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                      systemPreference = 'light';
                    }
                  } catch (e) {
                    // matchMedia unavailable in some browsers
                  }
                  
                  // Validate all theme sources
                  var validatedCookie = validateTheme(cookieTheme);
                  var validatedStored = validateTheme(storedTheme);
                  var validatedServer = validateTheme(serverTheme);
                  
                  // Theme priority: cookie > localStorage > system > server-rendered > dark
                  var finalTheme = validatedCookie || validatedStored || systemPreference || validatedServer || 'dark';
                  
                  // Performance: Only manipulate DOM if theme differs from server-rendered
                  if (finalTheme !== serverTheme) {
                    document.documentElement.setAttribute('data-theme', finalTheme);
                    document.documentElement.style.colorScheme = finalTheme;
                    
                    // Sync localStorage if preference differs
                    if (validatedStored !== finalTheme) {
                      try {
                        localStorage.setItem('theme', finalTheme);
                      } catch (e) {
                        // Ignore localStorage errors (private browsing, quota)
                      }
                    }
                    
                    // Sync cookie if preference differs
                    if (validatedCookie !== finalTheme) {
                      try {
                        var cookieString = 'portfolio-theme=' + finalTheme + 
                          '; Max-Age=31536000' + 
                          '; Path=/' + 
                          '; SameSite=strict';
                        
                        // Add Secure flag for HTTPS
                        if (window.location.protocol === 'https:') {
                          cookieString += '; Secure';
                        }
                        
                        document.cookie = cookieString;
                      } catch (e) {
                        // Ignore cookie errors
                      }
                    }
                  }
                  
                } catch (error) {
                  // Graceful fallback: maintain server theme or default to dark
                  var currentTheme = document.documentElement.getAttribute('data-theme');
                  if (!currentTheme) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background-primary text-text-primary font-inter antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5X3MTQ5R"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <WebVitalsReporter />
        <ThemeProvider
          serverTheme={serverTheme}
          defaultTheme="dark"
          enableSystemTheme={true}
          enableTransitions={true}
        >
          <NgrokSetup />
          <ImageProtection />
          <ClientLenisProvider>
            {children}
          </ClientLenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}