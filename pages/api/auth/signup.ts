// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// import { Database } from '../../../supa_database/types/database'; // Inferred
import { createSupabaseAPIClient } from '../../../../supa_database/utils/supabase/apiClient'; // Adjusted path

// Define types for RPC functions if not already globally available or in Database types
// This AccessCodeValidation might be better defined alongside the API client or in a shared types file if complex.
interface AccessCodeValidation {
  valid: boolean;
  university: string | null; // Or whatever your RPC returns, e.g. 'reason' for invalidity
  // Add any other properties returned by your validate_access_code RPC
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password, accessCode } = req.body;

  if (!email || !password || !accessCode) {
    return res.status(400).json({ error: 'Email, password, and access code are required' });
  }

  const supabase = createSupabaseAPIClient(req, res);

  try {
    // 1. Validate Access Code
    // Assumes 'validate_access_code' RPC is callable by the 'anon' role.
    const { data: rpcValidationResponse, error: validationError } = await supabase.rpc(
      'validate_access_code',
      { input_code: accessCode as string }
    ); // .single() is removed if rpc returns void or not a single object, or if the structure is different.
       // If your function returns a single row (e.g. SELECT is_valid, reason FROM validate_code($1)), .single() is appropriate.
       // Let's assume it returns an object like { "valid": true, "university": "some_uni", "reason": null } OR {"valid": false, "reason": "used"}

    if (validationError) {
      console.error('Access code validation RPC error:', validationError.message);
      return res.status(500).json({ error: 'Error validating access code: ' + validationError.message });
    }

    // The actual data structure depends on your RPC.
    // If rpcValidationResponse is the direct object (e.g. if not using .single() and it returns a single object in an array).
    // Or if .single() was used, rpcValidationResponse would be the object itself.
    // This casting needs to be robust based on actual RPC return.
    // Let's assume the RPC returns an object directly or .single() is appropriate and used.
    // For this example, let's assume the response from supabase.rpc is directly the object we need,
    // or if it's wrapped in an array and we need the first element.
    // If your RPC returns e.g. `SETOF record` or `TABLE(...)`, data will be an array.
    // If `RETURNS record` or `RETURNS json`, data might be an object.
    // Let's assume `validate_access_code` returns a single JSON object with `valid` and `university` (or similar) properties.
    // If `supabase.rpc().single()` is used, `rpcValidationResponse` is the object.
    // If not, and it returns a single row, `rpcValidationResponse` would be `[AccessCodeValidation]`.
    // The prompt example used .single(), so we'll align with that.
    const { data: singleValidationData, error: singleValidationError } = await supabase.rpc(
        'validate_access_code',
        { input_code: accessCode as string }
    ).single();


    if (singleValidationError) {
        console.error('Access code validation RPC .single() error:', singleValidationError.message);
        return res.status(500).json({ error: 'Error processing access code validation: ' + singleValidationError.message });
    }

    const typedValidationData = singleValidationData as AccessCodeValidation | null;


    if (!typedValidationData || !typedValidationData.valid) {
      let message = 'Invalid access code.';
      // Example: check a 'reason' or 'status' property from your RPC result
      if (typedValidationData && (typedValidationData.university === 'used' /* or typedValidationData.reason === 'used' */)) {
          message = 'Access code has already been used.';
      }
      return res.status(400).json({ error: message });
    }

    // 2. Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        // Example: Pass data to be stored in the raw_user_meta_data or similar
        // data: {
        //   full_name: 'Registered via API with Access Code',
        //   access_code_used: accessCode
        // }
      }
    });

    if (signUpError) {
      console.error('Sign-up error:', signUpError.message, signUpError.status, signUpError.name);
      return res.status(signUpError.status || 400).json({ error: signUpError.message });
    }

    if (!signUpData.user) {
        // This case should ideally be covered by signUpError, but as a safeguard:
        console.error('Sign-up successful but no user data returned.');
        return res.status(500).json({ error: 'Sign-up successful but no user data returned.' });
    }

    // Ensure user object and ID are present before proceeding
    if (signUpData.user && signUpData.user.id) {
        // 3. Mark Access Code as Used (if sign-up was successful)
        const { error: useCodeError } = await supabase.rpc(
          'use_access_code',
          {
            input_code: accessCode as string,
            user_id: signUpData.user.id
          }
        );

        if (useCodeError) {
          console.error(`Error marking access code ${accessCode} as used for user ${signUpData.user.id}: ${useCodeError.message}`);
          // This is a critical issue for backend data integrity.
          // Depending on policy, you might:
          // - Inform the user but consider signup "successful" (as user is created).
          // - Attempt to delete the newly created user to roll back (complex, potential race conditions).
          // - Add to a retry queue for `use_access_code`.
          // For now, we acknowledge the user is created but the code use failed to mark.
          // The client will receive the success message for signup.
        }
    } else {
        // This should not happen if signUpError was not thrown and signUpData.user was null.
        // Logging it for backend investigation.
        console.error('User ID missing after sign-up, cannot mark access code as used. User Data:', signUpData);
        // Not returning an error to client here as user might be created but email not confirmed.
        // The primary success message for signup is still relevant.
    }

    // Supabase Auth by default sends a confirmation email.
    // The user object in signUpData might be non-null, but session is often null until confirmation.
    return res.status(200).json({ message: 'Sign-up successful. Please check your email to confirm your account.' });

  } catch (e: any) {
    console.error('Unexpected error during sign-up:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
