// Persistence layer for conversations (signed-in users only).
// Public "Ask Aseel's Bot" does not persist chats.

const USE_MONGO = process.env.NEXT_PUBLIC_USE_MONGO === "true";

export function storageKeyForUser(userId) {
  if (!userId) return null;
  return `aseel-chats:user:${userId}`;
}

export async function loadConversations(userId) {
  if (!userId) return [];

  if (USE_MONGO) {
    try {
      const res = await fetch(`/api/conversations?userId=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch {
      // fall through
    }
    return [];
  }

  if (typeof window === "undefined") return [];
  const key = storageKeyForUser(userId);
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveConversations(userId, conversations) {
  if (!userId) return;

  if (USE_MONGO) {
    try {
      await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, conversations }),
      });
    } catch {
      // best effort
    }
    return;
  }

  if (typeof window === "undefined") return;
  const key = storageKeyForUser(userId);
  try {
    window.localStorage.setItem(key, JSON.stringify(conversations));
  } catch {
    // storage full or unavailable
  }
}
