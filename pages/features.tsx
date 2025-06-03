import React, { useState, useEffect } from 'react';
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
    iconSvg: `<svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    title: t('feature_item_trend_crawler_title'),
    content: t('features_item_trend_crawler_content'),
  },
  {
    iconSvg: `<svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>`,
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
    iconSvg: `<svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>`,
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
    iconSvg: `<svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>`,
    title: t('features_faq_pricing_title'),
    content: t('features_faq_pricing_content'),
    bullets: [
      t('features_faq_pricing_bullet1'),
      t('features_faq_pricing_bullet2'),
      t('features_faq_pricing_bullet3')
    ]
  },
  {
    iconSvg: `<svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>`,
    title: t('features_faq_integrations_title'),
    content: t('features_faq_integrations_content'),
    bullets: [
      t('features_faq_integrations_bullet1'),
      t('features_faq_integrations_bullet2'),
      t('features_faq_integrations_bullet3')
    ]
  },
  {
    iconSvg: `<svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>`,
    title: t('features_faq_security_title'),
    content: t('features_faq_security_content'),
    bullets: [
      t('features_faq_security_bullet1'),
      t('features_faq_security_bullet2'),
      t('features_faq_security_bullet3')
    ]
  },
  {
    iconSvg: `<svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.002 6.002 0 004 10c0 .91.203 1.79.567 2.56l1.275-1.275zm.32-3.187l1.106 1.106a4.002 4.002 0 012.08.041l1.106-1.106a6.002 6.002 0 00-4.292 0zm2.44-2.45a4.002 4.002 0 012.183.078l1.562-1.562A5.98 5.98 0 0010 4c-.686 0-1.35.117-1.965.328l1.562 1.562z"/></svg>`,
    title: t('features_faq_support_title'),
    content: t('features_faq_support_content'),
    bullets: [
      t('features_faq_support_bullet1'),
      t('features_faq_support_bullet2'),
      t('features_faq_support_bullet3')
    ]
  },
  {
    iconSvg: `<svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/></svg>`,
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 py-20 md:py-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('features_hero_h1')}
          </h1>
          <ul className={`text-lg md:text-xl text-blue-100 space-y-3 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <li className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span>{t('features_hero_li1')}</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-1000"></span>
              <span>{t('features_hero_li2')}</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></span>
              <span>{t('features_hero_li3')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Enhanced Features Accordion Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-4">
            {t('features_accordion_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-12 rounded-full"></div>
          <div className="max-w-4xl mx-auto">
            {featureItems.map((item, index) => (
              <div key={index} className="mb-4 transform hover:scale-[1.02] transition-all duration-300">
                <AccordionItem
                  iconSvg={item.iconSvg}
                  title={item.title}
                  content={item.content}
                  bullets={item.bullets || []}
                  initiallyOpen={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Workflow Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-4">
            {t('features_workflow_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full"></div>

          {/* Mobile Workflow */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
              <FeatureWorkflowStep stepNumber="01" title={t('features_workflow_step1_title')} description={t('features_workflow_step1_desc')} />
              <FeatureWorkflowStep stepNumber="02" title={t('features_workflow_step2_title')} description={t('features_workflow_step2_desc')} />
              <FeatureWorkflowStep stepNumber="03" title={t('features_workflow_step3_title')} description={t('features_workflow_step3_desc')} />
              <FeatureWorkflowStep stepNumber="04" title={t('features_workflow_step4_title')} description={t('features_workflow_step4_desc')} />
              <FeatureWorkflowStep stepNumber="05" title={t('features_workflow_step5_title')} description={t('features_workflow_step5_desc')} />
            </div>
          </div>

          {/* Desktop Workflow with Connecting Lines */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 z-0"></div>

              <div className="grid md:grid-cols-5 gap-6 items-start relative z-10">
                <FeatureWorkflowStep stepNumber="01" title={t('features_workflow_step1_title')} description={t('features_workflow_step1_desc')} />
                <FeatureWorkflowStep stepNumber="02" title={t('features_workflow_step2_title')} description={t('features_workflow_step2_desc')} />
                <FeatureWorkflowStep stepNumber="03" title={t('features_workflow_step3_title')} description={t('features_workflow_step3_desc')} />
                <FeatureWorkflowStep stepNumber="04" title={t('features_workflow_step4_title')} description={t('features_workflow_step4_desc')} />
                <FeatureWorkflowStep stepNumber="05" title={t('features_workflow_step5_title')} description={t('features_workflow_step5_desc')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Demo CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl text-center text-white max-w-3xl mx-auto border border-white/20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-semibold mb-4">{t('features_demo_cta_h2')}</h2>
            <p className="text-lg mb-8 text-blue-100">
              {t('features_demo_cta_p')}
            </p>
            <button
              onClick={openDemoModal}
              className="bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg cta-button hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              data-cta-id="features-interactive-demo"
            >
              {t('features_demo_cta_button')}
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Security Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{t('features_security_h2')}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">{t('features_security_li1_strong')}</span>
                </div>
                <p className="text-gray-600">{t('features_security_li1_text')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">{t('features_security_li2_strong')}</span>
                </div>
                <p className="text-gray-600">{t('features_security_li2_text')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012-2h2a2 2 0 012 2v1a1 1 0 102 0V3a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 11H16v-1a1 1 0 10-2 0v1h-1v-1a1 1 0 10-2 0v1H9v-1a1 1 0 10-2 0v1H6v-1a1 1 0 10-2 0v1h-.5A1.5 1.5 0 012 9.5V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">{t('features_security_li3_strong')}</span>
                </div>
                <p className="text-gray-600">{t('features_security_li3_text')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">{t('features_security_li4_strong')}</span>
                </div>
                <p className="text-gray-600">{t('features_security_li4_text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Performance Stats Section */}
      <section className="py-14 md:py-14 bg-gradient-to-r from-blue-700 via-purple-900 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
            {t('features_perf_stats_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto mb-12 rounded-full"></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow='up'targetValue={+0.64} suffix="%" label={t('features_perf_stat1_label')} />
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow='up' targetValue={+8} suffix="%" label={t('features_perf_stat2_label')} />
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow='down' targetValue={+75} suffix="%" label={t('features_perf_stat3_label')} />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-4">
            {t('features_faq_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-12 rounded-full"></div>
          <div className="max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-4 transform hover:scale-[1.01] transition-all duration-300">
                <AccordionItem
                  iconSvg={item.iconSvg}
                  title={item.title}
                  content={item.content}
                  bullets={item.bullets || []}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">{t('features_final_cta_h2')}</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            {t('features_final_cta_p')}
          </p>
          <button
            onClick={openWaitlistModal}
            className="bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg cta-button hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            data-cta-id="features-final-cta-start-free"
          >
            {t('hero_cta_free')}
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </Layout>
  );
};

export default FeaturesPage;
