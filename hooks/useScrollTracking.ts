import { useEffect, useRef } from 'react';
import { trackScrollDepth, trackTimeOnPage } from '@/utils/analytics';

export const useScrollTracking = () => {
  const trackedDepths = useRef(new Set<number>());
  const startTime = useRef(Date.now());
  const timeIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Track time on page every 30 seconds
    timeIntervalRef.current = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(timeSpent);
    }, 30000);

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track at 25%, 50%, 75%, and 100% intervals
      const depthMilestones = [25, 50, 75, 100];

      depthMilestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Throttle scroll event
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);

    // Track initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearInterval(timeIntervalRef.current);

      // Track final time on page when component unmounts
      const finalTimeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(finalTimeSpent);
    };
  }, []);
};

export default useScrollTracking;
