// pages/auth.tsx
import React from 'react';
import AuthForm from '../supa_database/components/AuthForm'; // Adjusted path as per standard project structure
import { AuthProvider } from '../supa_database/components/AuthProvider'; // To provide auth context
import Head from 'next/head';

const AuthPage: React.FC = () => {
  return (
    <><Head>
      <title>Authentication | NexTraction</title>
      <meta name="description" content="Authentication page for NexTraction" />
    </Head><AuthProvider> {/* Wrap with AuthProvider as AuthForm or its children might use useAuthContext */}
        <main className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen bg-gray-50">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 sr-only">Authentication</h1> {/* Added sr-only for now, can be made visible */}
          {/* The AuthForm component contains h2 for "Sign In", "Sign Up", etc. */}
          <AuthForm />
        </main>
      </AuthProvider></>
  );
};

export default AuthPage;
