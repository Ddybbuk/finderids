
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://kthyujrzgadqtutnczzz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aHl1anJ6Z2FkcXR1dG5jenp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjEzMzksImV4cCI6MjA1OTEzNzMzOX0.a1l4YXrVJkt3HBYqupoFhl-37GsV0VXm96F77WtMykQ";

// Create a more flexible client that doesn't enforce strict typing
// This allows us to use tables that might not be defined in types.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
