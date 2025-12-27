import { createClient as createSupabaseClient } from '@supabase/supabase-js@2';
import { projectId, publicAnonKey } from './info.tsx';

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    
    // Configure Supabase with localStorage for persistent sessions
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });
  }
  return supabaseInstance;
}