/** Parse SSE blocks from a growing text buffer; returns leftover partial data. */
function consumeSseBuffer(buffer, onEvent) {
  let rest = buffer;
  let splitAt;
  while ((splitAt = rest.indexOf("\n\n")) !== -1) {
    const block = rest.slice(0, splitAt);
    rest = rest.slice(splitAt + 2);

    if (!block.trim() || block.startsWith(":")) continue;

    let eventType = "message";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) eventType = line.slice(6).trim();
      else if (line.startsWith("data:")) {
        data += (data ? "\n" : "") + line.slice(5).trimStart();
      }
    }
    if (data) onEvent(eventType, data);
  }
  return rest;
}

/** Stream a chat response over SSE (token-by-token). */
export async function streamChat({ url, body, onChunk, onSources, onError }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "Request failed");
    onError?.(errText);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = "";
  let acc = "";

  const handleEvent = (eventType, data) => {
    if (eventType === "sources") {
      try {
        onSources?.(JSON.parse(data));
      } catch {
        onSources?.([]);
      }
      return;
    }
    if (data === "[DONE]") return;

    let token = data;
    try {
      token = JSON.parse(data);
    } catch {
      /* plain text fallback */
    }
    if (typeof token === "string" && token) {
      acc += token;
      onChunk(acc);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });
    sseBuffer = consumeSseBuffer(sseBuffer, handleEvent);
  }

  if (sseBuffer.trim()) {
    consumeSseBuffer(`${sseBuffer}\n\n`, handleEvent);
  }

  return acc;
}
