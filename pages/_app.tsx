import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { LanguageProvider } from '@/context/LanguageContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import * as analytics from '@/utils/analytics';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = (url: string) => {
      analytics.pageview(url);
    };

    // Track initial page view
    analytics.pageview(window.location.pathname);

    // Get and store UTM parameters on initial load
    analytics.getUTMParams();

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    // Add Inter font link
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  // Track Web Vitals
  useEffect(() => {
    const reportWebVitals = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

          onCLS(analytics.trackWebVitals);
          onINP(analytics.trackWebVitals);
          onFCP(analytics.trackWebVitals);
          onLCP(analytics.trackWebVitals);
          onTTFB(analytics.trackWebVitals);
        } catch (error) {
          console.log('Web Vitals not supported');
        }
      }
    };

    reportWebVitals();
  }, []);

  return (
    <>
      <GoogleAnalytics />
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </>
  );
}

export default MyApp;
