-- =========================================================
-- AUTOMATISATIONS
-- =========================================================

create table public.automations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade
    default auth.uid(),

  name text not null
    check (char_length(trim(name)) > 0),

  description text,

  trigger_type text not null
    check (
      trigger_type in (
        'manual',
        'new_prospect',
        'status_contacted',
        'status_proposal',
        'inactive_30_days'
      )
    ),

  is_active boolean not null default true,
  stop_on_reply boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index automations_user_id_idx
  on public.automations(user_id);

create trigger automations_update_updated_at
before update on public.automations
for each row
execute function public.update_updated_at();


-- =========================================================
-- ÉTAPES DES AUTOMATISATIONS
-- =========================================================

create table public.automation_steps (
  id uuid primary key default gen_random_uuid(),

  automation_id uuid not null
    references public.automations(id)
    on delete cascade,

  position integer not null
    check (position > 0),

  delay_value integer not null default 0
    check (delay_value >= 0),

  delay_unit text not null
    check (
      delay_unit in (
        'minutes',
        'hours',
        'days'
      )
    ),

  subject text not null
    check (char_length(trim(subject)) > 0),

  body text not null
    check (char_length(trim(body)) > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (automation_id, position)
);

create index automation_steps_automation_id_idx
  on public.automation_steps(automation_id);

create trigger automation_steps_update_updated_at
before update on public.automation_steps
for each row
execute function public.update_updated_at();


-- =========================================================
-- INSCRIPTION D’UN PROSPECT À UNE AUTOMATISATION
-- =========================================================

create table public.automation_enrollments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade
    default auth.uid(),

  automation_id uuid not null
    references public.automations(id)
    on delete cascade,

  prospect_id uuid not null
    references public.prospects(id)
    on delete cascade,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'active',
        'completed',
        'stopped',
        'failed'
      )
    ),

  current_step_position integer not null default 1
    check (current_step_position > 0),

  stop_reason text,

  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  stopped_at timestamptz,
  updated_at timestamptz not null default now()
);

create index automation_enrollments_user_id_idx
  on public.automation_enrollments(user_id);

create index automation_enrollments_automation_id_idx
  on public.automation_enrollments(automation_id);

create index automation_enrollments_prospect_id_idx
  on public.automation_enrollments(prospect_id);

create unique index automation_enrollments_active_unique_idx
  on public.automation_enrollments(automation_id, prospect_id)
  where status in ('pending', 'active');

create trigger automation_enrollments_update_updated_at
before update on public.automation_enrollments
for each row
execute function public.update_updated_at();


-- =========================================================
-- FILE D’ATTENTE DES E-MAILS
-- =========================================================

create table public.scheduled_emails (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  enrollment_id uuid not null
    references public.automation_enrollments(id)
    on delete cascade,

  automation_step_id uuid not null
    references public.automation_steps(id)
    on delete cascade,

  prospect_id uuid not null
    references public.prospects(id)
    on delete cascade,

  recipient_email text not null,
  subject text not null,
  body text not null,

  scheduled_for timestamptz not null,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'processing',
        'sent',
        'failed',
        'cancelled'
      )
    ),

  attempts integer not null default 0
    check (attempts >= 0),

  last_error text,
  provider_message_id text,
  sent_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index scheduled_emails_user_id_idx
  on public.scheduled_emails(user_id);

create index scheduled_emails_enrollment_id_idx
  on public.scheduled_emails(enrollment_id);

create index scheduled_emails_prospect_id_idx
  on public.scheduled_emails(prospect_id);

create index scheduled_emails_pending_idx
  on public.scheduled_emails(scheduled_for)
  where status = 'pending';

create trigger scheduled_emails_update_updated_at
before update on public.scheduled_emails
for each row
execute function public.update_updated_at();


-- =========================================================
-- HISTORIQUE DES ACTIVITÉS
-- =========================================================

create table public.activities (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  prospect_id uuid not null
    references public.prospects(id)
    on delete cascade,

  automation_id uuid
    references public.automations(id)
    on delete set null,

  activity_type text not null
    check (
      activity_type in (
        'prospect_created',
        'prospect_updated',
        'automation_enrolled',
        'automation_stopped',
        'email_scheduled',
        'email_sent',
        'email_failed',
        'note'
      )
    ),

  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index activities_user_id_idx
  on public.activities(user_id);

create index activities_prospect_id_idx
  on public.activities(prospect_id);

create index activities_created_at_idx
  on public.activities(created_at desc);


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.automations enable row level security;
alter table public.automation_steps enable row level security;
alter table public.automation_enrollments enable row level security;
alter table public.scheduled_emails enable row level security;
alter table public.activities enable row level security;


-- Automatisations

create policy "Users can view their own automations"
on public.automations
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own automations"
on public.automations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own automations"
on public.automations
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own automations"
on public.automations
for delete
to authenticated
using ((select auth.uid()) = user_id);


-- Étapes

create policy "Users can view steps from their automations"
on public.automation_steps
for select
to authenticated
using (
  exists (
    select 1
    from public.automations
    where automations.id = automation_steps.automation_id
      and automations.user_id = (select auth.uid())
  )
);

create policy "Users can create steps in their automations"
on public.automation_steps
for insert
to authenticated
with check (
  exists (
    select 1
    from public.automations
    where automations.id = automation_steps.automation_id
      and automations.user_id = (select auth.uid())
  )
);

create policy "Users can update steps in their automations"
on public.automation_steps
for update
to authenticated
using (
  exists (
    select 1
    from public.automations
    where automations.id = automation_steps.automation_id
      and automations.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.automations
    where automations.id = automation_steps.automation_id
      and automations.user_id = (select auth.uid())
  )
);

create policy "Users can delete steps from their automations"
on public.automation_steps
for delete
to authenticated
using (
  exists (
    select 1
    from public.automations
    where automations.id = automation_steps.automation_id
      and automations.user_id = (select auth.uid())
  )
);


-- Inscriptions

create policy "Users can view their own enrollments"
on public.automation_enrollments
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create valid enrollments"
on public.automation_enrollments
for insert
to authenticated
with check (
  (select auth.uid()) = user_id

  and exists (
    select 1
    from public.automations
    where automations.id =
      automation_enrollments.automation_id
      and automations.user_id = (select auth.uid())
  )

  and exists (
    select 1
    from public.prospects
    where prospects.id =
      automation_enrollments.prospect_id
      and prospects.user_id = (select auth.uid())
  )
);

create policy "Users can update their own enrollments"
on public.automation_enrollments
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own enrollments"
on public.automation_enrollments
for delete
to authenticated
using ((select auth.uid()) = user_id);


-- Les e-mails sont consultables par l’utilisateur.
-- Seul le backend Python utilisera la clé service_role pour les modifier.

create policy "Users can view their own scheduled emails"
on public.scheduled_emails
for select
to authenticated
using ((select auth.uid()) = user_id);


-- Les activités sont consultables par l’utilisateur.
-- Elles seront écrites par le backend ou par des fonctions contrôlées.

create policy "Users can view their own activities"
on public.activities
for select
to authenticated
using ((select auth.uid()) = user_id);