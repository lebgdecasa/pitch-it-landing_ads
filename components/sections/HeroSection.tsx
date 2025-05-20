import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import HeroBackground from '@/components/ui/HeroBackground';

interface HeroSectionProps {
  onOpenWaitlistModal: () => void;
  onOpenDemoModal: () => void;
}

const HeroSection = ({ onOpenWaitlistModal, onOpenDemoModal }: HeroSectionProps) => {
  const t = useTranslation();

  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-white">
      {/* 3D Fluid Animation Background (positioned to the right) */}
      <HeroBackground />

      {/* Content Layer */}
      <div className="container mx-auto px-6 text-left relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-down text-blue-700">
            {t('hero_title')}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl text-blue-600 animate-fade-in-up delay-300">
            {t('hero_subtitle')}
          </p>
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
        </div>

        {/* Overlay for text that would overlap with animation */}
        <div className="absolute top-0 right-0 w-2/6 h-full flex items-center justify-center">
          <div className="text-white text-4xl md:text-6xl font-bold opacity-100">
            Pitch-it
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
