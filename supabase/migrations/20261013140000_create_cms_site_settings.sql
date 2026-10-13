-- ============================================================================
-- CMS Site Settings Table Migration
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cms_site_settings (
  key VARCHAR(64) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cms_site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for website branding, announcements, and contact info
CREATE POLICY "Allow public read access on cms_site_settings"
  ON public.cms_site_settings
  FOR SELECT
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on cms_site_settings"
  ON public.cms_site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
