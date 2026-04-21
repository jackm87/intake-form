import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTemplate } from "@/lib/templates";
import { mergeConfig } from "@/lib/config";
import type { Organization, FormConfig } from "@/lib/templates/types";
import { FormShell } from "@/components/form/FormShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: PageProps) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single<Organization>();

  if (orgError || !org) {
    notFound();
  }

  const { data: formConfig, error: configError } = await admin
    .from("form_configs")
    .select("*")
    .eq("org_id", org.id)
    .single<FormConfig>();

  if (configError || !formConfig) {
    notFound();
  }

  const template = getTemplate(formConfig.template_type);
  const mergedTemplate = mergeConfig(template, formConfig.customizations);

  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="text-zinc-500 text-sm">Loading...</div></div>}>
      <FormShell org={org} template={mergedTemplate} />
    </Suspense>
  );
}
