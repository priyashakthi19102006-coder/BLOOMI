import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verify that variables are present and not standard placeholder values
export const isSupabaseConfigured = Boolean(
  rawUrl &&
    rawAnonKey &&
    !rawUrl.includes('your-project-ref') &&
    !rawAnonKey.includes('your-anon-key')
)

/**
 * Strongly typed Supabase Client for BLOOMI.
 * Initialised with public anonymous key.
 * 
 * SECURITY NOTICE:
 * The Supabase Service Role Key is NEVER used or exposed in frontend code.
 * Privileged actions (such as resolving student registration numbers to provisioned accounts)
 * are handled exclusively server-side via Supabase Edge Functions.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(rawUrl as string, rawAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/**
 * Helper to ensure supabase is ready, or provide an actionable error.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please set valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }
  return supabase
}
