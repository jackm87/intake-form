"use client";

import { useState, useCallback } from "react";
import type { DocType, OcrResult } from "@/lib/templates/types";

export type UploadStatus = "uploading" | "processing" | "done" | "failed";

export interface UploadState {
  status: UploadStatus;
  uploadId?: string;
  jobId?: string;
}

interface UseDocumentUploadOptions {
  slug: string;
  /**
   * Called when OCR processing completes for a file.
   * Callers MUST wrap this in useCallback to maintain referential stability.
   */
  onOcrResult: (uploadId: string, result: OcrResult) => void;
}

interface UseDocumentUploadReturn {
  uploadFile: (file: File, docType: DocType) => Promise<void>;
  uploadStates: Map<string, UploadState>;
  isUploading: boolean;
}

export function useDocumentUpload({
  slug,
  onOcrResult,
}: UseDocumentUploadOptions): UseDocumentUploadReturn {
  const [uploadStates, setUploadStates] = useState<Map<string, UploadState>>(new Map());

  const updateState = useCallback((filename: string, patch: Partial<UploadState>) => {
    setUploadStates((prev) => {
      const next = new Map(prev);
      const existing = prev.get(filename) ?? { status: "uploading" as UploadStatus };
      next.set(filename, { ...existing, ...patch });
      return next;
    });
  }, []);

  const pollJob = useCallback(
    (filename: string, jobId: string, uploadId: string) => {
      const intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/ocr/jobs/${jobId}`);
          if (!res.ok) {
            clearInterval(intervalId);
            updateState(filename, { status: "failed" });
            return;
          }

          const data = await res.json() as {
            status: "pending" | "processing" | "complete" | "failed";
            result: OcrResult | null;
          };

          if (data.status === "complete") {
            clearInterval(intervalId);
            updateState(filename, { status: "done" });
            if (data.result) {
              onOcrResult(uploadId, data.result);
            }
          } else if (data.status === "failed") {
            clearInterval(intervalId);
            updateState(filename, { status: "failed" });
          }
        } catch {
          clearInterval(intervalId);
          updateState(filename, { status: "failed" });
        }
      }, 2000);
    },
    [updateState, onOcrResult]
  );

  const uploadFile = useCallback(
    async (file: File, docType: DocType) => {
      const filename = file.name;

      setUploadStates((prev) => {
        const next = new Map(prev);
        next.set(filename, { status: "uploading" });
        return next;
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);

        const res = await fetch(`/api/f/${slug}/ocr`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          updateState(filename, { status: "failed" });
          return;
        }

        const { uploadId, jobId } = await res.json() as { uploadId: string; jobId: string };

        updateState(filename, { status: "processing", uploadId, jobId });
        pollJob(filename, jobId, uploadId);
      } catch {
        updateState(filename, { status: "failed" });
      }
    },
    [slug, updateState, pollJob]
  );

  const isUploading = Array.from(uploadStates.values()).some(
    (s) => s.status === "uploading" || s.status === "processing"
  );

  return { uploadFile, uploadStates, isUploading };
}
