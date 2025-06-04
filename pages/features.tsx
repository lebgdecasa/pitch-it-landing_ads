import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import FeatureCard from '@/components/features/FeatureCard';
import FeatureWorkflowStep from '@/components/features/FeatureWorkflowStep';
import AnimatedCounter from '@/components/features/AnimatedCounter';
import AccordionItem from '@/components/features/AccordionItem';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

// Core features - displayed prominently as cards
const coreFeatureData = (t: (key: string) => string) => [
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    title: t('feature_item_trend_crawler_title'),
    description: t('features_item_trend_crawler_content'),
    highlight: "AI-powered market intelligence",
    colorTheme: 'purple' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>`,
    title: t('feature_item_real_world_pulse_title'),
    description: t('features_item_real_world_pulse_content'),
    highlight: "Validate with real users in days",
    colorTheme: 'blue' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"/></svg>`,
    title: t('feature_item_deck_builder_title'),
    description: t('features_item_deck_builder_content'),
    highlight: "Investor-grade presentations",
    colorTheme: 'orange' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>`,
    title: t('feature_item_virtual_vc_title'),
    description: t('features_item_virtual_vc_content'),
    highlight: "Practice with AI investors",
    colorTheme: 'indigo' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>`,
    title: t('feature_item_buyer_persona_title'),
    description: t('features_item_buyer_persona_content'),
    highlight: "Data-driven customer profiles",
    colorTheme: 'teal' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>`,
    title: t('feature_item_insights_panel_title'),
    description: t('features_item_insights_panel_content'),
    highlight: "Real-time analytics dashboard",
    colorTheme: 'pink' as const,
  }
];

// Additional tools - displayed as smaller cards or accordion
const additionalToolsData = (t: (key: string) => string) => [
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>`,
    title: t('features_item_document_hub_title'),
    description: "Centralized storage for all your pitch materials and research documents.",
    colorTheme: 'green' as const,
  },
  {
    iconSvg: `<svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>`,
    title: t('features_item_road_mapped_extras_title'),
    description: "Advanced features and integrations coming soon to enhance your workflow.",
    colorTheme: 'red' as const,
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
  }
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

  const coreFeatures = coreFeatureData(t);
  const additionalTools = additionalToolsData(t);
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

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 py-20 md:py-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-[80vw] container mx-auto px-6 text-center relative z-10">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('features_hero_h1')}
          </h1>
          <ul className={`text-lg md:text-xl text-blue-100 space-y-3 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <li className="flex items-center justify-center space-x-2">
              {/* <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span> */}
              <span>{t('features_hero_li1')}</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              {/* <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-1000"></span> */}
              <span>{t('features_hero_li2')}</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              {/* <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></span> */}
              <span>{t('features_hero_li3')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Core Features Section - Card Grid Layout */}
      <section className="center *:w-[80vw] py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features_accordion_h2')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to validate your ideas, build compelling pitches, and secure funding
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {coreFeatures.map((feature, index) => (
              <div key={index} className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <FeatureCard
                  iconSvg={feature.iconSvg}
                  title={feature.title}
                  description={feature.description}
                  highlight={feature.highlight}
                  colorTheme={feature.colorTheme}
                  onCtaClick={openDemoModal}
                />
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button
              onClick={openDemoModal}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              See All Features in Action
            </button>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="center *:w-[90vw] py-16 md:py-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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

          {/* Desktop Workflow */}
          <div className="hidden md:block">
            <div className="relative">
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

      {/* Additional Tools Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Tools</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
          </div>

          <div className="center grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {additionalTools.map((tool, index) => (
              <FeatureCard
                key={index}
                iconSvg={tool.iconSvg}
                title={tool.title}
                description={tool.description}
                colorTheme={tool.colorTheme}
                onCtaClick={openDemoModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 via-blue-400 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
            {t('features_perf_stats_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto mb-12 rounded-full"></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow="up" targetValue={0.84} suffix="%" label={t('features_perf_stat1_label')} />
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow="up" targetValue={6} suffix="%" label={t('features_perf_stat2_label')} />
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
              <AnimatedCounter arrow="down" targetValue={75} suffix="%" label={t('features_perf_stat3_label')} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Keep accordion here as it's appropriate */}
      <section className="py-16 md:py-16 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-4">
            {t('features_faq_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-12 rounded-full"></div>
          <div className="max-w-3xl mx-auto">
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

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
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
            className="bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            {t('hero_cta_free')}
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </Layout>
  );
};

export default FeaturesPage;
