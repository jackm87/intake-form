import { FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTemplate } from "@/lib/templates";
import type { Submission, SubmissionField, DocumentUpload } from "@/lib/templates/types";

interface SubmissionDetailProps {
  submission: Submission & { fields: SubmissionField[] };
  uploads: DocumentUpload[];
}

const docTypeLabels: Record<string, string> = {
  drivers_license: "Driver's License",
  w2: "W-2 Form",
  insurance_card: "Insurance Card",
  vehicle_registration: "Vehicle Registration",
  other: "Other Document",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SubmissionDetail({ submission, uploads }: SubmissionDetailProps) {
  const template = getTemplate(submission.template_type);

  const fieldMap: Record<string, SubmissionField> = {};
  for (const f of submission.fields) {
    fieldMap[f.field_key] = f;
  }

  return (
    <div className="space-y-4">
      {/* Meta bar */}
      <div
        className="rounded-lg border border-white/8 px-6 py-4 flex flex-wrap items-center gap-6"
        style={{ background: "#111318" }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Submitted
          </p>
          <p className="text-sm text-zinc-200">
            {formatDate(submission.submitted_at ?? submission.created_at)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Status
          </p>
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
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Template
          </p>
          <p className="text-sm text-zinc-200">{template.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            ID
          </p>
          <p className="text-xs text-zinc-500 font-mono">{submission.id}</p>
        </div>
      </div>

      {/* Steps / fields accordion */}
      {template.steps
        .filter((step) => step.fields.length > 0)
        .map((step) => (
          <div
            key={step.key}
            className="rounded-lg border border-white/8 overflow-hidden"
            style={{ background: "#111318" }}
          >
            <div className="px-6 py-4 border-b border-white/8">
              <h3 className="text-sm font-semibold text-gray-50">{step.label}</h3>
            </div>
            <div className="divide-y divide-white/5">
              {step.fields.map((field) => {
                const submitted = fieldMap[field.key];
                const value = submitted?.field_value;
                const flagged = submitted?.flagged;

                return (
                  <div key={field.key} className="px-6 py-3 flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-zinc-500 w-48 flex-shrink-0 pt-0.5">
                      {field.label}
                    </p>
                    <div className="flex-1 flex items-center gap-2">
                      {value ? (
                        <p className="text-sm text-zinc-200 break-all">
                          {field.type === "ssn"
                            ? value.replace(/\d(?=\d{4})/g, "•")
                            : value}
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-600 italic">Not provided</p>
                      )}
                      {flagged && (
                        <AlertCircle size={14} className="text-amber-400 flex-shrink-0" aria-label="OCR confidence low" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Document uploads */}
      {uploads.length > 0 && (
        <div
          className="rounded-lg border border-white/8 overflow-hidden"
          style={{ background: "#111318" }}
        >
          <div className="px-6 py-4 border-b border-white/8">
            <h3 className="text-sm font-semibold text-gray-50">Uploaded Documents</h3>
          </div>
          <div className="divide-y divide-white/5">
            {uploads.map((upload) => (
              <div key={upload.id} className="px-6 py-3 flex items-center gap-3">
                <FileText size={16} className="text-zinc-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200">
                    {docTypeLabels[upload.doc_type] ?? upload.doc_type}
                  </p>
                  <p className="text-xs text-zinc-500 truncate font-mono mt-0.5">
                    {upload.storage_path.split("/").pop()}
                  </p>
                </div>
                <p className="text-xs text-zinc-600 flex-shrink-0">
                  {new Date(upload.uploaded_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
