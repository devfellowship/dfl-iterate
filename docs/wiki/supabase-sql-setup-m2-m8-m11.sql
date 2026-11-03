-- ============================================================
-- DFL Iterate — sandbox de aula (projeto hpggeagrnoeponiwjgdv)
-- Tabelas para S-M2 (preferências), S-M8 (ranking), S-M11 (feed)
-- Rodar no SQL Editor do dashboard Supabase
-- ============================================================

-- ------------------------------------------------------------
-- M2 — user_preferences (READ + UPDATE)
-- ------------------------------------------------------------
create table if not exists public.user_preferences (
  user_id text primary key,
  theme text not null check (theme in ('light', 'dark', 'system')),
  sound_effects_enabled boolean not null default true,
  language text not null check (language in ('pt-BR', 'en-US')),
  updated_at timestamptz not null default now()
);

insert into public.user_preferences (user_id, theme, sound_effects_enabled, language)
values ('user-1', 'dark', true, 'pt-BR')
on conflict (user_id) do update set
  theme = excluded.theme,
  sound_effects_enabled = excluded.sound_effects_enabled,
  language = excluded.language,
  updated_at = now();

-- ------------------------------------------------------------
-- M8 — leaderboard_entries (READ + UPDATE xp + recalcular rank no service)
-- ------------------------------------------------------------
create table if not exists public.leaderboard_entries (
  user_id text primary key,
  display_name text not null,
  avatar_url text not null,
  total_xp int not null default 0 check (total_xp >= 0),
  rank int not null check (rank >= 1),
  is_current_user boolean not null default false
);

-- Seed = dummy atual do iterate
insert into public.leaderboard_entries
  (user_id, display_name, avatar_url, total_xp, rank, is_current_user)
values
  ('user-42', 'Carlos Dev',   'https://i.pravatar.cc/64?u=user-42', 3200, 1, false),
  ('user-17', 'Beatriz Code', 'https://i.pravatar.cc/64?u=user-17', 2850, 2, false),
  ('user-1',  'Ana Fellow',   'https://i.pravatar.cc/64?u=user-1',  1240, 3, true),
  ('user-88', 'Diego React',  'https://i.pravatar.cc/64?u=user-88',  980, 4, false),
  ('user-33', 'Elena TS',     'https://i.pravatar.cc/64?u=user-33',  750, 5, false)
on conflict (user_id) do update set
  display_name = excluded.display_name,
  avatar_url = excluded.avatar_url,
  total_xp = excluded.total_xp,
  rank = excluded.rank,
  is_current_user = excluded.is_current_user;

-- ------------------------------------------------------------
-- M11 — activity_events (READ lista + CREATE)
-- ------------------------------------------------------------
create table if not exists public.activity_events (
  id text primary key,
  type text not null check (type in (
    'lesson_completed',
    'achievement_unlocked',
    'streak_milestone'
  )),
  label text not null,
  occurred_at timestamptz not null default now()
);

insert into public.activity_events (id, type, label, occurred_at)
values
  (
    'evt-1',
    'lesson_completed',
    'Você completou a activity act-05',
    '2026-05-27T18:30:00.000Z'
  ),
  (
    'evt-2',
    'achievement_unlocked',
    'Conquista desbloqueada: Sequência de fogo',
    '2026-05-25T09:00:00.000Z'
  ),
  (
    'evt-3',
    'streak_milestone',
    'Streak de 3 dias alcançado',
    '2026-05-25T09:00:00.000Z'
  )
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- RLS classroom (sem auth ainda — anon pode CRUD)
-- ⚠️ Só neste projeto de ensino. Nunca assim em produção.
-- ------------------------------------------------------------
alter table public.user_preferences enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.activity_events enable row level security;

-- user_preferences
drop policy if exists "classroom_select_preferences" on public.user_preferences;
drop policy if exists "classroom_update_preferences" on public.user_preferences;
drop policy if exists "classroom_insert_preferences" on public.user_preferences;

create policy "classroom_select_preferences"
  on public.user_preferences for select to anon, authenticated using (true);
create policy "classroom_update_preferences"
  on public.user_preferences for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_insert_preferences"
  on public.user_preferences for insert to anon, authenticated with check (true);

-- leaderboard_entries
drop policy if exists "classroom_select_leaderboard" on public.leaderboard_entries;
drop policy if exists "classroom_update_leaderboard" on public.leaderboard_entries;
drop policy if exists "classroom_insert_leaderboard" on public.leaderboard_entries;

create policy "classroom_select_leaderboard"
  on public.leaderboard_entries for select to anon, authenticated using (true);
create policy "classroom_update_leaderboard"
  on public.leaderboard_entries for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_insert_leaderboard"
  on public.leaderboard_entries for insert to anon, authenticated with check (true);

-- activity_events
drop policy if exists "classroom_select_activity_events" on public.activity_events;
drop policy if exists "classroom_insert_activity_events" on public.activity_events;
drop policy if exists "classroom_update_activity_events" on public.activity_events;
drop policy if exists "classroom_delete_activity_events" on public.activity_events;

create policy "classroom_select_activity_events"
  on public.activity_events for select to anon, authenticated using (true);
create policy "classroom_insert_activity_events"
  on public.activity_events for insert to anon, authenticated with check (true);
create policy "classroom_update_activity_events"
  on public.activity_events for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_delete_activity_events"
  on public.activity_events for delete to anon, authenticated using (true);
