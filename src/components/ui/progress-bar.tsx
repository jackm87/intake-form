"use client";

import { useEffect, useState } from "react";
import { Progress } from "@ark-ui/react/progress";

type ProgressWithLabelProps = {
  value: number;
  label?: string;
  delay?: number;
  duration?: number;
  color?: string;
  className?: string;
};

export function ProgressWithLabel({
  value,
  label,
  delay = 120,
  duration = 500,
  color = "#0ea5e9",
  className,
}: ProgressWithLabelProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Progress.Root value={progress} className={`w-full ${className ?? ""}`}>
      {label && (
        <Progress.Label className="sr-only">{label}</Progress.Label>
      )}
      <div className="flex items-center gap-3">
        <Progress.Track className="h-1 flex-1 bg-zinc-800 overflow-hidden">
          <Progress.Range
            className="h-full rounded-full"
            style={{
              background: color,
              opacity: 0.85,
              transitionProperty: "width",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDuration: `${duration}ms`,
            }}
          />
        </Progress.Track>
        <Progress.ValueText
          className="text-xs font-medium tabular-nums shrink-0"
          style={{ color, opacity: 0.85, minWidth: "2.5rem", textAlign: "right" }}
        />
      </div>
    </Progress.Root>
  );
}
