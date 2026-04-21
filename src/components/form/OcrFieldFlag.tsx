"use client";

import type { OcrWarning } from "@/lib/ocr/applyOcrResult";

interface OcrFieldFlagProps {
  fieldKey: string;
  warnings: Map<string, OcrWarning>;
}

export function OcrFieldFlag({ fieldKey, warnings }: OcrFieldFlagProps) {
  const warning = warnings.get(fieldKey);
  if (!warning) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      Low confidence, review
    </span>
  );
}
