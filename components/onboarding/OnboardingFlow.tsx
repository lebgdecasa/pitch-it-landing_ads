import React from 'react';
import { useOnboarding } from './OnboardingProvider';
import { OnboardingOverlay } from './OnboardingOverlay';
import { OnboardingProgress } from './OnboardingProgress';
import { WelcomeStep } from './steps/WelcomeStep';
import { DashboardTourStep } from './steps/DashboardTourStep';
import { ProjectWizardSteps } from './steps/ProjectWizardSteps';
import { WaitingExplanationStep } from './steps/WaitingExplanationStep';
import { ProjectDashboardSteps } from './steps/ProjectDashboardSteps';
import { ChatDemoStep } from './steps/ChatDemoStep';

const ONBOARDING_STEPS = [
  { component: WelcomeStep, name: 'Welcome' },
  { component: DashboardTourStep, name: 'Dashboard Tour' },
  { component: ProjectWizardSteps, name: 'Project Creation' },
  { component: WaitingExplanationStep, name: 'Analysis Process' },
  { component: ProjectDashboardSteps, name: 'Project Dashboard' },
  { component: ChatDemoStep, name: 'Chat with Personas' }
];

export const OnboardingFlow: React.FC = () => {
  const { isActive, currentStep } = useOnboarding();

  if (!isActive) return null;

  const CurrentStepComponent = ONBOARDING_STEPS[currentStep]?.component;

  return (
    <OnboardingOverlay>
      <OnboardingProgress />
      {CurrentStepComponent && <CurrentStepComponent />}
    </OnboardingOverlay>
  );
};
