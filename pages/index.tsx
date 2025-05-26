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

export default function Home() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [currentCtaId, setCurrentCtaId] = useState<string>('unknown_trigger');

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

  const openWaitlistModal = (ctaId: string = 'unknown_trigger') => {
    trackButtonClick('waitlist_modal_open', ctaId); // Existing tracking, ctaId is the source
    setCurrentCtaId(ctaId);
    setIsWaitlistModalOpen(true);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    setCurrentCtaId('unknown_trigger'); // Reset on close
  };

  const openDemoModal = (ctaId: string = 'unknown_trigger') => {
    trackButtonClick('demo_modal_open', ctaId); // Existing tracking, ctaId is the source
    setCurrentCtaId(ctaId);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setIsDemoModalOpen(false);
    setCurrentCtaId('unknown_trigger'); // Reset on close
  };

  return (
    <>
      <Head>
        <title>Pitch-it | AI-Powered Pitch Deck Platform</title>
        <meta name="description" content="Pitch-it is the AI platform that transforms your ideas into impactful presentations, validates your concepts, and prepares you to convince investors." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout onOpenDemoModal={() => openDemoModal('header_demo_cta')}>
        <HeroSection
          onOpenWaitlistModal={() => openWaitlistModal('hero_join_waitlist')}
          onOpenDemoModal={() => openDemoModal('hero_request_demo')}
        />

        <WhyPitchItSection />

        <FeaturesSection onOpenDemoModal={() => openDemoModal('features_request_demo')} />
        <MoreThanToolSection />
  
        <FinalCTASection
          onOpenWaitlistModal={() => openWaitlistModal('final_cta_waitlist')}
          onOpenDemoModal={() => openDemoModal('final_cta_demo')}
        />
      </Layout>

      <Modal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal}>
        <WaitlistModal onClose={closeWaitlistModal} triggerCtaId={currentCtaId} />
      </Modal>

      <Modal isOpen={isDemoModalOpen} onClose={closeDemoModal} maxWidth="max-w-2xl">
        <DemoModal onClose={closeDemoModal} triggerCtaId={currentCtaId} />
      </Modal>
    </>
  );
}
