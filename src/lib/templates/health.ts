import type { TemplateConfig } from "./types";

export const healthTemplate: TemplateConfig = {
  key: "health",
  name: "Health Intake",
  description: "Collect patient information for medical office intake.",
  icon: "heart-pulse",
  acceptedDocTypes: ["drivers_license", "insurance_card"],
  steps: [
    {
      key: "upload",
      label: "Upload Documents",
      fields: [],
      acceptedDocTypes: ["drivers_license", "insurance_card"],
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
        { key: "emergencyContact", label: "Emergency Contact Name", type: "text", required: false },
        { key: "emergencyPhone", label: "Emergency Contact Phone", type: "tel", required: false },
      ],
    },
    {
      key: "insurance",
      label: "Insurance Information",
      fields: [
        { key: "insuranceCarrier", label: "Insurance Carrier", type: "text", required: true, ocrSourceField: "carrier_name", ocrDocType: "insurance_card" },
        { key: "memberName", label: "Member Name on Card", type: "text", required: true, ocrSourceField: "member_name", ocrDocType: "insurance_card" },
        { key: "memberId", label: "Member ID", type: "text", required: true, ocrSourceField: "member_id", ocrDocType: "insurance_card" },
        { key: "groupNumber", label: "Group Number", type: "text", required: false, ocrSourceField: "group_number", ocrDocType: "insurance_card" },
        { key: "copay", label: "Copay Amount", type: "text", required: false, ocrSourceField: "copay", ocrDocType: "insurance_card" },
      ],
    },
    {
      key: "medical",
      label: "Medical History",
      fields: [
        { key: "reasonForVisit", label: "Reason for Visit", type: "textarea", required: true },
        { key: "currentMedications", label: "Current Medications", type: "textarea", required: false, placeholder: "List any medications you are currently taking" },
        { key: "allergies", label: "Known Allergies", type: "textarea", required: false, placeholder: "List any known allergies" },
        { key: "primaryPhysician", label: "Primary Care Physician", type: "text", required: false },
      ],
    },
    {
      key: "review",
      label: "Review & Submit",
      fields: [],
    },
  ],
};
