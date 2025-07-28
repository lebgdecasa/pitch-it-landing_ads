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
  restartOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, fetchUserProfile } = useAuthContext();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | undefined>(undefined);

  const TOTAL_STEPS = 6; // Adjust based on your flow

  useEffect(() => {
    // Sync with the profile from AuthContext
    if (profile !== undefined) {
      setHasCompletedOnboarding(profile?.has_completed_onboarding);
      if (profile?.has_completed_onboarding === false && router.pathname === '/onboarding') {
        setIsActive(true);
      }
    }
  }, [profile, router.pathname]);


  const markOnboardingComplete = async (shouldRedirect = false) => {
    if (!user) return;

    // Set state immediately for a responsive UI
    setIsActive(false);
    setHasCompletedOnboarding(true);

    await supabase
      .from('users')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);

    // Ensure the profile is updated before redirecting
    await fetchUserProfile();

    if (shouldRedirect) {
      router.push('/dashboard');
    }
  };

  const restartOnboarding = async () => {
    if (!user) return;

    try {
      // Set onboarding to false in the database
      const { error } = await supabase
        .from('users')
        .update({ has_completed_onboarding: false })
        .eq('id', user.id);

      if (error) throw error;

      // Refetch the user profile to update the auth context
      await fetchUserProfile();

      // Reset local state and redirect
      setHasCompletedOnboarding(false);
      setCurrentStep(0);
      setIsActive(true);
      router.push('/onboarding?force=true');
    } catch (error) {
      console.error('Error restarting onboarding:', error);
      // Optionally, show an error to the user
    }
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
        markOnboardingComplete(true); // Redirect on final step
      }
    },
    previousStep: () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    },
    skipOnboarding: async () => {
      if (user) {
        // Set state immediately for a responsive UI
        setIsActive(false);
        setHasCompletedOnboarding(true);

        // Wait for the database update to complete before doing anything else
        await supabase
          .from('users')
          .update({
            has_completed_onboarding: true,
            onboarding_skip_reason: 'user_skipped_at_overlay',
          })
          .eq('id', user.id);

        // Ensure the profile is updated before redirecting
        await fetchUserProfile();
      }

      // And finally, redirect to the dashboard
      router.push('/dashboard');
    },
    resetOnboarding: () => {
      setCurrentStep(0);
      setIsActive(true);
    },
    restartOnboarding,
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
