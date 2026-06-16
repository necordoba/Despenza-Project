-- ============================================================
-- DESPENZA — Esquema de base de datos para Supabase
-- Ejecuta este script completo en: Supabase > SQL Editor > New query
-- ============================================================

-- Tabla de productos (inventario)
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  category        text not null,
  quantity        numeric not null default 0,
  unit            text not null default 'unidades',
  min_stock       numeric not null default 1,
  expiration_date date,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Tabla de lista de compras
create table if not exists shopping (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references products(id) on delete set null,
  name        text not null,
  quantity    numeric not null default 1,
  unit        text not null default 'unidades',
  checked     boolean not null default false,
  created_at  timestamptz default now()
);

-- Seguridad por fila (Row Level Security)
alter table products enable row level security;
alter table shopping  enable row level security;

-- Políticas: cada usuario solo ve y edita sus propios datos
create policy "Ver productos propios"   on products for select using (auth.uid() = user_id);
create policy "Crear productos propios" on products for insert with check (auth.uid() = user_id);
create policy "Editar productos propios" on products for update using (auth.uid() = user_id);
create policy "Borrar productos propios" on products for delete using (auth.uid() = user_id);

create policy "Ver compras propias"    on shopping for select using (auth.uid() = user_id);
create policy "Crear compras propias"  on shopping for insert with check (auth.uid() = user_id);
create policy "Editar compras propias" on shopping for update using (auth.uid() = user_id);
create policy "Borrar compras propias" on shopping for delete using (auth.uid() = user_id);

-- Trigger: actualiza updated_at automáticamente en products
-- security invoker + search_path = '' evitan el warning del Security Advisor
create or replace function update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure update_updated_at();

-- Habilitar tiempo real (Realtime)
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table shopping;

-- ============================================================
-- MIGRACIONES: Ejecuta estas si ya tienes las tablas creadas
-- ============================================================

-- 1. Columna de consumo acumulado
alter table products add column if not exists used_quantity numeric not null default 0;

-- 2. Fixes de seguridad (Security Advisor)
-- Ancla el search_path de la función (Fix warning "Function Search Path Mutable")
create or replace function update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Revoca ejecución pública de función interna de Supabase
-- (Fix warnings "Public/Signed-In Can Execute SECURITY DEFINER Function")
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;

-- Fix 4 (Leaked Password Protection): activar en el dashboard
-- Supabase → Authentication → Settings → Password Security → Enable "Leaked Password Protection"
