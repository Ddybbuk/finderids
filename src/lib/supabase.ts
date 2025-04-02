
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Check if Supabase environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client when not connected to Supabase
const createMockClient = () => {
  console.warn(
    "⚠️ No Supabase credentials found. Using mock client. Please connect to Supabase and add your URL and anonymous key to your environment variables."
  );
  
  // Return a mock Supabase client with the same API shape
  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ 
            data: null, 
            error: { message: "Not connected to Supabase" } 
          }),
          order: () => ({
            data: [], 
            error: { message: "Not connected to Supabase" }
          })
        })
      }),
      insert: () => ({ 
        data: null, 
        error: { message: "Not connected to Supabase" } 
      }),
      update: () => ({ 
        data: null, 
        error: { message: "Not connected to Supabase" } 
      }),
      delete: () => ({ 
        data: null, 
        error: { message: "Not connected to Supabase" } 
      })
    }),
    auth: {
      getSession: async () => ({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: () => ({ data: null, error: null })
    }
  } as any;
};

// Create and export the Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export default supabase;
