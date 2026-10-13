-- Migration: 20261012120000_create_enquiries_table.sql
-- Joshi's Academy: Admission Enquiries & Leads Management Table
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/gxpnboomkqwtmjlgygce/sql)

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_class text NOT NULL,
  board text NOT NULL,
  parent_name text NOT NULL,
  mobile_number text NOT NULL,
  email text,
  preferred_contact text NOT NULL DEFAULT 'Call',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, IN_PROGRESS, ENROLLED, CLOSED
  source text NOT NULL DEFAULT 'Website Enquiry Popup',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexing for high-speed admin querying and sorting
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_class ON public.enquiries (student_class);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 1. Allow public visitors to submit their enquiry form
DROP POLICY IF EXISTS "Allow public insert enquiry" ON public.enquiries;
CREATE POLICY "Allow public insert enquiry" ON public.enquiries
  FOR INSERT TO anon, authenticated, service_role
  WITH CHECK (true);

-- 2. Allow reading enquiries for admin portal
DROP POLICY IF EXISTS "Allow read enquiries" ON public.enquiries;
CREATE POLICY "Allow read enquiries" ON public.enquiries
  FOR SELECT TO anon, authenticated, service_role
  USING (true);

-- 3. Allow updating enquiry status (e.g., mark as CONTACTED or ENROLLED)
DROP POLICY IF EXISTS "Allow update enquiries" ON public.enquiries;
CREATE POLICY "Allow update enquiries" ON public.enquiries
  FOR UPDATE TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 4. Allow deleting / archiving enquiries
DROP POLICY IF EXISTS "Allow delete enquiries" ON public.enquiries;
CREATE POLICY "Allow delete enquiries" ON public.enquiries
  FOR DELETE TO anon, authenticated, service_role
  USING (true);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO anon, authenticated, service_role;
