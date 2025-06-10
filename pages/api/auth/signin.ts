// pages/api/auth/signin.ts
import { createPagesServerClient } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '../../../supa_database/types/database'; // Corrected path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Create a Supabase client configured to use cookies
  // This will automatically read and write auth cookies to the request/response.
  const supabase = createPagesServerClient<Database>({ req, res });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (error) {
      // Log the error for server-side observability if needed
      console.error('Sign-in error:', error.message);
      // Return a generic message or the specific error message.
      // Be cautious about exposing too much detail in error messages to the client.
      return res.status(error.status || 401).json({ error: error.message });
    }

    // If signInWithPassword is successful, @supabase/ssr's createPagesServerClient
    // automatically handles setting the auth cookie in the response.
    // The user object can be returned if needed, or just a success message.
    // data.session is also available here if needed by the client.
    return res.status(200).json({ user: data.user, message: 'Sign-in successful' });

  } catch (e: any) {
    console.error('Unexpected error during sign-in:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
