import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import SectionTitle from '@/components/ui/SectionTitle';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import { InsightsIcon, DocumentHubIcon, PersonaChatIcon, ProjectManagementIcon } from '@/components/ui/icons/Icons';
import { TranslationSet } from '@/utils/translations';

const MoreThanToolSection = () => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();
  
  const items = [
    { icon: <InsightsIcon />, titleKey: 'more_item1_title', textKey: 'more_item1_text' },
    { icon: <DocumentHubIcon />, titleKey: 'more_item2_title', textKey: 'more_item2_text' },
    { icon: <PersonaChatIcon />, titleKey: 'more_item3_title', textKey: 'more_item3_text' },
    { icon: <ProjectManagementIcon />, titleKey: 'more_item4_title', textKey: 'more_item4_text' },
  ];
  
  return (
    <section 
      ref={ref} 
      className={`py-16 md:py-24 bg-white transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6">
        <SectionTitle>{t('more_title')}</SectionTitle>
        <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto text-center">{t('more_subtitle')}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((item, index) => (
            <div 
              key={item.titleKey as string} 
              className={`p-6 group transition-all duration-300 hover:shadow-lg rounded-xl hover:bg-gray-50 delay-${index * 100}`}
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-1 mt-2">{t(item.titleKey as keyof TranslationSet)}</h4>
              <p className="text-gray-600 text-sm">{t(item.textKey as keyof TranslationSet)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreThanToolSection;
