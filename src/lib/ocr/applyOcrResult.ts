import type { OcrResult, TemplateConfig } from "@/lib/templates/types";

export interface OcrWarning {
  fieldKey: string;
  confidence: number;
  value: string;
}

const CONFIDENCE_THRESHOLDS: Record<string, { amber: number; clear: number }> = {
  drivers_license: { amber: 0.90, clear: 0.75 },
  w2: { amber: 0.95, clear: 0.80 },
  insurance_card: { amber: 0.85, clear: 0.70 },
  default: { amber: 0.90, clear: 0.75 },
};

export function applyOcrResult(
  ocrResults: OcrResult[],
  template: TemplateConfig,
  getValue: (key: string) => string | undefined,
  setValue: (key: string, value: string) => void
): Map<string, OcrWarning> {
  const warnings = new Map<string, OcrWarning>();

  for (const step of template.steps) {
    for (const field of step.fields) {
      if (!field.ocrSourceField || !field.ocrDocType) continue;

      const result = ocrResults.find((r) => r.docType === field.ocrDocType);
      if (!result) continue;

      const ocrField = result.fields[field.ocrSourceField];
      if (!ocrField) continue;

      const thresholds = CONFIDENCE_THRESHOLDS[field.ocrDocType] ?? CONFIDENCE_THRESHOLDS.default;

      if (ocrField.confidence < thresholds.clear) continue;

      // Don't overwrite existing user-entered values
      const currentValue = getValue(field.key);
      if (currentValue && currentValue.trim() !== "") continue;

      setValue(field.key, ocrField.value);

      if (ocrField.confidence < thresholds.amber) {
        warnings.set(field.key, {
          fieldKey: field.key,
          confidence: ocrField.confidence,
          value: ocrField.value,
        });
      }
    }
  }

  return warnings;
}
