"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ClipboardList, Shield, HeartPulse, Scale, AlertTriangle } from "lucide-react";
import { getTemplate, getAllTemplates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Organization, FormConfig, FormCustomizations, FieldOverride, CustomField, TemplateKey } from "@/lib/templates/types";

const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "clipboard-list": ClipboardList,
  "shield": Shield,
  "heart-pulse": HeartPulse,
  "scale": Scale,
};

const FIELD_TYPES: { value: CustomField["type"]; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Paragraph" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "date", label: "Date" },
];

interface FormCustomizerProps {
  org: Organization;
  config: FormConfig;
}

export function FormCustomizer({ org, config }: FormCustomizerProps) {
  const template = getTemplate(config.template_type);

  const [saving, setSaving] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, FieldOverride>>(
    config.customizations.fieldOverrides ?? {}
  );
  const [primaryColor, setPrimaryColor] = useState(
    config.customizations.branding?.primaryColor ?? "#0ea5e9"
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(org.logo_url);
  const [customFields, setCustomFields] = useState<CustomField[]>(
    config.customizations.customFields ?? []
  );
  const [newField, setNewField] = useState<{ label: string; type: CustomField["type"]; required: boolean }>({
    label: "",
    type: "text",
    required: false,
  });

  const [pendingTemplate, setPendingTemplate] = useState<TemplateKey | null>(null);
  const [switchingTemplate, setSwitchingTemplate] = useState(false);

  async function confirmTemplateSwitch() {
    if (!pendingTemplate) return;
    setSwitchingTemplate(true);
    try {
      const res = await fetch("/api/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateType: pendingTemplate }),
      });
      if (!res.ok) throw new Error("Failed to switch template");
      toast.success("Template switched. Reloading…");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("Failed to switch template.");
      setSwitchingTemplate(false);
      setPendingTemplate(null);
    }
  }

  function addCustomField() {
    if (!newField.label.trim()) return;
    const key = `custom_${Date.now()}`;
    setCustomFields((prev) => [...prev, { key, ...newField, label: newField.label.trim() }]);
    setNewField({ label: "", type: "text", required: false });
  }

  function removeCustomField(key: string) {
    setCustomFields((prev) => prev.filter((f) => f.key !== key));
  }

  const allFields = template.steps.flatMap((step) =>
    step.fields.map((field) => ({ ...field, stepLabel: step.label }))
  );

  function setOverride(key: string, patch: Partial<FieldOverride>) {
    setOverrides((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        customizations: {
          ...config.customizations,
          fieldOverrides: overrides,
          customFields,
          branding: {
            ...config.customizations.branding,
            primaryColor,
          },
        } satisfies FormCustomizations,
      };

      if (logoFile) {
        const dataUrl = logoPreview;
        if (dataUrl) {
          // Strip the data:image/xxx;base64, prefix
          const [header, base64] = dataUrl.split(",");
          const ext = header.split(";")[0].split("/")[1] ?? "png";
          body.logoBase64 = base64;
          body.logoExt = ext;
        }
      }

      const res = await fetch("/api/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save");
      }

      toast.success("Settings saved successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const allTemplates = getAllTemplates();

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Template switcher */}
      <div className="rounded-lg border border-white/8 overflow-hidden" style={{ background: "#111318" }}>
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold text-gray-50">Form Template</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Switching templates resets field customizations. Your branding is kept.
          </p>
        </div>

        <div className="p-4 grid grid-cols-2 gap-2">
          {allTemplates.map((t) => {
            const Icon = TEMPLATE_ICONS[t.icon];
            const isCurrent = t.key === config.template_type;
            const isPending = t.key === pendingTemplate;
            return (
              <button
                key={t.key}
                onClick={() => !isCurrent && setPendingTemplate(t.key as TemplateKey)}
                disabled={isCurrent}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-150 ${
                  isCurrent
                    ? "border-sky-500/50 bg-sky-500/8 cursor-default"
                    : isPending
                    ? "border-amber-500/50 bg-amber-500/8"
                    : "border-white/8 hover:border-white/16 hover:bg-white/3 cursor-pointer"
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-sky-400" : "text-zinc-500"}`} strokeWidth={1.5} />}
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? "text-sky-300" : "text-zinc-300"}`}>{t.name}</p>
                  {isCurrent && <p className="text-xs text-zinc-600 mt-0.5">Current</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inline confirmation */}
        {pendingTemplate && (
          <div className="mx-4 mb-4 rounded-lg border border-amber-500/20 bg-amber-500/8 px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-amber-200 font-medium">
                Switch to {allTemplates.find(t => t.key === pendingTemplate)?.name}?
              </p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Field customizations and custom fields will be reset. Branding stays.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setPendingTemplate(null)}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmTemplateSwitch}
                disabled={switchingTemplate}
                className="text-xs font-medium text-white bg-amber-500 hover:bg-amber-400 disabled:opacity-50 px-3 py-1 rounded-md transition-colors"
              >
                {switchingTemplate ? "Switching…" : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Branding */}
      <div
        className="rounded-lg border border-white/8 p-6 space-y-5"
        style={{ background: "#111318" }}
      >
        <h3 className="text-base font-semibold text-gray-50">Branding</h3>
        <Separator className="bg-white/8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-400">Logo</Label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-10 h-10 rounded-md object-cover border border-white/8"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="bg-transparent border-white/8 text-zinc-400 text-xs file:text-zinc-400 file:bg-transparent file:border-0 file:text-xs cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-400">Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-md border border-white/8 cursor-pointer bg-transparent p-0.5"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="bg-transparent border-white/8 text-zinc-300 text-sm font-mono"
                placeholder="#0ea5e9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field customization */}
      <div
        className="rounded-lg border border-white/8 overflow-hidden"
        style={{ background: "#111318" }}
      >
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold text-gray-50">Form Fields</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Customize labels, toggle visibility, and set required fields.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          {allFields.map((field) => {
            const override = overrides[field.key] ?? {};
            const isHidden = override.hidden ?? false;
            const isRequired = override.required ?? field.required;
            const label = override.label ?? field.label;

            return (
              <div
                key={field.key}
                className={`px-6 py-4 flex items-center gap-4 transition-opacity duration-150 ${
                  isHidden ? "opacity-40" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <Input
                    value={label}
                    onChange={(e) => setOverride(field.key, { label: e.target.value })}
                    className="bg-transparent border-white/8 text-sm text-zinc-200 h-8 px-2"
                    disabled={isHidden}
                  />
                  <p className="text-xs text-zinc-600 mt-1 font-mono">{field.key}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setOverride(field.key, { required: e.target.checked })}
                      disabled={isHidden}
                      className="w-3.5 h-3.5 rounded accent-sky-400 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500">Required</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHidden}
                      onChange={(e) => setOverride(field.key, { hidden: e.target.checked })}
                      className="w-3.5 h-3.5 rounded accent-sky-400 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500">Hidden</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom fields */}
      <div className="rounded-lg border border-white/8 overflow-hidden" style={{ background: "#111318" }}>
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold text-gray-50">Custom Fields</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Add extra fields that will appear in an "Additional Information" step on your form.
          </p>
        </div>

        {customFields.length > 0 && (
          <div className="divide-y divide-white/5">
            {customFields.map((field) => (
              <div key={field.key} className="px-6 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200">{field.label}</p>
                  <p className="text-xs text-zinc-600 mt-0.5 font-mono">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                    {field.required && " · Required"}
                  </p>
                </div>
                <button
                  onClick={() => removeCustomField(field.key)}
                  className="text-zinc-600 hover:text-red-400 transition-colors duration-150"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 border-t border-white/8 space-y-3">
          <div className="flex gap-2">
            <Input
              value={newField.label}
              onChange={(e) => setNewField((p) => ({ ...p, label: e.target.value }))}
              placeholder="Field label, e.g. Preferred Contact Time"
              className="flex-1 bg-transparent border-white/8 text-sm text-zinc-200 placeholder:text-zinc-600"
              onKeyDown={(e) => e.key === "Enter" && addCustomField()}
            />
            <select
              value={newField.type}
              onChange={(e) => setNewField((p) => ({ ...p, type: e.target.value as CustomField["type"] }))}
              className="rounded-md border border-white/8 bg-[#191c23] text-sm text-zinc-300 px-3 py-2 focus:outline-none"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField((p) => ({ ...p, required: e.target.checked }))}
                className="w-3.5 h-3.5 rounded accent-sky-400"
              />
              <span className="text-xs text-zinc-500">Required</span>
            </label>
            <Button
              onClick={addCustomField}
              disabled={!newField.label.trim()}
              size="sm"
              variant="outline"
              className="border-white/8 text-zinc-300 hover:text-white hover:border-white/20 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Add field
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-sky-500 hover:bg-sky-400 text-white font-medium transition-all duration-150 px-6"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
