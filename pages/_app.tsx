import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { LanguageProvider } from '@/context/LanguageContext';
import LazyGoogleAnalytics from '@/components/LazyGoogleAnalytics';
import OptimizedAnalytics from '@/components/OptimizedAnalytics';
import ResourcePrefetcher from '@/components/ResourcePrefetcher';
import Modal from '@/components/ui/Modal';
import DemoModal from '@/components/modals/DemoModal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';

import { AuthProvider } from '@/supa_database/components/AuthProvider';
import AuthModal from '@/supa_database/components/AuthModal';


function MyApp({ Component, pageProps }: AppProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Function to open the authentication modal
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openDemoModal = () => setIsDemoModalOpen(true);
  const closeDemoModal = () => setIsDemoModalOpen(false);

  const openWaitlistModal = () => setIsWaitlistModalOpen(true);
  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);

  const enhancedPageProps = {
    ...pageProps,
    openDemoModal,
    openWaitlistModal,
    openAuthModal,
  };

  return (
    <>
      <Head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to speed up external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

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
      <AuthProvider>
      <LanguageProvider>
        <Component {...enhancedPageProps} />
        {/* Wrap DemoModal and WaitlistModal with the Modal component */}
        {isDemoModalOpen && (
          <Modal isOpen={isDemoModalOpen} onClose={closeDemoModal} maxWidth="max-w-2xl">
            <DemoModal onClose={closeDemoModal} />
          </Modal>
        )}
        {isWaitlistModalOpen && (
          <Modal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal}>
            <WaitlistModal onClose={closeWaitlistModal} />
          </Modal>
        )}
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      </LanguageProvider>
    </AuthProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
