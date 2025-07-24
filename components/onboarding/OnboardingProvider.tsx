import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { supabase } from '@/supa_database/config/supabase';

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  hasCompletedOnboarding: boolean | undefined;
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | undefined>(undefined);

  const TOTAL_STEPS = 6; // Adjust based on your flow

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('has_completed_onboarding')
        .eq('id', user.id)
        .single();

      if (data) {
        setHasCompletedOnboarding(data.has_completed_onboarding || false);
        // Auto-start onboarding only if user is on the onboarding page
        if (!data.has_completed_onboarding && router.pathname === '/onboarding') {
          setIsActive(true);
        }
      }
    };

    checkOnboardingStatus();
  }, [user, router.pathname]);

  const markOnboardingComplete = async () => {
    if (!user) return;

    await supabase
      .from('users')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);

    setHasCompletedOnboarding(true);
    setIsActive(false);
  };

  const value: OnboardingState = {
    isActive,
    currentStep,
    totalSteps: TOTAL_STEPS,
    hasCompletedOnboarding,
    startOnboarding: () => {
      setIsActive(true);
      setCurrentStep(0);
    },
    nextStep: () => {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        markOnboardingComplete();
      }
    },
    previousStep: () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    },
    skipOnboarding: () => {
      markOnboardingComplete();
    },
    resetOnboarding: () => {
      setCurrentStep(0);
      setIsActive(true);
    }
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
