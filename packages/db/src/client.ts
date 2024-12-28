import { createBrowserClient } from '@supabase/ssr';
import { Database } from './supabase.types';

export function useSupabaseBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}