"use client";

import { useSession, signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { markLoginRedirectWorkspace } from "@/lib/viewMode";
/** Sign-in for signed-out visitors — header pill only (keep it lightweight). */
export default function AuthButton({ variant = "header" }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (session || variant !== "header") return null;

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        markLoginRedirectWorkspace();
        signIn("google", { redirectTo: "/" });
      }}
      className="flex items-center gap-2 rounded-full btn-glow px-3.5 py-2 text-sm font-semibold"
    >
      <LogIn size={15} />
      Sign in
    </button>
  );
}
