"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ScanText } from "lucide-react";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";

const cyclingPhrases = [
  "in seconds.",
  "automatically.",
  "by OCR.",
  "instantly.",
  "effortlessly.",
];

const ocrFields = [
  { label: "Full Name", value: "Sarah K. Johnson" },
  { label: "Date of Birth", value: "March 14, 1985" },
  { label: "Address", value: "4721 Maple Drive, Austin TX" },
];

export default function Hero() {
  const titles = useMemo(() => cyclingPhrases, []);
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 3000);
    return () => clearTimeout(id);
  }, [titleNumber, titles]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <InfiniteGrid>
        <div className="max-w-5xl mx-auto flex flex-col items-center px-6 pt-32 pb-16 md:pt-40 md:pb-20">

          {/* Top — centered text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300">
              <ScanText className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
              <span>OCR-powered intake forms</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-50 leading-tight">
              Your intake form,
              <span className="relative flex justify-center overflow-hidden h-[1.25em] mt-1">
                &nbsp;
                <AnimatePresence>
                  <motion.span
                    key={titleNumber}
                    className="absolute whitespace-nowrap font-bold text-sky-400"
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 60, damping: 14 }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
              Give clients a link. They upload their documents. You get clean,
              structured data, automatically.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-md transition-colors duration-150"
              >
                Start for free →
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-50 border border-white/10 hover:border-white/20 rounded-md transition-all duration-150"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Bottom — mock OCR UI card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl mt-16"
          >
            <div
              className="rounded-lg border border-white/8 p-6 flex flex-col gap-1"
              style={{ backgroundColor: "#111318" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Tax Intake Form
                  </span>
                  <span className="text-sm font-semibold text-zinc-50">
                    Client Information
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-400/10 border border-sky-400/20 rounded-full">
                  OCR Active
                </span>
              </div>

              {/* Field rows */}
              <div className="flex flex-col gap-3">
                {ocrFields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-1.5"
                  >
                    <label className="text-xs font-medium text-zinc-500">{field.label}</label>
                    <div
                      className="flex items-center justify-between px-3 py-2.5 rounded-md border border-white/8"
                      style={{ backgroundColor: "#191c23" }}
                    >
                      <span className="text-sm text-zinc-200">{field.value}</span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.7 + i * 0.15, ease: "easeOut" }}
                        className="flex items-center gap-1 text-xs font-medium text-emerald-400"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Auto-filled</span>
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-zinc-500">3 of 8 fields filled</span>
                <div className="flex-1 mx-4 h-1 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "37%" }}
                    transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                    className="h-full bg-sky-500 rounded-full"
                  />
                </div>
                <span className="text-xs text-zinc-500">37%</span>
              </div>
            </div>

            {/* Ambient glow */}
            <div
              className="absolute -inset-4 -z-10 rounded-2xl opacity-20 blur-2xl"
              style={{ backgroundColor: "#0ea5e9" }}
            />
          </motion.div>
        </div>
      </InfiniteGrid>
    </section>
  );
}
