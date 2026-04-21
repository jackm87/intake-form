import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShareLinkCard } from "@/components/dashboard/ShareLinkCard";
import type { Organization } from "@/lib/templates/types";

export default async function SharePage() {
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://formflow.app";

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-50">Share</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Send this link to your clients so they can fill out your intake form.
        </p>
      </div>

      <div className="max-w-sm">
        <ShareLinkCard slug={org.slug} appUrl={appUrl} large />
      </div>

      <div
        className="rounded-lg border border-white/8 p-6 max-w-lg"
        style={{ background: "#111318" }}
      >
        <h3 className="text-sm font-semibold text-gray-50 mb-3">How to share</h3>
        <ol className="space-y-2">
          {[
            "Copy the link above or download the QR code.",
            "Send the link via email, text, or embed the QR in printed materials.",
            "Clients click the link, upload their documents, and fill out the form.",
            "You receive structured data instantly in your Submissions dashboard.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-400/10 text-sky-400 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-400">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
