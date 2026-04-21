"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { useCustomerFormStore } from "@/stores/customerFormStore";
import { applyOcrResult } from "@/lib/ocr/applyOcrResult";
import { StepUpload } from "./StepUpload";
import { StepPersonal } from "./StepPersonal";
import { StepReview } from "./StepReview";
import { ProgressWithLabel } from "@/components/ui/progress-bar";
import type { Organization, TemplateConfig } from "@/lib/templates/types";
import type { OcrWarning } from "@/lib/ocr/applyOcrResult";

interface FormShellProps {
  org: Organization;
  template: TemplateConfig;
}

export function FormShell({ org, template }: FormShellProps) {
  return <FormShellInner org={org} template={template} />;
}

function FormShellInner({ org, template }: FormShellProps) {
  const brandColor = org.brand_color || "#0ea5e9";
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;

  const store = useCustomerFormStore();
  const { fields, ocrResults, setField, isHydrated, setHydrated, setStep } = store;

  const methods = useForm({
    defaultValues: fields,
    mode: "onTouched",
  });

  // Rehydrate on mount
  useEffect(() => {
    useCustomerFormStore.persist.rehydrate();
    setHydrated(true);
  }, [setHydrated]);

  // Sync store fields into react-hook-form after hydration
  useEffect(() => {
    if (!isHydrated) return;
    const currentValues = methods.getValues();
    Object.entries(fields).forEach(([key, value]) => {
      if (currentValues[key] !== value) {
        methods.setValue(key, value);
      }
    });
  }, [isHydrated, fields, methods]);

  // Sync react-hook-form changes back to store
  useEffect(() => {
    const subscription = methods.watch((values) => {
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === "string" && value !== fields[key]) {
          setField(key, value);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [methods, fields, setField]);

  // Compute OCR warnings
  const warnings = useMemo<Map<string, OcrWarning>>(() => {
    const ocrResultArray = Object.values(ocrResults);
    if (ocrResultArray.length === 0) return new Map();

    return applyOcrResult(
      ocrResultArray,
      template,
      (key) => fields[key],
      (key, value) => {
        setField(key, value);
        methods.setValue(key, value);
      }
    );
  }, [ocrResults, template, fields, setField, methods]);

  const totalSteps = template.steps.length;

  const nextStep = () => {
    const next = currentStep + 1;
    router.replace(`?step=${next}`, { scroll: false });
  };

  const prevStep = () => {
    const prev = Math.max(1, currentStep - 1);
    router.replace(`?step=${prev}`, { scroll: false });
  };

  const goToStep = (n: number) => {
    setStep(n);
    router.replace(`?step=${n}`, { scroll: false });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-4">
          <div className="h-6 w-48 rounded-md bg-zinc-800 animate-pulse" />
          <div className="h-4 w-full rounded-md bg-zinc-800 animate-pulse" />
          <div className="h-4 w-3/4 rounded-md bg-zinc-800 animate-pulse" />
          <div className="mt-6 h-10 w-full rounded-md bg-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  // Determine which step to render
  const stepDefs = template.steps;
  const currentStepDef = stepDefs[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isUploadStep = currentStepDef?.key === "upload";
  const isReviewStep = currentStepDef?.key === "review" || isLastStep;

  const renderStep = () => {
    if (isUploadStep) {
      return <StepUpload slug={org.slug} template={template} nextStep={nextStep} brandColor={brandColor} />;
    }

    if (isReviewStep) {
      return <StepReview slug={org.slug} template={template} setStep={goToStep} brandColor={brandColor} />;
    }

    // Data step — render fields
    const stepFields = currentStepDef?.fields ?? [];
    return (
      <div className="space-y-1">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-zinc-50">{currentStepDef?.label}</h2>
        </div>
        <StepPersonal
          fields={stepFields}
          warnings={warnings}
          prevStep={prevStep}
          nextStep={nextStep}
          brandColor={brandColor}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-xl px-4 py-4 flex items-center gap-3">
          {org.logo_url && (
            <Image
              src={org.logo_url}
              alt={`${org.name} logo`}
              width={32}
              height={32}
              className="rounded-md object-contain"
            />
          )}
          <span className="text-sm font-semibold text-zinc-100">{org.name}</span>
          <span className="ml-auto text-xs font-medium text-zinc-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <ProgressWithLabel
        value={Math.round((currentStep / totalSteps) * 100)}
        label={`Step ${currentStep} of ${totalSteps}`}
        color={brandColor}
        duration={600}
        delay={80}
      />

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-xl px-4">
          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()}>
              {renderStep()}
            </form>
          </FormProvider>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-zinc-700">Powered by FormFlow</p>
      </footer>
    </div>
  );
}
