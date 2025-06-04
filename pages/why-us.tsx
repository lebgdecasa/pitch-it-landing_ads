import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import Image from 'next/image';
import ValuePropositionTile from '@/components/why-us/ValuePropositionTile';
import TestimonialCard from '@/components/why-us/TestimonialCard';
import FounderSpotlightCard from '@/components/why-us/FounderSpotlightCard';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Enhanced WhyUsPage with improved visual appeal, animations, and interactivity
 */

interface WhyUsPageProps {
  openWaitlistModal: () => void;
  openDemoModal: () => void;
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const WhyUsPage = ({ openWaitlistModal, openDemoModal }: WhyUsPageProps) => {
  const { t } = useTranslation('common');

  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ stat1: 0, stat2: 0, stat3: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const pageTitle = t('why_us_page_title');
  const pageDescription = t('why_us_page_description');
  const pageUrl = "https://www.nextraction.com/why-us";
  const ogImageUrl = "https://www.nextraction.com/images/og-why-us.png";

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const triggerPoint = window.innerHeight * 0.4;
        setShowStickyCTA(scrollPosition > triggerPoint);
      }

      // Animate stats when they come into view
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // Animate the stats
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setAnimatedStats({
              stat1: Math.floor(118 * progress),
              stat2: Math.floor(30 * progress),
              stat3: Math.floor(55 * progress)
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
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

      {/* Enhanced Hero Section with Dynamic Background */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-600 to-pink-800 text-white py-20 md:py-38">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-white/15 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-white/25 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-white/10 rounded-full animate-float animation-delay-3000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('why_us_hero_h1')}
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl mb-20 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('why_us_hero_p')}
          </p>
          <div className={`space-y-4 md:space-y-0 md:space-x-4 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section */}
      <section className="center *:w-[80vw] py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-blue-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">{t('why_us_mission_h2')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('why_us_mission_p1')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('why_us_mission_p2')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-purple-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">{t('why_us_vision_h2')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('why_us_vision_p')}
              </p>

            </div>
            <button
              onClick={openWaitlistModal}
              className="bg-transparent border-2 border-blue-500 text-blue-700 font-semibold py-3 px-6 rounded-xl cta-button text-sm sm:text-base w-full md:w-auto hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              data-cta-id="why-us-hero-start-free"
            >
              {t('hero_cta_free')}
            </button>
            <button
              onClick={openDemoModal}
              className="bg-transparent border-2 border-purple-500 text-purple-700 font-semibold py-3 px-6 rounded-xl cta-button text-sm sm:text-base w-full md:w-auto hover:bg-white hover:text-purple-700 transform hover:scale-105 transition-all duration-300"
              data-cta-id="why-us-hero-book-demo"
            >
              {t('hero_cta_demo')}
            </button>
          </div>

        </div>
      </section>

      {/* Enhanced Value Proposition Tiles Section */}
      <section className="center *:w-[80vw] py-16 md:py-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10" ref={statsRef}>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
            {t('why_us_value_prop_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-green-500 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('why_us_vp1_headline')}</h3>
                <p className="text-gray-600 mb-4">{t('why_us_vp1_body')}</p>
                <div className="text-3xl font-bold text-green-600">
                  {animatedStats.stat1}h → 8h {t('why_us_vp1_metric')}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-blue-500 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('why_us_vp2_headline')}</h3>
                <p className="text-gray-600 mb-4">{t('why_us_vp2_body')}</p>
                <div className="text-3xl font-bold text-blue-600">
                  {t('why_us_vp2_metric')}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-purple-500 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('why_us_vp3_headline')}</h3>
                <p className="text-gray-600 mb-4">{t('why_us_vp3_body')}</p>
                <div className="text-3xl font-bold text-purple-600">
                  {t('why_us_vp3_metric')} {animatedStats.stat3}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Founder Spotlight Section */}
      <section className="center *:w-[80vw] py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">{t('why_us_founders_h2')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-12 rounded-full"></div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <div className="transform hover:scale-105 transition-all duration-500">
              <FounderSpotlightCard
                name={t('why_us_founder2_name')}
                title={t('why_us_founder2_title')}
                bio={t('why_us_founder2_bio')}
                imageSrc="/images/jad_2.jpeg"
                imageAlt={t('why_us_founder2_alt')}
                linkedinUrl="https://www.linkedin.com/in/jad-lahrichi-179004164/"
                instagramUrl="https://www.instagram.com/jadlahrichi/"
              />
            </div>
            <div className="transform hover:scale-105 transition-all duration-500">
              <FounderSpotlightCard
                name={t('why_us_founder1_name')}
                title={t('why_us_founder1_title')}
                bio={t('why_us_founder1_bio')}
                imageSrc="/images/karim_2.png"
                imageAlt={t('why_us_founder1_alt')}
                linkedinUrl="https://www.linkedin.com/in/karimamor/"
                instagramUrl="https://www.instagram.com/karimamor_/"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof Band Section */}
      <section className="py-12 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            {t('why_us_social_proof_h3')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4 mb-4">
            {/* Enhanced Logo Containers with Hover Effects */}
            <div className="h-20 w-36 relative group">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="relative h-full w-full p-4">
                <Image
                  src="/images/logo-endeavor.svg"
                  alt={t('why_us_social_proof_logo_endeavor')}
                  fill
                  style={{ objectFit: 'contain' }}
                  title={t('why_us_social_proof_logo_endeavor')}
                />
              </div>
            </div>

            <div className="h-20 w-36 relative group">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="relative h-full w-full p-4">
                <Image
                  src="/images/logo-oxford.svg"
                  alt={t('why_us_social_proof_logo_oxford')}
                  fill
                  style={{ objectFit: 'contain' }}
                  title={t('why_us_social_proof_logo_oxford')}
                />
              </div>
            </div>

            <div className="h-20 w-36 relative group">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="relative h-full w-full p-4">
                <Image
                  src="/images/logo-moroccoai.png"
                  alt={t('why_us_social_proof_logo_moroccoai')}
                  fill
                  style={{ objectFit: 'contain' }}
                  title={t('why_us_social_proof_logo_moroccoai')}
                />
              </div>
            </div>

            <div className="h-20 w-36 relative group">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="relative h-full w-full p-4">
                <Image
                  src="/images/logo-uoft.svg"
                  alt={t('why_us_social_proof_logo_uoft')}
                  fill
                  style={{ objectFit: 'contain' }}
                  title={t('why_us_social_proof_logo_uoft')}
                />
              </div>
            </div>

            <div className="h-20 w-36 relative group">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="relative h-full w-full p-4">
                <Image
                  src="/images/logo-plugandplay.svg"
                  alt={t('why_us_social_proof_logo_plugandplay')}
                  fill
                  style={{ objectFit: 'contain' }}
                  title={t('why_us_social_proof_logo_plugandplay')}
                />
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t('why_us_social_proof_p')}
          </p>
        </div>
      </section>

      {/* Enhanced Testimonials Grid Section */}
      <section className="flex flex-col py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
            {t('why_us_testimonials_h2')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="transform hover:scale-105 transition-all duration-500">
              <TestimonialCard
                quote={t('why_us_testimonial1_quote')}
                author={t('why_us_testimonial1_author')}
                role={t('why_us_testimonial1_role')}
              />
            </div>
            <div className="transform hover:scale-105 transition-all duration-500">
              <TestimonialCard
                quote={t('why_us_testimonial2_quote')}
                author={t('why_us_testimonial2_author')}
                role={t('why_us_testimonial2_role')}
              />
            </div>
            <div className="transform hover:scale-105 transition-all duration-500">
              <TestimonialCard
                quote={t('why_us_testimonial3_quote')}
                author={t('why_us_testimonial3_author')}
                role={t('why_us_testimonial3_role')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA for mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl transform transition-transform duration-200 ease-in-out z-40 md:hidden ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          onClick={openWaitlistModal}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl cta-button text-sm sm:text-base w-full transform hover:scale-105 transition-all duration-300"
          data-cta-id="why-us-sticky-cta-get-started"
        >
          {t('why_us_sticky_cta_button')}
        </button>
      </div>

      {/* Enhanced Desktop CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hidden md:block relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/50 to-blue-600/50"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-semibold mb-6">{t('why_us_desktop_cta_h2')}</h2>
          <button
            onClick={openWaitlistModal}
            className="bg-white text-purple-700 font-bold py-4 px-8 rounded-xl text-lg cta-button hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            data-cta-id="why-us-desktop-cta-start-free"
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Layout>
  );
};

export default WhyUsPage;
