create unique index if not exists
  scheduled_emails_enrollment_step_unique_idx
on public.scheduled_emails (
  enrollment_id,
  automation_step_id
);