"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { RESPONSE_STYLES } from "@/lib/constants";
import {
  getDisplayName,
  setDisplayName,
  getTheme,
  applyTheme,
  getFontSize,
  applyFontSize,
  getDefaultStyle,
  setDefaultStyle,
} from "@/lib/settings";

const TABS = [
  { id: "general", label: "General" },
  { id: "workspace", label: "Workspace" },
  { id: "data", label: "Data & Export" },
];

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#2a2440] dark:text-[#ECEAF5]">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#2a2440] outline-none focus:border-brand dark:border-white/10 dark:bg-white/5 dark:text-[#ECEAF5]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="flex rounded-xl border border-black/10 p-1 dark:border-white/10">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-[#46406a] hover:bg-black/5 dark:text-[#c8c2e0] dark:hover:bg-white/5"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsModal({
  open,
  onClose,
  userEmail,
  uploadedFiles = [],
  onExportChats,
  onClearAllChats,
}) {
  const [tab, setTab] = useState("general");
  const [name, setName] = useState("User");
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState("md");
  const [defaultStyle, setDefaultStyleState] = useState("plain");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setName(getDisplayName("User"));
    setTheme(getTheme());
    setFontSize(getFontSize());
    setDefaultStyleState(getDefaultStyle());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  function saveName(value) {
    setName(value);
    setDisplayName(value);
  }

  function saveTheme(value) {
    setTheme(value);
    applyTheme(value);
  }

  function saveFontSize(value) {
    setFontSize(value);
    applyFontSize(value);
  }

  function saveDefaultStyle(value) {
    setDefaultStyleState(value);
    setDefaultStyle(value);
  }

  const modal = (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="relative flex h-[min(520px,90vh)] w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1628]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-[#8a82a6] transition hover:bg-black/5 dark:text-[#a79fc7] dark:hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <aside className="w-44 shrink-0 border-r border-black/5 bg-[#f8f7ff] p-4 dark:border-white/5 dark:bg-[#14111f]">
          <h2 id="settings-title" className="mb-4 text-lg font-semibold text-[#2a2440] dark:text-[#ECEAF5]">
            Settings
          </h2>
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  tab === t.id
                    ? "bg-brand/15 font-medium text-brand dark:bg-brand/20 dark:text-brand-light"
                    : "text-[#46406a] hover:bg-black/5 dark:text-[#c8c2e0] dark:hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 overflow-y-auto p-6 pt-12">
          {tab === "general" && (
            <div className="space-y-5">
              <Field label="Your name">
                <input
                  value={name}
                  onChange={(e) => saveName(e.target.value)}
                  placeholder="User"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand dark:border-white/10 dark:bg-white/5 dark:text-[#ECEAF5]"
                />
              </Field>

              <Field label="Email">
                <input
                  value={userEmail || ""}
                  readOnly
                  className="w-full rounded-xl border border-black/10 bg-[#f8f7ff] px-3 py-2.5 text-sm text-[#6f6790] dark:border-white/10 dark:bg-white/5 dark:text-[#a79fc7]"
                />
              </Field>

              <Field label="Theme">
                <Select
                  value={theme}
                  onChange={saveTheme}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ]}
                />
              </Field>

              <Field label="Font size">
                <Segmented
                  value={fontSize}
                  onChange={saveFontSize}
                  options={[
                    { value: "sm", label: "Small" },
                    { value: "md", label: "Medium" },
                    { value: "lg", label: "Large" },
                  ]}
                />
              </Field>
            </div>
          )}

          {tab === "workspace" && (
            <div className="space-y-5">
              <Field label="Default response style">
                <Select
                  value={defaultStyle}
                  onChange={saveDefaultStyle}
                  options={RESPONSE_STYLES.map((s) => ({
                    value: s.value,
                    label: `${s.icon} ${s.label} — ${s.hint}`,
                  }))}
                />
                <p className="text-xs text-[#9a93b5] dark:text-[#6f6790]">
                  Applied when you start a new chat. You can still change it per message below.
                </p>
              </Field>

              <Field label="Uploaded documents">
                {uploadedFiles.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-black/10 px-3 py-4 text-sm text-[#9a93b5] dark:border-white/10 dark:text-[#6f6790]">
                    No files yet. Use 📎 in the chat bar to upload .md or .txt files.
                  </p>
                ) : (
                  <ul className="rounded-xl border border-black/10 dark:border-white/10">
                    {uploadedFiles.map((f) => (
                      <li
                        key={f}
                        className="border-b border-black/5 px-3 py-2 text-sm last:border-0 dark:border-white/5 dark:text-[#ECEAF5]"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            </div>
          )}

          {tab === "data" && (
            <div className="space-y-5">
              <Field label="Export chat history">
                <p className="text-xs text-[#9a93b5] dark:text-[#6f6790]">
                  Download all saved conversations as JSON.
                </p>
                <button
                  type="button"
                  onClick={onExportChats}
                  className="mt-2 rounded-xl border border-brand/30 px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/10 dark:text-brand-light"
                >
                  Export chats
                </button>
              </Field>

              <Field label="Clear all chats">
                <p className="text-xs text-[#9a93b5] dark:text-[#6f6790]">
                  Permanently delete every saved conversation for this account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete all saved chats? This cannot be undone.")) {
                      onClearAllChats?.();
                    }
                  }}
                  className="mt-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                >
                  Clear all chats
                </button>
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
