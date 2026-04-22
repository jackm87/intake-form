"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const TEMPLATE_LABELS: Record<string, string> = {
  tax: "Tax Preparation",
  insurance: "Insurance Intake",
  health: "Health Intake",
  legal: "Legal Intake",
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") ?? "";
  const onboardingPath = template ? `/onboarding?template=${template}` : "/onboarding";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(onboardingPath)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Session exists → email confirmation is off, user is logged in immediately
    if (data.session) {
      router.push(onboardingPath);
      router.refresh();
      return;
    }

    // No session → confirmation email sent, wait for user to verify
    setPendingConfirmation(true);
    setLoading(false);
  }

  const templateLabel = TEMPLATE_LABELS[template];

  if (pendingConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Check your inbox</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              We sent a confirmation link to{" "}
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">{email}</span>.
              Click it to activate your account and continue setup.
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Already confirmed?{" "}
            <Link
              href={template ? `/login?template=${template}` : "/login"}
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center flex flex-col items-center">
          <Logo size="md" href="/" />
          {templateLabel ? (
            <>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Create your free account</p>
              <p className="mt-1 text-xs text-zinc-500">
                Setting up a <span className="text-emerald-500 font-medium">{templateLabel}</span> form
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Create your free account</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href={template ? `/login?template=${template}` : "/login"}
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
