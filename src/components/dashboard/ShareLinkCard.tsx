"use client";

import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Copy, Check, Download, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareLinkCardProps {
  slug: string;
  appUrl: string;
  large?: boolean;
}

export function ShareLinkCard({ slug, appUrl, large = false }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const url = `${appUrl}/f/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadQR() {
    // Render a canvas-based QR code offscreen, then export as PNG
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use the hidden canvas element if available
    const canvasEl = canvasRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (canvasEl) {
      ctx.fillStyle = "#0d0e12";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(canvasEl, 0, 0, size, size);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `formflow-qr-${slug}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }

  const qrSize = large ? 180 : 120;

  return (
    <div
      className="rounded-lg p-6 border border-white/8 space-y-4"
      style={{ background: "#111318" }}
    >
      <div className="flex items-center gap-2">
        <Link2 size={16} className="text-sky-400" />
        <h3 className="text-base font-semibold text-gray-50">Share your form</h3>
      </div>

      {/* URL display */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 rounded-md border border-white/8 px-3 py-2 text-xs text-zinc-400 font-mono truncate"
          style={{ background: "var(--elevated)" }}
        >
          {url}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="shrink-0 border-white/8 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white gap-1.5 transition-all duration-150"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div
          className="rounded-lg p-3 border border-white/8"
          style={{ background: "var(--elevated)" }}
        >
          <QRCodeSVG
            value={url}
            size={qrSize}
            bgColor="transparent"
            fgColor="#e4e4e7"
          />
        </div>

        {/* Hidden canvas for download */}
        <div ref={canvasRef} className="hidden">
          <QRCodeCanvas
            value={url}
            size={512}
            bgColor="#0d0e12"
            fgColor="#e4e4e7"
          />
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadQR}
          className="border-white/8 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200 gap-1.5 transition-all duration-150 w-full"
        >
          <Download size={14} />
          Download QR
        </Button>
      </div>

      {large && (
        <p className="text-xs text-zinc-500 text-center pt-2">
          Share this link with your clients. They&apos;ll be guided through the intake form step by step.
        </p>
      )}
    </div>
  );
}
