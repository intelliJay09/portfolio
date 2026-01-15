# Google Analytics Event Tracking Guide

## Overview

Your portfolio website now has comprehensive Google Analytics 4 (GA4) event tracking integrated. This guide explains what's being tracked and how to use the tracking functions.

---

## What's Being Tracked

### 1. **Button Clicks (CTA Components)**
All CTA buttons throughout your site can now track clicks automatically.

**Tracked CTA Components:**
- `GlassCTA`
- `TransparentCTA`
- `DarkTransparentCTA`
- `LightTransparentCTA`

**Data Captured:**
- Button name
- Button type (which CTA component)
- Destination URL
- Current page location
- Variant (for GlassCTA)

### 2. **Contact Form Submissions**
Tracks when visitors successfully submit the contact form.

**Data Captured:**
- Form name ("Contact Form")
- Service selected
- Whether organization was provided
- Page location

### 3. **Portfolio Project Views**
Tracks when visitors view individual project case studies.

**Data Captured:**
- Project name
- Project category
- Project slug
- Client name
- Project year

### 4. **Contact Method Clicks**
Tracks when visitors click on email or other contact methods.

**Data Captured:**
- Contact method (email, phone, etc.)
- Destination address
- Page location

---

## How to Use Tracking in Your Components

### Adding Tracking to CTA Buttons

Simply add the `trackingName` prop to any CTA component:

```tsx
// Example: Hero CTA
<GlassCTA
  href="/contact"
  variant="auto"
  trackingName="Hero Contact CTA"
>
  Get In Touch
</GlassCTA>

// Example: Portfolio CTA
<TransparentCTA
  href="/portfolio"
  trackingName="View Portfolio CTA"
>
  Explore Work
</TransparentCTA>

// Example: Footer CTA
<DarkTransparentCTA
  href="/about"
  trackingName="Learn More CTA"
>
  About Me
</DarkTransparentCTA>
```

### Manually Tracking Custom Events

Import the tracking functions where needed:

```tsx
import {
  trackButtonClick,
  trackFormSubmit,
  trackProjectView,
  trackExternalLink,
  trackVideoPlay,
  trackNavigationClick,
  trackContactMethod
} from '@/lib/analytics'

// Track a button click
const handleClick = () => {
  trackButtonClick('Custom Button Name', {
    additional_data: 'value'
  })
}

// Track external link
<a
  href="https://linkedin.com/in/yourprofile"
  onClick={() => trackExternalLink('https://linkedin.com/in/yourprofile', 'LinkedIn Profile')}
>
  Connect on LinkedIn
</a>

// Track video play
<video
  onPlay={() => trackVideoPlay('Teaching Video', { duration: '2:30' })}
>
  ...
</video>

// Track navigation
<Link
  href="/portfolio"
  onClick={() => trackNavigationClick('/portfolio', 'Main Nav Portfolio')}
>
  Portfolio
</Link>
```

---

## Available Tracking Functions

### `trackButtonClick(buttonName, additionalData?)`
Tracks button/CTA interactions.
```typescript
trackButtonClick('Download Resume', {
  file_type: 'PDF',
  file_size: '2MB'
})
```

### `trackFormSubmit(formName, additionalData?)`
Tracks form submissions.
```typescript
trackFormSubmit('Newsletter Signup', {
  subscription_type: 'weekly'
})
```

### `trackProjectView(projectName, projectCategory, additionalData?)`
Tracks portfolio project views.
```typescript
trackProjectView('Eleven Eleven Ghana', 'Websites', {
  project_slug: 'eleven-eleven-ghana',
  client: '11-11 Ghana'
})
```

### `trackExternalLink(linkUrl, linkText?)`
Tracks clicks on external links.
```typescript
trackExternalLink('https://github.com/yourname', 'GitHub Profile')
```

### `trackVideoPlay(videoName, additionalData?)`
Tracks video play events.
```typescript
trackVideoPlay('GirlCode Teaching Session', {
  video_duration: '5:30',
  video_type: 'teaching'
})
```

### `trackScrollDepth(percentage)`
Tracks scroll milestones.
```typescript
// Typically called in a scroll event listener
trackScrollDepth(75) // User scrolled 75%
```

### `trackNavigationClick(destinationPage, linkText)`
Tracks navigation menu clicks.
```typescript
trackNavigationClick('/services', 'Services Link')
```

### `trackContactMethod(method, destination)`
Tracks contact method selections.
```typescript
trackContactMethod('phone', '+233-XX-XXX-XXXX')
trackContactMethod('email', 'hello@jacquelineamoako.com')
```

---

## Viewing Analytics Data

### In Google Analytics 4

1. **Real-Time Events**
   - Go to **Reports** → **Real-time**
   - See live events as they happen
   - Test your tracking immediately

2. **Custom Events Report**
   - Go to **Reports** → **Engagement** → **Events**
   - View all custom events:
     - `button_click`
     - `form_submit`
     - `view_portfolio_project`
     - `click_external_link`
     - `video_play`
     - `navigation_click`
     - `contact_method_click`

3. **Event Parameters**
   - Click on any event
   - View detailed parameters like:
     - button_name
     - page_location
     - project_name
     - service selected
     - etc.

