import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import SectionTitle from '@/components/ui/SectionTitle';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import { DisorganizedIdeaIcon, LackValidationIcon, FearVCsIcon } from '@/components/ui/icons/Icons';

const WhyPitchItSection = () => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();
  
  return (
    <section 
      id="why-pitchit" 
      ref={ref} 
      className={`py-16 md:py-24 bg-white transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6 text-center">
        <SectionTitle>{t('why_title')}</SectionTitle>
        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">{t('why_subtitle')}</p>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <DisorganizedIdeaIcon />, titleKey: 'why_card1_title', textKey: 'why_card1_text' },
            { icon: <LackValidationIcon />, titleKey: 'why_card2_title', textKey: 'why_card2_text' },
            { icon: <FearVCsIcon />, titleKey: 'why_card3_title', textKey: 'why_card3_text' },
          ].map((card, index) => (
            <div 
              key={card.titleKey} 
              className={`p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 delay-${index * 100}`}
            >
              {card.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{t(card.titleKey)}</h3>
              <p className="text-gray-600 text-sm">{t(card.textKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPitchItSection;
