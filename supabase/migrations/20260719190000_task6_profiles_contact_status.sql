-- Task 6: profiles linked to Supabase Auth + contact status Done/Completed/Resolved

-- Contact status: add Done + Completed; map Reviewed → Done
do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'contact_status'
      and e.enumlabel = 'Done'
  ) then
    alter type public.contact_status add value 'Done';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'contact_status'
      and e.enumlabel = 'Completed'
  ) then
    alter type public.contact_status add value 'Completed';
  end if;
end $$;

-- Admin role enum + profiles table
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'admin_role' and n.nspname = 'public'
  ) then
    create type public.admin_role as enum ('Admin');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key,
  email text not null unique,
  name text not null,
  role public.admin_role not null default 'Admin'::public.admin_role,
  totp_secret text,
  totp_enabled boolean not null default false,
  totp_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
