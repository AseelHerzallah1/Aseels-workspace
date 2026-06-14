"use client";

import { useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Home } from "lucide-react";
import Welcome from "@/components/Welcome";
import ChatMessage from "@/components/ChatMessage";
import ChatComposer from "@/components/ChatComposer";
import ModeTabs from "@/components/ModeTabs";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import SourcesPanel from "@/components/SourcesPanel";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import UserMenu from "@/components/UserMenu";
import PortfolioBackground from "@/components/PortfolioBackground";
import { LayoutGrid } from "lucide-react";
import { PORTFOLIO_STARTERS, RECRUITER_STARTERS, MODES, CHAT_URL } from "@/lib/constants";
import { useSuggestedQuestions } from "@/hooks/useSuggestedQuestions";
import { SUGGESTED_HOME_COUNT } from "@/lib/suggestedQuestions";
import { streamChat } from "@/lib/chatApi";

export default function PublicChat({ session = null, onGoWorkspace }) {
  const [mode, setMode] = useState(MODES[0].value);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("plain");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  const atHome = messages.length === 0;
  const starterPool = useMemo(
    () =>
      mode === "recruiter"
        ? RECRUITER_STARTERS
        : mode === "portfolio"
          ? PORTFOLIO_STARTERS
          : [],
    [mode]
  );
  const { visibleStarters, pickStarter, resetStarters } = useSuggestedQuestions(mode, starterPool);
  const homeStarters = starterPool.slice(0, SUGGESTED_HOME_COUNT);
  const placeholder =
    mode === "job_match"
      ? "Or paste a job description here..."
      : "Ask about Aseel...";

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const outgoing = [...messages, { role: "user", content: trimmed }];
    setMessages([...outgoing, { role: "assistant", content: "", sources: [] }]);
    setInput("");
    setIsStreaming(true);

    try {
      await streamChat({
        url: CHAT_URL,
        body: { messages: outgoing, mode, style },
        onSources: (sources) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, sources };
            return copy;
          });
        },
        onChunk: (acc) => {
          flushSync(() => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, content: acc };
              return copy;
            });
          });
        },
        onError: (errText) => {
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${errText}`, sources: [] };
            return copy;
          });
        },
      });
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `⚠️ ${err?.message || "Something went wrong."}`,
          sources: [],
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleGoHome() {
    setMessages([]);
    setInput("");
    resetStarters();
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="app-shell flex h-screen flex-col">
      <PortfolioBackground />
      <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
        {session && onGoWorkspace && (
          <button
            type="button"
            onClick={onGoWorkspace}
            className="hidden items-center gap-1.5 rounded-full glass-card px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand/40 hover:text-brand sm:flex dark:text-slate-300"
          >
            <LayoutGrid size={15} />
            My workspace
          </button>
        )}
        {session ? <UserMenu session={session} compact /> : <AuthButton />}
        <ThemeToggle embedded />
      </div>

      {!atHome && (
        <div className="app-header flex items-center gap-3 px-4 py-3">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-brand transition hover:bg-brand/10"
          >
            <Home size={16} />
            Home
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          {atHome ? (
            <Welcome
              variant="public"
              onPick={(text) => pickStarter(text, sendMessage)}
              homeStarters={homeStarters}
              mode={mode}
              setMode={setMode}
              busy={isStreaming}
            />
          ) : (
            <div className="space-y-5">
              {messages.map((m, i) => (
                <div key={i}>
                  <ChatMessage
                    role={m.role}
                    content={m.content}
                    streaming={
                      isStreaming &&
                      i === messages.length - 1 &&
                      m.role === "assistant"
                    }
                  />
                  {m.role === "assistant" && m.sources?.length > 0 && (
                    <SourcesPanel sources={m.sources} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!atHome && mode !== "job_match" && visibleStarters.length > 0 && (
          <div className="mx-auto w-full max-w-3xl px-4 pb-4">
            <SuggestedQuestions
              starters={visibleStarters}
              onPick={(text) => pickStarter(text, sendMessage)}
              busy={isStreaming}
              variant="compact"
            />
          </div>
        )}
      </div>

      <ChatComposer
        style={style}
        onStyleChange={setStyle}
        modeSlot={!atHome ? <ModeTabs modes={MODES} value={mode} onChange={setMode} /> : null}
        promptProps={{
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          onSubmit: handleSubmit,
          placeholder,
          disabled: isStreaming,
        }}
      />
    </div>
  );
}
