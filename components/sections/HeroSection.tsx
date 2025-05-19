import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';

interface HeroSectionProps {
  onOpenWaitlistModal: () => void;
  onOpenDemoModal: () => void;
}

const HeroSection = ({ onOpenWaitlistModal, onOpenDemoModal }: HeroSectionProps) => {
  const t = useTranslation();
  
  return (
    <section className="hero-gradient animated-gradient text-white py-24 md:py-36">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-down">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-blue-100 animate-fade-in-up delay-300">
          {t('hero_subtitle')}
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-6 animate-fade-in-up delay-600">
          <button 
            onClick={onOpenWaitlistModal} 
            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-gray-100 shadow-xl"
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
    </section>
  );
};

export default HeroSection;
