-- Supabase schema for the portfolio admin backend
-- 1) Create a table that stores the full portfolio JSON.
create table if not exists public.profiles (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- Seed the default record used by the app.
insert into public.profiles (id, content)
values (
  'portfolio',
  '{
    "name": "Emmanuel A. Idoga",
    "title": "Cloud & DevOps Engineer",
    "subtitle": "Azure Administrator | DevOps Practitioner",
    "location": "Abuja, Nigeria",
    "email": "hello@emmanuelidoga.com",
    "phone": "+234 800 000 0000",
    "about": "Cloud and DevOps engineer focused on Azure, automation, and secure infrastructure.",
    "portfolio": [],
    "journey": [],
    "blog": [],
    "resume": {
      "summary": "",
      "experience": [],
      "certifications": [],
      "badges": []
    }
  }'::jsonb
)
on conflict (id) do nothing;

-- Allow authenticated users to read/write their admin content.
alter table public.profiles enable row level security;

create policy "profiles_read_all_authenticated"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_write_all_authenticated"
on public.profiles
for insert
to authenticated
with check (true);

create policy "profiles_update_all_authenticated"
on public.profiles
for update
to authenticated
using (true)
with check (true);

create policy "profiles_delete_all_authenticated"
on public.profiles
for delete
to authenticated
using (true);

-- Optional: allow anonymous read access if you want public portfolio access without auth.
-- create policy "profiles_read_public" on public.profiles for select using (true);
