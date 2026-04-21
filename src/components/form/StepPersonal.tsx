"use client";

import { useFormContext } from "react-hook-form";
import { OcrFieldFlag } from "./OcrFieldFlag";
import type { FieldDef } from "@/lib/templates/types";
import type { OcrWarning } from "@/lib/ocr/applyOcrResult";

interface StepPersonalProps {
  fields: FieldDef[];
  warnings: Map<string, OcrWarning>;
  prevStep: () => void;
  nextStep: () => void;
  brandColor: string;
}

function FieldInput({ field }: { field: FieldDef }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.key];

  if (field.type === "select" && field.options) {
    return (
      <select
        {...register(field.key, { required: field.required ? `${field.label} is required` : false })}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors duration-150"
      >
        <option value="">Select…</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        {...register(field.key, { required: field.required ? `${field.label} is required` : false })}
        placeholder={field.placeholder}
        rows={3}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors duration-150 resize-none"
      />
    );
  }

  return (
    <input
      type={field.type === "ssn" ? "password" : field.type}
      inputMode={field.type === "ssn" ? "numeric" : undefined}
      {...register(field.key, { required: field.required ? `${field.label} is required` : false })}
      placeholder={field.placeholder}
      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors duration-150"
    />
  );
}

export function StepPersonal({ fields, warnings, prevStep, nextStep, brandColor }: StepPersonalProps) {
  const { trigger } = useFormContext();

  const handleNext = async () => {
    const fieldKeys = fields.map((f) => f.key);
    const valid = await trigger(fieldKeys);
    if (valid) nextStep();
  };

  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-300">
              {field.label}
              {field.required && <span className="ml-0.5 text-red-400">*</span>}
            </label>
            <OcrFieldFlag fieldKey={field.key} warnings={warnings} />
          </div>
          <FieldInput field={field} />
          <FieldError fieldKey={field.key} />
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors duration-150"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: brandColor }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function FieldError({ fieldKey }: { fieldKey: string }) {
  const { formState: { errors } } = useFormContext();
  const error = errors[fieldKey];
  if (!error) return null;
  return (
    <p className="text-xs text-red-400">{error.message as string}</p>
  );
}
