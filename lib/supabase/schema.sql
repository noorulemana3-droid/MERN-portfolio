-- NextGen Developer Portfolio – Supabase schema
-- Run this in the Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  image_url text,
  technologies text[] default '{}',
  category text,
  featured boolean default false,
  live_url text,
  github_url text,
  year int,
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_at date,
  credential_id text,
  credential_url text,
  image_url text,
  download_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  path text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.visitors enable row level security;
alter table public.newsletter enable row level security;

-- Public can insert contact messages
create policy "Anyone can insert contacts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

-- Public read for portfolio content tables
create policy "Public read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "Public read certifications"
  on public.certifications
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can insert newsletter"
  on public.newsletter
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can insert visitors"
  on public.visitors
  for insert
  to anon, authenticated
  with check (true);

-- Storage buckets (create in Dashboard too): resume, profile, projects, certificates
