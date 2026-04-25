-- Ejecutar esto en Supabase > SQL Editor > New Query

-- 1. Crear la tabla de respuestas
create table responses (
  id bigint generated always as identity primary key,
  answers jsonb not null,
  beta_contact text,
  created_at timestamptz default now()
);

-- 2. Habilitar acceso público para INSERT (cualquiera puede responder)
alter table responses enable row level security;

create policy "Cualquiera puede insertar respuestas"
  on responses for insert
  with check (true);

-- 3. Habilitar acceso público para SELECT (para ver resultados)
create policy "Cualquiera puede leer respuestas"
  on responses for select
  using (true);
