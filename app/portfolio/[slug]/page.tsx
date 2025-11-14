'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, TrendingUp, Star, type LucideIcon } from 'lucide-react'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import PortfolioFooter from '../../../components/PortfolioFooter'
import PagePreloader from '../../../components/PagePreloader'
import GlassCTA from '../../../components/ui/GlassCTA'
import portfolioData from '../../../portfolio.json'
import content from '../../../content.json'
import testimonialData from '../../../testimonials.json'
import { useTheme } from '../../../contexts/ThemeProvider'

// Project data mapping
const getProjectData = (slug: string) => {
  const portfolioProject = portfolioData.portfolio.find(p => p.id === slug || p.id === slug.replace(/-/g, '-'))
  const contentProject = content.portfolio.projects.find(p => p.slug === slug)
  
  return {
    ...portfolioProject,
    ...contentProject,
  }
}

// Hero image mapping
const getProjectHeroImage = (slug: string) => {
  const heroImageMap: { [key: string]: string } = {
    'gwen-addo': '/images/gwen-portfolio-image.jpg',
    'eleven-eleven-ghana': '/images/11-11-case-study-hero.webp',
    'optimum-property-solutions': '/images/optimum-property.png',
    'emmanuel-kotia': '/images/emma-kotia.png',
    'imagebloom-by-saida': '/images/image-bloom.png',
    'rosemond-prempeh': '/images/rosemond-prempeh.png',
    'royal-itech': '/images/royal-itech.png',
    'girl-code-africa': '/images/girlcode.png',
    'goa-conference': '/images/ghana-optometric- association-conference.png',
    'eden-heights': '/images/eden-heights.png',
    'landmark-homes': '/images/landmark-homes.png',
    'ghana-optometric-association': '/images/ghana-optometric- association-main.png',
    'twist-nightclub': '/images/twist-night-club.png',
    'command-space': '/images/command-space.png',
    'qualivex-solutions': '/images/qualivex-solutions.png',
    'anabs': '/images/anabs.png',
    'kline-designs': '/images/klinedesign.png'
  }
  
  return heroImageMap[slug] || '/images/11-11-case-study-hero.webp' // Default fallback
}

// Types
interface PortfolioProject {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  client?: string;
  url?: string;
  year?: string;
  theChallenge?: string;
  [key: string]: unknown;
}

interface ProjectData {
  title?: string;
  category?: string;
  description?: string;
  client?: string;
  url?: string;
  year?: string;
  challenge?: {
    quote?: string;
    keyPoints?: string[];
  };
  video?: {
    src?: string;
    poster?: string;
  };
  results?: {
    description?: string;
  };
  techStack?: string[];
  stats?: Array<{ label: string; value: string }>;
  [key: string]: unknown;
}

// Project year assignment helper
const getProjectYear = (slug: string, portfolioProject: PortfolioProject | undefined, projectData: ProjectData): string => {
  const projectYears: { [key: string]: string } = {
    'gwen-addo': '2025',
    'eleven-eleven-ghana': '2024',
    'optimum-property-solutions': '2024',
    'emmanuel-kotia': '2023',
    'imagebloom-by-saida': '2025',
    'rosemond-prempeh': '2024',
    'royal-itech': '2023',
    'girl-code-africa': '2025',
    'goa-conference': '2024',
    'eden-heights': '2025',
    'landmark-homes': '2025',
    'ghana-optometric-association': '2024',
    'twist-nightclub': '2025',
    'command-space': '2023',
    'qualivex-solutions': '2024',
    'anabs': '2025',
    'kline-designs': '2025'
  }
  
  return projectYears[slug] || portfolioProject?.year || projectData?.year || '2024'
}

// Project-specific challenge content helpers
const getProjectChallengeQuote = (slug: string, projectData: ProjectData, portfolioProject: PortfolioProject | undefined): string => {
  const quotes: { [key: string]: string } = {
    'gwen-addo': 'How do you create a digital presence that truly reflects expertise and builds trust?',
    'eleven-eleven-ghana': 'How do you digitally replicate the luxurious atmosphere of beachfront living?',
    'optimum-property-solutions': 'How do you make international property search effortless and engaging?',
    'emmanuel-kotia': 'How do you showcase academic excellence in the digital age?',
    'imagebloom-by-saida': 'How do you blend artistry with commerce in the beauty industry?',
    'rosemond-prempeh': 'How do you create a welcoming digital space for faith-based community?',
    'royal-itech': 'How do you project cybersecurity expertise and professional trust?',
    'girl-code-africa': 'How do you create pathways for women to enter the tech industry?',
    'goa-conference': 'How do you streamline professional conference management and registration?',
    'eden-heights': 'How do you convey luxury residential prestige to attract high-net-worth buyers?',
    'landmark-homes': 'How do you instill confidence in investors and showcase development quality?',
    'ghana-optometric-association': 'How do you centralize professional association operations and member communication?',
    'twist-nightclub': 'How do you capture the dynamic energy of nightlife in digital format?',
    'command-space': 'How do you create the perfect business card for a digital agency?',
    'qualivex-solutions': 'How do you build comprehensive digital solutions for growing businesses?',
    'anabs': 'How do you convey luxury high-rise prestige to attract discerning buyers?',
    'kline-designs': 'How do you create a sophisticated digital presence for an innovative design and engineering firm?'
  }
  
  
  return quotes[slug] || projectData?.challenge?.quote || portfolioProject?.theChallenge || 'How do you create something exceptional for this project?'
}

