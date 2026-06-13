"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function UserPill({ session }) {
  const user = session?.user || {};
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 py-1 pl-1 pr-2 dark:border-white/10 dark:bg-white/5">
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="h-7 w-7 rounded-full" />
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-medium text-white">
          {user.name?.[0]?.toUpperCase() ?? "U"}
        </div>
      )}
      <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#2a2440] sm:inline dark:text-[#ECEAF5]">
        {user.name}
      </span>
      <button
        onClick={() => signOut()}
        aria-label="Sign out"
        className="rounded-full p-1 text-[#8a82a6] transition hover:bg-black/5 dark:text-[#a79fc7] dark:hover:bg-white/10"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
