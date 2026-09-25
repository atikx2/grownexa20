-- roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- first user becomes admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- shared updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'sparkles',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  price_note text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  is_highlighted boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL DEFAULT '',
  image_url text,
  link_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  content text NOT NULL,
  category text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  package_name text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- grants
GRANT SELECT ON public.services, public.packages, public.portfolio_items, public.reviews, public.faqs, public.statistics, public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services, public.packages, public.portfolio_items, public.reviews, public.faqs, public.statistics, public.site_settings, public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.services, public.packages, public.portfolio_items, public.reviews, public.faqs, public.statistics, public.site_settings, public.leads TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active packages" ON public.packages FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active portfolio" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage portfolio" ON public.portfolio_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active statistics" ON public.statistics FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage statistics" ON public.statistics FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER t_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_portfolio_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_statistics_updated BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- starter content
INSERT INTO public.services (category, slug, title, summary, details, icon, sort_order) VALUES
('Website Services','business-website','Business Website Design','Conversion-focused marketing sites built to load fast and look premium on every screen.','We design and build responsive marketing websites with clear structure, accessible markup and clean on-page SEO foundations. Includes up to 6 pages, contact forms and handover documentation.','layout',1),
('Website Services','ecommerce-store','E-commerce Store Setup','Product catalogues, cart and checkout set up on a platform you control.','Storefront setup, product and collection structure, payment and shipping configuration, plus basic staff training so your team can run the store independently.','shopping-bag',2),
('Website Services','landing-pages','Landing Pages & Funnels','Single-purpose pages designed around one clear action.','Copy structure, layout, responsive build and analytics events so you can measure what each campaign actually does.','target',3),
('Website Services','maintenance-seo','Maintenance & Technical SEO','Ongoing updates, performance work and technical SEO fixes.','Monthly updates, backups, uptime checks, Core Web Vitals improvements, crawlability and structured-data fixes. We improve technical foundations; we do not sell ranking guarantees.','wrench',4),
('YouTube Services','channel-setup','Channel Setup & Branding','Channel identity, banners, thumbnails template and full metadata setup.','Logo placement, banner, watermark, about section, playlists, section layout and a reusable thumbnail template built in your brand style.','youtube',1),
('YouTube Services','video-editing','Video Editing','Clean, paced edits for long-form and short-form video.','Cuts, captions, sound balancing, colour treatment, motion graphics and export presets for long-form plus vertical shorts.','clapperboard',2),
('YouTube Services','thumbnail-design','Thumbnail & Title Design','Thumbnails and title options built for clarity, not clickbait.','Two to three thumbnail concepts per video plus title variations you can test. Honest framing only — no misleading claims.','image',3),
('YouTube Services','channel-strategy','Channel Audit & Strategy','A structured review of your content, metadata and publishing rhythm.','We audit your catalogue, packaging and retention patterns, then give you a prioritised action plan. No purchased views or subscribers, ever.','line-chart',4),
('Music Promotion','spotify-playlist-pitch','Spotify Playlist Pitching','Manual, human pitching to curators who accept submissions.','We research relevant curators and submit your release for genuine consideration. Placements depend entirely on the curator. We never use bots or paid streams.','music',1),
('Music Promotion','spotify-profile','Spotify Artist Profile Setup','Profile, canvas, artist pick and release presentation set up properly.','Artist image, bio, canvas assets, artist pick and pre-save links prepared so each release lands on a complete profile.','disc-3',2),
('Music Promotion','social-content','Music Social Content','Short-form video and cover assets for release campaigns.','Visualisers, lyric cuts, vertical clips and cover art variants sized for Instagram, TikTok and YouTube Shorts.','video',3),
('Music Promotion','release-planning','Release Planning & Consulting','A week-by-week plan for your next single or EP.','Release calendar, asset checklist, pitch timing, distribution and metadata review, plus a simple reporting sheet you keep.','calendar-check',4);

