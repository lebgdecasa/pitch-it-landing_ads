// pages/api/auth/session.ts
import { createPagesServerClient } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '../../../supa_database/types/database'; // Corrected path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Create a Supabase client configured to use cookies
  const supabase = createPagesServerClient<Database>({ req, res });

  try {
    // supabase.auth.getSession() could also be used if you need the full session object
    // including access_token. For just the user, getUser() is more direct.
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      // This error might occur if the JWT is malformed or other issues,
      // but typically if there's no valid session, user will just be null.
      console.error('Error fetching user for session endpoint:', userError.message);
      return res.status(userError.status || 500).json({ error: userError.message });
    }

    if (!user) {
      // No active session, or user could not be retrieved based on the cookie.
      return res.status(200).json({ user: null, session: null });
    }

    // If user exists, fetch the full session details as well.
    // This is useful if the client needs access_token or other session metadata.
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error('Error fetching session details (user was fetched):', sessionError.message);
        // If we found a user but can't get the session, this is an odd state.
        // Decide how to handle: return user with null session, or error out?
        // For now, returning user with null session to indicate partial success.
        return res.status(200).json({ user, session: null, error: 'Failed to fetch full session details.' });
    }

    return res.status(200).json({ user, session: currentSession });

  } catch (e: any) {
    console.error('Unexpected error fetching session:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
