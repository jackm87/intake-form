import "server-only";
import type { DocType, OcrResult } from "@/lib/templates/types";
import { createAdminClient } from "@/lib/supabase/admin";

const MOCK_DATA: Record<DocType, Record<string, { value: string; confidence: number }>> = {
  drivers_license: {
    first_name: { value: "Alex", confidence: 0.97 },
    last_name: { value: "Rivera", confidence: 0.96 },
    date_of_birth: { value: "1988-03-15", confidence: 0.98 },
    license_number: { value: "D4592871", confidence: 0.94 },
    address: { value: "742 Evergreen Terrace", confidence: 0.89 },
    city: { value: "Springfield", confidence: 0.95 },
    state: { value: "IL", confidence: 0.99 },
    zip: { value: "62701", confidence: 0.97 },
  },
  w2: {
    employer_name: { value: "Acme Corporation", confidence: 0.96 },
    ein: { value: "12-3456789", confidence: 0.93 },
    wages_tips: { value: "85420.00", confidence: 0.97 },
    federal_income_tax: { value: "14218.00", confidence: 0.96 },
    social_security_tax: { value: "5296.04", confidence: 0.95 },
    medicare_tax: { value: "1238.59", confidence: 0.95 },
  },
  insurance_card: {
    carrier_name: { value: "BlueCross BlueShield", confidence: 0.97 },
    policy_number: { value: "BCB-4829401", confidence: 0.92 },
    member_name: { value: "Alex Rivera", confidence: 0.96 },
    member_id: { value: "XCH482940182", confidence: 0.91 },
    group_number: { value: "GRP-00194", confidence: 0.88 },
    copay: { value: "25.00", confidence: 0.90 },
  },
  vehicle_registration: {
    vehicle_year: { value: "2019", confidence: 0.98 },
    vehicle_make: { value: "Toyota", confidence: 0.97 },
    vehicle_model: { value: "Camry", confidence: 0.96 },
    vin: { value: "4T1B11HK8KU198423", confidence: 0.95 },
    license_plate: { value: "XYZ 4829", confidence: 0.93 },
  },
  other: {
    document_type: { value: "other", confidence: 0.50 },
  },
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processDocument(
  jobId: string,
  storagePath: string,
  docType: DocType
): Promise<void> {
  const admin = createAdminClient();

  await admin
    .from("ocr_jobs")
    .update({ status: "processing" })
    .eq("id", jobId);

  await delay(3000);

  const mockFields = MOCK_DATA[docType] ?? MOCK_DATA.other;

  const result: OcrResult = {
    docType,
    fields: mockFields,
  };

  await admin
    .from("ocr_jobs")
    .update({
      status: "complete",
      result,
      completed_at: new Date().toISOString(),
    })
    .eq("id", jobId);
}
