-- Enable RLS on all tables
alter table organizations enable row level security;
alter table form_configs enable row level security;
alter table submissions enable row level security;
alter table submission_fields enable row level security;
alter table document_uploads enable row level security;
alter table ocr_jobs enable row level security;

-- Organizations: only owner can access
create policy "org_owner_all" on organizations
  for all using (user_id = auth.uid());

-- Form configs: only org owner
create policy "form_config_owner_all" on form_configs
  for all using (
    org_id in (select id from organizations where user_id = auth.uid())
  );

-- Submissions: org owner can read; end customers write via service role
create policy "submissions_owner_read" on submissions
  for select using (
    org_id in (select id from organizations where user_id = auth.uid())
  );

-- Submission fields: org owner read only
create policy "fields_owner_read" on submission_fields
  for select using (
    submission_id in (
      select id from submissions where
        org_id in (select id from organizations where user_id = auth.uid())
    )
  );

-- Document uploads: org owner read only
create policy "uploads_owner_read" on document_uploads
  for select using (
    org_id in (select id from organizations where user_id = auth.uid())
  );

-- OCR jobs: org owner read only
create policy "ocr_jobs_owner_read" on ocr_jobs
  for select using (
    org_id in (select id from organizations where user_id = auth.uid())
  );
