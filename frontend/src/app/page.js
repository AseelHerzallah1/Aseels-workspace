"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PublicChat from "@/components/PublicChat";
import AssistantChat from "@/components/AssistantChat";
import { readAppView, saveAppView, consumeLoginRedirect } from "@/lib/viewMode";

export default function Home() {
  const { data: session, status } = useSession();
  const [appView, setAppView] = useState("public");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setAppView("public");
      setReady(true);
      return;
    }
    if (consumeLoginRedirect()) {
      saveAppView("workspace");
      setAppView("workspace");
    } else {
      setAppView(readAppView());
    }
    setReady(true);
  }, [session, status]);

  function goPublic() {
    saveAppView("public");
    setAppView("public");
  }

  function goWorkspace() {
    saveAppView("workspace");
    setAppView("workspace");
  }

  if (status === "loading" || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#15121f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (session && appView === "workspace") {
    return <AssistantChat session={session} onGoPublic={goPublic} />;
  }

  return (
    <PublicChat
      session={session ?? null}
      onGoWorkspace={session ? goWorkspace : undefined}
    />
  );
}
