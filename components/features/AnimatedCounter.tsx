import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  /** The final number the counter should animate to. */
  targetValue: number;
  /** An optional string to append after the number (e.g., "%", "+"). Defaults to empty string. */
  suffix?: string;
  /** The total duration of the animation in milliseconds. Defaults to 2000ms. */
  duration?: number;
  /** A descriptive label displayed below the counter. */
  label: string;
}

/**
 * AnimatedCounter displays a number that animates from 0 to a target value
 * when the component becomes visible in the viewport.
 * It uses IntersectionObserver to trigger the animation.
 *
 * @param {AnimatedCounterProps} props - The props for the AnimatedCounter component.
 * @returns {JSX.Element} A div element containing the animated number and label.
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  suffix = '',
  duration = 2000, // Default animation duration: 2 seconds
  label,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null); // Ref for the component's root element for IntersectionObserver
  const [isVisible, setIsVisible] = useState(false); // State to track if the component is in viewport

  // Effect for IntersectionObserver setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the component is intersecting with the viewport
        if (entry.isIntersecting) {
          setIsVisible(true); // Trigger animation
          observer.unobserve(entry.target); // Stop observing once it's visible to save resources
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    // Start observing the component's root element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup function to unobserve when the component unmounts
    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current); // Exhaustive deps check disabled as ref.current is stable
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect for handling the counting animation
  useEffect(() => {
    // Only start animation if the component is visible
    if (!isVisible) return;

    let start = 0;
    // Calculate the increment per step for a smooth animation over the specified duration.
    // The animation updates roughly every 50ms (20 times per second).
    const increment = targetValue / (duration / 50);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue); // Ensure it ends exactly on targetValue
        clearInterval(timer);  // Stop the interval
      } else {
        // Handle integer and floating-point numbers appropriately.
        if (Number.isInteger(targetValue) && Number.isInteger(increment)) {
          setCount(Math.ceil(start)); // Use Math.ceil for integers to avoid premature stopping
        } else {
          // For floating point numbers, maintain precision.
          // If suffix is '%' and target is < 1 (e.g. 0.84), use 2 decimal places. Otherwise, 0.
          const precision = (suffix.includes('%') || suffix.includes('.')) && Math.abs(targetValue) < 1 && targetValue !== 0 ? 2 : (targetValue % 1 !== 0 ? 2 : 0) ;
          setCount(parseFloat(start.toFixed(precision)));
        }
      }
    }, 50); // Interval duration for animation steps

    // Cleanup function to clear interval if component unmounts or dependencies change
    return () => clearInterval(timer);
  }, [isVisible, targetValue, duration, suffix]); // Rerun effect if these dependencies change

  // TODO: DATA: Performance stats are currently static. Confirm if these need to be dynamic.
  // If dynamic, `targetValue`, `suffix`, and `label` would be fetched.

  return (
    // Container for the counter: text centered, padding, light gray background, rounded, shadow.
    // p-6 (24px), rounded-lg (8px), mt-2 (8px) - Adheres to 8pt spacing system.
    <div ref={ref} className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Animated number: large, bold, blue text. */}
      <p className="text-4xl md:text-5xl font-bold text-blue-600">
        {/* Format number with locale-specific separators and appropriate fraction digits */}
        {count.toLocaleString(undefined, {
          minimumFractionDigits: targetValue % 1 !== 0 ? ( (suffix.includes('%') || suffix.includes('.')) && Math.abs(targetValue) < 1 && targetValue !== 0 ? 2 : 0 ) : 0,
          maximumFractionDigits: targetValue % 1 !== 0 ? ( (suffix.includes('%') || suffix.includes('.')) && Math.abs(targetValue) < 1 && targetValue !== 0 ? 2 : 2 ) : 0,
        })}
        {suffix}
      </p>
      {/* Label text below the number. */}
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
};

export default AnimatedCounter;
