import { getConversationsCollection } from "@/lib/mongodb";

export const runtime = "nodejs";

// GET /api/conversations -> returns all saved conversations (newest first).
export async function GET() {
  const collection = await getConversationsCollection();
  if (!collection) {
    return Response.json(
      { error: "MongoDB is not configured. Set MONGODB_URI to enable." },
      { status: 501 }
    );
  }

  const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
  const conversations = docs.map(({ _id, ...rest }) => rest);
  return Response.json(conversations);
}

// POST /api/conversations -> replaces all conversations with the given array.
// Simple single-user strategy suitable for a portfolio demo.
export async function POST(req) {
  const collection = await getConversationsCollection();
  if (!collection) {
    return Response.json(
      { error: "MongoDB is not configured. Set MONGODB_URI to enable." },
      { status: 501 }
    );
  }

  let conversations;
  try {
    conversations = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(conversations)) {
    return Response.json({ error: "Expected an array of conversations." }, { status: 400 });
  }

  await collection.deleteMany({});
  if (conversations.length > 0) {
    const now = Date.now();
    await collection.insertMany(
      conversations.map((c) => ({ ...c, updatedAt: c.updatedAt ?? now }))
    );
  }

  return Response.json({ ok: true, count: conversations.length });
}
