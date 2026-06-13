import { MongoClient } from "mongodb";

// Reuse a single MongoClient across hot reloads in development to avoid
// exhausting connections. Returns null if no MONGODB_URI is configured.
let clientPromise = null;

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!clientPromise) {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        global._mongoClientPromise = new MongoClient(uri).connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      clientPromise = new MongoClient(uri).connect();
    }
  }
  return clientPromise;
}

export async function getConversationsCollection() {
  const promise = getMongoClient();
  if (!promise) return null;
  const client = await promise;
  const dbName = process.env.MONGODB_DB || "aseel_chatbot";
  return client.db(dbName).collection("conversations");
}
