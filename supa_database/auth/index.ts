// supa_database/auth/index.ts
import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import { UserProfile } from '../types/database'

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  session: Session | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    session: null
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await getUserProfile(session.user.id)
        setAuthState({
          user: session.user,
          profile,
          loading: false,
          session
        })
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            loading: false,
            session
          })
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            session: null
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return authState
}

// Get user profile from database
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

// Define types for RPC functions
interface AccessCodeValidation {
  valid: boolean
  university: string | null
}

// Sign up with email/password
export const signUp = async (
  email: string,
  password: string,
  accessCode?: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    // Validate access code if provided
    if (accessCode) {
      const rpcValidateResponse = await (supabase.rpc as any)('validate_access_code', { input_code: accessCode }).single();
      const validation = rpcValidateResponse.data as AccessCodeValidation | null;
      const rpcError = rpcValidateResponse.error;

      if (rpcError || !validation?.valid) {
        return {
          user: null,
          error: {
            message: 'Invalid or expired access code',
            name: 'AuthError',
            status: 400
          } as AuthError
        };
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          access_code: accessCode
        }
      }
    })

    // If signup successful and access code provided, use it
    if (data.user && accessCode) {
      await (supabase.rpc as any)('use_access_code', {
        input_code: accessCode,
        user_id: data.user.id
      });
    }

    return { user: data.user, error }
  } catch (error) {
    return {
      user: null,
      error: error as AuthError
    }
  }
}

// Sign in with email/password
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  // Update last login
  if (data.user) {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)
  }

  return { user: data.user, error }
}

// Sign in with magic link
export const signInWithMagicLink = async (
  email: string,
  redirectTo?: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`
    }
  })

  return { error }
}

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Reset password
export const resetPassword = async (
  email: string,
  redirectTo?: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`
  })

  return { error }
}

// Update password
export const updatePassword = async (
  newPassword: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  return { error }
}

// Validate access code
export const validateAccessCode = async (code: string): Promise<{ valid: boolean; university: string | null }> => {
  try {
    const response = await (supabase.rpc as any)('validate_access_code', { input_code: code }).single();

    if (response.error) throw response.error;
    const data = response.data as AccessCodeValidation | null;

    return {
      valid: data?.valid || false,
      university: data?.university || null
    };
  } catch (error) {
    console.error('Error in validateAccessCode RPC:', error);
    return { valid: false, university: null };
  }
}

// Check if user has credits
export const hasCredits = (profile: UserProfile | null): boolean => {
  if (!profile) return false
  return profile.credits_remaining > 0 || profile.subscription_tier !== 'free'
}

// Deduct credits
export const deductCredits = async (
  userId: string,
  amount: number = 1
): Promise<boolean> => {
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('credits_remaining, subscription_tier')
      .eq('id', userId)
      .single()

    if (!profile) return false

    // Premium/Enterprise users don't consume credits
    if (profile.subscription_tier !== 'free') return true

    // Check if user has enough credits
    if (profile.credits_remaining < amount) return false

    // Deduct credits
    const { error } = await supabase
      .from('users')
      .update({ credits_remaining: profile.credits_remaining - amount })
      .eq('id', userId)

    return !error
  } catch (error) {
    console.error('Error deducting credits:', error)
    return false
  }
}
