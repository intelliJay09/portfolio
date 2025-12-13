/**
 * Authority Building & Link Acquisition Strategy
 * Strategic approach to building domain authority and quality backlinks
 */

export interface LinkOpportunity {
  source: string
  type: 'guest post' | 'directory' | 'partnership' | 'resource' | 'testimonial' | 'press'
  authority: 'high' | 'medium' | 'low'
  relevance: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  priority: number // 1-10
  approach: string
  expectedDA: number // Domain Authority score
}

export interface ContentAsset {
  title: string
  type: 'infographic' | 'study' | 'tool' | 'guide' | 'template' | 'video'
  targetAudience: string[]
  linkPotential: 'high' | 'medium' | 'low'
  distributionChannels: string[]
}

/**
 * High-value link building opportunities
 */
export const linkOpportunities: LinkOpportunity[] = [
  // High Authority Ghana/Africa Publications
  {
    source: 'Business & Financial Times Ghana',
    type: 'guest post',
    authority: 'high',
    relevance: 'high',
    effort: 'medium',
    priority: 9,
    approach: 'Pitch article on "Digital Transformation for Ghana Luxury Brands"',
    expectedDA: 45
  },
  {
    source: 'Graphic Online (graphic.com.gh)',
    type: 'press',
    authority: 'high',
    relevance: 'medium',
    effort: 'high',
    priority: 8,
    approach: 'Press release about launching luxury web services or notable client project',
    expectedDA: 50
  },
  {
    source: 'MyJoyOnline.com',
    type: 'guest post',
    authority: 'high',
    relevance: 'medium',
    effort: 'medium',
    priority: 7,
    approach: 'Technology column on web development trends in Ghana',
    expectedDA: 55
  },
  {
    source: 'Ghana Web (ghanaweb.com)',
    type: 'press',
    authority: 'high',
    relevance: 'medium',
    effort: 'medium',
    priority: 8,
    approach: 'Business profile or success story feature',
    expectedDA: 60
  },
  
  // Tech & Development Communities
  {
    source: 'Dev.to',
    type: 'guest post',
    authority: 'high',
    relevance: 'high',
    effort: 'low',
    priority: 10,
    approach: 'Technical tutorials on React/Next.js luxury web development',
    expectedDA: 80
  },
  {
    source: 'Medium - Better Programming',
    type: 'guest post',
    authority: 'high',
    relevance: 'high',
    effort: 'low',
    priority: 9,
    approach: 'Case studies on building luxury web experiences',
    expectedDA: 95
  },
  {
    source: 'Hashnode',
    type: 'guest post',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 8,
    approach: 'Series on luxury web development best practices',
    expectedDA: 75
  },
  {
    source: 'CSS-Tricks',
    type: 'guest post',
    authority: 'high',
    relevance: 'high',
    effort: 'high',
    priority: 9,
    approach: 'Advanced CSS techniques for luxury websites',
    expectedDA: 85
  },
  
  // Business Directories
  {
    source: 'Clutch.co',
    type: 'directory',
    authority: 'high',
    relevance: 'high',
    effort: 'medium',
    priority: 10,
    approach: 'Create verified agency profile with portfolio',
    expectedDA: 90
  },
  {
    source: 'GoodFirms',
    type: 'directory',
    authority: 'high',
    relevance: 'high',
    effort: 'medium',
    priority: 9,
    approach: 'List as top web developer in Ghana',
    expectedDA: 85
  },
  {
    source: 'DesignRush',
    type: 'directory',
    authority: 'high',
    relevance: 'high',
    effort: 'low',
    priority: 8,
    approach: 'Submit to luxury web design companies list',
    expectedDA: 80
  },
  
  // Ghana Business Directories
  {
    source: 'Ghana Yellow Pages',
    type: 'directory',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 7,
    approach: 'Premium business listing with portfolio',
    expectedDA: 35
  },
  {
    source: 'Ghana Companies Directory',
    type: 'directory',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 6,
    approach: 'Verified business profile',
    expectedDA: 30
  },
  
  // Industry Partnerships
  {
    source: 'Ghana Tech Companies Association',
    type: 'partnership',
    authority: 'medium',
    relevance: 'high',
    effort: 'medium',
    priority: 8,
    approach: 'Become member and contribute to newsletter',
    expectedDA: 40
  },
  {
    source: 'Women in Tech Ghana',
    type: 'partnership',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 9,
    approach: 'Speaker at events, contribute to blog',
    expectedDA: 35
  },
  {
    source: 'GirlCode Africa',
    type: 'partnership',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 9,
    approach: 'Leverage existing relationship for testimonials and features',
    expectedDA: 40
  },
  
  // Client Testimonials
  {
    source: 'Client Websites (Portfolio)',
    type: 'testimonial',
    authority: 'medium',
    relevance: 'high',
    effort: 'low',
    priority: 10,
    approach: 'Request footer credits and testimonial pages from all clients',
    expectedDA: 20-50
  },
  
  // Resource Link Building
  {
    source: 'University Resources (Ghana Tech Universities)',
    type: 'resource',
    authority: 'high',
    relevance: 'medium',
    effort: 'medium',
    priority: 7,
    approach: 'Alumni profile, guest lectures, resource contributions',
    expectedDA: 50-60
  },
  {
    source: 'Awwwards / CSS Design Awards',
    type: 'resource',
    authority: 'high',
    relevance: 'high',
    effort: 'high',
    priority: 8,
    approach: 'Submit best portfolio projects for awards',
    expectedDA: 85-90
  }
]

