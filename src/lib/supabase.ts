
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Replace with your Supabase URL and anon key from the Supabase dashboard
// These should be accessible after connecting Lovable to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
