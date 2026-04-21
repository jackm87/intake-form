import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OcrJob } from "@/lib/templates/types";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { jobId } = await params;

  const admin = createAdminClient();

  const { data: job, error } = await admin
    .from("ocr_jobs")
    .select("status, result")
    .eq("id", jobId)
    .single<Pick<OcrJob, "status" | "result">>();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ status: job.status, result: job.result });
}
