import { useState, useEffect, useRef, MutableRefObject } from 'react';

// Return type for useFadeInOnScroll hook
type FadeInHookReturn = [MutableRefObject<HTMLElement | null>, boolean];

export const useFadeInOnScroll = (): FadeInHookReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: unobserve after animation
          // observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible];
};

export default useFadeInOnScroll;
