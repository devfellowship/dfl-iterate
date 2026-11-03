-- ============================================================
-- DFL Iterate — sandbox de aula (projeto hpggeagrnoeponiwjgdv)
-- Tabelas da 2ª turma: S-M1 perfil, S-M10 notificações,
-- S-M3 avisos, S-M5 progresso
-- Rodar DEPOIS do script m2-m8-m11 (não recria as tabelas antigas)
-- ============================================================

-- ------------------------------------------------------------
-- M1 — profiles (READ + UPDATE do objeto completo)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text not null,
  age int not null,
  avatar_url text not null
);

insert into public.profiles (id, name, email, age, avatar_url)
values (
  'user-1',
  'Ana Fellow',
  'ana.fellow@devfellowship.dev',
  24,
  'https://i.pravatar.cc/64?u=user-1'
)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  age = excluded.age,
  avatar_url = excluded.avatar_url;

-- ------------------------------------------------------------
-- M10 — notifications (READ lista + UPDATE read = true em 1 id)
-- unreadCount NÃO é coluna: o service calcula
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id text primary key,
  title text not null,
  read boolean not null default false,
  created_at timestamptz not null
);

insert into public.notifications (id, title, read, created_at)
values
  ('notif-1', 'Nova conquista desbloqueada', false, '2026-05-28T08:00:00.000Z'),
  ('notif-2', 'Seu streak está em risco!', false, '2026-05-27T20:15:00.000Z'),
  ('notif-3', 'Bem-vindo ao iterate', true, '2026-05-01T10:00:00.000Z')
on conflict (id) do update set
  title = excluded.title,
  read = excluded.read,
  created_at = excluded.created_at;

-- ------------------------------------------------------------
-- M3 — announcements (READ ativos + DELETE / dispensar por id)
-- ann-4 está expirado de propósito (o GET filtra)
-- ann-1 expira no futuro para continuar visível na aula
-- ------------------------------------------------------------
create table if not exists public.announcements (
  id text primary key,
  title text not null,
  body text not null,
  severity text not null check (severity in ('info', 'warning', 'success')),
  published_at timestamptz not null,
  expires_at timestamptz null
);

insert into public.announcements (id, title, body, severity, published_at, expires_at)
values
  (
    'ann-1',
    'Manutenção Programada',
    'No domingo, 02h–04h, o iterate ficará indisponível para atualizações.',
    'warning',
    '2026-05-20T10:00:00.000Z',
    '2026-12-31T23:59:59.000Z'
  ),
  (
    'ann-2',
    'Novas activities disponíveis',
    'A lição E-commerce Frontend agora tem 17 activities para praticar.',
    'success',
    '2026-05-15T08:00:00.000Z',
    null
  ),
  (
    'ann-3',
    'Dica da semana',
    'Use o histórico de IA para revisar feedbacks das activities anteriores.',
    'info',
    '2026-05-10T12:00:00.000Z',
    null
  ),
  (
    'ann-4',
    'Aviso expirado (não deve aparecer)',
    'Este aviso tem expiresAt no passado e deve ser filtrado pelo service.',
    'warning',
    '2020-01-01T00:00:00.000Z',
    '2020-01-01T00:00:00.000Z'
  )
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  severity = excluded.severity,
  published_at = excluded.published_at,
  expires_at = excluded.expires_at;

-- ------------------------------------------------------------
-- M5 — lesson_progress (READ por lesson_id + UPDATE +1)
-- percent NÃO é coluna: o service calcula
-- ------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id text not null,
  lesson_id text not null,
  completed_activities int not null default 0,
  total_activities int not null,
  primary key (user_id, lesson_id)
);

insert into public.lesson_progress (user_id, lesson_id, completed_activities, total_activities)
values
  ('user-1', 'lesson-1', 5, 17),
  ('user-1', 'lesson-2', 3, 10),
  ('user-1', 'lesson-3', 7, 15)
on conflict (user_id, lesson_id) do update set
  completed_activities = excluded.completed_activities,
  total_activities = excluded.total_activities;

-- ------------------------------------------------------------
-- RLS classroom (anon pode CRUD — sem auth)
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "classroom_select_profiles" on public.profiles;
drop policy if exists "classroom_update_profiles" on public.profiles;
drop policy if exists "classroom_insert_profiles" on public.profiles;
create policy "classroom_select_profiles"
  on public.profiles for select to anon, authenticated using (true);
create policy "classroom_update_profiles"
  on public.profiles for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_insert_profiles"
  on public.profiles for insert to anon, authenticated with check (true);

drop policy if exists "classroom_select_notifications" on public.notifications;
drop policy if exists "classroom_update_notifications" on public.notifications;
drop policy if exists "classroom_insert_notifications" on public.notifications;
create policy "classroom_select_notifications"
  on public.notifications for select to anon, authenticated using (true);
create policy "classroom_update_notifications"
  on public.notifications for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_insert_notifications"
  on public.notifications for insert to anon, authenticated with check (true);

drop policy if exists "classroom_select_announcements" on public.announcements;
drop policy if exists "classroom_delete_announcements" on public.announcements;
drop policy if exists "classroom_insert_announcements" on public.announcements;
create policy "classroom_select_announcements"
  on public.announcements for select to anon, authenticated using (true);
create policy "classroom_delete_announcements"
  on public.announcements for delete to anon, authenticated using (true);
create policy "classroom_insert_announcements"
  on public.announcements for insert to anon, authenticated with check (true);

drop policy if exists "classroom_select_lesson_progress" on public.lesson_progress;
drop policy if exists "classroom_update_lesson_progress" on public.lesson_progress;
drop policy if exists "classroom_insert_lesson_progress" on public.lesson_progress;
create policy "classroom_select_lesson_progress"
  on public.lesson_progress for select to anon, authenticated using (true);
create policy "classroom_update_lesson_progress"
  on public.lesson_progress for update to anon, authenticated
  using (true) with check (true);
create policy "classroom_insert_lesson_progress"
  on public.lesson_progress for insert to anon, authenticated with check (true);
