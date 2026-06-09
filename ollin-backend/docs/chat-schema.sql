-- Ollin Deportes — esquema chat (Supabase)
-- Ejecutar en el proyecto Supabase compartido con JeelJel

create table if not exists public.ollin_chat (
  id uuid primary key default gen_random_uuid(),
  match_id text not null,
  user_id uuid null,
  display_name text not null default 'Aficionado',
  message text not null check (char_length(message) <= 200),
  ip_address text null,
  created_at timestamptz not null default now()
);

create index if not exists ollin_chat_match_id_created_at_idx
  on public.ollin_chat (match_id, created_at desc);

create table if not exists public.ollin_chat_moderacion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  ip_address text not null,
  message text not null,
  reason text not null,
  matched_term text null,
  created_at timestamptz not null default now()
);

create index if not exists ollin_chat_moderacion_created_at_idx
  on public.ollin_chat_moderacion (created_at desc);

create index if not exists ollin_chat_moderacion_user_id_idx
  on public.ollin_chat_moderacion (user_id);

-- RLS: lectura pública del chat; escritura solo vía service role (backend)
alter table public.ollin_chat enable row level security;
alter table public.ollin_chat_moderacion enable row level security;

create policy "ollin_chat_public_read"
  on public.ollin_chat for select
  using (true);

-- ollin_chat_moderacion: sin policies de lectura pública (solo service role)
