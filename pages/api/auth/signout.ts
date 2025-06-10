// pages/api/auth/signout.ts
import { createPagesServerClient } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '../../../supa_database/types/database'; // Corrected path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Create a Supabase client configured to use cookies
  const supabase = createPagesServerClient<Database>({ req, res });

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Log the error for server-side observability
      console.error('Sign-out error:', error.message);
      return res.status(error.status || 500).json({ error: error.message });
    }

    // supabase.auth.signOut() on the server with @supabase/ssr
    // clears the auth cookie automatically by setting an expired cookie.
    return res.status(200).json({ message: 'Sign-out successful' });

  } catch (e: any) {
    console.error('Unexpected error during sign-out:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
