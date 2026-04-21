import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid"; // used for storage path key only
import { createAdminClient } from "@/lib/supabase/admin";
import { processDocument } from "@/lib/ocr/mockOcrService";
import type { DocType, Organization } from "@/lib/templates/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const docType = formData.get("docType") as DocType | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!docType) {
    return NextResponse.json({ error: "Missing docType" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const storageKey = nanoid();
  const storagePath = `documents/${org.id}/${storageKey}.${ext}`;

  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("documents")
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: uploadRow, error: uploadRowError } = await admin
    .from("document_uploads")
    .insert({
      submission_id: null,
      org_id: org.id,
      storage_path: storagePath,
      doc_type: docType,
    })
    .select("id")
    .single<{ id: string }>();

  if (uploadRowError || !uploadRow) {
    console.error("document_uploads insert error:", uploadRowError);
    return NextResponse.json({ error: "Failed to record upload" }, { status: 500 });
  }

  const { data: jobRow, error: jobError } = await admin
    .from("ocr_jobs")
    .insert({
      document_upload_id: uploadRow.id,
      org_id: org.id,
      status: "pending",
      result: null,
    })
    .select("id")
    .single<{ id: string }>();

  if (jobError || !jobRow) {
    console.error("ocr_jobs insert error:", jobError);
    return NextResponse.json({ error: "Failed to create OCR job" }, { status: 500 });
  }

  // Fire-and-forget — intentionally not awaited
  processDocument(jobRow.id, storagePath, docType).catch((err) => {
    console.error("OCR processing error:", err);
  });

  return NextResponse.json({ uploadId: uploadRow.id, jobId: jobRow.id });
}
