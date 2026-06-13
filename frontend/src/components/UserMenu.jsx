"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import SettingsModal from "./SettingsModal";
import UserAvatar from "./UserAvatar";
import { getDisplayName } from "@/lib/settings";

export default function UserMenu({
  session,
  uploadedFiles = [],
  onExportChats,
  onClearAllChats,
  compact = false,
}) {
  const user = session?.user || {};
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user.name || "User");
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setDisplayName(getDisplayName(user.name || "User"));
    function sync() {
      setDisplayName(getDisplayName(user.name || "User"));
    }
    window.addEventListener("aseel-settings-change", sync);
    return () => window.removeEventListener("aseel-settings-change", sync);
  }, [user.name]);

  useEffect(() => {
    if (!open) return;

    function positionMenu() {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }

    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e) {
      const target = e.target;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openSettings() {
    setOpen(false);
    setSettingsOpen(true);
  }

  function handleSignOut() {
    setOpen(false);
    signOut({ redirectTo: "/" });
  }

  const dropdown =
    open && menuStyle
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[500] w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12]/95 shadow-2xl backdrop-blur-xl"
            style={{ top: menuStyle.top, right: menuStyle.right }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <UserAvatar user={user} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-100">{displayName}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5"
              onClick={openSettings}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Account menu"
          aria-expanded={open}
          title={displayName}
          className={`flex items-center rounded-full glass-card transition hover:border-brand/40 ${
            compact ? "p-0.5" : "gap-2 py-1 pl-1 pr-2.5"
          }`}
        >
          <UserAvatar user={user} size={32} />
          {!compact && (
            <>
              <span className="hidden max-w-[110px] truncate text-sm font-medium text-slate-800 sm:inline dark:text-slate-100">
                {displayName}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>
      </div>

      {mounted && dropdown}

      {mounted && (
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          userEmail={user.email}
          uploadedFiles={uploadedFiles}
          onExportChats={onExportChats}
          onClearAllChats={() => {
            onClearAllChats?.();
            setSettingsOpen(false);
          }}
        />
      )}
    </>
  );
}
