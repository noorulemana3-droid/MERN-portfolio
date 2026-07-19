-- Admin TOTP 2FA columns
alter table public.admins
  add column if not exists totp_secret text,
  add column if not exists totp_enabled boolean not null default false,
  add column if not exists totp_verified_at timestamptz;

comment on column public.admins.totp_secret is 'Encrypted TOTP secret for authenticator apps';
comment on column public.admins.totp_enabled is 'Whether TOTP 2FA is required at login';
