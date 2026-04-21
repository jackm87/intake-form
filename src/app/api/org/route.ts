import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTemplate } from "@/lib/templates";
import { mergeConfig } from "@/lib/config";
import type { FormCustomizations } from "@/lib/templates/types";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (!orgs || orgs.length === 0) {
    return Response.json({ error: "No organization found" }, { status: 404 });
  }

  const org = orgs[0];

  const { data: configs } = await supabase
    .from("form_configs")
    .select("*")
    .eq("org_id", org.id)
    .limit(1);

  const config = configs?.[0];
  if (!config) {
    return Response.json({ org, config: null, mergedTemplate: null });
  }

  const template = getTemplate(config.template_type);
  const mergedTemplate = mergeConfig(template, config.customizations as FormCustomizations);

  return Response.json({ org, config, mergedTemplate });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (!orgs || orgs.length === 0) {
    return Response.json({ error: "No organization found" }, { status: 404 });
  }

  const org = orgs[0];

  let body: {
    customizations?: FormCustomizations;
    logoBase64?: string;
    logoExt?: string;
    templateType?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let logoUrl: string | undefined;

  // Upload logo if provided
  if (body.logoBase64 && body.logoExt) {
    const adminClient = createAdminClient();
    const buffer = Buffer.from(body.logoBase64, "base64");
    const storagePath = `logos/${org.id}.${body.logoExt}`;

    const { error: uploadError } = await adminClient.storage
      .from("org-assets")
      .upload(storagePath, buffer, {
        contentType: `image/${body.logoExt}`,
        upsert: true,
      });

    if (uploadError) {
      return Response.json({ error: "Logo upload failed", detail: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from("org-assets").getPublicUrl(storagePath);

    logoUrl = publicUrl;

    // Update org logo_url
    const { error: orgUpdateError } = await supabase
      .from("organizations")
      .update({ logo_url: logoUrl })
      .eq("id", org.id);

    if (orgUpdateError) {
      return Response.json({ error: "Failed to update organization logo" }, { status: 500 });
    }
  }

  // Switch template — resets field overrides and custom fields, keeps branding
  if (body.templateType) {
    const VALID_TEMPLATES = ["tax", "insurance", "health", "legal"];
    if (!VALID_TEMPLATES.includes(body.templateType)) {
      return Response.json({ error: "Invalid template type" }, { status: 400 });
    }

    const { data: configs } = await supabase
      .from("form_configs")
      .select("customizations")
      .eq("org_id", org.id)
      .limit(1);

    const existingCustomizations = (configs?.[0]?.customizations as FormCustomizations) ?? {};

    const resetCustomizations: FormCustomizations = {
      fieldOverrides: {},
      customFields: [],
      intro: {},
      branding: existingCustomizations.branding ?? {},
      thankYouMessage: existingCustomizations.thankYouMessage,
    };

    const { error: templateError } = await supabase
      .from("form_configs")
      .update({ template_type: body.templateType, customizations: resetCustomizations })
      .eq("org_id", org.id);

    if (templateError) {
      return Response.json({ error: "Failed to switch template" }, { status: 500 });
    }

    return Response.json({ ok: true });
  }

  // Update form config customizations
  if (body.customizations) {
    const { error: configError } = await supabase
      .from("form_configs")
      .update({ customizations: body.customizations })
      .eq("org_id", org.id);

    if (configError) {
      return Response.json({ error: "Failed to update form config" }, { status: 500 });
    }
  }

  return Response.json({ ok: true, logoUrl });
}
