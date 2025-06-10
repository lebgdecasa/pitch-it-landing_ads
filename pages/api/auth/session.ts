// pages/api/auth/session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseAPIClient } from '@/supa_database/utils/supabase/apiClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const supabase = createSupabaseAPIClient(req, res);

  try {
    // 1. Securely get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(200).json({ user: null, profile: null });
    }

    // 2. User is authenticated, now fetch their profile from the public.users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // This is a server-side issue if an auth user doesn't have a public profile.
      console.error('Error fetching profile for user:', user.id, profileError.message);
      // Return the user so the app knows they're logged in, but with a null profile.
      return res.status(200).json({ user, profile: null });
    }

    // 3. Return both the secure user object and their profile
    return res.status(200).json({ user, profile });

  } catch (e: any) {
    console.error('Unexpected error in /api/auth/session:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
