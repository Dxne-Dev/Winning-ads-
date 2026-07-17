-- Example seed data (run in Supabase SQL editor after schema.sql)
insert into public.ads (source, platform, advertiser, headline, body, cta, niche, country, engagement)
values
  ('meta', 'meta', 'GlowSkin', 'The 3-step routine that changed my skin', 'Transform dull skin in 14 days with our dermatologist-approved kit.', 'Shop now', 'beauty', 'US', '{"likes": 12000, "comments": 340}'),
  ('meta', 'meta', 'FitHome', 'Train like a pro without the gym', 'Bodyweight programs built by Olympic coaches. Start free today.', 'Start free', 'fitness', 'US', '{"likes": 8800, "comments": 210}'),
  ('meta', 'meta', 'BudgetPeak', 'Stop overpaying on taxes', 'Small businesses save $4k/yr on average with our automated tool.', 'Get started', 'finance', 'UK', '{"likes": 5400, "comments": 120}');
