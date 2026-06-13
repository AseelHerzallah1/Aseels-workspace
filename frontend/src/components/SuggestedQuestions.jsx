"use client";

/** Clickable starter questions — grid on welcome, compact chips in the chat footer. */
export default function SuggestedQuestions({
  starters,
  onPick,
  busy = false,
  variant = "grid",
}) {
  if (!starters?.length) return null;

  if (variant === "compact") {
    return (
      <div className="w-full border-t border-white/[0.06] pt-3">
        <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-slate-500">
          Suggested questions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {starters.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => onPick(s.text)}
              disabled={busy}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition hover:border-brand/35 hover:text-brand disabled:opacity-50"
              title={s.text}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
      {starters.map((s) => (
        <button
          key={s.text}
          type="button"
          onClick={() => onPick(s.text)}
          disabled={busy}
          className="group glass-card flex items-start gap-2.5 rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:border-brand/40 disabled:opacity-50 dark:text-slate-200"
        >
          <span className="mt-0.5 text-brand opacity-70 group-hover:opacity-100">{s.icon}</span>
          <span>{s.text}</span>
        </button>
      ))}
    </div>
  );
}
