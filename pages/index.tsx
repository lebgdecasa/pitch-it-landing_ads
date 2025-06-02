import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import WhyPitchItSection from '@/components/sections/WhyPitchItSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import MoreThanToolSection from '@/components/sections/MoreThanToolSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import Modal from '@/components/ui/Modal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import DemoModal from '@/components/modals/DemoModal';
import useScrollTracking from '@/hooks/useScrollTracking';
import { trackButtonClick } from '@/utils/analytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface HomeProps {
  generatedAt?: string;
}

export default function Home({ generatedAt }: HomeProps) {
  const { t } = useTranslation('common');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Initialize scroll tracking
  useScrollTracking();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWaitlistModalOpen(false);
        setIsDemoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const openWaitlistModal = (source: string = 'unknown') => {
    trackButtonClick('waitlist_modal_open', source);
    setIsWaitlistModalOpen(true);
  };

  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);

  const openDemoModal = (source: string = 'unknown') => {
    trackButtonClick('demo_modal_open', source);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => setIsDemoModalOpen(false);

  return (
    <>
      <Head>
        <title>NexTraction | AI-Powered Pitch Deck Platform</title>
        <meta name="description" content="NexTraction is the AI platform that transforms your ideas into impactful presentations, validates your concepts, and prepares you to convince investors." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout onOpenDemoModal={() => openDemoModal('header')}>
        <HeroSection
          onOpenWaitlistModal={() => openWaitlistModal('hero')}
          onOpenDemoModal={() => openDemoModal('hero')}
        />

        <WhyPitchItSection />

        <FeaturesSection onOpenDemoModal={() => openDemoModal('features')} />
        <MoreThanToolSection />

        <FinalCTASection
          onOpenWaitlistModal={() => openWaitlistModal('final_cta')}
          onOpenDemoModal={() => openDemoModal('final_cta')}
        />
      </Layout>

      <Modal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal}>
        <WaitlistModal onClose={closeWaitlistModal} />
      </Modal>

      <Modal isOpen={isDemoModalOpen} onClose={closeDemoModal} maxWidth="max-w-2xl">
        <DemoModal onClose={closeDemoModal} />
      </Modal>
    </>
  );
}

// Static generation for optimal TTFB performance
export async function getStaticProps({ locale }: { locale: string }) {
  try {
    // Pre-fetch any data that's needed for the page
    // This could include waitlist count, testimonials, etc.

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        // Add any pre-fetched data here
        generatedAt: new Date().toISOString(),
      },
      // Incremental Static Regeneration: regenerate page every 5 minutes
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        generatedAt: new Date().toISOString(),
      },
      revalidate: 300,
    };
  }
}
