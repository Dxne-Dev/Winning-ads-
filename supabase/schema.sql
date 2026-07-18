-- Winning Ads AI — Supabase schema

-- Extensions
create extension if not exists "uuid-ossp";

-- users (profile linked to auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ads (advertisement records)
create table if not exists public.ads (
  id uuid primary key default uuid_generate_v4(),
  source text,
  platform text default 'meta',
  advertiser text,
  thumbnail_url text,
  video_url text,
  headline text,
  body text,
  cta text,
  niche text,
  country text,
  engagement jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- projects (user workspaces)
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- saved_ads (bookmarks)
create table if not exists public.saved_ads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  ad_id uuid not null references public.ads (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, ad_id)
);

-- ai_generations (remix history)
create table if not exists public.ai_generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  ad_id uuid references public.ads (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  analysis jsonb,
  remix jsonb,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.saved_ads enable row level security;
alter table public.ai_generations enable row level security;
alter table public.ads enable row level security;

-- users policies
drop policy if exists "users read own" on public.users;
create policy "users read own" on public.users for select using (auth.uid () = id);

drop policy if exists "users update own" on public.users;
create policy "users update own" on public.users for update using (auth.uid () = id);

drop policy if exists "users insert own" on public.users;
create policy "users insert own" on public.users for insert with check (auth.uid () = id);

-- projects policies
drop policy if exists "projects owner all" on public.projects;
create policy "projects owner all" on public.projects for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- saved_ads policies
drop policy if exists "saved_ads owner all" on public.saved_ads;
create policy "saved_ads owner all" on public.saved_ads for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- ai_generations policies
drop policy if exists "ai_generations owner all" on public.ai_generations;
create policy "ai_generations owner all" on public.ai_generations for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- ads policies (public read, authenticated users can insert)
drop policy if exists "ads public read" on public.ads;
create policy "ads public read" on public.ads for select using (true);
drop policy if exists "ads authenticated insert" on public.ads;
create policy "ads authenticated insert" on public.ads for insert with check (auth.role() = 'authenticated');

-- Trigger: create user profile on signup
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user ();
