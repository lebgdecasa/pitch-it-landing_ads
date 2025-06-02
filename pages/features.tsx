import React from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import AccordionItem from '@/components/features/AccordionItem';
import FeatureWorkflowStep from '@/components/features/FeatureWorkflowStep';
import AnimatedCounter from '@/components/features/AnimatedCounter';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const featureItemsData = (t: (key: string) => string) => [
  {
    iconSvg: undefined,
    title: t('feature_item_trend_crawler_title'),
    content: t('features_item_trend_crawler_content'),
    bullets: [
      t('features_item_trend_crawler_bullet1'),
      t('features_item_trend_crawler_bullet2'),
      t('features_item_trend_crawler_bullet3'),
      t('features_item_trend_crawler_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('feature_item_real_world_pulse_title'),
    content: t('features_item_real_world_pulse_content'),
    bullets: [
      t('features_item_real_world_pulse_bullet1'),
      t('features_item_real_world_pulse_bullet2'),
      t('features_item_real_world_pulse_bullet3'),
      t('features_item_real_world_pulse_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('feature_item_buyer_persona_title'),
    content: t('features_item_buyer_persona_content'),
    bullets: [
      t('features_item_buyer_persona_bullet1'),
      t('features_item_buyer_persona_bullet2'),
      t('features_item_buyer_persona_bullet3'),
      t('features_item_buyer_persona_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('feature_item_deck_builder_title'),
    content: t('features_item_deck_builder_content'),
    bullets: [
      t('features_item_deck_builder_bullet1'),
      t('features_item_deck_builder_bullet2'),
      t('features_item_deck_builder_bullet3'),
      t('features_item_deck_builder_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('feature_item_virtual_vc_title'),
    content: t('features_item_virtual_vc_content'),
    bullets: [
      t('features_item_virtual_vc_bullet1'),
      t('features_item_virtual_vc_bullet2'),
      t('features_item_virtual_vc_bullet3'),
      t('features_item_virtual_vc_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('feature_item_insights_panel_title'),
    content: t('features_item_insights_panel_content'),
    bullets: [
      t('features_item_insights_panel_bullet1'),
      t('features_item_insights_panel_bullet2'),
      t('features_item_insights_panel_bullet3'),
      t('features_item_insights_panel_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('features_item_document_hub_title'),
    content: t('features_item_document_hub_content'),
    bullets: [
      t('features_item_document_hub_bullet1'),
      t('features_item_document_hub_bullet2'),
      t('features_item_document_hub_bullet3'),
      t('features_item_document_hub_bullet4')
    ],
  },
  {
    iconSvg: undefined,
    title: t('features_item_road_mapped_extras_title'),
    content: t('features_item_road_mapped_extras_content'),
    bullets: [
      t('features_item_road_mapped_extras_bullet1'),
      t('features_item_road_mapped_extras_bullet2'),
      t('features_item_road_mapped_extras_bullet3'),
      t('features_item_road_mapped_extras_bullet4')
    ],
  }
];

const faqItemsData = (t: (key: string) => string) => [
  {
    iconSvg: undefined,
    title: t('features_faq_pricing_title'),
    content: t('features_faq_pricing_content'),
    bullets: [
      t('features_faq_pricing_bullet1'),
      t('features_faq_pricing_bullet2'),
      t('features_faq_pricing_bullet3')
    ]
  },
  {
    iconSvg: undefined,
    title: t('features_faq_integrations_title'),
    content: t('features_faq_integrations_content'),
    bullets: [
      t('features_faq_integrations_bullet1'),
      t('features_faq_integrations_bullet2'),
      t('features_faq_integrations_bullet3')
    ]
  },
  {
    iconSvg: undefined,
    title: t('features_faq_security_title'),
    content: t('features_faq_security_content'),
    bullets: [
      t('features_faq_security_bullet1'),
      t('features_faq_security_bullet2'),
      t('features_faq_security_bullet3')
    ]
  },
  {
    iconSvg: undefined,
    title: t('features_faq_support_title'),
    content: t('features_faq_support_content'),
    bullets: [
      t('features_faq_support_bullet1'),
      t('features_faq_support_bullet2'),
      t('features_faq_support_bullet3')
    ]
  },
  {
    iconSvg: undefined,
    title: t('features_faq_roadmap_title'),
    content: t('features_faq_roadmap_content'),
    bullets: [
      t('features_faq_roadmap_bullet1'),
      t('features_faq_roadmap_bullet2'),
      t('features_faq_roadmap_bullet3')
    ]
  },
];

interface FeaturesPageProps {
  openDemoModal: () => void;
  openWaitlistModal: () => void;
}

const FeaturesPage = ({ openDemoModal, openWaitlistModal }: FeaturesPageProps) => {
  const { t } = useTranslation('common');

  const pageTitle = t('features_page_title');
  const pageDescription = t('features_page_description');
  const pageUrl = "https://www.nextraction.com/features";
  const ogImageUrl = "https://www.nextraction.com/images/og-features.png";

  const featureItems = featureItemsData(t);
  const faqItems = faqItemsData(t);

  return (
    <Layout onOpenDemoModal={openDemoModal}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Head>

      <section className="bg-gray-100 py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            {t('features_hero_h1')}
          </h1>
          <ul className="text-lg md:text-xl text-gray-600 space-y-2 max-w-2xl mx-auto">
            <li>{t('features_hero_li1')}</li>
            <li>{t('features_hero_li2')}</li>
            <li>{t('features_hero_li3')}</li>
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            {t('features_accordion_h2')}
          </h2>
          <div className="max-w-3xl mx-auto">
            {featureItems.map((item, index) => (
              <AccordionItem
                key={index}
                iconSvg={item.iconSvg}
                title={item.title}
                content={item.content}
                bullets={item.bullets}
                initiallyOpen={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            {t('features_workflow_h2')}
          </h2>
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
              <FeatureWorkflowStep stepNumber="01" title={t('features_workflow_step1_title')} description={t('features_workflow_step1_desc')} />
              <FeatureWorkflowStep stepNumber="02" title={t('features_workflow_step2_title')} description={t('features_workflow_step2_desc')} />
              <FeatureWorkflowStep stepNumber="03" title={t('features_workflow_step3_title')} description={t('features_workflow_step3_desc')} />
              <FeatureWorkflowStep stepNumber="04" title={t('features_workflow_step4_title')} description={t('features_workflow_step4_desc')} />
              <FeatureWorkflowStep stepNumber="05" title={t('features_workflow_step5_title')} description={t('features_workflow_step5_desc')} />
            </div>
          </div>
          <div className="hidden md:grid md:grid-cols-5 gap-6 items-start">
            <FeatureWorkflowStep stepNumber="01" title={t('features_workflow_step1_title')} description={t('features_workflow_step1_desc')} />
            <FeatureWorkflowStep stepNumber="02" title={t('features_workflow_step2_title')} description={t('features_workflow_step2_desc')} />
            <FeatureWorkflowStep stepNumber="03" title={t('features_workflow_step3_title')} description={t('features_workflow_step3_desc')} />
            <FeatureWorkflowStep stepNumber="04" title={t('features_workflow_step4_title')} description={t('features_workflow_step4_desc')} />
            <FeatureWorkflowStep stepNumber="05" title={t('features_workflow_step5_title')} description={t('features_workflow_step5_desc')} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 rounded-xl shadow-2xl text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">{t('features_demo_cta_h2')}</h2>
            <p className="text-lg mb-8">
              {t('features_demo_cta_p')}
            </p>
            <button
              onClick={openDemoModal}
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-gray-100 shadow-xl"
              data-cta-id="features-interactive-demo"
            >
              {t('features_demo_cta_button')}
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">{t('features_security_h2')}</h2>
            <ul className="space-y-3 text-gray-600 list-none md:list-disc md:list-inside">
              <li><span className="font-semibold text-gray-700">{t('features_security_li1_strong')}</span> {t('features_security_li1_text')}</li>
              <li><span className="font-semibold text-gray-700">{t('features_security_li2_strong')}</span> {t('features_security_li2_text')}</li>
              <li><span className="font-semibold text-gray-700">{t('features_security_li3_strong')}</span> {t('features_security_li3_text')}</li>
              <li><span className="font-semibold text-gray-700">{t('features_security_li4_strong')}</span> {t('features_security_li4_text')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            {t('features_perf_stats_h2')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedCounter targetValue={0.84} suffix="%+" label={t('features_perf_stat1_label')} />
            <AnimatedCounter targetValue={6} suffix="%+" label={t('features_perf_stat2_label')} />
            <AnimatedCounter targetValue={75} suffix="%" label={t('features_perf_stat3_label')} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            {t('features_faq_h2')}
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                iconSvg={item.iconSvg}
                title={item.title}
                content={item.content}
                bullets={item.bullets}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">{t('features_final_cta_h2')}</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            {t('features_final_cta_p')}
          </p>
          <button
            onClick={openWaitlistModal}
            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-gray-100 shadow-xl"
            data-cta-id="features-final-cta-start-free"
          >
            {t('hero_cta_free')}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default FeaturesPage;
