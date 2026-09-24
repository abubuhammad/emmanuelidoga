import test from 'node:test';
import assert from 'node:assert/strict';
import { isSupabaseConfigured, getSupabaseConfig } from './supabase.js';

test('Supabase config is detected from environment', () => {
  const env = {
    VITE_SUPABASE_URL: 'https://example.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'anon-key',
  };

  const config = getSupabaseConfig(env);
  assert.equal(config.url, 'https://example.supabase.co');
  assert.equal(config.anonKey, 'anon-key');
  assert.equal(isSupabaseConfigured(config), true);
});

test('Supabase config is considered missing if required values are absent', () => {
  const config = getSupabaseConfig({});
  assert.equal(isSupabaseConfigured(config), false);
});
