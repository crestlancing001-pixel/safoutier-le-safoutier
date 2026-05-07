
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Replace reservation insert with a sanity-checked policy
DROP POLICY IF EXISTS "anyone can insert reservation" ON public.reservations;
CREATE POLICY "public can submit reservation" ON public.reservations FOR INSERT
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 100
    AND char_length(email) BETWEEN 5 AND 255
    AND char_length(phone) BETWEEN 5 AND 30
    AND char_length(coalesce(special_requests,'')) <= 1000
    AND status = 'pending'
  );

-- Tighten storage listing to admins (still allow public to GET individual files via public bucket URL)
DROP POLICY IF EXISTS "site-assets public read" ON storage.objects;
CREATE POLICY "site-assets admin list" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- Lock has_role execute to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
