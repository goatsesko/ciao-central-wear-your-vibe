CREATE TABLE public.dress_me_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_text text NOT NULL,
  occasion text,
  size text,
  budget integer,
  outfits jsonb NOT NULL DEFAULT '[]'::jsonb,
  chosen_outfit jsonb,
  chosen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.dress_me_requests TO service_role;
ALTER TABLE public.dress_me_requests ENABLE ROW LEVEL SECURITY;