import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const templateKey = formData.get("templateKey") as string;
  const brandColor = (formData.get("brandColor") as string) || "#0ea5e9";
  const logoFile = formData.get("logo") as File | null;

  if (!name || !slug || !templateKey) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  // Generate org ID upfront so we can use it for storage path
  const orgId = crypto.randomUUID();

  // Upload logo if provided
  let logoUrl: string | null = null;
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop() ?? "png";
    const storagePath = `org-assets/${orgId}/logo.${ext}`;

    const adminClient = createAdminClient();
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await adminClient.storage
      .from("org-assets")
      .upload(storagePath, buffer, {
        contentType: logoFile.type,
        upsert: true,
      });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = adminClient.storage.from("org-assets").getPublicUrl(storagePath);
      logoUrl = publicUrl;
    }
  }

  // Create organization row
  const { error: orgError } = await supabase.from("organizations").insert({
    id: orgId,
    user_id: user.id,
    slug,
    name,
    logo_url: logoUrl,
    brand_color: brandColor,
  });

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 });
  }

  // Create form_configs row
  const { error: configError } = await supabase.from("form_configs").insert({
    org_id: orgId,
    template_type: templateKey,
    customizations: {
      fieldOverrides: {},
      branding: {
        primaryColor: brandColor,
        ...(logoUrl ? { logoUrl } : {}),
      },
      intro: {},
      thankYouMessage: "",
    },
  });

  if (configError) {
    return NextResponse.json({ error: configError.message }, { status: 500 });
  }

  return NextResponse.json({ orgId, slug });
}
