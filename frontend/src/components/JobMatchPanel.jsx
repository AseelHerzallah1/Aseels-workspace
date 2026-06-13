"use client";

import { useState } from "react";

export default function JobMatchPanel({ onAnalyze, disabled }) {
  const [jd, setJd] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const text = jd.trim();
    if (!text) return;
    onAnalyze(
      `Please analyze how well Aseel fits this role. Here is the job description:\n\n${text}`
    );
  }

  return (
    <div className="mt-5 w-full max-w-xl rounded-2xl border border-accent/30 bg-accent/5 p-4 text-left dark:border-accent/40 dark:bg-accent/10">
      <p className="text-sm font-semibold text-[#2a2440] dark:text-[#ECEAF5]">
        ◎ Role Fit — paste a job description
      </p>
      <p className="mt-1 text-xs text-[#6f6790] dark:text-[#a79fc7]">
        I&apos;ll compare the role against Aseel&apos;s verified profile and give matches, gaps,
        and a verdict.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={4}
          disabled={disabled}
          placeholder="Paste the job description here..."
          className="w-full resize-none rounded-xl border border-black/10 bg-white/90 px-3 py-2.5 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-[#ECEAF5]"
        />
        <button
          type="submit"
          disabled={disabled || !jd.trim()}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
        >
          Analyze fit
        </button>
      </form>
    </div>
  );
}
