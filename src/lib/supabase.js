import { createClient } from '@supabase/supabase-js';

export function getSupabaseConfig(env = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {})) {
  const runtimeEnv = env && typeof env === 'object' ? env : {};

  return {
    url: runtimeEnv.VITE_SUPABASE_URL || '',
    anonKey: runtimeEnv.VITE_SUPABASE_ANON_KEY || '',
  };
}

export function isSupabaseConfigured(config = getSupabaseConfig()) {
  return Boolean(config.url && config.anonKey);
}

const config = getSupabaseConfig();

export const supabase = isSupabaseConfigured(config)
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabaseEnabled = Boolean(supabase);
