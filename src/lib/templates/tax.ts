import type { TemplateConfig } from "./types";

export const taxTemplate: TemplateConfig = {
  key: "tax",
  name: "Tax Preparation",
  description: "Collect personal, income, and deduction information for tax filing.",
  icon: "clipboard-list",
  acceptedDocTypes: ["drivers_license", "w2"],
  steps: [
    {
      key: "upload",
      label: "Upload Documents",
      fields: [],
      acceptedDocTypes: ["drivers_license", "w2"],
    },
    {
      key: "personal",
      label: "Personal Information",
      fields: [
        { key: "firstName", label: "First Name", type: "text", required: true, ocrSourceField: "first_name", ocrDocType: "drivers_license" },
        { key: "lastName", label: "Last Name", type: "text", required: true, ocrSourceField: "last_name", ocrDocType: "drivers_license" },
        { key: "ssn", label: "Social Security Number", type: "ssn", required: true, placeholder: "XXX-XX-XXXX" },
        { key: "dob", label: "Date of Birth", type: "date", required: true, ocrSourceField: "date_of_birth", ocrDocType: "drivers_license" },
        { key: "address", label: "Street Address", type: "text", required: true, ocrSourceField: "address", ocrDocType: "drivers_license" },
        { key: "city", label: "City", type: "text", required: true, ocrSourceField: "city", ocrDocType: "drivers_license" },
        { key: "state", label: "State", type: "text", required: true, ocrSourceField: "state", ocrDocType: "drivers_license" },
        { key: "zip", label: "ZIP Code", type: "text", required: true, ocrSourceField: "zip", ocrDocType: "drivers_license" },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "phone", label: "Phone Number", type: "tel", required: true },
        {
          key: "filingStatus",
          label: "Filing Status",
          type: "select",
          required: true,
          options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"],
        },
      ],
    },
    {
      key: "income",
      label: "Income",
      fields: [
        { key: "employerName", label: "Employer Name", type: "text", required: true, ocrSourceField: "employer_name", ocrDocType: "w2" },
        { key: "employerEin", label: "Employer EIN", type: "text", required: true, ocrSourceField: "ein", ocrDocType: "w2" },
        { key: "wagesBox1", label: "Wages (Box 1)", type: "text", required: true, ocrSourceField: "wages_tips", ocrDocType: "w2" },
        { key: "federalTaxBox2", label: "Federal Tax Withheld (Box 2)", type: "text", required: true, ocrSourceField: "federal_income_tax", ocrDocType: "w2" },
        { key: "socialSecurityBox4", label: "Social Security Tax Withheld (Box 4)", type: "text", required: false, ocrSourceField: "social_security_tax", ocrDocType: "w2" },
        { key: "medicareBox6", label: "Medicare Tax Withheld (Box 6)", type: "text", required: false, ocrSourceField: "medicare_tax", ocrDocType: "w2" },
      ],
    },
    {
      key: "deductions",
      label: "Deductions & Credits",
      fields: [
        { key: "deductionType", label: "Deduction Type", type: "select", required: true, options: ["Standard Deduction", "Itemized Deductions"] },
        { key: "mortgageInterest", label: "Mortgage Interest Paid", type: "text", required: false, placeholder: "0.00" },
        { key: "charitableContributions", label: "Charitable Contributions", type: "text", required: false, placeholder: "0.00" },
        { key: "studentLoanInterest", label: "Student Loan Interest", type: "text", required: false, placeholder: "0.00" },
        { key: "childTaxCredit", label: "Number of Qualifying Children", type: "text", required: false, placeholder: "0" },
      ],
    },
    {
      key: "review",
      label: "Review & Submit",
      fields: [],
    },
  ],
};
