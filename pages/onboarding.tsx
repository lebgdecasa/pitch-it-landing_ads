import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

export default function OnboardingPage() {
  const { profile, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user has already completed onboarding and not forcing
    if (profile?.has_completed_onboarding && router.query.force !== 'true') {
      router.push('/dashboard');
    }
  }, [profile, router]);

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
