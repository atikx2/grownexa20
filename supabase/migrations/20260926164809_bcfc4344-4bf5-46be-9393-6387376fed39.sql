UPDATE public.services SET category='Website' WHERE category='Website Services';
UPDATE public.services SET category='YouTube' WHERE category='YouTube Services';
UPDATE public.services SET category='Spotify' WHERE category='Music Promotion';
UPDATE public.packages SET category='Website' WHERE category='Website Services';
UPDATE public.packages SET category='YouTube' WHERE category='YouTube Services';
UPDATE public.packages SET category='Spotify' WHERE category='Music Promotion';
UPDATE public.portfolio_items SET category='Website' WHERE category ILIKE 'Website%';
UPDATE public.portfolio_items SET category='YouTube' WHERE category ILIKE 'YouTube%';
UPDATE public.portfolio_items SET category='Spotify' WHERE category ILIKE 'Music%';
INSERT INTO public.services (category, slug, title, summary, details, icon, sort_order, is_active) VALUES
('SEO','seo-audit','Technical SEO audit','A full check of speed, indexing, structure and on-page issues.','You get a prioritised fix list. We never guarantee rankings.','search',1,true),
('SEO','on-page-seo','On-page optimisation','Titles, descriptions, headings and content structure improved.','','search',2,true),
('SEO','keyword-research','Keyword research','Find the search terms your customers actually use.','','search',3,true),
('SEO','local-seo','Local SEO setup','Google Business Profile and local listing setup.','','search',4,true);
INSERT INTO public.packages (category, name, price, currency, price_note, description, features, is_highlighted, sort_order, is_active) VALUES
('SEO','SEO Audit',149,'USD','one-time','A clear report of what to fix.',ARRAY['Technical audit','Speed check','Prioritised fix list'],false,1,true),
('SEO','SEO Growth',399,'USD','per month','Ongoing on-page work and reporting.',ARRAY['Keyword research','On-page fixes','Monthly report'],true,2,true),
('SEO','Local SEO',249,'USD','one-time','Get found in your area.',ARRAY['Google Business Profile','Local citations','Review guidance'],false,3,true);