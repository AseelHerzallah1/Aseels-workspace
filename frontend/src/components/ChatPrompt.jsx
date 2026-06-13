"use client";

import { useRef } from "react";
import { Paperclip, ArrowUp, Loader2 } from "lucide-react";

export default function ChatPrompt({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Ask me anything...",
  disabled = false,
  uploading = false,
  uploadedFiles = [],
  onUpload,
  accept = ".md,.txt",
  embedded = false,
}) {
  const fileInputRef = useRef(null);

  const form = (
    <form
      onSubmit={onSubmit}
      className={`flex items-end gap-0 overflow-hidden ${
        embedded ? "" : "glass-card rounded-2xl shadow-sm focus-within:border-brand/50"
      }`}
    >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onUpload}
        />
        {onUpload && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            aria-label="Upload document"
            className="flex h-12 w-11 shrink-0 items-center justify-center text-slate-400 transition hover:text-brand disabled:opacity-40"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
          </button>
        )}

        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          className={`max-h-36 flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            embedded ? "min-h-[38px] py-2" : "min-h-[48px] py-3.5"
          } ${onUpload ? "" : embedded ? "pl-3" : "pl-4"}`}
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className={`btn-glow shrink-0 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40 ${
            embedded ? "m-1 flex h-8 w-8" : "m-1.5 flex h-9 w-9 rounded-xl"
          }`}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </form>
  );

  if (embedded) {
    return (
      <>
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-white/[0.06] px-3 py-1.5">
            {uploadedFiles.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-slate-400"
              >
                <Paperclip size={11} className="shrink-0 opacity-60" />
                {name}
              </span>
            ))}
          </div>
        )}
        {form}
        <p className="px-3 pb-1.5 pt-0.5 text-center text-[0.55rem] text-slate-500">
          ↵ to send · Shift + ↵ for new line
          {onUpload ? " · .md / .txt for RAG" : ""}
        </p>
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {uploadedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5 px-1">
          {uploadedFiles.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full glass-card px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300"
            >
              <Paperclip size={11} className="shrink-0 opacity-60" />
              {name}
            </span>
          ))}
        </div>
      )}

      {form}

      <p className="mt-1.5 text-center text-[0.65rem] text-slate-500">
        ↵ to send · Shift + ↵ for new line
        {onUpload ? " · .md / .txt for RAG" : ""}
      </p>
    </div>
  );
}
