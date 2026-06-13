"use client";

import { useState } from "react";
import {
  Plus,
  MessageCircle,
  X,
  MoreVertical,
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronRight,
  Trash2,
  PanelLeftClose,
  Globe,
} from "lucide-react";
import HeroMark from "./HeroMark";
import { APP_NAME, ASSISTANT_NAME, HERO_MARK_VARIANT } from "@/lib/constants";

export default function Sidebar({
  variant = "assistant",
  conversations,
  currentId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onArchiveChat,
  onGoPublic,
  onClose,
  isOpen,
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const activeChats = conversations.filter((c) => !c.archived);
  const archivedChats = conversations.filter((c) => c.archived);

  function renderRow(c) {
    const active = c.id === currentId;
    const isArchived = !!c.archived;
    return (
      <div key={c.id} className="group relative">
        <button
          onClick={() => onSelectChat(c.id)}
          className={`flex w-full items-center gap-2 rounded-xl py-2 pl-3 pr-8 text-left text-sm transition ${
            active
              ? "bg-brand/15 text-brand"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-200"
          }`}
        >
          <MessageCircle size={15} className="shrink-0" />
          <span className="truncate">{c.title || "New Chat"}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(openMenuId === c.id ? null : c.id);
          }}
          aria-label="Chat options"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white/10"
        >
          <MoreVertical size={15} />
        </button>

        {openMenuId === c.id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-1.5 top-9 z-50 w-36 overflow-hidden rounded-lg glass-card py-1 text-sm shadow-lg"
          >
            <button
              onClick={() => {
                onArchiveChat(c.id, !isArchived);
                setOpenMenuId(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            >
              {isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
              {isArchived ? "Unarchive" : "Archive"}
            </button>
            <button
              onClick={() => {
                onDeleteChat(c.id);
                setOpenMenuId(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col gap-3 border-r border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl transition-transform duration-300 dark:border-white/5 dark:bg-[#050508]/95 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {openMenuId && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} aria-hidden="true" />
      )}

      <div className="flex items-center gap-2 px-1">
        <HeroMark size={36} interactive={false} variant={HERO_MARK_VARIANT} />
        <div className="min-w-0 leading-tight">
          <div className="truncate font-bold text-slate-900 dark:text-slate-100">
            {variant === "assistant" ? ASSISTANT_NAME : APP_NAME}
          </div>
          <div className="truncate text-xs text-slate-400">
            {variant === "assistant" ? "Private workspace" : "Grounded in verified info"}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-white/5 md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-xl btn-glow px-4 py-2.5 text-sm font-medium"
      >
        <Plus size={17} /> New Chat
      </button>

      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-1 text-[0.65rem] font-bold tracking-wider text-slate-500">RECENT CHATS</div>
        {activeChats.length === 0 ? (
          <p className="px-1 text-sm text-slate-500">No chats yet.</p>
        ) : (
          activeChats.map(renderRow)
        )}

        {archivedChats.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowArchived((s) => !s)}
              className="flex w-full items-center gap-1 px-1 py-1 text-[0.65rem] font-bold tracking-wider text-slate-500 hover:text-brand"
            >
              {showArchived ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              ARCHIVED ({archivedChats.length})
            </button>
            {showArchived && <div className="space-y-1">{archivedChats.map(renderRow)}</div>}
          </div>
        )}
      </div>

      {onGoPublic && (
        <button
          type="button"
          onClick={onGoPublic}
          className="flex w-full items-center gap-2 rounded-xl glass-card px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand/40 hover:text-brand dark:text-slate-300"
        >
          <Globe size={16} />
          Public portfolio
        </button>
      )}

      <button
        onClick={onClose}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
      >
        <PanelLeftClose size={16} />
        Collapse
      </button>
    </aside>
  );
}
