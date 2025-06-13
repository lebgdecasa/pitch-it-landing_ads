// supa_database/components/AuthProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '../auth'

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  checkUser: async () => {} // Added default checkUser function
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
