import { supabase } from '@/supa_database/config/supabase';

/**
 * Check if user has completed onboarding and return appropriate redirect path
 * @param userId - The user's ID
 * @returns Promise<string> - Either '/onboarding' or '/dashboard'
 */
export async function getRedirectPathAfterAuth(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('has_completed_onboarding')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if we can't determine the status
      return '/onboarding';
    }

    return data.has_completed_onboarding ? '/dashboard' : '/onboarding';
  } catch (error) {
    console.error('Error in getRedirectPathAfterAuth:', error);
    // Default to onboarding if there's an error
    return '/onboarding';
  }
}

/**
 * Check if user has completed onboarding synchronously from user object
 * @param user - The user object that may contain has_completed_onboarding
 * @returns string - Either '/onboarding' or '/dashboard'
 */
export function getRedirectPathFromUser(user: any): string {
  if (!user) return '/onboarding';

  // Check if user object has onboarding status
  if (user.has_completed_onboarding === true) {
    return '/dashboard';
  }

  return '/onboarding';
}
