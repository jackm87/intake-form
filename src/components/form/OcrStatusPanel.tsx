"use client";

import type { UploadState } from "@/hooks/useDocumentUpload";

interface OcrStatusPanelProps {
  uploadStates: Map<string, UploadState>;
}

function StatusBadge({ status }: { status: UploadState["status"] }) {
  switch (status) {
    case "uploading":
      return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse" />
          Uploading
        </span>
      );
    case "processing":
      return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Processing
        </span>
      );
    case "done":
      return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Done
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        </span>
      );
  }
}

export function OcrStatusPanel({ uploadStates }: OcrStatusPanelProps) {
  if (uploadStates.size === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-zinc-800 overflow-hidden">
      {Array.from(uploadStates.entries()).map(([filename, state]) => (
        <div
          key={filename}
          className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-0"
        >
          <span className="text-sm text-zinc-300 truncate max-w-[60%]">{filename}</span>
          <StatusBadge status={state.status} />
        </div>
      ))}
    </div>
  );
}
