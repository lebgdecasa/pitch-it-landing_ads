import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { LanguageProvider } from '@/context/LanguageContext';
import '@/styles/globals.css';
import Layout from '@/components/layout/Layout'; // Import the Layout component

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Add Inter font link
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  // Dummy onOpenDemoModal function for now, replace with actual implementation if needed
  const handleOpenDemoModal = () => {
    console.log('Open demo modal');
  };

  return (
    <LanguageProvider>
      <Layout onOpenDemoModal={handleOpenDemoModal}>
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  );
}

export default MyApp;
