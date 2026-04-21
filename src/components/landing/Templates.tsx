"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Shield, HeartPulse, Scale, type LucideIcon, ScanText, ChevronRight, ArrowRight } from "lucide-react";
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
  tax: "#0ea5e9",
  insurance: "#6366f1",
  health: "#10b981",
  legal: "#f59e0b",
};

export default function Templates() {
  const [activeKey, setActiveKey] = useState("tax");
  const active = TEMPLATES.find((t) => t.key === activeKey)!;
  const dataSteps = active.steps.filter((s) => s.key !== "upload" && s.key !== "review");
  const accent = ACCENT_COLORS[activeKey];

  return (
    <section
      id="templates"
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Templates
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-3 max-w-lg">
          Built for your industry
        </h2>
        <p className="text-sm text-zinc-400 mb-10 max-w-md">
          Each template is pre-configured with the exact fields and document types your practice needs. Nothing to set up.
        </p>

        {/* Tab row */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATES.map((t) => {
            const Icon = ICONS[t.icon];
            const isActive = t.key === activeKey;
            return (
              <button
                key={t.key}
                onClick={() => setActiveKey(t.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border"
                style={
                  isActive
                    ? { backgroundColor: `${ACCENT_COLORS[t.key]}15`, borderColor: `${ACCENT_COLORS[t.key]}50`, color: ACCENT_COLORS[t.key] }
                    : { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#71717a" }
                }
              >
                {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left — template info */}
            <div
              className="rounded-xl border p-6 flex flex-col gap-6"
              style={{ backgroundColor: "#111318", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}18` }}
                >
                  {(() => { const Icon = ICONS[active.icon]; return Icon ? <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.5} /> : null; })()}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-50">{active.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{active.description}</p>
                </div>
              </div>

              {/* Accepted documents */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Accepted documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.acceptedDocTypes.map((doc) => (
                    <span
                      key={doc}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                      style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}30`, color: accent }}
                    >
                      <ScanText className="w-3 h-3" strokeWidth={1.5} />
                      {DOC_LABELS[doc]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 pt-2 border-t border-white/6">
                <div>
                  <p className="text-xl font-bold text-zinc-50">{dataSteps.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Form steps</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-50">
                    {active.steps.flatMap((s) => s.fields).length}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Total fields</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-50">
                    {active.steps.flatMap((s) => s.fields).filter((f) => f.ocrSourceField).length}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">OCR auto-filled</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/signup?template=${activeKey}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-85"
                style={{ backgroundColor: accent }}
              >
                Start with {active.name}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {/* Right — steps + fields preview */}
            <div
              className="rounded-xl border p-6 flex flex-col gap-4"
              style={{ backgroundColor: "#111318", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Form steps
              </p>

              <div className="flex flex-col gap-0">
                {dataSteps.map((step, stepIdx) => (
                  <div key={step.key} className="flex gap-3">
                    {/* Step number + line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: `${accent}18`, color: accent }}
                      >
                        {stepIdx + 1}
                      </div>
                      {stepIdx < dataSteps.length - 1 && (
                        <div className="w-px flex-1 my-1.5" style={{ backgroundColor: `${accent}20` }} />
                      )}
                    </div>

                    {/* Step content */}
                    <div className={`pb-4 flex-1 ${stepIdx === dataSteps.length - 1 ? "" : ""}`}>
                      <p className="text-sm font-semibold text-zinc-100 mb-2">{step.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.fields.slice(0, 6).map((field) => (
                          <span
                            key={field.key}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-zinc-400 border border-white/8"
                            style={{ backgroundColor: "#191c23" }}
                          >
                            {field.ocrSourceField && (
                              <ScanText className="w-2.5 h-2.5 text-sky-400 shrink-0" strokeWidth={2} />
                            )}
                            {field.label}
                          </span>
                        ))}
                        {step.fields.length > 6 && (
                          <span className="px-2 py-0.5 rounded text-xs text-zinc-600 border border-white/6" style={{ backgroundColor: "#191c23" }}>
                            +{step.fields.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Review step */}
                <div className="flex gap-3 opacity-40">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-500 pt-0.5">Review & Submit</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
