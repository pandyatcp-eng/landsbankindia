-- LandsbankIndia 2.0 initial PostgreSQL schema (review before production use).
-- Enable PostGIS on the database before applying this file.
create extension if not exists pgcrypto;
create extension if not exists postgis;

create type public.land_category as enum ('agricultural','industrial','residential','commercial','other');
create type public.listing_status as enum ('draft','pending_review','published','rejected','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferred_language text not null default 'en',
  account_roles text[] not null default array['buyer']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.land_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  category public.land_category not null,
  country_code char(2) not null default 'IN',
  state text not null,
  district text,
  city_or_village text,
  address_text text,
  area_value numeric(18,3) not null check (area_value > 0),
  area_unit text not null,
  asking_price_inr numeric(18,2) check (asking_price_inr is null or asking_price_inr >= 0),
  location geography(point,4326),
  survey_reference text,
  record_status text not null default 'not_verified',
  status public.listing_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index land_listings_location_gix on public.land_listings using gist(location);
create index land_listings_search_idx on public.land_listings using gin(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(state,'') || ' ' || coalesce(district,'') || ' ' || coalesce(city_or_village,'')));
create index land_listings_filters_idx on public.land_listings(category,status,state,district,asking_price_inr);

create table public.saved_listings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.land_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,listing_id)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.land_listings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.land_listings enable row level security;
alter table public.saved_listings enable row level security;
alter table public.enquiries enable row level security;

-- Profile owners can read/update only their own profile.
create policy "profile_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profile_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- Published listings are public; owners can manage their own unpublished listings.
create policy "published_listings_public_read" on public.land_listings for select using (status = 'published' or owner_id = auth.uid());
create policy "owners_insert_listings" on public.land_listings for insert with check (owner_id = auth.uid());
create policy "owners_update_listings" on public.land_listings for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "saved_listings_owner_access" on public.saved_listings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "enquiry_sender_read" on public.enquiries for select using (sender_id = auth.uid());
create policy "enquiry_sender_create" on public.enquiries for insert with check (sender_id = auth.uid());

-- Production follow-up: add staff/admin authorization, owner-side enquiry policies,
-- audit events, document metadata/storage policies, rate limits, and verified moderation workflows.
