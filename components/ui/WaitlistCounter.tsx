import React, { useState, useEffect } from 'react';
import useTranslation from '@/hooks/useTranslation';

interface WaitlistCounterProps {
  className?: string;
  showLabel?: boolean;
}

const WaitlistCounter = ({ className = '', showLabel = true }: WaitlistCounterProps) => {
  const t = useTranslation();
  const [count, setCount] = useState<number>(250);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/waitlist-count');
        const data = await response.json();
        if (data.success) {
          setCount(data.roundedCount || data.count);
        }
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
    // Refresh count every 5 minutes
    const interval = setInterval(fetchCount, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-3xl font-bold text-blue-600">
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

export default WaitlistCounter;
