-- ==============================================================================
-- 📖 CUATRO PALABRAS · ESTRUCTURA DE LA BASE DE DATOS (SCHEMA)
-- ==============================================================================
-- Este archivo define ÚNICAMENTE la estructura y seguridad de las tablas.
-- NO contiene textos ni contenido con propiedad intelectual del libro.
-- Es 100% seguro para versionar en Git.
-- ==============================================================================

-- 1. TABLA DE LECTORES AUTORIZADOS
create table if not exists public.allowed_readers (
  email text primary key,
  has_full_access boolean not null default true,
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text
);

alter table public.allowed_readers enable row level security;

drop policy if exists "Users can check their own full access status" on public.allowed_readers;
create policy "Users can check their own full access status"
  on public.allowed_readers
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- 2. TABLA DE CAPÍTULOS PROTEGIDOS
create table if not exists public.book_chapters (
  chapter_id text primary key,
  book_id text not null default 'tomo-1',
  chapter_order int not null,
  is_free boolean not null default false,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.book_chapters enable row level security;

-- Política 1: Capítulos gratuitos legibles por cualquier visitante
drop policy if exists "Free chapters readable by all" on public.book_chapters;
create policy "Free chapters readable by all"
  on public.book_chapters
  for select
  using (is_free = true);

-- Política 2: Capítulos protegidos SOLO legibles por usuarios en allowed_readers
drop policy if exists "Protected chapters readable only by authorized readers" on public.book_chapters;
create policy "Protected chapters readable only by authorized readers"
  on public.book_chapters
  for select
  to authenticated
  using (
    is_free = true or exists (
      select 1 from public.allowed_readers
      where lower(allowed_readers.email) = lower(auth.jwt() ->> 'email')
        and allowed_readers.has_full_access = true
    )
  );
