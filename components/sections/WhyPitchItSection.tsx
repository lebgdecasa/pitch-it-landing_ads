import React from 'react';
import { useTranslation } from 'next-i18next';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';

const WhyPitchItSection = () => {
  const { t } = useTranslation('common'); // UPDATED
  const [ref, isVisible] = useFadeInOnScroll();

  return (
    <section id="why-us" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('why_title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('why_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Founders */}
          <div className="bg-blue-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-blue-800">{t('why_card1_title')}</h3>
            <p className="text-gray-700">{t('why_card1_text')}</p>
          </div>

          {/* For VCs */}
          <div className="bg-green-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-green-800">{t('why_card2_title')}</h3>
            <p className="text-gray-700">{t('why_card2_text')}</p>
          </div>

          {/* For Both */}
          <div className="bg-purple-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-purple-800">{t('why_card3_title')}</h3>
            <p className="text-gray-700">{t('why_card3_text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPitchItSection;
