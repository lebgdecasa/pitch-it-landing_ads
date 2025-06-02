import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as analytics from '@/utils/analytics';

const OptimizedAnalytics: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Delay analytics initialization to improve TTFB
    const initAnalytics = () => {
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
    };

    // Delay analytics initialization by 2 seconds to prioritize critical content
    const analyticsTimer = setTimeout(initAnalytics, 2000);

    return () => {
      clearTimeout(analyticsTimer);
    };
  }, [router.events]);

  // Track Web Vitals with further delay
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

    // Delay Web Vitals tracking by 3 seconds
    const webVitalsTimer = setTimeout(reportWebVitals, 3000);

    return () => {
      clearTimeout(webVitalsTimer);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default OptimizedAnalytics;
