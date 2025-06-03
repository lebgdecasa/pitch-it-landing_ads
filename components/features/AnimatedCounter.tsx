import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
  arrow?: 'up' | 'down'; // New prop
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  arrow,
  prefix = '',
  suffix = '',
  label,
  duration = 2000,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounter = () => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = startValue + (targetValue - startValue) * easeOutQuart;

      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const formatValue = (value: number) => {
    if (targetValue < 1) {
      return (value * 100).toFixed(0);
    }
    return Math.floor(value).toString();
  };

  return (
    <div ref={counterRef} className="text-center group">
      <div className="relative">
        {/* Animated Background Circle */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>

        {/* Counter Display */}
        <div className="relative z-10 py-8">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2">
            <span className="inline-block">
              {prefix}{formatValue(currentValue)}
              <span className="text-yellow-300">{suffix}</span>
            </span>
            {arrow === 'up' && (
              <svg className="w-6 h-6 text-green-400 inline-block animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 4l6 6H4l6-6z" />
              </svg>
            )}
            {arrow === 'down' && (
              <svg className="w-6 h-6 text-pink-400 inline-block animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 16l-6-6h12l-6 6z" />
              </svg>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-28 h-1.5 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(currentValue / targetValue) * 100}%` }}
            ></div>
          </div>

          {/* Label */}
          <p className="text-blue-100 text-sm md:text-base font-medium group-hover:text-white transition-colors duration-300">
            {label}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-70 group-hover:scale-125 transition-transform duration-300"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full opacity-70 group-hover:scale-125 transition-transform duration-300"></div>
      </div>
    </div>
  );
};

export default AnimatedCounter;
