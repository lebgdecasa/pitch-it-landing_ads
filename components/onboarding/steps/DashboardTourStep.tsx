import React, { useRef, useEffect } from 'react';
import { OnboardingTooltip } from '../OnboardingTooltip';
import { useOnboarding } from '../OnboardingProvider';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const DashboardTourStep: React.FC = () => {
  const { t } = useTranslation('common');
  const { nextStep, previousStep, currentStep } = useOnboarding();
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Simulate dashboard with highlighted button
  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 pt-20">
      <div className="w-full max-w-6xl mx-auto p-8">
        {/* Mock Dashboard */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6">{t('onboarding_dashboard_mock_title')}</h1>

          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">{t('onboarding_dashboard_mock_no_projects')}</p>
            <button
              ref={createButtonRef}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto
                         ring-4 ring-blue-300 ring-offset-4 animate-pulse"
            >
              <PlusCircle className="mr-2" size={20} />
              {t('onboarding_dashboard_mock_create_button')}
            </button>
          </div>
        </div>

        <OnboardingTooltip
          title={t('onboarding_dashboard_tour_title')}
          description={t('onboarding_dashboard_tour_desc')}
          targetRef={createButtonRef}
          position="bottom"
          showPrevious={true}
          onNext={nextStep}
          onPrevious={previousStep}
        />
      </div>
    </div>
  );
};
