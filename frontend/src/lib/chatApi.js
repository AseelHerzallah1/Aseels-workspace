/** Stream a chat response and parse RAG source metadata from response headers. */
export async function streamChat({ url, body, onChunk, onSources, onError }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "Request failed");
    onError?.(errText);
    return;
  }

  const rawSources = res.headers.get("X-RAG-Sources");
  if (rawSources) {
    try {
      onSources?.(JSON.parse(rawSources));
    } catch {
      onSources?.([]);
    }
  } else {
    onSources?.([]);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    onChunk(acc);
  }
  return acc;
}
