-- Enable RLS on existing portfolio tables only.
-- App access is via Prisma (postgres / pooler role bypasses RLS).
-- No public anon policies, so NEXT_PUBLIC_SUPABASE_ANON_KEY cannot
-- read/write these rows via PostgREST / the Supabase client.

do $$
declare
  t text;
begin
  foreach t in array array[
    'contacts',
    'admins',
    'projects',
    'certifications',
    'visitors',
    'newsletter'
  ]
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;

-- Drop permissive policies from earlier migrations (idempotent; no-op if missing)
do $$
begin
  if to_regclass('public.contacts') is not null then
    drop policy if exists "Anyone can insert contacts" on public.contacts;
    drop policy if exists "Public read contacts" on public.contacts;
    drop policy if exists "Public all contacts" on public.contacts;
  end if;
  if to_regclass('public.projects') is not null then
    drop policy if exists "Public read projects" on public.projects;
  end if;
  if to_regclass('public.certifications') is not null then
    drop policy if exists "Public read certifications" on public.certifications;
  end if;
  if to_regclass('public.newsletter') is not null then
    drop policy if exists "Anyone can insert newsletter" on public.newsletter;
  end if;
  if to_regclass('public.visitors') is not null then
    drop policy if exists "Anyone can insert visitors" on public.visitors;
  end if;
end $$;
