// Analytics utility for tracking events across the application
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// GA4 Measurement ID - Replace with your actual ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event tracking functions
export const trackFormSubmission = (formType: 'waitlist' | 'demo', success: boolean) => {
  event({
    action: 'form_submission',
    category: 'engagement',
    label: `${formType}_${success ? 'success' : 'failure'}`,
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'engagement',
    label: `${buttonName}_${location}`,
  });
};

export const trackFeatureInterest = (featureName: string) => {
  event({
    action: 'feature_view',
    category: 'interest',
    label: featureName,
  });
};

export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  });
};

export const trackLanguageChange = (language: string) => {
  event({
    action: 'language_change',
    category: 'preferences',
    label: language,
  });
};

// UTM parameter handling
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || '',
  };

  // Store UTM params in sessionStorage
  if (utm.source || utm.medium || utm.campaign) {
    sessionStorage.setItem('utm_params', JSON.stringify(utm));
  }

  return utm;
};

export const getStoredUTMParams = () => {
  if (typeof window === 'undefined') return {};

  const stored = sessionStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : {};
};

// Track conversion with attribution
export const trackConversion = (type: 'waitlist' | 'demo', email: string) => {
  const utmParams = getStoredUTMParams();

  event({
    action: 'conversion',
    category: type,
    label: email,
    value: type === 'demo' ? 100 : 50, // Higher value for demo requests
  });

  // Also send UTM data
  if (utmParams.source) {
    event({
      action: 'conversion_attribution',
      category: type,
      label: `${utmParams.source}_${utmParams.medium}_${utmParams.campaign}`,
    });
  }
};

// Performance tracking
export const trackWebVitals = ({ name, value }: { name: string; value: number }) => {
  event({
    action: 'web_vitals',
    category: 'performance',
    label: name,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
  });
};
