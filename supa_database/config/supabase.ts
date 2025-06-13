import { createBrowserClient } from '@supabase/ssr'; // SupabaseClientOptions is not directly used from here for createBrowserClient
import { Database } from '../types/database';
import { SupabaseClient, createClient, SupabaseClientOptions } from '@supabase/supabase-js'; // Import SupabaseClientOptions here
import { type CookieOptions, createServerClient as createSsrServerClient } from '@supabase/ssr'; // Combined imports
import { type NextApiRequest, type NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Augment the global namespace to declare our custom global variable for the client
declare global {
  // eslint-disable-next-line no-var
  var __globalSupabaseClientInstance: SupabaseClient<Database> | undefined;
}

let supabaseSingleton: SupabaseClient<Database>;

// Client options for the browser client
// For createBrowserClient, the options type is inferred or part of its own signature,
// not directly SupabaseClientOptions from '@supabase/supabase-js' in the same way.
// However, the structure is similar.
const browserClientOptions = { // Options for createBrowserClient
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // cookies: { /* If using custom cookie handling with ssr client */ }
};

if (process.env.NODE_ENV === 'production') {
  supabaseSingleton = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, browserClientOptions);
} else {
  if (!global.__globalSupabaseClientInstance) {
    console.log('Creating new Supabase browser client instance (development) via config/supabase.ts');
    global.__globalSupabaseClientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, browserClientOptions);
  }
  supabaseSingleton = global.__globalSupabaseClientInstance;
}

export const supabase = supabaseSingleton;

// Server-side client for API routes (admin privileges)
export const createServerSupabaseClient = () => {
  // This uses createClient from '@supabase/supabase-js'
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
};

// Server-side client for API routes (with user context)
export function createServerSupabaseClientWithUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return createSsrServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          // res.setHeader('Set-Cookie', `${name}=${value}; Path=${options.path}; Max-Age=${options.maxAge}; HttpOnly=${options.httpOnly}; SameSite=${options.sameSite}; Secure=${options.secure}`);
          // Simplified setHeader, specific attributes can be added if needed or use a cookie library
          const cookieParts = [`${name}=${value}`];
          if (options.path) cookieParts.push(`Path=${options.path}`);
          if (options.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
          if (options.httpOnly) cookieParts.push('HttpOnly');
          if (options.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
          if (options.secure) cookieParts.push('Secure');
          res.setHeader('Set-Cookie', cookieParts.join('; '));
        },
        remove(name: string, options: CookieOptions) {
          // res.setHeader('Set-Cookie', `${name}=; Path=${options.path}; Max-Age=0; HttpOnly=${options.httpOnly}; SameSite=${options.sameSite}; Secure=${options.secure}`);
          const cookieParts = [`${name}=`];
          if (options.path) cookieParts.push(`Path=${options.path}`);
          cookieParts.push('Max-Age=0'); // Expire the cookie
          if (options.httpOnly) cookieParts.push('HttpOnly');
          if (options.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
          if (options.secure) cookieParts.push('Secure');
          res.setHeader('Set-Cookie', cookieParts.join('; '));
        },
      },
    }
  );
}
