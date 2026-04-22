"use client";

import { ClipboardList, Shield, HeartPulse, Scale, type LucideIcon, ScanText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { taxTemplate } from "@/lib/templates/tax";
import { insuranceTemplate } from "@/lib/templates/insurance";
import { healthTemplate } from "@/lib/templates/health";
import { legalTemplate } from "@/lib/templates/legal";
import type { TemplateConfig } from "@/lib/templates/types";

const ICONS: Record<string, LucideIcon> = {
  "clipboard-list": ClipboardList,
  "shield": Shield,
  "heart-pulse": HeartPulse,
  "scale": Scale,
};

const DOC_LABELS: Record<string, string> = {
  drivers_license: "Driver's License",
  w2: "W-2",
  insurance_card: "Insurance Card",
  vehicle_registration: "Vehicle Registration",
  other: "Other Documents",
};

const TEMPLATES: TemplateConfig[] = [taxTemplate, insuranceTemplate, healthTemplate, legalTemplate];

const ACCENT_COLORS: Record<string, string> = {
  tax: "#10b981",
  insurance: "#10b981",
  health: "#10b981",
  legal: "#10b981",
};

export default function Templates() {
  return (
    <section id="templates" className="py-20 md:py-28 px-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Templates
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight max-w-lg">
            Built for your industry
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-md">
            Each template is pre-configured with the exact fields and document types your practice needs. Nothing to set up.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((t) => {
            const Icon = ICONS[t.icon];
            const accent = ACCENT_COLORS[t.key];
            const dataSteps = t.steps.filter((s) => s.key !== "upload" && s.key !== "review");
            const totalFields = t.steps.flatMap((s) => s.fields).length;
            const ocrFields = t.steps.flatMap((s) => s.fields).filter((f) => f.ocrSourceField).length;

            return (
              <div
                key={t.key}
                className="rounded-xl border border-white/8 p-5 flex flex-col gap-5"
                style={{ backgroundColor: "var(--surface)" }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${accent}18` }}
                  >
                    {Icon && <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.5} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-50 leading-tight">{t.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{t.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 py-3 border-t border-b border-white/6">
                  <div>
                    <p className="text-lg font-bold text-zinc-50 leading-none">{totalFields}</p>
                    <p className="text-xs text-zinc-500 mt-1">Fields</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-zinc-50 leading-none">{ocrFields}</p>
                    <p className="text-xs text-zinc-500 mt-1">OCR filled</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-zinc-50 leading-none">{dataSteps.length}</p>
                    <p className="text-xs text-zinc-500 mt-1">Steps</p>
                  </div>
                </div>

                {/* Accepted docs */}
                <div className="flex flex-wrap gap-1.5">
                  {t.acceptedDocTypes.map((doc) => (
                    <span
                      key={doc}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                      style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}25`, color: accent }}
                    >
                      <ScanText className="w-2.5 h-2.5" strokeWidth={1.5} />
                      {DOC_LABELS[doc]}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/signup?template=${t.key}`}
                  className="mt-auto flex items-center gap-1.5 text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
                  style={{ color: accent }}
                >
                  Start with {t.name}
                  <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
