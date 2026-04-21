import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/8 py-8 px-6"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold text-sky-400">Form</span>
            <span className="text-lg font-bold text-zinc-50">Flow</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#templates"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Sign in
            </Link>
          </nav>
        </div>

        {/* Bottom row */}
        <p className="text-xs text-zinc-600">
          © 2025 FormFlow. Built with Next.js and Supabase.
        </p>
      </div>
    </footer>
  );
}
