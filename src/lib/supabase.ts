import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: any = null;

export function getSupabase(): any {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

/**
 * DB Table Schemas (for user reference in Supabase SQL editor):
 * 
 * -- 1. Customers Table
 * create table if not exists customers (
 *   id uuid default gen_random_uuid() primary key,
 *   name text not null,
 *   phone text not null,
 *   kyc_status text default 'Pending' check (kyc_status in ('Verified', 'Pending', 'Rejected')),
 *   active_loans_count integer default 0,
 *   total_pledged_weight numeric default 0,
 *   total_loan_amount numeric default 0,
 *   avatar text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 2. Gold Loans Table
 * create table if not exists gold_loans (
 *   id text primary key,
 *   customer_name text not null,
 *   customer_id uuid references customers(id) on delete cascade,
 *   amount numeric not null,
 *   interest_rate numeric not null,
 *   weight numeric not null,
 *   purity text check (purity in ('24K', '22K', '18K')),
 *   pledged_item text not null,
 *   due_date text not null,
 *   status text check (status in ('Active', 'Overdue', 'Closed')),
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 3. Activities Table
 * create table if not exists activities (
 *   id uuid default gen_random_uuid() primary key,
 *   title text not null,
 *   amount numeric,
 *   time_ago text not null,
 *   type text not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 */
