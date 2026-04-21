import type { TemplateConfig } from "./types";

export const legalTemplate: TemplateConfig = {
  key: "legal",
  name: "Legal Intake",
  description: "Collect client information for legal consultations.",
  icon: "scale",
  acceptedDocTypes: ["drivers_license", "other"],
  steps: [
    {
      key: "upload",
      label: "Upload Documents",
      fields: [],
      acceptedDocTypes: ["drivers_license", "other"],
    },
    {
      key: "personal",
      label: "Personal Information",
      fields: [
        { key: "firstName", label: "First Name", type: "text", required: true, ocrSourceField: "first_name", ocrDocType: "drivers_license" },
        { key: "lastName", label: "Last Name", type: "text", required: true, ocrSourceField: "last_name", ocrDocType: "drivers_license" },
        { key: "dob", label: "Date of Birth", type: "date", required: true, ocrSourceField: "date_of_birth", ocrDocType: "drivers_license" },
        { key: "address", label: "Street Address", type: "text", required: true, ocrSourceField: "address", ocrDocType: "drivers_license" },
        { key: "city", label: "City", type: "text", required: true, ocrSourceField: "city", ocrDocType: "drivers_license" },
        { key: "state", label: "State", type: "text", required: true, ocrSourceField: "state", ocrDocType: "drivers_license" },
        { key: "zip", label: "ZIP Code", type: "text", required: true, ocrSourceField: "zip", ocrDocType: "drivers_license" },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "phone", label: "Phone Number", type: "tel", required: true },
      ],
    },
    {
      key: "case",
      label: "Case Details",
      fields: [
        { key: "caseType", label: "Type of Legal Matter", type: "select", required: true, options: ["Personal Injury", "Family Law", "Criminal Defense", "Business Law", "Real Estate", "Estate Planning", "Other"] },
        { key: "caseDescription", label: "Brief Description", type: "textarea", required: true, placeholder: "Describe your legal matter in a few sentences" },
        { key: "incidentDate", label: "Date of Incident (if applicable)", type: "date", required: false },
        { key: "opposingParty", label: "Opposing Party Name (if applicable)", type: "text", required: false },
        { key: "priorAttorney", label: "Have you worked with another attorney on this matter?", type: "select", required: true, options: ["Yes", "No"] },
      ],
    },
    {
      key: "documents",
      label: "Supporting Documents",
      fields: [
        { key: "hasDocuments", label: "Do you have supporting documents?", type: "select", required: true, options: ["Yes, uploaded above", "Yes, will bring to consultation", "No"] },
        { key: "documentNotes", label: "Notes on Documents", type: "textarea", required: false, placeholder: "Describe any documents you have or will bring" },
      ],
    },
    {
      key: "review",
      label: "Review & Submit",
      fields: [],
    },
  ],
};
