import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
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

// Absolute base for relative metadata URLs, such as each case study's og:image
const siteUrl = process.env.SITE_URL
if (!siteUrl && process.env.NODE_ENV === 'production') {
  console.error('SITE_URL is not set: share images will resolve to localhost')
}

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: {
    default: 'Jacqueline Amoako - Digital Systems Architect',
    template: '%s | Jacqueline Amoako'
  },
  description: 'Digital Systems Architect building revenue-generating ecosystems for premium brands worldwide. From 340% traffic growth to 28% conversion increases—complete growth systems that scale your vision from $100K to $10M.',
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
    title: 'Jacqueline Amoako - Digital Systems Architect',
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
    title: 'Jacqueline Amoako | Digital Systems Architect',
    description: 'Digital Systems Architect building revenue-generating ecosystems for premium brands worldwide. From 340% traffic growth to 28% conversion increases—complete growth systems that scale your vision from $100K to $10M.',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        width: 3000,
        height: 1575,
        alt: 'Jacqueline Amoako - Digital Systems Architect building revenue ecosystems for premium brands',
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
    title: 'Jacqueline Amoako | Digital Systems Architect',
    description: 'Architecting revenue-generating ecosystems for premium brands worldwide. Complete growth systems from $100K to $10M—340% traffic growth, 28% conversion increases.',
    creator: '@intelliJay09',
    site: '@intelliJay09',
    images: [
      {
        url: 'https://jacquelineamoako.com/images/jacqueline-amoako-og-image.png',
        alt: 'Digital Systems Architect building complete growth systems',
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

  // CSP nonce set by middleware.ts — required on every hand-authored inline/
  // external <script> below now that the CSP includes a nonce (browsers that
  // honor CSP3 ignore 'unsafe-inline' once a nonce is present, so any script
  // without one would be silently blocked). Next.js's own framework bundle
  // scripts pick up this nonce automatically from the CSP response header.
  const nonce = (await headers()).get('x-nonce') || undefined

  // Google Tag Manager container, the one place analytics tags are added or
  // removed (GA4 included). Without it the page still renders, with no tags.
  const gtmId = process.env.GTM_ID
  if (!gtmId && process.env.NODE_ENV === 'production') {
    console.error('GTM_ID is not set: analytics tags will not load')
  }

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
        {/* Structured Data for SEO. JSON-LD is a data block, not an executed
            script, so CSP never applies to it and it carries no nonce (a nonce
            here only caused a hydration mismatch, see the note on the scripts below). */}
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

        {/*
          Trusted Types default policy — must run before GTM or any other
          script that touches .src/.innerHTML. Named 'default' so the browser
          routes ALL unguarded Trusted Types sinks (including Next.js's own
          chunk loader and GTM's dynamic script injection) through it
          automatically. createScriptURL is a real allowlist (same-origin +
          GTM/GA only); createHTML/createScript stay pass-through because GTM's
          Custom HTML tag type needs it and its contents aren't controlled by
          this codebase — the createScriptURL allowlist is what actually
          constrains what code can load.
        */}
        <script
          id="trusted-types-policy"
          nonce={nonce}
          // Browsers hide nonce values from the DOM after load (by design, to stop
          // them leaking), so the client always reads "" here. That difference is
          // expected; the CSP check already happened on the server-rendered value.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.trustedTypes && window.trustedTypes.createPolicy) {
                  try {
                    window.trustedTypes.createPolicy('default', {
                      createScriptURL: function(url) {
                        // Same-origin relative/absolute path (Next.js's own
                        // chunk loader passes paths like "/_next/static/...",
                        // not full URLs).
                        if (url.charAt(0) === '/' && url.charAt(1) !== '/') return url;
                        var allowed = [
                          window.location.origin + '/',
                          'https://www.googletagmanager.com/',
                          'https://www.google-analytics.com/',
                          'https://ssl.google-analytics.com/',
                          // reCAPTCHA v3 on the contact form; mirrors the CSP's script-src
                          'https://www.google.com/recaptcha/',
                          'https://www.gstatic.com/recaptcha/',
                          // Cloudflare's analytics beacon, allowed by the production CSP
                          'https://static.cloudflareinsights.com/'
                        ];
                        for (var i = 0; i < allowed.length; i++) {
                          if (url.indexOf(allowed[i]) === 0) return url;
                        }
                        throw new Error('Blocked untrusted script URL: ' + url);
                      },
                      createHTML: function(html) { return html; },
                      createScript: function(script) { return script; }
                    });
                  } catch (e) {
                    // Policy named 'default' already exists — ignore.
                  }
                }
              })();
            `,
          }}
        />

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://linkedin.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Tag Manager, as Google's own head snippet. A plain inline script
            runs during parsing, before hydration, which is what beforeInteractive
            did, but unlike next/script it can opt out of the nonce hydration
            warning explained on the Trusted Types script above. */}
        {/* GA4 is delivered by this container, never loaded alongside it. */}
        {gtmId && (
        // eslint-disable-next-line @next/next/next-script-for-ga -- next/script cannot take suppressHydrationWarning, see above
        <script
          id="google-tag-manager"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
          `,
          }}
        />
        )}

        <script
          nonce={nonce}
          suppressHydrationWarning
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
        {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        )}

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