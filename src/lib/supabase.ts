// Origin: agent
// Cliente único do Supabase (Vite).
// Fellows: só importam `supabase` nos services — não recriam o client.
// URL/chave vêm do `.env` (nunca commitar `.env`; nunca usar service_role no front).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example → .env and fill the classroom keys.',
  );
}

// `createClient` throws "supabaseUrl is required." on an empty URL. That throw ran at
// import time and left the whole app blank (a build without the Supabase env, 2026-11-05).
// Without the env, use an unreachable placeholder: the app mounts and each query fails
// on its own, where the React Query error states handle it.
const FALLBACK_URL = 'http://localhost:0';
const FALLBACK_KEY = 'supabase-not-configured';

export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY,
);