/**
 * Linkable content assets to create
 */
export const linkableAssets: ContentAsset[] = [
  {
    title: 'Ghana Web Development Salary & Pricing Guide 2025',
    type: 'guide',
    targetAudience: ['Business owners', 'Developers', 'Agencies'],
    linkPotential: 'high',
    distributionChannels: ['Ghana tech blogs', 'LinkedIn', 'Industry forums']
  },
  {
    title: 'Luxury Website Design Checklist (Free Template)',
    type: 'template',
    targetAudience: ['Designers', 'Brand managers', 'Business owners'],
    linkPotential: 'high',
    distributionChannels: ['Design communities', 'GitHub', 'Product Hunt']
  },
  {
    title: 'State of Luxury Web Design in Africa 2025 (Research)',
    type: 'study',
    targetAudience: ['Industry professionals', 'Investors', 'Media'],
    linkPotential: 'high',
    distributionChannels: ['Press release', 'Industry publications', 'LinkedIn']
  },
  {
    title: 'Website Performance Calculator for Ghana Businesses',
    type: 'tool',
    targetAudience: ['Business owners', 'Marketers', 'Developers'],
    linkPotential: 'high',
    distributionChannels: ['Product Hunt', 'Tech blogs', 'Social media']
  },
  {
    title: 'Evolution of Web Design in Ghana (Infographic)',
    type: 'infographic',
    targetAudience: ['General public', 'Tech community', 'Media'],
    linkPotential: 'medium',
    distributionChannels: ['Social media', 'Design galleries', 'Press']
  },
  {
    title: 'Luxury E-commerce Conversion Optimization Masterclass',
    type: 'video',
    targetAudience: ['E-commerce managers', 'Developers', 'Marketers'],
    linkPotential: 'medium',
    distributionChannels: ['YouTube', 'LinkedIn', 'Online courses platforms']
  }
]

/**
 * HARO (Help a Reporter Out) & Press Opportunities
 */
export const pressOpportunities = {
  platforms: [
    'HARO (helpareporter.com)',
    'SourceBottle',
    'ProfNet',
    'ResponseSource',
    'JournoRequests (#journorequest on Twitter)'
  ],
  topics: [
    'Web development trends',
    'Women in tech',
    'African tech industry',
    'Luxury brand digital strategies',
    'E-commerce in emerging markets',
    'Small business digitalization'
  ],
  credentials: [
    'Luxury web developer with 5+ years experience',
    'Female tech entrepreneur in Ghana',
    'Expert in React/Next.js development',
    'Specialist in luxury brand digital transformation',
    'Ghana Technology University College graduate'
  ]
}

/**
 * Strategic partnerships for link building
 */
export const strategicPartnerships = {
  complementaryServices: [
    {
      type: 'Digital Marketing Agencies',
      value: 'Mutual referrals and guest posts',
      examples: ['SEO agencies', 'Social media agencies', 'Content marketers']
    },
    {
      type: 'Graphic Design Studios',
      value: 'Portfolio collaborations and cross-linking',
      examples: ['Brand design agencies', 'UI/UX studios', 'Creative agencies']
    },
    {
      type: 'Business Consultants',
      value: 'Client referrals and resource sharing',
      examples: ['Strategy consultants', 'Digital transformation advisors']
    },
    {
      type: 'Photography Studios',
      value: 'Content collaboration for luxury brands',
      examples: ['Product photographers', 'Brand photographers']
    }
  ],
  industryAssociations: [
    'Ghana Chamber of Commerce',
    'Association of Ghana Industries',
    'Ghana Investment Promotion Centre',
    'Tech Companies Association of Ghana',
    'Women Entrepreneurs Association Ghana'
  ],
  educationalInstitutions: [
    'Ghana Technology University College',
    'IPMC Ghana',
    'University of Ghana Business School',
    'Ashesi University',
    'KNUST School of Business'
  ]
}

