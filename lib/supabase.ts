// lib/supabase.ts
// Supabase client configuration
// Uses anon key for public reads, service role key for server-side writes

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create clients only if URL is provided (prevents build errors)
function createSupabaseClient(url: string, key: string): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key);
}

// Public client — for client-side reads (audits table is public-readable)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server client — for server-side writes (leads table, service role only)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);

// Database types
export interface AuditRow {
  id: string;
  tools: Record<string, unknown>[];
  results: Record<string, unknown>;
  ai_summary: string | null;
  total_monthly_savings: number;
  created_at: string;
}

export interface LeadRow {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  total_monthly_savings: number | null;
  created_at: string;
}
