import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SubmissionDetail } from "@/components/dashboard/SubmissionDetail";
import type { Organization, Submission, SubmissionField, DocumentUpload } from "@/lib/templates/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (!orgs || orgs.length === 0) redirect("/onboarding");

  const org = orgs[0] as Organization;

  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .eq("org_id", org.id)
    .single();

  if (!submission) notFound();

  const { data: fields } = await supabase
    .from("submission_fields")
    .select("*")
    .eq("submission_id", id);

  const { data: uploads } = await supabase
    .from("document_uploads")
    .select("*")
    .eq("submission_id", id);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/submissions"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150 mb-2 inline-block"
          >
            ← Back to Submissions
          </Link>
          <h1 className="text-2xl font-bold text-gray-50">Submission Details</h1>
        </div>
        <Link href={`/api/submissions/${id}/pdf`} target="_blank">
          <Button
            variant="outline"
            className="border-white/8 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white gap-2 transition-all duration-150"
          >
            <Download size={15} />
            Download PDF
          </Button>
        </Link>
      </div>

      <SubmissionDetail
        submission={{ ...(submission as Submission), fields: (fields ?? []) as SubmissionField[] }}
        uploads={(uploads ?? []) as DocumentUpload[]}
      />
    </div>
  );
}
