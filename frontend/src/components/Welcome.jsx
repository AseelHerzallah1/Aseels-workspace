"use client";

import HeroMark from "./HeroMark";
import JobMatchPanel from "./JobMatchPanel";
import ModeTabs from "./ModeTabs";
import SuggestedQuestions from "./SuggestedQuestions";
import {
  MODES,
  APP_TAGLINE,
  ASSISTANT_NAME,
  HERO_MARK_VARIANT,
  PROFILE,
} from "@/lib/constants";

export default function Welcome({
  variant = "public",
  onPick,
  homeStarters = [],
  visibleStarters = [],
  mode,
  setMode,
  busy = false,
}) {
  const isAssistant = variant === "assistant";
  const isJobMatch = mode === "job_match";
  const nameParts = PROFILE.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? PROFILE.name;
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="relative flex flex-col items-center px-4 py-6 text-center">
      <div
        className="pointer-events-none absolute top-0 h-28 w-28 rounded-full bg-brand/12 blur-3xl dark:bg-cyan-400/8"
        aria-hidden="true"
      />

      <div className="relative mb-3 flex flex-col items-center gap-2">
        <HeroMark
          size={isAssistant ? 80 : 96}
          variant={HERO_MARK_VARIANT}
          subtle
        />

        <div className="max-w-md">
          {isAssistant ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {ASSISTANT_NAME}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Private workspace · attach files with 📎 below
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {firstName}
                {lastName ? (
                  <>
                    {" "}
                    <span className="text-brand">{lastName}</span>
                  </>
                ) : null}
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">
                {PROFILE.title}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">
                {PROFILE.credentials}
              </p>
              <div className="divider-glow mt-5" />
              <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {APP_TAGLINE}
              </p>
            </>
          )}
        </div>
      </div>

      {!isAssistant && (
        <>
          <ModeTabs modes={MODES} value={mode} onChange={setMode} />

          {isJobMatch ? (
            <JobMatchPanel onAnalyze={onPick} disabled={busy} />
          ) : (
            homeStarters.length > 0 && (
              <SuggestedQuestions starters={homeStarters} onPick={onPick} busy={busy} />
            )
          )}
        </>
      )}

      {isAssistant && homeStarters.length > 0 && (
        <SuggestedQuestions starters={homeStarters} onPick={onPick} busy={busy} />
      )}
    </div>
  );
}
