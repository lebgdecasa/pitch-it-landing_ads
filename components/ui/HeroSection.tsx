import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import LazyHeroBackground from '@/components/ui/LazyHeroBackground'; // Lazy-loaded desktop 3D animation
import MobileHeroBackground from '@/components/ui/MobileHeroBackground'; // Mobile bubbles animation
import OptimizedWaitlistCounter from '@/components/ui/OptimizedWaitlistCounter';

interface HeroSectionProps {
  onOpenWaitlistModal: () => void;
  onOpenDemoModal: () => void;
}

const HeroSection = ({ onOpenWaitlistModal, onOpenDemoModal }: HeroSectionProps) => {
  const t = useTranslation();

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
      <div className="container mx-auto px-4 md:px-6 text-center md:text-left relative z-10">
        <div className="max-w-full md:max-w-2xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full mb-6 animate-fade-in-down">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-blue-700">Backed by Y Combinator</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-down text-blue-700">
            {t('hero_title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto md:mx-0 text-blue-600 animate-fade-in-up delay-300">
            {t('hero_subtitle')}
          </p>

          {/* Waitlist Counter */}
          <div className="mb-10 animate-fade-in-up delay-300">
            <OptimizedWaitlistCounter className="justify-center md:justify-start" />
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-6 animate-fade-in-up delay-600">
            <button
              onClick={onOpenWaitlistModal}
              className="bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-blue-800 shadow-xl"
            >
              {t('hero_cta_free')}
            </button>
            <button
              onClick={onOpenDemoModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg cta-button shadow-xl"
            >
              {t('hero_cta_demo')}
            </button>
          </div>

          {/* As Seen In */}
          <div className="mt-16 animate-fade-in-up delay-900">
            <p className="text-sm text-gray-500 mb-4">{t('as_seen_in')}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-60">
              <img src="/images/logos/techcrunch.svg" alt="TechCrunch" className="h-8" />
              <img src="/images/logos/forbes.svg" alt="Forbes" className="h-8" />
              <img src="/images/logos/producthunt.svg" alt="Product Hunt" className="h-8" />
              <img src="/images/logos/ycombinator.svg" alt="Y Combinator" className="h-8" />
            </div>
          </div>
        </div>

        {/* Overlay Image (Desktop Only) */}
        <div className="absolute top-0 right-0 w-2/6 h-full hidden md:flex items-center justify-center">
          <img src="/images/logo_NexTraction.png" alt="NexTraction logo_NexTraction" className="h-auto max-h-80 md:max-h-90 opacity-100" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
