import type { TemplateKey } from "@/lib/templates/types";
import { Badge } from "@/components/ui/badge";

interface OverviewStatsProps {
  totalSubmissions: number;
  thisWeekCount: number;
  templateType: TemplateKey;
}

const templateLabels: Record<TemplateKey, string> = {
  tax: "Tax Preparation",
  insurance: "Insurance",
  health: "Health Intake",
  legal: "Legal Services",
};

export function OverviewStats({ totalSubmissions, thisWeekCount, templateType }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        className="rounded-lg p-6 border border-white/8"
        style={{ background: "#111318" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Total Submissions
        </p>
        <p className="text-4xl font-bold text-gray-50">{totalSubmissions}</p>
        <p className="text-xs text-zinc-500 mt-2">All time</p>
      </div>

      <div
        className="rounded-lg p-6 border border-white/8"
        style={{ background: "#111318" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          This Week
        </p>
        <p className="text-4xl font-bold text-gray-50">{thisWeekCount}</p>
        <p className="text-xs text-zinc-500 mt-2">Last 7 days</p>
      </div>

      <div
        className="rounded-lg p-6 border border-white/8"
        style={{ background: "#111318" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Template
        </p>
        <Badge
          className="text-sm font-medium px-3 py-1 bg-sky-400/10 text-sky-400 border-sky-400/20 hover:bg-sky-400/10"
          variant="outline"
        >
          {templateLabels[templateType] ?? templateType}
        </Badge>
        <p className="text-xs text-zinc-500 mt-3">Active form type</p>
      </div>
    </div>
  );
}
