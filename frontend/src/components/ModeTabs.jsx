"use client";

/** About Me / For Recruiters / Role Fit — compact pills on home and in chat footer. */
export default function ModeTabs({ modes, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {modes.map((m) => {
        const active = m.value === value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition sm:text-[0.8125rem] ${
              active
                ? "btn-glow shadow-sm"
                : "glass-card text-slate-400 hover:border-brand/40 hover:text-brand"
            }`}
          >
            <span className="text-[0.65rem] opacity-80">{m.icon}</span>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
