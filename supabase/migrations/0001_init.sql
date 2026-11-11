-- Pilates Lulú · esquema inicial
-- Ejecutalo en Supabase → SQL Editor (o con `supabase db push`).

-- ───────────── Sesiones del quiz ─────────────
create table if not exists public.quiz_sessions (
  id               uuid primary key,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  attribution      jsonb not null default '{}'::jsonb,   -- utm_*, fbclid
  variants         jsonb not null default '{}'::jsonb,   -- { stepId: "A" | "B" ... }
  answers          jsonb not null default '{}'::jsonb,
  last_step_id     text,
  last_step_index  int,
  max_step_index   int not null default 0,
  reached_result_at   timestamptz,
  checkout_clicked_at timestamptz,
  user_agent       text
);

-- ───────────── Eventos por paso ─────────────
create table if not exists public.quiz_events (
  id          bigint generated always as identity primary key,
  session_id  uuid not null references public.quiz_sessions(id) on delete cascade,
  created_at  timestamptz not null default now(),
  event       text not null check (event in ('view','answer','result','checkout')),
  step_id     text not null,
  step_index  int not null,
  step_name   text,
  variant     text not null default 'A',
  value       jsonb
);
create index if not exists quiz_events_session_idx on public.quiz_events (session_id);
create index if not exists quiz_events_step_idx on public.quiz_events (step_id, event);

-- Upsert atómico de sesión + inserción del evento.
create or replace function public.track_quiz_event(
  p_session_id uuid, p_event text, p_step_id text, p_step_index int, p_step_name text,
  p_variant text, p_value jsonb, p_answers jsonb, p_attribution jsonb, p_variants jsonb, p_user_agent text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into quiz_sessions (id, attribution, variants, answers, last_step_id, last_step_index, max_step_index, user_agent)
  values (p_session_id, coalesce(p_attribution,'{}'), coalesce(p_variants,'{}'), coalesce(p_answers,'{}'),
          p_step_id, p_step_index, p_step_index, p_user_agent)
  on conflict (id) do update set
    updated_at      = now(),
    answers         = coalesce(excluded.answers, quiz_sessions.answers),
    variants        = quiz_sessions.variants || excluded.variants,
    attribution     = case when quiz_sessions.attribution = '{}'::jsonb then excluded.attribution else quiz_sessions.attribution end,
    last_step_id    = excluded.last_step_id,
    last_step_index = excluded.last_step_index,
    max_step_index  = greatest(quiz_sessions.max_step_index, excluded.last_step_index);

  if p_event = 'result' then
    update quiz_sessions set reached_result_at = coalesce(reached_result_at, now()) where id = p_session_id;
  elsif p_event = 'checkout' then
    update quiz_sessions set checkout_clicked_at = coalesce(checkout_clicked_at, now()) where id = p_session_id;
  end if;

  insert into quiz_events (session_id, event, step_id, step_index, step_name, variant, value)
  values (p_session_id, p_event, p_step_id, p_step_index, p_step_name, coalesce(p_variant,'A'), p_value);
end $$;

-- Abandono por paso: sesiones cuyo paso más lejano fue X y no llegaron al checkout.
create or replace view public.funnel_dropoff as
with reach as (
  select step_index, step_id, variant, count(distinct session_id) as sessions
  from quiz_events where event = 'view'
  group by step_index, step_id, variant
)
select r.step_index, r.step_id, r.variant, r.sessions,
       lead(r.sessions) over (partition by r.variant order by r.step_index) as next_step_sessions,
       round(100.0 * (1 - lead(r.sessions) over (partition by r.variant order by r.step_index)::numeric
             / nullif(r.sessions,0)), 1) as dropoff_pct
from reach r
order by r.variant, r.step_index;

-- Resultado de cada test A/B por paso: cuántas sesiones con esa variante llegaron al checkout.
create or replace view public.ab_results as
select e.step_id, e.variant,
       count(distinct e.session_id) as sessions,
       count(distinct s.id) filter (where s.reached_result_at is not null) as reached_result,
       count(distinct s.id) filter (where s.checkout_clicked_at is not null) as clicked_checkout
from quiz_events e join quiz_sessions s on s.id = e.session_id
where e.event = 'view'
group by e.step_id, e.variant
order by e.step_id, e.variant;

-- ───────────── Reseñas (/opinion) ─────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  name        text not null check (char_length(name) between 2 and 60),
  city        text not null check (char_length(city) between 2 and 60),
  text        text not null check (char_length(text) between 20 and 1200),
  rating      int  not null check (rating between 1 and 5),
  media_path  text,
  media_type  text check (media_type in ('image','video')),
  consent     boolean not null check (consent = true),
  consent_text text not null,
  approved_at timestamptz
);

-- Seguridad: RLS activado y SIN políticas públicas. Solo el backend (service role) lee/escribe.
alter table public.quiz_sessions enable row level security;
alter table public.quiz_events   enable row level security;
alter table public.reviews       enable row level security;
revoke execute on function public.track_quiz_event from anon, authenticated;

-- Bucket privado para fotos y videos de reseñas.
insert into storage.buckets (id, name, public, file_size_limit)
values ('review-media', 'review-media', false, 104857600)
on conflict (id) do nothing;
