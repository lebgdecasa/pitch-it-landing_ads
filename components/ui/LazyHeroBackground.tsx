import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the heavy Three.js component with no SSR
const HeroBackground = dynamic(() => import('./HeroBackground'), {
  ssr: false,
  loading: () => (
    <div
      className="hidden md:block"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(26, 86, 219, 0.1) 0%, rgba(26, 86, 219, 0.05) 100%)',
      }}
    />
  ),
});

const LazyHeroBackground: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the Three.js component until after initial page load
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100); // Load after 100ms to allow critical content first

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything on server-side or until we decide to load
  if (!shouldLoad) {
    return (
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(26, 86, 219, 0.1) 0%, rgba(26, 86, 219, 0.05) 100%)',
        }}
      />
    );
  }

  return <HeroBackground />;
};

export default LazyHeroBackground;
