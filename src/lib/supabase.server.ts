// ============================================================================
// Supabase Server Client for Joshi's Academy CMS
// Pure Supabase Backend — Replaces local MySQL completely
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (_serverClient) return _serverClient;

  const url =
    (typeof process !== "undefined" && process.env?.["SUPABASE_URL"]) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
    "https://gxpnboomkqwtmjlgygce.supabase.co";

  // Use service role key on server for full CMS access bypassing RLS, or fallback to publishable key
  const key =
    (typeof process !== "undefined" && (process.env?.["SUPABASE_SERVICE_ROLE_KEY"] || process.env?.["SUPABASE_PUBLISHABLE_KEY"])) ||
    (typeof import.meta !== "undefined" && (import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] as string)) ||
    "";

  _serverClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _serverClient;
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    const client = getSupabaseServerClient();
    return Reflect.get(client, prop, receiver);
  },
});
