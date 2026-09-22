-- Migration: 20260922100000_cms_tables.sql
-- CMS Tables for Joshi's Academy: Gallery, YouTube Videos, Google Review Config, Google Review Cache

-- 1. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id text NOT NULL DEFAULT 'default',
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  description text DEFAULT '',
  image_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'General',
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE INDEX IF NOT EXISTS idx_gallery_academy_order ON public.gallery (academy_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery (is_published, display_order ASC);

-- 2. YOUTUBE VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id text NOT NULL DEFAULT 'default',
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  description text DEFAULT '',
  youtube_url text NOT NULL,
  youtube_video_id text NOT NULL,
  thumbnail_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE INDEX IF NOT EXISTS idx_youtube_academy_order ON public.youtube_videos (academy_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_youtube_published ON public.youtube_videos (is_published, display_order ASC);

-- 3. GOOGLE REVIEW CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.google_review_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id text NOT NULL UNIQUE DEFAULT 'default',
  google_place_id text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT true,
  auto_refresh boolean NOT NULL DEFAULT true,
  max_reviews integer NOT NULL DEFAULT 10 CHECK (max_reviews IN (5, 10, 20)),
  min_rating integer NOT NULL DEFAULT 4 CHECK (min_rating BETWEEN 1 AND 5),
  last_fetched_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. GOOGLE REVIEW CACHE TABLE
CREATE TABLE IF NOT EXISTS public.google_review_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id text NOT NULL UNIQUE DEFAULT 'default',
  place_id text NOT NULL DEFAULT '',
  place_name text NOT NULL DEFAULT '',
  overall_rating numeric(3,2) NOT NULL DEFAULT 5.0,
  total_reviews integer NOT NULL DEFAULT 0,
  review_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS gallery_set_updated_at ON public.gallery;
CREATE TRIGGER gallery_set_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS youtube_set_updated_at ON public.youtube_videos;
CREATE TRIGGER youtube_set_updated_at BEFORE UPDATE ON public.youtube_videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS google_config_set_updated_at ON public.google_review_config;
CREATE TRIGGER google_config_set_updated_at BEFORE UPDATE ON public.google_review_config FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS google_cache_set_updated_at ON public.google_review_cache;
CREATE TRIGGER google_cache_set_updated_at BEFORE UPDATE ON public.google_review_cache FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_review_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_review_cache ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PUBLIC ACCESS
CREATE POLICY "Public read published gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read published youtube" ON public.youtube_videos FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read enabled google review config" ON public.google_review_config FOR SELECT TO anon, authenticated USING (is_enabled = true);
CREATE POLICY "Public read google review cache" ON public.google_review_cache FOR SELECT TO anon, authenticated USING (true);

-- POLICIES FOR ADMIN & AUTHENTICATED USERS
CREATE POLICY "Authenticated full access gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access youtube" ON public.youtube_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access google_config" ON public.google_review_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access google_cache" ON public.google_review_cache FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GRANTS FOR ANON, AUTHENTICATED AND SERVICE ROLE
GRANT SELECT ON public.gallery TO anon;
GRANT ALL ON public.gallery TO authenticated, service_role;

GRANT SELECT ON public.youtube_videos TO anon;
GRANT ALL ON public.youtube_videos TO authenticated, service_role;

GRANT SELECT ON public.google_review_config TO anon;
GRANT ALL ON public.google_review_config TO authenticated, service_role;

GRANT SELECT ON public.google_review_cache TO anon;
GRANT ALL ON public.google_review_cache TO authenticated, service_role;
