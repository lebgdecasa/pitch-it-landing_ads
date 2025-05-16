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

export default function Home() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

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

  const openWaitlistModal = () => setIsWaitlistModalOpen(true);
  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);
  const openDemoModal = () => setIsDemoModalOpen(true);
  const closeDemoModal = () => setIsDemoModalOpen(false);

  return (
    <>
      <Head>
        <title>Pitch-it | AI-Powered Pitch Deck Platform</title>
        <meta name="description" content="Pitch-it is the AI platform that transforms your ideas into impactful presentations, validates your concepts, and prepares you to convince investors." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout onOpenDemoModal={openDemoModal}>
        <HeroSection onOpenWaitlistModal={openWaitlistModal} onOpenDemoModal={openDemoModal} />
        <WhyPitchItSection />
        <FeaturesSection onOpenDemoModal={openDemoModal} />
        <MoreThanToolSection />
        <FinalCTASection onOpenWaitlistModal={openWaitlistModal} onOpenDemoModal={openDemoModal} />
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
