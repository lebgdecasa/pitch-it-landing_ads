import React from 'react';
import { useTranslation } from 'next-i18next';
import LazyHeroBackground from '@/components/ui/LazyHeroBackground'; // Lazy-loaded desktop 3D animation
import MobileHeroBackground from '@/components/ui/MobileHeroBackground'; // Mobile bubbles animation
import Link from 'next/link';

interface HeroSectionProps {
  onOpenWaitlistModal: () => void;
  onOpenDemoModal: () => void;
}

const HeroSection = ({ onOpenWaitlistModal, onOpenDemoModal }: HeroSectionProps) => {
  const { t } = useTranslation('common'); // UPDATED

  return (
    <section className="relative overflow-hidden py-16 md:py-36 bg-white">
      {/* Desktop 3D Fluid Animation Background */}
      <div className="hidden md:block">
        <LazyHeroBackground />
      </div>

      {/* Mobile Bubbles Animation Background */}
      <div className="block md:hidden">
        <MobileHeroBackground />
      </div>

      {/* Content Layer */}
      <div className="container mx-auto px-4 md:px-6 text-center w-[85vw] md:text-left relative z-10">
        <div className="max-w-full md:max-w-2xl">
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-down text-blue-700">
            {t('hero_title')}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto md:mx-0 text-blue-600 animate-fade-in-up delay-300">
            {t('hero_subtitle')}
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-6 animate-fade-in-up delay-600">
            <Link href="/auth?mode=signup">
              <button
              className="bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-blue-800 shadow-xl"
              >
              {t('hero_cta_free')}
              </button>
            </Link>
            <button
              onClick={onOpenDemoModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg cta-button shadow-xl"
            >
              {t('hero_cta_demo')}
            </button>
          </div>
        </div>

        {/* Overlay Image (Desktop Only) */}
        <div className="absolute top-0 right-0 w-2/6 h-full hidden md:flex flex-col items-center justify-center">
          <img src="/images/logo_final.svg" alt="NexTraction logo_final" className="h-auto max-h-96 md:max-h-[500px] opacity-100" />
          <p className="mt-4 text-xl font-semibold text-white text-center"> {/* Slogan */}
              Extract Clarity. Gain Traction.
            </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