// Comprehensive project-specific content system
const getProjectSpecificContent = (slug: string) => {
  const projectContent: { [key: string]: Record<string, unknown> } = {
    'gwen-addo': {
      challengePoints: [
        'Establishing credibility and expertise in a competitive consulting market',
        'Creating an intuitive booking system that converts visitors into clients', 
        'Designing a professional brand that reflects business strategy expertise',
        'Implementing content structure that showcases value proposition clearly'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of personal branding and client psychology.',
      resultDescription: 'The website successfully elevated Gwen Addo\'s personal brand, positioning her as a leading authority in business strategy. The streamlined booking system has led to an increase in client consultations, and the professional design builds immediate trust with potential clients.',
      focusAreas: ['Personal Branding', 'Lead Generation', 'Professional Credibility', 'Client Conversion']
    },
    'eleven-eleven-ghana': {
      challengePoints: [
        'Capturing the essence of luxury beachfront living through digital design',
        'Creating an immersive experience that drives accommodation bookings',
        'Implementing high-performance media without compromising load times',
        'Establishing premium brand positioning in the competitive hospitality market'
      ],
      resolutionText: 'The solution required more than technology— it demanded an understanding of luxury hospitality and exclusivity.',
      resultDescription: 'The website effectively captures the essence of the Eleven Eleven brand, resulting in increased user engagement and direct beachfront apartment inquiries. It serves as a powerful digital showcase that aligns with the resort\'s luxury positioning.',
      focusAreas: ['Luxury Design', 'Immersive Experience', 'Hospitality Branding', 'Booking Conversion']
    },
    'optimum-property-ghana': {
      challengePoints: [
        'Organizing complex property listings across Ghana and UK markets',
        'Implementing advanced search functionality for diverse user needs',
        'Creating trust and reliability for international property investments',
        'Optimizing lead capture for high-value real estate transactions'
      ],
      resolutionText: 'The solution required more than listings— it demanded an understanding of international property investment psychology.',
      resultDescription: 'The website now serves as an efficient tool for both agents and potential clients. The user-friendly interface has improved the property search experience, leading to a higher number of qualified leads for international property investments.',
      focusAreas: ['Real Estate Technology', 'International Markets', 'Lead Generation', 'Property Management']
    },
    'emmanuel-kotia': {
      challengePoints: [
        'Organizing extensive academic publications into an accessible digital archive',
        'Creating authoritative presentation befitting distinguished career',
        'Ensuring global accessibility for academic and policy research',
        'Implementing intuitive navigation for complex scholarly content'
      ],
      resolutionText: 'The solution required more than organization— it demanded an understanding of academic authority and scholarly presentation.',
      resultDescription: 'The website successfully functions as a comprehensive digital archive of Dr. Kotia\'s distinguished work, enhancing his professional online presence and making his research accessible to a global audience of academics, students, and policymakers.',
      focusAreas: ['Academic Excellence', 'Digital Archiving', 'Scholarly Presentation', 'Global Accessibility']
    },
    'imagebloom-by-saida': {
      challengePoints: [
        'Merging artistic portfolio showcase with e-commerce functionality',
        'Creating premium brand perception for beauty and cosmetic services',
        'Implementing secure payment systems for product sales',
        'Balancing visual appeal with conversion-focused design'
      ],
      resolutionText: 'The solution required more than beauty— it demanded an understanding of luxury cosmetics and client psychology.',
      resultDescription: 'The website provides a complete digital storefront that has empowered the client to sell products directly to consumers, opening up new revenue streams. The beautiful portfolio section continues to attract high-end consultancy clients.',
      focusAreas: ['Beauty & Cosmetics', 'E-commerce Integration', 'Portfolio Showcase', 'Premium Branding']
    },
    'rosemond-prempeh': {
      challengePoints: [
        'Creating a welcoming digital space for faith-based community engagement',
        'Implementing content management for daily devotionals and events',
        'Designing calming aesthetics that reflect spiritual mission',
        'Integrating community features and secure donation systems'
      ],
      resolutionText: 'The solution required more than functionality— it demanded an understanding of faith-based community building.',
      resultDescription: 'The website has become a central hub for the ministry, effectively distributing inspirational content and keeping the community informed about events. It has helped grow the organization\'s digital reach and spiritual impact.',
      focusAreas: ['Faith-Based Design', 'Community Building', 'Content Management', 'Spiritual Engagement']
    },
    'royal-itech': {
      challengePoints: [
        'Projecting security expertise and professional trustworthiness',
        'Creating technical credibility for cybersecurity services',
        'Implementing performance optimization for business applications',
        'Establishing authority in competitive cybersecurity market'
      ],
      resolutionText: 'The solution required more than security— it demanded an understanding of cybersecurity trust and expertise communication.',
      resultDescription: 'The website successfully represents Royal iTech as a credible cybersecurity provider. The platform\'s optimized performance and professional design enhanced user engagement and effectively communicated the company\'s technical expertise.',
      focusAreas: ['Cybersecurity Expertise', 'Professional Trust', 'Technical Performance', 'B2B Credibility']
    },
    'girl-code-africa': {
      challengePoints: [
        'Appealing to multiple audiences: students, sponsors, and industry partners',
        'Creating inspiring pathways for women entering tech industry',
        'Implementing application systems and donation functionality',
        'Building community around empowerment and education mission'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of empowerment and community building.',
      resultDescription: 'The website effectively communicates GirlCode\'s mission and impact. The clear user journeys have led to increased program applications and partner inquiries, helping the organization expand its reach and influence in African tech education.',
      focusAreas: ['Education & Empowerment', 'Community Building', 'Non-Profit Impact', 'Tech Industry Access']
    },
    'ghana-optometry-conference': {
      challengePoints: [
        'Managing comprehensive conference information and logistics',
        'Implementing multi-step registration for professional attendees',
        'Creating interactive schedules and speaker presentations',
        'Streamlining event management and administrative workflows'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of professional conference management.',
      resultDescription: 'The microsite streamlined the registration and information-sharing process, reducing administrative overhead and improving the attendee experience. It served as an effective tool for professional event marketing and management.',
      focusAreas: ['Event Management', 'Professional Registration', 'Conference Logistics', 'Administrative Efficiency']
    },
    'eden-heights': {
      challengePoints: [
        'Conveying prestige and quality of luxury residential development',
        'Showcasing premium properties to attract high-net-worth buyers',
        'Implementing immersive visual experiences and virtual tours',
        'Generating qualified leads for high-value real estate sales'
      ],
      resolutionText: 'The solution required more than visuals— it demanded an understanding of luxury real estate psychology.',
      resultDescription: 'The website successfully positions Eden Heights as a premier residential option in Accra. The immersive visuals and sophisticated presentation have generated significant high-quality sales inquiries from discerning buyers.',
      focusAreas: ['Luxury Real Estate', 'Premium Positioning', 'Visual Storytelling', 'High-Value Sales']
    },
    'landmark-homes': {
      challengePoints: [
        'Serving dual purpose as corporate profile and project showcase',
        'Instilling confidence in investors and potential buyers',
        'Organizing multiple high-end development projects effectively',
        'Creating professional presentation for sales team usage'
      ],
      resolutionText: 'The solution required more than presentation— it demanded an understanding of real estate investment psychology.',
      resultDescription: 'The website professionally represents the Landmark Homes brand and effectively showcases their development quality. It has become a key sales tool for presenting project information to prospective investors and buyers.',
      focusAreas: ['Real Estate Development', 'Investor Relations', 'Project Showcase', 'Corporate Branding']
    },
    'ghana-optometric-association': {
      challengePoints: [
        'Managing comprehensive professional association digital operations',
        'Implementing member-only sections with secure authentication',
        'Serving as authoritative information source for optometry in Ghana',
        'Streamlining administrative tasks and member communication'
      ],
      resolutionText: 'The solution required more than functionality— it demanded an understanding of professional association management.',
      resultDescription: 'The website has centralized the association\'s digital operations, dramatically improving communication with members and the public. The secure portal has streamlined administrative tasks and enhanced member value.',
      focusAreas: ['Professional Association', 'Member Management', 'Industry Authority', 'Digital Operations']
    },
    'twist-nightclub': {
      challengePoints: [
        'Capturing dynamic and energetic nightclub atmosphere digitally',
        'Creating mobile-first experience for on-the-go patrons',
        'Implementing event calendar and social media integration',
        'Encouraging social sharing and community engagement'
      ],
      resolutionText: 'The solution required more than information— it demanded an understanding of nightlife culture and social engagement.',
      resultDescription: 'The website successfully translates the club\'s energetic vibe into digital format, driving event interest and patron engagement. The mobile-optimized photo galleries encourage social sharing and community building.',
      focusAreas: ['Nightlife & Entertainment', 'Mobile-First Design', 'Social Engagement', 'Event Promotion']
    },
    'command-space': {
      challengePoints: [
        'Creating the ultimate business card for a digital marketing agency',
        'Showcasing technical expertise and creative capabilities',
        'Building trust and credibility in competitive digital market',
        'Implementing portfolio showcase that converts prospects to clients'
      ],
      resolutionText: 'The solution required more than presentation— it demanded an understanding of digital agency positioning and client psychology.',
      resultDescription: 'The website serves as Command Space\'s ultimate business card, showcasing their expertise through sleek design and functional excellence. The professional presentation has enhanced their credibility and generated qualified leads.',
      focusAreas: ['Digital Agency Branding', 'B2B Credibility', 'Portfolio Showcase', 'Lead Generation']
    },
    'qualivex-solutions': {
      challengePoints: [
        'Establishing credibility and digital presence for emerging business',
        'Creating professional brand identity from ground up',
        'Communicating business solutions and service offerings clearly',
        'Building trust with potential clients and partners'
      ],
      resolutionText: 'The solution required more than design— it demanded an understanding of business development and market positioning.',
      resultDescription: 'The professional website establishes Qualivex Solutions\' credibility and provides a solid foundation for business growth. The clear presentation of services helps potential clients understand their value proposition.',
      focusAreas: ['Business Development', 'Professional Credibility', 'Market Positioning', 'Service Communication']
    },
    'anabs': {
      challengePoints: [
        'Conveying exclusivity and prestige of luxury high-rise living',
        'Attracting high-net-worth individuals and serious investors',
        'Creating immersive digital experience that matches physical luxury',
        'Building immediate trust and credibility in competitive real estate market'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of luxury real estate psychology and high-end buyer behavior.',
      resultDescription: 'The website successfully positions Anabs Ghana as a premier luxury residential option, attracting qualified high-net-worth prospects and generating significant investment inquiries. The sophisticated presentation has elevated the brand\'s market positioning and enhanced credibility among discerning buyers.',
      focusAreas: ['Luxury Real Estate', 'Premium Positioning', 'High-End Marketing', 'Investor Relations']
    },
    'kline-designs': {
      challengePoints: [
        'Establishing credibility and professional trust for a design and engineering firm',
        'Communicating unique expertise and engineering approaches clearly',
        'Creating a sophisticated digital presence that reflects design excellence',
        'Building brand recognition in Ghana\'s competitive architectural market'
      ],
      resolutionText: 'The solution required more than aesthetics— it demanded an understanding of architectural authority and design excellence.',
      resultDescription: 'The website successfully establishes K_Line Designs LTD as a sophisticated design and engineering firm, showcasing their unique expertise and innovative approaches. The professional presentation builds immediate trust with potential clients and effectively communicates their value proposition in the competitive architectural market.',
      focusAreas: ['Architectural Design', 'Engineering Excellence', 'Professional Credibility', 'Design Innovation']
    }
  }
  
  return projectContent[slug] || null
}

// Get testimonial for specific project  
const getProjectTestimonial = (slug: string) => {
  const testimonialMapping: { [key: string]: number } = {
    'gwen-addo': 1,                        // Gwen Addo
    'eleven-eleven-ghana': 11,             // Curtis (Eleven Eleven)
    'emmanuel-kotia': 6,                   // Dr. Emmanuel Kotia  
    'ghana-optometric-association': 7,     // Dr. Remie
    'rosemond-prempeh': 5,                // Lady RP
    'command-space': 3,                   // Tyrone
    'ghana-optometry-conference': 7,      // Dr. Remie (same as main GOA site)
    'anabs': 12,                    // Boss J. (Anabs)
  }
  
  const testimonialId = testimonialMapping[slug]
  if (!testimonialId) return null
  
  return testimonialData.testimonials.find(t => t.id === testimonialId)
}

// Get project-specific metrics
const getProjectMetrics = (slug: string) => {
  const projectMetrics: { [key: string]: Array<{ label: string; value: string; icon: LucideIcon }> } = {
    'gwen-addo': [
      { value: '200%', label: 'Client Inquiries', icon: TrendingUp },
      { value: '95%', label: 'Conversion Rate', icon: Users },
      { value: '3 wks', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Client Rating', icon: Star }
    ],
    'eleven-eleven-ghana': [
      { value: '150%', label: 'Booking Inquiries', icon: TrendingUp },
      { value: '2.5k', label: 'Monthly Visitors', icon: Users },
      { value: '4 wks', label: 'Timeline', icon: Calendar },
      { value: '4.9', label: 'User Rating', icon: Star }
    ],
    'optimum-property-solutions': [
      { value: '180%', label: 'Property Views', icon: TrendingUp },
      { value: '8.2k', label: 'Active Users', icon: Users },
      { value: '1 mo', label: 'Timeline', icon: Calendar },
      { value: '4.7', label: 'Agent Rating', icon: Star }
    ],
    'emmanuel-kotia': [
      { value: '300%', label: 'Research Access', icon: TrendingUp },
      { value: '15k', label: 'Academic Visits', icon: Users },
      { value: '3 wks', label: 'Timeline', icon: Calendar },
      { value: '4.9', label: 'Academic Rating', icon: Star }
    ],
    'imagebloom-by-saida': [
      { value: '220%', label: 'Sales Growth', icon: TrendingUp },
      { value: '3.8k', label: 'Customers', icon: Users },
      { value: '1 mo', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Customer Rating', icon: Star }
    ],
    'rosemond-prempeh': [
      { value: '160%', label: 'Community Growth', icon: TrendingUp },
      { value: '5.2k', label: 'Members', icon: Users },
      { value: '2 wks', label: 'Timeline', icon: Calendar },
      { value: '4.9', label: 'Ministry Rating', icon: Star }
    ],
    'royal-itech': [
      { value: '250%', label: 'Lead Generation', icon: TrendingUp },
      { value: '1.8k', label: 'Enterprise Visits', icon: Users },
      { value: '3 wks', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Client Trust', icon: Star }
    ],
    'girl-code-africa': [
      { value: '190%', label: 'Applications', icon: TrendingUp },
      { value: '12k', label: 'Community', icon: Users },
      { value: '1 mo', label: 'Timeline', icon: Calendar },
      { value: '4.7', label: 'Impact Rating', icon: Star }
    ],
    'goa-conference': [
      { value: '170%', label: 'Registrations', icon: TrendingUp },
      { value: '800', label: 'Attendees', icon: Users },
      { value: '2 wks', label: 'Timeline', icon: Calendar },
      { value: '4.6', label: 'Event Rating', icon: Star }
    ],
    'eden-heights': [
      { value: '140%', label: 'Buyer Interest', icon: TrendingUp },
      { value: '2.1k', label: 'Property Views', icon: Users },
      { value: '3 wks', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Buyer Rating', icon: Star }
    ],
    'landmark-homes': [
      { value: '165%', label: 'Investor Leads', icon: TrendingUp },
      { value: '3.5k', label: 'Property Views', icon: Users },
      { value: '4 wks', label: 'Timeline', icon: Calendar },
      { value: '4.7', label: 'Investor Trust', icon: Star }
    ],
    'ghana-optometric-association': [
      { value: '210%', label: 'Member Access', icon: TrendingUp },
      { value: '1.2k', label: 'Members', icon: Users },
      { value: '1 mo', label: 'Timeline', icon: Calendar },
      { value: '4.9', label: 'Member Rating', icon: Star }
    ],
    'twist-nightclub': [
      { value: '185%', label: 'Event Interest', icon: TrendingUp },
      { value: '6.8k', label: 'Social Reach', icon: Users },
      { value: '2 wks', label: 'Timeline', icon: Calendar },
      { value: '4.5', label: 'Party Rating', icon: Star }
    ],
    'command-space': [
      { value: '175%', label: 'Client Inquiries', icon: TrendingUp },
      { value: '4.3k', label: 'Agency Visits', icon: Users },
      { value: '3 wks', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Agency Rating', icon: Star }
    ],
    'qualivex-solutions': [
      { value: '155%', label: 'Business Leads', icon: TrendingUp },
      { value: '2.7k', label: 'Client Visits', icon: Users },
      { value: '2 wks', label: 'Timeline', icon: Calendar },
      { value: '4.6', label: 'Business Rating', icon: Star }
    ],
    'anabs': [
      { value: '280%', label: 'Investment Inquiries', icon: TrendingUp },
      { value: '12.5k', label: 'Luxury Views', icon: Users },
      { value: '8 wks', label: 'Timeline', icon: Calendar },
      { value: '4.9', label: 'Buyer Rating', icon: Star }
    ],
    'kline-designs': [
      { value: '195%', label: 'Client Inquiries', icon: TrendingUp },
      { value: '4.2k', label: 'Design Views', icon: Users },
      { value: '5 wks', label: 'Timeline', icon: Calendar },
      { value: '4.8', label: 'Client Rating', icon: Star }
    ]
  }
  
  return projectMetrics[slug] || [
    { value: '150%', label: 'Growth', icon: TrendingUp },
    { value: '5k+', label: 'Users', icon: Users },
    { value: '3 wks', label: 'Timeline', icon: Calendar },
    { value: '4.7', label: 'Rating', icon: Star }
  ];
}

// Eleven Eleven specific data (since it's our template project)
const elevenElevenData = {
  hero: {
    headline: "Eleven Eleven Ghana",
    tagline: "Digital Luxury Redefined",
    description: "A high-end website for Eleven Eleven, a luxury beachfront resort in Ghana where exclusive beachfront apartments are available for purchase, designed to immerse users in the resort lifestyle and drive sales inquiries.",
    client: "11-11 Ghana",
    year: "2023",
    category: "Luxury Real Estate",
    url: "https://www.11-11ghana.com"
  },
  stats: [
    { label: "Sales Inquiries", value: "150%", icon: TrendingUp },
    { label: "User Engagement", value: "+85%", icon: Users },
    { label: "Page Load Time", value: "1.2s", icon: Calendar },
    { label: "Client Rating", value: "5.0", icon: Star }
  ],
  challenge: {
    title: "The Luxury Imperative",
    quote: "How do you digitally replicate the luxurious and exclusive atmosphere of beachfront living?",
    description: "The primary challenge was to digitally replicate the luxurious and exclusive atmosphere of this premium beachfront resort where exclusive beachfront apartments are available for purchase. The website needed to be visually stunning, highly performant, and feature an integrated inquiry system for brochure requests and resort tours.",
    keyPoints: [
      "Capture the essence of luxury resort living online",
      "Seamless inquiry experience for apartment viewings and resort tours",
      "High-performance across all devices",
      "Visual storytelling that converts browsers to prospective apartment buyers"
    ]
  },
  solution: {
    title: "Crafting Digital Luxury",
    description: "I developed a visually-driven website with high-resolution imagery, video backgrounds, and elegant typography. I implemented a seamless inquiry system for brochure requests and tour bookings, ensuring the site was fully responsive to provide an optimal experience on all devices.",
    features: [
      {
        title: "Immersive Visual Experience",
        description: "High-resolution imagery and video backgrounds that transport users to this exclusive beachfront resort"
      },
      {
        title: "Seamless Inquiry Integration",
        description: "Custom inquiry system for apartment brochures, beachfront property viewings, and resort tours"
      },
      {
        title: "Performance Optimization",
        description: "Lightning-fast load times without compromising visual quality"
      },
      {
        title: "Responsive Excellence",
        description: "Flawless experience across desktop, tablet, and mobile devices"
      }
    ]
  },
  result: {
    title: "Luxury Achieved",
    description: "The website effectively captures the essence of the Eleven Eleven brand, resulting in increased user engagement and direct sales inquiries for beachfront apartments. It serves as a powerful digital showcase that aligns with the resort's luxury positioning.",
    achievements: [
      "150% increase in sales inquiries and tour bookings",
      "85% improvement in user engagement metrics", 
      "40% reduction in bounce rate",
      "Recognition as a leading luxury resort website in Ghana"
    ]
  },
  techStack: [
    "Immersive Visual Experience",
    "Seamless Inquiry Integration", 
    "Performance Optimization",
    "Responsive Excellence"
  ]
}

export default function CaseStudyPage() {
  const params = useParams()
  const slug = params.slug as string
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  
  // Contact image for CTA section - no dynamic logic needed
  
  // Always try to get project-specific data first, fallback to eleven-eleven template structure
  const portfolioProject = portfolioData.portfolio.find(p => p.id === slug || p.id === slug.replace(/-/g, '-'))
  const projectData = (slug === 'eleven-eleven-ghana' || slug === 'eleven-eleven') ? elevenElevenData : getProjectData(slug)

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  const getButtonStyles = () => {
    if (theme === 'dark') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#000000',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        hoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        hoverBoxShadow: '0 8px 24px rgba(255, 255, 255, 0.25)'
      }
    } else {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(0, 0, 0, 1)',
        hoverBoxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }
    }
  }

  useEffect(() => {
    if (!preloaderComplete) return
    
    const initAnimations = async () => {
      try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger')
        ])
        
        const gsap = gsapModule.default
        const { ScrollTrigger } = scrollTriggerModule
        
        // Register GSAP plugin on client side only
        if (typeof window !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger)
        }
      
      // Hero image entrance and parallax setup
      if (heroImageRef.current) {
        // Entrance animation - sophisticated reveal
        gsap.fromTo(heroImageRef.current,
          { 
            opacity: 0, 
            y: 60, 
            scale: 0.95 
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.3
          }
        )
        
        // Set initial scale for parallax (after entrance completes)
        gsap.set(heroImageRef.current, { scale: 1.1, delay: 1.8 })
        
        // Parallax effect for hero image
        gsap.to(heroImageRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          delay: 1.8
        })
      }
      
      // Scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
        )
        
        // Continuous bounce animation
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        })
      }
      
      // Content sections animation
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('.animate-section')
        sections.forEach((section) => {
          const elements = section.querySelectorAll('.animate-element')
          
          // Special handling for video showcase section
          if (section.querySelector('.hero-video-container')) {
            // Hero video entrance
            const heroVideo = section.querySelector('.hero-video-container')
            if (heroVideo) {
              gsap.fromTo(heroVideo,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 1.2,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 15%',
                  }
                }
              )
            }
            
            // Floating videos with staggered entrance
            const floatingVideos = section.querySelectorAll('.floating-video')
            gsap.fromTo(floatingVideos,
              { y: 80, opacity: 0, scale: 0.9 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.3,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  end: 'bottom 15%',
                },
                delay: 0.5
              }
            )
          } 
          // Special handling for immersive storytelling section
          else if (false && section.classList.contains('story-section')) {
            // Story Scene Animations - Cinematic Progression
            const storyScenes = section.querySelectorAll('.story-scene')

            storyScenes.forEach((scene) => {
              // Scene 1: Question Animation Only
              if (scene.classList.contains('scene-1')) {
                const question = scene.querySelector('.story-question')
                
                // Question animates immediately when scene enters view
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      gsap.fromTo(question,
                        { y: 100, opacity: 0, scale: 0.9 },
                        { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
                      )
                      
                      observer.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 2: Context Development  
              else if (scene.classList.contains('scene-2')) {
                const context = scene.querySelector('.story-context')
                
                // Scene 2 - no ScrollTriggers
                const observer2 = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      gsap.fromTo(context,
                        { y: 80, opacity: 0 },
                        {
                          y: 0,
                          opacity: 1,
                          duration: 1.8,
                          ease: 'power2.out'
                        }
                      )
                      observer2.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.8 })  // Higher threshold = waits longer before triggering
                
                observer2.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 2: Challenge Points Reveal
              else if (scene.classList.contains('scene-2')) {
                const chapterTitle = scene.querySelector('.story-chapter-title')
                const challengeCards = scene.querySelectorAll('.story-challenge-card')
                
                // Scene 2 - no ScrollTriggers
                const observer2b = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const tl3 = gsap.timeline()
                      
                      tl3.fromTo(chapterTitle,
                        { y: 60, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' }
                      )
                      .fromTo(challengeCards,
                        { y: 120, opacity: 0, scale: 0.8 },
                        { y: 0, opacity: 1, scale: 1, duration: 1.0, stagger: 0.1, ease: 'power3.out' },
                        "-=0.2"  // Starts shortly after heading begins
                      )
                      
                      observer2b.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer2b.observe(scene)
                
                // Background transitions removed - no ScrollTriggers needed
              }
              
              // Scene 4: Cinematic Conclusion
              else if (scene.classList.contains('scene-3')) {
                const resolution = scene.querySelector('.story-resolution')
                const transitionElement = scene.querySelector('.story-transition-element')
                
                // Scene 4 - no ScrollTriggers
                const observer4 = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const tl4 = gsap.timeline()
                      
                      tl4.fromTo(resolution,
                        { y: 80, opacity: 0 },
                        { y: 0, opacity: 1, duration: 2.2, ease: 'power2.out' }
                      )
                      
                      if (transitionElement) {
                        tl4.fromTo(transitionElement,
                          { y: 40, opacity: 0, scale: 0.9 },
                          { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
                          "+=1.0"
                        )
                      }
                      
                      observer4.unobserve(entry.target)
                    }
                  })
                }, { threshold: 0.3 })
                
                observer4.observe(scene)
              }
            })
          }
          // Special handling for luxury card elevation section
          else if (section.querySelector('.vision-main-card')) {
            // Main vision card entrance - dramatic reveal
            const mainCard = section.querySelector('.vision-main-card')
            if (mainCard) {
              gsap.fromTo(mainCard,
                { y: 100, opacity: 0, scale: 0.8, rotationY: -15, rotationX: 15 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotationY: -2,
                  rotationX: 2,
                  duration: 1.8,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 30%',
                  }
                }
              )
            }
            
            // Floating stat cards with sophisticated staggered entrance
            const statCards = section.querySelectorAll('.stat-card')
            statCards.forEach((card, index) => {
              // Each card has unique entrance timing and direction
              const directions = [
                { x: -80, y: -60 }, // top-left
                { x: 80, y: -80 },  // top-right  
                { x: -60, y: 80 },  // bottom-left
                { x: 60, y: 60 }    // bottom-right
              ]
              
              gsap.fromTo(card,
                { 
                  x: directions[index].x,
                  y: directions[index].y,
                  opacity: 0, 
                  scale: 0.7,
                  rotation: index % 2 === 0 ? -10 : 10
                },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotation: index % 2 === 0 ? -3 + (index * 1) : 2 - (index * 0.5),
                  duration: 1.4,
                  ease: 'back.out(1.4)',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    end: 'bottom 25%',
                  },
                  delay: 0.3 + (index * 0.15) // Staggered timing
                }
              )
              
              // Continuous subtle floating animation
              gsap.to(card, {
                y: index % 2 === 0 ? -8 : 8,
                duration: 3 + (index * 0.5),
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.5
              })
            })
            
            // Mobile stats cards animation
            const mobileStatCards = section.querySelectorAll('.stat-card-mobile')
            gsap.fromTo(mobileStatCards,
              { y: 40, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 80%',
                  end: 'bottom 20%',
                },
                delay: 1.2 // After main card animation
              }
            )
          } else {
            // Standard section animation
            gsap.fromTo(elements,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 85%',
                  end: 'bottom 15%',
                }
              }
            )
          }
        })
      }
      
      // Standard section animations will handle the new CTA section
      } catch (error) {
        console.warn('GSAP failed to load:', error)
      }
    }
    
    initAnimations()
    
    return () => {
      const cleanup = async () => {
        try {
          const { ScrollTrigger } = await import('gsap/ScrollTrigger')
          ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        } catch (error) {
          // Ignore cleanup errors if GSAP didn't load
          console.warn('ScrollTrigger cleanup failed:', error)
        }
      }
      cleanup()
    }
  }, [preloaderComplete])


  // Prevent graphic design projects from having slug pages
  const websiteProjectSlugs = [
    'gwen-addo', 'eleven-eleven-ghana', 'optimum-property-solutions', 'emmanuel-kotia',
    'imagebloom-by-saida', 'rosemond-prempeh', 'royal-itech', 'girl-code-africa',
    'goa-conference', 'eden-heights', 'landmark-homes', 'ghana-optometric-association',
    'twist-nightclub', 'command-space', 'qualivex-solutions', 'anabs', 'kline-designs'
  ];

  if (!websiteProjectSlugs.includes(slug)) {
    notFound()
  }

  if (!projectData && !portfolioProject) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-24 flex items-center justify-center bg-background-primary">
          <div className="text-center">
            <h1 className="text-4xl font-satoshi font-bold text-text-primary mb-4">
              Project Not Found
            </h1>
            <Link href="/portfolio" className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const displayData = (slug === 'eleven-eleven-ghana' || slug === 'eleven-eleven') ? elevenElevenData : {
    hero: {
      headline: portfolioProject?.title || (projectData as Record<string, string>)?.title || 'Project Title',
      tagline: portfolioProject?.category || (projectData as Record<string, string>)?.category || 'Web Development',
      description: portfolioProject?.description || (projectData as Record<string, string>)?.description || '',
      client: portfolioProject?.client || (projectData as Record<string, string>)?.client || '',
      year: getProjectYear(slug, portfolioProject, projectData),
      category: portfolioProject?.category || (projectData as Record<string, string>)?.category || '',
      url: portfolioProject?.url || (projectData as Record<string, string>)?.url || ''
    }
  }

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader 
          pageName={displayData.hero.headline} 
          onComplete={handlePreloaderComplete} 
        />
      )}
      
      <div style={{ opacity: preloaderComplete ? 1 : 0 }}>
        <style jsx>{`
          @media (max-width: 639px) {
            .mobile-question-style {
              font-size: 26px !important;
              font-weight: 500 !important;
            }
            .resolution-text {
              font-size: 20px !important;
            }
          }
          @media (min-width: 640px) {
            .resolution-text {
              font-size: 25px !important;
            }
          }
        `}</style>
        <Navigation preloaderComplete={preloaderComplete} />

        {/* Hero Section - Project Overview */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-start bg-background-primary pt-32 md:pt-24 pb-16 md:pb-0">
          <div className="max-w-[90vw] mx-auto px-6 w-full">
            {/* Project Title */}
            <div className="text-left mb-16 animate-element">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-satoshi font-light text-text-primary" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                {displayData.hero.headline}
              </h1>
            </div>

            {/* Project Details Grid */}
            <div className="grid md:grid-cols-3 gap-12 md:gap-16 animate-element relative">
              {/* Client */}
              <div>
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  CLIENT
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium">
                  {displayData.hero.client}
                </p>
              </div>

              {/* Category */}
              <div>
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  CATEGORY
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium">
                  {displayData.hero.category}
                </p>
              </div>

              {/* Location & Year */}
              <div className="relative">
                <p className="text-text-tertiary text-xs font-satoshi font-normal mb-6" style={{ letterSpacing: '0.08em' }}>
                  LOCATION & YEAR
                </p>
                <div className="h-px mb-8" style={{ width: '7.5rem', backgroundColor: 'currentColor', opacity: 0.3 }}></div>
                <p className="text-text-primary font-satoshi text-lg font-medium mb-6">
                  Ghana © {displayData.hero.year}
                </p>
                
                {/* Live Site Button */}
                {displayData.hero.url && (
                  <div className="absolute -right-4 -bottom-4 md:right-0 md:bottom-0 z-10">
                    <a
                      href={displayData.hero.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center text-center text-base md:text-lg font-satoshi font-medium whitespace-nowrap rounded-full backdrop-blur-sm border transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 active:scale-98"
                      style={{
                        backgroundColor: getButtonStyles().backgroundColor,
                        color: getButtonStyles().color,
                        borderColor: getButtonStyles().borderColor,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1
                      }}
                      onMouseEnter={(e) => {
                        const styles = getButtonStyles()
                        e.currentTarget.style.backgroundColor = styles.hoverBackgroundColor
                        e.currentTarget.style.boxShadow = styles.hoverBoxShadow
                        e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        const styles = getButtonStyles()
                        e.currentTarget.style.backgroundColor = styles.backgroundColor
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                        e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      }}
                    >
                      Live site ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="animate-section pt-4 pb-2 md:pt-6 md:pb-3 bg-background-primary">
          <div className="w-full md:w-[70vw] mx-auto px-6 md:px-0">
            <div 
              ref={heroImageRef}
              className="relative w-full h-[600px] rounded-2xl overflow-hidden group cursor-pointer animate-element portfolio-hero-container"
              style={{
                opacity: 0,
                transform: 'translateY(60px) scale(0.95)'
              }}
            >
              {/* Gradient overlays for luxury hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/4 z-10 rounded-2xl portfolio-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/3 group-hover:to-text-primary/6 z-10 rounded-2xl portfolio-overlay"></div>
              
              <Image
                src={getProjectHeroImage(slug)}
                alt={(projectData as Record<string, string>)?.title || portfolioProject?.title || "Portfolio Project"}
                fill
                className="object-cover portfolio-hero-image"
                priority
                quality={95}
              />
            </div>
          </div>
        </section>


        {/* Case Study Content */}
        <div ref={contentRef} className="bg-background-primary">
          
          {/* Challenge Section - Rebuilt */}
          <section className="animate-section bg-background-primary pt-12 pb-4 md:pt-24 md:pb-12 relative">
            <div className="max-w-6xl mx-auto px-6">
              
              {/* Challenge Question */}
              <div className="text-center mb-16 md:mb-20">
                <blockquote className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-satoshi font-light text-text-primary animate-element mb-20 md:mb-24"
                            style={{ lineHeight: '1.3', letterSpacing: '0.01em' }}>
                  &quot;{getProjectChallengeQuote(slug, projectData, portfolioProject)}&quot;
                </blockquote>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-satoshi font-medium text-text-primary animate-element"
                    style={{ letterSpacing: '0.06em' }}>
                  THE CHALLENGES
                </h2>
              </div>

              {/* Challenge Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {(() => {
                  // Get project-specific challenge points
                  const specificContent = getProjectSpecificContent(slug)
                  let challengePoints: string[] = [];
                  
                  // Priority order: specific content > portfolio data > project data > generic fallback
                  if (specificContent?.challengePoints && Array.isArray(specificContent.challengePoints)) {
                    challengePoints = specificContent.challengePoints as string[];
                  } else if ((projectData as Record<string, Record<string, string[]>>)?.challenge?.keyPoints) {
                    challengePoints = (projectData as Record<string, Record<string, string[]>>).challenge.keyPoints;
                  } else if ((portfolioProject as unknown as Record<string, string[]>)?.challengePoints) {
                    challengePoints = (portfolioProject as unknown as Record<string, string[]>).challengePoints;
                  } else {
                    // Generic fallback (should rarely be used now)
                    challengePoints = [
                      'Creating an intuitive and engaging user experience',
                      'Implementing responsive design across all devices',
                      'Optimizing performance and loading speeds',
                      'Establishing a strong visual identity and brand presence'
                    ];
                  }
                  
                  return challengePoints.map((point: string, index: number) => (
                    <div 
                      key={index} 
                      className="animate-element challenge-card group h-full"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        opacity: 1 // Ensure visible by default
                      }}
                    >
                      <div className="relative h-full cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                        {/* Background layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-text-primary/5 to-text-primary/10 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-all duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 rounded-2xl transition-all duration-700"></div>
                        
                        {/* Card content */}
                        <div 
                          className="relative p-8 md:p-10 rounded-2xl backdrop-blur-lg border border-text-primary/15 group-hover:border-text-primary/30 transition-all duration-700 h-full flex flex-col"
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {/* Challenge number */}
                          <div className="flex items-center mb-6 md:mb-8">
                            <div className="relative">
                              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-text-primary/40 group-hover:border-accent/60 flex items-center justify-center mr-4 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                                <span className="text-text-primary group-hover:text-accent font-satoshi font-light text-lg md:text-xl transition-colors duration-700">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <div className="absolute inset-0 rounded-full bg-text-primary/10 group-hover:bg-accent/20 transition-colors duration-700"></div>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-text-primary/30 via-text-primary/10 to-transparent group-hover:from-accent/40 group-hover:via-accent/20 transition-colors duration-700"></div>
                          </div>

                          {/* Challenge text */}
                          <p className="text-text-primary font-inter leading-relaxed text-lg md:text-xl flex-1 transition-all duration-700 group-hover:translate-x-1">
                            {point}
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Resolution Bridge */}
              <div className="text-center mt-20 md:mt-32 animate-element">
                {(() => {
                  const specificContent = getProjectSpecificContent(slug)
                  const resolutionText: string = (specificContent?.resolutionText as string) || 
                    'The solution required more than technology— it demanded an understanding of luxury itself.'
                  
                  // Split text intelligently for better formatting
                  const textParts = resolutionText.split('—')
                  if (textParts.length === 2) {
                    return (
                      <p className="text-xl md:text-2xl lg:text-3xl font-satoshi text-text-primary leading-relaxed max-w-4xl mx-auto" 
                         style={{ letterSpacing: '0.01em', fontWeight: '450' }}>
                        {textParts[0].trim()}—
                        <br className="hidden sm:block" />
                        <span className="text-text-secondary">{textParts[1].trim()}</span>
                      </p>
                    )
                  }
                  
                  return (
                    <p className="text-xl md:text-2xl lg:text-3xl font-satoshi text-text-primary leading-relaxed max-w-4xl mx-auto" 
                       style={{ letterSpacing: '0.01em', fontWeight: '450' }}>
                      {resolutionText}
                    </p>
                  )
                })()}
                
                {/* Transition element */}
                <div className="mt-8">
                  <div className="w-2 h-24 md:h-32 bg-gradient-to-b from-text-primary via-text-primary/50 to-transparent mx-auto opacity-60"></div>
                  <div className="mt-2">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-text-primary to-transparent mx-auto"></div>
                  </div>
                </div>
              </div>
              
            </div>
          </section>

          {/* Video Showcase Section */}
          {((projectData as { video?: string })?.video || (portfolioProject as { video?: string })?.video) && (
            <section className="animate-section bg-background-secondary relative z-10" style={{ paddingTop: '8px', paddingBottom: '32px' }}>
              <div className="animate-element hero-video-container">
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                  <div className="group">
                    <div className="relative overflow-hidden bg-text-primary/5 aspect-[16/10]">
                      <video 
                        id="project-video"
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        loop
                        poster={(projectData as Record<string, Record<string, string>>)?.video?.poster || `/images/${slug}.jpg`}
                      >
                        <source src={(projectData as Record<string, Record<string, string>>)?.video?.src || `/images/${slug}-showcase.webm`} type="video/webm" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* The Result - Luxury Card Elevation */}
          {(projectData || portfolioProject) && (
            <section 
              className="animate-section bg-background-secondary relative pt-4 pb-14 md:pt-16 md:pb-60 z-20"
            >
              <div className="max-w-7xl mx-auto px-6 w-full">
                
                {/* Main Result Card - Elevated Center */}
                <div className="relative z-25 animate-element vision-main-card">
                  <div 
                    className="max-w-2xl mx-auto text-center p-12 md:p-16 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: `
                        0 25px 50px rgba(0, 0, 0, 0.25),
                        0 15px 35px rgba(0, 0, 0, 0.15),
                        0 5px 15px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                      `,
                      transform: 'rotateY(-2deg) rotateX(2deg)'
                    }}
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-satoshi font-extralight text-text-primary mb-8" 
                        style={{ lineHeight: '1.1', letterSpacing: '0.05em' }}>
                      The Result
                    </h2>
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 font-inter font-light">
                      {(() => {
                        const specificContent = getProjectSpecificContent(slug)
                        const result = (specificContent?.resultDescription as string) || 
                               (projectData as { results?: { description?: string } })?.results?.description || 
                               portfolioProject?.mySolution || 
                               'I developed a comprehensive solution that exceeded expectations, combining modern design principles with technical excellence to create an outstanding user experience.'
                        return result as string
                      })()}
                    </p>
                    
                    {/* Tech Stack - Minimalist Display */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                      {(() => {
                        // Prioritize portfolio.json tech stack data over generic fallback
                        const techStack = portfolioProject?.techStack || 
                                         (projectData as Record<string, string[]>)?.techStack || 
                                         ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Figma']
                        return techStack;
                      })().map((tech: string, index: number) => (
                        <span key={index} 
                              className="px-4 py-2 text-sm font-satoshi text-text-secondary border rounded-full"
                              style={{ 
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                background: 'rgba(255, 255, 255, 0.05)'
                              }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Cards - Floating Around Main Card (Desktop Only) */}
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                  
                  {/* Stat Card 1 - Top Left */}
                  <div 
                    className="absolute top-16 left-4 md:left-12 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(-3deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 15px 30px rgba(0, 0, 0, 0.2),
                          0 8px 20px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[0]?.value) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[0]?.value || '150%';
                        })()}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[0]?.label) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[0]?.label || 'Engagement';
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 2 - Top Right */}
                  <div 
                    className="absolute top-20 right-4 md:right-16 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(2deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 20px 40px rgba(0, 0, 0, 0.22),
                          0 10px 25px rgba(0, 0, 0, 0.14),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[1]?.value) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[1]?.value || '12k+';
                        })()}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[1]?.label) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[1]?.label || 'Users';
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 3 - Bottom Left */}
                  <div 
                    className="absolute bottom-16 left-8 md:left-20 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(1deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 12px 25px rgba(0, 0, 0, 0.18),
                          0 6px 15px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[2]?.value) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[2]?.value || '3 wks';
                        })()}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[2]?.label) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[2]?.label || 'Timeline';
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 4 - Bottom Right */}
                  <div 
                    className="absolute bottom-20 right-8 md:right-24 z-30 animate-element stat-card pointer-events-auto"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <div 
                      className="p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          0 10px 20px rgba(0, 0, 0, 0.15),
                          0 4px 10px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        minWidth: '160px'
                      }}
                    >
                      <div className="mb-3">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-satoshi font-light text-text-primary mb-2">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[3]?.value) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[3]?.value || '4.7';
                        })()}
                      </div>
                      <div className="text-text-secondary text-xs md:text-sm font-satoshi uppercase tracking-wider">
                        {((projectData as { stats?: Array<{value: string, label: string}> })?.stats?.[3]?.label) || (() => {
                          const projectMetrics = getProjectMetrics(slug);
                          return projectMetrics[3]?.label || 'Rating';
                        })()}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Mobile-Only: Single Column Stats Cards */}
              <div className="md:hidden mt-20">
                <div className="flex flex-col space-y-8 px-6 max-w-md mx-auto">
                  {((projectData as { stats?: Array<{value: string, label: string, icon?: LucideIcon}> })?.stats || getProjectMetrics(slug)).map((stat: {value: string, label: string, icon?: LucideIcon}, index: number) => (
                    <div key={index} 
                         className="animate-element stat-card-mobile">
                      <div 
                        className="w-full p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 text-center group cursor-pointer transform hover:scale-[1.02] hover:-translate-y-2 active:scale-[1.02] active:-translate-y-2"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: `
                            0 12px 25px rgba(0, 0, 0, 0.18),
                            0 6px 15px rgba(0, 0, 0, 0.12),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `,
                        }}
                      >
                        {/* Gradient overlays for touch interaction */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent/5 group-active:from-accent/10 group-active:to-accent/5 transition-all duration-500 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/5 group-hover:to-text-primary/10 group-active:from-text-primary/5 group-active:to-text-primary/10 transition-all duration-500 rounded-2xl"></div>
                        
                        {/* Content with relative positioning */}
                        <div className="relative z-10">
                          <div className="mb-4">
                            {stat.icon && <stat.icon className="w-10 h-10 text-text-primary group-hover:text-accent group-active:text-accent mx-auto transition-colors duration-500" />}
                          </div>
                          <div className="text-3xl font-satoshi font-light text-text-primary mb-2">
                            {stat.value}
                          </div>
                          <div className="text-text-secondary text-sm font-satoshi uppercase tracking-wider">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          )}


          {/* Client Testimonial Section */}
          {(() => {
            const testimonial = getProjectTestimonial(slug)
            if (!testimonial) return null
            
            return (
              <section className="animate-section bg-background-secondary py-16 md:py-24 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  
                  {/* Section Header */}
                  <div className="mb-12 md:mb-16 animate-element">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-satoshi font-medium text-text-primary mb-4"
                        style={{ letterSpacing: '0.06em' }}>
                      CLIENT TESTIMONIAL
                    </h2>
                    <div className="w-16 h-px bg-text-primary/30 mx-auto"></div>
                  </div>

                  {/* Testimonial Card */}
                  <div className="animate-element">
                    <div 
                      className="relative p-8 md:p-12 rounded-2xl backdrop-blur-lg border border-text-primary/15 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: `
                          0 25px 50px rgba(0, 0, 0, 0.15),
                          0 15px 35px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 0.08)
                        `
                      }}
                    >
                      {/* Decorative Quote Mark */}
                      <div 
                        className="absolute -top-4 -left-2 text-text-primary/8 font-serif"
                        style={{ 
                          fontSize: '70px',
                          lineHeight: '1',
                          fontWeight: '300'
                        }}
                      >
                        &quot;
                      </div>

                      {/* Quote Text */}
                      <blockquote 
                        className="font-satoshi italic text-text-primary leading-relaxed mb-8 relative z-10"
                        style={{
                          fontSize: '20px',
                          fontWeight: '300',
                          letterSpacing: '0.025em',
                          lineHeight: '1.65'
                        }}
                      >
                        {testimonial.quote}
                      </blockquote>

                      {/* Attribution */}
                      <div className="relative z-10">
                        <cite className="not-italic">
                          <div 
                            className="font-satoshi text-text-primary mb-1"
                            style={{
                              fontSize: '16px',
                              fontWeight: '500',
                              letterSpacing: '0.01em'
                            }}
                          >
                            {testimonial.clientName}
                          </div>
                          {testimonial.clientInfo && (
                            <div 
                              className="font-satoshi text-text-secondary"
                              style={{
                                fontSize: '14px',
                                fontWeight: '300',
                                letterSpacing: '0.02em',
                                opacity: '0.8'
                              }}
                            >
                              {testimonial.clientInfo}
                            </div>
                          )}
                        </cite>
                      </div>

                      {/* Subtle gradient overlay for depth */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)'
                        }}
                      />
                    </div>
                  </div>

                </div>
              </section>
            )
          })()}

          {/* Option 1: Integrated Navigation CTA */}
          <section className="animate-section bg-background-primary py-16 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Left: Project CTA */}
                <div className="space-y-8 animate-element text-left md:text-left">
                  <h2 className="text-4xl md:text-5xl font-satoshi font-light text-text-primary text-center md:text-left" style={{ lineHeight: '1.2', letterSpacing: '0.02em' }}>
                    Ready for your
                    <span className="block font-medium">next project?</span>
                  </h2>
                  <p className="text-text-secondary text-lg md:text-xl font-inter leading-relaxed text-center md:text-left">
                    Let&apos;s create something extraordinary together.
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <GlassCTA href="/contact" variant={theme === 'dark' ? 'white' : 'light'}>
                      Let&apos;s work together
                    </GlassCTA>
                  </div>
                </div>
                
                {/* Right: Portfolio CTA Image */}
                <div className="animate-element">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-text-primary/5 group relative portfolio-cta-container">
                    {/* Gradient overlays for luxury hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/4 z-10 rounded-xl portfolio-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/3 group-hover:to-text-primary/6 z-10 rounded-xl portfolio-overlay"></div>
                    
                    <Image
                      src="/images/about-hero.jpg"
                      alt="Let's work together"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover portfolio-cta-image"
                      quality={90}
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </section>
        </div>
        
        <PortfolioFooter currentSlug={slug} />
      </div>
    </>
  )
}