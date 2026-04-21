"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  orgName: string;
  logoFile: File | null;
  brandColor: string;
  onLogoChange: (file: File | null) => void;
  onColorChange: (color: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];

export function StepBranding({
  orgName,
  logoFile,
  brandColor,
  onLogoChange,
  onColorChange,
  onBack,
  onSubmit,
  loading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const logoPreviewUrl = logoFile ? URL.createObjectURL(logoFile) : null;

  function validateAndSet(file: File) {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Only JPG, PNG, or SVG files are accepted.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File must be under 2MB.");
      return;
    }
    onLogoChange(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Brand your workspace</h2>
        <p className="mt-1 text-sm text-zinc-400">Add your logo and brand color. You can always update these later.</p>
      </div>

      {/* Logo upload */}
      <div className="space-y-2">
        <Label>Logo</Label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={[
            "relative flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
            dragOver ? "border-sky-400/60 bg-sky-500/8" : "border-white/12 hover:border-white/20 hover:bg-white/3",
          ].join(" ")}
        >
          {logoPreviewUrl ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoPreviewUrl} alt="Logo preview" className="h-12 w-auto object-contain rounded" />
              <p className="text-xs text-zinc-400">{logoFile?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 pointer-events-none">
              <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
              <p className="text-xs text-zinc-500">JPG, PNG, SVG · max 2MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.svg"
          onChange={handleFileInput}
          className="hidden"
        />
        {fileError && <p className="text-xs text-red-400">{fileError}</p>}
        {logoFile && (
          <button
            type="button"
            onClick={() => { onLogoChange(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Remove logo
          </button>
        )}
      </div>

      {/* Brand color */}
      <div className="space-y-2">
        <Label htmlFor="brand-color">Brand color</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              id="brand-color"
              type="color"
              value={brandColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/12 cursor-pointer bg-transparent p-0.5 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md"
            />
          </div>
          <span className="text-sm font-mono text-zinc-300">{brandColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Mini preview */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview</p>
        <div
          className="rounded-lg border border-white/8 p-4 flex items-center gap-3"
          style={{ background: "var(--elevated)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
            style={{ backgroundColor: brandColor }}
          >
            {logoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreviewUrl} alt="" className="w-full h-full object-contain rounded-lg" />
            ) : (
              (orgName?.[0] ?? "F").toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">{orgName || "Your Workspace"}</p>
            <p className="text-xs" style={{ color: brandColor }}>formflow.app</p>
          </div>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} size="sm" disabled={loading}>
          <svg className="mr-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onSubmit} disabled={loading} size="sm" className="text-zinc-400">
            Skip for now
          </Button>
          <Button onClick={onSubmit} disabled={loading} size="sm">
            {loading ? (
              <>
                <svg className="mr-1.5 w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Setting up…
              </>
            ) : (
              <>
                Complete setup
                <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
