// supa_database/utils/supabase/client.ts
import { createPagesBrowserClient } from '@supabase/ssr';
import { Database } from '../../types/database'; // Corrected path

// This client is for use in browser environments (client components).
// It uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from environment variables.
export const supabaseBrowserClient = createPagesBrowserClient<Database>();
