"use client";

import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function labelFor(source) {
  const name = source.source?.replace(/_/g, " ") || "doc";
  if (source.heading) {
    const short = source.heading.length > 36 ? `${source.heading.slice(0, 34)}…` : source.heading;
    return `${name} · ${short}`;
  }
  return name;
}

export default function SourcesPanel({ sources = [] }) {
  const [open, setOpen] = useState(false);

  if (!sources.length) return null;

  return (
    <div className="ml-11 mt-1.5 max-w-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-brand/15 bg-brand/5 px-2 py-1 text-[0.7rem] font-medium text-brand/90 transition hover:border-brand/30 hover:bg-brand/10"
      >
        <FileText size={12} />
        {sources.length} source{sources.length === 1 ? "" : "s"}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <ul className="mt-1.5 space-y-0.5 rounded-md border border-white/5 bg-black/20 px-2 py-1.5">
          {sources.map((s, i) => (
            <li
              key={`${s.source}-${s.heading}-${i}`}
              className="flex items-center justify-between gap-2 text-[0.65rem] text-slate-400"
            >
              <span className="truncate capitalize">{labelFor(s)}</span>
              <span className="shrink-0 tabular-nums opacity-70">
                {Math.round((s.score || 0) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
