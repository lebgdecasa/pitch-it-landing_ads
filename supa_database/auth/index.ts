// supa_database/auth/index.ts
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabaseBrowserClient as supabase } from '../utils/supabase/client';
import { UserProfile } from '../types/database';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
});

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  const checkUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setAuthState({ user: data.user, profile: data.profile, loading: false });
      } else {
        // No active session or an error occurred
        setAuthState({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error("Error fetching auth session:", error);
      setAuthState({ user: null, profile: null, loading: false });
    }
  }, []);

  useEffect(() => {
    // Check user on initial load
    checkUser();

    // Set up a listener for auth changes. This will handle login/logout events in other tabs.
    // It simply re-triggers our reliable server check.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkUser]);

  return authState;
};


// Get user profile from database
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase // supabase is now supabaseBrowserClient
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

// Sign up, Sign in, Sign out, validateAccessCode are now handled by API routes.
// Client-side direct calls for these are removed.

// Reset password - This is a client-side action that sends an email via Supabase.
// It does not directly manage session cookies like sign-in/sign-up API routes do.
// So, it can remain as a direct client-side Supabase call.
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

// Validate access code - Removed, handled by /api/auth/signup

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

export { supabase };
