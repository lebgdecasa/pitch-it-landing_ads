import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from './OnboardingProvider';
import { Check } from 'lucide-react';

export const OnboardingProgress: React.FC = () => {
  const { currentStep, totalSteps } = useOnboarding();

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10001]">
      <div className="bg-white rounded-full shadow-lg p-3 min-w-[300px]">
        {/* Progress bar */}


        {/* Step indicators */}
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <Check size={14} />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`
                    w-10 h-0.5 mx-1
                    ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current step label */}
        
      </div>
    </div>
  );
};
