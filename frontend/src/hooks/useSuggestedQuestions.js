"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initVisibleStarters, initVisibleStartersExcluding, replaceStarter } from "@/lib/suggestedQuestions";

/** Rotating suggested questions — show 4, replace on pick, reset when poolKey changes. */
export function useSuggestedQuestions(poolKey, pool) {
  const poolRef = useRef(pool);
  poolRef.current = pool;

  const sessionUsed = useRef(new Set());
  const [visible, setVisible] = useState(() => initVisibleStarters(pool));

  useEffect(() => {
    sessionUsed.current = new Set();
    setVisible(initVisibleStarters(poolRef.current));
  }, [poolKey]);

  const reset = useCallback(() => {
    sessionUsed.current = new Set();
    setVisible(initVisibleStarters(poolRef.current));
  }, []);

  const pick = useCallback((text, send) => {
    const currentPool = poolRef.current;
    sessionUsed.current.add(text);
    setVisible((current) => {
      const inBar = current.some((s) => s.text === text);
      if (inBar) {
        return replaceStarter(current, currentPool, text, sessionUsed.current);
      }
      return initVisibleStartersExcluding(currentPool, sessionUsed.current);
    });
    send(text);
  }, []);

  return { visibleStarters: visible, pickStarter: pick, resetStarters: reset };
}
