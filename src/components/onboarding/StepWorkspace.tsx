"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  name: string;
  slug: string;
  onChange: (name: string, slug: string) => void;
  onNext: () => void;
}

type SlugStatus = "idle" | "checking" | "available" | "taken";

export function StepWorkspace({ name, slug, onChange, onNext }: Props) {
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(async (value: string) => {
    if (!value) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    try {
      const res = await fetch(`/api/onboarding/check-slug?slug=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSlugStatus(data.available ? "available" : "taken");
    } catch {
      setSlugStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    debounceRef.current = setTimeout(() => {
      checkSlug(slug);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [slug, checkSlug]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    const newSlug = slugEdited ? slug : slugify(newName);
    onChange(newName, newSlug);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    onChange(name, slugify(e.target.value));
  }

  const canAdvance = name.trim().length > 0 && slug.length > 0 && slugStatus !== "taken" && slugStatus !== "checking";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Name your workspace</h2>
        <p className="mt-1 text-sm text-zinc-400">This is how your clients will identify your organization.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ws-name">Workspace name</Label>
        <Input
          id="ws-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Acme Accounting"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ws-slug">URL slug</Label>
        <div className="relative">
          <Input
            id="ws-slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="acme-accounting"
            className="pr-8"
          />
          {slugStatus === "checking" && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </span>
          )}
          {slugStatus === "available" && (
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {slugStatus === "taken" && (
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-400">formflow.app/f/</span>
            <span className={slug ? "text-zinc-200" : "text-zinc-600"}>{slug || "your-slug"}</span>
          </p>
          {slugStatus === "taken" && (
            <p className="text-xs text-red-400">Already taken</p>
          )}
          {slugStatus === "available" && (
            <p className="text-xs text-emerald-400">Available</p>
          )}
        </div>
      </div>

      <div className="pt-1 flex justify-end">
        <Button onClick={onNext} disabled={!canAdvance} size="sm">
          Next
          <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
