import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/supa_database/auth';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user has already completed onboarding
    if ((user as any)?.has_completed_onboarding) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
