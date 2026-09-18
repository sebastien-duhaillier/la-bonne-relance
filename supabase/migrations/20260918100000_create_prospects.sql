-- Table principale des prospects
create table public.prospects (
  id uuid primary key default gen_random_uuid(),

  -- Le propriétaire du prospect
  user_id uuid not null
    references auth.users(id)
    on delete cascade
    default auth.uid(),

  name text not null,
  company text,
  email text,
  phone text,
  source text not null default 'Autre',
  status text not null default 'Nouveau',
  notes text,

  last_contact_at timestamptz,
  next_follow_up_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Accélère la recherche des prospects appartenant à un utilisateur
create index prospects_user_id_idx
  on public.prospects(user_id);

-- Accélère la recherche des prochaines relances
create index prospects_next_follow_up_at_idx
  on public.prospects(next_follow_up_at);

-- Met automatiquement updated_at à jour après une modification
create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger prospects_update_updated_at
before update on public.prospects
for each row
execute function public.update_updated_at();

-- Activation de la sécurité par utilisateur
alter table public.prospects enable row level security;

create policy "Users can view their own prospects"
on public.prospects
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own prospects"
on public.prospects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own prospects"
on public.prospects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own prospects"
on public.prospects
for delete
to authenticated
using ((select auth.uid()) = user_id);