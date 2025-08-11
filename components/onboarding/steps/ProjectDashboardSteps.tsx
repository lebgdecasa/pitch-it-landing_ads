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
    <div className="fixed inset-0 flex items-center justify-center p-2 pt-16 overflow-auto">
      <div className="max-w-4xl w-full scale-95">
        {/* Mock Project Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h1 className="text-xl font-bold mb-4">AI Fitness App</h1>

          {/* Project Overview Section */}
          <div
            ref={overviewRef}
            className={`mb-4 p-3 rounded-lg border ${
              subStep === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">{t('onboarding_dashboard_overview_title')}</h2>
            <p className="text-gray-600 mb-3 text-sm">
              {t('onboarding_dashboard_overview_desc')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                t('onboarding_wizard_problem'),
                t('onboarding_wizard_solution'),
                t('onboarding_wizard_target_market'),
                t('onboarding_wizard_business_model')
              ].map((item) => (
                <div key={item} className="bg-white rounded p-2">
                  <h3 className="font-medium text-xs text-gray-600">{item}</h3>
                  <p className="text-xs mt-1">Lorem ipsum...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Section */}
          <div
            ref={analysisRef}
            className={`mb-4 p-3 rounded-lg border ${
              subStep === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">{t('onboarding_dashboard_analysis_title')}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{t('onboarding_dashboard_netnographic')}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {t('onboarding_dashboard_netnographic_desc')}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{t('onboarding_dashboard_key_trends')}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {t('onboarding_dashboard_key_trends_desc')}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Personas Section */}
          <div
            ref={personasRef}
            className={`mb-4 p-3 rounded-lg border ${
              subStep === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">{t('onboarding_dashboard_personas_title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                t('onboarding_dashboard_personas_sample1').split(' - ')[0],
                t('onboarding_dashboard_personas_sample2').split(' - ')[0],
                'Emily Davis',
                'Alex Rivera'
              ].map((name) => (
                <div key={name} className="bg-white rounded-lg p-3 border hover:shadow-sm cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full mb-2" />
                  <h3 className="font-medium text-xs">{name}</h3>
                  <p className="text-[10px] text-gray-600">Click to view details</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Button */}
          <button
            ref={chatButtonRef}
            className={`w-full md:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm
                     flex items-center justify-center hover:bg-indigo-700 ${
                       subStep === 3 ? 'ring-2 ring-indigo-300' : ''
                     }`}
          >
            <MessageSquare className="mr-2" size={18} />
            {t('onboarding_dashboard_chat_button')}
          </button>
        </div>

        {/* Tooltips for each step */}
        {subStep === 0 && (
          <OnboardingTooltip
            title={t('onboarding_dashboard_overview_tooltip_title')}
            description={t('onboarding_dashboard_overview_tooltip_desc')}
            targetRef={overviewRef}
            position="bottom left"
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
            position="bottom left"
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
            position="top"
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
            position="far-top right"
            showPrevious={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
};
