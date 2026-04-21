import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Organization } from "@/lib/templates/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface SubmitBody {
  fields: Record<string, string>;
  uploadIds: string[];
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const admin = createAdminClient();

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single<Pick<Organization, "id">>();

  if (orgError || !org) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  let body: SubmitBody;
  try {
    body = await request.json() as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fields, uploadIds } = body;

  if (!fields || typeof fields !== "object") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Get template type from form_config
  const { data: formConfig, error: configError } = await admin
    .from("form_configs")
    .select("template_type")
    .eq("org_id", org.id)
    .single<{ template_type: string }>();

  if (configError || !formConfig) {
    return NextResponse.json({ error: "Form configuration not found" }, { status: 404 });
  }

  const { data: submission, error: submissionError } = await admin
    .from("submissions")
    .insert({
      org_id: org.id,
      template_type: formConfig.template_type,
      status: "complete",
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (submissionError || !submission) {
    console.error("submissions insert error:", submissionError);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }

  const submissionId = submission.id;

  // Bulk insert submission fields
  const fieldRows = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      submission_id: submissionId,
      field_key: key,
      field_value: String(value),
      ocr_confidence: null,
      flagged: false,
    }));

  if (fieldRows.length > 0) {
    const { error: fieldsError } = await admin
      .from("submission_fields")
      .insert(fieldRows);

    if (fieldsError) {
      console.error("submission_fields insert error:", fieldsError);
      return NextResponse.json({ error: "Failed to save fields" }, { status: 500 });
    }
  }

  // Link uploads to this submission
  if (uploadIds && uploadIds.length > 0) {
    const { error: uploadsError } = await admin
      .from("document_uploads")
      .update({ submission_id: submissionId })
      .in("id", uploadIds);

    if (uploadsError) {
      console.error("document_uploads update error:", uploadsError);
      // Non-fatal — submission is already created
    }
  }

  return NextResponse.json({ submissionId });
}
