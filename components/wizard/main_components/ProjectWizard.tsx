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

interface ProjectData {
  projectName: string;
  industry: string;
  description: string;
  stage: string;
  hasFiles?: boolean;
}

export const ProjectWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      router.push('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
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
    <div className="max-w-2xl mx-auto">
      <WizardStepper currentStep={currentStep} />
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
};
