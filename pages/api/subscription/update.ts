import type { NextApiRequest, NextApiResponse } from 'next';
// Import both client creators: one for user session, one for admin operations
import {
  createSupabaseClientForApiRoute,
  createServerSupabaseClient
} from '../../../supa_database/config/supabase';

// Define the expected request body - userId is removed
interface UpdateSubscriptionPayload {
  newPlan: string;
}

// Define valid plans - ideally this would come from a shared types definition
// or directly query the enum types from PostgreSQL if possible,
// but for now, we'll hardcode it based on init.sql
const VALID_PLANS = ['free', 'premium', 'enterprise'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 1. Create Supabase client with user context
  const supabaseUserClient = createSupabaseClientForApiRoute(req, res);

  // 2. Get authenticated user
  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();

  if (authError || !user) {
    console.error('Auth error:', authError);
    return res.status(401).json({ error: 'Unauthorized: User not authenticated.', details: authError?.message });
  }

  // User is authenticated, user.id is available
  const authenticatedUserId = user.id;

  try {
    const { newPlan } = req.body as UpdateSubscriptionPayload;

    // Validate input - userId is no longer in the body
    if (!newPlan) {
      return res.status(400).json({ error: 'newPlan is required in the request body.' });
    }

    if (!VALID_PLANS.includes(newPlan)) {
      return res.status(400).json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}` });
    }

    // Initialize Supabase admin client for the actual update operation
    const supabaseAdmin = createServerSupabaseClient();

    // Update user's subscription_tier in Supabase using the authenticatedUserId
    const { data, error: dbError } = await supabaseAdmin
      .from('users')
      .update({ subscription_tier: newPlan })
      .eq('id', authenticatedUserId) // Use ID from session
      .select();

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      return res.status(500).json({ error: 'Failed to update subscription', details: dbError.message });
    }

    if (!data || data.length === 0) {
      // This case might mean the user existed (authenticated) but their profile was not in the users table,
      // or simply that the plan was the same so no change was reported by .select() depending on DB behavior.
      // For a tier update, we expect to find the user if they are authenticated.
      return res.status(404).json({ error: 'User profile not found or no update was made (plan may be the same).' });
    }

    return res.status(200).json({ message: 'Subscription updated successfully.', user: data[0] });

  } catch (e: any) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Internal Server Error', details: e.message });
  }
}
