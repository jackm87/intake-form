import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch submission with fields joined
  const { data: submission, error } = await admin
    .from("submissions")
    .select("*, fields:submission_fields(*)")
    .eq("id", id)
    .single();

  if (error || !submission) {
    return new Response("Not found", { status: 404 });
  }

  // Verify the submission belongs to one of the user's orgs
  const { data: org } = await admin
    .from("organizations")
    .select("id")
    .eq("id", submission.org_id)
    .eq("user_id", user.id)
    .single();

  if (!org) {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json(submission);
}
