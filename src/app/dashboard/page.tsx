import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { ShareLinkCard } from "@/components/dashboard/ShareLinkCard";
import type { Organization, FormConfig, Submission } from "@/lib/templates/types";

export default async function DashboardPage() {
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

  const { count: totalCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("org_id", org.id);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { count: weekCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("org_id", org.id)
    .gte("created_at", oneWeekAgo.toISOString());

  const { data: recentSubmissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://formflow.app";

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-50">Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your form.
        </p>
      </div>

      {config && (
        <OverviewStats
          totalSubmissions={totalCount ?? 0}
          thisWeekCount={weekCount ?? 0}
          templateType={config.template_type}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentSubmissions submissions={(recentSubmissions ?? []) as Submission[]} />
        </div>
        <div>
          <ShareLinkCard slug={org.slug} appUrl={appUrl} />
        </div>
      </div>
    </div>
  );
}
