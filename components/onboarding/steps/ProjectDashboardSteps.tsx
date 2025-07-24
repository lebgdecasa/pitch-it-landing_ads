import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { OnboardingTooltip } from '../OnboardingTooltip';
import { FileText, Users, Download, MessageSquare } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const ProjectDashboardSteps: React.FC = () => {
  const { t } = useTranslation('common');
  const { nextStep, previousStep } = useOnboarding();
  const [subStep, setSubStep] = useState(0);

  // Refs for different sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const personasRef = useRef<HTMLDivElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  const handleNext = () => {
    if (subStep < 3) {
      setSubStep(subStep + 1);
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (subStep > 0) {
      setSubStep(subStep - 1);
    } else {
      previousStep();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pt-20 overflow-auto">
      <div className="max-w-6xl w-full">
        {/* Mock Project Dashboard */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6">AI Fitness App</h1>

          {/* Project Overview Section */}
          <div
            ref={overviewRef}
            className={`mb-6 p-4 rounded-lg border-2 ${
              subStep === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold mb-3">{t('onboarding_dashboard_overview_title')}</h2>
            <p className="text-gray-600 mb-4">
              {t('onboarding_dashboard_overview_desc')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                t('onboarding_wizard_problem'),
                t('onboarding_wizard_solution'),
                t('onboarding_wizard_target_market'),
                t('onboarding_wizard_business_model')
              ].map((item) => (
                <div key={item} className="bg-white rounded p-3">
                  <h3 className="font-medium text-sm text-gray-600">{item}</h3>
                  <p className="text-sm mt-1">Lorem ipsum...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Section */}
          <div
            ref={analysisRef}
            className={`mb-6 p-4 rounded-lg border-2 ${
              subStep === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold mb-3">{t('onboarding_dashboard_analysis_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{t('onboarding_dashboard_netnographic')}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('onboarding_dashboard_netnographic_desc')}
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{t('onboarding_dashboard_key_trends')}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('onboarding_dashboard_key_trends_desc')}
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Personas Section */}
          <div
            ref={personasRef}
            className={`mb-6 p-4 rounded-lg border-2 ${
              subStep === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold mb-3">{t('onboarding_dashboard_personas_title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                t('onboarding_dashboard_personas_sample1').split(' - ')[0],
                t('onboarding_dashboard_personas_sample2').split(' - ')[0],
                'Emily Davis',
                'Alex Rivera'
              ].map((name) => (
                <div key={name} className="bg-white rounded-lg p-4 border hover:shadow-md cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full mb-3"></div>
                  <h3 className="font-medium text-sm">{name}</h3>
                  <p className="text-xs text-gray-600">Click to view details</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Button */}
          <button
            ref={chatButtonRef}
            className={`w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg
                     flex items-center justify-center hover:bg-indigo-700 ${
                       subStep === 3 ? 'ring-4 ring-indigo-300' : ''
                     }`}
          >
            <MessageSquare className="mr-2" size={20} />
            {t('onboarding_dashboard_chat_button')}
          </button>
        </div>

        {/* Tooltips for each step */}
        {subStep === 0 && (
          <OnboardingTooltip
            title={t('onboarding_dashboard_overview_tooltip_title')}
            description={t('onboarding_dashboard_overview_tooltip_desc')}
            targetRef={overviewRef}
            position="right"
            showPrevious={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {subStep === 1 && (
          <OnboardingTooltip
            title={t('onboarding_dashboard_analysis_tooltip_title')}
            description={t('onboarding_dashboard_analysis_tooltip_desc')}
            targetRef={analysisRef}
            position="right"
            showPrevious={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {subStep === 2 && (
          <OnboardingTooltip
            title={t('onboarding_dashboard_personas_tooltip_title')}
            description={t('onboarding_dashboard_personas_tooltip_desc')}
            targetRef={personasRef}
            position="top right"
            showPrevious={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {subStep === 3 && (
          <OnboardingTooltip
            title={t('onboarding_dashboard_chat_tooltip_title')}
            description={t('onboarding_dashboard_chat_tooltip_desc')}
            targetRef={chatButtonRef}
            position="top right"
            showPrevious={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
};
