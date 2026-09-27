-- TripSync database schema. Run this once in the Supabase SQL editor.

create table public.trips (
  id text primary key,
  trip_name text not null,
  coordinator_name text not null,
  group_type text not null check (group_type in ('family','friends','business')),
  trip_purpose text not null check (trip_purpose in ('leisure','business')),
  number_of_people int not null check (number_of_people between 2 and 30),
  recommendations jsonb,            -- latest AI options (cached so everyone sees the same ones)
  created_at timestamptz not null default now()
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null references public.trips(id) on delete cascade,
  name text not null,
  submitted boolean not null default false,
  chosen_option text,               -- option picked on the Decision view (no booking)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index participants_trip_id_idx on public.participants(trip_id);

create table public.preferences (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references public.participants(id) on delete cascade,
  budget text not null,
  start_date date not null,
  end_date date not null,
  destination_types text[] not null default '{}',
  must_haves text,
  deal_breakers text,
  updated_at timestamptz not null default now()
);

alter table public.trips enable row level security;
alter table public.participants enable row level security;
alter table public.preferences enable row level security;

-- TripSync has no login: anyone with the (unguessable) trip link can read and contribute.
create policy "trips read" on public.trips for select to anon, authenticated using (true);
create policy "trips insert" on public.trips for insert to anon, authenticated with check (true);
create policy "trips update" on public.trips for update to anon, authenticated using (true) with check (true);
create policy "participants read" on public.participants for select to anon, authenticated using (true);
create policy "participants insert" on public.participants for insert to anon, authenticated with check (true);
create policy "participants update" on public.participants for update to anon, authenticated using (true) with check (true);
create policy "preferences read" on public.preferences for select to anon, authenticated using (true);
create policy "preferences insert" on public.preferences for insert to anon, authenticated with check (true);
create policy "preferences update" on public.preferences for update to anon, authenticated using (true) with check (true);
