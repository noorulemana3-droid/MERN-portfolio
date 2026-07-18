import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

let serverClient: SupabaseClient<Database> | null | undefined;

function getCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function isSupabaseConfigured() {
  return getCredentials() !== null;
}

/** Singleton server client. Prefers service role so inserts are reliable behind RLS. */
export function createServerClient(): SupabaseClient<Database> | null {
  if (serverClient !== undefined) {
    return serverClient;
  }

  const credentials = getCredentials();
  if (!credentials) {
    serverClient = null;
    return null;
  }

  serverClient = createClient<Database>(credentials.url, credentials.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return serverClient;
}