### In Google Tag Manager

All events are also pushed to the `dataLayer`, making them available in GTM:

```javascript
// Example dataLayer push
window.dataLayer.push({
  event: 'button_click',
  button_name: 'Contact CTA',
  destination: '/contact',
  page_location: 'https://jacquelineamoako.com/'
})
```

You can create triggers and tags based on these events in GTM.

---

## Common Use Cases

### Track Hero Section CTAs
```tsx
<GlassCTA
  href="/contact"
  trackingName="Hero Primary CTA"
>
  Start Your Project
</GlassCTA>
```

### Track Portfolio Grid Clicks
```tsx
<Link
  href={`/portfolio/${project.slug}`}
  onClick={() => trackButtonClick('Portfolio Project Card', {
    project_name: project.title,
    project_category: project.category
  })}
>
  {project.title}
</Link>
```

### Track Service Selection
```tsx
<button
  onClick={() => {
    setSelectedService('custom-web-development')
    trackButtonClick('Service Selection', {
      service: 'custom-web-development'
    })
  }}
>
  Custom Web Development
</button>
```

### Track Social Media Links
```tsx
<a
  href="https://linkedin.com/in/jacqueline-amoako"
  target="_blank"
  onClick={() => trackExternalLink(
    'https://linkedin.com/in/jacqueline-amoako',
    'LinkedIn Footer'
  )}
>
  LinkedIn
</a>
```

---

## Development vs Production

### Development Mode
- All events are logged to browser console with 📊 emoji
- Format: `📊 Analytics: event_name { data }`
- Helps verify tracking is working correctly

### Production Mode
- Events sent to Google Analytics and GTM
- No console logs (clean user experience)
- Full data captured in GA4 dashboard

---

## Best Practices

### 1. **Consistent Naming**
Use clear, descriptive names:
- ✅ `"Hero Primary CTA"`
- ✅ `"Footer Contact Email"`
- ❌ `"Button 1"`
- ❌ `"Click"`

### 2. **Include Context**
Add location context to similar buttons:
- `"Hero Contact CTA"`
- `"Footer Contact CTA"`
- `"Portfolio Contact CTA"`

### 3. **Track Key Conversions**
Focus on actions that matter:
- Form submissions
- Project views
- External link clicks
- Service selections
- Download button clicks

### 4. **Avoid Over-Tracking**
Don't track every single interaction:
- ❌ Hover events
- ❌ Mouse movements
- ❌ Every scroll pixel
- ✅ Meaningful user actions

---

## Debugging

### Check if gtag is loaded
```javascript
// Open browser console
window.gtag
// Should show function

window.dataLayer
// Should show array
```

### Test event tracking
```javascript
// Open browser console, run:
window.gtag('event', 'test_event', {
  test_param: 'test_value'
})

// Check Real-Time reports in GA4
```

### Verify dataLayer
```javascript
// Open browser console
console.log(window.dataLayer)

// Should show array of events
```

---

## Custom Event Examples for Your Site

### Track Teaching Video Interaction
```tsx
<video
  src="/videos/teaching.mp4"
  onPlay={() => trackVideoPlay('GirlCode Teaching', {
    location: 'homepage_teaser'
  })}
/>
```

### Track Portfolio Filtering
```tsx
<button
  onClick={() => {
    filterByCategory('websites')
    trackButtonClick('Portfolio Filter', {
      category: 'websites'
    })
  }}
>
  Websites
</button>
```

### Track Theme Toggle
```tsx
<button
  onClick={() => {
    toggleTheme()
    trackButtonClick('Theme Toggle', {
      from_theme: theme,
      to_theme: theme === 'dark' ? 'light' : 'dark'
    })
  }}
>
  Toggle Theme
</button>
```

---

## Troubleshooting

### Events not showing in GA4
1. Check browser console for gtag errors
2. Verify GA4 measurement ID is correct
3. Wait 24-48 hours for full reporting (real-time works immediately)
4. Check if ad blockers are enabled

### TypeScript errors
All tracking functions accept `Record<string, unknown>` for additional data:
```typescript
trackButtonClick('Button', {
  custom_field: 'value', // ✅ Works
  number_field: 123,     // ✅ Works
  boolean_field: true    // ✅ Works
})
```

### GTM events not firing
1. Check GTM preview mode
2. Verify container is published
3. Check dataLayer in console
4. Ensure triggers are configured correctly

---

## Next Steps

1. **Add tracking to key CTAs** throughout your site
2. **Monitor Real-Time reports** in GA4 to verify tracking
3. **Create custom reports** in GA4 for key metrics
4. **Set up conversion goals** for form submissions and project views
5. **Use GTM** to add additional tracking (Facebook Pixel, LinkedIn Insight Tag, etc.)

---

## Support

For more advanced tracking needs or questions:
- Google Analytics 4 Documentation: https://support.google.com/analytics
- GTM Documentation: https://support.google.com/tagmanager
- Next.js Analytics: https://nextjs.org/docs/app/building-your-application/optimizing/analytics

---

**Your analytics tracking is now live and capturing valuable insights! 🎉**
