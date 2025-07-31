import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useOnboardingAnalytics } from '../hooks/useOnboardingAnalytics';
import { useTranslation } from 'next-i18next';

export const WelcomeStep: React.FC = () => {
  const { t } = useTranslation('common');
  const { nextStep, skipOnboarding } = useOnboarding();
  const { trackAction } = useOnboardingAnalytics('welcome');

  const handleGetStarted = () => {
    trackAction('started');
    nextStep();
  };

  const handleSkip = () => {
    trackAction('skipped');
    skipOnboarding();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-8 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-6 md:p-8 relative"
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
            <img
              src="/images/nextraction_logo.png"
              alt="Welcome"
              className="w-12 h-12 object-contain"
            />
            </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('onboarding_welcome_title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            {t('onboarding_welcome_subtitle')}
          </p>

          {/* Features list */}
          <div className="grid md:grid-cols-3 gap-4 mb-6 text-left">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{t('onboarding_welcome_feature1_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('onboarding_welcome_feature1_desc')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{t('onboarding_welcome_feature2_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('onboarding_welcome_feature2_desc')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{t('onboarding_welcome_feature3_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('onboarding_welcome_feature3_desc')}
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {t('onboarding_welcome_cta')}
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>

        {/* Tour duration */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('onboarding_welcome_tour_duration')}
        </p>
      </motion.div>
    </div>
  );
};
