import { useEffect } from 'react';
import * as ga from '@/lib/ga';
import { useAuthContext } from '@/supa_database/components/AuthProvider';

export const useOnboardingAnalytics = (stepName: string) => {
  const { user } = useAuthContext();

  useEffect(() => {
    // Track step view
    ga.trackOnboardingStep(stepName, 'viewed');

    // Track to database for internal analytics
    if (user) {

    }
  }, [stepName, user]);

  const trackAction = (action: string) => {
    ga.trackOnboardingStep(stepName, action);
  };

  return { trackAction };
};
