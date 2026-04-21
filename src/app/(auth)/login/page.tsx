"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TEMPLATE_LABELS: Record<string, string> = {
  tax: "Tax Preparation",
  insurance: "Insurance Intake",
  health: "Health Intake",
  legal: "Legal Intake",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") ?? "";
  const returnTo = searchParams.get("returnTo") ?? "";
  const onboardingPath = template ? `/onboarding?template=${template}` : "/onboarding";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Your email isn't confirmed yet. Check your inbox for the confirmation link.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // If they came from onboarding redirect (no org yet) keep template param
    const dest = returnTo || (template ? onboardingPath : "/dashboard");
    router.push(dest);
    router.refresh();
  }

  const templateLabel = TEMPLATE_LABELS[template];

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50">
            <span className="text-sky-400">Form</span>Flow
          </h1>
          {templateLabel ? (
            <>
              <p className="mt-2 text-sm text-zinc-400">Sign in to your account</p>
              <p className="mt-1 text-xs text-zinc-600">
                Setting up a <span className="text-sky-400 font-medium">{templateLabel}</span> form
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">Sign in to your account</p>
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
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          No account?{" "}
          <Link
            href={template ? `/signup?template=${template}` : "/signup"}
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
