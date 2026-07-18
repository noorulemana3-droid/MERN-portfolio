-- supabase/migrations/20260717162600_create_contacts.sql
-- Initial portfolio schema: contacts + supporting tables

create extension if not exists "pgcrypto";

-- Contact form submissions
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null check (char_length(trim(subject)) >= 3),
  message text not null check (char_length(trim(message)) >= 10),
  created_at timestamptz not null default now()
);

create index if not exists contacts_created_at_idx
  on public.contacts (created_at desc);

create index if not exists contacts_email_idx
  on public.contacts (email);

comment on table public.contacts is 'Portfolio contact form submissions';

-- Portfolio content (optional / future use)
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

-- Row Level Security
alter table public.contacts enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.visitors enable row level security;
alter table public.newsletter enable row level security;

-- Contacts: public can insert only (no public read/update/delete)
drop policy if exists "Anyone can insert contacts" on public.contacts;
create policy "Anyone can insert contacts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

-- Projects / certifications: public read
drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications"
  on public.certifications
  for select
  to anon, authenticated
  using (true);

-- Newsletter / visitors: public insert
drop policy if exists "Anyone can insert newsletter" on public.newsletter;
create policy "Anyone can insert newsletter"
  on public.newsletter
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can insert visitors" on public.visitors;
create policy "Anyone can insert visitors"
  on public.visitors
  for insert
  to anon, authenticated
  with check (true);
