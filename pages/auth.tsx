// pages/auth.tsx
import React from 'react';
import AuthForm from '../supa_database/components/AuthForm'; // Adjusted path as per standard project structure
import { AuthProvider } from '../supa_database/components/AuthProvider'; // To provide auth context

const AuthPage: React.FC = () => {
  return (
    <AuthProvider> {/* Wrap with AuthProvider as AuthForm or its children might use useAuthContext */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen bg-gray-50">
        {/* Optional: Add a header or rely on a global Layout component */}
        {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Authentication</h1> */}
        <AuthForm />
      </div>
    </AuthProvider>
  );
};

export default AuthPage;
