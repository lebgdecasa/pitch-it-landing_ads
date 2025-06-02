import { useEffect } from 'react';

const ResourcePrefetcher: React.FC = () => {
  useEffect(() => {
    // Prefetch critical API endpoints after initial load
    const prefetchResources = () => {
      // Prefetch waitlist count API
      if ('fetch' in window) {
        fetch('/api/waitlist-count', {
          method: 'GET',
          headers: {
            'Cache-Control': 'max-age=300',
          },
        }).catch(() => {
          // Silently fail - this is just prefetching
        });
      }

      // Prefetch other critical resources
      const criticalImages = [
        '/images/logo_pitchit.png',
        '/images/analysis.png',
        '/images/deck_editor.png',
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Delay prefetching to not interfere with critical loading
    const timer = setTimeout(prefetchResources, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default ResourcePrefetcher;
