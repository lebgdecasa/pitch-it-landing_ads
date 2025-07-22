// components/wizard/main_components/ProjectWizard.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider'; // Import the auth context
import { BasicInfoStep } from './BasicInfoStep';
import PitchDescriptionAssistant from '../PitchDescriptionAssistant';
import { StageUploadStep } from './StageUploadStep';
import { WizardStepper } from './WizardStepper';
import { AnalysisProgress } from './AnalysisProgress';
import { createProject } from '@/supa_database/utils/projects';
import axios from 'axios';
import { ProjectStage } from '@/types';
import Modal from '@/components/ui/Modal'; // Import Modal
import { useTranslation } from 'next-i18next';

interface ProjectData {
  projectName: string;
  industry: string;
  description: string;
  stage: string;
  hasFiles?: boolean;
}

interface ProjectWizardProps {
  isDummy?: boolean;
}

export const ProjectWizard: React.FC<ProjectWizardProps> = ({ isDummy = false }) => {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const router = useRouter();
  const { user } = useAuthContext(); // Get the user from the context

  const [data, setData] = React.useState<ProjectData>({
    projectName: '',
    industry: '',
    description: '',
    stage: '',
    hasFiles: false
  });

  const handleSubmit = async () => {
    if (isDummy) {
      setIsSubmitting(true);
      // In dummy mode, we don't call the API or show the modal.
      // The Shepherd.js tour will handle moving to the next view.
      console.log("Onboarding: Submission simulated. No API call made.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 🚫 Remove the call to createProject

      // ✅ Send everything directly to FastAPI
      await axios.post('/proxy/start_analysis', {
        name: data.projectName,
        industry: data.industry,
        stage: data.stage,
        product_description: data.description,
        user_id: user?.id,
      });

      // Redirect user to dashboard after analysis starts
      setIsModalOpen(true); // Open the modal instead of redirecting
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(t('error_unexpected_submission'));
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={{ projectName: data.projectName, industry: data.industry }}
            onDataChange={(newData) => setData({ ...data, ...newData })}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <PitchDescriptionAssistant
            value={data.description}
            onChange={(newDescription: string) =>
              setData({ ...data, description: newDescription })
            }
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <StageUploadStep
            data={{ stage: data.stage, hasFiles: data.hasFiles }}
            onDataChange={(newData) => setData({ ...data, ...newData })}
            onNext={handleSubmit}
            onBack={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };
  if (showAnalysis) {
    return <AnalysisProgress />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl">
      <WizardStepper currentStep={currentStep} />
      <div className="mt-8">{renderStep()}</div>
      <Modal isOpen={isModalOpen} onClose={() => router.push('/dashboard')} titleId="submission-success-modal-title">
        <div className="text-center">
          <h2 id="submission-success-modal-title" className="text-lg font-semibold">{t('modal_submission_success_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('modal_submission_success_message')}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('modal_submission_success_button')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
