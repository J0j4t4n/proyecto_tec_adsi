
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your Supabase project URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
