"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 1px sentinel at the very top of the page */}
      <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-full pointer-events-none" />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "border-b border-white/8 backdrop-blur-sm bg-[#0d0e12]/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-sky-400">Form</span>
            <span className="text-xl font-bold text-zinc-50">Flow</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 mr-4">
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "Templates", href: "#templates" },
              { label: "Testimonials", href: "#testimonials" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Nav actions */}
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-md transition-colors duration-150"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
