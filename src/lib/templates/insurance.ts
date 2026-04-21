import type { TemplateConfig } from "./types";

export const insuranceTemplate: TemplateConfig = {
  key: "insurance",
  name: "Insurance Intake",
  description: "Collect personal and vehicle information for insurance applications.",
  icon: "shield",
  acceptedDocTypes: ["drivers_license", "insurance_card", "vehicle_registration"],
  steps: [
    {
      key: "upload",
      label: "Upload Documents",
      fields: [],
      acceptedDocTypes: ["drivers_license", "insurance_card", "vehicle_registration"],
    },
    {
      key: "personal",
      label: "Personal Information",
      fields: [
        { key: "firstName", label: "First Name", type: "text", required: true, ocrSourceField: "first_name", ocrDocType: "drivers_license" },
        { key: "lastName", label: "Last Name", type: "text", required: true, ocrSourceField: "last_name", ocrDocType: "drivers_license" },
        { key: "dob", label: "Date of Birth", type: "date", required: true, ocrSourceField: "date_of_birth", ocrDocType: "drivers_license" },
        { key: "licenseNumber", label: "Driver's License Number", type: "text", required: true, ocrSourceField: "license_number", ocrDocType: "drivers_license" },
        { key: "address", label: "Street Address", type: "text", required: true, ocrSourceField: "address", ocrDocType: "drivers_license" },
        { key: "city", label: "City", type: "text", required: true, ocrSourceField: "city", ocrDocType: "drivers_license" },
        { key: "state", label: "State", type: "text", required: true, ocrSourceField: "state", ocrDocType: "drivers_license" },
        { key: "zip", label: "ZIP Code", type: "text", required: true, ocrSourceField: "zip", ocrDocType: "drivers_license" },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "phone", label: "Phone Number", type: "tel", required: true },
      ],
    },
    {
      key: "vehicle",
      label: "Vehicle Information",
      fields: [
        { key: "vehicleYear", label: "Vehicle Year", type: "text", required: true, ocrSourceField: "vehicle_year", ocrDocType: "vehicle_registration" },
        { key: "vehicleMake", label: "Make", type: "text", required: true, ocrSourceField: "vehicle_make", ocrDocType: "vehicle_registration" },
        { key: "vehicleModel", label: "Model", type: "text", required: true, ocrSourceField: "vehicle_model", ocrDocType: "vehicle_registration" },
        { key: "vin", label: "VIN", type: "text", required: true, ocrSourceField: "vin", ocrDocType: "vehicle_registration" },
        { key: "licensePlate", label: "License Plate", type: "text", required: false, ocrSourceField: "license_plate", ocrDocType: "vehicle_registration" },
        { key: "annualMileage", label: "Estimated Annual Mileage", type: "text", required: true },
        { key: "primaryUse", label: "Primary Use", type: "select", required: true, options: ["Commute", "Pleasure", "Business", "Farm"] },
      ],
    },
    {
      key: "coverage",
      label: "Current Coverage",
      fields: [
        { key: "currentCarrier", label: "Current Insurance Carrier", type: "text", required: false, ocrSourceField: "carrier_name", ocrDocType: "insurance_card" },
        { key: "policyNumber", label: "Policy Number", type: "text", required: false, ocrSourceField: "policy_number", ocrDocType: "insurance_card" },
        { key: "coverageType", label: "Coverage Type Requested", type: "select", required: true, options: ["Liability Only", "Collision", "Comprehensive", "Full Coverage"] },
        { key: "currentlyInsured", label: "Currently Insured?", type: "select", required: true, options: ["Yes", "No"] },
      ],
    },
    {
      key: "review",
      label: "Review & Submit",
      fields: [],
    },
  ],
};
