import { createClient } from '@supabase/supabase-js';

// Fallback to the project's public keys if Vercel environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ctdgeqtwsrlorcgukzqk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AphWI-xDhZwqpWcwE-rdXQ_P7FlPvUj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
