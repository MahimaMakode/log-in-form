import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL;
const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key || url.includes('YOUR_PROJECT') || key.includes('REPLACE_ME')) {
  throw new Error('Add your Supabase URL and publishable key to .env, then restart npm run dev.');
}
if (key.startsWith('sb_secret_')) {
  throw new Error('Use a publishable key, never a secret/service-role key in browser code.');
}

// Shared singleton: import { supabase } from './client.js';
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
});
