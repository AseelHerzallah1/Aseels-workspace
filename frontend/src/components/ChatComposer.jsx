"use client";

import StylePicker from "@/components/StylePicker";
import ChatPrompt from "@/components/ChatPrompt";

/** Footer: optional mode tabs, then one box with tone + prompt. */
export default function ChatComposer({
  style,
  onStyleChange,
  showTone = true,
  modeSlot = null,
  promptProps,
}) {
  return (
    <div className="app-footer px-4 py-2.5">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        {modeSlot}
        <div className="glass-card overflow-hidden rounded-xl shadow-sm">
          {showTone && <StylePicker value={style} onChange={onStyleChange} />}
          <ChatPrompt embedded {...promptProps} />
        </div>
      </div>
    </div>
  );
}
