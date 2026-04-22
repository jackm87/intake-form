"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-full pointer-events-none" />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 backdrop-blur-md bg-[#0d0e12]/85"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-150 rounded-full hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 rounded-full transition-colors duration-150"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
