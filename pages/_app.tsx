import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { LanguageProvider } from '@/context/LanguageContext';
import LazyGoogleAnalytics from '@/components/LazyGoogleAnalytics';
import OptimizedAnalytics from '@/components/OptimizedAnalytics';
import ResourcePrefetcher from '@/components/ResourcePrefetcher';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to speed up external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Load critical fonts with swap for better performance */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: 'Inter', sans-serif; }
            .font-inter { font-family: 'Inter', sans-serif; }
          `
        }} />
      </Head>

      <LazyGoogleAnalytics />
      <OptimizedAnalytics />
      <ResourcePrefetcher />
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </>
  );
}

export default MyApp;
