"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Home, Trash2 } from "lucide-react";
import PortfolioBackground from "@/components/PortfolioBackground";
import Sidebar from "@/components/Sidebar";
import Welcome from "@/components/Welcome";
import ChatMessage from "@/components/ChatMessage";
import ChatComposer from "@/components/ChatComposer";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import SourcesPanel from "@/components/SourcesPanel";
import UserMenu from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { BACKEND_URL, ASSISTANT_MODE, ASSISTANT_STARTERS } from "@/lib/constants";
import { useSuggestedQuestions } from "@/hooks/useSuggestedQuestions";
import { SUGGESTED_HOME_COUNT } from "@/lib/suggestedQuestions";
import { loadConversations, saveConversations } from "@/lib/storage";
import { streamChat } from "@/lib/chatApi";
import { getDefaultStyle } from "@/lib/settings";
import { uuid } from "@/lib/id";

const makeTitle = (text) => (text.length > 28 ? text.slice(0, 28) + "…" : text);
const newConversation = () => ({
  id: uuid(),
  title: "New Chat",
  messages: [],
  archived: false,
  updatedAt: Date.now(),
});

export default function AssistantChat({ session, onGoPublic }) {
  const userId = session.user?.email || session.user?.id;
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [input, setInput] = useState("");
  const [style, setStyle] = useState("plain");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { visibleStarters, pickStarter, resetStarters } = useSuggestedQuestions(
    "assistant",
    ASSISTANT_STARTERS
  );
  const homeStarters = ASSISTANT_STARTERS.slice(0, SUGGESTED_HOME_COUNT);

  useEffect(() => {
    setStyle(getDefaultStyle());
    function sync() {
      setStyle(getDefaultStyle());
    }
    window.addEventListener("aseel-settings-change", sync);
    return () => window.removeEventListener("aseel-settings-change", sync);
  }, []);

  const scrollRef = useRef(null);
  const mode = ASSISTANT_MODE.value;

  async function refreshDocuments() {
    if (!userId) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/documents?user_id=${encodeURIComponent(userId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setUploadedFiles(data.files || []);
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const saved = await loadConversations(userId);
      const fresh = newConversation();
      setConversations([fresh, ...saved]);
      setCurrentId(fresh.id);
      setHydrated(true);
    })();
    refreshDocuments();
  }, [userId]);

  useEffect(() => {
    if (hydrated && !isStreaming && userId) {
      saveConversations(userId, conversations.filter((c) => c.messages.length > 0));
    }
  }, [conversations, isStreaming, hydrated, userId]);

  const current = conversations.find((c) => c.id === currentId) || null;
  const messages = current?.messages ?? [];
  const atHome = messages.length === 0;
  const chatTitle = current?.title || "New Chat";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isStreaming]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("user_id", userId);
      form.append("file", file);
      const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      await refreshDocuments();
    } catch (err) {
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleNewChat() {
    const fresh = newConversation();
    setConversations((prev) => [fresh, ...prev]);
    setCurrentId(fresh.id);
    setSidebarOpen(false);
    resetStarters();
  }

  function handleGoHome() {
    handleClearChat();
    setSidebarOpen(false);
  }

  function handleSelectChat(id) {
    setCurrentId(id);
    setSidebarOpen(false);
  }

  function handleClearChat() {
    setConversations((prev) =>
      prev.map((c) => (c.id === currentId ? { ...c, messages: [], title: "New Chat" } : c))
    );
    resetStarters();
  }

  function pickFallbackId(remaining) {
    const active = remaining.find((c) => !c.archived);
    return (active || remaining[0])?.id ?? null;
  }

  function handleDeleteChat(id) {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const fresh = newConversation();
      setConversations([fresh]);
      setCurrentId(fresh.id);
      return;
    }
    setConversations(remaining);
    if (id === currentId) setCurrentId(pickFallbackId(remaining));
  }

  function handleArchiveChat(id, archived) {
    const updated = conversations.map((c) => (c.id === id ? { ...c, archived } : c));
    if (archived && id === currentId) {
      const fallbackId = pickFallbackId(updated.filter((c) => !c.archived));
      if (fallbackId) {
        setConversations(updated);
        setCurrentId(fallbackId);
      } else {
        const fresh = newConversation();
        setConversations([fresh, ...updated]);
        setCurrentId(fresh.id);
      }
      return;
    }
    setConversations(updated);
  }

  function updateLastAssistant(updates) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== currentId) return c;
        const msgs = [...c.messages];
        const last = msgs[msgs.length - 1];
        msgs[msgs.length - 1] = { ...last, ...updates };
        return { ...c, messages: msgs, updatedAt: Date.now() };
      })
    );
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || !current) return;

    const userMsg = { role: "user", content: trimmed };
    const outgoing = [...current.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== currentId) return c;
        const title = c.messages.length === 0 ? makeTitle(trimmed) : c.title;
        return {
          ...c,
          title,
          messages: [...outgoing, { role: "assistant", content: "", sources: [] }],
          updatedAt: Date.now(),
        };
      })
    );
    setInput("");
    setIsStreaming(true);

    try {
      await streamChat({
        url: `${BACKEND_URL}/chat`,
        body: { messages: outgoing, mode, user_id: userId, style },
        onSources: (sources) => updateLastAssistant({ sources }),
        onChunk: (acc) => updateLastAssistant({ content: acc }),
        onError: (errText) =>
          updateLastAssistant({ content: `⚠️ ${errText}`, sources: [] }),
      });
    } catch (err) {
      updateLastAssistant({
        content: `⚠️ ${err?.message || "Something went wrong."}`,
        sources: [],
      });
    } finally {
      setIsStreaming(false);
    }
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

  function handleExportChats() {
    const payload = conversations.filter((c) => c.messages.length > 0);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aseel-workspace-chats-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearAllChats() {
    const fresh = newConversation();
    setConversations([fresh]);
    setCurrentId(fresh.id);
    if (userId) saveConversations(userId, []);
  }

  return (
    <div className="app-shell flex h-screen">
      <PortfolioBackground />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40"
          aria-hidden="true"
        />
      )}

      <Sidebar
        variant="assistant"
        conversations={conversations}
        currentId={currentId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onArchiveChat={handleArchiveChat}
        onGoPublic={() => {
          onGoPublic?.();
          setSidebarOpen(false);
        }}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="app-header flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
          >
            <Menu size={20} />
          </button>

          {!atHome && (
            <button
              onClick={handleGoHome}
              className="hidden items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-white/5 hover:text-brand sm:flex"
            >
              <Home size={15} />
            </button>
          )}

          <h1 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {atHome ? "New Chat" : chatTitle}
          </h1>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {!atHome && (
              <button
                onClick={handleClearChat}
                aria-label="Clear chat"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-red-400"
              >
                <Trash2 size={17} />
              </button>
            )}
            <ThemeToggle embedded />
            <UserMenu
              session={session}
              uploadedFiles={uploadedFiles}
              onExportChats={handleExportChats}
              onClearAllChats={handleClearAllChats}
              compact
            />
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-8">
            {atHome ? (
              <Welcome
                variant="assistant"
                onPick={(text) => pickStarter(text, sendMessage)}
                homeStarters={homeStarters}
                busy={isStreaming}
              />
            ) : (
              <div className="space-y-5">
                {messages.map((m, i) => (
                  <div key={i}>
                    <ChatMessage role={m.role} content={m.content} />
                    {m.role === "assistant" && m.sources?.length > 0 && (
                      <SourcesPanel sources={m.sources} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!atHome && visibleStarters.length > 0 && (
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
          promptProps={{
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: handleKeyDown,
            onSubmit: handleSubmit,
            placeholder: "Ask me anything...",
            disabled: isStreaming,
            uploading,
            uploadedFiles,
            onUpload: handleUpload,
          }}
        />
      </main>
    </div>
  );
}