INSERT INTO public.packages (category, name, price, price_note, description, features, is_highlighted, sort_order) VALUES
('Website Services','Starter Site',449,'one-time project','A focused site for new brands that need to look credible fast.','{"Up to 4 responsive pages","Custom design in your brand style","Contact form + WhatsApp link","Basic on-page SEO setup","2 revision rounds"}',false,1),
('Website Services','Growth Site',899,'one-time project','A fuller marketing site with content structure built for growth.','{"Up to 8 responsive pages","Custom design system","Blog or portfolio section","On-page SEO + analytics setup","Speed optimisation","3 revision rounds"}',true,2),
('Website Services','Commerce & Care',1690,'one-time project + care plan','Store setup with an ongoing maintenance plan.','{"Store setup with up to 50 products","Payment + shipping configuration","Product page templates","Staff walkthrough session","3 months maintenance included"}',false,3),
('YouTube Services','Channel Foundation',199,'one-time setup','Everything needed for a clean, professional channel launch.','{"Banner, logo placement, watermark","About section + playlists","Thumbnail template","Metadata + tag structure guidance"}',false,1),
('YouTube Services','Editing Retainer',649,'per month','Consistent editing support for a regular publishing schedule.','{"4 long-form edits per month","4 vertical shorts per month","Captions + sound balancing","Thumbnail concepts per video","48-hour revision turnaround"}',true,2),
('YouTube Services','Audit & Strategy',249,'one-time engagement','A clear, prioritised plan for your channel.','{"Full catalogue + packaging audit","Retention and metadata review","90-day content plan","60-minute strategy call"}',false,3),
('Music Promotion','Release Essentials',179,'per release','Get one release presented properly across platforms.','{"Spotify profile + canvas setup","Cover art variants","Pre-save link setup","Release checklist"}',false,1),
('Music Promotion','Campaign',549,'per release','Manual curator pitching plus a full social asset set.','{"Manual pitching to relevant curators","6 short-form video assets","Visualiser + lyric cuts","Release calendar + reporting sheet"}',true,2),
('Music Promotion','Artist Partner',1290,'per quarter','Ongoing release support across a full campaign cycle.','{"Up to 3 releases per quarter","Manual curator pitching each release","Monthly social asset batch","Quarterly strategy review"}',false,3);

INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How do I order a package?','Open any package and press Buy Now. That takes you to the order form with the package already filled in. Send it and we reply by email or WhatsApp to confirm scope, timeline and payment.','Ordering',1),
('How do payments work?','There is no online checkout on this site. Once we agree on scope, we send payment details for PayPal, Cash App, Zelle or Venmo and confirm as soon as the payment clears.','Payments',2),
('Can prices be adjusted for my project?','Yes. Listed prices are starting points for typical scopes. If your project is larger or smaller, tell us in the order form and we quote accordingly.','Payments',3),
('Do you guarantee views, streams, rankings or revenue?','No. We do not guarantee views, subscribers, streams, rankings, monetisation or revenue, and we do not work with bots or purchased engagement. We deliver the work described in each package.','Results',4),
('How does Spotify playlist pitching actually work?','We research curators whose playlists match your genre and submit your release for genuine consideration, alongside the official Spotify for Artists pitch. Every placement is the curator''s decision.','Results',5),
('How long does a website project take?','A Starter Site is usually 1–2 weeks and a Growth Site 3–4 weeks once we have your content and brand assets. Store projects depend on catalogue size.','Timelines',6),
('What do you need from me to start?','Brand assets if you have them, access to the relevant accounts, and your content or raw footage. We send a short checklist after the first reply so nothing gets missed.','Timelines',7),
('Do I own the work you deliver?','Yes. On final payment all deliverables, source files and accounts are yours.','Ordering',8);

INSERT INTO public.site_settings (key, value, label, sort_order) VALUES
('company_name','Grownexa20','Company name',1),
('tagline','Websites, YouTube and music campaigns — built honestly.','Tagline',2),
('email','hello@grownexa20.com','Contact email',3),
('whatsapp','+10000000000','WhatsApp number (digits, with country code)',4),
('phone','','Phone number (optional)',5),
('location','Remote — working worldwide','Location',6),
('hours','Mon–Sat, 10:00–19:00 (UTC+6)','Working hours',7),
('paypal','paypal.me/grownexa20','PayPal handle',8),
('cashapp','$grownexa20','Cash App handle',9),
('zelle','hello@grownexa20.com','Zelle details',10),
('venmo','@grownexa20','Venmo handle',11),
('instagram','','Instagram URL',12),
('youtube','','YouTube URL',13),
('linkedin','','LinkedIn URL',14);