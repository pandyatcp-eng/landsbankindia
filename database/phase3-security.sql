-- Apply after database/schema.sql in Supabase SQL Editor.
-- IMPORTANT: review policies against your operational roles before production.

-- Prevent ordinary users from escalating their own role array through profile updates.
create or replace function public.prevent_profile_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    new.account_roles := old.account_roles;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_roles on public.profiles;
create trigger protect_profile_roles before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

-- Admin authorization helper. Assign admin roles only using trusted Supabase SQL/editor
-- or a separately protected server-side operator workflow, never from a public form.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and 'admin' = any(account_roles)
  );
$$;

drop policy if exists "admin_read_all_profiles" on public.profiles;
create policy "admin_read_all_profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "admin_read_all_listings" on public.land_listings;
create policy "admin_read_all_listings" on public.land_listings for select using (public.is_admin());

drop policy if exists "admin_update_listings" on public.land_listings;
create policy "admin_update_listings" on public.land_listings for update using (public.is_admin()) with check (public.is_admin());

-- Owner can read enquiries relating to their listings.
drop policy if exists "listing_owner_read_enquiries" on public.enquiries;
create policy "listing_owner_read_enquiries" on public.enquiries for select using (
  exists (select 1 from public.land_listings l where l.id = listing_id and l.owner_id = auth.uid())
);

-- Users can create a profile for their own auth identity only.
drop policy if exists "profile_insert_own" on public.profiles;
create policy "profile_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Optional: set an initial admin role manually after verifying the account UUID:
-- update public.profiles set account_roles = array['buyer','admin'] where id = 'YOUR_AUTH_USER_UUID';


-- New profiles always start with the basic buyer role; users cannot self-assign admin.
create or replace function public.set_default_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.account_roles := array['buyer']::text[];
  return new;
end;
$$;
drop trigger if exists set_profile_default_role on public.profiles;
create trigger set_profile_default_role before insert on public.profiles
for each row execute function public.set_default_profile_role();

-- Listing owners cannot publish or approve their own listings by changing status directly.
create or replace function public.protect_listing_moderation_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and auth.uid() = old.owner_id and not public.is_admin() then
    new.status := old.status;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists protect_listing_status on public.land_listings;
create trigger protect_listing_status before update on public.land_listings
for each row execute function public.protect_listing_moderation_status();
