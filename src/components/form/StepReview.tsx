"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerFormStore } from "@/stores/customerFormStore";
import type { TemplateConfig } from "@/lib/templates/types";

interface StepReviewProps {
  slug: string;
  template: TemplateConfig;
  setStep: (step: number) => void;
  brandColor: string;
}

export function StepReview({ slug, template, setStep, brandColor }: StepReviewProps) {
  const router = useRouter();
  const { fields, uploadIds } = useCustomerFormStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data steps only (exclude upload and review steps)
  const dataSteps = template.steps.filter(
    (s) => s.key !== "upload" && s.key !== "review" && s.fields.length > 0
  );

  const requiredFields = template.steps
    .flatMap((s) => s.fields)
    .filter((f) => f.required);

  const hasRequiredFields = requiredFields.every(
    (f) => fields[f.key] && fields[f.key].trim() !== ""
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/f/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, uploadIds }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const { submissionId } = await res.json() as { submissionId: string };
      router.push(`/f/${slug}/success?submissionId=${submissionId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-50">Review Your Information</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Please review your answers before submitting.
        </p>
      </div>

      <div className="space-y-4">
        {dataSteps.map((step, idx) => {
          // Step index in the overall steps array (1-based, after upload)
          const stepNumber = template.steps.findIndex((s) => s.key === step.key) + 1;

          return (
            <details
              key={step.key}
              open
              className="rounded-lg border border-zinc-800 overflow-hidden group"
            >
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 select-none hover:bg-zinc-900 transition-colors duration-150">
                <span className="text-sm font-semibold text-zinc-200">{step.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(stepNumber);
                  }}
                  className="text-xs font-medium transition-opacity duration-150 hover:opacity-75"
                  style={{ color: brandColor }}
                >
                  Edit
                </button>
              </summary>

              <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                {step.fields.map((field) => (
                  <div key={field.key} className="flex items-start justify-between gap-4 px-4 py-2.5">
                    <span className="text-xs font-medium text-zinc-500">{field.label}</span>
                    <span className="text-xs text-zinc-300 text-right">
                      {fields[field.key] || <span className="text-zinc-600 italic">—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>

      {error && (
        <p className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!hasRequiredFields || submitting}
        className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-150 hover:opacity-85"
        style={{ backgroundColor: brandColor }}
      >
        {submitting ? "Submitting…" : "Submit →"}
      </button>
    </div>
  );
}
