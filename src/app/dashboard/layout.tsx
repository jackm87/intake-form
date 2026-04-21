import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardScrollArea } from "@/components/dashboard/DashboardScrollArea";
import type { Organization } from "@/lib/templates/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (!orgs || orgs.length === 0) {
    redirect("/onboarding");
  }

  const org = orgs[0] as Organization;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar orgName={org.name} orgLogo={org.logo_url} />
      <DashboardScrollArea>{children}</DashboardScrollArea>
    </div>
  );
}
