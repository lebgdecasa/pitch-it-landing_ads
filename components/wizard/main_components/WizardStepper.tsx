import React from 'react';

interface WizardStepperProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    name: 'Basic Info',
    description: 'Project details',
  },
  {
    id: 2,
    name: 'Description',
    description: 'AI-assisted description',
  },
  {
    id: 3,
    name: 'Stage & Files',
    description: 'Project stage',
  },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div className={`group ${step.id < currentStep ? 'border-blue-600' : step.id === currentStep ? 'border-gray-200' : 'border-gray-200'} pl-4 py-2 border-l-4 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}>
              <span className="flex items-center text-sm font-medium">
                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${
                  step.id < currentStep
                    ? 'bg-blue-600 text-white'
                    : step.id === currentStep
                    ? 'border-2 border-blue-600 text-blue-600'
                    : 'border-2 border-gray-300 text-gray-500'
                }`}>
                  {step.id < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
                <span className={`ml-3 ${
                  step.id < currentStep
                    ? 'text-blue-600'
                    : step.id === currentStep
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </span>
              <span className="mt-0.5 ml-9 flex items-center text-xs text-gray-500">
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
