import { taxTemplate } from "./tax";
import { insuranceTemplate } from "./insurance";
import { healthTemplate } from "./health";
import { legalTemplate } from "./legal";
import type { TemplateConfig, TemplateKey } from "./types";

export const TEMPLATES: Record<TemplateKey, TemplateConfig> = {
  tax: taxTemplate,
  insurance: insuranceTemplate,
  health: healthTemplate,
  legal: legalTemplate,
};

export function getTemplate(key: TemplateKey): TemplateConfig {
  const template = TEMPLATES[key];
  if (!template) throw new Error(`Unknown template: ${key}`);
  return template;
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}

export * from "./types";
