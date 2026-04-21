"use client";

import { useEffect } from "react";
import { useCustomerFormStore } from "@/stores/customerFormStore";

export function StoreReset() {
  const reset = useCustomerFormStore((state) => state.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return null;
}
