import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";
import type { Organization, Submission, SubmissionField } from "@/lib/templates/types";

export default async function SubmissionsPage() {
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

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  const submissionIds = (submissions ?? []).map((s) => s.id);
  let allFields: SubmissionField[] = [];

  if (submissionIds.length > 0) {
    const { data: fields } = await supabase
      .from("submission_fields")
      .select("*")
      .in("submission_id", submissionIds);
    allFields = (fields ?? []) as SubmissionField[];
  }

  const submissionsWithFields = ((submissions ?? []) as Submission[]).map((s) => ({
    ...s,
    fields: allFields.filter((f) => f.submission_id === s.id),
  }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-50">Submissions</h1>
        <p className="text-sm text-zinc-400 mt-1">
          All form responses from your clients.
        </p>
      </div>

      <SubmissionsTable submissions={submissionsWithFields} />
    </div>
  );
}
