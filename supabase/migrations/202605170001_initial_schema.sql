-- ============================================================
-- SpeedZone – Auth / Login only schema
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- User role
do $$ begin
  create type public.user_role as enum ('customer', 'staff', 'admin');
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- Tables
-- ============================================================

-- User profiles (synced from auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  date_of_birth date,
  marketing_opt_in boolean not null default false,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Triggers / Functions
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;

drop policy if exists "profiles are viewable by owner" on public.profiles;
create policy "profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles are updatable by owner" on public.profiles;
create policy "profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- ============================================================
-- Grants
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles
to authenticated;
