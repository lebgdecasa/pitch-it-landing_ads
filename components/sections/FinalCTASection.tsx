import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';

interface FinalCTASectionProps {
  onOpenWaitlistModal: () => void;
  onOpenDemoModal: () => void;
}

const FinalCTASection = ({ onOpenWaitlistModal, onOpenDemoModal }: FinalCTASectionProps) => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();
  
  return (
    <section 
      ref={ref} 
      className={`py-20 md:py-28 hero-gradient animated-gradient text-white transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('final_cta_title')}</h2>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-blue-100">{t('final_cta_subtitle')}</p>
        <div className="space-y-4 md:space-y-0 md:space-x-6">
          <button 
            onClick={onOpenWaitlistModal} 
            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-gray-100 shadow-xl"
          >
            {t('final_cta_waitlist')}
          </button>
          <button 
            onClick={onOpenDemoModal} 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg cta-button shadow-xl"
          >
            {t('final_cta_demo')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
