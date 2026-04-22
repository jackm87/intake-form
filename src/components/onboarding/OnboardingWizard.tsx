"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepWorkspace } from "./StepWorkspace";
import { StepTemplate } from "./StepTemplate";
import { StepBranding } from "./StepBranding";
import { Logo } from "@/components/ui/Logo";

type Step = 1 | 2 | 3;

interface WizardState {
  step: Step;
  name: string;
  slug: string;
  templateKey: string;
  logoFile: File | null;
  brandColor: string;
}

const STEPS = [
  { number: 1, label: "Workspace" },
  { number: 2, label: "Template" },
  { number: 3, label: "Branding" },
];

interface OnboardingWizardProps {
  defaultTemplate?: string;
}

export function OnboardingWizard({ defaultTemplate = "" }: OnboardingWizardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<WizardState>({
    step: 1,
    name: "",
    slug: "",
    templateKey: defaultTemplate,
    logoFile: null,
    brandColor: "#0ea5e9",
  });

  function updateState(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("slug", state.slug);
      formData.append("templateKey", state.templateKey);
      formData.append("brandColor", state.brandColor);
      if (state.logoFile) {
        formData.append("logo", state.logoFile);
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <Logo size="md" href="/" />
          <p className="mt-2 text-sm text-zinc-400">Set up your workspace</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const isCompleted = state.step > s.number;
            const isActive = state.step === s.number;
            return (
              <div key={s.number} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150",
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-white/5 text-zinc-500 border border-white/10",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      s.number
                    )}
                  </div>
                  <span
                    className={[
                      "text-xs font-medium",
                      isActive ? "text-zinc-200" : "text-zinc-500",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={[
                      "flex-1 h-px mx-3 mb-5 transition-all duration-150",
                      isCompleted ? "bg-emerald-500/60" : "bg-white/8",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div
          className="rounded-xl border border-white/8 p-6 space-y-6"
          style={{ background: "var(--surface)" }}
        >
          {state.step === 1 && (
            <>
              {defaultTemplate && (
                <p className="text-xs text-zinc-500 -mb-2">
                  Template selected:{" "}
                  <span className="text-emerald-400 font-medium capitalize">{defaultTemplate.replace("-", " ")}</span>
                </p>
              )}
              <StepWorkspace
                name={state.name}
                slug={state.slug}
                onChange={(name, slug) => updateState({ name, slug })}
                onNext={() => updateState({ step: 2 })}
              />
            </>
          )}
          {state.step === 2 && (
            <StepTemplate
              templateKey={state.templateKey}
              onSelect={(key) => updateState({ templateKey: key })}
              onBack={() => updateState({ step: 1 })}
              onNext={() => updateState({ step: 3 })}
            />
          )}
          {state.step === 3 && (
            <StepBranding
              orgName={state.name}
              logoFile={state.logoFile}
              brandColor={state.brandColor}
              onLogoChange={(file) => updateState({ logoFile: file })}
              onColorChange={(color) => updateState({ brandColor: color })}
              onBack={() => updateState({ step: 2 })}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
