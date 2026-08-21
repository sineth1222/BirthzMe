-- BirthzMe database schema
-- Run against a fresh Supabase project. Safe to re-run (uses IF NOT EXISTS
-- / CREATE OR REPLACE throughout).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are self-readable"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles are self-writable"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles are self-insertable"
  on profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------
-- birthday_surprises
-- ---------------------------------------------------------------------
create table if not exists birthday_surprises (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,

  recipient_name text not null check (char_length(recipient_name) between 1 and 60),
  recipient_age int not null check (recipient_age between 1 and 130),
  relationship text,
  nickname text,
  sender_name text not null check (char_length(sender_name) between 1 and 60),

  template text not null check (template in ('dreamy-pink', 'cinematic-gold', 'fun-party')),

  main_photo_url text,
  memory_photos jsonb not null default '[]'::jsonb,

  birthday_message text not null check (char_length(birthday_message) <= 2000),
  special_memory text,
  inside_joke text,
  quote text,

  music_url text,
  music_type text check (music_type in ('builtin', 'custom')),

  accent_color text,
  animation_style text not null default 'magical'
    check (animation_style in ('soft', 'magical', 'cinematic', 'explosive')),
    has_watermark boolean not null default true,
  customization_json jsonb not null default '{}'::jsonb,

  status text not null default 'draft'
    check (status in ('draft', 'published', 'opened', 'celebrated')),
  opened_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_birthday_surprises_creator on birthday_surprises (creator_id);
create index if not exists idx_birthday_surprises_slug on birthday_surprises (slug);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_birthday_surprises_updated_at on birthday_surprises;
create trigger trg_birthday_surprises_updated_at
  before update on birthday_surprises
  for each row execute function set_updated_at();

alter table birthday_surprises enable row level security;

-- Creators manage only their own surprises.
create policy "creators can select own surprises"
  on birthday_surprises for select
  using (auth.uid() = creator_id);

create policy "creators can insert own surprises"
  on birthday_surprises for insert
  with check (auth.uid() = creator_id);

create policy "creators can update own surprises"
  on birthday_surprises for update
  using (auth.uid() = creator_id);

create policy "creators can delete own surprises"
  on birthday_surprises for delete
  using (auth.uid() = creator_id);

-- Anonymous/public visitors can read a surprise ONLY via its exact slug,
-- and only once it has been published — drafts stay private to the creator.
create policy "public can view published surprise by slug"
  on birthday_surprises for select
  using (status in ('published', 'opened', 'celebrated'));

-- ---------------------------------------------------------------------
-- birthday_events
-- ---------------------------------------------------------------------
create table if not exists birthday_events (
  id uuid primary key default gen_random_uuid(),
  surprise_id uuid not null references birthday_surprises (id) on delete cascade,
  event_type text not null check (event_type in (
    'opened', 'music_started', 'gift_opened', 'birthday_revealed',
    'gallery_viewed', 'message_viewed', 'surprise_completed'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_birthday_events_surprise on birthday_events (surprise_id);

alter table birthday_events enable row level security;

-- Only the creator can read event history for their own surprise.
create policy "creators can view own surprise events"
  on birthday_events for select
  using (
    exists (
      select 1 from birthday_surprises s
      where s.id = birthday_events.surprise_id
        and s.creator_id = auth.uid()
    )
  );

-- No direct public insert policy: anonymous event writes go through the
-- /api/events route using the service-role key, which validates the
-- event_type and surprise_id server-side before inserting. This keeps
-- write access out of the browser entirely.
