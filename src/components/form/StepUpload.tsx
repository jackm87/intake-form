"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCustomerFormStore } from "@/stores/customerFormStore";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { OcrStatusPanel } from "./OcrStatusPanel";
import type { DocType, OcrResult, TemplateConfig } from "@/lib/templates/types";

const DOC_TYPE_LABELS: Record<DocType, string> = {
  drivers_license: "Driver's License",
  w2: "W-2",
  insurance_card: "Insurance Card",
  vehicle_registration: "Vehicle Registration",
  other: "Other",
};

interface PendingFile {
  file: File;
  docType: DocType;
}

interface StepUploadProps {
  slug: string;
  template: TemplateConfig;
  nextStep: () => void;
  brandColor: string;
}

export function StepUpload({ slug, template, nextStep, brandColor }: StepUploadProps) {
  const { addUploadId, setOcrResult, uploadIds } = useCustomerFormStore();
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const onOcrResult = useCallback(
    (uploadId: string, result: OcrResult) => {
      addUploadId(uploadId);
      setOcrResult(uploadId, result);
    },
    [addUploadId, setOcrResult]
  );

  const { uploadFile, uploadStates, isUploading } = useDocumentUpload({ slug, onOcrResult });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPending: PendingFile[] = acceptedFiles.map((file) => ({
      file,
      docType: "other" as DocType,
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const updateDocType = (filename: string, docType: DocType) => {
    setPendingFiles((prev) =>
      prev.map((pf) => (pf.file.name === filename ? { ...pf, docType } : pf))
    );
  };

  const handleUploadAll = async () => {
    for (const { file, docType } of pendingFiles) {
      if (!uploadStates.has(file.name)) {
        await uploadFile(file, docType);
      }
    }
  };

  const hasDoneUploads = Array.from(uploadStates.values()).some((s) => s.status === "done");
  const canContinue = hasDoneUploads || uploadIds.length > 0;

  const acceptedDocTypes = template.steps.find((s) => s.key === "upload")?.acceptedDocTypes;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-50">Upload Documents</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Upload your documents and we'll automatically fill in your information.
          {acceptedDocTypes && acceptedDocTypes.length > 0 && (
            <> Accepted: {acceptedDocTypes.map((t) => DOC_TYPE_LABELS[t]).join(", ")}.</>
          )}
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className="rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors duration-150 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900"
        style={isDragActive ? { borderColor: brandColor, backgroundColor: `${brandColor}0d` } : undefined}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-10 w-10 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="mt-3 text-sm text-zinc-400">
          {isDragActive ? (
            "Drop files here"
          ) : (
            <>
              <span className="font-medium text-zinc-300">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-zinc-600">PDF, JPG, PNG · max 10 MB each</p>
      </div>

      {/* Pending files with doc type selectors */}
      {pendingFiles.length > 0 && (
        <div className="space-y-3">
          {pendingFiles.map(({ file, docType }) => {
            const alreadyUploading = uploadStates.has(file.name);
            return (
              <div
                key={file.name}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 px-4 py-3"
              >
                <span className="flex-1 truncate text-sm text-zinc-300">{file.name}</span>
                <select
                  value={docType}
                  disabled={alreadyUploading}
                  onChange={(e) => updateDocType(file.name, e.target.value as DocType)}
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                >
                  {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {pendingFiles.some((pf) => !uploadStates.has(pf.file.name)) && (
            <button
              onClick={handleUploadAll}
              disabled={isUploading}
              className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150 hover:opacity-85"
              style={{ backgroundColor: brandColor }}
            >
              {isUploading ? "Uploading…" : "Upload Files"}
            </button>
          )}
        </div>
      )}

      {/* OCR status */}
      <OcrStatusPanel uploadStates={uploadStates} />

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: brandColor }}
        >
          Continue →
        </button>
        <button
          onClick={nextStep}
          className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors duration-150 underline underline-offset-2"
        >
          Fill manually instead
        </button>
      </div>
    </div>
  );
}
