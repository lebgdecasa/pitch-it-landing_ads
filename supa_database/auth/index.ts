// supa_database/auth/index.ts
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../config/supabase'; // Changed to use the unified client from config
import { UserProfile } from '../types/database';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  checkUser: () => Promise<void>; // Added checkUser
  fetchUserProfile: () => Promise<void>;
}

// This AuthContext is locally defined and likely not the one consumed by AuthProvider.tsx.
// The primary goal is to ensure useAuth returns the correct shape.
const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  checkUser: async () => {}, // Default async function for checkUser
  fetchUserProfile: async () => {},
});

export const useAuth = (): AuthState => {
  // Individual state hooks
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      }
    }
  }, []);

  const checkUser = useCallback(async () => {
    setLoading(true); // Set loading true at the beginning of the check
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
      } else {
        // No active session or an error occurred
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching auth session:", error);
      setUser(null);
      setProfile(null);
    }
    setLoading(false); // Set loading false at the end
  }, []);

  useEffect(() => {
    // Check user on initial load
    checkUser();

    // Set up a listener for auth changes. This will handle login/logout events in other tabs.
    // It simply re-triggers our reliable server check.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // When auth state changes (login, logout), re-check the user session from the server
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkUser]); // checkUser is stable due to useCallback

  // Return the individual states and the checkUser function
  return { user, profile, loading, checkUser, fetchUserProfile };
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
