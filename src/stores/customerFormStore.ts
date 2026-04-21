"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OcrResult } from "@/lib/templates/types";

export interface CustomerFormState {
  step: number;
  fields: Record<string, string>;
  uploadIds: string[];
  ocrResults: Record<string, OcrResult>;
  lastUpdated: number;
  isHydrated: boolean;
}

interface CustomerFormActions {
  setField: (key: string, value: string) => void;
  setStep: (step: number) => void;
  addUploadId: (id: string) => void;
  setOcrResult: (uploadId: string, result: OcrResult) => void;
  reset: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const initialState: CustomerFormState = {
  step: 1,
  fields: {},
  uploadIds: [],
  ocrResults: {},
  lastUpdated: 0,
  isHydrated: false,
};

export const useCustomerFormStore = create<CustomerFormState & CustomerFormActions>()(
  persist(
    (set) => ({
      ...initialState,

      setField: (key, value) =>
        set((state) => ({
          fields: { ...state.fields, [key]: value },
          lastUpdated: Date.now(),
        })),

      setStep: (step) =>
        set({ step, lastUpdated: Date.now() }),

      addUploadId: (id) =>
        set((state) => ({
          uploadIds: [...state.uploadIds, id],
          lastUpdated: Date.now(),
        })),

      setOcrResult: (uploadId, result) =>
        set((state) => ({
          ocrResults: { ...state.ocrResults, [uploadId]: result },
          lastUpdated: Date.now(),
        })),

      reset: () =>
        set({ ...initialState, isHydrated: true }),

      setHydrated: (hydrated) =>
        set({ isHydrated: hydrated }),
    }),
    {
      name: "formflow-customer",
      skipHydration: true,
    }
  )
);
