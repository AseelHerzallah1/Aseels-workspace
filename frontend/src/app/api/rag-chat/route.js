/** Same-origin streaming proxy → Render FastAPI (avoids cross-origin stream buffering). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:8000";

  let body;
  try {
    body = await req.text();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(`${backend.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body,
      cache: "no-store",
    });
  } catch (err) {
    return new Response(`Backend unreachable: ${err?.message || "unknown error"}`, {
      status: 502,
    });
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "Chat request failed");
    return new Response(errText, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
