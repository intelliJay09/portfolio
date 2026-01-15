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
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Jacqueline Amoako - Luxury Web Developer & Creative Technologist',
    template: '%s | Jacqueline Amoako - Luxury Web Developer'
  },
  description: 'Premium web development and creative technology services for luxury brands. Specializing in high-end websites, sophisticated e-commerce solutions, and bespoke digital experiences that drive growth for discerning businesses.',
  keywords: [
    // Primary luxury keywords
    'luxury web developer',
    'premium website design', 
    'high-end web development',
    'luxury brand websites',
    'exclusive digital experiences',
    'bespoke web solutions',
    
    // Service-specific luxury keywords
    'luxury e-commerce development',
    'premium online store design',
    'high-end React developer',
    'luxury Next.js applications',
    'sophisticated web applications',
    'premium brand digital presence',
    
    // Location + luxury
    'luxury web developer Ghana',
    'premium web design Accra',
    'high-end developer West Africa',
    'luxury website design Ghana',
    
    // Technical + luxury positioning
    'luxury website performance optimization',
    'premium SEO services',
    'high-end database solutions',
    'luxury creative technology',
    'premium digital consulting',
    'exclusive web development services'
  ],
  authors: [{ 
    name: 'Jacqueline Frempomah Amoako',
    url: 'https://jacquelineamoako.com'
  }],
  creator: 'Jacqueline Frempomah Amoako',
  publisher: 'Jacqueline Amoako Creative Technology Studio',
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
    title: 'Jacqueline Amoako - Luxury Web Developer',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
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
    siteName: 'Jacqueline Amoako - Luxury Web Developer',
    title: 'Luxury Web Developer & Creative Technologist | Premium Digital Experiences',
    description: 'Transform your brand with sophisticated web development and creative technology. Specializing in luxury websites, high-end e-commerce, and bespoke digital solutions for discerning businesses worldwide.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jackie-studio.png',
        width: 1200,
        height: 630,
        alt: 'Jacqueline Amoako - Luxury Web Developer & Creative Technologist',
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
    title: 'Luxury Web Developer & Creative Technologist | Premium Digital Experiences',
    description: 'Transform your brand with sophisticated web development and creative technology. Specializing in luxury websites and bespoke digital solutions.',
    creator: '@jacquelineamoako',
    site: '@jacquelineamoako',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jackie-studio.png',
        alt: 'Jacqueline Amoako - Luxury Web Developer',
        width: 1200,
        height: 630,
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
  classification: 'Luxury Web Development, Creative Technology, Premium Digital Services',
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
        <Script id="google-tag-manager" strategy="afterInteractive">
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
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7S9X5PWGY1');
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