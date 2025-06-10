// supa_database/utils/supabase/apiClient.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '../../types/database'; // Path from supa_database/utils/supabase/apiClient.ts to supa_database/types/database.ts

export function createSupabaseAPIClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return req.cookies[name];
        },
        set: (name: string, value: string, options: CookieOptions) => {
          const cookieOptions = { ...options, path: options.path || '/' };
          res.setHeader('Set-Cookie', serialize(name, value, cookieOptions));
        },
        remove: (name: string, options: CookieOptions) => {
          const cookieOptions = { ...options, path: options.path || '/', maxAge: 0 };
          res.setHeader('Set-Cookie', serialize(name, '', cookieOptions));
        },
      },
    }
  );
}
