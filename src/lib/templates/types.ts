export type TemplateKey = "tax" | "insurance" | "health" | "legal";

export type DocType =
  | "drivers_license"
  | "w2"
  | "insurance_card"
  | "vehicle_registration"
  | "other";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "select" | "textarea" | "ssn";
  required: boolean;
  placeholder?: string;
  options?: string[];
  ocrSourceField?: string;
  ocrDocType?: DocType;
}

export interface StepDef {
  key: string;
  label: string;
  fields: FieldDef[];
  acceptedDocTypes?: DocType[];
}

export interface TemplateConfig {
  key: TemplateKey;
  name: string;
  description: string;
  icon: string;
  steps: StepDef[];
  acceptedDocTypes: DocType[];
}

export interface FieldOverride {
  label?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface CustomField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "textarea";
  required: boolean;
}

export interface FormCustomizations {
  fieldOverrides: Record<string, FieldOverride>;
  branding: {
    logoUrl?: string;
    primaryColor?: string;
  };
  intro: Record<string, string>;
  thankYouMessage?: string;
  customFields?: CustomField[];
}

// Database row types
export interface Organization {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  brand_color: string | null;
  created_at: string;
}

export interface FormConfig {
  id: string;
  org_id: string;
  template_type: TemplateKey;
  customizations: FormCustomizations;
  created_at: string;
}

export interface Submission {
  id: string;
  org_id: string;
  template_type: TemplateKey;
  status: "partial" | "complete";
  submitted_at: string | null;
  created_at: string;
  fields?: SubmissionField[];
}

export interface SubmissionField {
  id: string;
  submission_id: string;
  field_key: string;
  field_value: string;
  ocr_confidence: number | null;
  flagged: boolean;
}

export interface DocumentUpload {
  id: string;
  submission_id: string | null;
  org_id: string;
  storage_path: string;
  doc_type: DocType;
  uploaded_at: string;
}

export interface OcrJob {
  id: string;
  document_upload_id: string;
  org_id: string;
  status: "pending" | "processing" | "complete" | "failed";
  result: OcrResult | null;
  created_at: string;
  completed_at: string | null;
}

export interface OcrFieldResult {
  value: string;
  confidence: number;
}

export interface OcrResult {
  docType: DocType;
  fields: Record<string, OcrFieldResult>;
}

export interface IOCRService {
  processDocument(storagePath: string, docType: DocType): Promise<OcrResult>;
}
