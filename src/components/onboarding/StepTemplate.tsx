"use client";

import { getAllTemplates } from "@/lib/templates";
import type { TemplateConfig } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { ClipboardList, Shield, HeartPulse, Scale, type LucideIcon } from "lucide-react";

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  "clipboard-list": ClipboardList,
  "shield": Shield,
  "heart-pulse": HeartPulse,
  "scale": Scale,
};

interface Props {
  templateKey: string;
  onSelect: (key: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  drivers_license: "Driver's License",
  w2: "W-2",
  insurance_card: "Insurance Card",
  vehicle_registration: "Vehicle Registration",
  other: "Other Documents",
};

export function StepTemplate({ templateKey, onSelect, onBack, onNext }: Props) {
  const templates = getAllTemplates();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Choose a template</h2>
        <p className="mt-1 text-sm text-zinc-400">Pick the intake form type that best fits your practice. You can customize it later.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((template: TemplateConfig) => {
          const isSelected = templateKey === template.key;
          return (
            <button
              key={template.key}
              type="button"
              onClick={() => onSelect(template.key)}
              className={[
                "relative text-left rounded-lg border p-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
                isSelected
                  ? "border-sky-500/60 bg-sky-500/8 ring-2 ring-sky-400"
                  : "border-white/8 hover:border-white/16 hover:bg-white/3",
              ].join(" ")}
              style={{ background: isSelected ? "rgba(14,165,233,0.06)" : "var(--elevated)" }}
            >
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}

              <div className="space-y-2">
                <div className="leading-none">
                  {(() => { const Icon = TEMPLATE_ICONS[template.icon]; return Icon ? <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.5} /> : null; })()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{template.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-400 leading-snug">{template.description}</p>
                </div>
                <div className="pt-1 space-y-1">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Documents accepted</p>
                  <ul className="space-y-0.5">
                    {template.acceptedDocTypes.map((docType) => (
                      <li key={docType} className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                        {DOC_TYPE_LABELS[docType] ?? docType}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-1 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} size="sm">
          <svg className="mr-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Button>
        <Button onClick={onNext} disabled={!templateKey} size="sm">
          Next
          <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
