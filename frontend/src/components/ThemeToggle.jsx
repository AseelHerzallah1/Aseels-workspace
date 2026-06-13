"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { applyTheme, getTheme } from "@/lib/settings";

export default function ThemeToggle({ embedded = false }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    function sync() {
      setDark(document.documentElement.classList.contains("dark"));
    }
    sync();
    window.addEventListener("aseel-settings-change", sync);
    return () => window.removeEventListener("aseel-settings-change", sync);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title={`Theme: ${getTheme()}`}
      className={
        embedded
          ? "glass-card flex h-10 w-10 items-center justify-center rounded-full text-brand transition hover:border-brand/40"
          : "glass-card fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-brand transition hover:border-brand/40"
      }
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
