import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { OnboardingTooltip } from '../OnboardingTooltip';
import { CheckCircle, FileText, Upload } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const ProjectWizardSteps: React.FC = () => {
  const { t } = useTranslation('common');
  const { nextStep, previousStep } = useOnboarding();
  const [subStep, setSubStep] = useState(0);
  const [tooltipStep, setTooltipStep] = useState(0);

  // Refs for highlighting elements
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const industryFieldRef = useRef<HTMLSelectElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);
  const assistantButtonRef = useRef<HTMLButtonElement>(null);
  const dimensionBoxRef = useRef<HTMLDivElement>(null);
  const progressPanelRef = useRef<HTMLDivElement>(null);
  const stageOptionRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (subStep === 1 && tooltipStep < 3) {
      setTooltipStep(tooltipStep + 1);
    } else if (subStep < 3) {
      setSubStep(subStep + 1);
      setTooltipStep(0);
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (subStep === 1 && tooltipStep > 0) {
      setTooltipStep(tooltipStep - 1);
    } else if (subStep > 0) {
      setSubStep(subStep - 1);
      setTooltipStep(0);
    } else {
      previousStep();
    }
  };

  const renderSubStep = () => {
    switch (subStep) {
      case 0: // Basic Info
        return (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">{t('onboarding_wizard_step1_title')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('onboarding_wizard_project_name_label')}
                  </label>
                  <input
                    ref={nameFieldRef}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             ring-4 ring-blue-300 ring-offset-2"
                    placeholder={t('onboarding_wizard_project_name_placeholder')}
                    defaultValue="AI Fitness App"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('onboarding_wizard_industry_label')}
                  </label>
                  <select
                    ref={industryFieldRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="technology"
                  >
                    <option value="">{t('onboarding_wizard_industry_placeholder')}</option>
                    <option value="technology">{t('onboarding_wizard_industry_technology')}</option>
                    <option value="healthcare">{t('onboarding_wizard_industry_healthcare')}</option>
                    <option value="finance">{t('onboarding_wizard_industry_finance')}</option>
                  </select>
                </div>
              </div>
            </div>

            <OnboardingTooltip
              title={t('onboarding_wizard_basic_info_tooltip_title')}
              description={t('onboarding_wizard_basic_info_tooltip_desc')}
              targetRef={nameFieldRef}
              position="right"
              showPrevious={true}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </>
        );

      case 1: // Description Assistant
        return (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
              <h2 className="text-xl font-semibold mb-4">{t('onboarding_wizard_step2_title')}</h2>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    ref={dimensionBoxRef}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
                  >
                    <p className="text-sm text-blue-800">
                      <strong>{t('onboarding_wizard_dimension_label')}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {t('onboarding_wizard_dimension_desc')}
                    </p>
                  </div>

                  <textarea
                    ref={descriptionFieldRef}
                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder={t('onboarding_wizard_description_placeholder')}
                    defaultValue="Our AI-powered fitness app solves the problem of..."
                  />

                  <button
                    ref={assistantButtonRef}
                    className="mt-2 text-blue-600 text-sm hover:text-blue-700
                             ring-4 ring-blue-300 rounded px-2 py-1"
                  >
                    {t('onboarding_wizard_show_assistant')}
                  </button>
                </div>

                <div
                  ref={progressPanelRef}
                  className="w-64 bg-gray-50 rounded-lg p-4"
                >
                  <h3 className="font-medium mb-3">{t('onboarding_wizard_coverage_progress')}</h3>
                  <div className="space-y-2">
                    {[
                      t('onboarding_wizard_problem'),
                      t('onboarding_wizard_solution'),
                      t('onboarding_wizard_target_market'),
                      t('onboarding_wizard_business_model'),
                      t('onboarding_wizard_competition'),
                      t('onboarding_wizard_usp')
                    ].map((dim, idx) => (
                        <div key={dim} className="flex items-center text-sm">
                          <CheckCircle
                            className={`w-4 h-4 mr-2 ${idx < 2 ? 'text-green-500' : 'text-gray-300'}`}
                          />
                          <span className={idx < 2 ? 'text-green-700' : 'text-gray-500'}>
                            {dim}
                          </span>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    {t('onboarding_wizard_coverage_complete')}
                  </p>
                </div>
              </div>
            </div>

            {/* Tooltip 1: Dimension Box */}
            {tooltipStep === 0 && (
              <OnboardingTooltip
                title={t('onboarding_wizard_dimensions_tooltip_title')}
                description={t('onboarding_wizard_dimensions_tooltip_desc')}
                targetRef={dimensionBoxRef}
                position="bottom right"
                showPrevious={true}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}

            {/* Tooltip 2: Description Field */}
            {tooltipStep === 1 && (
              <OnboardingTooltip
                title={t('onboarding_wizard_description_area_tooltip_title')}
                description={t('onboarding_wizard_description_area_tooltip_desc')}
                targetRef={descriptionFieldRef}
                position="right center"
                showPrevious={true}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}

            {/* Tooltip 3: Assistant Button */}
            {tooltipStep === 2 && (
              <OnboardingTooltip
                title={t('onboarding_wizard_assistant_tooltip_title')}
                description={t('onboarding_wizard_assistant_tooltip_desc')}
                targetRef={assistantButtonRef}
                position="right"
                showPrevious={true}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}

            {/* Tooltip 4: Progress Panel */}
            {tooltipStep === 3 && (
              <OnboardingTooltip
                title={t('onboarding_wizard_progress_tooltip_title')}
                description={t('onboarding_wizard_progress_tooltip_desc')}
                targetRef={progressPanelRef}
                position="left"
                showPrevious={true}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
          </>
        );

      case 2: // Stage Selection
        return (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
              <h2 className="text-xl font-semibold mb-4">{t('onboarding_wizard_step3_title')}</h2>

              <p className="text-gray-600 mb-6">
                {t('onboarding_wizard_stage_label')}
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div
                  ref={stageOptionRef}
                  className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer
                           hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="ml-3 font-medium">{t('onboarding_wizard_stage_idea')}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('onboarding_wizard_stage_idea_desc')}
                  </p>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer
                              hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="ml-3 font-medium">{t('onboarding_wizard_stage_prototype')}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('onboarding_wizard_stage_prototype_desc')}
                  </p>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer
                              hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="ml-3 font-medium">{t('onboarding_wizard_stage_mvp')}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('onboarding_wizard_stage_mvp_desc')}
                  </p>
                </div>
              </div>
            </div>

            <OnboardingTooltip
              title={t('onboarding_wizard_stage_tooltip_title')}
              description={t('onboarding_wizard_stage_tooltip_desc')}
              targetRef={stageOptionRef}
              position="bottom"
              showPrevious={true}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </>
        );

      case 3: // Summary
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-4">{t('onboarding_wizard_step4_title')}</h2>

            <p className="text-gray-600 mb-6">
              {t('onboarding_wizard_success_desc')}
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-blue-900 mb-2">{t('onboarding_wizard_success_next')}</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• {t('onboarding_wizard_success_step1')}</li>
                <li>• {t('onboarding_wizard_success_step2')}</li>
                <li>• {t('onboarding_wizard_success_step3')}</li>
                <li>• {t('onboarding_wizard_success_step4')}</li>
              </ul>
            </div>

            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors w-full"
            >
              {t('onboarding_continue')}
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pt-20">
      <AnimatePresence mode="wait">
        {renderSubStep()}
      </AnimatePresence>
    </div>
  );
};
