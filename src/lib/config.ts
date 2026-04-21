import type { TemplateConfig, FormCustomizations, FieldDef, StepDef } from "./templates/types";

export function mergeConfig(
  template: TemplateConfig,
  customizations: FormCustomizations
): TemplateConfig {
  const { fieldOverrides, customFields } = customizations;

  const mergedSteps: StepDef[] = template.steps.map((step) => {
    const mergedFields: FieldDef[] = step.fields
      .filter((field) => {
        const override = fieldOverrides[field.key];
        return !override?.hidden;
      })
      .map((field) => {
        const override = fieldOverrides[field.key];
        if (!override) return field;
        return {
          ...field,
          label: override.label ?? field.label,
          required: override.required ?? field.required,
        };
      });

    return { ...step, fields: mergedFields };
  });

  // Inject custom fields as an extra step before review
  if (customFields && customFields.length > 0) {
    const reviewIdx = mergedSteps.findIndex((s) => s.key === "review");
    const customStep: StepDef = {
      key: "custom",
      label: "Additional Information",
      fields: customFields.map((cf) => ({
        key: cf.key,
        label: cf.label,
        type: cf.type,
        required: cf.required,
      })),
    };
    if (reviewIdx !== -1) {
      mergedSteps.splice(reviewIdx, 0, customStep);
    } else {
      mergedSteps.push(customStep);
    }
  }

  return {
    ...template,
    steps: mergedSteps,
  };
}
