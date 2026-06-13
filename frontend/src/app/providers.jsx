"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { initFontSize } from "@/lib/settings";

export default function Providers({ children }) {
  useEffect(() => {
    initFontSize();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
