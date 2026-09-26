CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  occupation text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active team" ON public.team_members FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage team" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.team_members (name, occupation, image_url, sort_order) VALUES
('Atik Hasan','Founder & Project Lead','/samples/review-1.jpg',1),
('Sara Rahman','Web Designer & Developer','/samples/review-2.jpg',2),
('Daniel Brooks','YouTube & Music Campaign Manager','/samples/review-3.jpg',3);