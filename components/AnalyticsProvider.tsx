import { useEffect } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import Hotjar from '@hotjar/browser';

const posthogId = process.env.NEXT_PUBLIC_POSTHOG_ID || '';
const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID ? parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID) : 0;
const hotjarSv = process.env.NEXT_PUBLIC_HOTJAR_SV ? parseInt(process.env.NEXT_PUBLIC_HOTJAR_SV) : 0;


export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (posthogId) {
      posthog.init(posthogId, {
        api_host: 'https://app.posthog.com',
        autocapture: true,
        capture_pageview: false,
      });
    }

    if (hotjarId && hotjarSv) {
      Hotjar.init(hotjarId, hotjarSv);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (posthogId) {
        posthog.capture('$pageview', { url });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <>{children}</>;
};
