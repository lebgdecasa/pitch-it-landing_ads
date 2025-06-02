import React, { useState, useEffect, useRef } from 'react';
import useTranslation from '@/hooks/useTranslation';

interface OptimizedWaitlistCounterProps {
  className?: string;
  showLabel?: boolean;
  initialCount?: number;
}

const OptimizedWaitlistCounter = ({
  className = '',
  showLabel = true,
  initialCount = 250
}: OptimizedWaitlistCounterProps) => {
  const t = useTranslation();
  const [count, setCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded) {
          setHasLoaded(true);
          fetchCount();
        }
      },
      { threshold: 0.1 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [hasLoaded]);

  const fetchCount = async () => {
    if (loading) return; // Prevent duplicate requests

    try {
      setLoading(true);
      const response = await fetch('/api/waitlist-count', {
        headers: {
          'Cache-Control': 'max-age=300', // Cache for 5 minutes
        },
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      if (data.success) {
        setCount(data.roundedCount || data.count);
      }
    } catch (error) {
      console.error('Failed to fetch waitlist count:', error);
      // Keep the initial/fallback count on error
    } finally {
      setLoading(false);
    }
  };

  // Show initial count immediately, no loading state for better UX
  return (
    <div ref={componentRef} className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-3xl font-bold text-blue-600 transition-opacity duration-300 ${loading ? 'opacity-75' : 'opacity-100'}`}>
        {count}+
      </span>
      {showLabel && (
        <span className="text-gray-600">
          {t('waitlist_counter_label')}
        </span>
      )}
    </div>
  );
};

export default OptimizedWaitlistCounter;
