import React from 'react';
import { BasicInfoStep } from './BasicInfoStep';
import PitchDescriptionAssistant  from '../PitchDescriptionAssistant';
import { StageUploadStep } from './StageUploadStep';
import { WizardStepper } from './WizardStepper';
import { AnalysisProgress } from './AnalysisProgress';

interface ProjectData {
  projectName: string;
  industry: string;
  description: string;
  stage: string;
  hasFiles?: boolean;
}

export const ProjectWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showAnalysis, setShowAnalysis] = React.useState(false);
  const [data, setData] = React.useState<ProjectData>({
    projectName: '',
    industry: '',
    description: '',
    stage: '',
    hasFiles: false
  });

  const handleSubmit = () => {
    // Show analysis progress instead of direct navigation
    setShowAnalysis(true);
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
