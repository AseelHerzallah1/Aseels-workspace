"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PublicChat from "@/components/PublicChat";
import AssistantChat from "@/components/AssistantChat";
import { readAppView, saveAppView, consumeLoginRedirect } from "@/lib/viewMode";

export default function Home() {
  const { data: session, status } = useSession();
  const [appView, setAppView] = useState("public");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setAppView("public");
      return;
    }
    if (consumeLoginRedirect()) {
      saveAppView("workspace");
      setAppView("workspace");
    } else {
      setAppView(readAppView());
    }
  }, [session, status]);

  function goPublic() {
    saveAppView("public");
    setAppView("public");
  }

  function goWorkspace() {
    saveAppView("workspace");
    setAppView("workspace");
  }

  // Don't block the whole page on auth — mobile networks can take several seconds
  // for /api/auth/session. Show the public chat immediately; sign-in updates in place.
  if (status === "loading" || !session || appView === "public") {
    return (
      <PublicChat
        session={session ?? null}
        onGoWorkspace={session ? goWorkspace : undefined}
      />
    );
  }

  return <AssistantChat session={session} onGoPublic={goPublic} />;
}
