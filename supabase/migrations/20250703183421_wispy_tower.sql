/*
  # Add Comprehensive Report Access to Users Table

  1. New Fields
    - `has_comprehensive_report_access` - Boolean flag to indicate if a user has paid for comprehensive vehicle reports

  2. Changes
    - Add has_comprehensive_report_access column to users table with default false
    - Create index for faster queries on this column
*/

-- Add has_comprehensive_report_access column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS has_comprehensive_report_access boolean DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_comprehensive_access ON public.users(has_comprehensive_report_access);