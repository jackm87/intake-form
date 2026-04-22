import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/8 py-8 px-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Logo size="sm" />

          <nav className="flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              How it works
            </Link>
            <Link href="#templates" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Templates
            </Link>
            <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Sign in
            </Link>
          </nav>
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          © 2026 FormFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
