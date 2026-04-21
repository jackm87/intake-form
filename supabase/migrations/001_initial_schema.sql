-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Organizations (one per client user)
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  slug        text not null unique,
  name        text not null,
  logo_url    text,
  brand_color text,
  created_at  timestamptz not null default now()
);
create unique index idx_organizations_user_id on organizations(user_id);
create unique index idx_organizations_slug on organizations(slug);

-- Form configs (one per org)
create table form_configs (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizations(id) on delete cascade,
  template_type   text not null check (template_type in ('tax','insurance','health','legal')),
  customizations  jsonb not null default '{}',
  created_at      timestamptz not null default now()
);
create unique index idx_form_configs_org_id on form_configs(org_id);

-- Submissions (end customers)
create table submissions (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizations(id) on delete cascade,
  template_type   text not null,
  status          text not null default 'partial' check (status in ('partial','complete')),
  submitted_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index idx_submissions_org_id on submissions(org_id);
create index idx_submissions_org_id_created on submissions(org_id, created_at desc);

-- Submission fields
create table submission_fields (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid not null references submissions(id) on delete cascade,
  field_key       text not null,
  field_value     text not null,
  ocr_confidence  numeric(4,3),
  flagged         boolean not null default false
);
create index idx_submission_fields_submission_id on submission_fields(submission_id);

-- Document uploads
create table document_uploads (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid references submissions(id) on delete cascade,
  org_id          uuid not null references organizations(id) on delete cascade,
  storage_path    text not null,
  doc_type        text not null,
  uploaded_at     timestamptz not null default now()
);
create index idx_document_uploads_submission_id on document_uploads(submission_id);
create index idx_document_uploads_org_id on document_uploads(org_id);

-- OCR jobs
create table ocr_jobs (
  id                  uuid primary key default gen_random_uuid(),
  document_upload_id  uuid not null references document_uploads(id) on delete cascade,
  org_id              uuid not null,
  status              text not null default 'pending' check (status in ('pending','processing','complete','failed')),
  result              jsonb,
  created_at          timestamptz not null default now(),
  completed_at        timestamptz
);
create index idx_ocr_jobs_document_upload_id on ocr_jobs(document_upload_id);
create index idx_ocr_jobs_org_id on ocr_jobs(org_id);
