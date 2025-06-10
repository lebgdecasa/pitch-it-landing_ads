// supa_database/auth/index.ts
import { useState, useEffect, useCallback } from 'react'
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js'; // Added AuthChangeEvent
import { supabaseBrowserClient as supabase } from '../utils/supabase/client';
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
    session: null,
  });

  const fetchUserProfile = useCallback(async (user: User | null) => {
    if (user) {
      const profile = await getUserProfile(user.id);
      setAuthState(prev => ({ ...prev, profile, user, loading: false }));
    } else {
      setAuthState(prev => ({ ...prev, user: null, profile: null, loading: false }));
    }
  }, []);

  const fetchInitialSession = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await fetch('/api/auth/session');

      if (!response.ok) {
        // If API returns error or if session is just not there (e.g. user is null)
        console.warn('Failed to fetch initial session or no active session found.');
        setAuthState(prev => ({ ...prev, user: null, session: null, profile: null, loading: false }));
        return;
      }

      const { user, session } = await response.json();

      if (user && session) {
        setAuthState(prev => ({ ...prev, user, session, loading: true })); // Keep loading while profile fetches
        await fetchUserProfile(user);
      } else {
        await fetchUserProfile(null); // Clear user, profile and set loading false
      }
    } catch (error) {
      console.error('Error fetching initial session:', error);
      await fetchUserProfile(null); // Clear user, profile and set loading false
    }
  }, [fetchUserProfile]);


  useEffect(() => {
    fetchInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => { // Added explicit types
        // This listener reacts to client-side auth events (e.g., tab sync, token refresh, explicit client-side signOut)
        // It's also a fallback if the initial /api/auth/session call is missed or fails.
        // SIGNED_IN: Often handled by redirect after API call, but this syncs tabs or recovers session.
        // SIGNED_OUT: If API call to signout succeeded, cookie is cleared. This handles client-side state sync.
        // TOKEN_REFRESHED: Updates session.
        // USER_UPDATED: Updates user.

        // Update authState with the latest session and user information
        // Set loading to true before fetching profile to indicate state is being updated
        setAuthState(prev => ({ ...prev, session, user: session?.user ?? null, loading: true }));

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          // Handles SIGNED_OUT or cases where session becomes null
          await fetchUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchInitialSession, fetchUserProfile]);

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
