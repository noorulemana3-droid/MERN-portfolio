-- Task 4: contact status (default Pending) + updated_at
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'contact_status' and n.nspname = 'public'
  ) then
    create type public.contact_status as enum ('Pending', 'Reviewed', 'Resolved');
  end if;
end $$;

alter table public.contacts
  add column if not exists status public.contact_status not null default 'Pending'::public.contact_status,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists contacts_status_idx on public.contacts (status);

-- Keep updated_at in sync on row changes
create or replace function public.set_contacts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row
execute function public.set_contacts_updated_at();
