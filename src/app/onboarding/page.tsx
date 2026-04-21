"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

function OnboardingPageInner() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") ?? "";
  return <OnboardingWizard defaultTemplate={template} />;
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingPageInner />
    </Suspense>
  );
}
