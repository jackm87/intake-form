import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Submission } from "@/lib/templates/types";
import { createClient } from "@/lib/supabase/server";

interface RecentSubmissionsProps {
  submissions: Submission[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  // Fetch first/last name fields for these submissions
  let fieldsBySubmission: Record<string, { firstName?: string; lastName?: string }> = {};

  if (submissions.length > 0) {
    const supabase = await createClient();
    const ids = submissions.map((s) => s.id);
    const { data: fields } = await supabase
      .from("submission_fields")
      .select("submission_id, field_key, field_value")
      .in("submission_id", ids)
      .in("field_key", ["firstName", "lastName"]);

    if (fields) {
      for (const f of fields) {
        if (!fieldsBySubmission[f.submission_id]) {
          fieldsBySubmission[f.submission_id] = {};
        }
        if (f.field_key === "firstName") fieldsBySubmission[f.submission_id].firstName = f.field_value;
        if (f.field_key === "lastName") fieldsBySubmission[f.submission_id].lastName = f.field_value;
      }
    }
  }

  return (
    <div
      className="rounded-lg border border-white/8"
      style={{ background: "#111318" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <h3 className="text-base font-semibold text-gray-50">Recent Submissions</h3>
        {submissions.length > 0 && (
          <Link
            href="/dashboard/submissions"
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors duration-150"
          >
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Inbox size={32} className="text-zinc-600 mb-3" />
          <p className="text-sm font-medium text-zinc-400">No submissions yet</p>
          <p className="text-xs text-zinc-600 mt-1">
            Share your link to get started.
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const names = fieldsBySubmission[submission.id] ?? {};
              const name =
                [names.firstName, names.lastName].filter(Boolean).join(" ") ||
                "Anonymous";

              return (
                <tr
                  key={submission.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-3 text-sm text-zinc-200">{name}</td>
                  <td className="px-6 py-3 text-sm text-zinc-400">
                    {formatDate(submission.submitted_at ?? submission.created_at)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={submission.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Submission["status"] }) {
  if (status === "complete") {
    return (
      <Badge
        variant="outline"
        className="text-xs bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/10"
      >
        Complete
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/10"
    >
      Partial
    </Badge>
  );
}
