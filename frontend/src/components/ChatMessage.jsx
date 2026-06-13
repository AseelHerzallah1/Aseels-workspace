"use client";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex animate-fade-up gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "btn-glow text-slate-950"
            : "bg-linear-to-br from-cyan-400/30 to-purple-500/30 text-brand ring-1 ring-white/10"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "whitespace-pre-wrap rounded-tr-sm btn-glow text-slate-950"
            : "glass-card rounded-tl-sm text-slate-800 dark:text-slate-200"
        }`}
      >
        {isUser ? (
          content
        ) : content ? (
          <div className="md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <span className="opacity-60">…</span>
        )}
      </div>
    </div>
  );
}
