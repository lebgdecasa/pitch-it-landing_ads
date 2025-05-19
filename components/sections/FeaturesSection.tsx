import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import FeatureItem from './FeatureItem'; // Import the new component

interface FeaturesSectionProps {
  onOpenDemoModal: () => void;
}

const FeaturesSection = ({ onOpenDemoModal }: FeaturesSectionProps) => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();

  const features = [
    {
      id: 'feature1',
      featureNumber: '01',
      color: 'blue',
      title: t('feature1_title').split('|')[1].trim(),
      description: t('feature1_desc'),
      listItems: [t('feature1_li1'), t('feature1_li2'), t('feature1_li3')],
      ctaText: t('feature1_cta'),
      imageUrl: '/images/analysis.png',
    },
    {
      id: 'feature2',
      featureNumber: '02',
      color: 'green',
      title: t('feature2_title').split('|')[1].trim(),
      description: t('feature2_desc'),
      listItems: [t('feature2_li1'), t('feature2_li2'), t('feature2_li3')],
      ctaText: t('feature2_cta'),
      imageUrl: '/images/pulse_setup.png',
    },
    {
      id: 'feature3',
      featureNumber: '03',
      color: 'purple',
      title: t('feature3_title').split('|')[1].trim(),
      description: t('feature3_desc'),
      listItems: [t('feature3_li1'), t('feature3_li2'), t('feature3_li3')],
      ctaText: t('feature3_cta'),
      imageUrl: '/images/personas.png',
    },
    {
      id: 'feature4',
      featureNumber: '04',
      color: 'yellow',
      title: t('feature4_title').split('|')[1].trim(),
      description: t('feature4_desc'),
      listItems: [t('feature4_li1'), t('feature4_li2'), t('feature4_li3')],
      ctaText: t('feature4_cta'),
      imageUrl: '/images/deck_editor.png',
    },
    {
      id: 'feature5',
      featureNumber: '05',
      color: 'red',
      title: t('feature5_title').split('|')[1].trim(),
      description: t('feature5_desc'),
      listItems: [t('feature5_li1'), t('feature5_li2'), t('feature5_li3')],
      ctaText: t('feature5_cta'),
      imageUrl: '/images/VVC_setup.png',
      onCtaClick: onOpenDemoModal,
    },
  ];

  return (
    <section id="features" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features_title')}</h2>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {features.map((feature, index) => (
            <a key={feature.id} href={`#${feature.id}`} className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                feature.color === 'blue' ? 'bg-blue-400' :
                feature.color === 'green' ? 'bg-green-400' :
                feature.color === 'purple' ? 'bg-purple-400' :
                feature.color === 'yellow' ? 'bg-yellow-400' :
                'bg-red-400'
              }`}>
                {feature.featureNumber}
              </div>
              <div className="hidden md:block ml-2 font-medium">
                {feature.title}
              </div>
              {index < features.length - 1 && <div className="mx-2 text-gray-400">→</div>}
            </a>
          ))}
        </div>

        {/* Feature Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={
                // If there are 5 features, make the 5th item (index 4) span two columns on medium screens and up
                features.length === 5 && index === 4 ? 'md:col-span-2' : ''
              }
            >
              <FeatureItem
                id={feature.id}
                featureNumber={feature.featureNumber}
                color={feature.color}
                title={feature.title}
                description={feature.description}
                listItems={feature.listItems}
                ctaText={feature.ctaText}
                imageUrl={feature.imageUrl}
                onCtaClick={feature.onCtaClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
