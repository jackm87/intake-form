"use client";

import { useEffect, useRef } from "react";
import type { OcrResult } from "@/lib/templates/types";

interface OcrJobResponse {
  status: "pending" | "processing" | "complete" | "failed";
  result: OcrResult | null;
}

interface UseOcrPollingOptions {
  jobId: string | null;
  /**
   * Called when the OCR job completes. Callers MUST wrap this in useCallback
   * to prevent the polling interval from being reset on every render.
   */
  onComplete: (result: OcrResult) => void;
  /**
   * Called when the OCR job fails. Callers MUST wrap this in useCallback
   * to prevent the polling interval from being reset on every render.
   */
  onError: () => void;
}

export function useOcrPolling({ jobId, onComplete, onError }: UseOcrPollingOptions) {
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!jobId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/ocr/jobs/${jobId}`);
        if (!res.ok) {
          clearInterval(intervalId);
          onErrorRef.current();
          return;
        }

        const data: OcrJobResponse = await res.json();

        if (data.status === "complete") {
          clearInterval(intervalId);
          if (data.result) {
            onCompleteRef.current(data.result);
          } else {
            onErrorRef.current();
          }
        } else if (data.status === "failed") {
          clearInterval(intervalId);
          onErrorRef.current();
        }
      } catch {
        clearInterval(intervalId);
        onErrorRef.current();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [jobId]);
}
