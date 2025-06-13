// supa_database/utils/supabase/server-component-client.ts
import { cookies as nextCookies } from 'next/headers';
import { createServerClient as createSsrServerClient, type CookieOptions } from '@supabase/ssr';
import { Database } from '../../types/database'; // Adjusted path

export const createServerComponentSupabaseClient = async () => {
  const cookieStore = await nextCookies();
  return createSsrServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
            // console.warn('Supabase-ssr: Failed to set cookie in Server Component:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
            // console.warn('Supabase-ssr: Failed to remove cookie in Server Component:', error);
          }
        },
      },
    }
  );
};
