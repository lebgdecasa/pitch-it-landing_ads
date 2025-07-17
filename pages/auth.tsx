// pages/auth.tsx
import React from 'react';
import AuthForm from '../supa_database/components/AuthForm';
import { AuthProvider } from '../supa_database/components/AuthProvider';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

type Props = {
  // Add any other props you might need from getStaticProps
};

const AuthPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = () => {
  const router = useRouter();
  const { mode } = router.query;

  // Determine initialMode based on query param, default to 'signin'
  const initialMode = mode === 'signup' ? 'signup' : 'signin';

  return (
    <>
      <Head>
        <title>Authentication | NexTraction</title>
        <meta name="description" content="Authentication page for NexTraction" />
      </Head>
      <AuthProvider>
        <main className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen bg-gray-50">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 sr-only">Authentication</h1>
          <AuthForm initialMode={initialMode} />
        </main>
      </AuthProvider>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

export default AuthPage;
