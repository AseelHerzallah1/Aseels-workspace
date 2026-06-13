import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not set on the server.", { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const {
    messages = [],
    model = "llama-3.3-70b-versatile",
    temperature = 0.7,
    system = "You are a helpful assistant.",
  } = body;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Qwen 3 models emit chain-of-thought unless reasoning is turned off.
  const extra = model.startsWith("qwen") ? { reasoning_effort: "none" } : {};

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      temperature,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
      ...extra,
    });
  } catch (err) {
    return new Response(`Groq error: ${err?.message || "unknown error"}`, { status: 502 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices?.[0]?.delta?.content || "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\n[stream error: ${err?.message || "unknown"}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
