"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PortfolioBackground from "@/components/PortfolioBackground";

/** Errors where the user should land back on the chat — e.g. cancelled Google sign-in. */
const RETURN_HOME_ERRORS = new Set([
  "AccessDenied",
  "OAuthSignin",
  "OAuthCallback",
  "Callback",
]);

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error && RETURN_HOME_ERRORS.has(error)) {
      router.replace("/");
    }
  }, [error, router]);

  if (error && RETURN_HOME_ERRORS.has(error)) {
    return null;
  }

  if (!error) {
    return (
      <div className="app-shell relative flex min-h-screen items-center justify-center p-6">
        <PortfolioBackground />
        <div className="glass-card max-w-md rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-400">Redirecting…</p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="btn-glow mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Back to chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center p-6">
      <PortfolioBackground />
      <div className="glass-card max-w-md rounded-2xl p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Sign-in issue
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Something went wrong while signing in. Check that Google OAuth is configured for this
          URL, then try again.
        </p>
        <button
          type="button"
          onClick={() => router.replace("/")}
          className="btn-glow mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Back to chat
        </button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  );
}
