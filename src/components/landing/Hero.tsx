"use client";

import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const CYCLING_WORDS = ["themselves.", "automatically.", "instantly.", "in seconds."];

function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % CYCLING_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="block overflow-hidden leading-[1.06]" style={{ height: "1.06em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={CYCLING_WORDS[index]}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="block text-emerald-500"
        >
          {CYCLING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.getBoundingClientRect().top + window.scrollY - 80;
  const start = window.scrollY;
  const distance = target - start;
  const duration = 320;
  const startTime = performance.now();
  const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const step = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const submissions = [
  { name: "Sarah K. Johnson", type: "Tax Intake", time: "2m ago", status: "complete", pct: 100 },
  { name: "Marcus T. Rivera", type: "Insurance",  time: "9m ago", status: "complete", pct: 100 },
  { name: "Elena Vasquez",    type: "Legal",      time: "14m ago", status: "review",   pct: 78 },
  { name: "David Chen",      type: "Health",     time: "31m ago", status: "complete", pct: 100 },
];

const stats = [
  { label: "Submissions", value: "1,284" },
  { label: "OCR fill rate", value: "94%" },
  { label: "Avg. time", value: "1:47" },
];

function StatusPill({ status }: { status: string }) {
  if (status === "complete") {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        Complete
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
      Review
    </span>
  );
}

function DashboardMockup() {
  const floatControls = useAnimationControls();

  useEffect(() => {
    async function loop() {
      await floatControls.start({ y: -8, transition: { duration: 3, ease: "easeInOut" } });
      await floatControls.start({ y: 0, transition: { duration: 3, ease: "easeInOut" } });
      loop();
    }
    loop();
  }, [floatControls]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 32, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div animate={floatControls}>
        <div
          className="rounded-2xl border border-white/8 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          style={{ backgroundColor: "var(--surface)" }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/6" style={{ backgroundColor: "var(--elevated)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <div className="flex-1 mx-3">
              <div className="max-w-[160px] mx-auto rounded-md bg-white/5 border border-white/6 px-3 py-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-zinc-500 font-medium">formflow.app/dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-11 border-r border-white/6 py-4 flex flex-col items-center gap-3" style={{ backgroundColor: "var(--elevated)" }}>
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.75" fill="#10b981" />
                  <rect x="6" y="0.5" width="3.5" height="3.5" rx="0.75" fill="#10b981" opacity="0.5" />
                  <rect x="0.5" y="6" width="3.5" height="3.5" rx="0.75" fill="#10b981" opacity="0.5" />
                  <rect x="6" y="6" width="3.5" height="3.5" rx="0.75" fill="#10b981" opacity="0.3" />
                </svg>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-lg bg-white/4 flex items-center justify-center">
                  <div className="w-3 h-0.5 rounded-full bg-white/20" />
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="flex-1 p-4 min-w-0">
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-50">Submissions</p>
                  <p className="text-[10px] text-zinc-500">Last 30 days</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    Live
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                    className="rounded-lg border border-white/6 p-2"
                    style={{ backgroundColor: "var(--bg)" }}
                  >
                    <p className="text-[10px] text-zinc-500 mb-0.5">{s.label}</p>
                    <p className="text-sm font-bold text-zinc-50">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Submission rows */}
              <div className="flex flex-col gap-1.5">
                {submissions.map((row, i) => (
                  <motion.div
                    key={row.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.7 + i * 0.08 }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 border border-white/4 hover:border-white/8 transition-colors"
                    style={{ backgroundColor: "var(--elevated)" }}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-emerald-400">{row.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-zinc-200 truncate">{row.name}</p>
                      <p className="text-[9px] text-zinc-500">{row.type}</p>
                    </div>
                    <StatusPill status={row.status} />
                    <span className="text-[9px] text-zinc-600 flex-shrink-0">{row.time}</span>
                  </motion.div>
                ))}
              </div>

              {/* Animated scan bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3 flex items-center gap-2"
              >
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex-shrink-0">94% OCR</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>

      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Emerald glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
      />

      {/* Floating particles */}
      {[
        { x: "15%", y: "20%", delay: 0, size: 2 },
        { x: "72%", y: "15%", delay: 0.8, size: 1.5 },
        { x: "85%", y: "55%", delay: 1.4, size: 2 },
        { x: "8%",  y: "65%", delay: 0.4, size: 1.5 },
        { x: "55%", y: "80%", delay: 1.1, size: 1 },
        { x: "40%", y: "10%", delay: 1.8, size: 1.5 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-emerald-400"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, delay: p.delay, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      <div className="relative px-6 mx-auto max-w-6xl">
        <div className="relative">

          {/* Left copy */}
          <div className="lg:w-[54%]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500"
            >
              OCR-powered document scanning
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-50 leading-[1.06] tracking-tight"
            >
              Intake forms that fill
              <CyclingWord />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
              className="max-w-lg mt-6 text-lg font-normal text-zinc-400"
            >
              Share a link. Clients upload their documents. OCR extracts the data
              and pre-fills every field — no manual entry, no back-and-forth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-5 mt-8"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 rounded-md transition-colors duration-150"
              >
                Get started free
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
              >
                See how it works →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="inline-flex items-center gap-2 pt-8 mt-8 border-t border-zinc-800"
            >
              <TrendingUp size={16} className="text-emerald-500" strokeWidth={1.75} />
              <span className="text-sm font-normal text-zinc-400">
                Clients complete intake in{" "}
                <span className="text-zinc-200 font-medium">under 2 minutes</span>
                {" "}on average
              </span>
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-14 md:absolute md:mt-0 md:top-0 md:right-0 md:w-[43%]">
            <DashboardMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
