"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { RESPONSE_STYLES } from "@/lib/constants";

/** Compact tone carousel — sits inside the composer box above the prompt. */
export default function StylePicker({ value, onChange }) {
  const idx = Math.max(
    0,
    RESPONSE_STYLES.findIndex((s) => s.value === value)
  );
  const current = RESPONSE_STYLES[idx];

  function step(delta) {
    const next = (idx + delta + RESPONSE_STYLES.length) % RESPONSE_STYLES.length;
    onChange(RESPONSE_STYLES[next].value);
  }

  return (
    <div className="flex items-center justify-center gap-1 border-b border-white/[0.06] px-2.5 py-0.5">
      <span className="mr-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500">
        Tone
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous tone"
        className="rounded p-0.5 text-slate-500 transition hover:bg-white/5 hover:text-brand"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange(current.value)}
        title={current.hint}
        className="flex min-w-[5.5rem] items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-medium text-slate-300"
      >
        <span className="text-[0.65rem]">{current.icon}</span>
        {current.label}
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next tone"
        className="rounded p-0.5 text-slate-500 transition hover:bg-white/5 hover:text-brand"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
