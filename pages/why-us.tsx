import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import Image from 'next/image'; // For Social Proof Logos if using next/image directly here
import ValuePropositionTile from '@/components/why-us/ValuePropositionTile';
import TestimonialCard from '@/components/why-us/TestimonialCard';
import FounderSpotlightCard from '@/components/why-us/FounderSpotlightCard';
import { useTranslation } from 'next-i18next'; // Import useTranslation
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Import for SSR

/**
 * WhyUsPage is a Next.js page component that outlines the mission, vision,
 * value propositions, and team behind NexTraction. It serves to build trust
 * and explain the "why" of the company.
 */

interface WhyUsPageProps {
  openWaitlistModal: () => void;
  openDemoModal: () => void;
}

// Add getStaticProps for i18n
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

const WhyUsPage = ({ openWaitlistModal, openDemoModal }: WhyUsPageProps) => {
  const { t } = useTranslation('common');

  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const pageTitle = t('why_us_page_title');
  const pageDescription = t('why_us_page_description');
  const pageUrl = "https://www.nextraction.com/why-us";
  const ogImageUrl = "https://www.nextraction.com/images/og-why-us.png";

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const triggerPoint = window.innerHeight * 0.4;
        setShowStickyCTA(scrollPosition > triggerPoint);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Section 1: Hero Section */}
      <section ref={heroRef} className="hero-gradient text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-down">
            {t('why_us_hero_h1')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-20 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            {t('why_us_hero_p')}
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up animation-delay-600">
            <button
              onClick={openWaitlistModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg cta-button text-sm sm:text-base w-full md:w-auto"
              data-cta-id="why-us-hero-start-free"
            >
              {t('hero_cta_free')}
            </button>
            <button
              onClick={openDemoModal}
              className="bg-white text-blue-700 font-semibold py-2 px-3 sm:px-4 rounded-lg cta-button text-sm sm:text-base w-full md:w-auto border border-blue-600 hover:bg-gray-200"
              data-cta-id="why-us-hero-book-demo"
            >
              {t('hero_cta_demo')}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">{t('why_us_mission_h2')}</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                {t('why_us_mission_p1')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('why_us_mission_p2')}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">{t('why_us_vision_h2')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('why_us_vision_p')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Value Proposition Tiles Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            {t('why_us_value_prop_h2')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValuePropositionTile
              headline={t('why_us_vp1_headline')}
              body={t('why_us_vp1_body')}
              metric={t('why_us_vp1_metric')}
            />
            <ValuePropositionTile
              headline={t('why_us_vp2_headline')}
              body={t('why_us_vp2_body')}
              metric={t('why_us_vp2_metric')}
            />
            <ValuePropositionTile
              headline={t('why_us_vp3_headline')}
              body={t('why_us_vp3_body')}
              metric={t('why_us_vp3_metric')}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Founder Spotlight Section */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">{t('why_us_founders_h2')}</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <FounderSpotlightCard
              name={t('why_us_founder1_name')}
              title={t('why_us_founder1_title')}
              bio={t('why_us_founder1_bio')}
              imageSrc="/images/karim.png"
              imageAlt={t('why_us_founder1_alt')}
            />
            <FounderSpotlightCard
              name={t('why_us_founder2_name')}
              title={t('why_us_founder2_title')}
              bio={t('why_us_founder2_bio')}
              imageSrc="/images/jad.png"
              imageAlt={t('why_us_founder2_alt')}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Social Proof Band Section */}
      <section className="py-12 bg-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            {t('why_us_social_proof_h3')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4 mb-4">
            {/* Endeavor Logo */}
            <div className="h-20 w-36 relative"> {/* Changed w-auto to w-36 */}
              <Image
                src="/images/logo-endeavor.svg" // Replace with actual path and extension
                alt={t('why_us_social_proof_logo_endeavor')}
                fill
                style={{ objectFit: 'contain' }}
                title={t('why_us_social_proof_logo_endeavor')}
              />
            </div>
            {/* Oxford Logo */}
            <div className="h-20 w-36 relative"> {/* Changed w-auto to w-36 */}
              <Image
                src="/images/logo-oxford.svg" // Replace with actual path and extension
                alt={t('why_us_social_proof_logo_oxford')}
                fill
                style={{ objectFit: 'contain' }}
                title={t('why_us_social_proof_logo_oxford')}
              />
            </div>
            {/* MoroccoAI Logo */}
            <div className="h-20 w-36 relative"> {/* Changed w-auto to w-36 */}
              <Image
                src="/images/logo-moroccoai.png" // Replace with actual path and extension
                alt={t('why_us_social_proof_logo_moroccoai')}
                fill
                style={{ objectFit: 'contain' }}
                title={t('why_us_social_proof_logo_moroccoai')}
              />
            </div>
            {/* UofT Logo */}
            <div className="h-20 w-36 relative"> {/* Changed w-auto to w-36 */}
              <Image
                src="/images/logo-uoft.svg" // Replace with actual path and extension
                alt={t('why_us_social_proof_logo_uoft')}
                fill
                style={{ objectFit: 'contain' }}
                title={t('why_us_social_proof_logo_uoft')}
              />
            </div>
            {/* Plug and Play Logo */}
            <div className="h-20 w-36 relative"> {/* Changed w-auto to w-36 */}
              <Image
                src="/images/logo-plugandplay.svg" // Replace with actual path and extension
                alt={t('why_us_social_proof_logo_plugandplay')}
                fill
                style={{ objectFit: 'contain' }}
                title={t('why_us_social_proof_logo_plugandplay')}
              />
            </div>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t('why_us_social_proof_p')}
          </p>
        </div>
      </section>

      {/* Section 6: Testimonials Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            {t('why_us_testimonials_h2')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote={t('why_us_testimonial1_quote')}
              author={t('why_us_testimonial1_author')}
              role={t('why_us_testimonial1_role')}
            />
            <TestimonialCard
              quote={t('why_us_testimonial2_quote')}
              author={t('why_us_testimonial2_author')}
              role={t('why_us_testimonial2_role')}
            />
            <TestimonialCard
              quote={t('why_us_testimonial3_quote')}
              author={t('why_us_testimonial3_author')}
              role={t('why_us_testimonial3_role')}
            />
          </div>
        </div>
      </section>

      {/* Section 7: Call-To-Action (Sticky on Mobile, Static on Desktop) */}
      {/* Sticky CTA for mobile: p-4 (16px) */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl_top transform transition-transform duration-200 ease-in-out z-40 md:hidden ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          onClick={openWaitlistModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg cta-button text-sm sm:text-base w-full"
          data-cta-id="why-us-sticky-cta-get-started"
        >
          {t('why_us_sticky_cta_button')}
        </button>
      </div>

      {/* Static CTA for desktop: py-16 (64px), mb-6 (24px) */}
      <section className="py-16 bg-blue-600 text-white hidden md:block">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">{t('why_us_desktop_cta_h2')}</h2>
          <button
            onClick={openWaitlistModal}
            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg cta-button hover:bg-gray-200 shadow-xl"
            data-cta-id="why-us-desktop-cta-start-free"
          >
            {t('hero_cta_free')}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default WhyUsPage;
