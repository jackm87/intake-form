"use client";

import { useRouter } from "next/navigation";
import { Download, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Submission, SubmissionField } from "@/lib/templates/types";

type SubmissionWithFields = Submission & { fields: SubmissionField[] };

interface SubmissionsTableProps {
  submissions: SubmissionWithFields[];
}

const templateLabels: Record<string, string> = {
  tax: "Tax Preparation",
  insurance: "Insurance",
  health: "Health Intake",
  legal: "Legal Services",
};

function getField(fields: SubmissionField[], key: string) {
  return fields.find((f) => f.field_key === key)?.field_value ?? "";
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const router = useRouter();

  function handleExportCSV() {
    const headers = ["Name", "Email", "Template", "Date", "Status"];
    const rows = submissions.map((s) => {
      const firstName = getField(s.fields, "firstName");
      const lastName = getField(s.fields, "lastName");
      const name = [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
      const email = getField(s.fields, "email");
      const template = templateLabels[s.template_type] ?? s.template_type;
      const date = formatDate(s.submitted_at ?? s.created_at);
      return [name, email, template, date, s.status].map((v) => `"${v}"`).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "submissions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (submissions.length === 0) {
    return (
      <div
        className="rounded-lg border border-white/8 flex flex-col items-center justify-center py-20 px-6 text-center"
        style={{ background: "#111318" }}
      >
        <Inbox size={36} className="text-zinc-600 mb-4" />
        <p className="text-sm font-medium text-zinc-400">No submissions yet</p>
        <p className="text-xs text-zinc-600 mt-1">
          Share your form link to start receiving responses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{submissions.length} total</p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCSV}
          className="border-white/8 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white gap-1.5 transition-all duration-150"
        >
          <Download size={14} />
          Export CSV
        </Button>
      </div>

      <div
        className="rounded-lg border border-white/8 overflow-hidden"
        style={{ background: "#111318" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Template
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
              const firstName = getField(submission.fields, "firstName");
              const lastName = getField(submission.fields, "lastName");
              const name = [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
              const email = getField(submission.fields, "email");

              return (
                <tr
                  key={submission.id}
                  onClick={() => router.push(`/dashboard/submissions/${submission.id}`)}
                  className="border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/3 transition-all duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-zinc-200">{name}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{email || "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {templateLabels[submission.template_type] ?? submission.template_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {formatDate(submission.submitted_at ?? submission.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    {submission.status === "complete" ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/10"
                      >
                        Complete
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/10"
                      >
                        Partial
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
