/**
 * Google Analytics Event Tracking Utilities
 *
 * Provides type-safe methods for tracking user interactions across the website.
 * Works with both Google Analytics 4 (gtag.js) and Google Tag Manager.
 */

// Declare gtag global function
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track button/CTA clicks
 */
export const trackButtonClick = (buttonName: string, additionalData?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    button_name: buttonName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...additionalData,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'button_click', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'button_click',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: button_click', eventData);
  }
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, additionalData?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    form_name: formName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...additionalData,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'form_submit', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'form_submit',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: form_submit', eventData);
  }
};

/**
 * Track portfolio project views
 */
export const trackProjectView = (projectName: string, projectCategory: string, additionalData?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    project_name: projectName,
    project_category: projectCategory,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...additionalData,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'view_portfolio_project', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'view_portfolio_project',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: view_portfolio_project', eventData);
  }
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (linkUrl: string, linkText?: string) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    link_url: linkUrl,
    link_text: linkText || linkUrl,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'click_external_link', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'click_external_link',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: click_external_link', eventData);
  }
};

/**
 * Track video plays (for your teaching video)
 */
export const trackVideoPlay = (videoName: string, additionalData?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    video_name: videoName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...additionalData,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'video_play', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'video_play',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: video_play', eventData);
  }
};

/**
 * Track scroll depth milestones
 */
export const trackScrollDepth = (percentage: number) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    scroll_depth: percentage,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'scroll_depth', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'scroll_depth',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: scroll_depth', eventData);
  }
};

/**
 * Track navigation clicks
 */
export const trackNavigationClick = (destinationPage: string, linkText: string) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    destination: destinationPage,
    link_text: linkText,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'navigation_click', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'navigation_click',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: navigation_click', eventData);
  }
};

/**
 * Track contact method selection (email, LinkedIn, etc.)
 */
export const trackContactMethod = (method: string, destination: string) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    contact_method: method,
    destination,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'contact_method_click', eventData);
  }

  // Send to Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'contact_method_click',
      ...eventData,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics: contact_method_click', eventData);
  }
};
