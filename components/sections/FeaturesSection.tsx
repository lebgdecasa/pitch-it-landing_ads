import React, { ReactNode } from 'react';
import useTranslation from '@/hooks/useTranslation';
import SectionTitle from '@/components/ui/SectionTitle';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import ScreenshotPlaceholder from '@/components/ui/Screenshot';
import { DeckBuilderIcon, MarketPulseIcon, VirtualVCRehearsalIcon, ArrowRightIcon } from '@/components/ui/icons/Icons';
import { TranslationSet } from '@/utils/translations';
import Screenshot from '@/components/ui/Screenshot';

interface FeatureCardProps {
  icon: ReactNode;
  titleKey: keyof TranslationSet;
  descKey: keyof TranslationSet;
  listKeys: (keyof TranslationSet)[];
  ctaKey: keyof TranslationSet;
  onOpenDemoModal: () => void;
}

const FeatureCard = ({ icon, titleKey, descKey, listKeys, ctaKey, onOpenDemoModal }: FeatureCardProps) => {
  const t = useTranslation();
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl feature-card flex flex-col">
      <div className="mb-6 text-center">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">{t(titleKey)}</h3>
      <p className="text-gray-600 mb-4 flex-grow text-sm" dangerouslySetInnerHTML={{ __html: t(descKey) }}></p>
      <Screenshot
  src={`/images/${titleKey}.png`}
  alt={`${t(titleKey)} Screenshot`}
/>
      <ul className="text-gray-600 space-y-2 list-disc list-inside mb-6 flex-grow text-sm">
        {listKeys.map((key) => <li key={key as string}>{t(key)}</li>)}
      </ul>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          onOpenDemoModal();
        }}
        className="group mt-auto text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center self-start transition-colors duration-300"
      >
        {t(ctaKey)}
        <ArrowRightIcon />
      </button>
    </div>
  );
};

interface FeaturesSectionProps {
  onOpenDemoModal: () => void;
}

const FeaturesSection = ({ onOpenDemoModal }: FeaturesSectionProps) => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();

  const features: Omit<FeatureCardProps, 'onOpenDemoModal'>[] = [
    {
      icon: <DeckBuilderIcon />,
      titleKey: 'feature1_title',
      descKey: 'feature1_desc',
      listKeys: ['feature1_li1', 'feature1_li2', 'feature1_li3'],
      ctaKey: 'feature1_cta'
    },
    {
      icon: <MarketPulseIcon />,
      titleKey: 'feature2_title',
      descKey: 'feature2_desc',
      listKeys: ['feature2_li1', 'feature2_li2', 'feature2_li3'],
      ctaKey: 'feature2_cta'
    },
    {
      icon: <VirtualVCRehearsalIcon />,
      titleKey: 'feature3_title',
      descKey: 'feature3_desc',
      listKeys: ['feature3_li1', 'feature3_li2', 'feature3_li3'],
      ctaKey: 'feature3_cta'
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className={`py-16 md:py-24 bg-blue-50 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6">
        <SectionTitle>{t('features_title')}</SectionTitle>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
          {features.map(feature => (
            <FeatureCard
              key={feature.titleKey as string}
              {...feature}
              onOpenDemoModal={onOpenDemoModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
