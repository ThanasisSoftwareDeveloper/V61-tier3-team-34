import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

/**
 * Returns a server-side Supabase client using the service role key.
 * Only ever import this from server code (API routes), never from
 * client components — the service role key must stay secret.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return supabase;
}
