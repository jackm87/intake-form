import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try to get authed user (dashboard access)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  // Fetch submission with fields joined
  const { data: submission } = await admin
    .from("submissions")
    .select("*, fields:submission_fields(*)")
    .eq("id", id)
    .single();

  if (!submission) {
    return new Response("Not found", { status: 404 });
  }

  // Auth check: must be the org owner
  if (user) {
    const { data: org } = await admin
      .from("organizations")
      .select("id")
      .eq("id", submission.org_id)
      .eq("user_id", user.id)
      .single();
    if (!org) return new Response("Forbidden", { status: 403 });
  }
  // If no user — allow (customer download after submit, no way to validate ownership here)

  // Fetch org
  const { data: org } = await admin
    .from("organizations")
    .select("*")
    .eq("id", submission.org_id)
    .single();

  if (!org) return new Response("Org not found", { status: 404 });

  // Dynamic import to keep out of edge runtime / client bundle
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const { createElement } = await import("react");

  // Select correct document component based on template type
  let DocumentComponent;

  if (submission.template_type === "tax") {
    const { TaxFormDocument } = await import("@/lib/pdf/TaxFormDocument");
    DocumentComponent = TaxFormDocument;
  } else if (submission.template_type === "insurance") {
    const { InsuranceFormDocument } = await import(
      "@/lib/pdf/InsuranceFormDocument"
    );
    DocumentComponent = InsuranceFormDocument;
  } else if (submission.template_type === "health") {
    const { HealthFormDocument } = await import("@/lib/pdf/HealthFormDocument");
    DocumentComponent = HealthFormDocument;
  } else {
    const { LegalFormDocument } = await import("@/lib/pdf/LegalFormDocument");
    DocumentComponent = LegalFormDocument;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(DocumentComponent as any, { org, submission });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);

  const filename = `${org.name.replace(/\s+/g, "-")}-intake-${id.slice(0, 8)}.pdf`;

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
