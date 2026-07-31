-- DevFocus: schema inicial
-- Areas, prioridades, cards, streak, streak_historico, frases_motivacionais
-- Todas as tabelas possuem user_id (auth.users) e RLS restringindo ao dono do registro.

create extension if not exists pgcrypto;

-- =========================================================
-- areas
-- =========================================================
create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  cor text,
  criado_em timestamptz not null default now()
);

create index if not exists areas_user_id_idx on public.areas(user_id);

alter table public.areas enable row level security;

create policy "areas_select_own" on public.areas
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "areas_insert_own" on public.areas
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "areas_update_own" on public.areas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "areas_delete_own" on public.areas
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- prioridades
-- =========================================================
create table if not exists public.prioridades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  cor text not null,
  ordem integer not null,
  criado_em timestamptz not null default now()
);

create index if not exists prioridades_user_id_idx on public.prioridades(user_id);

alter table public.prioridades enable row level security;

create policy "prioridades_select_own" on public.prioridades
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "prioridades_insert_own" on public.prioridades
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "prioridades_update_own" on public.prioridades
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "prioridades_delete_own" on public.prioridades
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- cards
-- =========================================================
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  area_id uuid not null references public.areas(id) on delete cascade,
  prioridade_id uuid references public.prioridades(id) on delete set null,
  descricao text not null,
  essencial boolean not null default false,
  prazo date not null,
  status text not null default 'pendente' check (status in ('pendente', 'concluido')),
  criado_em timestamptz not null default now(),
  concluido_em timestamptz
);

create index if not exists cards_user_id_idx on public.cards(user_id);
create index if not exists cards_area_id_idx on public.cards(area_id);
create index if not exists cards_prazo_idx on public.cards(prazo);
create index if not exists cards_essencial_prazo_idx on public.cards(user_id, essencial, prazo);

alter table public.cards enable row level security;

create policy "cards_select_own" on public.cards
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "cards_insert_own" on public.cards
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "cards_update_own" on public.cards
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "cards_delete_own" on public.cards
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- streak (uma linha por usuario)
-- =========================================================
create table if not exists public.streak (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  sequencia_atual integer not null default 0,
  maior_sequencia integer not null default 0,
  ultima_atualizacao date not null default current_date
);

alter table public.streak enable row level security;

create policy "streak_select_own" on public.streak
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "streak_insert_own" on public.streak
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "streak_update_own" on public.streak
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "streak_delete_own" on public.streak
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- streak_historico
-- =========================================================
create table if not exists public.streak_historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  meta_batida boolean not null,
  criado_em timestamptz not null default now(),
  unique (user_id, data)
);

create index if not exists streak_historico_user_id_idx on public.streak_historico(user_id);

alter table public.streak_historico enable row level security;

create policy "streak_historico_select_own" on public.streak_historico
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "streak_historico_insert_own" on public.streak_historico
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "streak_historico_update_own" on public.streak_historico
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "streak_historico_delete_own" on public.streak_historico
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- frases_motivacionais
-- user_id nulo = frase global disponivel para todos os usuarios autenticados
-- =========================================================
create table if not exists public.frases_motivacionais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  texto text not null,
  ativa boolean not null default true
);

create index if not exists frases_motivacionais_user_id_idx on public.frases_motivacionais(user_id);

alter table public.frases_motivacionais enable row level security;

create policy "frases_select_own_or_global" on public.frases_motivacionais
  for select to authenticated
  using (user_id is null or (select auth.uid()) = user_id);

create policy "frases_insert_own" on public.frases_motivacionais
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "frases_update_own" on public.frases_motivacionais
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "frases_delete_own" on public.frases_motivacionais
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================================
-- Seed: frases motivacionais globais + prioridades/areas padrao via trigger
-- =========================================================
insert into public.frases_motivacionais (user_id, texto, ativa) values
  (null, 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', true),
  (null, 'Disciplina é escolher entre o que você quer agora e o que você quer mais.', true),
  (null, 'Progresso, não perfeição.', true),
  (null, 'Cada card concluído é um tijolo na construção do seu futuro.', true),
  (null, 'Foco no processo. O resultado é consequência.', true),
  (null, 'Sua ofensiva é a prova do seu compromisso com você mesmo.', true),
  (null, 'Feito é melhor que perfeito.', true),
  (null, 'Pequenos passos diários criam grandes mudanças.', true)
on conflict do nothing;

-- Cria áreas e prioridades padrão automaticamente para cada novo usuário
create or replace function public.handle_new_user_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.areas (user_id, nome, cor) values
    (new.id, 'Trabalho', '#6366F1'),
    (new.id, 'Faculdade', '#F59E0B'),
    (new.id, 'Dia a dia', '#22C55E');

  insert into public.prioridades (user_id, nome, cor, ordem) values
    (new.id, 'Crítica', '#EF4444', 1),
    (new.id, 'Alta', '#F59E0B', 2),
    (new.id, 'Média', '#6366F1', 3),
    (new.id, 'Baixa', '#6B7280', 4);

  insert into public.streak (user_id, sequencia_atual, maior_sequencia, ultima_atualizacao)
  values (new.id, 0, 0, current_date);

  return new;
end;
$$;

revoke execute on function public.handle_new_user_defaults() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_defaults on auth.users;
create trigger on_auth_user_created_defaults
  after insert on auth.users
  for each row execute function public.handle_new_user_defaults();