/**
 * Content syndication strategy
 */
export const syndicationStrategy = {
  platforms: [
    {
      name: 'LinkedIn Articles',
      canonical: true,
      audience: 'B2B professionals',
      frequency: 'Weekly'
    },
    {
      name: 'Medium',
      canonical: true,
      audience: 'Tech community',
      frequency: 'Bi-weekly'
    },
    {
      name: 'Dev.to',
      canonical: true,
      audience: 'Developers',
      frequency: 'Weekly'
    },
    {
      name: 'Business Ghana',
      canonical: false,
      audience: 'Local businesses',
      frequency: 'Monthly'
    }
  ],
  repurposing: [
    'Blog post → LinkedIn article → Twitter thread',
    'Case study → Video → Podcast interview',
    'Tutorial → YouTube video → Instagram carousel',
    'Infographic → Pinterest → LinkedIn post'
  ]
}

/**
 * Competitor backlink opportunities
 */
export const competitorBacklinks = {
  analysisTools: [
    'Ahrefs (analyze competitor backlinks)',
    'SEMrush (find link gaps)',
    'Moz Link Explorer (domain authority check)',
    'Ubersuggest (free alternative)',
    'Google Search Console (your own links)'
  ],
  commonSources: [
    'Local business directories',
    'Industry association member pages',
    'Alumni directories',
    'Event speaker pages',
    'Guest post author bios',
    'Portfolio showcase sites',
    'Award winner lists'
  ]
}

/**
 * Link outreach templates
 */
export const outreachTemplates = {
  guestPost: `
Subject: Luxury Web Development Insights for [Publication Name] Readers

Dear [Editor Name],

I'm Jacqueline Amoako, a luxury web developer based in Accra, Ghana, specializing in creating premium digital experiences for high-end brands.

I've been following [Publication Name] and particularly enjoyed your recent article on [specific article]. I'd love to contribute a piece that would provide value to your readers:

Proposed Topic: "[Article Title]"
- Key insight 1
- Key insight 2
- Key insight 3

My credentials:
- 5+ years developing luxury websites for brands like Eleven Eleven Ghana and Anabs
- Featured instructor at GirlCode Africa
- Graduate of Ghana Technology University College

Would this be of interest? I can provide a detailed outline and samples of my writing.

Best regards,
Jacqueline Amoako
https://jacquelineamoako.com
  `,
  
  brokenLink: `
Subject: Quick Fix for Your [Page Topic] Resource Page

Hi [Name],

I was researching luxury web development resources and came across your excellent guide at [URL]. 

I noticed one of the links to [Broken Resource] appears to be broken (returns a 404).

I recently published a comprehensive guide on [Related Topic] that might be a good replacement:
[Your URL]

It covers:
- [Key point 1]
- [Key point 2]
- [Key point 3]

Feel free to use it if you think it would help your readers!

Best,
Jacqueline
  `,
  
  resourceAddition: `
Subject: Resource Suggestion for [Page Name]

Dear [Name],

Your [Page Name] resource list is fantastic - it's one of the most comprehensive I've found on [topic].

I wanted to suggest a resource that your readers might find valuable:

[Your Resource Title]
[URL]

This [guide/tool/template] helps [specific benefit]. It's already being used by [credibility indicator].

Would you consider adding it to your list?

Thanks for maintaining such a valuable resource!

Warm regards,
Jacqueline Amoako
Luxury Web Developer
  `
}

/**
 * Monthly link building tasks
 */
export const monthlyLinkTasks = [
  'Submit 2 guest posts to high-authority sites',
  'Create 1 linkable asset (tool/guide/template)',
  'Reach out to 5 broken link opportunities',
  'Update 3 business directory listings',
  'Request testimonial links from 2 clients',
  'Participate in 1 HARO query',
  'Syndicate 4 articles to LinkedIn/Medium',
  'Comment on 10 relevant industry blogs',
  'Share 2 case studies with industry publications',
  'Network at 1 local tech/business event'
]