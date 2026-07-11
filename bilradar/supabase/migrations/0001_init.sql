-- Bilradar – initiell database
-- Kjør i Supabase SQL-editor eller via `supabase db push`.

-- =========================================================
--  Tabeller
-- =========================================================

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  navn text not null,
  slug text not null unique,
  logo_url text,
  opprettet timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  modell text not null,
  slug text not null unique,
  segment text not null check (segment in ('småbil','kompakt','suv','stasjonsvogn','premium')),
  drivlinje text not null check (drivlinje in ('elbil','hybrid','bensin','diesel')),
  tilbudstype text not null check (tilbudstype in ('leasing','lån','leie')),
  maanedspris integer not null,
  startleie integer not null default 0,
  bindingstid_mnd integer not null default 36,
  km_per_aar integer not null default 15000,
  forhandler text not null,
  forhandler_url text,
  bilde_urls text[] not null default '{}',
  popularitet integer not null default 0,
  aktiv boolean not null default true,
  opprettet timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  tittel text not null,
  slug text not null unique,
  innhold text not null default '',
  utdrag text not null default '',
  cover_url text,
  kategori text not null default 'Nyheter',
  tags text[] not null default '{}',
  publisert boolean not null default false,
  opprettet timestamptz not null default now()
);

create table if not exists public.sales_stats (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  modell text not null default '',
  maaned date not null,
  antall_registreringer integer not null default 0,
  plassering integer not null,
  unique (brand_id, maaned)
);

-- Admin-rolle. En rad opprettes automatisk ved registrering (trigger under).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  epost text,
  is_admin boolean not null default false,
  opprettet timestamptz not null default now()
);

-- =========================================================
--  Indekser
-- =========================================================
create index if not exists offers_aktiv_idx on public.offers (aktiv);
create index if not exists offers_tilbudstype_idx on public.offers (tilbudstype);
create index if not exists offers_segment_idx on public.offers (segment);
create index if not exists offers_drivlinje_idx on public.offers (drivlinje);
create index if not exists offers_maanedspris_idx on public.offers (maanedspris);
create index if not exists offers_brand_idx on public.offers (brand_id);
create index if not exists posts_publisert_idx on public.posts (publisert);
create index if not exists sales_maaned_idx on public.sales_stats (maaned);

-- =========================================================
--  Auto-opprett profil ved ny bruker
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, epost)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Hjelpefunksjon: er innlogget bruker admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- =========================================================
--  Row Level Security
-- =========================================================
alter table public.brands enable row level security;
alter table public.offers enable row level security;
alter table public.posts enable row level security;
alter table public.sales_stats enable row level security;
alter table public.profiles enable row level security;

-- Offentlig lesetilgang
create policy "brands lesbar for alle"
  on public.brands for select using (true);

create policy "aktive tilbud lesbar for alle"
  on public.offers for select using (aktiv = true or public.is_admin());

create policy "publiserte artikler lesbar for alle"
  on public.posts for select using (publisert = true or public.is_admin());

create policy "salgsstatistikk lesbar for alle"
  on public.sales_stats for select using (true);

-- Skrivetilgang kun for admin
create policy "admin skriver brands"
  on public.brands for all using (public.is_admin()) with check (public.is_admin());

create policy "admin skriver offers"
  on public.offers for all using (public.is_admin()) with check (public.is_admin());

create policy "admin skriver posts"
  on public.posts for all using (public.is_admin()) with check (public.is_admin());

create policy "admin skriver sales_stats"
  on public.sales_stats for all using (public.is_admin()) with check (public.is_admin());

-- Profiler: bruker ser egen rad, admin ser alle
create policy "bruker leser egen profil"
  on public.profiles for select using (id = auth.uid() or public.is_admin());

create policy "admin oppdaterer profiler"
  on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- =========================================================
--  Storage-bucket for tilbudsbilder (offentlig lesbar)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('offers', 'offers', true)
on conflict (id) do nothing;

create policy "offentlig lesing av tilbudsbilder"
  on storage.objects for select
  using (bucket_id = 'offers');

create policy "admin laster opp tilbudsbilder"
  on storage.objects for insert
  with check (bucket_id = 'offers' and public.is_admin());

create policy "admin sletter tilbudsbilder"
  on storage.objects for delete
  using (bucket_id = 'offers' and public.is_admin());
