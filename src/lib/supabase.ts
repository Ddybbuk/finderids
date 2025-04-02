
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { supabase as configuredSupabase } from '@/integrations/supabase/client';

// Use the already configured Supabase client
const supabase = configuredSupabase;

export default supabase;
