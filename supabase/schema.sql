-- DashFetch — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) to
-- set up the database from scratch.

create extension if not exists "pgcrypto";

create table if not exists jd_sessions (
  id                  uuid primary key default gen_random_uuid(),
  jd_text             text not null,
  extracted_json      jsonb,
  generated_questions jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table jd_sessions is
  'One row per job-description analysis session: raw JD text, the structured fields extracted by the LLM, and the generated interview questions.';
comment on column jd_sessions.jd_text is 'Cleaned raw text of the job description (pasted or extracted from an uploaded file).';
comment on column jd_sessions.extracted_json is 'Structured job fields returned by the Groq extraction step. Shape: see lib/jobExtraction.js EMPTY_EXTRACTED_JOB.';
comment on column jd_sessions.generated_questions is 'Generated interview questions grouped by category. Shape: { technical: [...], behavioral: [...], experience: [...] }.';

-- Keep updated_at current on every row change.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_jd_sessions_updated_at on jd_sessions;
create trigger trg_jd_sessions_updated_at
  before update on jd_sessions
  for each row
  execute function set_updated_at();

-- Helpful index for "recent sessions" queries.
create index if not exists idx_jd_sessions_created_at
  on jd_sessions (created_at desc);

-- Row Level Security: the MVP has no auth yet, so sessions are written
-- and read only via the service role key from API routes (server-side).
-- Enabling RLS with no policies blocks all direct client-side access,
-- which is the correct default until user accounts exist.
alter table jd_sessions enable row level security;
