import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { Clock, Mail, Brain, Users, FileText } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const WaitingExplanationStep: React.FC = () => {
  const { t } = useTranslation('common');
  const { nextStep, previousStep } = useOnboarding();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('onboarding_waiting_title')}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('onboarding_waiting_subtitle')}
          </p>
        </div>

        {/* Process visualization */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('onboarding_waiting_process_title')}</h3>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">{t('onboarding_waiting_market_analysis')}</h4>
                <p className="text-sm text-gray-600">
                  {t('onboarding_waiting_market_analysis_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">{t('onboarding_waiting_persona_generation')}</h4>
                <p className="text-sm text-gray-600">
                  {t('onboarding_waiting_persona_generation_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">{t('onboarding_waiting_email_notification')}</h4>
                <p className="text-sm text-gray-600">
                  {t('onboarding_waiting_email_notification_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline visualization */}
            <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">{t('onboarding_waiting_timeline')}</h3>
            </div>

            <div className="relative">


              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    0
                  </div>
                  <span className="ml-4 text-sm">{t('onboarding_waiting_timeline_submitted')}</span>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    10
                  </div>
                  <span className="ml-4 text-sm text-gray-600">{t('onboarding_waiting_timeline_analysis')}</span>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    20
                  </div>
                  <span className="ml-4 text-sm text-gray-600">{t('onboarding_waiting_timeline_ready')}</span>
                </div>
              </div>
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 -z-20"></div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {t('onboarding_waiting_average_time')}
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>{t('onboarding_waiting_pro_tip')}</strong> {t('onboarding_waiting_tip_text')}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousStep}
            className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            {t('onboarding_previous')}
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('onboarding_continue')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
