// supa_database/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react'
import { useAuthContext } from './AuthProvider'
import AuthModal from './AuthModal'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback
}) => {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || <AuthModal isOpen={true} onClose={() => {}} />
  }

  return <>{children}</>
}
