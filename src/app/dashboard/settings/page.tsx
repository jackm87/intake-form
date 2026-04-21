import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormCustomizer } from "@/components/dashboard/FormCustomizer";
import type { Organization, FormConfig } from "@/lib/templates/types";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (!orgs || orgs.length === 0) redirect("/onboarding");

  const org = orgs[0] as Organization;

  const { data: configs } = await supabase
    .from("form_configs")
    .select("*")
    .eq("org_id", org.id)
    .limit(1);

  const config = configs?.[0] as FormConfig | undefined;

  if (!config) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-50 mb-2">Settings</h1>
        <p className="text-sm text-zinc-400">No form configuration found. Complete onboarding first.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-50">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Customize your form fields and branding.
        </p>
      </div>

      <FormCustomizer org={org} config={config} />
    </div>
  );
}
