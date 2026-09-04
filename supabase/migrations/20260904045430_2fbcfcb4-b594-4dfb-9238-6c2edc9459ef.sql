CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_class text NOT NULL CHECK (student_class IN ('IX', 'X')),
  board text NOT NULL CHECK (board IN ('CBSE', 'ICSE')),
  parent_name text NOT NULL CHECK (char_length(parent_name) BETWEEN 2 AND 100),
  mobile_number text NOT NULL CHECK (mobile_number ~ '^[0-9+ ()-]{10,20}$'),
  preferred_contact text NOT NULL CHECK (preferred_contact IN ('Call', 'WhatsApp')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  submission_fingerprint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'new');

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

CREATE TRIGGER enquiries_set_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX enquiries_created_at_idx ON public.enquiries (created_at DESC);