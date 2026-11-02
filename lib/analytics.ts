/**
 * Analytics event tracking.
 *
 * Every event goes to the Google Tag Manager dataLayer and nowhere else. GTM
 * delivers GA4 (and any future tag), so the site never talks to gtag directly
 * and an event is never counted twice.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const pushEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...params,
  };

  // GTM's snippet creates the dataLayer before any of this runs; creating it
  // here as well means an event fired early is queued, not lost.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', event, payload);
  }
};

/**
 * Track button/CTA clicks
 */
export const trackButtonClick = (buttonName: string, additionalData?: Record<string, unknown>) =>
  pushEvent('button_click', { button_name: buttonName, ...additionalData });

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, additionalData?: Record<string, unknown>) =>
  pushEvent('form_submit', { form_name: formName, ...additionalData });

/**
 * Track portfolio project views
 */
export const trackProjectView = (
  projectName: string,
  projectCategory: string,
  additionalData?: Record<string, unknown>
) =>
  pushEvent('view_portfolio_project', {
    project_name: projectName,
    project_category: projectCategory,
    ...additionalData,
  });

/**
 * Track external link clicks
 */
export const trackExternalLink = (linkUrl: string, linkText?: string) =>
  pushEvent('click_external_link', { link_url: linkUrl, link_text: linkText || linkUrl });

/**
 * Track video plays (for your teaching video)
 */
export const trackVideoPlay = (videoName: string, additionalData?: Record<string, unknown>) =>
  pushEvent('video_play', { video_name: videoName, ...additionalData });

/**
 * Track scroll depth milestones
 */
export const trackScrollDepth = (percentage: number) =>
  pushEvent('scroll_depth', { scroll_depth: percentage });

/**
 * Track navigation clicks
 */
export const trackNavigationClick = (destinationPage: string, linkText: string) =>
  pushEvent('navigation_click', { destination: destinationPage, link_text: linkText });

/**
 * Track contact method selection (email, LinkedIn, etc.)
 */
export const trackContactMethod = (method: string, destination: string) =>
  pushEvent('contact_method_click', { contact_method: method, destination });
